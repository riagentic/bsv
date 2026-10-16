# Source pass — every verse from the original (binding)

Goal: each verse of the Bible Source Translation (BST) says what the original
says, in our own words. `tools/fix/RULES.md` stays binding (text base, divine
names, correct > readable), and so does `tools/fix/WORDS.md` (one original word
→ one rendering across books). This pass adds the points below. Model:
`57-Phlm/Phlm01.md` (EN + CZ).

Why: the text was built on existing translations, which add, smooth and
interpret. None of that belongs in this text. The original decides every word;
agreement or disagreement with any other Bible is never a reason for a
rendering.

## Per verse

1. Print the original and work from it, never from memory:

       deno run -A tools/src/orig.ts <NN-Book/BookNN.md>

   NT = SBLGNT, OT = Westminster Leningrad Codex (the Masoretic Text), under our
   verse numbers. Translate each verse yourself, clause by clause, before
   looking at the current verse.
   - `⸀ ⸂ ⸃` in the Greek mark places where editions differ. For the NT also run
     `deno run -A tools/src/app.ts <NN-Book/BookNN.md>`: it lists each such
     place with the editions. A line ending in `⇒ VERSE FOLLOWS: …` means the
     verse follows that reading instead of the printed one (`+ x` = add x,
     `(omit)` = leave the printed word out); every other place follows the
     printed text. When the choice changes the translation, add a Changes line
     with both readings and their editions, copied from that line. Never decide
     a reading from memory.
   - Breathing marks, accents and punctuation are the editors' work: the old
     manuscripts have none. Where editions differ only in these (αὐτῷ / αὑτῷ, a
     question mark, a comma), translate by the sense of the passage, follow the
     printed punctuation when the sense is open, and give the other reading in
     Changes.
   - `[qere: …]` in the Hebrew is the reading tradition for the written word
     before it; translate the qere unless the written form clearly makes sense
     and the qere does not, and note the choice when it changes meaning.
   - A verse that the tool does not print (the 16 omitted NT verses) stays out.
2. Keep the current wording where it already says exactly that in plain English
   and is ordinary literal phrasing (also KJV / ASV phrasing: both are public
   domain). Short formulas ("Grace to you and peace from …") stay.
3. Rewrite where the current verse
   - adds words the original lacks (a supplied subject, "I pray that", "O God"),
   - drops or merges words (particles that carry meaning, a repeated word),
   - interprets instead of translating ("prisoner for" for a genitive, "heart"
     for σπλάγχνα, "bondservant" for δοῦλος),
   - or changes the grammar where English can keep it (tense, voice, wish vs
     statement, clause order that carries emphasis).
4. Never change meaning for style. No paraphrase, no smoothing, no harmonising
   with parallels. One original word → one English word within a passage where
   English allows it. Where the original is ambiguous, keep the ambiguity and
   explain it in Changes.
5. Supplied words are allowed only when English grammar cannot stand without
   them (a copula, an article). Anything more goes to Changes / Notes, not into
   the verse.

## Tokens, layout, Czech

- Keep every `⟦key|original|traditional⟧` token with the same key. Change a form
  only for grammar (a preposition or case moved into the token). Remove a token
  only when its word is not in the original; add one only with an existing key
  from `content/terms.json`.
- Keep verse numbers, line breaks of poetry, bold, `[[…]]`, headings.
- Apply the same decision to the CZ file (style: `tools/cz/STYLE.md`). The Czech
  follows the original, not the English.
- Changes / Změny: add one line per meaning-relevant decision, in the existing
  format (`- **"KJV wording" → "ours"** (vN) — original word + reason`). Fix
  lines the new verse makes untrue.
- Use the Edit / Write tools, never scripted rewrites. Touch only the chapters
  you were given.

## Check, log

After each chapter, until all three print OK:

    deno run -A tools/terms/check.ts en <NN-Book/BookNN.md>
    deno run -A tools/terms/check.ts cz <NN-Book/BookNN.md>
    deno run -A tools/cz/check.ts <NN-Book/BookNN.md>

Append one line per chapter to `tools/fix/log/source.md`:
`- Ref — rewritten N/M verses · meaning fixes: vA (what), vB (what) · doubts: …`

Do not commit. Final reply: the log lines, plus any verse where you were not
sure of the original wording (say so; never guess silently).
