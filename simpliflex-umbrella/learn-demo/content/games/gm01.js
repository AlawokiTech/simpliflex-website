__article({
  id: "chess",
  cat: "games",
  title: "Chess",
  emoji: "♟️",
  scene: "generic",
  accents: ["♟️","♞","♜","♚"],
  blurb: "Two players, 32 pieces, one board — and a battle of brains that has thrilled people for over 1,500 years!",
  intro: "Chess is a two-player strategy game played on a square board of 64 squares. One player controls the <b>White</b> pieces and the other controls the <b>Black</b> pieces. White always moves first. The aim of the game is to <b>checkmate</b> your opponent's king — to trap it so it cannot escape capture.",
  sections: [
    {
      h: "The Goal: Checkmate the King",
      body: "<p>Every move in chess has one ultimate purpose — to hunt down the enemy king. When a king is <b>under attack</b> it is in <i>check</i>. When it is under attack AND has no safe escape, that is <b>checkmate</b> — and the game is over! The player who delivers checkmate wins.</p><p>If neither side can checkmate the other, the game may end in a <b>draw</b> (a tie). Draws happen through <i>stalemate</i> (no legal move but not in check), agreement, or repeated positions.</p>"
    },
    {
      h: "The 6 Kinds of Piece",
      body: "<p>Each player starts with 16 pieces: 1 king ♚, 1 queen ♛, 2 rooks ♜, 2 bishops ♝, 2 knights ♞, and 8 pawns ♟. Every piece moves differently. Learning each piece's power is the first step to becoming a great player — explore the links below to find out how they move!</p><p>The <b>queen</b> is the most powerful piece. The <b>king</b> is the most important — lose it and you lose the game. Pawns are the smallest but have a secret: they can <b>promote</b> into a queen if they reach the far end of the board.</p>"
    },
    {
      h: "Play Chess Now!",
      body: "<p>The best way to learn chess is to play it. You can practise your moves against the computer right here in the encyclopedia — no equipment needed, no partner required! Click the link below to start a game:</p><p><a class='ilink' href='#/play'>▶️ Play Chess now</a> — try out your moves, make mistakes, and learn. Even the greatest grandmasters started as beginners!</p>"
    }
  ],
  facts: [
    "Chess has been played for over 1,500 years, originating in India before spreading to Persia, then Europe.",
    "There are more possible chess games than there are atoms in the observable universe.",
    "The word 'checkmate' comes from the Persian phrase 'shah mat', meaning 'the king is dead'.",
    "The youngest World Chess Champion was Garry Kasparov, who won the title at just 22 years old in 1985.",
    "White moves first in every game of chess — giving White a slight statistical advantage."
  ],
  dyk: "Did you know? A computer program called Deep Blue famously defeated World Champion Garry Kasparov in 1997 — one of the first times a machine beat the best human at a complex strategy game.",
  words: [
    { w: "checkmate", d: "when a king is attacked and has no legal move to escape — the end of the game" },
    { w: "strategy", d: "a plan you think through carefully to reach your goal" },
    { w: "stalemate", d: "when a player has no legal move but is NOT in check — the game is a draw" }
  ],
  related: ["chess-board","chess-pawn","chess-knight","chess-bishop","chess-rook","chess-queen"],
  hunt: [
    { q: "What is it called when a king is trapped with no escape?", a: "Checkmate." },
    { q: "Which player always moves first in chess?", a: "White." },
    { q: "How many pieces does each player start with?", a: "16 pieces each." }
  ]
});

