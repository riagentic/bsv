// Name/term token checker (see SPEC.md).
//   deno run -A tools/terms/check.ts <en|cz> <NN-Book/BookNN.md>...
// Prints "OK <file>" or one line per problem; exits 1 on any problem.
import { TOKEN } from "../../src/lib/terms.ts";

type Entry = {
  key: string;
  en: { orig: string; trad: string };
  cz: { orig: string; trad: string };
  leak: { en: string[]; cz: string[] };
};
const ROOT = { en: "bible-kjv-v2", cz: "bible-kjv-v2-cz" } as const;
const WORD = "/home/dev/code/gen/word";
const CHANGES = /^## (?:Changes|Změny)\s*$/m;

const [lang, ...files] = Deno.args as ["en" | "cz", ...string[]];
if (!(lang in ROOT) || !files.length) {
  console.error("usage: check.ts <en|cz> <NN-Book/BookNN.md>...");
  Deno.exit(2);
}
const lex: Entry[] = JSON.parse(
  await Deno.readTextFile(new URL("../../content/terms.json", import.meta.url)),
);
const byKey = new Map(lex.map((e) => [e.key, e]));
const fold = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const stemRe = (s: string) =>
  new RegExp(
    `(?<!\\p{L})${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\p{L}-]*`,
    "gu",
  );
// Whole words that start with a stem but name something else (Herodias ≠ Herod).
const allow = new Set<string>(
  JSON.parse(
    await Deno.readTextFile(new URL("./allow.json", import.meta.url)),
  )[lang],
);
const leaks = lex.flatMap((e) =>
  e.leak[lang].map((s) => [e.key, s, stemRe(s)] as const)
);

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
          ...e.leak[lang],
          e[lang].orig.slice(0, 3),
          e[lang].trad.replace(/^the /, "").slice(0, 3),
        ].map(fold);
        for (const form of [o, t]) {
          if (!stems.some((s) => fold(form).includes(s))) {
            errs.push(`${at} ${k}: "${form}" matches none of its stems`);
          }
        }
      }
      const rest = line.replace(TOKEN, " ");
      if (/[⟦⟧]/.test(rest)) errs.push(`${at} malformed token`);
      for (const [k, s, re] of leaks) {
        for (const [w] of rest.matchAll(re)) {
          if (!allow.has(w)) errs.push(`${at} untagged "${w}" (${k}: ${s})`);
        }
      }
    });
  }
  if (errs.length) {
    bad++;
    console.log(`FAIL ${f}\n  ${errs.join("\n  ")}`);
  } else console.log(`OK ${f}`);
}
Deno.exit(bad ? 1 : 0);
