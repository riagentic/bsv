// Pure: resolve name/term tokens `⟦key|original|traditional⟧` for one reading
// mode. "both" shows the original form and adds the traditional one as a small
// gloss on its first use per chapter (per key).
export type Names = "orig" | "trad" | "both";

export const TOKEN = /⟦([a-z0-9-]+)\|([^|⟦⟧\n]*)\|([^|⟦⟧\n]*)⟧/g;

const span = (k: string, s: string) =>
  `<span class="t" data-k="${k}">${s}</span>`;

export function pickForms(md: string, mode: Names): string {
  if (!md.includes("⟦")) return md;
  return md.split(/^(?=# )/m).map((chapter) => {
    const seen = new Set<string>();
    return chapter.replace(
      TOKEN,
      (_, k: string, orig: string, trad: string) => {
        if (mode === "trad") return span(k, trad);
        if (mode === "orig" || seen.has(k)) return span(k, orig);
        seen.add(k);
        return `${span(k, orig)}<span class="gloss"> (${trad})</span>`;
      },
    );
  }).join("");
}
