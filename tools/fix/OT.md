# Source pass — Old Testament (binding, with SOURCE.md)

The Hebrew (and Aramaic) printed by `tools/src/orig.ts` is the Westminster
Leningrad Codex: the Masoretic Text. It decides every word.

## Text

- Translate the printed text. No reading from the Septuagint, the Dead Sea
  Scrolls, the Samaritan text, the versions or a conjecture goes into a verse;
  where one of them is commonly followed, name it in Changes and keep the MT.
  (RULES.md allows a departure only for an evident scribal error; in this pass
  do not make one yourself — report the verse in your reply.)
- `[qere: …]` after a word is the reading tradition: translate the qere, and
  note the written form (ketiv) in Changes when the meaning differs.
- Our verse numbers are the KJV's; the tool prints `(Heb x:y)` where the Hebrew
  numbering differs. Keep our numbers, name the Hebrew number in Notes once.
- Nothing from memory: if you cite the Septuagint or another version in
  Changes, say only what you can see with the tools, or mark it "from memory".

## Rendering

- וַ / וְ at the head of a clause is "And" (or "Then", "But" where the Hebrew
  form clearly marks it); do not drop it and do not turn a chain of clauses into
  subordinate English.
- Keep Hebrew ways of speaking where English can bear them: "lifted up his eyes
  and saw", "sons of Israel", "knew his wife", "the face of the ground", "in the
  eyes of", "by the hand of", "the word of Yahweh came to". Where the literal
  form would say something else in English ("his nose burned" = he was angry;
  the oath "if I do …" = "I will not"), the verse gives the meaning and Changes
  gives the literal words.
- The infinitive absolute with its verb ("dying you shall die") is rendered by
  its force ("you shall surely die") with the literal form in Changes, the same
  way each time (see WORDS-HE.md).
- One Hebrew word → one rendering where the sense is the same, also across
  books: `WORDS-HE.md`. A different sense may have its own word; say so in
  Changes.
- No supplied subjects, names, objects or explanations. The Hebrew often leaves
  the subject unnamed ("and he said"): leave it so. A copula ("is", "was") may
  be supplied; nothing more without a Changes note.
- Tense: follow the Hebrew form in its context (narrative wayyiqtol = simple
  past; a perfect in prophecy stays a past/perfect where English can bear it,
  with a note). Do not level questions, wishes (jussive, cohortative: "let …")
  and commands into statements.
- הִנֵּה is "behold"; נְאֻם is "declares" ("the declaration of Yahweh"); נָא is
  "please" or "now" where it has force, never silently dropped.
- Where the meaning of a word is not known (a word found once, a plant, an
  animal, a musical term), give the best-supported sense, keep one rendering,
  and say in Changes that the meaning is uncertain. Do not guess from another
  version.
- Poetry keeps its lines: one Hebrew line (colon) per printed line, in the
  Hebrew order of the lines; parallel halves are not merged. Keep the existing
  line layout unless it merges or splits cola against the Hebrew accents.
- Psalm headings are part of the Hebrew text (verse 1 or its first words):
  translate them; `selah` and the musical terms keep their tokens.
- Aramaic (Dan 2:4b–7:28; Ezra 4:8–6:18; 7:12–26; Jer 10:11; two words in Gen
  31:47) is translated the same way; note where the language changes.

## Names and tokens

- Divine names follow RULES.md and the tokens: יהוה `yhwh`, אֱלֹהִים `elohim`,
  אֵל `el`, אֱלוֹהַּ Eloah, אֲדֹנָי `adonai`, שַׁדַּי `shaddai`, עֶלְיוֹן `elyon`,
  יְהוָה צְבָאוֹת "Yahweh of hosts" as the existing tokens have it. Never add a
  divine name the Hebrew does not have, never drop one it has. אֲדֹנָי יְהוִה is
  both words.
- Term tokens: keep each one the verse already has, with its key (`torah`,
  `shalom`, `steadfast-love` for חֶסֶד, `el-elyon`, `adonai-yhwh` and the like);
  add one only with a key that exists in `content/terms.json` and only where the
  Hebrew has that word. חֶסֶד always carries `⟦steadfast-love|chesed|steadfast
  love⟧` (CZ forms as the lexicon has them). נֶפֶשׁ is the plain word "soul" /
  „duše“ (the `nephesh` token stays only where a verse already has it); שְׁאוֹל is
  the plain word "Sheol" / „šeol“, never "the grave", "hell" or "the pit".
- Names of persons and places keep their tokens and forms.

## Model

The finished New Testament chapters show the manner (`57-Phlm/Phlm01.md`,
`41-Mark/Mark01.md`). When Genesis is finished, `01-Gen/Gen01.md` and
`01-Gen/Gen22.md` are the Old Testament models.
