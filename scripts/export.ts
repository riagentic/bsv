// deno task text (last step) — text/{en,cz}/NN.md → dist/export/bsv-<lang>-<mode>.md:
// the whole Bible as one plain Markdown file per language and names mode.
import { join } from "@std/path";
import { NAMES, type Names, pickForms, PLAIN } from "../src/lib/terms.ts";

type Lemma = { orig: string; trad: string };
type Term = { key: string; en: Lemma; cz: Lemma };

const OUT = "dist/export";
const LABEL: Record<Names, string> = {
  orig: "original",
  trad: "familiar",
  both: "familiar+original",
};

const lex: Term[] = JSON.parse(await Deno.readTextFile("text/terms.json"));
const byKey = new Map(lex.map((e) => [e.key, e]));
const index = JSON.parse(await Deno.readTextFile("text/index.json")) as Record<
  "en" | "cz",
  { n: number }[]
>;
await Deno.mkdir(OUT, { recursive: true });
for (const lang of ["en", "cz"] as const) {
  const books = await Promise.all(
    index[lang].map((b) =>
      Deno.readTextFile(`text/${lang}/${String(b.n).padStart(2, "0")}.md`)
    ),
  );
  const md = books.map((b) => b.trim()).join("\n\n") + "\n";
  for (const mode of NAMES) {
    await Deno.writeTextFile(
      join(OUT, `bsv-${lang}-${LABEL[mode]}.md`),
      pickForms(md, mode, (k) => byKey.get(k)?.[lang].orig, PLAIN),
    );
  }
}
console.log(`export: ${NAMES.length * 2} files → ${OUT}`);
