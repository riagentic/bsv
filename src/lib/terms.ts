// Pure: resolve name/term tokens `⟦key|original|traditional⟧` for one reading
// mode. "both" reads the familiar (traditional) form and adds the original
// word's dictionary form as a small gloss on its first use per chapter (per key).
export type Names = "orig" | "trad" | "both";

export const NAMES: readonly Names[] = ["orig", "trad", "both"];

export const TOKEN = /⟦([a-z0-9-]+)\|([^|⟦⟧\n]*)\|([^|⟦⟧\n]*)⟧/g;

/** How a chosen form and a gloss are written out. */
export type Out = {
  word: (k: string, s: string) => string;
  gloss: (s: string) => string;
};

/** For the reader: tappable words, a styled gloss. */
export const HTML: Out = {
  word: (k, s) => `<span class="t" data-k="${k}">${s}</span>`,
  gloss: (s) => `<span class="gloss"> (${s})</span>`,
};

/** For plain-text exports. */
export const PLAIN: Out = { word: (_, s) => s, gloss: (s) => ` (${s})` };

export function pickForms(
  md: string,
  mode: Names,
  lemma: (key: string) => string | undefined = () => undefined,
  out: Out = HTML,
): string {
  if (!md.includes("⟦")) return md;
  return md.split(/^(?=# )/m).map((chapter) => {
    const seen = new Set<string>();
    return chapter.replace(
      TOKEN,
      (_, k: string, orig: string, trad: string) => {
        if (mode === "orig") return out.word(k, orig);
        if (mode === "trad" || seen.has(k)) return out.word(k, trad);
        seen.add(k);
        return out.word(k, trad) + out.gloss(lemma(k) ?? orig);
      },
    );
  }).join("");
}
