/* speak.js — offline read-aloud for the Curious Kids Encyclopedia.
   Uses the browser's built-in Web Speech API (speechSynthesis): 100% offline,
   no internet, no cost. Picks the best natural voice available on the device.
   Public API (window.Speak):
     supported                         -> boolean
     playSegments([{el,text,label}], startIndex)  -> read a list in order, highlighting each el
     playSegment(el, text, label)      -> read one block
     stop(), togglePause(), isActive()
*/
(function () {
  "use strict";
  var synth = window.speechSynthesis;
  var SUP = !!synth && typeof window.SpeechSynthesisUtterance !== "undefined";

  var Speak = (window.Speak = {
    supported: SUP,
    isActive: function () { return active; }
  });
  if (!SUP) { Speak.playSegments = Speak.playSegment = Speak.stop = Speak.togglePause = function () {}; return; }

  // ---------- voices ----------
  var voices = [], voice = null;
  var rate = clampRate(parseFloat(localStorage.getItem("wiki-tts-rate")) || 1);
  var savedURI = localStorage.getItem("wiki-tts-voice") || "";

  function clampRate(r) { r = r || 1; return r < 0.6 ? 0.6 : r > 1.6 ? 1.6 : Math.round(r * 10) / 10; }

  function rank(v) {
    var n = (v.name + " " + v.voiceURI).toLowerCase(), s = 0;
    if (v.localService) s += 200; else s -= 60;   // OFFLINE first — the whole app is offline
    if (/online/.test(n)) s -= 80;                // "Online" voices need internet
    if (/natural|neural/.test(n)) s += 60;        // local neural voices (Win11) are great
    if (/aria|jenny|libby|sonia|ryan|guy|michelle|emma/.test(n)) s += 30;
    if (/google/.test(n)) s += 20;
    if (/microsoft/.test(n)) s += 15;
    if (/zira|hazel|david|mark/.test(n)) s += 12;
    if (/en-gb/i.test(v.lang)) s += 6;            // family is UK-based
    if (/en-us|en-au/i.test(v.lang)) s += 4;
    return s;
  }
  function loadVoices() {
    var all = synth.getVoices() || [];
    var en = all.filter(function (v) { return /^en/i.test(v.lang); });
    voices = (en.length ? en : all).slice().sort(function (a, b) { return rank(b) - rank(a); });
    voice = (savedURI && voices.filter(function (v) { return v.voiceURI === savedURI; })[0]) || voices[0] || null;
  }
  loadVoices();
  if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = function () { loadVoices(); fillVoiceSelect(); };

  // ---------- playback state ----------
  var active = false, paused = false, segs = [], si = 0, chunks = [], ci = 0, keepAlive = null, curEl = null;

  function splitChunks(text) {
    var sentences = String(text || "").replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]*/g) || [];
    var out = [], buf = "";
    sentences.forEach(function (p) {
      p = p.trim(); if (!p) return;
      if (buf && (buf.length + p.length + 1) > 200) { out.push(buf); buf = p; }
      else { buf = buf ? buf + " " + p : p; }
    });
    if (buf) out.push(buf);
    return out;
  }
  function highlight(el) {
    if (curEl) curEl.classList.remove("speaking");
    curEl = el || null;
    if (curEl) { curEl.classList.add("speaking"); try { curEl.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {} }
  }
  function speakChunk() {
    if (!active) return;
    if (ci >= chunks.length) { si++; return nextSeg(); }
    var u = new window.SpeechSynthesisUtterance(chunks[ci]);
    if (voice) u.voice = voice;
    u.rate = rate; u.pitch = 1; u.volume = 1;
    u.onend = function () { if (!active) return; ci++; speakChunk(); };
    u.onerror = function () { if (!active) return; ci++; speakChunk(); };
    synth.speak(u);
  }
  function nextSeg() {
    if (!active) return;
    if (si >= segs.length) return stop();
    var seg = segs[si];
    highlight(seg.el);
    setLabel(seg.label || "Reading…");
    chunks = splitChunks(seg.text != null ? seg.text : (seg.el ? seg.el.textContent : ""));
    ci = 0;
    if (!chunks.length) { si++; return nextSeg(); }
    speakChunk();
  }
  function startKeepAlive() {            // Chrome stops speaking after ~15s; nudge it.
    stopKeepAlive();
    keepAlive = setInterval(function () { if (active && !paused) { try { synth.resume(); } catch (e) {} } }, 9000);
  }
  function stopKeepAlive() { if (keepAlive) { clearInterval(keepAlive); keepAlive = null; } }

  Speak.playSegments = function (segments, start) {
    segs = (segments || []).filter(function (s) { return s && (s.text || (s.el && s.el.textContent)); });
    if (!segs.length) return;
    try { synth.cancel(); } catch (e) {}
    si = Math.max(0, Math.min(start || 0, segs.length - 1));
    active = true; paused = false;
    showBar(true); updateBar(); startKeepAlive();
    nextSeg();
  };
  Speak.playSegment = function (el, text, label) { Speak.playSegments([{ el: el, text: text, label: label }], 0); };
  Speak.togglePause = function () {
    if (!active) return;
    if (paused) { synth.resume(); paused = false; } else { synth.pause(); paused = true; }
    updateBar();
  };
  function stop() {
    active = false; paused = false;
    try { synth.cancel(); } catch (e) {}
    stopKeepAlive(); highlight(null); showBar(false);
  }
  Speak.stop = stop;

  function restartCurrent() {            // re-read current segment with new voice/rate
    if (!active) return;
    try { synth.cancel(); } catch (e) {}
    ci = 0; speakChunk();
  }

  // stop speaking when navigating away or leaving the page
  window.addEventListener("hashchange", function () { if (active) stop(); });
  window.addEventListener("beforeunload", function () { try { synth.cancel(); } catch (e) {} });

  // ---------- floating player bar ----------
  var bar, btnMain, lbl, spd, vsel, built = false;
  function injectCSS() {
    if (document.getElementById("spk-css")) return;
    var css = ".spk-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:9000;display:flex;align-items:center;gap:8px;background:#1b1740;color:#fff;padding:9px 12px;border-radius:16px;box-shadow:0 16px 44px rgba(0,0,0,.42);max-width:94vw;font:600 14px/1.2 system-ui,-apple-system,sans-serif}"
      + ".spk-bar button{border:0;cursor:pointer;border-radius:11px;color:#fff;background:rgba(255,255,255,.16);padding:8px 11px;font-size:15px;line-height:1}"
      + ".spk-bar button:hover{filter:brightness(1.12)}"
      + ".spk-bar .spk-main{background:#7c5cff;min-width:42px}"
      + ".spk-bar .spk-x{background:rgba(255,90,90,.30)}"
      + ".spk-lbl{max-width:30vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.9}"
      + ".spk-grp{display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.10);border-radius:11px;padding:2px}"
      + ".spk-grp button{background:transparent;padding:6px 9px;font-size:16px}"
      + ".spk-spd{min-width:38px;text-align:center;font-size:12.5px;opacity:.92}"
      + ".spk-sel{background:rgba(255,255,255,.12);color:#fff;border:0;border-radius:9px;padding:7px;font-size:12px;max-width:130px}"
      + ".spk-sel option{color:#111}"
      + "@media(max-width:600px){.spk-lbl,.spk-sel{display:none}}";
    var st = document.createElement("style"); st.id = "spk-css"; st.textContent = css;
    document.head.appendChild(st);
  }
  function fillVoiceSelect() {
    if (!vsel) return;
    vsel.innerHTML = "";
    voices.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.voiceURI;
      o.textContent = v.name.replace(/^Microsoft\s+/i, "").replace(/\s+-\s+English.*$/i, "").replace(/Online \(Natural\)/i, "Natural") + " (" + v.lang + ")";
      if (voice && v.voiceURI === voice.voiceURI) o.selected = true;
      vsel.appendChild(o);
    });
  }
  function build() {
    if (built) return; built = true;
    injectCSS();
    bar = document.createElement("div"); bar.className = "spk-bar"; bar.style.display = "none";

    btnMain = mkbtn("⏸", "Pause / resume", "spk-main", function () { Speak.togglePause(); });

    var stopB = mkbtn("⏹", "Stop", "spk-x", function () { Speak.stop(); });

    lbl = document.createElement("span"); lbl.className = "spk-lbl"; lbl.textContent = "";

    var grp = document.createElement("div"); grp.className = "spk-grp";
    var slow = mkbtn("–", "Slower", "", function () { setRate(rate - 0.1); });
    spd = document.createElement("span"); spd.className = "spk-spd"; spd.textContent = rate.toFixed(1) + "×";
    var fast = mkbtn("+", "Faster", "", function () { setRate(rate + 0.1); });
    grp.appendChild(slow); grp.appendChild(spd); grp.appendChild(fast);

    vsel = document.createElement("select"); vsel.className = "spk-sel"; vsel.title = "Voice";
    vsel.onchange = function () { savedURI = vsel.value; localStorage.setItem("wiki-tts-voice", savedURI); loadVoices(); restartCurrent(); };
    fillVoiceSelect();

    bar.appendChild(btnMain); bar.appendChild(stopB); bar.appendChild(lbl); bar.appendChild(grp); bar.appendChild(vsel);
    document.body.appendChild(bar);
  }
  function mkbtn(txt, title, cls, fn) {
    var b = document.createElement("button"); b.textContent = txt; b.title = title; b.setAttribute("aria-label", title);
    if (cls) b.className = cls; b.onclick = fn; return b;
  }
  function setRate(r) {
    rate = clampRate(r); localStorage.setItem("wiki-tts-rate", String(rate));
    if (spd) spd.textContent = rate.toFixed(1) + "×";
    restartCurrent();
  }
  function setLabel(t) { if (lbl) lbl.textContent = "🔊 " + t; }
  function updateBar() { if (btnMain) btnMain.textContent = paused ? "▶" : "⏸"; }
  function showBar(on) { build(); if (bar) bar.style.display = on ? "flex" : "none"; }
})();
