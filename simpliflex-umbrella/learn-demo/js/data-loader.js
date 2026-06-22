/* Kids' Encyclopedia — data registry. Loaded FIRST.
   Category files call __cat({...}); article files call __article({...}).
   Everything is plain <script> includes so it works fully offline on file://. */
(function () {
  window.WIKI = { cats: [], catById: {}, articles: [], byId: {} };

  window.__cat = function (c) {
    // c: { id, name, emoji, accent, scene, blurb }
    window.WIKI.cats.push(c);
    window.WIKI.catById[c.id] = c;
  };

  window.__article = function (a) {
    /* a: {
         id, cat, title, emoji,
         scene,                // optional illustration scene name (defaults to category scene)
         accents,              // optional [emoji,...] sprinkled into the scene
         blurb,                // one friendly sentence (teaser)
         intro,                // opening paragraph (string or html)
         sections: [ {h, body} ],   // body may include simple html + [[diagram:name]] tokens
         facts: [ "..." ],     // Notable Facts & Figures
         dyk,                  // "Did you know?" one-liner
         words: [ {w, d} ],    // Word Builder vocabulary
         related: [ id, ... ], // Explore next
         hunt: [ {q, a} ]      // optional scavenger-hunt question(s) this article answers
       } */
    if (!a || !a.id) return;
    window.WIKI.articles.push(a);
    window.WIKI.byId[a.id] = a;
  };

  // attach a dated "country facts" snapshot (capital/population/leader) to an
  // already-registered article. Kept separate so it is easy to refresh yearly.
  window.__factbox = function (id, box) {
    var a = window.WIKI.byId[id];
    if (a) a.snapshot = box;
  };
})();
