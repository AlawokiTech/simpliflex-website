__article({
  id: "chess-king",
  cat: "games",
  title: "The King ♚",
  emoji: "♚",
  scene: "generic",
  accents: ["♟️","♚","♛","♞"],
  blurb: "The most important piece on the board — protect it with your life!",
  intro: "The <b>king</b> is the most important piece in chess. If your king is captured, you lose the game. Every single decision you make should keep your king safe. It is not the most powerful piece — but it is the one that matters most.",
  sections: [
    {
      h: "How the King Moves",
      body: "<p>The king can move <b>one square in any direction</b> — forwards, backwards, sideways, or diagonally. That gives it up to eight possible moves from the middle of the board.</p><p>The king cannot move to a square where it would be in danger. You are never allowed to walk your king into an attack.</p>"
    },
    {
      h: "Why the King Needs Protecting",
      body: "<p>Because losing the king means losing the game, players work hard to keep it safe. A common trick is to <b>castle</b> early — a special move that tucks the king behind a wall of pawns (see [[chess-special-moves]]).</p><p>In the <b>endgame</b>, when most pieces have been captured, the king becomes an active fighter and can march towards the centre of the board to help win.</p>"
    }
  ],
  facts: [
    "The king can move in 8 directions, but only one square at a time.",
    "You cannot move your king to a square attacked by an enemy piece.",
    "The game ends the moment the king cannot escape capture — that is called checkmate (see [[chess-check-checkmate]]).",
    "Two kings can never stand next to each other — each would be putting itself in danger.",
    "In the endgame, an active king is one of the strongest pieces left on the board."
  ],
  dyk: "Did you know that the king piece has never changed much in 1,500 years of chess history — it has always been the piece you must protect at all costs?",
  words: [
    { w: "endgame", d: "the final stage of a chess game when few pieces are left" },
    { w: "capture", d: "to remove an opponent's piece from the board by moving onto its square" },
    { w: "castle (castling)", d: "a special move where the king and rook move together for safety" }
  ],
  related: ["chess", "chess-board", "chess-queen", "chess-rook", "chess-check-checkmate", "chess-special-moves"],
  hunt: [
    { q: "How many squares can the king move at a time?", a: "One square in any direction." },
    { q: "Can the king move to a square attacked by an enemy?", a: "No — that is never allowed." }
  ]
});

__article({
  id: "chess-check-checkmate",
  cat: "games",
  title: "Check, Checkmate & Stalemate",
  emoji: "♔",
  scene: "generic",
  accents: ["♟️","♚","♛","♞"],
  blurb: "Three powerful words that decide whether the game continues or ends!",
  intro: "In chess, three special situations can happen to the king: <b>check</b>, <b>checkmate</b>, and <b>stalemate</b>. Knowing the difference between them is one of the most important skills you can learn. They all involve the king — but they lead to very different results.",
  sections: [
    {
      h: "Check and Checkmate",
      body: "<p><b>Check</b> means your king is being attacked right now. You <i>must</i> get out of check on your very next move. You have three ways to escape: move the king away, block the attack with another piece, or capture the attacking piece.</p><p><b>Checkmate</b> (often written as '#') means the king is in check <i>and</i> there is no possible escape. The game ends immediately — the player whose king is checkmated loses. See [[chess-notation]] for how these are written.</p>"
    },
    {
      h: "Stalemate — the Surprise Draw",
      body: "<p><b>Stalemate</b> is a sneaky result. It happens when a player has <i>no legal move</i> on their turn, but their king is <i>not</i> in check. Because they cannot move, the game ends in a <b>draw</b> — neither player wins.</p><p>Stalemate can save a losing player! If you are losing badly, try to manoeuvre your king so your opponent accidentally causes stalemate — it is a legal escape route.</p>"
    }
  ],
  facts: [
    "When your king is in check, you MUST deal with it — you cannot ignore it and make a different move.",
    "Checkmate ends the game instantly; there is no need to actually capture the king.",
    "Stalemate is a draw, even if one player has many more pieces than the other.",
    "The word 'checkmate' comes from the Persian phrase 'shah mat', meaning 'the king is helpless'.",
    "A game can also be drawn by agreement, by repeating the same position three times, or by 50 moves with no capture or pawn move."
  ],
  dyk: "Did you know that 'checkmate' comes from a Persian phrase — chess was invented in ancient India and spread through Persia before reaching Europe (see [[chess-famous]])?",
  words: [
    { w: "check", d: "when a king is directly attacked by an enemy piece" },
    { w: "checkmate", d: "when a king is in check and has no way to escape — the game is over" },
    { w: "stalemate", d: "when a player has no legal move but is not in check — the game is a draw" }
  ],
  related: ["chess-king", "chess-notation", "chess-special-moves", "chess-tactics", "chess", "chess-openings"],
  hunt: [
    { q: "What must you do if your king is in check?", a: "You must escape check on your very next move — move the king, block, or capture the attacker." },
    { q: "What is stalemate?", a: "When a player has no legal move but is NOT in check — the game is a draw." }
  ]
});