__article({
  id: "chess-board",
  cat: "games",
  title: "The Chess Board",
  emoji: "♟️",
  scene: "generic",
  accents: ["♟️","♞","♜","♚"],
  blurb: "Before you move a single piece, you need to know your battlefield — the 64-square chess board.",
  intro: "The chess board is an 8×8 grid of <b>64 squares</b>, alternating between light and dark colours. Every square has its own unique address, just like a city map. Understanding the board is the foundation of everything in [[chess]] — knowing where your pieces stand gives you power over the game.",
  sections: [
    {
      h: "Files, Ranks, and Coordinates",
      body: "<p>The <b>8 columns</b> running up and down the board are called <b>files</b>. They are labelled with letters: <b>a, b, c, d, e, f, g, h</b> from left to right (from White's side). The <b>8 rows</b> running left and right are called <b>ranks</b>, numbered <b>1 to 8</b> from White's side. Every square gets a name from its file and rank — for example, the square in the bottom-left corner (from White's view) is <b>a1</b>, and the top-right corner is <b>h8</b>.</p><p>This coordinate system is how players record their moves using <b>chess notation</b> — a useful skill once you start playing seriously. See [[chess-notation]] to find out more.</p>"
    },
    {
      h: "Setting Up the Board",
      body: "<p>Always place the board so that each player has a <b>light square in the bottom-right corner</b>. A handy rhyme to remember: '<i>light on right</i>'. The pieces line up on ranks 1 and 2 for White, and ranks 7 and 8 for Black. Rooks go in the corners, knights next to them, then bishops, and the king and queen in the middle. Here is the golden rule for king and queen: the <b>queen goes on her own colour</b> — the White queen starts on a light square, and the Black queen starts on a dark square. The kings take the remaining central squares.</p><p>The 8 pawns for each side fill the entire second rank, standing guard in front of the more powerful pieces behind them.</p>"
    }
  ],
  facts: [
    "A chess board has exactly 64 squares — 32 light and 32 dark.",
    "The files are labelled a–h and the ranks are numbered 1–8, giving each square a unique coordinate.",
    "If you set the board wrong (dark square bottom-right), the queen starts on the wrong colour — flip the board!",
    "White's pieces begin on ranks 1 and 2; Black's pieces begin on ranks 7 and 8.",
    "The four central squares (d4, d5, e4, e5) are called the 'centre' — controlling them is a key goal at the start of a game."
  ],
  dyk: "Did you know? The chess board is the same grid used in the game of draughts (checkers) — but chess uses all 64 squares, not just the dark ones.",
  words: [
    { w: "file", d: "a column of squares running up and down the chess board, labelled a to h" },
    { w: "rank", d: "a row of squares running left and right across the chess board, numbered 1 to 8" },
    { w: "coordinate", d: "the file letter and rank number that give a square its unique address, like e4 or d7" }
  ],
  related: ["chess","chess-pawn","chess-knight","chess-notation","chess-openings","chess-special-moves"],
  hunt: [
    { q: "How many squares are on a chess board?", a: "64 squares." },
    { q: "Which colour square should be in the bottom-right corner when you set up the board?", a: "A light square." },
    { q: "What rule tells you where the queen goes at the start?", a: "The queen goes on her own colour." }
  ]
});

__article({
  id: "chess-pawn",
  cat: "games",
  title: "The Pawn ♟️",
  emoji: "♟️",
  scene: "generic",
  accents: ["♟️","♞","♜","♚"],
  blurb: "Pawns look like the weakest pieces — but get one to the far end and it becomes a queen!",
  intro: "Each player starts with <b>8 pawns</b>, and they form the front line of your army. Pawns are the only pieces that cannot move backwards, so every pawn step is a commitment. What they lack in speed, they make up for in <b>promotion</b> — a pawn that survives the march across the board can transform into the most powerful piece in the game!",
  sections: [
    {
      h: "How a Pawn Moves",
      body: "<p>A pawn moves <b>forward one square</b> at a time — but on its very first move it has a special option: it may move <b>forward two squares</b> in one go to get into action faster. After that first move, it can only go one square at a time. Pawns capture <b>differently from how they move</b>: they take enemy pieces one square <b>diagonally forward</b> (to either side). They cannot capture straight ahead, and they cannot move backwards at all.</p><p>This means a pawn can be blocked by any piece — friend or enemy — standing directly in front of it. Keep your pawns moving and your paths clear!</p>"
    },
    {
      h: "Promotion — The Pawn's Secret Power",
      body: "<p>If a pawn reaches the <b>far end of the board</b> (rank 8 for White, rank 1 for Black), it is immediately <b>promoted</b>. The player must replace it with a queen, rook, bishop, or knight of their own colour — and almost always chooses a <b>queen</b>, gaining an enormous new power on the board.</p><p>Getting a pawn to promotion is one of the most exciting goals in chess. It is called 'queening a pawn', and it can completely turn a losing game into a winning one! There is also a special capturing move called <b>en passant</b> — check out [[chess-special-moves]] to learn about it.</p>"
    }
  ],
  facts: [
    "Each player starts with 8 pawns — more than any other piece.",
    "A pawn can only move forward and capture diagonally — it is the only piece that captures differently from how it moves.",
    "A pawn that reaches the other side of the board can become a queen — even if you still have your original queen!",
    "You could have up to 9 queens on the board at once if all 8 pawns promote!",
    "The opening two-square pawn move (called 'the double pawn push') can be countered by a special move called 'en passant'."
  ],
  dyk: "Did you know? The word 'pawn' comes from the Latin word 'pedo', meaning 'foot soldier' — because pawns are the infantry of the chess army.",
  words: [
    { w: "promotion", d: "when a pawn reaches the far end of the board and is replaced by a more powerful piece" },
    { w: "en passant", d: "a special pawn capture that can happen right after the opponent moves a pawn two squares forward" },
    { w: "infantry", d: "foot soldiers — the ordinary troops who form the main body of an army" }
  ],
  related: ["chess","chess-board","chess-knight","chess-bishop","chess-special-moves","chess-tactics"],
  hunt: [
    { q: "How many squares can a pawn move on its very first move?", a: "One or two squares forward." },
    { q: "In which direction does a pawn capture?", a: "One square diagonally forward." },
    { q: "What happens when a pawn reaches the far end of the board?", a: "It is promoted — usually to a queen." }
  ]
});

