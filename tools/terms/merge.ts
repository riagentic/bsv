// Merge content/terms.d/*.json into content/terms.json.
//   deno run -A tools/terms/merge.ts [--write]
// Same key + same forms → leaks are unioned. Same key + different forms → CONFLICT
// (first wins; fix by hand). Also flags leak stems shared by two keys.
type Lemma = { orig: string; trad: string };
type Entry = {
  key: string;
  kind: string;
  src: string;
  en: Lemma;
  cz: Lemma;
  leak: { en: string[]; cz: string[] };
  note: { en: string; cz: string };
};
const BASE = "content/terms.json";
const DIR = "content/terms.d";
const same = (a: Entry, b: Entry) =>
  (["en", "cz"] as const).every((l) =>
    a[l].orig === b[l].orig && a[l].trad === b[l].trad
  );

const base: Entry[] = JSON.parse(await Deno.readTextFile(BASE));
const byKey = new Map(base.map((e) => [e.key, { e, from: "base" }]));
const problems: string[] = [];
const files = [...Deno.readDirSync(DIR)].map((f) => f.name).filter((f) =>
  f.endsWith(".json")
).sort();
// A*.json settle conflicts: their entries are final (see LEXICON.md).
const final = new Map<string, Entry>(
  files.filter((f) => f.startsWith("A")).flatMap((f) =>
    (JSON.parse(Deno.readTextFileSync(`${DIR}/${f}`)) as Entry[]).map((
      e,
    ) => [e.key, e] as const)
  ),
);
for (const [k, e] of final) byKey.set(k, { e, from: "final" });
for (const f of files) {
  for (const e of JSON.parse(Deno.readTextFileSync(`${DIR}/${f}`)) as Entry[]) {
    if (final.has(e.key)) continue; // final entries are never merged into
    const had = byKey.get(e.key);
    if (!had) {
      byKey.set(e.key, { e: structuredClone(e), from: f });
      continue;
    }
    if (!same(had.e, e)) {
      problems.push(
        `CONFLICT ${e.key}: ${had.from} ${
          JSON.stringify([had.e.en, had.e.cz])
        } ≠ ${f} ${JSON.stringify([e.en, e.cz])}`,
      );
    }
    for (const l of ["en", "cz"] as const) {
      had.e.leak[l] = [...new Set([...had.e.leak[l], ...e.leak[l]])];
    }
  }
}
const all = [...byKey.values()].map((v) => v.e);
for (const l of ["en", "cz"] as const) {
  const owner = new Map<string, string>();
  for (const e of all) {
    for (const s of e.leak[l]) {
      const o = owner.get(s);
      if (o && o !== e.key) {
        problems.push(`SHARED ${l} stem "${s}": ${o}, ${e.key}`);
      }
      owner.set(s, e.key);
    }
  }
}
console.log(problems.join("\n") || "no conflicts");
console.log(
  `${all.length} entries (${base.length} base + ${files.length} files)`,
);
if (Deno.args.includes("--write")) {
  await Deno.writeTextFile(BASE, JSON.stringify(all, null, 2) + "\n");
}
