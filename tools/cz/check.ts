// Validates Czech chapters against their EN source (tools/cz/STYLE.md §3).
// usage: deno run -A tools/cz/check.ts [01-Gen/Gen01.md …]   (no args = every chapter; --summary)
const EN = "/home/dev/code/gen/word/bible-kjv-v2";
const CZ = "/home/dev/code/gen/word/bible-kjv-v2-cz";
const NAMES =
  "Genesis|Exodus|Leviticus|Numeri|Deuteronomium|Jozue|Soudců|Rút|1. Samuelova|2. Samuelova|1. Královská|2. Královská|1. Paralipomenon|2. Paralipomenon|Ezdráš|Nehemjáš|Ester|Jób|Žalm|Přísloví|Kazatel|Píseň písní|Izajáš|Jeremjáš|Pláč|Ezechiel|Daniel|Ozeáš|Jóel|Ámos|Abdijáš|Jonáš|Micheáš|Nahum|Abakuk|Sofonjáš|Ageus|Zacharjáš|Malachiáš|Matouš|Marek|Lukáš|Jan|Skutky|Římanům|1. Korintským|2. Korintským|Galatským|Efezským|Filipským|Koloským|1. Tesalonickým|2. Tesalonickým|1. Timoteovi|2. Timoteovi|Titovi|Filemonovi|Židům|Jakubův|1. Petrův|2. Petrův|1. Janův|2. Janův|3. Janův|Judův|Zjevení"
    .split("|");

const verses = (s: string) =>
  [...s.matchAll(/\[(\d+)\]/g)].map((m) => +m[1]).join(",");
const body = (s: string, h: string) => s.split(h)[0];
const EN_WORDS =
  /(?<!\p{L})(the|and|of|that|which|with|shall|unto|you|your|he|his)(?!\p{L})/giu;

export function check(rel: string, en: string, cz: string): string[] {
  const e: string[] = [];
  const book = +rel.slice(0, 2), ch = +(rel.match(/(\d+)\.md$/)?.[1] ?? 0);
  const head = cz.split("\n", 1)[0];
  if (head !== `# ${NAMES[book - 1]} ${ch}`) {
    e.push(`heading "${head}" ≠ "# ${NAMES[book - 1]} ${ch}"`);
  }
  const ev = verses(body(en, "\n## Changes")),
    cv = verses(body(cz, "\n## Změny"));
  if (ev !== cv) e.push(`verses differ: EN [${ev}] CZ [${cv}]`);
  if (!cz.includes("\n## Změny")) e.push("missing ## Změny");
  if (en.includes("\n### Notes") !== cz.includes("\n### Poznámky")) {
    e.push("### Notes ↔ ### Poznámky mismatch");
  }
  if (/^>/m.test(cz)) e.push("blockquote");
  if (/\n## Changes|\n### Notes/.test(cz)) e.push("untranslated heading");
  const text = body(cz, "\n## Změny").replace(/\*[^*\n]+\*/g, "");
  const eng = (text.match(EN_WORDS) ?? []).length;
  if (eng > 3) e.push(`${eng} English function words in verse text`);
  if (cz.length < en.length * 0.7) {
    e.push(`too short (${cz.length} vs EN ${en.length})`);
  }
  return e;
}

if (import.meta.main) {
  const summary = Deno.args.includes("--summary");
  let rels = Deno.args.filter((a) => !a.startsWith("--"));
  if (!rels.length) {
    for (
      const d of [...Deno.readDirSync(EN)].filter((d) => /^\d\d-/.test(d.name))
        .map((d) => d.name).sort()
    ) {
      for (
        const f of [...Deno.readDirSync(`${EN}/${d}`)].map((f) => f.name).sort()
      ) rels.push(`${d}/${f}`);
    }
  }
  rels = rels.map((r) => r.replace(/^.*?(\d\d-[^/]+\/[^/]+\.md)$/, "$1"));
  let ok = 0, missing = 0, bad = 0;
  for (const rel of rels) {
    let cz: string;
    try {
      cz = Deno.readTextFileSync(`${CZ}/${rel}`);
    } catch {
      missing++;
      if (!summary) console.log(`MISSING ${rel}`);
      continue;
    }
    const errs = check(rel, Deno.readTextFileSync(`${EN}/${rel}`), cz);
    if (errs.length) {
      bad++;
      console.log(`FAIL ${rel}: ${errs.join("; ")}`);
    } else {
      ok++;
      if (!summary) console.log(`OK ${rel}`);
    }
  }
  console.log(
    `ok ${ok} · fail ${bad} · missing ${missing} · total ${rels.length}`,
  );
  if (bad || (!summary && missing)) Deno.exit(1);
}
