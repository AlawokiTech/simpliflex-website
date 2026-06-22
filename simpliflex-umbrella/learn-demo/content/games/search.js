__article({
  id: "search-how", cat: "games", game: "search", title: "How to Play Word Search", emoji: "🔍", scene: "generic",
  blurb: "Hidden words are tucked away in a grid of letters — find them all!",
  intro: "A Word Search is a grid full of letters with several real words hidden inside. The words you need to find are listed below the grid, grouped by a theme.",
  sections: [
    { h: "Finding a Word", body: "<p>When you spot a word, tap its <b>first letter</b> and then its <b>last letter</b>. If you are right, the word lights up green and gets crossed off the list. Find every word to win! 🎉 Press <b>🔄 New puzzle</b> for a fresh grid.</p>" },
    { h: "Words Hide in Many Directions", body: "<p>Words can run across, down, diagonally, and even <b>backwards</b>. Do not just look left to right — a word might be climbing upward or sliding along a diagonal.</p><p><a class='ilink' href='#/play/search'>🔍 Play Word Search now</a></p>" }
  ],
  facts: [
    "A word in a word search can be written in any of eight directions.",
    "The leftover letters in a word search are random — only the listed words are hidden on purpose."
  ],
  dyk: "Did you know? Word searches were first printed in newspapers in the 1960s and quickly became a worldwide favourite.",
  related: ["search-strategy", "search-directions"]
});

__article({
  id: "search-strategy", cat: "games", game: "search", title: "Tip: Search in a System", emoji: "🧭", scene: "generic",
  blurb: "Hunting randomly is slow. A simple method finds every word faster.",
  intro: "Good word-search solvers do not just stare at the grid — they follow a system so they never miss a word.",
  sections: [
    { h: "Hunt the First Letter", body: "<p>Pick a word from the list and look only for its <b>first letter</b> in the grid. Each time you find that letter, glance in every direction to see if the rest of the word follows. This is much faster than scanning the whole grid at once.</p>" },
    { h: "Scan Row by Row", body: "<p>Sweep your eyes along each row from top to bottom, then down each column. Unusual letters like <b>Q, Z, X or J</b> are easy to spot — if a word contains one, find that rare letter first and the word is usually nearby.</p><p><a class='ilink' href='#/play/search'>🔍 Try the method</a></p>" }
  ],
  facts: [
    "Searching for one target letter at a time is the fastest proven strategy.",
    "Rare letters stand out, making words that contain them easier to find."
  ],
  dyk: "Did you know? Searching carefully row by row builds the same focus skills that help with reading and proofreading.",
  related: ["search-directions", "search-how"]
});

__article({
  id: "search-directions", cat: "games", game: "search", title: "Tip: Check All Eight Directions", emoji: "🧩", scene: "generic",
  blurb: "A word can be hidden in any of eight directions — remember to look every way.",
  intro: "Many words are missed simply because the solver forgot to look diagonally or backwards. Train yourself to check all eight directions from each starting letter.",
  sections: [
    { h: "The Eight Directions", body: "<p>From any letter a word might go: <b>→</b> right, <b>←</b> left, <b>↑</b> up, <b>↓</b> down, and the four diagonals <b>↗ ↘ ↙ ↖</b>. When you find a promising first letter, quickly sweep around it like the hand of a clock.</p>" },
    { h: "Do Not Forget Backwards", body: "<p>Words written right-to-left or bottom-to-top are the trickiest to spot. If you cannot find a word, try reading the grid backwards along rows, columns and diagonals — it may be hiding in reverse!</p><p><a class='ilink' href='#/play/search'>🔍 Find them all</a></p>" }
  ],
  facts: [
    "There are exactly eight straight directions a word can take in a grid.",
    "Backwards and diagonal words are the ones solvers miss most often."
  ],
  dyk: "Did you know? Checking diagonals trains your eyes to notice patterns — a handy skill in maths and puzzles too.",
  related: ["search-strategy", "search-how"]
});
