# Name/term switch: format (binding)

One source text; the reader picks a mode. Only the spots whose ORIGINAL and
TRADITIONAL forms differ carry both forms. Everything else stays plain.

## Token

    ⟦key|original|traditional⟧

- `key`: an ascii slug from the lexicon (`content/terms.json`), e.g. `yeshua`.
- Both forms are written out complete and grammatical **in that sentence**:
  case, number, article, capital letter at the start of a sentence. Cover the
  smallest span that makes both forms grammatical: usually one word, sometimes a
  phrase (`⟦elohim|Synu Elohim|Synu Božím⟧`, `⟦yhwh|Yahweh|the LORD⟧`).
- No `|`, `⟦`, `⟧` or line break inside a form. No italics (`*`) inside forms:
  names are plain text. Bold is allowed around a whole token when the verse is
  bold.
- Tokens go only in the chapter body (verses). Never under `## Changes` /
  `## Změny`: that section explains the text and stays as it is.
- If a language's original == traditional for a key, that language gets no token
  (plain text).

## The two forms

|     | original                                                                                                                                                                                                                                 | traditional                                                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Who | the name the person/place/God actually bore, in the original language (Hebrew/Aramaic for Semitic names, Greek/Latin for Greek/Roman ones)                                                                                               | the familiar Bible form                                                                              |
| EN  | Hebrew in English letters: y, sh, ch (ח/כ), tz (צ), q (ק), v, f; no marks for א/ע. Keep forms the text already uses (Yeshua, Kefa, Mashiach, Ruach HaQodesh, Yaaqov).                                                                    | ESV forms (Jesus, Peter, John, James, the LORD, God, Christ, Holy Spirit, baptize, hell for Gehenna) |
| CZ  | the same names in **Czech letters**: j, š, ch, c (צ), k (ק), v, f: Ješua, Jochanan, Mirjam, Jaakov, Jehuda, Moše, Jahve. Decline where Czech does it naturally (Ješuovi, Jochanana); female names ending in a consonant stay undeclined. | ČEP forms (Ježíš, Petr, Jan, Jakub, Marie, Hospodin, Bůh, Kristus, Duch svatý, křtít, peklo)         |

Terms follow the same rule: original = the original word's meaning or
transliteration (immerse / ponořit, Torah / Tóra, Shabbat / šabat, Gehenna),
traditional = the ESV / ČEP word (baptize / křtít, Law / Zákon, Sabbath /
sobota, hell / peklo).

English-letter leftovers in the Czech text (John, Jacob, Yeshua, Galilee,
Jerusalem, Isaiah…) must disappear: in CZ, both forms are Czech.

## Lexicon `content/terms.json`

    [{ "key": "yeshua", "kind": "person",
       "src": "יֵשׁוּעַ · Ἰησοῦς",
       "en": { "orig": "Yeshua", "trad": "Jesus" },
       "cz": { "orig": "Ješua", "trad": "Ježíš" },
       "leak": { "en": ["Yeshua", "Jesus"], "cz": ["Ješu", "Ježíš", "Yeshu"] },
       "note": { "en": "Hebrew name, \"Yah saves\".", "cz": "Hebrejské jméno, „Jah zachraňuje“." } }]

- `kind`: divine | person | place | people | term.
- `en`/`cz`: the lemma (dictionary form) of each form.
- `leak`: word stems that must NOT appear untagged in that language's verses
  (both lemmas' stems plus old leftover forms). Empty when orig == trad.
- One key per referent where traditions split: `jacob` (the patriarch, EN trad
  Jacob) vs `james` (NT men, EN trad James), `judas` (Iscariot, CZ trad Jidáš)
  vs `jude` (Judah/Jude, CZ trad Juda).