__article({
  id: "chess-special-moves",
  cat: "games",
  title: "Special Moves",
  emoji: "🏰",
  scene: "generic",
  accents: ["♟️","♚","♛","♞"],
  blurb: "Chess has three secret tricks that surprise beginners — learn them here!",
  intro: "Most chess pieces move in a straightforward way, but chess also has three <b>special moves</b> that surprise players who don't know them. These moves are <b>castling</b>, <b>en passant</b>, and <b>promotion</b>. Each one follows precise rules, and each one can change a game in an instant.",
  sections: [
    {
      h: "Castling and En Passant",
      body: "<p><b>Castling</b> is the only move where two pieces move at once. The [[chess-king]] slides two squares towards a [[chess-rook]], and the rook jumps to the other side of the king. You can only castle if: neither piece has moved before, there are no pieces between them, the king is not in [[chess-check-checkmate|check]], and the king does not pass through an attacked square.</p><p><b>En passant</b> (French for 'in passing') is a special pawn capture. If your pawn is on the fifth rank and an enemy [[chess-pawn]] moves two squares forward to land beside it, you may capture it <i>as if</i> it had only moved one square. You must do this immediately on the very next move, or the chance is gone.</p>"
    },
    {
      h: "Promotion — Pawn Becomes Queen",
      body: "<p><b>Promotion</b> happens when a [[chess-pawn]] reaches the far end of the board (the eighth rank for White, the first rank for Black). The pawn is immediately replaced by any other piece the player chooses — almost always a [[chess-queen]], the most powerful piece.</p><p>You can even promote to a [[chess-knight]], [[chess-bishop]], or [[chess-rook]]. Sometimes a knight is better than a queen in a tricky position! This is called <b>underpromotion</b>.</p>"
    }
  ],
  facts: [
    "Castling is the only chess move where you move two of your own pieces in one turn.",
    "There are two types of castling: kingside (O-O) and queenside (O-O-O) — see [[chess-notation]].",
    "En passant must be taken immediately — wait one move and you lose the right forever.",
    "A pawn that promotes to a queen gains enormous power — it can move in any direction any number of squares.",
    "You can have two queens on the board at the same time if a pawn promotes!"
  ],
  dyk: "Did you know that en passant confused so many players when it was introduced that there were arguments about whether it was a legal move at all?",
  words: [
    { w: "castling", d: "a special move where the king and rook swap positions for safety" },
    { w: "en passant", d: "a special pawn capture where you take a pawn that has just moved two squares past you" },
    { w: "promotion", d: "when a pawn reaches the last rank and becomes a more powerful piece" }
  ],
  related: ["chess-king", "chess-rook", "chess-pawn", "chess-queen", "chess-check-checkmate", "chess-notation"],
  hunt: [
    { q: "What is promotion in chess?", a: "When a pawn reaches the far end of the board and becomes another piece, usually a queen." },
    { q: "When must you use en passant?", a: "Immediately on the very next move after the enemy pawn passes — you cannot wait." }
  ]
});

