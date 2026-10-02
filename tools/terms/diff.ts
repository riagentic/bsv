// Tagging must not change the text: compare each verse line with git HEAD.
//   deno run -A tools/terms/diff.ts <en|cz> <NN-Book/BookNN.md>...
// FAIL: text outside tokens changed (must be fixed).
// NOTE: a token replaced a word that is neither of its forms (Yahweh → Jahvem):
//       counted per pair, for review.
import { TOKEN } from "../../src/lib/terms.ts";

const ROOT = { en: "bible-kjv-v2", cz: "bible-kjv-v2-cz" } as const;
const [lang, ...files] = Deno.args as ["en" | "cz", ...string[]];
const dir = `/home/dev/code/gen/word/${ROOT[lang]}`;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const git = async (f: string) =>
  new TextDecoder().decode(
    (await new Deno.Command("git", { args: ["show", `HEAD:./${f}`], cwd: dir })
      .output()).stdout,
  );

// Leak stems (base + pending terms.d): a plain word may change only if the old
// word is a known leftover (Asher → Ašer where orig == trad).
const CONTENT = new URL("../../content/", import.meta.url);
const lexFiles = [
  "terms.json",
  ...[...Deno.readDirSync(new URL("terms.d/", CONTENT))]
    .filter((f) => f.name.endsWith(".json")).map((f) => `terms.d/${f.name}`),
];
const stems = lexFiles.flatMap((p) =>
  (JSON.parse(Deno.readTextFileSync(new URL(p, CONTENT))) as {
    leak: Record<string, string[]>;
  }[]).flatMap((e) => e.leak[lang])
);
const bare = (w: string) => w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
const leftover = (w: string) =>
  stems.some((s) =>
    s.endsWith("=") ? bare(w) === s.slice(0, -1) : bare(w).startsWith(s)
  );
let fails = 0;
const notes = new Map<string, number>();
for (const f of files) {
  const head = (await git(f)).split("\n");
  let now = (await Deno.readTextFile(`${dir}/${f}`)).split("\n");
  if (head.length !== now.length) {
    // A text fix adds a `- **…` line under Changes: report it, then compare the rest.
    const old = new Set(head);
    const added = now.filter((l) => l.startsWith("- **") && !old.has(l));
    if (now.length - added.length === head.length) {
      for (const l of added) {
        fails++;
        console.log(`FAIL ${f} (Changes, new line)\n  + ${l}`);
      }
      now = now.filter((l) => !added.includes(l));
    }
  }
  if (head.length !== now.length) {
    console.log(`FAIL ${f}: line count ${head.length} → ${now.length}`);
    fails++;
    continue;
  }
  let notes_ = false; // inside ## Changes / ## Změny: nothing may change
  now.forEach((line, i) => {
    if (/^# /.test(line)) notes_ = false;
    if (/^## (?:Changes|Změny)\s*$/.test(line)) notes_ = true;
    if (line === head[i]) return;
    if (notes_) {
      fails++;
      console.log(`FAIL ${f}:${i + 1} (Changes)\n  - ${head[i]}\n  + ${line}`);
      return;
    }
    // Tokens capture any span. Plain words must stay; only if that fails may a
    // whole word differ (a leftover fix, checked below).
    const parts = line.split(TOKEN);
    const build = (fix: boolean, kinds: (string | null)[]) =>
      new RegExp(
        `^${
          parts.map((p, j) => {
            if (j % 4 === 1) return kinds.push(null), "(.+?)";
            if (j % 4) return "";
            const ws = p.split(/(\s+)/);
            return ws.map((w, n) =>
              !fix || n % 2 || !w || (n === 0 && j > 0) ||
                (n === ws.length - 1 && j < parts.length - 1)
                ? esc(w)
                : (kinds.push(w), `(?:${esc(w)}|(\\S+))`)
            ).join("");
          }).join("")
        }$`,
        "u",
      );
    // Tokens in HEAD (already tagged earlier) count as their original form.
    const was = head[i].replace(TOKEN, (_, _k, o) => o);
    let kinds: (string | null)[] = [];
    let m = was.match(build(false, kinds));
    if (!m) m = was.match(build(true, kinds = []));
    const tokens = [...line.matchAll(TOKEN)];
    const hit = m;
    if (
      !hit || kinds.some((w, g) => w && hit[g + 1] && !leftover(hit[g + 1]))
    ) {
      fails++;
      console.log(`FAIL ${f}:${i + 1}\n  - ${head[i]}\n  + ${line}`);
      return;
    }
    const note = (key: string) => notes.set(key, (notes.get(key) ?? 0) + 1);
    let t = 0;
    kinds.forEach((w, g) => {
      const x = hit[g + 1];
      if (w) return x && note(`leftover: ${bare(x)} → ${bare(w)}`);
      const [, k, o, tr] = tokens[t++];
      const was = x.replace(/\*/g, "");
      if (was !== o && was !== tr) note(`${k}: ${was} → ${o}`);
    });
  });
}
for (const [k, n] of [...notes].sort((a, b) => b[1] - a[1])) {
  console.log(`NOTE ${k} ×${n}`);
}
console.log(fails ? `${fails} FAIL` : "text unchanged outside tokens");
Deno.exit(fails ? 1 : 0);
