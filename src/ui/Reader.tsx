// The book view: mdview-style article + top bar (back, title, chapter picker,
// zoom, theme, language). Zoom keeps the verse you are reading in place:
// Ctrl+wheel / Ctrl +/-/0 on desktop, two-finger pinch on touch screens.
import type { JSX } from "aio";
import {
  afterRender,
  effect,
  onCleanup,
  onMount,
  onWindowEvent,
  signal,
  useRef,
  useResource,
} from "aio/air";
import { type Lang, reader } from "../cell.ts";
import { clampZoom, pinchZoom, ZOOM_STEP } from "../lib/zoom.ts";
import { index, loadBook, type Term, terms } from "./data.ts";
import { type Strings, T } from "./i18n.ts";
import { Icon } from "./Icon.tsx";
import {
  dict,
  DictButton,
  goUp,
  LangSwitch,
  NamesButton,
  picker,
  term,
  ThemeButton,
} from "./chrome.tsx";

const chapter = signal(1); // chapter at the top of the viewport
const zoomNow = signal(100); // live zoom (committed to the cell after a pause)
const badge = signal(false); // transient "120%" badge while zooming

const scroller = () => document.querySelector<HTMLElement>(".content-scroll");
const article = () => document.querySelector<HTMLElement>("article.book");

/** First verse marker at or below container-relative `y` (binary search; markers are in document order). */
function verseAt(y: number): HTMLElement | null {
  const box = scroller();
  if (!box) return null;
  const vs = box.querySelectorAll<HTMLElement>("sup.v");
  const top = box.getBoundingClientRect().top + y;
  let lo = 0, hi = vs.length - 1, hit: HTMLElement | null = null;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (vs[mid].getBoundingClientRect().bottom >= top) {
      (hit = vs[mid], hi = mid - 1);
    } else lo = mid + 1;
  }
  return hit;
}

/** Chapter whose section spans container-relative `y` (its notes box included). */
function chapterAt(y: number): number {
  const box = scroller();
  if (!box) return 1;
  const top = box.getBoundingClientRect().top + y;
  let c = 1;
  for (const s of box.querySelectorAll<HTMLElement>("section.chapter")) {
    if (s.getBoundingClientRect().top > top) break;
    c = Number(s.id.slice(1));
  }
  return c;
}

/** Run `change` (a relayout) without moving the verse that sits at viewport offset `y`. */
function keepPlace(change: () => void, y = 0): void {
  const box = scroller();
  const el = verseAt(y);
  const before = el?.getBoundingClientRect().top ?? 0;
  change();
  if (box && el) box.scrollTop += el.getBoundingClientRect().top - before;
}

let badgeTimer: ReturnType<typeof setTimeout> | undefined;
function applyZoom(z: number, y = 0): void {
  z = clampZoom(z);
  const el = article();
  if (!el || z === zoomNow.peek()) return;
  keepPlace(() => (el.style.fontSize = `${z}%`), y);
  zoomNow.set(z);
  badge.set(true);
  clearTimeout(badgeTimer);
  badgeTimer = setTimeout(() => badge.set(false), 1200);
}

function jump(c: number): void {
  picker.set(false);
  document.getElementById(`c${c}`)?.scrollIntoView({ block: "start" });
}

function Article({ html }: { html: string }): JSX.Element {
  const ref = useRef<HTMLElement>(null!);
  const last = useRef({ html: "", inner: { __html: "" } });
  const fresh = last.current.html !== html;
  if (fresh) last.current = { html, inner: { __html: html } };
  afterRender(() => {
    if (!fresh || !ref.current) return;
    ref.current.style.fontSize = `${reader.zoom}%`;
    zoomNow.set(reader.zoom);
    const at = reader.pos[String(reader.book)];
    const box = scroller();
    if (box) box.scrollTop = 0;
    if (at) document.getElementById(at)?.scrollIntoView({ block: "start" });
    chapter.set(Number(at?.match(/^c(\d+)/)?.[1] ?? 1));
  });
  return (
    <article
      ref={ref}
      class="book"
      dangerouslySetInnerHTML={last.current.inner}
      onClick={(e: Event) => {
        const k = (e.target as Element).closest<HTMLElement>(".t")?.dataset.k;
        if (k) term.set(k);
      }}
    />
  );
}

/** Tapped name/term: both forms, the original script, one line of meaning. */
function TermCard(
  { e, lang }: { e: Term | undefined; lang: Lang },
): JSX.Element | null {
  if (!e) return null;
  const close = () => term.set(null);
  return (
    <div class="sheet-backdrop" onClick={close}>
      <div
        class="sheet term-card"
        role="dialog"
        aria-label={e[lang].orig}
        onClick={(ev: Event) => ev.stopPropagation()}
      >
        <div class="sheet-head">
          <span>
            {e[lang].orig}
            <span class="term-trad">· {e[lang].trad}</span>
          </span>
          <button
            type="button"
            class="icon-btn"
            aria-label="Close"
            onClick={close}
          >
            <Icon name="close" />
          </button>
        </div>
        <p class="term-src" lang="he">{e.src}</p>
        <p class="term-note">{e.note[lang]}</p>
      </div>
    </div>
  );
}

