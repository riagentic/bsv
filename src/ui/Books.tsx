// Book list: "continue reading" on top, then Old / New Testament.
import type { JSX } from "aio";
import { type Lang, reader } from "../cell.ts";
import { type Book, index } from "./data.ts";
import { chapterCount, T } from "./i18n.ts";
import { Icon } from "./Icon.tsx";
import { DictButton, goUp, LangSwitch, ThemeButton } from "./chrome.tsx";

function Tile({ b, lang }: { b: Book; lang: Lang }): JSX.Element {
  return (
    <button
      type="button"
      class="tile"
      aria-label={b.name}
      onClick={() => reader.openBook(b.n)}
    >
      <span class="tile-name">{b.name}</span>
      <span class="tile-meta">{chapterCount(lang, b.chapters)}</span>
    </button>
  );
}

export default function Books(): JSX.Element {
  const lang = reader.lang ?? "en";
  const t = T[lang];
  const books = index.latest.value?.[lang] ?? [];
  const last = books.find((b) => b.n === reader.last[lang]);
  const lastCh = reader.pos[String(last?.n)]?.match(/^c(\d+)/)?.[1] ?? "1";
  return (
    <div class="viewer">
      <header class="bar">
        <button
          type="button"
          class="icon-btn"
          aria-label={t.back}
          onClick={goUp}
        >
          <Icon name="back" />
        </button>
        <span class="bar-title">Bible</span>
        <span class="spacer" />
        <DictButton />
        <LangSwitch />
        <ThemeButton />
      </header>
      <div class="content-scroll">
        <div class="books">
          {last
            ? (
              <button
                type="button"
                class="continue"
                aria-label={t.cont}
                onClick={() => reader.openBook(last.n)}
              >
                <Icon name="book" size={22} />
                <span class="continue-text">
                  <span class="continue-label">{t.cont}</span>
                  <span class="continue-where">{last.name} {lastCh}</span>
                </span>
                <Icon name="chevronRight" />
              </button>
            )
            : null}
          <h2 class="section">{t.ot}</h2>
          <div class="grid">
            {books.filter((b) => b.n <= 39).map((b) => (
              <Tile key={b.n} b={b} lang={lang} />
            ))}
          </div>
          <h2 class="section">{t.nt}</h2>
          <div class="grid">
            {books.filter((b) => b.n > 39).map((b) => (
              <Tile key={b.n} b={b} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
