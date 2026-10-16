// SBLGNT apparatus → which reading the verse follows (tools/fix/RULES.md, NT text base).
//   deno run -A tools/src/app.ts <NN-Book/BookNN.md>      units of one chapter
//   deno run -A tools/src/app.ts --switch <Book>...        only units where the verse leaves the printed text
// Vote of the four critical editions SBLGNT, WH, Treg, NA28: the reading most of them
// print wins; on a tie NA28 decides. RP (Byzantine), NIV and margins are shown, not counted.
const SRC = "/home/dev/code/gen/src-texts/sblgnt/data/sblgntapp/text";
const VOTERS = ["WH", "Treg", "NA28"];
const SIGLA = /^(WH|Treg|NA28|NA27|RP|NIV|Holmes|WHmarg|Tregmarg|WHapp|TR|em)$/;

export type Unit = {
  ch: number;
  v: number;
  printed: string;
  follow: string;
  line: string;
};

const split = (seg: string) => {
  const w = seg.trim().split(/\s+/);
  let i = w.length;
  while (i > 0 && SIGLA.test(w[i - 1])) i--;
  return { text: w.slice(0, i).join(" "), sigla: w.slice(i) };
};

export async function units(book: string): Promise<Unit[]> {
  const out: Unit[] = [];
  let ch = 0, v = 0;
  for (
    // the file separates fields with no-break spaces
    const raw of (await Deno.readTextFile(`${SRC}/${book}.txt`))
      .replaceAll(" ", " ").split("\n")
  ) {
    const head = raw.match(/^(?:\d )?[A-Za-z]+ (\d+):(\d+)\s*$/);
    if (head) {
      [ch, v] = [+head[1], +head[2]];
      continue;
    }
    if (!raw.includes(" ] ")) continue;
    const line = raw.replace(/^(?:•|\d+(?::\d+)?)\s*/, "").trim();
    const [lemma, rest] = line.split(" ] ");
    const first = split(lemma);
    const alts = rest.split(";").map(split);
    const votes = (s: string[]) => VOTERS.filter((x) => s.includes(x)).length;
    let best = first, score = 1 + votes(first.sigla); // SBLGNT prints the first reading
    for (const a of alts) {
      if (a.sigla.includes("em")) continue; // an emendation: no Greek manuscript has it
      const n = votes(a.sigla);
      if (n > score || (n === score && a.sigla.includes("NA28"))) {
        [
          best,
          score,
        ] = [a, n];
      }
    }
    out.push({
      ch,
      v,
      printed: first.text,
      follow: best === first ? "" : (best.text.replace(/^–$/, "") || "(omit)"),
      line,
    });
  }
  return out;
}

if (import.meta.main) {
  if (Deno.args[0] === "--switch") {
    for (const book of Deno.args.slice(1)) {
      for (const u of (await units(book)).filter((u) => u.follow)) {
        console.log(`${book} ${u.ch}:${u.v}  ${u.line}  ⇒ ${u.follow}`);
      }
    }
  } else {
    const m = (Deno.args[0] ?? "").match(/^\d\d-([^/]+)\/.*?(\d+)\.md$/);
    if (!m) {
      console.error("usage: app.ts <NN-Book/BookNN.md> | --switch <Book>...");
      Deno.exit(2);
    }
    for (const u of (await units(m[1])).filter((u) => u.ch === +m[2])) {
      console.log(
        `[${u.v}] ${u.line}${u.follow ? `  ⇒ VERSE FOLLOWS: ${u.follow}` : ""}`,
      );
    }
  }
}
