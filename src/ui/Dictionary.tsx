// Dictionary: a layer over the books / reader. Browse by section, or type to
// search terms and meanings (case, accents and Hebrew points ignored).
import type { JSX } from "aio";
import { signal, useResource } from "aio/air";
import { reader } from "../cell.ts";
import { type Entry, searchGlossary } from "../lib/glossary.ts";
import { dict } from "./chrome.tsx";
import { loadGlossary } from "./data.ts";
import { T } from "./i18n.ts";
import { Icon } from "./Icon.tsx";

const query = signal("");

function Item({ e }: { e: Entry }): JSX.Element {
  return (
    <div class="term">
      <h3 class="term-name">{e.term}</h3>
      <p class="term-text" dangerouslySetInnerHTML={{ __html: e.html }} />
    </div>
  );
}

export default function Dictionary(): JSX.Element {
  const lang = reader.lang ?? "en";
  const t = T[lang];
  const doc = useResource({ key: () => reader.lang, open: loadGlossary });
  const g = doc.value;
  const q = query.value;
  const found = g && q.trim() ? searchGlossary(g, q) : null;
  const top = () =>
    document.querySelector(".dict .content-scroll")?.scrollTo(0, 0);
  return (
    <div class="viewer dict" role="dialog" aria-label={t.dict}>
      <header class="bar">
        <button
          type="button"
          class="icon-btn"
          aria-label={t.back}
          onClick={() => dict.set(false)}
        >
          <Icon name="back" />
        </button>
        <label class="search">
          <Icon name="search" size={18} />
          <input
            type="search"
            value={q}
            placeholder={t.search}
            aria-label={t.search}
            autoComplete="off"
            spellcheck={false}
            onInput={(e: Event) => {
              query.set((e.target as HTMLInputElement).value);
              top();
            }}
            onKeyDown={(e: KeyboardEvent) => {
              // Esc clears the field first; the next Esc closes (App).
              if (e.key !== "Escape" || !q) return;
              e.stopPropagation();
              query.set("");
            }}
          />
          {q
            ? (
              <button
                type="button"
                class="icon-btn"
                aria-label={t.clear}
                onClick={() => query.set("")}
              >
                <Icon name="close" size={18} />
              </button>
            )
            : null}
        </label>
      </header>
      <div class="content-scroll">
        {!g
          ? <p class="status">{doc.error.value ? t.failed : t.loading}</p>
          : found
          ? (
            <div class="glossary">
              {found.length
                ? found.map((e) => <Item key={e.term} e={e} />)
                : <p class="status">{t.none}</p>}
            </div>
          )
          : (
            <div class="glossary">
              <h1>{g.title}</h1>
              <p
                class="glossary-intro"
                dangerouslySetInnerHTML={{ __html: g.intro }}
              />
              {g.sections.map((s) => (
                <section key={s.title}>
                  <h2 class="section">{s.title}</h2>
                  {s.entries.map((e) => <Item key={e.term} e={e} />)}
                </section>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
