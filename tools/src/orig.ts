// Prints the original text of one chapter, one verse per line (see tools/fix/SOURCE.md).
//   deno run -A tools/src/orig.ts <NN-Book/BookNN.md>
// NT: SBLGNT (github.com/LogosBible/SBLGNT, CC BY 4.0). OT: Westminster Leningrad Codex
// (github.com/openscriptures/morphhb, CC BY 4.0), shown under our (KJV) verse numbers.
// Both are cloned into SRC; they are reference data and never shipped.
const SRC = "/home/dev/code/gen/src-texts";

const rel = Deno.args[0] ?? "";
const m = rel.match(/^(\d\d)-([^/]+)\/.*?(\d+)\.md$/);
if (!m) {
  console.error("usage: orig.ts <NN-Book/BookNN.md>");
  Deno.exit(2);
}
const [, nn, book, chs] = m, ch = +chs;

if (+nn >= 40) {
  const txt = await Deno.readTextFile(
    `${SRC}/sblgnt/data/sblgnt/text/${book}.txt`,
  );
  const lines = txt.split("\n").filter((l) =>
    l.split("\t")[0].endsWith(` ${ch}:${l.match(/:(\d+)\t/)?.[1]}`)
  );
  console.log(
    `# ${book} ${ch} — SBLGNT (⸀ ⸂ ⸃ mark places where editions differ)`,
  );
  for (const l of lines) {
    console.log(l.replace(/^\S+ \d+:(\d+)\t/, "[$1] ").trim());
  }
} else {
  const xml = await Deno.readTextFile(`${SRC}/morphhb/wlc/${book}.xml`);
  const map = await Deno.readTextFile(`${SRC}/morphhb/wlc/VerseMap.xml`);
  // wlc ref → kjv ref, where the two numberings differ
  const kjv = new Map<string, string>();
  for (
    const v of map.matchAll(/<verse wlc="([^"]+)" kjv="([^"]+)" type="(\w+)"/g)
  ) {
    kjv.set(v[1], kjv.has(v[1]) ? `${kjv.get(v[1])}+${v[2]}` : v[2]);
  }
  const words = (s: string) =>
    // a word may hold a large, small or raised letter in its own <seg>
    [...s.matchAll(
      /<w\b[^>]*>((?:[^<]|<seg\b[^>]*>[^<]*<\/seg>)*)<\/w>|<seg\b[^>]*>([^<]*)<\/seg>/g,
    )]
      .map((w) =>
        w[1] !== undefined
          ? ` ${w[1].replace(/<[^>]+>/g, "").replaceAll("/", "")}`
          : w[2]
      )
      .join("").replace(/ (?=[־׃])/g, "").replace(/־ /g, "־").trim();
  console.log(
    `# ${book} ${ch} — Westminster Leningrad Codex, our verse numbers (Hebrew number in brackets where it differs)`,
  );
  for (
    const v of xml.matchAll(/<verse osisID="([^"]+)">([\s\S]*?)<\/verse>/g)
  ) {
    const ours = kjv.get(v[1]) ?? v[1];
    if (!ours.split("+").some((r) => r.split(".")[1] === String(ch))) continue;
    // ketiv stays in the line; the qere reading follows in brackets
    const qere = [...v[2].matchAll(/<rdg type="x-qere">([\s\S]*?)<\/rdg>/g)]
      .map((q) => words(q[1]));
    const body = words(v[2].replace(/<note\b[\s\S]*?<\/note>/g, ""));
    const num = ours.split("+").map((r) => r.split(".").slice(1).join(":"))
      .join("+");
    const heb = ours === v[1]
      ? ""
      : ` (Heb ${v[1].split(".").slice(1).join(":")})`;
    console.log(
      `[${num}]${heb} ${body}${
        qere.length ? ` [qere: ${qere.join(" · ")}]` : ""
      }`,
    );
  }
}