__article({
  id: "chess-knight",
  cat: "games",
  title: "The Knight ♞",
  emoji: "♞",
  scene: "generic",
  accents: ["♟️","♞","♜","♚"],
  blurb: "The knight is chess's trickiest piece — it leaps over everything in an L-shape that surprises even experienced players!",
  intro: "The <b>knight</b> is the most unusual piece on the [[chess-board]]. While all other pieces slide in straight lines or diagonals, the knight <b>jumps</b> in a special L-shaped path. It is also the <b>only piece that can leap over other pieces</b> — nothing blocks it! Knights are especially useful in crowded, complicated positions where no other piece can get through.",
  sections: [
    {
      h: "The L-Shape Move",
      body: "<p>A knight always moves in an <b>L-shape</b>: it goes exactly <b>two squares in one direction</b> (up, down, left, or right), then <b>one square at a right angle</b>. Or the other way around: one square then two. It always ends up on the opposite colour of the square it started on.</p><p>From the centre of the board, a knight can jump to up to <b>8 different squares</b>. From a corner, it can only reach <b>2 squares</b> — which is why chess teachers often say 'a knight on the rim is dim!' Moving a knight to the centre gives it maximum power.</p>"
    },
    {
      h: "Jumping Over Pieces",
      body: "<p>The knight's most special ability is that it can <b>jump over any piece</b> — friendly or enemy — that stands between its start and end square. No other piece can do this. This makes the knight incredibly useful at the start of a game, when the board is crowded and other pieces are blocked in.</p><p>Knights are masters of <b>forks</b> — a sneaky tactic where one knight attacks two enemy pieces at the same time, forcing your opponent to lose one of them. Learn more tricks in [[chess-tactics]]!</p>"
    }
  ],
  facts: [
    "The knight is the only chess piece that can jump over other pieces.",
    "From the centre of the board, a knight can reach up to 8 different squares in one move.",
    "From a corner square, a knight can only reach 2 squares — that is why centre placement matters.",
    "The knight always lands on the opposite colour square to where it started.",
    "A knight and bishop together are considered roughly equal in value to a rook in most positions."
  ],
  dyk: "Did you know? In many languages, the knight is called the 'horse' — in Spanish it is 'caballo', in German 'Springer' (jumper), and in Russian 'kon' (horse).",
  words: [
    { w: "L-shape", d: "the path a knight takes: two squares in one direction, then one square sideways — like the letter L" },
    { w: "fork", d: "a chess tactic where one piece attacks two enemy pieces at the same time" },
    { w: "rim", d: "the edge of the chess board — squares on the rim give knights fewer possible moves" }
  ],
  related: ["chess","chess-bishop","chess-rook","chess-queen","chess-tactics","chess-openings"],
  hunt: [
    { q: "What shape does a knight move in?", a: "An L-shape: two squares one way, then one square sideways." },
    { q: "Which chess piece can jump over other pieces?", a: "The knight." },
    { q: "Why is it bad to keep a knight on the edge of the board?", a: "It has far fewer squares it can reach — only 2 from a corner." }
  ]
});

