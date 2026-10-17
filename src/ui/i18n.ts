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
    trad: "familiar",
    both: "familiar, with the original",
    origShort: "Yeshua",
    tradShort: "Jesus",
    bothShort: "Jesus (Yeshua)",
    namesHint:
      "How should names and terms read? You can switch any time with the button at the top.",
    sample:
      "The beginning of the gospel of ⟦yeshua|Yeshua|Jesus⟧ ⟦mashiach|the Mashiach|Christ⟧, the Son of ⟦elohim|Elohim|God⟧.",
    namesList: "Names and terms",
    about: "About",
    aboutText:
      "A new translation straight from the Hebrew and Greek originals, in English and Czech. Names and terms can be read in their original or familiar form.",
    aboutRev: "Revision 1 (RC1)",
    appVersion: "App version",
    license: "License: text CC BY-SA 4.0 · app MIT",
    producedBy: "Produced by",
    dedication: "For the glory of our Lord and Savior Jesus Christ",
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
    both: "tradiční, s původními",
    origShort: "Ješua",
    tradShort: "Ježíš",
    bothShort: "Ježíš (Ješua)",
    namesHint:
      "Jak mají znít jména a pojmy? Kdykoli to změníte tlačítkem nahoře.",
    sample:
      "Počátek evangelia o ⟦yeshua|Ješuovi|Ježíši⟧ ⟦mashiach|Mašiachovi|Kristu⟧, ⟦elohim|Synu Elohim|Synu Božím⟧.",
    namesList: "Jména a pojmy",
    about: "O aplikaci",
    aboutText:
      "Nový překlad přímo z hebrejských a řeckých originálů, v angličtině a češtině. Jména a pojmy lze číst v původní nebo tradiční podobě.",
    aboutRev: "Revize 1 (RC1)",
    appVersion: "Verze aplikace",
    license: "Licence: text CC BY-SA 4.0 · aplikace MIT",
    producedBy: "Zpracování:",
    dedication: "Ke slávě našeho Pána a Spasitele Ježíše Krista",
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
