// First run, after the language: how names and terms read. Each card shows
// Mark 1:1 through the real renderer, so the preview is exactly what you get.
import type { JSX } from "aio";
import { reader } from "../cell.ts";
import { NAMES, pickForms, PLAIN } from "../lib/terms.ts";
import { terms } from "./data.ts";
import { T } from "./i18n.ts";

export default function NamesChoice(): JSX.Element {
  const lang = reader.lang ?? "en";
  const t = T[lang];
  const lex = terms.latest.value;
  return (
    <main class="welcome names-choice">
      <h1 class="welcome-title">{t.names}</h1>
      <p class="names-hint">{t.namesHint}</p>
      <div class="names-cards">
        {NAMES.map((mode) => (
          <button
            key={mode}
            type="button"
            class="lang-card names-card"
            onClick={() => reader.setNames(mode)}
          >
            <span class="lang-name">{t[mode]}</span>
            <span class="names-sample">
              {pickForms(
                t.sample,
                mode,
                (k) => lex?.get(k)?.[lang].orig,
                PLAIN,
              )}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
