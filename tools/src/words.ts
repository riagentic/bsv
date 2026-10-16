// Prints the rows of tools/fix/WORDS-HE.md that bear on one Old Testament chapter:
// the head of the list ("Standing decisions"), every row whose Hebrew word stands
// in the chapter, and every "reviewer" row (they override the rest).
//   deno run -A tools/src/words.ts <NN-Book/BookNN.md> [...]  rows for chapters
//   deno run -A tools/src/words.ts --word <hebrew> [...]    rows for given words
// Matching is by consonants, with a loose form for weak verbs, so it prints too
// many rows rather than too few. The list itself stays the binding text.
const SRC = "/home/dev/code/gen/src-texts";
const LIST = new URL("../fix/WORDS-HE.md", import.meta.url);

// consonants only: no points, accents, maqqef; final letters as plain ones
const bare = (s: string): string =>
  s.replace(/[֑-ׇ]/g, "").replace(
    /[ךםןףץ]/g,
    (c) => "כמנפצ"["ךםןףץ".indexOf(c)],
  );
const hebrew = (s: string): string[] => bare(s).match(/[א-ת]{2,}/g) ?? [];

// forms a headword may take in a text: itself, and a weak root without its
// weak first or last letter (נתן → תן, עשה → עש, ישב → שב)
const forms = (w: string): string[] =>
  w.length !== 3 ? [w] : [
    w,
    ..."ניה".includes(w[0]) ? [w.slice(1)] : [],
    ..."ה".includes(w[2]) ? [w.slice(0, 2)] : [],
  ];

const chapterWords = async (rel: string): Promise<string[]> => {
  const m = rel.match(/^(\d\d)-([^/]+)\/.*?(\d+)\.md$/);
  if (!m || +m[1] >= 40) {
    console.error(
      "usage: words.ts <NN-Book/BookNN.md> (books 01–39) | --word <hebrew>",
    );
    Deno.exit(2);
  }
  const [, , book, ch] = m;
  const xml = await Deno.readTextFile(`${SRC}/morphhb/wlc/${book}.xml`);
  const map = await Deno.readTextFile(`${SRC}/morphhb/wlc/VerseMap.xml`);
  // our chapter may hold verses the Hebrew counts in a neighbouring chapter
  const ours = new Map<string, string>();
  for (const v of map.matchAll(/<verse wlc="([^"]+)" kjv="([^"]+)"/g)) {
    ours.set(v[1], v[2]);
  }
  return [...xml.matchAll(/<verse osisID="([^"]+)">([\s\S]*?)<\/verse>/g)]
    .filter((v) => (ours.get(v[1]) ?? v[1]).split(".")[1] === String(+ch))
    .flatMap((v) => hebrew(v[2].replace(/<[^>]+>/g, " ").replaceAll("/", "")));
};

const args = Deno.args;
const lookup = args[0] === "--word";
const text = lookup
  ? args.slice(1).flatMap(hebrew)
  : (await Promise.all((args.length ? args : [""]).map(chapterWords))).flat();
const joined = ` ${text.join(" ")} `;

const lines = (await Deno.readTextFile(LIST)).split("\n");
const start = lines.findIndex((l) => l.startsWith("| --- "));
// a short form must be a whole word, give or take prefixes and endings
const seen = (f: string): boolean =>
  f.length >= 4
    ? joined.includes(f)
    : new RegExp(` [והבכלמשתינא]{0,3}${f}[הותיםנכ]{0,3} `).test(joined);
// a row's first cell holds entries parted by "·" or "/"; an entry stands in the
// chapter when every Hebrew word of it stands there. A row with many entries
// (a passage row) bears on a chapter only when a third of them stand there:
// one common word must not pull in a whole passage. A --word lookup takes any.
const hits = (row: string): boolean => {
  const entries = (row.split("|")[1] ?? "").replace(/\([^)]*\)/g, "").split(
    /[·/]/,
  ).map(hebrew).filter((ws) => ws.length > 0);
  const found =
    entries.filter((ws) => ws.every((w) => forms(w).some(seen))).length;
  return found > 0 &&
    (lookup || found >= Math.ceil(entries.length / 3));
};

const rows = lines.slice(start + 1).filter((l) => l.startsWith("|"));
// a ruling is dated ("reviewer 2026-…") or named one; "the reviewer decides"
// in a worker's row is an open question, not a ruling
const ruling = (l: string): boolean =>
  /reviewer 20\d\d|reviewer's ruling|; reviewer:/.test(l);
const reviewer = rows.filter(ruling);
const matched = rows.filter((l) => !ruling(l) && hits(l));

console.log(lines.slice(0, start + 1).join("\n"));
console.log(matched.join("\n"));
console.log(
  `\n## Reviewer rows (override every other row) — ${reviewer.length}\n`,
);
console.log(reviewer.join("\n"));
console.error(
  `words: ${matched.length} of ${rows.length} rows match, ${reviewer.length} reviewer rows`,
);