__article({
  id: "chess-bishop",
  cat: "games",
  title: "The Bishop ♝",
  emoji: "♝",
  scene: "generic",
  accents: ["♟️","♞","♜","♚"],
  blurb: "The bishop glides diagonally across the board — and it never, ever changes colour!",
  intro: "Each player has <b>two bishops</b> — one that lives on the light squares, and one that lives on the dark squares. Bishops slide diagonally any number of squares, making them dangerous long-range pieces that can attack from across the whole board. Because they only move diagonally, a bishop stays on the <b>same colour</b> for the entire game.",
  sections: [
    {
      h: "Moving Diagonally",
      body: "<p>A bishop moves any number of squares in a <b>straight diagonal line</b> — like a ruler held at 45 degrees. It can go forward or backward, left or right diagonally, as far as the board allows. The only things that stop it are the edge of the board or another piece standing in its path. Unlike the [[chess-knight]], a bishop <b>cannot jump over pieces</b> — if something blocks its diagonal, it must stop.</p><p>Bishops are most powerful on <b>open diagonals</b>, where no pawns or pieces block their path. When the board is open and diagonals are long, bishops become fearsome attackers.</p>"
    },
    {
      h: "One Colour for Life",
      body: "<p>Because a bishop only moves diagonally, it always stays on squares of the <b>same colour</b>. Your light-squared bishop stays on light squares forever, and your dark-squared bishop stays on dark squares forever. This means each bishop can only ever control half the board.</p><p>That is why having <b>both bishops</b> working together is so powerful — between them, they cover every single square on the board! Chess players call keeping both bishops the '<b>bishop pair</b>', and it is considered a real advantage, especially in open positions.</p>"
    }
  ],
  facts: [
    "Each player has two bishops — one travels only on light squares, the other only on dark squares.",
    "A bishop can cover the entire length of the board in a single move.",
    "The bishop pair (having both bishops) is widely considered to be stronger than two knights or a knight and bishop in open positions.",
    "If all your pawns are on the same colour as your remaining bishop, your bishop becomes much less effective.",
    "In old forms of chess, the bishop represented an elephant — the piece evolved differently in different cultures."
  ],
  dyk: "Did you know? In French, the bishop is called 'le fou' — which means 'the jester' or 'the madman'! Different countries gave the piece very different names over the centuries.",
  words: [
    { w: "diagonal", d: "a line going at 45 degrees across the board, through squares of the same colour" },
    { w: "bishop pair", d: "having both of your bishops still in the game — a powerful combination" },
    { w: "open diagonal", d: "a diagonal with no pawns or pieces blocking the bishop's path" }
  ],
  related: ["chess","chess-knight","chess-rook","chess-queen","chess-pawn","chess-tactics"],
  hunt: [
    { q: "In which direction does a bishop move?", a: "Diagonally, any number of squares." },
    { q: "Why can a bishop never change the colour of square it travels on?", a: "Because diagonal moves always stay on the same colour." },
    { q: "What is the 'bishop pair'?", a: "Having both your bishops still in the game." }
  ]
});

__article({
  id: "chess-rook",
  cat: "games",
  title: "The Rook ♜",
  emoji: "♜",
  scene: "generic",
  accents: ["♟️","♞","♜","♚"],
  blurb: "The rook is a powerful tower that sweeps across entire rows and columns — and it has a secret move with the king!",
  intro: "The <b>rook</b> — sometimes called a castle because it looks like a tower — is one of the most powerful pieces in [[chess]]. Each player starts with <b>two rooks</b>, sitting in the corners of the [[chess-board]]. A rook slides along straight lines, and a single rook can control an entire row or column with ease.",
  sections: [
    {
      h: "Straight-Line Power",
      body: "<p>A rook moves any number of squares in a <b>straight line</b> — horizontally along a rank, or vertically along a file. It can go forward, backward, left, or right. Like the [[chess-bishop]], the rook cannot jump over pieces that stand in its way — it must stop when blocked. A rook that reaches an open file (a column with no pawns blocking it) becomes <b>extremely dangerous</b>.</p><p>Two rooks working together on the same rank or file form what players call '<b>doubled rooks</b>' — one of the most powerful attacking formations in chess. Together they can control a whole row and march straight toward the enemy king.</p>"
    },
    {
      h: "Castling — The King's Special Move",
      body: "<p>The rook has a unique role in a special move called <b>castling</b>, which it performs together with the king. Castling is the only move in chess where you move two pieces at once. The king slides two squares toward a rook, and the rook hops over to the square on the other side of the king. Castling protects the king and activates the rook — two great things at once!</p><p>There are rules: neither piece can have moved before, no pieces can be between them, and the king cannot castle while in check. Learn the full rules in [[chess-special-moves]]!</p>"
    }
  ],
  facts: [
    "Each player starts with two rooks, placed in the corners of the board.",
    "A rook is worth roughly 5 pawns in value — only the queen is more powerful.",
    "Two rooks working together are generally stronger than a queen in most endings.",
    "Castling is the only move in chess that lets you move two pieces in one turn.",
    "An open file (no pawns blocking it) is the rook's best friend — rooks thrive in open positions."
  ],
  dyk: "Did you know? The word 'rook' comes from the Persian word 'rukh', which meant a chariot in the original Indian game — the tower shape came later in European chess.",
  words: [
    { w: "file", d: "a column of squares running up and down the board — rooks love controlling a whole file" },
    { w: "castling", d: "a special move where the king and rook swap — the only time two pieces move in one turn" },
    { w: "open file", d: "a file with no pawns blocking it — great territory for a rook" }
  ],
  related: ["chess","chess-queen","chess-bishop","chess-knight","chess-special-moves","chess-tactics"],
  hunt: [
    { q: "In which directions can a rook move?", a: "Horizontally and vertically — along ranks and files." },
    { q: "What is castling?", a: "A special move where the king and rook move together — the only move that moves two pieces at once." },
    { q: "Why are rooks so powerful on open files?", a: "With no pawns blocking them, rooks can control the whole column and attack freely." }
  ]
});