__article({
  id: "chess-notation",
  cat: "games",
  title: "Chess Notation",
  emoji: "📝",
  scene: "generic",
  accents: ["♟️","♚","♛","♞"],
  blurb: "Chess has its own writing system so you can record, read, and replay any game!",
  intro: "Chess has a clever way of writing down every move called <b>algebraic notation</b>. It uses letters and numbers to name every square on the board. Once you know it, you can read famous games from history, share your own games with friends, and follow chess books and videos.",
  sections: [
    {
      h: "Files, Ranks, and Piece Letters",
      body: "<p>The board is like a grid. The <b>columns</b> (called <b>files</b>) are labelled <b>a to h</b> from left to right. The <b>rows</b> (called <b>ranks</b>) are numbered <b>1 to 8</b> from White's side. Every square has a unique name — for example, <b>e4</b> is the square on file e, rank 4.</p><p>Each piece has a capital letter: <b>K</b> = King, <b>Q</b> = Queen, <b>R</b> = Rook, <b>B</b> = Bishop, <b>N</b> = Knight. Pawns have no letter — just the square they move to.</p>"
    },
    {
      h: "Symbols and Reading a Move",
      body: "<p>A few symbols do most of the work: <b>x</b> means capture, <b>+</b> means [[chess-check-checkmate|check]], <b>#</b> means [[chess-check-checkmate|checkmate]], <b>O-O</b> means kingside [[chess-special-moves|castling]], and <b>O-O-O</b> means queenside castling.</p><p>So <b>Nf3</b> means 'knight moves to f3'; <b>exd5</b> means 'pawn on the e-file captures on d5'; <b>Qh5+</b> means 'queen moves to h5, giving check'. Once you read a few games, it becomes second nature.</p>"
    }
  ],
  facts: [
    "Algebraic notation has been the world standard for recording chess since 1981.",
    "The very first move of many famous games is '1. e4' — the king's pawn moving two squares forward.",
    "An exclamation mark (!) after a move means it was a brilliant move; a question mark (?) means a mistake.",
    "Chess databases hold millions of recorded games, all written in algebraic notation.",
    "Before algebraic notation, a much harder system called 'descriptive notation' was used in English-speaking countries."
  ],
  dyk: "Did you know that the famous opening move '1. e4' was called 'best by test' by the legendary world champion Bobby Fischer (see [[chess-famous]])?",
  words: [
    { w: "file", d: "a column of squares on a chessboard, labelled a to h" },
    { w: "rank", d: "a row of squares on a chessboard, numbered 1 to 8" },
    { w: "algebraic notation", d: "the standard system for writing chess moves using letters and numbers" }
  ],
  related: ["chess-board", "chess-special-moves", "chess-check-checkmate", "chess-openings", "chess-tactics", "chess-famous"],
  hunt: [
    { q: "What does the symbol '+' mean in chess notation?", a: "Check — the king is under attack." },
    { q: "Which letter stands for the knight in chess notation?", a: "N (because K is already used for King)." }
  ]
});

