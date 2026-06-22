/* Kids' Encyclopedia — engine. Vanilla JS, 100% offline. Hash routing so it
   works on file:// and behind any home server. Reads window.WIKI (built by the
   content files) and draws everything with the Scene illustration engine. */
(function () {
  var root = document.getElementById("app");
  var W = window.WIKI || { cats: [], articles: [], byId: {}, catById: {} };

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function get(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  // ---------- progress sync (only when mounted on the home server at /explore) ----------
  var ON_SERVER = (location.protocol === "http:" || location.protocol === "https:") && location.pathname.indexOf("/explore") === 0;
  var LEARNER = null, syncTimer = null;
  function pushProgress() {
    if (!ON_SERVER || !LEARNER || LEARNER === "parent") return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      try {
        fetch("/explore/api/progress", { method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ progress: { visited: get("wiki-visited", []), words: get("wiki-words", []), hunts: get("wiki-hunts", 0) } }) });
      } catch (e) {}
    }, 700);
  }
  function initSync(done) {
    if (!ON_SERVER) { return done(); }
    fetch("/explore/api/whoami").then(function (r) { return r.json(); }).then(function (d) {
      LEARNER = d && d.learner;
      if (!LEARNER || LEARNER === "parent") return null;
      return fetch("/explore/api/progress?learner=" + encodeURIComponent(LEARNER)).then(function (r) { return r.json(); }).then(function (p) {
        var sv = (p && p.progress) || {};
        var uv = get("wiki-visited", []).slice(); (sv.visited || []).forEach(function (x) { if (uv.indexOf(x) < 0) uv.push(x); }); set("wiki-visited", uv);
        var uw = get("wiki-words", []).slice(); (sv.words || []).forEach(function (x) { if (!uw.some(function (y) { return y.w === x.w; })) uw.push(x); }); set("wiki-words", uw);
        set("wiki-hunts", Math.max(get("wiki-hunts", 0), sv.hunts || 0));
        pushProgress();
      });
    }).catch(function () {}).then(function () { done(); });
  }

  // ---------- inline markup: [[id]] / [[id|label]] links, [[diagram:name]] ----------
  function inline(html) {
    return String(html || "").replace(/\[\[([^\]]+)\]\]/g, function (m, body) {
      if (body.indexOf("diagram:") === 0) {
        var n = body.slice(8).trim();
        return '<div class="wiki-dgm-box">' + window.Scene.diagram(n) + '</div>';
      }
      var parts = body.split("|"); var id = parts[0].trim(); var label = (parts[1] || (W.byId[id] ? W.byId[id].title : id)).trim();
      if (W.byId[id]) return '<a class="ilink" href="#/a/' + encodeURIComponent(id) + '">' + esc(label) + '</a>';
      return esc(label);
    });
  }

  // ---------- search ----------
  var INDEX = null;
  function buildIndex() {
    INDEX = W.articles.map(function (a) {
      var hay = [a.title, a.blurb, a.intro].concat((a.facts || []), (a.sections || []).map(function (s) { return s.h + " " + s.body; })).join(" ").toLowerCase();
      return { a: a, hay: hay, title: a.title.toLowerCase() };
    });
  }
  function search(q) {
    if (!INDEX) buildIndex();
    q = q.trim().toLowerCase(); if (!q) return [];
    var terms = q.split(/\s+/);
    var res = [];
    INDEX.forEach(function (it) {
      var score = 0, ok = true;
      terms.forEach(function (t) { if (it.hay.indexOf(t) < 0) ok = false; });
      if (!ok) return;
      if (it.title === q) score += 100;
      if (it.title.indexOf(q) === 0) score += 50;
      if (it.title.indexOf(q) >= 0) score += 20;
      terms.forEach(function (t) { if (it.title.indexOf(t) >= 0) score += 8; });
      res.push({ a: it.a, score: score });
    });
    res.sort(function (x, y) { return y.score - x.score || x.a.title.localeCompare(y.a.title); });
    return res.map(function (r) { return r.a; });
  }

  // ---------- helpers ----------
  function catOf(a) { return W.catById[a.cat] || { name: a.cat, emoji: "📚", accent: "#7c5cff" }; }
  function articleCard(a) {
    var c = catOf(a);
    return '<a class="acard" href="#/a/' + encodeURIComponent(a.id) + '" style="--c:' + (c.accent || "#7c5cff") + '">' +
      '<span class="acard-em">' + (a.emoji || c.emoji) + '</span>' +
      '<span class="acard-t">' + esc(a.title) + '</span>' +
      '<span class="acard-b">' + esc(a.blurb || "") + '</span>' +
      '<span class="acard-cat">' + c.emoji + ' ' + esc(c.name) + '</span>' +
      '</a>';
  }
  function todaySeed() { var d = new Date(); return d.getFullYear() * 1000 + (d.getMonth() * 31 + d.getDate()); }
  function factOfDay() {
    var pool = [];
    W.articles.forEach(function (a) { (a.facts || []).forEach(function (f) { pool.push({ f: f, a: a }); }); });
    if (!pool.length) return null;
    return pool[todaySeed() % pool.length];
  }
  function randomArticle() { return W.articles[Math.floor(Math.random() * W.articles.length)]; }
  function markVisited(id) { var v = get("wiki-visited", []); v = v.filter(function (x) { return x !== id; }); v.unshift(id); set("wiki-visited", v); pushProgress(); }

  // ---------- views ----------
  function viewHome() {
    var fod = factOfDay();
    var cats = W.cats.map(function (c) {
      var n = W.articles.filter(function (a) { return a.cat === c.id; }).length;
      return '<a class="wcat" href="#/cat/' + c.id + '" style="--c:' + c.accent + '">' +
        '<span class="wcat-em">' + c.emoji + '</span><span class="wcat-n">' + esc(c.name) + '</span>' +
        '<span class="wcat-b">' + esc(c.blurb || "") + '</span><span class="wcat-c">' + n + ' topics</span></a>';
    }).join("");
    var visited = get("wiki-visited", []).map(function (id) { return W.byId[id]; }).filter(Boolean).slice(0, 6);
    var spList = (window.Days ? window.Days.forDate(new Date()) : []);
    var todayLine = (window.Days ? window.Days.line(new Date()) : "");
    var todayCard = window.Days ? ('<div class="today">' +
        '<div class="today-date">📅 Today is <b>' + esc(todayLine) + '</b></div>' +
        (spList.length ? spList.map(function (s) { return '<div class="today-sp">' + s.emoji + ' <b>' + esc(s.name) + '</b> — ' + esc(s.note) + '</div>'; }).join("")
                       : '<div class="today-sp">🌟 A brand-new day to explore and discover something amazing!</div>') +
      '</div>') : '';
    root.innerHTML =
      '<header class="hero">' +
        '<div class="hero-in">' +
          '<div class="hero-top"><h1>📚 Curious Kids Encyclopedia</h1><div class="hero-actions"><a class="wbtn ghost" href="#/dictionary">📕 Dictionary</a><a class="wbtn ghost" href="#/versus">⚔️ Versus</a><a class="wbtn ghost" href="#/activities">🎯 Activities</a></div></div>' +
          '<p class="sub">Explore the world — animals, space, history, places and more. Pick a world or search for anything!</p>' +
          '<form class="searchbar" id="sform"><span>🔎</span><input id="sq" type="search" placeholder="Search the encyclopedia… (try “lion”, “volcano”, “Egypt”)" autocomplete="off"><button class="wbtn" type="submit">Search</button></form>' +
        '</div>' +
      '</header>' +
      '<main class="wrap">' +
        todayCard +
        '<div class="row2">' +
          (fod ? '<div class="fod"><div class="fod-tag">🌟 Fact of the Day</div><div class="fod-f">' + esc(fod.f) + '</div><a class="fod-link" href="#/a/' + encodeURIComponent(fod.a.id) + '">' + fod.a.emoji + ' Read about ' + esc(fod.a.title) + ' →</a></div>' : '') +
          '<button class="surprise" id="surprise">🎲<span><b>Surprise me!</b><br>Jump to a random topic</span></button>' +
        '</div>' +
        '<div class="tools">' +
          '<a class="tool" href="#/dictionary" style="--c:#0e9aa7"><span class="tool-em">📕</span><span class="tool-tx"><b>Dictionary</b><span>Look up any word</span></span></a>' +
          '<a class="tool" href="#/versus" style="--c:#ff7a59"><span class="tool-em">⚔️</span><span class="tool-tx"><b>Head-to-Head</b><span>Player 1 vs Player 2</span></span></a>' +
          '<a class="tool" href="#/cat/games" style="--c:#6a5acd"><span class="tool-em">🎮</span><span class="tool-tx"><b>Games</b><span>Chess, words &amp; tables</span></span></a>' +
          '<a class="tool" href="#/activities" style="--c:#7c5cff"><span class="tool-em">🎯</span><span class="tool-tx"><b>Activities</b><span>Hunts &amp; words</span></span></a>' +
        '</div>' +
        '<h2 class="sec">🌈 Choose a world to explore</h2>' +
        '<div class="wcats">' + cats + '</div>' +
        (visited.length ? '<h2 class="sec">🧭 Pick up where you left off</h2><div class="agrid">' + visited.map(articleCard).join("") + '</div>' : '') +
        '<footer class="brandfoot">' + brand() + '</footer>' +
      '</main>';
    document.getElementById("sform").onsubmit = function (e) { e.preventDefault(); var q = document.getElementById("sq").value; if (q.trim()) location.hash = "#/search/" + encodeURIComponent(q.trim()); };
    document.getElementById("surprise").onclick = function () { location.hash = "#/a/" + encodeURIComponent(randomArticle().id); };
  }

  function viewCategory(id) {
    var c = W.catById[id]; if (!c) return viewHome();
    var arts = W.articles.filter(function (a) { return a.cat === id; }).sort(function (a, b) { return a.title.localeCompare(b.title); });
    root.innerHTML =
      '<header class="hero cat" style="--c:' + c.accent + '">' +
        '<div class="hero-in"><a class="back" href="#/">← Home</a>' +
          '<h1>' + c.emoji + ' ' + esc(c.name) + '</h1><p class="sub">' + esc(c.blurb || "") + ' · ' + arts.length + ' topics</p>' +
          '<form class="searchbar small" id="sform"><span>🔎</span><input id="sq" type="search" placeholder="Search all topics…" autocomplete="off"></form>' +
        '</div>' +
      '</header>' +
      '<main class="wrap">' +
      (id === "games"
        ? '<a class="play-banner vs-banner" href="#/versus"><span class="pb-em">⚔️</span><span class="pb-tx"><b>Head-to-Head</b><span>Play each other and keep score — Player 1 vs Player 2 across every game</span></span><span class="pb-go">Scoreboard 🏆</span></a>' +
          '<p class="arcade-note">Tap a game to play — each one has its own <b>How to play, tips &amp; tricks</b> lessons underneath.</p>' +
          '<div class="arcade">' +
            GAME_ORDER.map(function (k) { var m = GAME_META[k], n = lessonsFor(k).length;
              return '<a class="play-banner" href="#/play/' + k + '"><span class="pb-em">' + m.icon + '</span><span class="pb-tx"><b>' + esc(m.title) + '</b><span>' + esc(m.sub) + (n ? ' · 📖 ' + n + ' lesson' + (n > 1 ? 's' : '') : '') + '</span></span><span class="pb-go">Play ▶️</span></a>';
            }).join("") + '</div></main>'
        : '<div class="agrid">' + arts.map(articleCard).join("") + '</div></main>');
    document.getElementById("sform").onsubmit = function (e) { e.preventDefault(); var q = document.getElementById("sq").value; if (q.trim()) location.hash = "#/search/" + encodeURIComponent(q.trim()); };
  }

  function viewArticle(id) {
    var a = W.byId[id]; if (!a) return viewSearchMsg("Hmm, that topic isn't here yet.");
    markVisited(id);
    var c = catOf(a);
    var secs = (a.sections || []).map(function (s) {
      return '<section class="asec"><h3>' + esc(s.h) + '</h3><div class="asec-b">' + inline(s.body) + '</div></section>';
    }).join("");
    var facts = (a.facts || []).length ? '<div class="facts"><h3>📊 Notable Facts &amp; Figures</h3><ul>' + a.facts.map(function (f) { return '<li>' + inline(f) + '</li>'; }).join("") + '</ul></div>' : '';
    var dyk = a.dyk ? '<div class="dyk">💡 <b>Did you know?</b> ' + inline(a.dyk) + '</div>' : '';
    var words = (a.words || []).length ? '<div class="words"><h3>📖 Word Builder</h3>' + a.words.map(function (w) {
      return '<div class="word"><b>' + esc(w.w) + '</b> — ' + esc(w.d) + ' <button class="wadd" data-w="' + esc(w.w) + '" data-d="' + esc(w.d) + '">＋ Save word</button></div>';
    }).join("") + '</div>' : '';
    var sn = a.snapshot;
    var snap = sn ? '<div class="snapbox"><div class="snap-h">📅 Country facts <span>(as of 2026)</span></div><div class="snap-rows">' +
      (sn.capital ? '<div class="snap-row"><span>🏛️ Capital</span><b>' + esc(sn.capital) + '</b></div>' : '') +
      (sn.pop ? '<div class="snap-row"><span>👥 Population</span><b>' + esc(sn.pop) + '</b></div>' : '') +
      (sn.leader ? '<div class="snap-row"><span>👤 Leader</span><b>' + esc(sn.leader) + '</b></div>' : '') +
      (sn.hos ? '<div class="snap-row"><span>👑 Head of state</span><b>' + esc(sn.hos) + '</b></div>' : '') +
      '</div><div class="snap-note">Leaders and populations change over time — this is a 2026 snapshot.</div></div>' : '';
    var rel = (a.related || []).map(function (r) { return W.byId[r]; }).filter(Boolean);
    var related = rel.length ? '<div class="related"><h3>🧭 Explore next</h3><div class="rel-row">' + rel.map(function (r) {
      return '<a class="relchip" href="#/a/' + encodeURIComponent(r.id) + '" style="--c:' + catOf(r).accent + '">' + (r.emoji || "📚") + ' ' + esc(r.title) + '</a>';
    }).join("") + '</div></div>' : '';
    root.innerHTML =
      '<article class="awrap">' +
        '<div class="ahero" style="--c:' + c.accent + '">' + window.Scene.hero(a) +
          '<div class="ahero-cap"><a class="back light" href="#/cat/' + a.cat + '">← ' + c.emoji + ' ' + esc(c.name) + '</a><h1>' + (a.emoji || "") + ' ' + esc(a.title) + '</h1></div>' +
        '</div>' +
        '<main class="wrap narrow">' +
          (a.intro ? '<p class="intro">' + inline(a.intro) + '</p>' : '') +
          snap + secs + facts + dyk + words + related +
          '<div class="amore"><a class="wbtn ghost" href="#/cat/' + a.cat + '">More ' + esc(c.name) + ' →</a> <button class="wbtn" id="surprise2">🎲 Surprise me</button></div>' +
          '<footer class="brandfoot">' + brand() + '</footer>' +
        '</main>' +
      '</article>';
    Array.prototype.forEach.call(document.querySelectorAll(".wadd"), function (b) {
      b.onclick = function () { var list = get("wiki-words", []); if (!list.some(function (x) { return x.w === b.dataset.w; })) { list.push({ w: b.dataset.w, d: b.dataset.d }); set("wiki-words", list); pushProgress(); } b.textContent = "✓ Saved"; b.disabled = true; };
    });
    var s2 = document.getElementById("surprise2"); if (s2) s2.onclick = function () { location.hash = "#/a/" + encodeURIComponent(randomArticle().id); };
    window.scrollTo(0, 0);
  }

  // ---------- the Game Arcade ----------
  var GAME_META = {
    chess:    { icon: "♟️", title: "Play Chess", sub: "Against the computer (Easy / Medium / Hard) or a friend. Tap a piece to see where it can go.", learn: true, mount: function (h) { window.Chess.mount(h, { onResult: function () { versusPrompt("chess"); } }); } },
    tables:   { icon: "🎸", title: "Times Tables Rock", sub: "Race the clock on × and ÷ and earn your rock status — from Wannabe to Rock Hero!", mount: function (h) { window.TablesRock.mount(h); } },
    builder:  { icon: "🧩", title: "Word Builder", sub: "Make the highest-scoring real word from 7 letter tiles — Scrabble-style!", mount: function (h) { window.WordGames.mount(h, "builder"); } },
    scramble: { icon: "🔀", title: "Word Scramble", sub: "Unscramble the jumbled letters to find the hidden word.", mount: function (h) { window.WordGames.mount(h, "scramble"); } },
    hangman:  { icon: "🪢", title: "Hangman", sub: "Guess the hidden word one letter at a time before your hearts run out.", mount: function (h) { window.WordGames.mount(h, "hangman"); } },
    search:   { icon: "🔍", title: "Word Search", sub: "Hunt for hidden words in the letter grid — in any direction!", mount: function (h) { window.WordGames.mount(h, "search"); } }
  };
  var GAME_ORDER = ["chess", "tables", "builder", "scramble", "hangman", "search"];

  // which game does a lesson article belong to? (explicit a.game, else inferred from the id prefix)
  function gameOf(a) {
    if (a.game) return a.game;
    var id = a.id || "";
    if (id.indexOf("chess") === 0) return "chess";
    for (var k in GAME_META) if (id.indexOf(k + "-") === 0) return k;
    return null;
  }
  function lessonsFor(game) {
    return W.articles.filter(function (a) { return a.cat === "games" && gameOf(a) === game; })
      .sort(function (a, b) { return a.title.localeCompare(b.title); });
  }

  function viewPlay(what) {
    var m = GAME_META[what] || GAME_META.chess, key = GAME_META[what] ? what : "chess";
    var lessons = lessonsFor(key);
    root.innerHTML =
      '<header class="hero" style="--c:#6a5acd"><div class="hero-in"><a class="back" href="#/cat/games">← Games</a>' +
        '<h1>' + m.icon + ' ' + esc(m.title) + '</h1><p class="sub">' + esc(m.sub) + '</p></div></header>' +
      '<main class="wrap narrow"><div id="gamemount" class="chess-mount"></div>' +
        '<div class="vs-bar"><span>⚔️ Playing head-to-head?</span> <button class="wbtn ghost" id="vsRec">Record who won</button> <a class="wbtn ghost" href="#/versus">🏆 Scoreboard</a></div>' +
        (lessons.length
          ? '<h2 class="sec dark">📖 How to play — lessons, tips &amp; tricks</h2><div class="agrid">' + lessons.map(articleCard).join("") + '</div>'
          : '') +
        '<footer class="brandfoot">' + brand() + '</footer></main>';
    var host = document.getElementById("gamemount");
    try { m.mount(host); } catch (e) { host.innerHTML = "<p class='muted'>This game could not load.</p>"; }
    var rb = document.getElementById("vsRec"); if (rb) rb.onclick = function () { versusPrompt(key); };
    window.scrollTo(0, 0);
  }

  // ---------- Dictionary (lazy-loads the bundled word data on first open) ----------
  function ensureDict(cb) {
    if (window.DICTIONARY) return cb(true);
    window.__dictReady = function () { window.__dictReady = null; cb(true); };
    if (document.getElementById("dictscript")) return;
    var s = document.createElement("script"); s.id = "dictscript"; s.src = "js/dictionary.js";
    s.onerror = function () { window.__dictReady = null; cb(false); };
    document.body.appendChild(s);
  }
  var NICE_WORDS = "curious galaxy gravity ocean volcano jungle ancient brave gentle clever rescue journey marvel sparkle whisper courage explore mystery rhythm harmony".split(" ");
  function dictEntry(word) {
    var D = window.DICTIONARY || {}, w = word.toLowerCase(), ms = D[w];
    if (!ms) return '<div class="dict-none">No entry for <b>' + esc(word) + '</b>. Check the spelling, or try a related word below.</div>';
    var POS = { noun: "🔵", verb: "🟢", adjective: "🟣", adverb: "🟠" };
    return '<div class="dict-entry"><h2 class="dict-w">' + esc(w) + '</h2>' +
      ms.map(function (m, i) {
        return '<div class="dict-sense"><span class="dict-pos">' + (POS[m.p] || "▫️") + ' ' + esc(m.p || "") + '</span>' +
          '<div class="dict-def"><b>' + (i + 1) + '.</b> ' + esc(m.d) + '</div>' +
          (m.x ? '<div class="dict-ex">“' + esc(m.x) + '”</div>' : '') + '</div>';
      }).join("") + '</div>';
  }
  function dictSuggest(q) {
    var D = window.DICTIONARY || {}, p = q.toLowerCase(), out = [];
    for (var k in D) { if (k.indexOf(p) === 0 && k !== p) { out.push(k); if (out.length > 60) break; } }
    out.sort(function (a, b) { return a.length - b.length || a.localeCompare(b); });
    return out.slice(0, 12);
  }
  function viewDictionary(q) {
    q = decodeURIComponent(q || "").trim();
    root.innerHTML =
      '<header class="hero" style="--c:#0e9aa7"><div class="hero-in"><a class="back" href="#/">← Home</a>' +
        '<h1>📕 Dictionary</h1><p class="sub">Look up any word — what it means, how it’s used, and an example.</p>' +
        '<form class="searchbar" id="dform"><span>🔎</span><input id="dq" type="search" value="' + esc(q) + '" placeholder="Type a word… (try “gravity”, “brave”, “galaxy”)" autocomplete="off"><button class="wbtn" type="submit">Look up</button></form>' +
      '</div></header>' +
      '<main class="wrap narrow"><div id="dictbody"><p class="muted">📖 Loading the dictionary…</p></div>' +
      '<footer class="brandfoot">' + brand() + '</footer></main>';
    var f = document.getElementById("dform");
    f.onsubmit = function (e) { e.preventDefault(); var v = document.getElementById("dq").value.trim(); if (v) location.hash = "#/dictionary/" + encodeURIComponent(v); };
    ensureDict(function (ok) {
      var body = document.getElementById("dictbody"); if (!body) return;
      if (!ok) { body.innerHTML = '<p class="muted">The dictionary could not load.</p>'; return; }
      if (!q) {
        var wod = NICE_WORDS[todaySeed() % NICE_WORDS.length];
        body.innerHTML = '<div class="dict-wod"><div class="fod-tag">🌟 Word of the Day</div>' + dictEntry(wod) + '</div>' +
          '<p class="muted">Type a word above to look it up — the dictionary has tens of thousands of words!</p>';
        return;
      }
      var sug = dictSuggest(q);
      body.innerHTML = dictEntry(q) +
        (sug.length ? '<div class="dict-sug"><b>More words:</b> ' + sug.map(function (w) { return '<a class="relchip" href="#/dictionary/' + encodeURIComponent(w) + '" style="--c:#0e9aa7">' + esc(w) + '</a>'; }).join("") + '</div>' : '');
    });
    window.scrollTo(0, 0);
  }

  // ---------- Versus: head-to-head wins between the two children ----------
  var VKEY = "wiki-versus";
  function defVersus() { return { players: { a: "Player 1", b: "Player 2" }, matches: [] }; }
  function loadVersus() { var v = get(VKEY, null); if (!v || !v.players) { v = defVersus(); set(VKEY, v); } if (!v.matches) v.matches = []; return v; }
  function pushVersus(v) {
    if (!ON_SERVER || LEARNER === "parent") return;
    try {
      fetch("/explore/api/versus", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ players: v.players, matches: v.matches }) })
        .then(function (r) { return r.json(); }).then(function (d) { if (d && d.versus) set(VKEY, d.versus); });
    } catch (e) {}
  }
  function saveVersus(v) { set(VKEY, v); pushVersus(v); }
  function pullVersus(done) {
    if (!ON_SERVER) return done(loadVersus());
    fetch("/explore/api/versus").then(function (r) { return r.json(); }).then(function (d) {
      var local = loadVersus(), server = (d && d.versus) || { players: local.players, matches: [] };
      var byId = {}; (local.matches || []).concat(server.matches || []).forEach(function (m) { byId[m.id] = m; });
      var merged = { players: server.players || local.players, matches: Object.keys(byId).map(function (k) { return byId[k]; }).sort(function (a, b) { return a.ts < b.ts ? -1 : 1; }) };
      set(VKEY, merged); done(merged);
    }).catch(function () { done(loadVersus()); });
  }
  var matchSeq = 0;
  function newMatchId() { matchSeq++; return Date.now().toString(36) + "-" + matchSeq + "-" + Math.floor(Math.random() * 1e6).toString(36); }
  function recordMatch(gameKey, winner) { var v = loadVersus(); v.matches.push({ id: newMatchId(), game: gameKey, winner: winner, ts: new Date().toISOString() }); saveVersus(v); }
  function gameLabel(k) { return GAME_META[k] ? GAME_META[k].icon + " " + GAME_META[k].title : "🎮 " + k; }
  function tallyVersus(v) {
    var t = { a: 0, b: 0, draw: 0, byGame: {}, streakName: null, streak: 0 };
    v.matches.forEach(function (m) {
      if (m.winner === "a") t.a++; else if (m.winner === "b") t.b++; else t.draw++;
      var g = t.byGame[m.game] || { a: 0, b: 0, draw: 0 }; g[m.winner] = (g[m.winner] || 0) + 1; t.byGame[m.game] = g;
    });
    for (var i = v.matches.length - 1; i >= 0; i--) { var w = v.matches[i].winner; if (w === "draw") break; if (t.streakName === null) { t.streakName = w; t.streak = 1; } else if (w === t.streakName) t.streak++; else break; }
    return t;
  }
  // a small "record the result" bar shown under any game (and auto-popped by chess on checkmate)
  function versusPrompt(gameKey) {
    var host = document.getElementById("gamemount"); if (!host || host.querySelector(".vs-prompt")) return;
    var v = loadVersus(), A = esc(v.players.a), B = esc(v.players.b);
    var bar = document.createElement("div"); bar.className = "vs-prompt game-card";
    bar.innerHTML = '<b>🏁 Who won?</b> Record it to Head-to-Head: ' +
      '<button class="wbtn" data-w="a">🏆 ' + A + '</button> <button class="wbtn" data-w="b">🏆 ' + B + '</button> <button class="wbtn ghost" data-w="draw">🤝 Draw</button> <button class="wbtn ghost" data-w="">✕</button>';
    host.appendChild(bar);
    Array.prototype.forEach.call(bar.querySelectorAll("[data-w]"), function (btn) {
      btn.onclick = function () {
        if (btn.dataset.w === "") { bar.remove(); return; }
        recordMatch(gameKey, btn.dataset.w);
        bar.innerHTML = '✅ Recorded! <a class="ilink" href="#/versus">🏆 See the scoreboard →</a>';
      };
    });
    if (bar.scrollIntoView) bar.scrollIntoView({ block: "nearest" });
  }
  function viewVersus() {
    root.innerHTML =
      '<header class="hero" style="--c:#ff7a59"><div class="hero-in"><a class="back" href="#/">← Home</a>' +
        '<h1>⚔️ Head-to-Head</h1><p class="sub">Player 1 vs Player 2 — play each other and keep score across every game.</p></div></header>' +
      '<main class="wrap narrow"><div id="vsbody"><p class="muted">Loading the scoreboard…</p></div>' +
      '<footer class="brandfoot">' + brand() + '</footer></main>';
    pullVersus(function (v) {
      var body = document.getElementById("vsbody"); if (!body) return;
      var t = tallyVersus(v), A = esc(v.players.a), B = esc(v.players.b);
      var lead = t.a === t.b ? "All square!" : ((t.a > t.b ? A : B) + " leads");
      var streak = t.streak >= 2 ? '<div class="vs-streak">🔥 ' + esc(v.players[t.streakName]) + ' is on a ' + t.streak + '-win streak!</div>' : '';
      var gameKeys = Object.keys(t.byGame);
      var perGame = gameKeys.length ? '<div class="vs-games"><h2 class="sec dark">By game</h2>' + gameKeys.map(function (k) {
        var g = t.byGame[k]; return '<div class="vs-grow"><span class="vs-gname">' + esc(gameLabel(k)) + '</span><span class="vs-gsc"><b>' + g.a + '</b> – <b>' + g.b + '</b>' + (g.draw ? ' <i>(' + g.draw + ' draw' + (g.draw > 1 ? 's' : '') + ')</i>' : '') + '</span></div>';
      }).join("") + '</div>' : '';
      var recent = v.matches.slice(-10).reverse();
      var recentHtml = recent.length ? '<div class="vs-recent"><h2 class="sec dark">Recent matches</h2>' + recent.map(function (m) {
        var who = m.winner === "draw" ? "🤝 Draw" : "🏆 " + esc(v.players[m.winner]);
        return '<div class="vs-rrow"><span>' + esc(gameLabel(m.game)) + '</span><span>' + who + '</span><button class="vs-del" data-id="' + esc(m.id) + '">✕</button></div>';
      }).join("") + '</div>' : '';
      var recPanel = '<div class="vs-rec game-card"><h2>📝 Record a result</h2><p class="sc-help">Played a game together? Pick it and tap the winner.</p>' +
        '<select id="vsGame" class="cw-sel">' + GAME_ORDER.map(function (k) { return '<option value="' + k + '">' + esc(GAME_META[k].title) + '</option>'; }).join("") + '</select>' +
        '<div class="g-controls"><button class="wbtn" data-r="a">🏆 ' + A + '</button> <button class="wbtn" data-r="b">🏆 ' + B + '</button> <button class="wbtn ghost" data-r="draw">🤝 Draw</button></div></div>';
      body.innerHTML =
        '<div class="vs-score game-card"><div class="vs-side"><div class="vs-name">' + A + '</div><div class="vs-num">' + t.a + '</div></div>' +
          '<div class="vs-mid"><div class="vs-vs">VS</div><div class="vs-draws">' + t.draw + ' draw' + (t.draw === 1 ? '' : 's') + '</div><div class="vs-lead">' + esc(lead) + '</div></div>' +
          '<div class="vs-side"><div class="vs-name">' + B + '</div><div class="vs-num">' + t.b + '</div></div></div>' +
        streak + recPanel + perGame + recentHtml +
        '<div class="vs-names"><h2 class="sec dark">Players</h2><input id="vsA" value="' + A + '"> <input id="vsB" value="' + B + '"> <button class="wbtn ghost" id="vsSaveNames">Save names</button></div>';
      Array.prototype.forEach.call(body.querySelectorAll("[data-r]"), function (b) { b.onclick = function () { recordMatch(document.getElementById("vsGame").value, b.dataset.r); viewVersus(); }; });
      Array.prototype.forEach.call(body.querySelectorAll(".vs-del"), function (b) { b.onclick = function () { var vv = loadVersus(); vv.matches = vv.matches.filter(function (m) { return m.id !== b.dataset.id; }); saveVersus(vv); viewVersus(); }; });
      var sn = document.getElementById("vsSaveNames"); if (sn) sn.onclick = function () { var vv = loadVersus(); vv.players = { a: (document.getElementById("vsA").value || "Player 1").trim(), b: (document.getElementById("vsB").value || "Player 2").trim() }; saveVersus(vv); viewVersus(); };
    });
    window.scrollTo(0, 0);
  }

  function viewSearch(q) {
    q = decodeURIComponent(q || "");
    var res = search(q);
    root.innerHTML =
      '<header class="hero"><div class="hero-in"><a class="back" href="#/">← Home</a>' +
        '<h1>🔎 Search</h1>' +
        '<form class="searchbar" id="sform"><span>🔎</span><input id="sq" type="search" value="' + esc(q) + '" autocomplete="off"><button class="wbtn" type="submit">Search</button></form>' +
      '</div></header>' +
      '<main class="wrap">' +
        '<p class="muted">' + (res.length ? res.length + ' result' + (res.length > 1 ? 's' : '') + ' for “' + esc(q) + '”' : 'No topics found for “' + esc(q) + '”. Try another word!') + '</p>' +
        '<div class="agrid">' + res.map(articleCard).join("") + '</div>' +
      '</main>';
    var f = document.getElementById("sform"); f.onsubmit = function (e) { e.preventDefault(); var v = document.getElementById("sq").value; if (v.trim()) location.hash = "#/search/" + encodeURIComponent(v.trim()); };
  }
  function viewSearchMsg(msg) { root.innerHTML = '<main class="wrap"><p class="muted" style="margin-top:40px">' + esc(msg) + '</p><a class="wbtn" href="#/">← Back home</a></main>'; }

  function viewActivities() {
    var fod = factOfDay();
    var words = get("wiki-words", []);
    // scavenger hunt: collect articles that have hunt questions
    var hunts = [];
    W.articles.forEach(function (a) { (a.hunt || []).forEach(function (h) { hunts.push({ q: h.q, ans: h.a, id: a.id, title: a.title, emoji: a.emoji }); }); });
    // deterministic 5 for today
    var picks = []; if (hunts.length) { for (var i = 0; i < Math.min(5, hunts.length); i++) picks.push(hunts[(todaySeed() * 7 + i * 13) % hunts.length]); }
    root.innerHTML =
      '<header class="hero"><div class="hero-in"><a class="back" href="#/">← Home</a><h1>🎯 Explorer Activities</h1>' +
        '<p class="sub">Little challenges to spark big curiosity.</p></div></header>' +
      '<main class="wrap">' +
        (fod ? '<div class="fod big"><div class="fod-tag">🌟 Fact of the Day</div><div class="fod-f">' + esc(fod.f) + '</div><a class="fod-link" href="#/a/' + encodeURIComponent(fod.a.id) + '">' + fod.a.emoji + ' Read more →</a></div>' : '') +
        '<div class="act"><h2>🕵️ Scavenger Hunt</h2><p class="muted">Find the answers by exploring. Tap “Reveal” to check.</p>' +
          picks.map(function (h, i) {
            return '<div class="hunt"><div class="hq"><b>' + (i + 1) + '.</b> ' + esc(h.q) + '</div>' +
              '<button class="link reveal" data-i="' + i + '">Reveal answer</button>' +
              '<div class="ha" id="ha' + i + '" hidden>✅ ' + esc(h.ans) + ' &nbsp;<a href="#/a/' + encodeURIComponent(h.id) + '">' + (h.emoji || '📚') + ' ' + esc(h.title) + ' →</a></div></div>';
          }).join("") + '</div>' +
        '<div class="act"><h2>📖 My Word Builder</h2>' +
          (words.length ? '<div class="wlist">' + words.map(function (w, i) { return '<div class="wpill"><b>' + esc(w.w) + '</b> — ' + esc(w.d) + ' <button class="wdel" data-i="' + i + '">✕</button></div>'; }).join("") + '</div><button class="link" id="wclear">Clear all words</button>' : '<p class="muted">No words saved yet. When you read an article, tap <b>＋ Save word</b> to collect new words here!</p>') +
        '</div>' +
        '<div class="act center"><button class="surprise" id="surprise">🎲<span><b>Surprise me!</b><br>Random topic</span></button></div>' +
        '<footer class="brandfoot">' + brand() + '</footer>' +
      '</main>';
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (b) { b.onclick = function () { var el = document.getElementById("ha" + b.dataset.i); el.hidden = false; b.style.display = "none"; set("wiki-hunts", get("wiki-hunts", 0) + 1); pushProgress(); }; });
    Array.prototype.forEach.call(document.querySelectorAll(".wdel"), function (b) { b.onclick = function () { var list = get("wiki-words", []); list.splice(+b.dataset.i, 1); set("wiki-words", list); viewActivities(); }; });
    var wc = document.getElementById("wclear"); if (wc) wc.onclick = function () { set("wiki-words", []); viewActivities(); };
    var sp = document.getElementById("surprise"); if (sp) sp.onclick = function () { location.hash = "#/a/" + encodeURIComponent(randomArticle().id); };
  }

  function brand() {
    return '<div class="brandbar"><div class="brandcard"><svg viewBox="0 0 300 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Simpliflex Systems Limited">' +
      '<defs><linearGradient id="sfxg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1B4F72"/><stop offset="100%" stop-color="#2874A6"/></linearGradient></defs>' +
      '<g transform="translate(6,8)"><path d="M5 25 C5 12,15 5,35 5 C55 5,65 12,65 25 C65 38,55 45,40 45 L30 55 L28 45 C15 45,5 38,5 25" fill="url(#sfxg)"/><circle cx="25" cy="25" r="4" fill="#27AE60"/><path d="M32 18 Q38 25,32 32" stroke="#27AE60" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M38 12 Q48 25,38 38" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M44 8 Q57 25,44 42" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/></g>' +
      '<text x="86" y="40" font-family="Arial,Segoe UI,sans-serif" font-size="30" font-weight="bold"><tspan fill="#1B4F72">Simpli</tspan><tspan fill="#27AE60">flex</tspan></text></svg></div>' +
      '<div class="powered">Powered by <b>Simpliflex Systems Limited</b></div></div>';
  }

  // ---------- router ----------
  function routeAndRender() {
    var h = location.hash.replace(/^#/, "");
    var parts = h.split("/").filter(Boolean); // ["", "a", "lion"] -> ["a","lion"]
    if (!parts.length) return viewHome();
    if (parts[0] === "cat") return viewCategory(parts[1]);
    if (parts[0] === "a") return viewArticle(decodeURIComponent(parts[1] || ""));
    if (parts[0] === "search") return viewSearch(parts.slice(1).join("/"));
    if (parts[0] === "activities") return viewActivities();
    if (parts[0] === "play") return viewPlay(parts[1] || "chess");
    if (parts[0] === "dictionary") return viewDictionary(parts.slice(1).join("/"));
    if (parts[0] === "versus") return viewVersus();
    return viewHome();
  }
  window.addEventListener("hashchange", routeAndRender);
  initSync(routeAndRender);
})();
