// Shared chrome: theme, language switch, and "one level up"
// (reader → books → language) for the toolbar, Esc / Alt+← and Android Back.
import type { JSX } from "aio";
import { signal } from "aio/air";
import { reader } from "../cell.ts";
import { index } from "./data.ts";
import { T } from "./i18n.ts";
import { Icon } from "./Icon.tsx";

/** Chapter picker sheet; "up" closes it before leaving the book. */
export const picker = signal(false);
/** Dictionary layer over the current screen; "up" closes it first. */
export const dict = signal(false);

/** Key of the tapped name/term; its card closes first on "up". */
export const term = signal<string | null>(null);

/** Go one level up; false at the language screen (Android then leaves the app). */
export function goUp(): boolean {
  if (term.value) return term.set(null), true;
  if (picker.value) return picker.set(false), true;
  if (dict.value) return dict.set(false), true;
  if (!reader.lang) return false;
  reader.up();
  return true;
}

export const isDark = (): boolean =>
  reader.theme === "dark" ||
  (reader.theme === "auto" &&
    matchMedia("(prefers-color-scheme: dark)").matches);

export function ThemeButton(): JSX.Element {
  const dark = isDark();
  return (
    <button
      type="button"
      class="icon-btn"
      aria-label={T[reader.lang ?? "en"].theme}
      onClick={() => reader.setTheme(dark ? "light" : "dark")}
    >
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}

export function DictButton(): JSX.Element {
  return (
    <button
      type="button"
      class="icon-btn"
      aria-label={T[reader.lang ?? "en"].dict}
      title={T[reader.lang ?? "en"].dict}
      onClick={() => dict.set(true)}
    >
      <Icon name="dict" />
    </button>
  );
}

const NEXT = { orig: "trad", trad: "both", both: "orig" } as const;

/** Names and terms: original → traditional → both; the label shows the effect. */
export function NamesButton(): JSX.Element {
  const t = T[reader.lang ?? "en"];
  const mode = reader.names ?? "orig";
  return (
    <button
      type="button"
      class="lang-btn names-btn"
      aria-label={`${t.names}: ${t[mode]}`}
      title={`${t.names}: ${t[mode]}`}
      onClick={() => reader.setNames(NEXT[mode])}
    >
      {t[`${mode}Short`]}
    </button>
  );
}

export function LangSwitch(): JSX.Element {
  const lang = reader.lang ?? "en";
  const other = lang === "en" ? "cz" : "en";
  const ready = (index.latest.value?.[other].length ?? 0) > 0;
  return (
    <button
      type="button"
      class="lang-btn"
      aria-label={T[lang].other}
      disabled={!ready}
      onClick={() => reader.setLang(other)}
    >
      {T[lang].otherShort}
    </button>
  );
}
