# Fidelity pass — resolving the translator notes (binding)

Goal: the highest fidelity to the ORIGINAL meaning. No one's preference or
tradition decides; the original text does.

Files:

- EN: `/home/dev/code/gen/word/bsv-en/NN-Book/BookNN.md`
- CZ: `/home/dev/code/gen/word/bsv-cz/NN-Book/BookNN.md` (style:
  `/home/dev/code/gen/rib/tools/cz/STYLE.md`)

## Text base

- OT: the Masoretic Text (BHS/BHQ) is the base. Depart from it ONLY for an
  evident scribal error (the MT contradicts its own immediate context AND other
  Hebrew mss / ancient versions support the alternative). When you depart, say
  so in Changes.
- A Septuagint (LXX) reading is NOT the original Hebrew. Where the verse follows
  the LXX against a sound MT, restore the MT and mention the LXX in Changes.
- NT: the Greek of the verse is decided on this machine, never from memory.
  `tools/src/orig.ts` prints the SBLGNT; `tools/src/app.ts` prints, for every
  place where editions differ, what the four critical editions read (SBLGNT,
  Westcott-Hort, Tregelles, NA28) and which reading wins: the one most of the
  four print; on a 2–2 tie NA28 decides; a reading marked `em` (an editor's
  emendation that no Greek manuscript has) never wins. So no single editor's
  choice stands alone in the verse. Where the outcome changes the translation,
  Changes names the other reading and its editions. The Byzantine text (RP) is
  shown but does not vote. The 16 omitted verses stay omitted.
- Rendering: correct > readable. Choose the more readable form ONLY between
  forms that are equally faithful to the original; never trade away any original
  meaning, nuance or wording for readability. The divine names follow the
  original: YHWH → Yahweh; אֱלֹהִים → _Elohim_ (the one God) or "god(s)" / "divine
  being(s)" when the original means plural beings; אֵל → El (e.g. "jealous El",
  "living El", "El Gibbor"); אֱלוֹהַּ → Eloah; אֲדֹנָי → Lord / Adonai as the verse
  uses it.
- Theologically sensitive verses (e.g. Isa 7:14 עַלְמָה) get exactly the same rule:
  render the original word's meaning, and give the reception history (LXX
  παρθένος, Matt 1:23) in Changes/Notes. Never hide the evidence in either
  direction.

## For each logged item

1. Read the EN verse, its Changes/Notes, and the original.
2. Decide which kind of item it is:
   - **EN verse deviates from the original** → fix the EN verse; make the
     Changes entry match the verse.
   - **The verse is right but its Changes/Notes contradict it** (wrong verse
     number, claims a kept term the verse doesn't have, a wrong reference, a
     wrong fact such as a hymn author) → fix the Changes/Notes.
   - **Typo, doubled word, stray dash, broken quote or bold, name spelled two
     ways in one place** → fix it (use the majority spelling of the book, unless
     the original clearly favors the other).
   - **Czech-only judgement call** (ty/vy, declension, word choice) → skip it;
     it is already handled.
   - **Not actually an error** → no change.
3. Apply the SAME fix to the CZ file (verse and/or Změny/Poznámky, Czech per
   STYLE.md), so EN and CZ stay parallel.
4. Use the Edit tool for every change, never scripted bulk rewrites. Never touch
   anything that isn't part of a logged item.
5. After each file, run
   `deno run -A /home/dev/code/gen/rib/tools/cz/check.ts <NN-Book/BookNN.md>`
   until it prints OK.

## Output

Append one line per item to `/home/dev/code/gen/rib/tools/fix/log/<group>.md`:
`- Ref — FIXED verse|FIXED notes|TYPO|SKIP cz|NO CHANGE — what + why (original evidence)`
Final reply: `<group>: fixed N · notes N · typo N · skip N · no-change N` plus
at most 3 lines on the most significant decisions.
