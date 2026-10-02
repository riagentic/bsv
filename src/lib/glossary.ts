// Pure: dictionary markdown (content/glossary.*.md) → sections of entries,
// and a search that ignores case, accents and Hebrew vowel points.
import { marked } from "marked";

export type Entry = { term: string; html: string; key: string; hit: string };
export type Section = { title: string; entries: Entry[] };
export type Glossary = { title: string; intro: string; sections: Section[] };

/** "Šekel" → "sekel", "אֱלֹהִים" → "אלהים": search is forgiving. */
export const fold = (s: string): string =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const inline = (md: string) =>
  marked.parseInline(md, { async: false }) as string;

/** `# Title` · intro · `## Section` · `### Term` + one paragraph each. */
export function parseGlossary(md: string): Glossary {
  const [head, ...secs] = md.split(/^## /m);
  return {
    title: head.match(/^# (.+)$/m)?.[1].trim() ?? "",
    intro: inline(head.replace(/^# .+$/m, "").trim()),
    sections: secs.map((s) => {
      const [title, ...entries] = s.split(/^### /m);
      return {
        title: title.trim(),
        entries: entries.map((e) => {
          const [term, ...body] = e.trim().split("\n");
          const md = body.join(" ").trim();
          return {
            term: term.trim(),
            html: inline(md),
            key: fold(md),
            hit: fold(term),
          };
        }),
      };
    }),
  };
}

/** One lexicon entry in one language (see content/terms.json). */
export type Lemma = { orig: string; trad: string; src: string; note: string };

const esc = (s: string) =>
  s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

/** The names-and-terms lexicon as one dictionary section, A–Z by original. */
export function lexiconSection(
  title: string,
  items: Lemma[],
  locale: string,
): Section {
  return {
    title,
    entries: [...items]
      .sort((a, b) => a.orig.localeCompare(b.orig, locale))
      .map((e) => {
        const term = `${e.orig} · ${e.trad}`;
        return {
          term,
          html: `<span class="term-src">${esc(e.src)}</span> ${esc(e.note)}`,
          key: fold(`${e.src} ${e.note}`),
          hit: fold(term),
        };
      }),
  };
}

/** Entries matching `q`: term matches first, then matches in the text. */
export function searchGlossary(g: Glossary, q: string): Entry[] {
  const f = fold(q.trim());
  const all = g.sections.flatMap((s) => s.entries);
  return [
    ...all.filter((e) => e.hit.includes(f)),
    ...all.filter((e) => !e.hit.includes(f) && e.key.includes(f)),
  ];
}
