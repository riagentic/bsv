# Building lexicon entries (binding for lexicon helpers)

Read `SPEC.md` first. The base lexicon is `content/terms.json` (Mark, 78
entries). Do NOT edit it. Write your NEW entries to
`content/terms.d/<group>.json` (same entry format, a JSON array).

## What needs an entry

Every divine name/title, person, place, people group and term that occurs in
your books' VERSE text (not `## Changes`) where original ≠ traditional in at
least one language (EN or CZ). If a name is identical in all four forms (e.g.
David / David / David / David), no entry is needed.

- Read the actual verse text of both languages. Candidate list: every
  capitalized word + every word the text keeps in Hebrew/Greek (often in
  italics). A throwaway script to LIST candidates is fine; judge every entry
  yourself.
- Skip keys that already exist in `content/terms.json` (same referent, same
  forms). If a base entry is wrong for your books, say so in your final reply;
  don't duplicate it.

## Keys

- ascii slug of the familiar English name: `abraham`, `beth-el`, `sheol`.
- One key per NAME, not per person: all the Zechariahs share `zechariah`. Split
  only when a language's traditional forms differ by referent (`jacob` patriarch
  vs `james` NT men; `judas` Iscariot vs `jude`); name the split key after the
  familiar form (`judah` tribe/patriarch).
- Terms: key = English traditional word (`sheol`, `tabernacle`, `ark`), only
  when the original differs (`sheol`: Sheol / hell? No: ESV keeps "Sheol", so EN
  orig = trad; CZ: šeol / podsvětí → entry needed).

## Forms

- original: the Hebrew/Aramaic (OT, and NT Semitic names) or Greek/Latin name,
  transliterated per SPEC (EN letters / Czech letters). Use the MT vocalization.
  Well-known conventions: Avraham, Yitzchaq, Yaaqov, Moshe, Aharon, Yehoshua,
  Shmuel, Shlomo, Yeshayahu, Yirmeyahu, Yechezqel, Daniyel, Eliyahu, Elisha;
  Czech: Avraham, Jicchak, Jaakov, Moše, Aharon, Jehošua, Šmuel, Šlomo,
  Ješajahu, Jirmejahu, Jechezkel, Danijel, Elijahu, Eliša.
- traditional: exactly ESV (EN) and ČEP (CZ). If unsure of the ČEP form, use the
  established Czech Bible form and note it in `note`.
- Place names too (Yerushalayim / Jerusalem is already in the base lexicon).
  Terms kept in Hebrew/Greek in the current text (e.g. _Sheol_, _Torah_,
  _ekklēsia_, _Abaddon_, _teraphim_, _kapporet_) need entries: original = that
  word, traditional = ESV/ČEP word.
- Divine: `el`, `eloah`, `elohim`, `yhwh`, `adonai`, `yah`, `el-shaddai`,
  `el-elyon`, `yhwh-tzevaot` (LORD of hosts / Hospodin zástupů)… Only where the
  text has them.

## leak (critical: the checker uses it on EVERY verse)

Stems that must not appear untagged (prefix match; `Jose=` = that whole word
only). They must be SPECIFIC: never a stem that is also a common word or the
start of another name (no "El", "Jan" without checking, "Cor", "Dan" vs
"Daniel"…). Case-sensitive. When in doubt, use the full word. Include old
English-letter leftovers the CZ text has (e.g. "Moses", "Jerusalem"). It may be
empty when orig == trad in that language.

## Output

- `content/terms.d/<group>.json`, valid JSON, 2-space indent. Validate it with
  `deno eval 'JSON.parse(Deno.readTextFileSync("…"))'`.
- `src` in the original script, and `note` in both languages (one short
  sentence: the meaning or identity).
- Final reply: the entry count, plus at most 8 lines on doubtful forms or base
  lexicon problems.

## Transliteration conventions (binding, whole Bible)

- Doubling: a dagesh forte doubles the consonant (EN Shabbat, Shaddai, Ammon,
  Chavvah; CZ Šaddaj, Ammon, Chavva). EN digraphs (sh, ch, tz) are never doubled
  (Ashur, not Ashshur); CZ single letters are (Aššur). Exception: words Czech
  already uses (šabat).
- Matres lectionis (vowel letters י/ו/ה used as vowels) are not written: Elon
  (not Eilon), Emim (not Eimim). Final ה of a feminine/-ah ending: EN writes
  -ah, CZ -a (Beriah / Beria).
- People groups: the Hebrew gentilic plural (Pelishtim, Leviyim, Ammonim; CZ
  Pelištejci is trad). Spaces as in the text's usage (Beit El, Ein Gedi).
- Pick the MT form of the referent's most common spelling; other spellings of
  the same name go into `leak` so they're still recognized.
- Traditional: ESV / ČEP. When unsure of ČEP, prefer the form the majority of
  existing entries use, and say "(ČEP?)" in `note`.

## Resolution files

`content/terms.d/A*.json` are final: an entry there replaces every other version
of that key (no leak merging). Use them to settle conflicts.
