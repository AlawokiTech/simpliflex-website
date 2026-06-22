/* Special days of the year — drives the "Today is …" widget. 100% offline.
   Handles fixed-date days AND movable ones (Father's Day, Easter, etc.) by rule,
   so it is correct for any year. Window.Days.line(date) + Window.Days.forDate(date). */
(function () {
  // fixed days: "M-D" -> { name, emoji, note }   (month 1-12)
  var FIXED = {
    "1-1":   { e: "🎉", n: "New Year's Day", t: "The first day of a brand-new year!" },
    "1-26":  { e: "🇦🇺", n: "Australia Day", t: "Australia's national day." },
    "2-2":   { e: "🦫", n: "Groundhog Day", t: "A fun tradition that predicts how long winter will last." },
    "2-14":  { e: "❤️", n: "Valentine's Day", t: "A day to share love and kindness." },
    "2-27":  { e: "🐻‍❄️", n: "International Polar Bear Day", t: "Celebrating these giant Arctic animals." },
    "3-1":   { e: "🌼", n: "St David's Day", t: "The national day of Wales." },
    "3-3":   { e: "🦁", n: "World Wildlife Day", t: "Celebrating the world's amazing wild animals and plants." },
    "3-8":   { e: "💜", n: "International Women's Day", t: "Celebrating women and girls everywhere." },
    "3-14":  { e: "🥧", n: "Pi Day", t: "A maths celebration of the number π (3.14…)." },
    "3-17":  { e: "☘️", n: "St Patrick's Day", t: "Ireland's day of shamrocks and green." },
    "3-20":  { e: "😊", n: "International Day of Happiness", t: "A day to spread smiles!" },
    "4-1":   { e: "🤡", n: "April Fools' Day", t: "A day of jokes and harmless pranks." },
    "4-7":   { e: "🩺", n: "World Health Day", t: "Looking after our bodies and minds." },
    "4-22":  { e: "🌍", n: "Earth Day", t: "Caring for our planet." },
    "4-23":  { e: "📚", n: "World Book Day", t: "A celebration of reading and stories." },
    "4-25":  { e: "🐧", n: "World Penguin Day", t: "All about these brilliant birds." },
    "4-29":  { e: "💃", n: "International Dance Day", t: "Time to move and groove!" },
    "5-1":   { e: "🌷", n: "May Day", t: "A spring celebration in many countries." },
    "5-4":   { e: "✨", n: "Star Wars Day", t: "\"May the Fourth be with you!\"" },
    "5-20":  { e: "🐝", n: "World Bee Day", t: "Thanking bees for helping plants grow." },
    "5-23":  { e: "🐢", n: "World Turtle Day", t: "Protecting turtles and tortoises." },
    "6-5":   { e: "🌱", n: "World Environment Day", t: "Protecting nature and the planet." },
    "6-8":   { e: "🌊", n: "World Oceans Day", t: "Celebrating our amazing seas." },
    "6-21":  { e: "🎵", n: "World Music Day", t: "A day to play and enjoy music." },
    "7-1":   { e: "🍁", n: "Canada Day", t: "Canada's national day." },
    "7-4":   { e: "🎆", n: "US Independence Day", t: "America's national day." },
    "7-7":   { e: "🍫", n: "World Chocolate Day", t: "Yes — a whole day for chocolate!" },
    "7-14":  { e: "🇫🇷", n: "Bastille Day", t: "France's national day." },
    "7-17":  { e: "😀", n: "World Emoji Day", t: "A day for all our favourite little pictures." },
    "7-30":  { e: "🤝", n: "International Friendship Day", t: "Celebrating friends everywhere." },
    "8-8":   { e: "🐱", n: "International Cat Day", t: "All about our feline friends." },
    "8-10":  { e: "🦁", n: "World Lion Day", t: "Celebrating the king of the savanna." },
    "8-12":  { e: "🐘", n: "World Elephant Day", t: "Protecting the largest land animals." },
    "8-19":  { e: "📷", n: "World Photography Day", t: "Celebrating the art of taking pictures." },
    "9-13":  { e: "📖", n: "Roald Dahl Story Day", t: "Celebrating the author of the BFG and Matilda." },
    "9-19":  { e: "🏴‍☠️", n: "Talk Like a Pirate Day", t: "Ahoy! A silly day to talk like a pirate." },
    "9-21":  { e: "🕊️", n: "International Day of Peace", t: "A day for kindness and peace." },
    "10-1":  { e: "🎶", n: "International Music Day", t: "Another cheer for music." },
    "10-4":  { e: "🐾", n: "World Animal Day", t: "Celebrating all the animals we share Earth with." },
    "10-5":  { e: "🍎", n: "World Teachers' Day", t: "Thanking teachers everywhere." },
    "10-16": { e: "🍽️", n: "World Food Day", t: "Thinking about food around the world." },
    "10-31": { e: "🎃", n: "Halloween", t: "Pumpkins, costumes and spooky fun." },
    "11-5":  { e: "🎆", n: "Bonfire Night", t: "Fireworks light up the sky across the UK." },
    "11-11": { e: "🌺", n: "Remembrance Day", t: "Remembering those who served, with a red poppy." },
    "11-13": { e: "💚", n: "World Kindness Day", t: "A day to do something kind." },
    "11-20": { e: "🧒", n: "World Children's Day", t: "Celebrating children everywhere." },
    "11-21": { e: "👋", n: "World Hello Day", t: "Say hello to someone new!" },
    "12-4":  { e: "🐆", n: "International Cheetah Day", t: "Celebrating the fastest land animal." },
    "12-25": { e: "🎄", n: "Christmas Day", t: "A time of giving and joy for many." },
    "12-31": { e: "🎆", n: "New Year's Eve", t: "The last day of the year!" }
  };

  function nthWeekday(y, m0, wd, n) { var first = new Date(y, m0, 1); var add = (wd - first.getDay() + 7) % 7; return new Date(y, m0, 1 + add + (n - 1) * 7); }
  function lastWeekday(y, m0, wd) { var last = new Date(y, m0 + 1, 0); var sub = (last.getDay() - wd + 7) % 7; return new Date(y, m0, last.getDate() - sub); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, mm = Math.floor((a + 11 * h + 22 * l) / 451),
        mo = Math.floor((h + l - 7 * mm + 114) / 31), da = ((h + l - 7 * mm + 114) % 31) + 1;
    return new Date(y, mo - 1, da);
  }
  function same(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

  // movable days computed for the given year
  var MOVABLE = [
    { e: "🥞", n: "Pancake Day", t: "Shrove Tuesday — time for pancakes!", date: function (y) { return addDays(easter(y), -47); } },
    { e: "✝️", n: "Good Friday", t: "A Christian day before Easter.", date: function (y) { return addDays(easter(y), -2); } },
    { e: "🐣", n: "Easter Sunday", t: "Chocolate eggs and spring celebrations.", date: function (y) { return easter(y); } },
    { e: "💐", n: "Mother's Day (UK)", t: "Mothering Sunday — a day to thank mums.", date: function (y) { return addDays(easter(y), -21); } },
    { e: "👔", n: "Father's Day", t: "A day to celebrate dads (3rd Sunday of June).", date: function (y) { return nthWeekday(y, 5, 0, 3); } },
    { e: "🦃", n: "Thanksgiving (US)", t: "A US holiday of giving thanks (4th Thursday of November).", date: function (y) { return nthWeekday(y, 10, 4, 4); } }
  ];

  var WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  window.Days = {
    line: function (d) { d = d || new Date(); return WD[d.getDay()] + ", " + d.getDate() + " " + MN[d.getMonth()] + " " + d.getFullYear(); },
    forDate: function (d) {
      d = d || new Date();
      var out = [];
      var f = FIXED[(d.getMonth() + 1) + "-" + d.getDate()];
      if (f) out.push({ emoji: f.e, name: f.n, note: f.t });
      MOVABLE.forEach(function (m) { try { if (same(m.date(d.getFullYear()), d)) out.push({ emoji: m.e, name: m.n, note: m.t }); } catch (e) {} });
      return out;
    }
  };
})();