__article({
  id: "chess-queen",
  cat: "games",
  title: "The Queen ♛",
  emoji: "♛",
  scene: "generic",
  accents: ["♟️","♞","♜","♚"],
  blurb: "The queen is the most powerful piece on the board — she moves like a rook AND a bishop combined!",
  intro: "If the king is the most <b>important</b> piece in [[chess]], the queen is the most <b>powerful</b>. Each player has one queen, and she can move any number of squares in <b>any direction</b> — along ranks, files, and diagonals. Losing your queen is a huge blow; winning your opponent's queen is often the key to winning the game.",
  sections: [
    {
      h: "The Rook and Bishop Combined",
      body: "<p>The queen's move is simply the [[chess-rook]] and [[chess-bishop]] combined into one super-piece. She can slide any number of squares <b>horizontally or vertically</b> (like a rook), AND any number of squares <b>diagonally</b> (like a bishop) — all in a single move. This means from the centre of the board, a queen can reach up to <b>27 different squares</b> in one move — more than any other piece.</p><p>Like rooks and bishops, the queen cannot jump over other pieces — she is blocked by any piece in her path. Keep the centre of the board clear and your queen becomes an unstoppable force.</p>"
    },
    {
      h: "Using the Queen Wisely",
      body: "<p>Because the queen is so valuable, it is usually best <b>not to bring her out too early</b>. In the opening moves of a game, enemy pieces can chase your queen around the board, wasting your turns. First, develop your knights and bishops, castle your king to safety, then unleash your queen. See [[chess-openings]] for smart starting strategies.</p><p>The queen works brilliantly with the rook — together they can deliver a <b>back-rank checkmate</b>, trapping the enemy king on its home row. And remember: a promoted [[chess-pawn]] almost always becomes a queen, so protecting your advancing pawns is vital!</p>"
    }
  ],
  facts: [
    "The queen can reach up to 27 different squares from the centre of the board — more than any other piece.",
    "The queen combines the powers of the rook and the bishop into a single piece.",
    "In old chess (played over 500 years ago), the queen could only move one square at a time — the modern powerful queen was introduced around the late 1400s.",
    "Losing your queen is usually so serious that many players resign (give up) rather than continue.",
    "You can have more than one queen if a pawn promotes — professional players have even had three queens on the board at once!"
  ],
  dyk: "Did you know? When the modern powerful queen move was introduced in Europe around 1475, the game became so fast and exciting it was nicknamed 'Mad Queen Chess' — and that exciting version is the chess we still play today!",
  words: [
    { w: "develop", d: "to move your pieces from their starting squares into active positions where they can influence the game" },
    { w: "back-rank checkmate", d: "a checkmate where the queen or rook traps the enemy king on the last row of the board" },
    { w: "resign", d: "to give up a chess game before checkmate, when you know you cannot win" }
  ],
  related: ["chess","chess-rook","chess-bishop","chess-pawn","chess-check-checkmate","chess-openings"],
  hunt: [
    { q: "Which two pieces' moves does the queen combine?", a: "The rook and the bishop." },
    { q: "Why should you usually not bring your queen out in the very first moves of the game?", a: "Enemy pieces can chase it around, wasting your turns." },
    { q: "How many squares can a queen reach from the centre of the board?", a: "Up to 27 squares." }
  ]
});
