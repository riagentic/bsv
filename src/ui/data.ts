// Static text shipped next to the page (text/…, made by `deno task text`).
// Relative URLs: the APK serves the page from /assets/, Electron from /.
import { resource } from "aio/air";
import type { Lang } from "../cell.ts";
import { renderBook } from "../lib/book.ts";
import type { Names } from "../lib/terms.ts";
import {
  type Glossary,
  lexiconSection,
  parseGlossary,
} from "../lib/glossary.ts";
import { T } from "./i18n.ts";

export type Book = { n: number; id: string; name: string; chapters: number };
/** Books per language + the app version (`deno task text`). */
export type Index = Record<Lang, Book[]> & { app: string };

const get = async (url: string, signal?: AbortSignal) => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res;
};

export const index = resource(
  () => 0,
  async (_, { signal }) =>
    (await (await get("text/index.json", signal)).json()) as Index,
);

/** Rendered HTML of `key` ("en/19/orig": lang/book/names). Held by the reader via `useResource`. */
export const loadBook = async (
  key: string | number,
  { signal }: { signal: AbortSignal },
): Promise<string> => {
  const [lang, book, names] = String(key).split("/");
  const [md, lex] = await Promise.all([
    get(`text/${lang}/${book}.md`, signal).then((r) => r.text()),
    names === "both" ? loadTerms(signal) : undefined,
  ]);
  return renderBook(
    md,
    T[lang as Lang].changes,
    names as Names,
    (k) => lex?.get(k)?.[lang as Lang].orig,
  );
};

/** Parsed dictionary for `lang`, ending with the names-and-terms lexicon (one source: terms.json). */
export const loadGlossary = async (
  key: string | number,
  { signal }: { signal: AbortSignal },
): Promise<Glossary> => {
  const lang = String(key) as Lang;
  const [md, lex] = await Promise.all([
    get(`text/glossary-${lang}.md`, signal).then((r) => r.text()),
    loadTerms(signal),
  ]);
  const g = parseGlossary(md);
  const items = [...lex.values()].map((e) => ({
    ...e[lang],
    src: e.src,
    note: e.note[lang],
  }));
  const t = T[lang];
  return {
    ...g,
    sections: [
      ...g.sections,
      lexiconSection(t.namesList, items, lang === "cz" ? "cs" : "en"),
    ],
  };
};

export type Term = {
  key: string;
  src: string;
  en: { orig: string; trad: string };
  cz: { orig: string; trad: string };
  note: Record<Lang, string>;
};

const loadTerms = async (signal?: AbortSignal) =>
  new Map(
    ((await (await get("text/terms.json", signal)).json()) as Term[])
      .map((t) => [t.key, t]),
  );

/** Name/term lexicon by key, for the tap card. */
export const terms = resource(() => 0, (_, { signal }) => loadTerms(signal));