function ChapterPicker(
  { count, tr: t }: { count: number; tr: Strings },
): JSX.Element {
  return (
    <div class="sheet-backdrop" onClick={() => picker.set(false)}>
      <div
        class="sheet"
        role="dialog"
        aria-label={t.chapter}
        onClick={(e: Event) => e.stopPropagation()}
      >
        <div class="sheet-head">
          <span>{t.chapter}</span>
          <button
            type="button"
            class="icon-btn"
            aria-label="Close"
            onClick={() => picker.set(false)}
          >
            <Icon name="close" />
          </button>
        </div>
        <div class="chapter-grid">
          {Array.from(
            { length: count },
            (_, i) => (
              <button
                type="button"
                key={i}
                class={i + 1 === chapter.value ? "chip on" : "chip"}
                aria-label={`${t.chapter} ${i + 1}`}
                onClick={() => jump(i + 1)}
              >
                {i + 1}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function Reader(): JSX.Element {
  const lang = reader.lang ?? "en";
  const t = T[lang];
  const book = index.latest.value?.[lang].find((b) => b.n === reader.book);
  const doc = useResource({
    key: () => (reader.lang && reader.book !== null
      ? `${reader.lang}/${String(reader.book).padStart(2, "0")}/${
        reader.names ?? "orig"
      }`
      : null),
    open: loadBook,
  });
  const html = doc.value;
  const lex = terms.latest.value; // loads with the book, so a tap opens at once

  onMount(() => {
    const box = scroller()!;
    // Remember the first visible verse; track the current chapter for the title.
    let raf = 0;
    let save: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        chapter.set(chapterAt(8));
        const v = verseAt(8);
        if (!v) return;
        clearTimeout(save);
        save = setTimeout(() => reader.setPos(String(reader.book), v.id), 400);
      });
    };
    box.addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    // Commit the live zoom to the cell once it settles.
    let zoomSave: ReturnType<typeof setTimeout> | undefined;
    const stopZoom = effect(() => {
      const z = zoomNow.value;
      clearTimeout(zoomSave);
      zoomSave = setTimeout(() => z !== reader.zoom && reader.setZoom(z), 300);
    });
    onCleanup(() => {
      removeEventListener("resize", onScroll);
      stopZoom();
      clearTimeout(zoomSave);
      clearTimeout(save);
      cancelAnimationFrame(raf);
    });

    // Two-finger pinch: scale the page as a preview, reflow once on release.
    let p: { d0: number; z0: number; y: number; z: number } | null = null;
    const dist = (e: TouchEvent) =>
      Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    box.addEventListener("touchstart", (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      const y = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const el = article()!;
      el.style.transformOrigin = `50% ${y - el.getBoundingClientRect().top}px`;
      p = {
        d0: dist(e),
        z0: zoomNow.peek(),
        y: y - box.getBoundingClientRect().top,
        z: zoomNow.peek(),
      };
    }, { passive: true });
    box.addEventListener("touchmove", (e: TouchEvent) => {
      if (!p || e.touches.length !== 2) return;
      e.preventDefault();
      p.z = pinchZoom(p.z0, p.d0, dist(e));
      article()!.style.transform = `scale(${p.z / p.z0})`;
    }, { passive: false });
    box.addEventListener("touchend", () => {
      if (!p) return;
      const { z, y } = p;
      p = null;
      article()!.style.transform = "";
      applyZoom(z, y);
    });
  });

  onWindowEvent("keydown", (e: KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey) || dict.peek()) return;
    if (e.key === "+" || e.key === "=") applyZoom(zoomNow.peek() + ZOOM_STEP);
    else if (e.key === "-") applyZoom(zoomNow.peek() - ZOOM_STEP);
    else if (e.key === "0") applyZoom(100);
    else return;
    e.preventDefault();
  });
  onWindowEvent("wheel", (e: WheelEvent) => {
    if (!(e.ctrlKey || e.metaKey) || dict.peek()) return;
    e.preventDefault();
    applyZoom(zoomNow.peek() + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
  }, { passive: false });

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
        <button
          type="button"
          class="title-btn"
          aria-label={t.chapter}
          disabled={!book}
          onClick={() => picker.set(true)}
        >
          <span class="title-book">{book?.name ?? ""}</span>
          <span class="title-ch">{chapter.value}</span>
          <Icon name="chevronDown" size={16} />
        </button>
        <span class="spacer" />
        <div class="zoom">
          <button
            type="button"
            class="icon-btn"
            aria-label={t.zoomOut}
            onClick={() => applyZoom(zoomNow.peek() - ZOOM_STEP)}
          >
            <Icon name="minus" />
          </button>
          <button
            type="button"
            class="zoom-pct"
            aria-label={t.zoomReset}
            onClick={() => applyZoom(100)}
          >
            {zoomNow.value}%
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label={t.zoomIn}
            onClick={() => applyZoom(zoomNow.peek() + ZOOM_STEP)}
          >
            <Icon name="plus" />
          </button>
        </div>
        <NamesButton />
        <DictButton />
        <LangSwitch />
        <ThemeButton />
      </header>
      <div class="content-scroll">
        {html
          ? <Article html={html} />
          : <p class="status">{doc.error.value ? t.failed : t.loading}</p>}
      </div>
      {badge.value ? <div class="zoom-badge">{zoomNow.value}%</div> : null}
      {picker.value && book
        ? <ChapterPicker count={book.chapters} tr={t} />
        : null}
      {term.value ? <TermCard e={lex?.get(term.value)} lang={lang} /> : null}
    </div>
  );
}
