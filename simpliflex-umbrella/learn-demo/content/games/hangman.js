__article({
  id: "hangman-how", cat: "games", game: "hangman", title: "How to Play Hangman", emoji: "🪢", scene: "generic",
  blurb: "Guess the hidden word one letter at a time — before your hearts run out!",
  intro: "In Hangman a secret word is hidden behind blank slots, and you are told its <b>theme</b>. You guess letters one at a time to reveal the word. You start with six hearts ❤️ — every wrong guess costs one.",
  sections: [
    { h: "Making Guesses", body: "<p>Tap a letter (or press it on your keyboard). If it is in the word, it appears in every slot it belongs to. If it is not, you lose a heart. Reveal the whole word before your hearts run out and you win! 🎉</p>" },
    { h: "Use the Theme", body: "<p>The theme at the top (such as Food, Sports or Space) narrows down what the word could be, so you can guess more cleverly. Read it before you start guessing.</p><p><a class='ilink' href='#/play/hangman'>🪢 Play Hangman now</a></p>" }
  ],
  facts: [
    "Hangman is a classic word game that has been played with paper and pencil for over 100 years.",
    "You have six guesses to spare, so choose your letters thoughtfully."
  ],
  dyk: "Did you know? Hangman helps you learn spelling, because you picture the whole word as you fill in the gaps.",
  related: ["hangman-letters", "hangman-patterns"]
});

__article({
  id: "hangman-letters", cat: "games", game: "hangman", title: "Tip: Guess the Common Letters First", emoji: "🔤", scene: "generic",
  blurb: "Not all letters are equally common. Start with the ones most likely to be in the word.",
  intro: "Some letters appear in English words far more often than others. Guessing the common ones first reveals more slots and wastes fewer hearts.",
  sections: [
    { h: "Start with Vowels", body: "<p>Almost every word contains a <b>vowel</b>, so begin with <b>E, A</b> and then <b>I, O, U</b>. E is the most common letter of all. Knowing where the vowels sit gives the word its shape.</p>" },
    { h: "Then the Common Consonants", body: "<p>After vowels, try the most common consonants — a handy order is <b>T, N, S, R, L, D</b>. Save rare letters like J, Q, X and Z for last, unless the theme suggests them. A good memory aid for the top letters is the made-up word <b>'ETAOIN SRDL'</b>.</p><p><a class='ilink' href='#/play/hangman'>🪢 Try this strategy</a></p>" }
  ],
  facts: [
    "The most common letters in English are roughly E, T, A, O, I, N, S, R.",
    "The least common letters are J, Q, X and Z."
  ],
  dyk: "Did you know? Code-breakers use letter frequency — how often each letter appears — to crack secret messages, just like a clever Hangman player!",
  related: ["hangman-patterns", "hangman-how"]
});

__article({
  id: "hangman-patterns", cat: "games", game: "hangman", title: "Tip: Read the Clues in the Word", emoji: "🧠", scene: "generic",
  blurb: "The word's length, theme and the letters you have already found all hint at what comes next.",
  intro: "Every letter you reveal is a clue. Combine the word length, the theme and the pattern of revealed letters to make smart guesses instead of random ones.",
  sections: [
    { h: "Use the Pattern So Far", body: "<p>Suppose you have revealed <b>_ I G E _</b> and the theme is Animals. The shape and theme point strongly to <b>TIGER</b>. Once a few letters are in place, the rest of the word often becomes obvious.</p>" },
    { h: "Think About Letter Teams", body: "<p>If you have found a Q, the next letter is almost always U. If you see a double slot at the end, common doubles are <b>LL, SS, EE, OO</b>. Letters that travel together help you fill gaps fast.</p><p><a class='ilink' href='#/play/hangman'>🪢 Put it into practice</a></p>" }
  ],
  facts: [
    "The letter Q is almost always followed by U in English.",
    "Common double letters include LL, SS, EE, OO and TT."
  ],
  dyk: "Did you know? Your brain can often recognise a word from just a few letters and its length — a skill that makes you a faster reader too.",
  related: ["hangman-letters", "hangman-how"]
});
