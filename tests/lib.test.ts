import { assert, assertEquals } from "@std/assert";
import { renderBook } from "../src/lib/book.ts";
import { clampZoom, pinchZoom } from "../src/lib/zoom.ts";
import {
  lexiconSection,
  parseGlossary,
  searchGlossary,
} from "../src/lib/glossary.ts";
import { chapterCount } from "../src/ui/i18n.ts";
import { pickForms, PLAIN } from "../src/lib/terms.ts";

const MD = `# Psalm 1

[1] Blessed is the one
who does not walk.

**[2] But his delight**

## Changes

- **"x" → "y"** (v1) — why.

### Notes

- context

# Psalm 2

[1] Why do the nations rage?

## Changes

- No significant deviations from KJV in this chapter.
`;

Deno.test("renderBook: chapters, verse anchors, poetry lines, folded changes", () => {
  const html = renderBook(MD, "Changes & notes");
  assertEquals(html.match(/<section class="chapter" id="c\d+">/g)?.length, 2);
  assert(html.includes('<sup class="v" id="c1v1">1</sup>'));
  assert(
    html.includes(
      '<strong><sup class="v" id="c1v2">2</sup>But his delight</strong>',
    ),
  );
  assert(html.includes('<sup class="v" id="c2v1">1</sup>'));
  assert(
    /one<br>\s*who does not walk/.test(html),
    "poetry keeps its line break",
  );
  assertEquals(
    html.match(
      /<details class="changes"><summary>Changes &amp; notes<\/summary>|<details class="changes"><summary>Changes & notes<\/summary>/g,
    )?.length,
    2,
  );
  assert(!html.includes("<h2>Changes</h2>"), "the heading becomes the summary");
  assert(html.includes("<h3>Notes</h3>"), "notes stay inside the fold");
});

Deno.test("renderBook: Ps 119 letter headings stay in the text", () => {
  const html = renderBook(
    "# Psalm 119\n\n## א Aleph\n\n[1] Blessed\n\n## Changes\n\n- none\n",
    "C",
  );
  assert(html.indexOf("Aleph") < html.indexOf("<details"));
});

Deno.test("zoom math", () => {
  assertEquals(clampZoom(33), 60);
  assertEquals(clampZoom(999), 250);
  assertEquals(clampZoom(104.6), 105);
  assertEquals(pinchZoom(100, 100, 150), 150);
  assertEquals(pinchZoom(120, 200, 100), 60);
  assertEquals(pinchZoom(100, 0, 50), 100);
});

Deno.test("chapterCount plurals", () => {
  assertEquals([1, 3].map((n) => chapterCount("en", n)), [
    "1 chapter",
    "3 chapters",
  ]);
  assertEquals([1, 4, 5, 22].map((n) => chapterCount("cz", n)), [
    "1 kapitola",
    "4 kapitoly",
    "5 kapitol",
    "22 kapitol",
  ]);
});

Deno.test("glossary: parse, both files well-formed, forgiving search", async () => {
  const g = parseGlossary(
    "# Dict\n\nIntro *x*.\n\n## Names\n\n### Yahweh\nHebrew יהוה. KJV: LORD.\n\n### Šekel\nWeight, see *Yahweh*.\n",
  );
  assertEquals(g.title, "Dict");
  assertEquals(g.intro, "Intro <em>x</em>.");
  assertEquals(g.sections[0].entries.map((e) => e.term), ["Yahweh", "Šekel"]);
  assertEquals(searchGlossary(g, "sekel").map((e) => e.term), ["Šekel"]);
  assertEquals(searchGlossary(g, "YAHWEH").map((e) => e.term), [
    "Yahweh",
    "Šekel",
  ]);
  assertEquals(searchGlossary(g, "lord").length, 1);
  assertEquals(searchGlossary(g, "").length, 2);
  for (const lang of ["en", "cz"]) {
    const md = await Deno.readTextFile(`content/glossary.${lang}.md`);
    const { sections } = parseGlossary(md);
    const terms = sections.flatMap((s) => s.entries);
    assert(terms.length > 100, `${lang}: ${terms.length} entries`);
    assert(terms.every((e) => e.term && e.html), `${lang}: empty entry`);
  }
});

Deno.test("pickForms: original, familiar, and familiar + original gloss once per chapter", () => {
  const md =
    "# A\n\n[1] ⟦yeshua|Ješua|Ježíš⟧ a ⟦yeshua|Ješuovi|Ježíšovi⟧\n\n# B\n\n[1] ⟦yeshua|Ješuovi|Ježíšovi⟧\n";
  const s = (k: string, f: string) =>
    `<span class="t" data-k="${k}">${f}</span>`;
  assertEquals(
    pickForms(md, "orig"),
    `# A\n\n[1] ${s("yeshua", "Ješua")} a ${
      s("yeshua", "Ješuovi")
    }\n\n# B\n\n[1] ${s("yeshua", "Ješuovi")}\n`,
  );
  assert(pickForms(md, "trad").includes(s("yeshua", "Ježíšovi")));
  const both = pickForms(md, "both", () => "Ješua");
  assertEquals(both.match(/class="gloss"/g)?.length, 2);
  assert(
    both.includes(
      `${s("yeshua", "Ježíš")}<span class="gloss"> (Ješua)</span> a ${
        s("yeshua", "Ježíšovi")
      }\n`,
    ),
  );
  assert(
    both.includes(
      `${s("yeshua", "Ježíšovi")}<span class="gloss"> (Ješua)</span>`,
    ),
  );
  assertEquals(pickForms("plain", "trad"), "plain");
});

Deno.test("pickForms PLAIN: bare words, gloss in brackets (exports)", () => {
  const md = "# A\n\n[1] ⟦elohim|Elohim|God⟧ and ⟦elohim|Elohim|God⟧\n";
  assertEquals(
    pickForms(md, "orig", undefined, PLAIN),
    "# A\n\n[1] Elohim and Elohim\n",
  );
  assertEquals(
    pickForms(md, "both", undefined, PLAIN),
    "# A\n\n[1] God (Elohim) and God\n",
  );
});

Deno.test("lexiconSection: A–Z by original, searchable by familiar name and note", () => {
  const s = lexiconSection("Names", [
    { orig: "Moše", trad: "Mojžíš", src: "מֹשֶׁה", note: "Vytažený <z vody>." },
    { orig: "Avraham", trad: "Abraham", src: "אַבְרָהָם", note: "Otec mnohých." },
  ], "cs");
  assertEquals(s.entries.map((e) => e.term), [
    "Avraham · Abraham",
    "Moše · Mojžíš",
  ]);
  assert(s.entries[1].html.includes("&lt;z vody&gt;"));
  assertEquals(
    searchGlossary({ title: "", intro: "", sections: [s] }, "mojzis")[0].term,
    "Moše · Mojžíš",
  );
});
