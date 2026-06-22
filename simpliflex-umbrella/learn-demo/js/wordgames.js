/* Word games — Hangman, Word Scramble, Word Builder (Scrabble-style) and Word
   Search. 100% offline: validates words against window.WORDLIST.DICT (a bundled
   common-words list) and draws puzzle words from window.WORDLIST.THEMES. Each
   game is mounted with WordGames.mount(el, name). */
window.WordGames = (function () {
  var WL = window.WORDLIST || { DICT: [], THEMES: {} };
  var DICTSET = null;
  function dict() { if (!DICTSET) { DICTSET = Object.create(null); WL.DICT.forEach(function (w) { DICTSET[w] = 1; }); } return DICTSET; }
  function isWord(w) { return !!dict()[String(w || "").toLowerCase()]; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function themes() { return Object.keys(WL.THEMES); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function on(el, sel, fn) { Array.prototype.forEach.call(el.querySelectorAll(sel), function (b) { b.onclick = function () { fn(b); }; }); }

  /* ----------------------------- HANGMAN ----------------------------- */
  function hangman(el) {
    var st;
    function fresh() {
      var th = pick(themes());
      st = { theme: th, word: pick(WL.THEMES[th]).toUpperCase(), guessed: [], lives: 6, done: false, won: false };
      render();
    }
    function masked() { return st.word.split("").map(function (c) { return st.guessed.indexOf(c) >= 0 ? c : "_"; }); }
    function guess(c) {
      if (st.done || st.guessed.indexOf(c) >= 0) return;
      st.guessed.push(c);
      if (st.word.indexOf(c) < 0) { st.lives--; if (st.lives <= 0) { st.done = true; st.won = false; } }
      else if (masked().indexOf("_") < 0) { st.done = true; st.won = true; }
      render();
    }
    function render() {
      var hearts = ""; for (var i = 0; i < 6; i++) hearts += i < st.lives ? "❤️" : "🤍";
      var keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (c) {
        var used = st.guessed.indexOf(c) >= 0, wrong = used && st.word.indexOf(c) < 0;
        return '<button class="hg-key' + (used ? (wrong ? " wrong" : " right") : "") + '" data-k="' + c + '"' + ((used || st.done) ? " disabled" : "") + ">" + c + "</button>";
      }).join("");
      var slots = masked().map(function (c) { return '<span class="hg-slot' + (c !== "_" ? " filled" : "") + '">' + (c === "_" ? "" : c) + "</span>"; }).join("");
      var msg = "";
      if (st.done) msg = st.won ? '<div class="g-msg win">🎉 You got it! The word was <b>' + esc(st.word) + "</b></div>"
                                : '<div class="g-msg lose">💪 So close! The word was <b>' + esc(st.word) + "</b></div>";
      el.innerHTML = '<div class="hg game-card">' +
        '<div class="hg-top"><span class="g-tag">🏷️ ' + esc(st.theme) + '</span><span class="hg-lives">' + hearts + "</span></div>" +
        '<div class="hg-word">' + slots + "</div>" + msg +
        '<div class="hg-keys">' + keys + "</div>" +
        '<div class="g-controls"><button class="wbtn" data-new="1">🔄 New word</button></div></div>';
      on(el, ".hg-key", function (b) { guess(b.dataset.k); });
      on(el, "[data-new]", fresh);
      // physical keyboard
      el.onkeyup = null;
    }
    document.onkeydown = function (e) { if (el.isConnected && /^[a-zA-Z]$/.test(e.key)) guess(e.key.toUpperCase()); };
    fresh();
  }

  /* --------------------------- WORD SCRAMBLE -------------------------- */
  function scramble(el) {
    var st;
    function fresh() {
      var th = pick(themes()), w = pick(WL.THEMES[th]).toUpperCase(), j;
      do { j = shuffle(w.split("")).join(""); } while (j === w && w.length > 1);
      st = { theme: th, word: w, jumble: j, revealed: 0, done: false, msg: "" };
      render(true);
    }
    function check(val) {
      if (st.done) return;
      if (String(val || "").trim().toUpperCase() === st.word) {
        st.done = true; st.msg = '<div class="g-msg win">🎉 Correct! It was <b>' + esc(st.word) + "</b></div>";
        var s = +(localStorage.getItem("wg-scramble-streak") || 0) + 1; localStorage.setItem("wg-scramble-streak", s);
      } else { st.msg = '<div class="g-msg lose">❌ Not quite — try again!</div>'; localStorage.setItem("wg-scramble-streak", 0); }
      render(false);
    }
    function render(focus) {
      var streak = +(localStorage.getItem("wg-scramble-streak") || 0);
      var hint = st.word.slice(0, st.revealed) + "·".repeat(Math.max(0, st.word.length - st.revealed));
      el.innerHTML = '<div class="sc game-card">' +
        '<div class="g-top"><span class="g-tag">🏷️ ' + esc(st.theme) + '</span><span class="g-stat">🔥 Streak ' + streak + "</span></div>" +
        '<p class="sc-help">Unscramble the letters to find the hidden word:</p>' +
        '<div class="sc-jumble">' + st.jumble.split("").map(function (c) { return '<span class="sc-tile">' + c + "</span>"; }).join("") + "</div>" +
        (st.revealed ? '<div class="sc-hint">Hint: ' + esc(hint) + "</div>" : "") + (st.msg || "") +
        '<form class="sc-form"><input id="sc-in" type="text" autocomplete="off" placeholder="Type the word…" ' + (st.done ? "disabled" : "") + "><button class=\"wbtn\" type=\"submit\">Check ✓</button></form>" +
        '<div class="g-controls">' + (st.done ? "" : '<button class="wbtn ghost" data-hint="1">💡 Hint</button> ') + '<button class="wbtn" data-new="1">🔄 New word</button></div></div>';
      var f = el.querySelector(".sc-form"), inp = el.querySelector("#sc-in");
      f.onsubmit = function (e) { e.preventDefault(); check(inp.value); };
      on(el, "[data-hint]", function () { if (st.revealed < st.word.length - 1) st.revealed++; render(true); });
      on(el, "[data-new]", fresh);
      if (focus && inp) try { inp.focus(); } catch (e) {}
    }
    document.onkeydown = null;
    fresh();
  }

  /* ------------------- WORD BUILDER (Scrabble-style) ----------------- */
  var VAL = { A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, T: 1, R: 1, D: 2, G: 2, B: 3, C: 3, M: 3, P: 3, F: 4, H: 4, V: 4, W: 4, Y: 4, K: 5, J: 8, X: 8, Q: 10, Z: 10 };
  var FREQ = { A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1, K: 1, L: 4, M: 2, N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1 };
  var BAG = (function () { var b = []; for (var k in FREQ) for (var i = 0; i < FREQ[k]; i++) b.push(k); return b; })();
  var VOWELS = "AEIOU";
  function drawRack() {
    var rack, tries = 0;
    do { rack = []; for (var i = 0; i < 7; i++) rack.push(pick(BAG)); tries++; }
    while (rack.filter(function (c) { return VOWELS.indexOf(c) >= 0; }).length < 2 && tries < 30);
    return rack;
  }
  function builder(el) {
    var st;
    function fresh() { st = { rack: drawRack(), sel: [], found: [], score: 0, msg: "" }; render(); }
    function wordOf() { return st.sel.map(function (i) { return st.rack[i]; }).join(""); }
    function scoreOf(w) { var s = 0; for (var i = 0; i < w.length; i++) s += VAL[w[i]] || 0; if (w.length === 7) s += 50; return s; }
    function submit() {
      var w = wordOf();
      if (w.length < 2) { st.msg = '<span class="lose">Pick at least 2 tiles.</span>'; return render(); }
      if (st.found.indexOf(w) >= 0) { st.msg = '<span class="lose">Already found “' + esc(w) + '”.</span>'; st.sel = []; return render(); }
      if (!isWord(w)) { st.msg = '<span class="lose">❌ “' + esc(w) + '” isn’t in the word list.</span>'; st.sel = []; return render(); }
      var pts = scoreOf(w); st.score += pts; st.found.unshift(w);
      st.msg = '<span class="win">✅ ' + esc(w) + ' +' + pts + (w.length === 7 ? " (BINGO! +50)" : "") + "</span>"; st.sel = []; render();
    }
    function render() {
      var cur = wordOf(), preview = cur.length >= 2 ? scoreOf(cur) : 0;
      var tiles = st.rack.map(function (c, i) {
        var usedAt = st.sel.indexOf(i);
        return '<button class="wb-tile' + (usedAt >= 0 ? " used" : "") + '" data-i="' + i + '"' + (usedAt >= 0 ? " disabled" : "") + "><span class=\"wb-l\">" + c + "</span><span class=\"wb-v\">" + (VAL[c] || 0) + "</span></button>";
      }).join("");
      var tray = st.sel.length ? st.sel.map(function (i, k) { return '<button class="wb-slot" data-k="' + k + '">' + st.rack[i] + "</button>"; }).join("") : '<span class="wb-empty">tap tiles to build a word…</span>';
      el.innerHTML = '<div class="wb game-card">' +
        '<div class="g-top"><span class="g-tag">🧩 Word Builder</span><span class="g-stat">⭐ Score ' + st.score + "</span></div>" +
        '<p class="sc-help">Make the highest-scoring real word from your 7 tiles. Use all 7 for a 50-point <b>BINGO</b>!</p>' +
        '<div class="wb-tray">' + tray + "</div>" +
        '<div class="wb-preview">' + (cur.length >= 2 ? "“" + esc(cur) + "” = <b>" + preview + "</b> pts" : "&nbsp;") + "</div>" +
        '<div class="wb-rack">' + tiles + "</div>" +
        '<div class="g-controls"><button class="wbtn" data-go="1">Submit ✓</button> <button class="wbtn ghost" data-back="1">⌫ Undo</button> <button class="wbtn ghost" data-clr="1">Clear</button> <button class="wbtn ghost" data-shuf="1">🔀 Shuffle</button> <button class="wbtn" data-new="1">🔄 New tiles</button></div>' +
        (st.msg ? '<div class="g-msg">' + st.msg + "</div>" : "") +
        (st.found.length ? '<div class="wb-found"><b>Words found:</b> ' + st.found.map(function (w) { return '<span class="wb-fw">' + esc(w) + " <i>" + scoreOf(w) + "</i></span>"; }).join("") + "</div>" : "") +
        "</div>";
      on(el, ".wb-tile", function (b) { st.sel.push(+b.dataset.i); st.msg = ""; render(); });
      on(el, ".wb-slot", function (b) { st.sel.splice(+b.dataset.k, 1); render(); });
      on(el, "[data-go]", submit);
      on(el, "[data-back]", function () { st.sel.pop(); render(); });
      on(el, "[data-clr]", function () { st.sel = []; render(); });
      on(el, "[data-shuf]", function () { st.rack = shuffle(st.rack); st.sel = []; render(); });
      on(el, "[data-new]", fresh);
    }
    document.onkeydown = null;
    fresh();
  }

  /* ---------------------------- WORD SEARCH --------------------------- */
  var DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
  function buildSearch(N) {
    var th = pick(themes());
    var cand = shuffle(WL.THEMES[th].filter(function (w) { return w.length <= N; }).map(function (w) { return w.toUpperCase(); }));
    var grid = []; for (var r = 0; r < N; r++) { grid[r] = []; for (var c = 0; c < N; c++) grid[r][c] = ""; }
    var placed = [];
    function fits(w, r, c, d) {
      for (var i = 0; i < w.length; i++) {
        var rr = r + d[0] * i, cc = c + d[1] * i;
        if (rr < 0 || cc < 0 || rr >= N || cc >= N) return false;
        if (grid[rr][cc] && grid[rr][cc] !== w[i]) return false;
      }
      return true;
    }
    for (var wi = 0; wi < cand.length && placed.length < 7; wi++) {
      var w = cand[wi], done = false;
      for (var t = 0; t < 120 && !done; t++) {
        var d = pick(DIRS), r = rnd(N), c = rnd(N);
        if (fits(w, r, c, d)) {
          var cells = [];
          for (var i = 0; i < w.length; i++) { var rr = r + d[0] * i, cc = c + d[1] * i; grid[rr][cc] = w[i]; cells.push(rr * N + cc); }
          placed.push({ w: w, cells: cells }); done = true;
        }
      }
    }
    var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var r2 = 0; r2 < N; r2++) for (var c2 = 0; c2 < N; c2++) if (!grid[r2][c2]) grid[r2][c2] = A[rnd(26)];
    return { theme: th, grid: grid, words: placed, N: N };
  }
  function wordsearch(el) {
    var N = 10, st;
    function fresh() { st = buildSearch(N); st.found = {}; st.first = null; render(); }
    function lineCells(a, b) {
      var ar = Math.floor(a / N), ac = a % N, br = Math.floor(b / N), bc = b % N;
      var dr = br - ar, dc = bc - ac;
      if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null;
      var len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
      var sr = dr === 0 ? 0 : dr / Math.abs(dr), sc = dc === 0 ? 0 : dc / Math.abs(dc);
      var cells = []; for (var i = 0; i < len; i++) cells.push((ar + sr * i) * N + (ac + sc * i));
      return cells;
    }
    function tap(idx) {
      if (st.first == null) { st.first = idx; return render(); }
      if (st.first === idx) { st.first = null; return render(); }
      var cells = lineCells(st.first, idx); st.first = null;
      if (!cells) return render();
      var str = cells.map(function (i) { return st.grid[Math.floor(i / N)][i % N]; }).join("");
      var rev = str.split("").reverse().join("");
      st.words.forEach(function (p) {
        if (st.found[p.w]) return;
        if ((str === p.w || rev === p.w) && cells.length === p.cells.length) st.found[p.w] = cells.slice();
      });
      render();
    }
    function render() {
      var foundCells = {}; for (var w in st.found) st.found[w].forEach(function (i) { foundCells[i] = 1; });
      var cells = "";
      for (var i = 0; i < N * N; i++) {
        var r = Math.floor(i / N), c = i % N;
        var cls = "ws-c" + (foundCells[i] ? " found" : "") + (st.first === i ? " sel" : "");
        cells += '<button class="' + cls + '" data-i="' + i + '">' + st.grid[r][c] + "</button>";
      }
      var allFound = st.words.every(function (p) { return st.found[p.w]; });
      var list = st.words.map(function (p) { return '<span class="ws-word' + (st.found[p.w] ? " done" : "") + '">' + esc(p.w) + "</span>"; }).join("");
      el.innerHTML = '<div class="ws game-card">' +
        '<div class="g-top"><span class="g-tag">🔍 ' + esc(st.theme) + '</span><span class="g-stat">' + Object.keys(st.found).length + " / " + st.words.length + "</span></div>" +
        '<p class="sc-help">Tap the <b>first</b> and <b>last</b> letter of a word to find it (any direction).</p>' +
        (allFound ? '<div class="g-msg win">🎉 You found them all!</div>' : "") +
        '<div class="ws-grid" style="grid-template-columns:repeat(' + N + ',1fr)">' + cells + "</div>" +
        '<div class="ws-list">' + list + "</div>" +
        '<div class="g-controls"><button class="wbtn" data-new="1">🔄 New puzzle</button></div></div>';
      on(el, ".ws-c", function (b) { tap(+b.dataset.i); });
      on(el, "[data-new]", fresh);
    }
    document.onkeydown = null;
    fresh();
  }

  var GAMES = { hangman: hangman, scramble: scramble, builder: builder, search: wordsearch, wordsearch: wordsearch };
  function mount(el, name) {
    var fn = GAMES[name];
    if (!fn) { el.innerHTML = "<p class='muted'>That game could not load.</p>"; return; }
    fn(el);
  }
  return { mount: mount, isWord: isWord, _scoreVal: VAL };
})();