__article({
  id: "chess-tactics",
  cat: "games",
  title: "Chess Tactics",
  emoji: "⚔️",
  scene: "generic",
  accents: ["♟️","♚","♛","♞"],
  blurb: "Learn the sneaky tricks that win pieces and decide games!",
  intro: "A <b>tactic</b> is a short, clever sequence of moves that wins material (pieces) or leads straight to [[chess-check-checkmate|checkmate]]. Even beginners can learn a few key tactics and immediately start winning more games. The three most important are the <b>fork</b>, the <b>pin</b>, and the <b>skewer</b>.",
  sections: [
    {
      h: "The Fork and the Pin",
      body: "<p>A <b>fork</b> is when one piece attacks two enemy pieces at the same time. The opponent can only save one — you capture the other for free! The [[chess-knight]] is the king of forks because it jumps in unexpected ways. A knight forking a [[chess-king]] and a [[chess-queen]] forces the king to move, and you win the queen.</p><p>A <b>pin</b> is when you attack a piece that cannot move because a more valuable piece stands behind it. For example, if a bishop attacks a knight that is in front of the opponent's king, the knight is pinned — moving it would expose the king to [[chess-check-checkmate|check]], which is illegal.</p>"
    },
    {
      h: "The Skewer",
      body: "<p>A <b>skewer</b> is the opposite of a pin. You attack a <i>valuable</i> piece directly and it must move — revealing a less valuable piece behind it, which you then capture.</p><p>For example, a rook attacks the enemy [[chess-queen]]. The queen runs away, but the [[chess-rook]] behind it is now captured. Tactics like these can change the game in just one or two moves, so always look for them before deciding what to do!</p>"
    }
  ],
  facts: [
    "A fork with a knight is one of the most common tactics at beginner and intermediate level.",
    "An 'absolute pin' is when the piece behind the pinned piece is the king — the pinned piece literally cannot move.",
    "A 'discovered attack' is another tactic: moving one piece reveals a hidden attack from a piece behind it.",
    "Learning tactics is often faster than improving your opening or endgame — they have a big immediate impact.",
    "Chess puzzles (tactical exercises) are the best way to train your eye to spot these patterns quickly."
  ],
  dyk: "Did you know that the 'knight fork' is so feared that a knight forking the king and queen at the same time is nicknamed a 'family fork' when it attacks king, queen, and rook all at once?",
  words: [
    { w: "fork", d: "a move that attacks two enemy pieces at the same time" },
    { w: "pin", d: "when a piece cannot move because a more valuable piece is behind it and would be exposed" },
    { w: "skewer", d: "an attack on a valuable piece that forces it to move, exposing a less valuable piece behind it" }
  ],
  related: ["chess-knight", "chess-queen", "chess-rook", "chess-bishop", "chess-check-checkmate", "chess-openings"],
  hunt: [
    { q: "Which piece is best known for delivering forks?", a: "The knight, because it jumps in surprising directions." },
    { q: "What is the difference between a pin and a skewer?", a: "In a pin the valuable piece is BEHIND the attacked piece; in a skewer the valuable piece is IN FRONT and must move." }
  ]
});

__article({
  id: "chess-openings",
  cat: "games",
  title: "Opening Principles",
  emoji: "🌅",
  scene: "generic",
  accents: ["♟️","♚","♛","♞"],
  blurb: "Start your game the right way with four golden rules every chess player knows!",
  intro: "The first few moves of a chess game are called the <b>opening</b>. A good opening gives your pieces room to work, keeps your [[chess-king]] safe, and makes it harder for your opponent to attack. You don't need to memorise dozens of opening names — just follow four simple principles and you will start every game strongly.",
  sections: [
    {
      h: "Control the Centre and Develop Your Pieces",
      body: "<p>The four central squares (e4, d4, e5, d5) are the most important on the [[chess-board]]. Pieces in the centre control more of the board. Start by moving a central pawn one or two squares to open lines for your other pieces.</p><p><b>Develop</b> means moving your [[chess-knight|knights]] and [[chess-bishop|bishops]] off their starting squares as quickly as possible. Every move should bring a new piece into the game. Avoid moving the same piece twice in the opening — each move is precious.</p>"
    },
    {
      h: "Castle Early and Don't Bring the Queen Out Too Soon",
      body: "<p><b>[[chess-special-moves|Castle]]</b> your [[chess-king]] early! Castling tucks the king safely behind your pawns. A king still in the centre can be attacked quickly.</p><p>Many beginners rush the [[chess-queen]] out early because it is so powerful. But an early queen can be chased around by cheaper pieces, wasting moves. Bring your knights and bishops out first, then castle, and only then start using your queen actively.</p>"
    }
  ],
  facts: [
    "The most popular first move in chess is 1. e4 — moving the king's pawn two squares forward.",
    "The 'Sicilian Defence' (1. e4 c5) is the most played response to 1. e4 at all levels of chess.",
    "Developing both knights and bishops before moving the queen is a rule even grandmasters follow.",
    "Castling within the first ten moves is a common target for club players.",
    "Openings have famous names like the 'Italian Game', the 'French Defence', and the 'London System' — there are hundreds of them."
  ],
  dyk: "Did you know that the four opening principles — centre, develop, castle, don't move pieces twice — were written down by chess teacher Siegbert Tarrasch over 100 years ago, and they are still taught today?",
  words: [
    { w: "opening", d: "the first stage of a chess game, covering the first several moves" },
    { w: "develop", d: "to move pieces from their starting squares to active positions" },
    { w: "centre", d: "the four central squares of the board — the most important area to control" }
  ],
  related: ["chess-board", "chess-knight", "chess-bishop", "chess-special-moves", "chess-tactics", "chess-king"],
  hunt: [
    { q: "Why should you control the centre in the opening?", a: "Pieces in the centre control more of the board and have more power." },
    { q: "Why is it a mistake to bring your queen out very early?", a: "It can be chased by cheaper pieces, wasting valuable moves." }
  ]
});

