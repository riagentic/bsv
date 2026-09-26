// Pure: one book's markdown → reader HTML. Chapters become <section id="cN">,
// verse markers `[n]` become <sup class="v" id="cNvM">, and each chapter's
// "## Changes" / "## Změny" tail folds into a collapsed <details>, and
// name/term tokens resolve to the reader's mode (terms.ts).
import { marked } from "marked";
import { type Names, pickForms } from "./terms.ts";

const CHANGES = /^## (?:Changes|Změny)\s*$/m;
const VERSE = /^([ \t]*[*_]{0,3})\[(\d+)\] ?/gm;

export function renderBook(
  md: string,
  changesLabel: string,
  names: Names = "orig",
): string {
  return pickForms(md, names).split(/^(?=# )/m).filter((c) => c.trim()).map(
    (chunk, i) => {
      const c = i + 1;
      const cut = chunk.search(CHANGES);
      const body = (cut < 0 ? chunk : chunk.slice(0, cut))
        .replace(
          VERSE,
          (_, pre, v) => `${pre}<sup class="v" id="c${c}v${v}">${v}</sup>`,
        );
      const notes = cut < 0 ? "" : chunk.slice(cut).replace(CHANGES, "").trim();
      return `<section class="chapter" id="c${c}">${parse(body)}${
        notes
          ? `<details class="changes"><summary>${changesLabel}</summary>${
            parse(notes)
          }</details>`
          : ""
      }</section>`;
    },
  ).join("");
}

const parse = (md: string) =>
  marked.parse(md, { breaks: true, gfm: true, async: false }) as string;
