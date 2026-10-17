// Name/term token checker (see SPEC.md).
//   deno run -A tools/terms/check.ts <en|cz> <NN-Book/BookNN.md>...
// Prints "OK <file>" or one line per problem; exits 1 on any problem.
import { TOKEN } from "../../src/lib/terms.ts";

type Entry = {
  key: string;
  en: { orig: string; trad: string };
  cz: { orig: string; trad: string };
  leak: { en: string[]; cz: string[] };
  /** Extra accepted forms by context (NT "Pán" for yhwh); not leaks. */
  alt?: { en?: string[]; cz?: string[] };
};
const ROOT = { en: "bsv-en", cz: "bsv-cz" } as const;
const WORD = "/home/dev/code/gen/word";
const CHANGES = /^## (?:Changes|Změny)\s*$/m;

const [lang, ...files] = Deno.args as ["en" | "cz", ...string[]];
if (!(lang in ROOT) || !files.length) {
  console.error("usage: check.ts <en|cz> <NN-Book/BookNN.md>...");
  Deno.exit(2);
}
// Base lexicon + pending additions in content/terms.d/ (merge.ts folds them in).
const CONTENT = new URL("../../content/", import.meta.url);
const extra = [...Deno.readDirSync(new URL("terms.d/", CONTENT))]
  .filter((f) => f.name.endsWith(".json")).map((f) => f.name).sort();
const byKey = new Map<string, Entry>();
for (
  // A*.json (conflict resolutions) win over the base, then base, then the rest.
  const path of [
    ...extra.filter((f) => f.startsWith("A")).map((f) => `terms.d/${f}`),
    "terms.json",
    ...extra.filter((f) => !f.startsWith("A")).map((f) => `terms.d/${f}`),
  ]
) {
  const es: Entry[] = JSON.parse(
    await Deno.readTextFile(new URL(path, CONTENT)),
  );
  for (const e of es) if (!byKey.has(e.key)) byKey.set(e.key, e);
}
const lex = [...byKey.values()];
const fold = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
// A stem matches words starting with it; "Jose=" matches the whole word only.
const stemRe = (s: string) =>
  new RegExp(
    `(?<!\\p{L})${s.replace(/=$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${
      s.endsWith("=") ? "(?![\\p{L}-])" : "[\\p{L}-]*"
    }`,
    "gu",
  );
// Whole words that start with a stem but name something else (Herodias ≠ Herod).
// allow.json + allow.d/*.json (one file per tagging job, no shared writes).
// "Word" = allowed everywhere; "Word@NN-Book/BookNN.md" = in that file only.
const allowFiles = [
  "allow.json",
  ...[...Deno.readDirSync(new URL("./allow.d/", import.meta.url))]
    .filter((f) => f.name.endsWith(".json")).map((f) => `allow.d/${f.name}`),
];
const allow = new Set<string>(
  allowFiles.flatMap((f) =>
    JSON.parse(Deno.readTextFileSync(new URL(`./${f}`, import.meta.url)))[
      lang
    ] ?? []
  ),
);
const all = lex.flatMap((e) => e.leak[lang].map((s) => [e.key, s] as const));
// Multi-word stems: a regex each (few). One-word stems: indexed by 2 letters.
const phrases = all.filter(([, s]) => s.includes(" ")).map(([k, s]) =>
  [k, s, stemRe(s)] as const
);
const byHead = new Map<string, (readonly [string, string])[]>();
for (const [k, s] of all.filter(([, s]) => !s.includes(" "))) {
  const h = s.slice(0, 2);
  byHead.set(h, [...(byHead.get(h) ?? []), [k, s]]);
}
const hits = (w: string) =>
  (byHead.get(w.slice(0, 2)) ?? []).filter(([, s]) =>
    s.endsWith("=") ? w === s.slice(0, -1) : w.startsWith(s)
  );
const WORDS = /(?<!\p{L})\p{L}[\p{L}-]*/gu;

let bad = 0;
for (const f of files) {
  const md = await Deno.readTextFile(`${WORD}/${ROOT[lang]}/${f}`);
  const errs: string[] = [];
  for (const chunk of md.split(/^(?=# )/m)) {
    const cut = chunk.search(CHANGES);
    const body = cut < 0 ? chunk : chunk.slice(0, cut);
    if (cut >= 0 && chunk.slice(cut).includes("⟦")) {
      errs.push(`${chunk.split("\n")[0]}: token under Changes`);
    }
    body.split("\n").forEach((line) => {
      const at = `${chunk.split("\n")[0]} ${
        line.match(/\[(\d+)\]/)?.[0] ?? ""
      }`;
      for (const [, k, o, t] of line.matchAll(TOKEN)) {
        const e = byKey.get(k);
        if (!e) {
          errs.push(`${at} unknown key "${k}"`);
          continue;
        }
        if (e[lang].orig === e[lang].trad) {
          errs.push(`${at} ${k}: orig == trad in ${lang}, no token needed`);
        }
        if (!o.trim() || !t.trim()) errs.push(`${at} ${k}: empty form`);
        if (o === t) errs.push(`${at} ${k}: both forms "${o}"`);
        if (/[*_]/.test(o + t)) errs.push(`${at} ${k}: markup inside a form`);
        // A form must contain a leak stem or the start of one of its lemmas.
        const stems = [
          ...e.leak[lang].map((x) => x.replace(/=$/, "")),
          ...(e.alt?.[lang] ?? []),
          e[lang].orig.slice(0, 3),
          e[lang].trad.replace(/^the /, "").slice(0, 3),
        ].map(fold);
        for (const form of [o, t]) {
          if (!stems.some((s) => fold(form).includes(s))) {
            errs.push(`${at} ${k}: "${form}" matches none of its stems`);
          }
        }
      }
      if (line.startsWith("#")) { // headings are not verse text
        if (line.includes("⟦")) errs.push(`${at} token in a heading`);
        return;
      }
      const rest = line.replace(TOKEN, " ");
      if (/[⟦⟧]/.test(rest)) errs.push(`${at} malformed token`);
      const found = [
        ...[...rest.matchAll(WORDS)].flatMap(([w]) =>
          hits(w).map(([k, s]) => [k, s, w] as const)
        ),
        ...phrases.flatMap(([k, s, re]) =>
          [...rest.matchAll(re)].map(([w]) => [k, s, w] as const)
        ),
      ];
      for (const [k, s, w] of found) {
        if (!allow.has(w) && !allow.has(`${w}@${f}`)) errs.push(`${at} untagged "${w}" (${k}: ${s})`);
      }
    });
  }
  if (errs.length) {
    bad++;
    console.log(`FAIL ${f}\n  ${errs.join("\n  ")}`);
  } else console.log(`OK ${f}`);
}
Deno.exit(bad ? 1 : 0);
