/* Times Tables Rock — a fast-paced multiplication & division game (inspired by
   the rock-band style of practice). Answer as many as you can before the timer
   runs out; your average answer speed earns a "rock status". 100% offline.
   Mounted with TablesRock.mount(el). Best scores saved in localStorage. */
window.TablesRock = (function () {
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function get(k, d) { var v = +localStorage.getItem(k); return isNaN(v) || !localStorage.getItem(k) ? d : v; }

  // rock-status tiers by average seconds per correct answer (faster = higher)
  var TIERS = [
    { t: 1.5, n: "Rock Hero", e: "🤘" }, { t: 2.5, n: "Rock Legend", e: "🌟" },
    { t: 3.5, n: "Headliner", e: "🎤" }, { t: 5, n: "Rising Star", e: "🎸" },
    { t: 7, n: "Garage Rocker", e: "🥁" }, { t: 1e9, n: "Wannabe", e: "🎵" }
  ];
  function statusFor(avg) { for (var i = 0; i < TIERS.length; i++) if (avg <= TIERS[i].t) return TIERS[i]; return TIERS[TIERS.length - 1]; }

  function mount(el) {
    var cfg = { op: "x", tables: [2, 3, 4, 5, 10], secs: 60 };
    var DUR = cfg.secs;
    var game = null, tickH = null;

    function setup() {
      if (tickH) { clearInterval(tickH); tickH = null; }
      var best = get("tt-best", 0), coins = get("tt-coins", 0);
      var tabs = ""; for (var n = 2; n <= 12; n++) tabs += '<button class="tt-tab' + (cfg.tables.indexOf(n) >= 0 ? " on" : "") + '" data-n="' + n + '">' + n + "×</button>";
      el.innerHTML = '<div class="tt game-card setup">' +
        '<div class="tt-banner">🎸 <b>Times Tables Rock</b> 🥁<div class="tt-sub">How fast can you rock the tables?</div></div>' +
        '<div class="tt-row"><span class="tt-lbl">Play with</span><div class="tt-ops">' +
          '<button class="tt-op' + (cfg.op === "x" ? " on" : "") + '" data-op="x">✖️ Multiply</button>' +
          '<button class="tt-op' + (cfg.op === "d" ? " on" : "") + '" data-op="d">➗ Divide</button>' +
          '<button class="tt-op' + (cfg.op === "m" ? " on" : "") + '" data-op="m">🎲 Mixed</button></div></div>' +
        '<div class="tt-row"><span class="tt-lbl">Tables</span><div class="tt-tabs">' + tabs + "</div></div>" +
        '<div class="tt-row"><span class="tt-lbl">Quick pick</span><div class="tt-tabs">' +
          '<button class="tt-tab" data-set="easy">2–5</button><button class="tt-tab" data-set="up">2–9</button><button class="tt-tab" data-set="all">2–12</button></div></div>' +
        '<div class="tt-row"><span class="tt-lbl">Time</span><div class="tt-ops">' +
          [30, 60, 90].map(function (s) { return '<button class="tt-op' + (cfg.secs === s ? " on" : "") + '" data-secs="' + s + '">' + s + "s</button>"; }).join("") + "</div></div>" +
        '<div class="tt-stats"><span>🏆 Best: <b>' + best + '</b></span><span>🪙 Coins: <b>' + coins + "</b></span></div>" +
        '<button class="tt-start" ' + (cfg.tables.length ? "" : "disabled") + '>▶️ Start the gig!</button>' +
        (cfg.tables.length ? "" : '<div class="tt-warn">Pick at least one table.</div>') + "</div>";
      el.querySelectorAll(".tt-op[data-op]").forEach(function (b) { b.onclick = function () { cfg.op = b.dataset.op; setup(); }; });
      el.querySelectorAll(".tt-op[data-secs]").forEach(function (b) { b.onclick = function () { cfg.secs = +b.dataset.secs; setup(); }; });
      el.querySelectorAll(".tt-tab[data-n]").forEach(function (b) { b.onclick = function () { var n = +b.dataset.n, i = cfg.tables.indexOf(n); if (i >= 0) cfg.tables.splice(i, 1); else cfg.tables.push(n); setup(); }; });
      el.querySelectorAll(".tt-tab[data-set]").forEach(function (b) { b.onclick = function () { var s = b.dataset.set; cfg.tables = s === "easy" ? [2, 3, 4, 5] : s === "up" ? [2, 3, 4, 5, 6, 7, 8, 9] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; setup(); }; });
      var sb = el.querySelector(".tt-start"); if (sb) sb.onclick = start;
      document.onkeydown = null;
    }

    function newQ() {
      var op = cfg.op === "m" ? (rnd(2) ? "x" : "d") : cfg.op;
      var a = cfg.tables[rnd(cfg.tables.length)], b = 2 + rnd(11); // b in 2..12
      if (op === "x") return { text: a + " × " + b, ans: a * b };
      return { text: (a * b) + " ÷ " + a, ans: b }; // whole-number division
    }

    function start() {
      DUR = cfg.secs;
      game = { score: 0, attempts: 0, correct: 0, streak: 0, bestStreak: 0, left: DUR, q: newQ(), input: "", flash: "", done: false };
      play();
      tickH = setInterval(function () {
        game.left--; if (game.left <= 0) { game.left = 0; finish(); } else paintTimer();
      }, 1000);
    }

    function paintTimer() {
      var bar = el.querySelector(".tt-bar > i"), t = el.querySelector(".tt-time");
      if (bar) bar.style.width = (game.left / DUR * 100) + "%";
      if (t) t.textContent = game.left + "s";
    }

    function submit() {
      if (game.done) return;
      var val = game.input;
      if (val === "") return;
      game.attempts++;
      if (+val === game.q.ans) {
        game.correct++; game.score += 10 + Math.min(game.streak, 10); game.streak++; game.bestStreak = Math.max(game.bestStreak, game.streak);
        game.flash = "ok"; game.q = newQ(); game.input = "";
      } else {
        game.streak = 0; game.flash = "no:" + game.q.ans; game.input = "";
      }
      play();
      var c = el.querySelector(".tt-q"); if (c) { c.classList.add(game.flash === "ok" ? "good" : "bad"); }
    }

    function play() {
      var f = game.flash;
      el.innerHTML = '<div class="tt game-card">' +
        '<div class="tt-hud"><span class="tt-time">' + game.left + 's</span><span>⭐ ' + game.score + '</span><span>🔥 ' + game.streak + "</span></div>" +
        '<div class="tt-bar"><i style="width:' + (game.left / DUR * 100) + '%"></i></div>' +
        '<div class="tt-q' + (f === "ok" ? " good" : (f && f.indexOf("no") === 0 ? " bad" : "")) + '">' +
          (f && f.indexOf("no") === 0 ? '<div class="tt-corr">❌ Answer: <b>' + f.split(":")[1] + "</b></div>" : "") +
          '<span class="tt-prompt">' + esc(game.q.text) + ' = </span><span class="tt-ans">' + (game.input || "?") + "</span></div>" +
        '<div class="tt-pad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✓"].map(function (k) {
          return '<button class="tt-key' + (k === "✓" ? " go" : k === "⌫" ? " del" : "") + '" data-k="' + k + '">' + k + "</button>";
        }).join("") + "</div>" +
        '<div class="g-controls"><button class="wbtn ghost" data-stop="1">⏹ End game</button></div></div>';
      el.querySelectorAll(".tt-key").forEach(function (b) {
        b.onclick = function () {
          var k = b.dataset.k;
          if (k === "✓") return submit();
          if (k === "⌫") { game.input = game.input.slice(0, -1); return refreshAns(); }
          if (game.input.length < 4) { game.input += k; refreshAns(); }
        };
      });
      var sp = el.querySelector("[data-stop]"); if (sp) sp.onclick = finish;
      document.onkeydown = function (e) {
        if (!el.isConnected || game.done) return;
        if (/^[0-9]$/.test(e.key)) { if (game.input.length < 4) { game.input += e.key; refreshAns(); } }
        else if (e.key === "Backspace") { game.input = game.input.slice(0, -1); refreshAns(); }
        else if (e.key === "Enter") submit();
      };
    }
    function refreshAns() { var a = el.querySelector(".tt-ans"); if (a) a.textContent = game.input || "?"; }

    function finish() {
      if (game.done) return; game.done = true;
      if (tickH) { clearInterval(tickH); tickH = null; }
      document.onkeydown = null;
      var avg = game.correct ? (DUR / game.correct) : 99;
      var acc = game.attempts ? Math.round(game.correct / game.attempts * 100) : 0;
      var status = statusFor(avg);
      var best = get("tt-best", 0), isBest = game.score > best;
      if (isBest) localStorage.setItem("tt-best", game.score);
      var coins = get("tt-coins", 0) + game.correct; localStorage.setItem("tt-coins", coins);
      el.innerHTML = '<div class="tt game-card result">' +
        '<div class="tt-status">' + status.e + '<div class="tt-statn">' + esc(status.n) + "</div></div>" +
        (isBest ? '<div class="tt-new">🏆 New best score!</div>' : "") +
        '<div class="tt-final"><div><b>' + game.score + '</b><span>score</span></div>' +
          '<div><b>' + game.correct + '</b><span>correct</span></div>' +
          '<div><b>' + acc + '%</b><span>accuracy</span></div>' +
          '<div><b>🔥 ' + game.bestStreak + '</b><span>best streak</span></div></div>' +
        '<div class="tt-coins">🪙 +' + game.correct + ' coins  (total ' + coins + ")</div>" +
        '<div class="g-controls"><button class="tt-start" data-again="1">▶️ Play again</button> <button class="wbtn ghost" data-setup="1">⚙️ Change settings</button></div></div>';
      var a = el.querySelector("[data-again]"); if (a) a.onclick = start;
      var s = el.querySelector("[data-setup]"); if (s) s.onclick = setup;
    }

    setup();
  }
  return { mount: mount };
})();
