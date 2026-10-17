// First screen: pick the language.
import type { JSX } from "aio";
import { reader } from "../cell.ts";
import { about } from "./chrome.tsx";
import { index } from "./data.ts";
import { MARK } from "./mark.ts";

export default function Welcome(): JSX.Element {
  const czReady = (index.latest.value?.cz.length ?? 0) > 0;
  return (
    <main class="welcome">
      <button
        type="button"
        class="welcome-icon"
        aria-label="About"
        title="About"
        onClick={() => about.set(true)}
        dangerouslySetInnerHTML={{ __html: MARK }}
      />
      <h1 class="welcome-title">Bible</h1>
      <div class="welcome-langs">
        <button
          type="button"
          class="lang-card"
          aria-label="Čeština"
          disabled={!czReady}
          onClick={() => reader.setLang("cz")}
        >
          <span class="lang-code">CZ</span>
          <span class="lang-name">
            {czReady ? "Čeština" : "Čeština · připravujeme"}
          </span>
        </button>
        <button
          type="button"
          class="lang-card"
          aria-label="English"
          onClick={() => reader.setLang("en")}
        >
          <span class="lang-code">EN</span>
          <span class="lang-name">English</span>
        </button>
      </div>
    </main>
  );
}
