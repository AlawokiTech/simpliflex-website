/* Offline chess — a correct rules engine + a simple computer opponent + an
   interactive board UI. No internet, no libraries. window.Chess.mount(el).
   Board squares 0..63: r = Math.floor(i/8) (0 = top = rank 8), c = i%8 (0 = a-file).
   White is UPPERCASE and moves UP (decreasing r); black is lowercase, moves DOWN. */
(function () {
  "use strict";
  var START = "rnbqkbnr".split("").concat("pppppppp".split(""),
    ".".repeat(8).split(""), ".".repeat(8).split(""), ".".repeat(8).split(""), ".".repeat(8).split(""),
    "PPPPPPPP".split(""), "RNBQKBNR".split(""));

  function isW(p) { return p >= "A" && p <= "Z"; }
  function isB(p) { return p >= "a" && p <= "z"; }
  function col(p) { return p === "." ? null : (isW(p) ? "w" : "b"); }
  function inb(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
  function idx(r, c) { return r * 8 + c; }

  function newGame() {
    return { b: START.slice(), turn: "w", castle: { K: true, Q: true, k: true, q: true }, ep: -1 };
  }
  function clone(g) { return { b: g.b.slice(), turn: g.turn, castle: { K: g.castle.K, Q: g.castle.Q, k: g.castle.k, q: g.castle.q }, ep: g.ep }; }

  var KN = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  var DIRS_R = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  var DIRS_B = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  // is square (r,c) attacked by side `by` ('w'|'b')?
  function attacked(b, r, c, by) {
    var i, rr, cc, p;
    // pawns
    if (by === "w") { if (inb(r + 1, c - 1) && b[idx(r + 1, c - 1)] === "P") return true; if (inb(r + 1, c + 1) && b[idx(r + 1, c + 1)] === "P") return true; }
    else { if (inb(r - 1, c - 1) && b[idx(r - 1, c - 1)] === "p") return true; if (inb(r - 1, c + 1) && b[idx(r - 1, c + 1)] === "p") return true; }
    // knights
    for (i = 0; i < KN.length; i++) { rr = r + KN[i][0]; cc = c + KN[i][1]; if (inb(rr, cc)) { p = b[idx(rr, cc)]; if (p !== "." && col(p) === by && (p === "N" || p === "n")) return true; } }
    // king
    for (rr = r - 1; rr <= r + 1; rr++) for (cc = c - 1; cc <= c + 1; cc++) { if ((rr !== r || cc !== c) && inb(rr, cc)) { p = b[idx(rr, cc)]; if (p !== "." && col(p) === by && (p === "K" || p === "k")) return true; } }
    // rook/queen lines
    for (i = 0; i < 4; i++) { rr = r; cc = c; for (;;) { rr += DIRS_R[i][0]; cc += DIRS_R[i][1]; if (!inb(rr, cc)) break; p = b[idx(rr, cc)]; if (p === ".") continue; if (col(p) === by && (p === "R" || p === "r" || p === "Q" || p === "q")) return true; break; } }
    // bishop/queen diagonals
    for (i = 0; i < 4; i++) { rr = r; cc = c; for (;;) { rr += DIRS_B[i][0]; cc += DIRS_B[i][1]; if (!inb(rr, cc)) break; p = b[idx(rr, cc)]; if (p === ".") continue; if (col(p) === by && (p === "B" || p === "b" || p === "Q" || p === "q")) return true; break; } }
    return false;
  }

  function kingSq(b, color) { var k = color === "w" ? "K" : "k"; for (var i = 0; i < 64; i++) if (b[i] === k) return i; return -1; }
  function inCheck(g, color) { var ks = kingSq(g.b, color); if (ks < 0) return false; return attacked(g.b, Math.floor(ks / 8), ks % 8, color === "w" ? "b" : "w"); }

  function addPawnMoves(list, from, to, promoRank, flag) {
    var pr = Math.floor(to / 8);
    if (pr === promoRank) { ["Q", "R", "B", "N"].forEach(function (pp) { list.push({ from: from, to: to, promo: pp, flag: flag }); }); }
    else list.push({ from: from, to: to, promo: null, flag: flag });
  }

  function pseudoMoves(g) {
    var b = g.b, turn = g.turn, moves = [], i, r, c, p, rr, cc, j, dir, startRow, promoRow;
    for (i = 0; i < 64; i++) {
      p = b[i]; if (p === "." || col(p) !== turn) continue;
      r = Math.floor(i / 8); c = i % 8;
      var P = p.toUpperCase();
      if (P === "P") {
        dir = turn === "w" ? -1 : 1; startRow = turn === "w" ? 6 : 1; promoRow = turn === "w" ? 0 : 7;
        if (inb(r + dir, c) && b[idx(r + dir, c)] === ".") {
          addPawnMoves(moves, i, idx(r + dir, c), promoRow, "n");
          if (r === startRow && b[idx(r + 2 * dir, c)] === ".") moves.push({ from: i, to: idx(r + 2 * dir, c), promo: null, flag: "2" });
        }
        [c - 1, c + 1].forEach(function (nc) {
          if (!inb(r + dir, nc)) return;
          var t = idx(r + dir, nc), tp = b[t];
          if (tp !== "." && col(tp) !== turn) addPawnMoves(moves, i, t, promoRow, "c");
          else if (t === g.ep) moves.push({ from: i, to: t, promo: null, flag: "e" });
        });
      } else if (P === "N") {
        for (j = 0; j < KN.length; j++) { rr = r + KN[j][0]; cc = c + KN[j][1]; if (!inb(rr, cc)) continue; if (col(b[idx(rr, cc)]) !== turn) moves.push({ from: i, to: idx(rr, cc), promo: null, flag: b[idx(rr, cc)] === "." ? "n" : "c" }); }
      } else if (P === "K") {
        for (rr = r - 1; rr <= r + 1; rr++) for (cc = c - 1; cc <= c + 1; cc++) { if ((rr !== r || cc !== c) && inb(rr, cc) && col(b[idx(rr, cc)]) !== turn) moves.push({ from: i, to: idx(rr, cc), promo: null, flag: b[idx(rr, cc)] === "." ? "n" : "c" }); }
        // castling
        var opp = turn === "w" ? "b" : "w", home = turn === "w" ? 7 : 0;
        if (r === home && c === 4 && !attacked(b, home, 4, opp)) {
          var kR = turn === "w" ? g.castle.K : g.castle.k, qR = turn === "w" ? g.castle.Q : g.castle.q;
          if (kR && b[idx(home, 5)] === "." && b[idx(home, 6)] === "." && b[idx(home, 7)].toUpperCase() === "R" && !attacked(b, home, 5, opp) && !attacked(b, home, 6, opp)) moves.push({ from: i, to: idx(home, 6), promo: null, flag: "k" });
          if (qR && b[idx(home, 3)] === "." && b[idx(home, 2)] === "." && b[idx(home, 1)] === "." && b[idx(home, 0)].toUpperCase() === "R" && !attacked(b, home, 3, opp) && !attacked(b, home, 2, opp)) moves.push({ from: i, to: idx(home, 2), promo: null, flag: "q" });
        }
      } else { // sliders R,B,Q
        var dlist = P === "R" ? DIRS_R : P === "B" ? DIRS_B : DIRS_R.concat(DIRS_B);
        for (j = 0; j < dlist.length; j++) { rr = r; cc = c; for (;;) { rr += dlist[j][0]; cc += dlist[j][1]; if (!inb(rr, cc)) break; var tp2 = b[idx(rr, cc)]; if (tp2 === ".") { moves.push({ from: i, to: idx(rr, cc), promo: null, flag: "n" }); continue; } if (col(tp2) !== turn) moves.push({ from: i, to: idx(rr, cc), promo: null, flag: "c" }); break; } }
      }
    }
    return moves;
  }

  // apply a move, return NEW game
  function makeMove(g, m) {
    var ng = clone(g), b = ng.b, p = b[m.from], turn = g.turn, home = turn === "w" ? 7 : 0;
    b[m.to] = m.promo ? (turn === "w" ? m.promo : m.promo.toLowerCase()) : p;
    b[m.from] = ".";
    if (m.flag === "e") { var capR = turn === "w" ? Math.floor(m.to / 8) + 1 : Math.floor(m.to / 8) - 1; b[idx(capR, m.to % 8)] = "."; }
    if (m.flag === "k") { b[idx(home, 5)] = b[idx(home, 7)]; b[idx(home, 7)] = "."; }
    if (m.flag === "q") { b[idx(home, 3)] = b[idx(home, 0)]; b[idx(home, 0)] = "."; }
    // castling rights
    if (p === "K") { ng.castle.K = ng.castle.Q = false; } if (p === "k") { ng.castle.k = ng.castle.q = false; }
    if (m.from === 63 || m.to === 63) ng.castle.K = false; if (m.from === 56 || m.to === 56) ng.castle.Q = false;
    if (m.from === 7 || m.to === 7) ng.castle.k = false; if (m.from === 0 || m.to === 0) ng.castle.q = false;
    ng.ep = (m.flag === "2") ? idx((Math.floor(m.from / 8) + Math.floor(m.to / 8)) / 2, m.from % 8) : -1;
    ng.turn = turn === "w" ? "b" : "w";
    return ng;
  }

  function legalMoves(g) {
    var ps = pseudoMoves(g), out = [], i, ng;
    for (i = 0; i < ps.length; i++) { ng = makeMove(g, ps[i]); if (!inCheck(ng, g.turn)) out.push(ps[i]); }
    return out;
  }

  function statusOf(g) {
    var lm = legalMoves(g), chk = inCheck(g, g.turn);
    if (lm.length === 0) return chk ? "checkmate" : "stalemate";
    return chk ? "check" : "normal";
  }

  // perft (correctness test)
  function perft(g, d) { if (d === 0) return 1; var lm = legalMoves(g), n = 0, i; for (i = 0; i < lm.length; i++) n += perft(makeMove(g, lm[i]), d - 1); return n; }

  // ---------- AI ----------
  var VAL = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
  // piece-square (white perspective, index r*8+c with r0=top); mirror for black
  var PST_P = [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0];
  var PST_N = [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30, -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50];
  function evalBoard(b) {
    var s = 0, i, p, P, pst;
    for (i = 0; i < 64; i++) { p = b[i]; if (p === ".") continue; P = p.toUpperCase(); var v = VAL[P]; pst = P === "P" ? PST_P : P === "N" ? PST_N : null;
      if (isW(p)) { s += v + (pst ? pst[i] : 0); } else { s -= v + (pst ? pst[63 - i] : 0); } }
    return s; // + = good for white
  }
  function negamax(g, d, alpha, beta) {
    if (d === 0) { var e = evalBoard(g.b); return g.turn === "w" ? e : -e; }
    var lm = legalMoves(g);
    if (lm.length === 0) { return inCheck(g, g.turn) ? -100000 - d : 0; } // mate / stalemate
    // order: captures first
    lm.sort(function (a, b2) { return (b2.flag === "c" ? 1 : 0) - (a.flag === "c" ? 1 : 0); });
    var best = -Infinity, i, sc;
    for (i = 0; i < lm.length; i++) { sc = -negamax(makeMove(g, lm[i]), d - 1, -beta, -alpha); if (sc > best) best = sc; if (best > alpha) alpha = best; if (alpha >= beta) break; }
    return best;
  }
  function bestMove(g, depth) {
    var lm = legalMoves(g); if (!lm.length) return null;
    lm.sort(function (a, b2) { return (b2.flag === "c" ? 1 : 0) - (a.flag === "c" ? 1 : 0); });
    var best = -Infinity, pick = lm[0], i, sc, ties = [];
    for (i = 0; i < lm.length; i++) { sc = -negamax(makeMove(g, lm[i]), depth - 1, -Infinity, Infinity); if (sc > best) { best = sc; pick = lm[i]; ties = [lm[i]]; } else if (sc === best) ties.push(lm[i]); }
    return ties[Math.floor((ties.length) * pseudoRand()) % ties.length] || pick;
  }
  var _seed = 1;
  function pseudoRand() { _seed = (_seed * 1103515245 + 12345) & 0x7fffffff; return _seed / 0x7fffffff; }

  // ---------- glyphs + helpers ----------
  var FIG = { p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚" };
  function sqName(i) { return "abcdefgh"[i % 8] + (8 - Math.floor(i / 8)); }

  // ---------- UI ----------
  function mount(el, opts) {
    opts = opts || {};
    var state = { g: newGame(), mode: "ai", human: "w", depth: 2, sel: -1, legal: [], last: null, over: false, thinking: false, history: [] };

    function diffDepth(name) { return name === "easy" ? 1 : name === "hard" ? 3 : 2; }

    function render() {
      var g = state.g, flip = state.mode === "ai" && state.human === "b";
      var st = statusOf(g);
      var order = [];
      for (var i = 0; i < 64; i++) order.push(i);
      if (flip) order.reverse();
      var html = '<div class="cw-bar">' +
        '<div class="cw-status" id="cwStatus"></div>' +
        '<div class="cw-ctrls">' +
          '<select id="cwMode" class="cw-sel"><option value="ai"' + (state.mode === "ai" ? " selected" : "") + '>vs Computer</option><option value="2p"' + (state.mode === "2p" ? " selected" : "") + '>2 Players</option></select>' +
          '<select id="cwSide" class="cw-sel"' + (state.mode === "ai" ? "" : " disabled") + '><option value="w"' + (state.human === "w" ? " selected" : "") + '>Play White</option><option value="b"' + (state.human === "b" ? " selected" : "") + '>Play Black</option></select>' +
          '<select id="cwDiff" class="cw-sel"' + (state.mode === "ai" ? "" : " disabled") + '><option value="easy"' + (state.depth === 1 ? " selected" : "") + '>Easy</option><option value="medium"' + (state.depth === 2 ? " selected" : "") + '>Medium</option><option value="hard"' + (state.depth === 3 ? " selected" : "") + '>Hard</option></select>' +
          '<button class="cw-btn" id="cwNew">New game</button>' +
          '<button class="cw-btn ghost" id="cwUndo">Undo</button>' +
        '</div></div>' +
        '<div class="cw-board' + (flip ? " flip" : "") + '" id="cwBoard">';
      order.forEach(function (i) {
        var r = Math.floor(i / 8), c = i % 8, dark = (r + c) % 2 === 1, p = g.b[i];
        var cls = "cw-sq " + (dark ? "dk" : "lt");
        if (i === state.sel) cls += " sel";
        if (state.last && (i === state.last.from || i === state.last.to)) cls += " last";
        var dot = state.legal.indexOf(i) >= 0 ? '<span class="cw-dot' + (p !== "." ? " cap" : "") + '"></span>' : "";
        html += '<div class="' + cls + '" data-i="' + i + '">' + dot + (p !== "." ? '<span class="cw-pc ' + (isW(p) ? "w" : "b") + '">' + FIG[p.toLowerCase()] + '</span>' : "") + '</div>';
      });
      html += '</div><div class="cw-note">Tip: tap a piece to see where it can go, then tap a square to move.</div>';
      el.innerHTML = html;

      var stEl = document.getElementById("cwStatus");
      var who = g.turn === "w" ? "White" : "Black";
      if (st === "checkmate") stEl.innerHTML = "🏆 Checkmate! <b>" + (g.turn === "w" ? "Black" : "White") + " wins.</b>";
      else if (st === "stalemate") stEl.innerHTML = "🤝 Stalemate — it's a draw.";
      else if (state.thinking) stEl.innerHTML = "🤔 Computer is thinking…";
      else stEl.innerHTML = (st === "check" ? "⚠️ " + who + " is in check! " : "") + "<b>" + who + "</b> to move.";

      document.getElementById("cwMode").onchange = function () { state.mode = this.value; newGameBtn(); };
      document.getElementById("cwSide").onchange = function () { state.human = this.value; newGameBtn(); };
      document.getElementById("cwDiff").onchange = function () { state.depth = diffDepth(this.value); };
      document.getElementById("cwNew").onclick = newGameBtn;
      document.getElementById("cwUndo").onclick = undo;
      Array.prototype.forEach.call(el.querySelectorAll(".cw-sq"), function (sq) { sq.onclick = function () { onSquare(+sq.dataset.i); }; });
    }

    function newGameBtn() { state.g = newGame(); state.sel = -1; state.legal = []; state.last = null; state.over = false; state.thinking = false; state.reported = false; state.history = []; render(); maybeAI(); }
    function undo() { if (state.thinking) return; var back = state.mode === "ai" ? 2 : 1; while (back-- > 0 && state.history.length) { var h = state.history.pop(); state.g = h.g; state.last = h.last; } state.sel = -1; state.legal = []; render(); }

    function legalTo(from) { return legalMoves(state.g).filter(function (m) { return m.from === from; }); }

    function onSquare(i) {
      if (state.over || state.thinking) return;
      if (state.mode === "ai" && state.g.turn !== state.human) return;
      var g = state.g, p = g.b[i];
      if (state.sel >= 0) {
        var mv = legalTo(state.sel).filter(function (m) { return m.to === i; });
        if (mv.length) { return doMove(choosePromo(mv)); }
      }
      if (p !== "." && col(p) === g.turn) { state.sel = i; state.legal = legalTo(i).map(function (m) { return m.to; }); render(); }
      else { state.sel = -1; state.legal = []; render(); }
    }

    function choosePromo(mvs) {
      if (mvs.length === 1) return mvs[0];
      // promotion choices: default to Queen (kids can change later); pick Q
      var q = mvs.filter(function (m) { return m.promo === "Q"; }); return q[0] || mvs[0];
    }

    function doMove(m) {
      state.history.push({ g: clone(state.g), last: state.last });
      state.g = makeMove(state.g, m);
      state.last = { from: m.from, to: m.to };
      state.sel = -1; state.legal = [];
      var st = statusOf(state.g);
      if (st === "checkmate" || st === "stalemate") {
        state.over = true; render();
        if (state.mode === "2p" && !state.reported && opts.onResult) {
          state.reported = true;
          opts.onResult({ result: st === "stalemate" ? "draw" : (state.g.turn === "w" ? "b" : "w"), status: st });
        }
        return;
      }
      render(); maybeAI();
    }

    function maybeAI() {
      if (state.mode !== "ai" || state.g.turn === state.human || state.over) return;
      state.thinking = true; render();
      setTimeout(function () {
        var m = bestMove(state.g, state.depth);
        state.thinking = false;
        if (!m) { state.over = true; render(); return; }
        state.history.push({ g: clone(state.g), last: state.last });
        state.g = makeMove(state.g, m); state.last = { from: m.from, to: m.to };
        var st = statusOf(state.g); if (st === "checkmate" || st === "stalemate") state.over = true;
        render();
      }, 250);
    }

    render(); maybeAI();
  }

  window.Chess = { mount: mount, _engine: { newGame: newGame, legalMoves: legalMoves, makeMove: makeMove, perft: perft, statusOf: statusOf, bestMove: bestMove, sqName: sqName, inCheck: inCheck } };
})();
