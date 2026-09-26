import type { Lang } from "../cell.ts";

export const T = {
  en: {
    ot: "Old Testament",
    nt: "New Testament",
    cont: "Continue reading",
    changes: "Changes & notes",
    chapter: "Chapter",
    back: "Back",
    loading: "Loading…",
    failed: "Could not load the text.",
    other: "Čeština",
    otherShort: "CZ",
    theme: "Toggle theme",
    zoomIn: "Larger text",
    zoomOut: "Smaller text",
    zoomReset: "Reset text size",
    dict: "Dictionary",
    search: "Search a word…",
    none: "No match.",
    clear: "Clear",
    names: "Names and terms",
    orig: "original",
    trad: "traditional",
    both: "original with traditional",
    origShort: "Yeshua",
    tradShort: "Jesus",
    bothShort: "Yeshua·Jesus",
  },
  cz: {
    ot: "Starý zákon",
    nt: "Nový zákon",
    cont: "Pokračovat ve čtení",
    changes: "Změny a poznámky",
    chapter: "Kapitola",
    back: "Zpět",
    loading: "Načítám…",
    failed: "Text se nepodařilo načíst.",
    other: "English",
    otherShort: "EN",
    theme: "Přepnout motiv",
    zoomIn: "Větší písmo",
    zoomOut: "Menší písmo",
    zoomReset: "Výchozí velikost písma",
    dict: "Slovník",
    search: "Hledat slovo…",
    none: "Nic nenalezeno.",
    clear: "Vymazat",
    names: "Jména a pojmy",
    orig: "původní",
    trad: "tradiční",
    both: "původní s tradičními",
    origShort: "Ješua",
    tradShort: "Ježíš",
    bothShort: "Ješua·Ježíš",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type Strings = Record<keyof (typeof T)["en"], string>;

/** "1 chapter" · "3 chapters" · CZ: 1 kapitola · 2–4 kapitoly · 5+ kapitol. */
export const chapterCount = (lang: Lang, n: number): string =>
  lang === "en"
    ? `${n} chapter${n === 1 ? "" : "s"}`
    : `${n} ${
      n === 1 ? "kapitola" : n >= 2 && n <= 4 ? "kapitoly" : "kapitol"
    }`;
