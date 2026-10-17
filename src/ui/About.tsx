// About: a layer over any screen, opened from the Bible mark on the first screen.
import type { JSX } from "aio";
import { reader } from "../cell.ts";
import { aboutLang, closeAbout } from "./chrome.tsx";
import { index } from "./data.ts";
import { T } from "./i18n.ts";
import { Icon } from "./Icon.tsx";

export default function About(): JSX.Element {
  const lang = aboutLang.value ?? reader.lang ?? "en";
  const other = lang === "en" ? "cz" : "en";
  const t = T[lang];
  return (
    <div class="viewer dict" role="dialog" aria-label={t.about}>
      <header class="bar">
        <button
          type="button"
          class="icon-btn"
          aria-label={t.back}
          onClick={closeAbout}
        >
          <Icon name="back" />
        </button>
        <span class="bar-title">{t.about}</span>
        <span class="spacer" />
        <button
          type="button"
          class="lang-btn"
          aria-label={t.other}
          onClick={() => aboutLang.set(other)}
        >
          {t.otherShort}
        </button>
      </header>
      <div class="content-scroll">
        <div class="glossary about">
          <h1>Bible Source Version (BSV)</h1>
          <p class="about-dedication">{t.dedication}</p>
          <p class="glossary-intro">{t.aboutText}</p>
          <p class="glossary-intro">
            {t.aboutRev}
            <br />
            {t.appVersion} {index.latest.value?.app ?? ""}
            <br />
            {t.license}
            <br />
            {t.producedBy} riagentic · © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
