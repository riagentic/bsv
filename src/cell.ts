// The reader: which language, which book, text size, theme, and where you stopped.
import { cell } from "aio";
import type { Names } from "./lib/terms.ts";
import { clampZoom } from "./lib/zoom.ts";

export type Lang = "en" | "cz";
export type Theme = "auto" | "light" | "dark";
export type State = {
  lang: Lang | null;
  book: number | null;
  zoom: number;
  theme: Theme;
  /** Names and terms: original, traditional, or traditional + original gloss; null until chosen. */
  names: Names | null;
  /** book number → anchor id of the first visible verse ("c3v12"). */
  pos: Record<string, string>;
  /** lang → last opened book, for "continue reading". */
  last: Record<string, number>;
};

export const reader = cell("reader", {
  state: {
    lang: null,
    book: null,
    zoom: 100,
    theme: "auto",
    names: null,
    pos: {},
    last: {},
  } as State,
  methods: {
    setLang(s, lang: Lang) {
      s.lang = lang;
    },
    openBook(s, book: number) {
      if (!s.lang) throw new Error("pick a language first");
      s.book = book;
      s.last[s.lang] = book;
    },
    /** One level up: reader → books → language. */
    up(s) {
      if (s.book !== null) s.book = null;
      else s.lang = null;
    },
    setZoom(s, zoom: number) {
      s.zoom = clampZoom(zoom);
    },
    setTheme(s, theme: Theme) {
      s.theme = theme;
    },
    setNames(s, names: Names) {
      s.names = names;
    },
    setPos(s, key: string, anchor: string) {
      s.pos[key] = anchor;
    },
  },
});
