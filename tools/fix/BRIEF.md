# Source pass — worker brief

You are revising the Bible Source Translation so that every verse says exactly
what the original says, in the project's own words. Highest fidelity to the
original is the only goal: never shift, soften, smooth or add meaning.

Read first, in full; all are binding:

- `tools/fix/SOURCE.md` — the method (print the original with
  `deno run -A tools/src/orig.ts <NN-Book/BookNN.md>` and work from the printed
  text; for the NT also run `tools/src/app.ts` on the chapter: its
  `⇒ VERSE FOLLOWS` lines override the printed text, nothing else does, and no
  reading is ever taken from memory)
- `tools/fix/WORDS.md` — one original word → one rendering across books; follow
  it, append missing recurring words with `>>` (check the word is not already
  there). A row binds where the sense is the same. Where it would give wrong or
  un-English wording in a verse, keep the verse right and say why in Changes; do
  not add a row that forces a whole phrase on other books. Read the "Standing
  decisions" at the top as well.
- `tools/fix/RULES.md` — text base, divine names, correct > readable
- `tools/terms/SPEC.md` — the `⟦key|original|traditional⟧` token format
- `tools/cz/STYLE.md` — Czech style
- finished models, EN + CZ: `57-Phlm/Phlm01.md`, `56-Titus/Titus02.md`,
  `50-Phil/Phil02.md`

Paths: rules under `/home/dev/code/gen/rib/`; EN chapters under
`/home/dev/code/gen/word/bible-kjv-v2/`, CZ under
`/home/dev/code/gen/word/bible-kjv-v2-cz/`. Run commands from
`/home/dev/code/gen/rib`.

Background: the current text was built on existing translations and carries
their additions, smoothings and interpretations. Translate each verse from the
printed original yourself. The only test of a rendering is whether it says what
the original says: keep it when it does, whatever other Bible has the same
words; never choose a weaker rendering to differ from another translation. Do
EN and CZ for every chapter you were given.

Old Testament chapters (books 01–39): read `tools/fix/OT.md` in full; it is
binding. The word list for Hebrew is `tools/fix/WORDS-HE.md` (`WORDS.md` is the
Greek list: for the Old Testament read only its "Standing decisions", not its
rows; the models are `01-Gen/Gen01.md` and `01-Gen/Gen22.md`). The Hebrew list
is too long to read whole. Instead:

- `deno run -A tools/src/words.ts <your chapters…>` prints the head of the
  list, every row whose Hebrew word stands in your chapters, and every
  "reviewer" row. Read all of that output; it is binding, and a reviewer row
  overrides any other row for the same word.
- Before you add a row, look the word up:
  `deno run -A tools/src/words.ts --word <hebrew>` (and `grep` the list for the
  English word). Append new rows to `WORDS-HE.md` with `>>`, short: Hebrew ·
  English · Czech · where.
- Run the tool again before you finish: other workers add rows while you work.

Constraints:

- Edit only your chapter files (EN + CZ), plus `>>` appends to
  `tools/fix/log/source.md` and `tools/fix/WORDS.md`. Other workers append to
  both at the same time: never rewrite them.
- Keep tokens (same keys), verse numbers, bold, line breaks. Edit / Write tools
  only, no scripted rewrites.
- The three checks in SOURCE.md must print OK for each chapter.
- Do not commit, do not build, do not touch other files.

Final reply, short: your log lines, then only the verses a reviewer must look at
— real doubts about meaning, and places where you kept a rendering against
WORDS.md. No routine word choices.