__article({
  id: "chess-famous",
  cat: "games",
  title: "Famous Chess Facts & Players",
  emoji: "🏆",
  scene: "generic",
  accents: ["♟️","♚","♛","♞"],
  blurb: "Discover chess's incredible history and the legends who shaped the game!",
  intro: "Chess is one of the oldest strategy games in the world, with a history stretching back about <b>1,500 years</b>. It began in ancient India, spread across the world, and today is played by hundreds of millions of people. Along the way, some extraordinary players have become legends.",
  sections: [
    {
      h: "Where Chess Began",
      body: "<p>Chess is believed to have originated in <b>India</b> around 1,500 years ago, where it was known as <b>'chaturanga'</b> — a word referring to the four branches of the Indian army: infantry, cavalry, elephants, and chariots. These became the pieces we now call [[chess-pawn|pawns]], [[chess-knight|knights]], [[chess-bishop|bishops]], and [[chess-rook|rooks]].</p><p>The game spread to Persia, where it was called 'chatrang' and then 'shatranj'. Arab traders brought it to Europe during the Middle Ages, and the rules slowly changed into the game we play today. The [[chess-queen]] gained her enormous power only around 500 years ago.</p>"
    },
    {
      h: "World Champions and Computers",
      body: "<p>The official <b>World Chess Championship</b> has been held since 1886. Some of the most famous champions include <b>Bobby Fischer</b> (USA), who won in 1972 in a match watched by the whole world; <b>Garry Kasparov</b> (Russia), widely considered one of the greatest players of all time; and <b>Magnus Carlsen</b> (Norway), who became world champion in 2013 and held the title for a decade.</p><p>In 1997, the IBM computer <b>Deep Blue</b> defeated Kasparov in a famous match — the first time a computer beat the reigning world champion. Today, chess engines are far stronger than any human player, but chess remains a beautiful human contest of ideas.</p>"
    }
  ],
  facts: [
    "Chess is estimated to be about 1,500 years old, originating in India as 'chaturanga'.",
    "There are more possible chess games than there are atoms in the observable universe.",
    "Bobby Fischer became world champion in 1972 at the height of the Cold War, in a match that gripped the world.",
    "Garry Kasparov held the world number-one ranking for most of his career, from 1984 to 2005.",
    "Magnus Carlsen of Norway became the youngest player ever to reach world number one, at age 19."
  ],
  dyk: "Did you know that the number of possible unique chess games is so large it has never been calculated exactly — it is estimated to be around 10 to the power of 120, a number called the 'Shannon Number'?",
  words: [
    { w: "chaturanga", d: "the ancient Indian game that chess developed from, about 1,500 years ago" },
    { w: "grandmaster", d: "the highest official title awarded to a chess player by the World Chess Federation (FIDE)" },
    { w: "chess engine", d: "a computer program that plays chess, now stronger than any human" }
  ],
  related: ["chess", "chess-openings", "chess-tactics", "chess-notation", "chess-check-checkmate", "chess-queen"],
  hunt: [
    { q: "What was the ancient Indian name for chess?", a: "Chaturanga." },
    { q: "Which computer beat world champion Garry Kasparov in 1997?", a: "IBM's Deep Blue." }
  ]
});
