// Static text shipped next to the page (text/…, made by `deno task text`).
// Relative URLs: the APK serves the page from /assets/, Electron from /.
import { resource } from "aio/air";
import type { Lang } from "../cell.ts";
import { renderBook } from "../lib/book.ts";
import type { Names } from "../lib/terms.ts";
import { type Glossary, parseGlossary } from "../lib/glossary.ts";
import { T } from "./i18n.ts";

export type Book = { n: number; id: string; name: string; chapters: number };
export type Index = Record<Lang, Book[]>;

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
  return renderBook(
    await (await get(`text/${lang}/${book}.md`, signal)).text(),
    T[lang as Lang].changes,
    names as Names,
  );
};

/** Parsed dictionary for `lang`. Held by the dictionary view via `useResource`. */
export const loadGlossary = async (
  lang: string | number,
  { signal }: { signal: AbortSignal },
): Promise<Glossary> =>
  parseGlossary(await (await get(`text/glossary-${lang}.md`, signal)).text());

export type Term = {
  key: string;
  src: string;
  en: { orig: string; trad: string };
  cz: { orig: string; trad: string };
  note: Record<Lang, string>;
};

/** Name/term lexicon by key, for the tap card. */
export const terms = resource(
  () => 0,
  async (_, { signal }) =>
    new Map(
      ((await (await get("text/terms.json", signal)).json()) as Term[])
        .map((t) => [t.key, t]),
    ),
);
