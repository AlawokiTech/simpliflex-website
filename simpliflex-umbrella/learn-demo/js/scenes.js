/* Scene + diagram illustration engine — draws colourful art in pure SVG so the
   encyclopedia is rich and engaging with ZERO internet. No images needed.
   Scene.hero(article) -> a big themed illustration SVG.
   Scene.diagram(name) -> a labelled educational diagram SVG (solar system, etc.). */
(function () {
  var W = 800, H = 360;
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  // a floating emoji (CSS animates .sc-float)
  function em(x, y, size, e, opts) {
    opts = opts || {};
    var cls = "sc-em" + (opts.float ? " sc-float" : "");
    var op = opts.op != null ? opts.op : 1;
    var rot = opts.rot ? (' transform="rotate(' + opts.rot + ' ' + x + ' ' + y + ')"') : "";
    var st = opts.delay ? (' style="animation-delay:' + opts.delay + 's"') : "";
    return '<text class="' + cls + '"' + st + ' x="' + x + '" y="' + y + '" font-size="' + size + '" text-anchor="middle" dominant-baseline="central" opacity="' + op + '"' + rot + '>' + e + '</text>';
  }
  function grad(id, stops) {
    var s = stops.map(function (st) { return '<stop offset="' + st[0] + '" stop-color="' + st[1] + '"/>'; }).join("");
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + s + '</linearGradient>';
  }
  function sun(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + (c || "#ffd76a") + '" opacity=".95"/>'; }
  function hills(c, y) { return '<path d="M0 ' + y + ' Q200 ' + (y - 70) + ' 400 ' + y + ' T800 ' + y + ' V360 H0 Z" fill="' + c + '"/>'; }
  function ground(c, y) { return '<rect x="0" y="' + y + '" width="800" height="' + (360 - y) + '" fill="' + c + '"/>'; }
  function stars(n) { var o = "", i, x, y, r; for (i = 0; i < n; i++) { x = (i * 137) % 790 + 5; y = (i * 71) % 200 + 8; r = (i % 3) ? 1.6 : 2.6; o += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" opacity="' + (0.5 + (i % 4) * 0.13) + '"/>'; } return o; }
  function tree(x, base) { return '<rect x="' + (x - 6) + '" y="' + (base - 46) + '" width="12" height="46" fill="#7a4a25"/><ellipse cx="' + x + '" cy="' + (base - 60) + '" rx="46" ry="34" fill="#3f9d4f"/><ellipse cx="' + (x - 26) + '" cy="' + (base - 44) + '" rx="30" ry="24" fill="#48ad58"/><ellipse cx="' + (x + 28) + '" cy="' + (base - 46) + '" rx="30" ry="24" fill="#37934a"/>'; }
  function acacia(x, base) { return '<rect x="' + (x - 5) + '" y="' + (base - 70) + '" width="10" height="70" fill="#6b4a2a"/><ellipse cx="' + x + '" cy="' + (base - 76) + '" rx="70" ry="22" fill="#5a8f3a"/><ellipse cx="' + x + '" cy="' + (base - 88) + '" rx="48" ry="16" fill="#6da846"/>'; }
  function buildings(y) { var o = "", x = 20, hs = [120, 80, 150, 100, 60, 130, 90, 110], i, h; for (i = 0; x < 800; i++) { h = hs[i % hs.length]; o += '<rect x="' + x + '" y="' + (y - h) + '" width="64" height="' + h + '" rx="4" fill="rgba(20,20,60,.5)"/>'; o += '<rect x="' + (x + 10) + '" y="' + (y - h + 12) + '" width="10" height="12" fill="#ffe08a" opacity=".8"/><rect x="' + (x + 34) + '" y="' + (y - h + 12) + '" width="10" height="12" fill="#ffe08a" opacity=".7"/>'; x += 80; } return o; }
  function waves(y) { var o = "", i; for (i = 0; i < 3; i++) { o += '<path d="M0 ' + (y + i * 26) + ' Q100 ' + (y + i * 26 - 12) + ' 200 ' + (y + i * 26) + ' T400 ' + (y + i * 26) + ' T600 ' + (y + i * 26) + ' T800 ' + (y + i * 26) + '" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/>'; } return o; }
  function clouds() { return '<g fill="#fff" opacity=".9"><ellipse cx="150" cy="70" rx="46" ry="22"/><ellipse cx="190" cy="64" rx="34" ry="20"/><ellipse cx="640" cy="56" rx="40" ry="20"/><ellipse cx="600" cy="60" rx="30" ry="16"/></g>'; }

  // big subject emoji + scattered accents
  function subject(e, accents) {
    var o = '<g class="sc-pop">' + em(400, 196, 150, e || "✨") + '</g>';
    accents = accents || [];
    var spots = [[110, 150], [690, 140], [150, 280], [660, 285], [400, 70], [250, 120], [560, 110]];
    accents.slice(0, 7).forEach(function (a, i) { var s = spots[i] || [100 + i * 90, 120]; o += em(s[0], s[1], 40, a, { float: true, op: 0.92, delay: (i * 0.3) }); });
    return o;
  }

  var SCENES = {};
  function defs(id, stops) { return '<defs>' + grad(id, stops) + '</defs>'; }
  SCENES.savanna = function (e, ac) { return defs("g", [["0", "#ffe1a0"], ["55%", "#ffc06a"], ["100%", "#ef9a3a"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + sun(660, 80, 46, "#fff3c4") + ground("#cf9a4e", 268) + acacia(120, 300) + acacia(700, 300) + '<ellipse cx="400" cy="300" rx="220" ry="20" fill="rgba(120,80,20,.18)"/>' + subject(e, ac); };
  SCENES.forest = function (e, ac) { return defs("g", [["0", "#bfe9ff"], ["60%", "#d7f3e0"], ["100%", "#bfe6c4"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + sun(120, 70, 38, "#fff6cf") + ground("#6fbf6a", 270) + tree(110, 300) + tree(700, 300) + tree(250, 312) + tree(560, 312) + subject(e, ac); };
  SCENES.ocean = function (e, ac) { return defs("g", [["0", "#9fe0ff"], ["45%", "#4db4e6"], ["100%", "#1f6fb0"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + waves(120) + '<g opacity=".6" fill="#bfeaff">' + em(120, 250, 22, "🫧", { float: true }) + em(680, 230, 26, "🫧", { float: true, delay: 1 }) + '</g>' + subject(e, ac); };
  SCENES.polar = function (e, ac) { return defs("g", [["0", "#dff3ff"], ["55%", "#bfe3f5"], ["100%", "#a9d6ee"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + '<path d="M0 300 L160 250 L320 300 Z" fill="#fff"/><path d="M300 305 L470 245 L640 305 Z" fill="#eef9ff"/><path d="M560 305 L720 255 L800 300 V360 H560 Z" fill="#fff"/>' + ground("#eaf6ff", 300) + subject(e, ac); };
  SCENES.desert = function (e, ac) { return defs("g", [["0", "#ffe3a8"], ["60%", "#ffcf8a"], ["100%", "#f0a85a"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + sun(150, 80, 42, "#fff2c8") + '<path d="M0 300 Q200 250 400 300 T800 300 V360 H0 Z" fill="#e6b366"/><path d="M0 330 Q260 290 520 330 T800 330 V360 H0 Z" fill="#d99a4e"/>' + subject(e, ac); };
  SCENES.mountains = function (e, ac) { return defs("g", [["0", "#bfe2ff"], ["60%", "#dff0ff"], ["100%", "#eef7ff"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + '<path d="M-20 320 L180 120 L360 320 Z" fill="#8aa2b8"/><path d="M250 320 L470 90 L690 320 Z" fill="#6f879e"/><path d="M520 320 L720 150 L860 320 Z" fill="#9bb0c4"/><path d="M430 130 L470 90 L512 130 L490 140 L470 124 L450 140 Z" fill="#fff"/>' + ground("#cfe6c9", 318) + subject(e, ac); };
  SCENES.space = function (e, ac) { return defs("g", [["0", "#0b1138"], ["60%", "#1a1a52"], ["100%", "#2a1550"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + stars(46) + '<circle cx="120" cy="280" r="70" fill="#3a3a8a" opacity=".5"/>' + em(690, 80, 60, "🪐", { float: true }) + subject(e, ac); };
  SCENES.sky = function (e, ac) { return defs("g", [["0", "#7ec8ff"], ["60%", "#aee0ff"], ["100%", "#dff4ff"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + sun(680, 70, 44, "#fff3b0") + clouds() + ground("#8fd08a", 312) + subject(e, ac); };
  SCENES.lab = function (e, ac) { return defs("g", [["0", "#d8f3ee"], ["55%", "#bfe9f0"], ["100%", "#a9d8ec"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + em(120, 250, 70, "⚗️", { float: true }) + em(690, 250, 64, "🧪", { float: true, delay: 1 }) + em(400, 70, 30, "✨") + em(250, 90, 22, "✨") + subject(e, ac); };
  SCENES.gallery = function (e, ac) { return defs("g", [["0", "#f6e7d2"], ["60%", "#efd9bd"], ["100%", "#e6c9a6"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + '<rect x="0" y="300" width="800" height="60" fill="#caa074"/>' + '<g fill="none" stroke="#b07a3a" stroke-width="8"><rect x="90" y="80" width="120" height="150" rx="4" fill="#fff"/><rect x="590" y="90" width="120" height="140" rx="4" fill="#fff"/></g>' + subject(e, ac); };
  SCENES.ancient = function (e, ac) { return defs("g", [["0", "#ffe6b0"], ["60%", "#f3cf8a"], ["100%", "#e0b070"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + sun(660, 80, 44, "#fff2c8") + '<path d="M120 300 L210 110 L300 300 Z" fill="#caa05a"/><path d="M520 300 L610 130 L700 300 Z" fill="#bd9450"/>' + ground("#d8b572", 300) + subject(e, ac); };
  SCENES.city = function (e, ac) { return defs("g", [["0", "#6db0ff"], ["60%", "#bfe0ff"], ["100%", "#eaf5ff"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + sun(120, 70, 36, "#fff3b0") + buildings(320) + ground("#9aa7b8", 318) + subject(e, ac); };
  SCENES.generic = function (e, ac) { return defs("g", [["0", "#8a6cff"], ["55%", "#6b8bf5"], ["100%", "#4ad6c8"]]) + '<rect width="800" height="360" fill="url(#g)"/>' + em(400, 70, 26, "✦", { op: .5 }) + em(150, 110, 22, "✦", { op: .4 }) + em(650, 120, 22, "✦", { op: .4 }) + subject(e, ac); };

  // ---------- labelled educational diagrams ----------
  function dwrap(inner, vb) { return '<svg class="wiki-dgm" viewBox="' + (vb || "0 0 640 360") + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>'; }
  function lbl(x, y, t, sz, anchor) { return '<text x="' + x + '" y="' + y + '" font-size="' + (sz || 15) + '" font-family="Segoe UI,Arial" fill="#1d2440" text-anchor="' + (anchor || "middle") + '" font-weight="600">' + esc(t) + '</text>'; }
  var DIAG = {};
  DIAG["solar-system"] = function () {
    var pl = [["☀️", 60, "Sun"], ["☿", 120, "Mercury"], ["♀", 165, "Venus"], ["🌍", 215, "Earth"], ["♂", 265, "Mars"], ["🪐", 340, "Jupiter"], ["🪐", 430, "Saturn"], ["🔵", 500, "Uranus"], ["🔵", 560, "Neptune"]];
    var o = '<rect width="640" height="360" fill="#0b1138"/>' + stars(40);
    o += '<text x="40" y="200" font-size="46" text-anchor="middle">☀️</text>';
    var x = 90, names = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"], es = ["🪨", "🟠", "🌍", "🔴", "🟤", "🪐", "🔵", "🔵"], sizes = [10, 13, 14, 11, 26, 24, 18, 17];
    for (var i = 0; i < names.length; i++) { o += '<text x="' + x + '" y="200" font-size="' + (sizes[i] + 8) + '" text-anchor="middle" dominant-baseline="central">' + es[i] + '</text>'; o += '<text x="' + x + '" y="' + (235 + (i % 2) * 22) + '" font-size="11" fill="#cfe0ff" text-anchor="middle">' + names[i] + '</text>'; x += 64; }
    return dwrap(o);
  };
  DIAG["water-cycle"] = function () {
    var o = '<rect width="640" height="360" fill="#cfeeff"/>' + '<path d="M0 250 Q160 220 320 250 T640 250 V360 H0 Z" fill="#5bb0e0"/>' + sun(70, 70, 36, "#ffd76a");
    o += em(330, 60, 40, "☁️");
    o += '<g stroke="#1f6fb0" stroke-width="3" fill="none" marker-end="url(#ah)"><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#1f6fb0"/></marker></defs>';
    o += '<path d="M120 250 C120 160 180 110 290 80"/>'; // evaporation up
    o += '<path d="M380 90 C470 110 520 170 520 240"/>'; // precipitation down
    o += '</g>';
    o += lbl(120, 175, "Evaporation ↑", 13, "middle") + lbl(520, 165, "Rain ↓", 13, "middle") + lbl(330, 40, "Clouds form", 13) + lbl(320, 300, "Sea / River", 14);
    return dwrap(o);
  };
  DIAG["food-chain"] = function () {
    var items = [["🌱", "Grass"], ["🐛", "Caterpillar"], ["🐦", "Bird"], ["🦊", "Fox"]];
    var o = '<rect width="640" height="360" fill="#eef7ee"/>', x = 70;
    for (var i = 0; i < items.length; i++) { o += '<circle cx="' + x + '" cy="160" r="44" fill="#fff" stroke="#7bbf6a" stroke-width="3"/>'; o += '<text x="' + x + '" y="160" font-size="40" text-anchor="middle" dominant-baseline="central">' + items[i][0] + '</text>'; o += lbl(x, 230, items[i][1], 14); if (i < items.length - 1) o += '<text x="' + (x + 80) + '" y="168" font-size="34" text-anchor="middle" fill="#3f9d4f">→</text>'; x += 160; }
    o += lbl(320, 300, "The arrow means “is eaten by”", 13);
    return dwrap(o);
  };
  DIAG["earth-layers"] = function () {
    var o = '<rect width="640" height="360" fill="#0b1138"/>';
    var layers = [["Crust", "#7a4a25", 30], ["Mantle", "#d2683a", 80], ["Outer core", "#ffb347", 120], ["Inner core", "#ffe08a", 150]];
    layers.forEach(function (L) { o += '<circle cx="240" cy="180" r="' + L[2] + '" fill="' + L[1] + '"/>'; });
    o += '<line x1="240" y1="180" x2="430" y2="60" stroke="#fff"/><line x1="240" y1="180" x2="440" y2="130" stroke="#fff"/><line x1="240" y1="180" x2="440" y2="200" stroke="#fff"/><line x1="240" y1="180" x2="430" y2="270" stroke="#fff"/>';
    o += '<g fill="#fff" font-size="14" font-family="Segoe UI,Arial">';
    o += '<text x="445" y="64">Inner core (hottest, solid)</text><text x="455" y="134">Outer core (liquid metal)</text><text x="455" y="204">Mantle (hot rock)</text><text x="445" y="274">Crust (where we live)</text></g>';
    return dwrap(o);
  };
  DIAG["butterfly-life-cycle"] = function () {
    var st = [["🥚", "Egg"], ["🐛", "Caterpillar"], ["🛡️", "Chrysalis"], ["🦋", "Butterfly"]];
    var pos = [[150, 90], [490, 90], [490, 270], [150, 270]], o = '<rect width="640" height="360" fill="#eafbef"/>';
    for (var i = 0; i < 4; i++) { o += '<circle cx="' + pos[i][0] + '" cy="' + pos[i][1] + '" r="42" fill="#fff" stroke="#7bbf6a" stroke-width="3"/><text x="' + pos[i][0] + '" y="' + pos[i][1] + '" font-size="40" text-anchor="middle" dominant-baseline="central">' + st[i][0] + '</text>' + lbl(pos[i][0], pos[i][1] + 62, st[i][1], 14); }
    o += '<g stroke="#3f9d4f" stroke-width="3" fill="none"><path d="M200 90 H440" marker-end="url(#a2)"/><path d="M490 140 V220" marker-end="url(#a2)"/><path d="M440 270 H200" marker-end="url(#a2)"/><path d="M150 220 V140" marker-end="url(#a2)"/><defs><marker id="a2" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#3f9d4f"/></marker></defs></g>';
    return dwrap(o);
  };

  window.Scene = {
    hero: function (a) {
      var name = (a && a.scene) || (a && window.WIKI && window.WIKI.catById[a.cat] && window.WIKI.catById[a.cat].scene) || "generic";
      var fn = SCENES[name] || SCENES.generic;
      var inner;
      try { inner = fn(a.emoji || "✨", a.accents || []); } catch (e) { inner = SCENES.generic(a.emoji || "✨", a.accents || []); }
      return '<svg class="wiki-hero-svg" viewBox="0 0 800 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
    },
    diagram: function (name) {
      var fn = DIAG[name];
      if (!fn) return '<div class="dgm-missing">[' + esc(name) + ']</div>';
      try { return fn(); } catch (e) { return '<div class="dgm-missing">[' + esc(name) + ']</div>'; }
    },
    hasDiagram: function (name) { return !!DIAG[name]; }
  };
})();
