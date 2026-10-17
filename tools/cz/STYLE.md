# Czech translation of bsv-en — style guide (binding)

Source: `/home/dev/code/gen/word/bsv-en/NN-Book/BookNN.md` (EN, the
author's own translation from Hebrew/Aramaic/Greek). Target:
`/home/dev/code/gen/word/bsv-cz/NN-Book/BookNN.md` — same folders, same
file names.

## 0. Goal

The most faithful, honest Czech rendering of the ORIGINAL meaning, as captured
by the EN source — readable, natural, contemporary Czech (spisovná čeština, not
archaic, not Kralická style). Never add, drop, soften or sharpen meaning.

## 1. Source hierarchy

1. The EN file is authoritative for meaning, interpretation and every
   translation decision (explained in its `## Changes`).
2. Consult the Hebrew / Aramaic / Greek original (you know it) to resolve what
   English hides and Czech must choose:
   - **ty vs. vy** (singular/plural "you") — decide from the original, never
     guess.
   - grammatical gender, number, verbal aspect (dokonavý/nedokonavý), who is
     speaking.
3. If you believe the EN deviates from the original: DO NOT silently diverge.
   Translate the EN faithfully and report it (see §8).

## 2. Names — keep them ORIGINAL (as spelled in EN), never Czech forms

Author's rule: "names change as grammar needs, but keep names original, not
Czech transformations."

- Every personal name, place name, people name: exactly the EN spelling. Moses
  (not Mojžíš), Jerusalem (not Jeruzalém), Isaac (not Izák), Jacob, Pharaoh,
  Egypt, Babylon, Israel, Judah, Nebuzaradan, Belteshatzar …
- **Decline them with Czech endings** as grammar requires, attaching the ending
  to the unchanged stem:
  - _Yeshua_ → _Yeshuy_, _Yeshuovi_, _Yeshuu_, _Yeshuo_ (vok.), o _Yeshuovi_, s
    _Yeshuou_
  - _Mashiach_ → _Mashiacha_, _Mashiachovi_, _Mashiachem_
  - _Kefa_ → _Kefy_, _Kefovi_, _Kefu_, _Kefou_ · _Sha'ul_ → _Sha'ula_,
    _Sha'ulovi_
  - Moses → Mosese, Mosesovi, Mosesem · Abraham → Abrahama · David → Davida ·
    Jerusalem → do Jerusalemu, v Jerusalemě
  - Keep italics exactly as EN (`*Yeshuovi*` — whole word italic incl. ending).
- **Indeclinable (same in all cases):** Yahweh, _Elohim_, Eloah, Shaddai, Yah,
  _Ruach HaQodesh_, _Torah_, Sheol, Hades, Gehenna, Tartarus, Selah, Hallelujah,
  Amen, Hosanna, Negev, Shephelah.
- Adjectives from names: form naturally but keep the stem: Moses → Mosesův,
  Yeshua → _Yeshuův_.
- Divine titles: Yahweh of Hosts → **Yahweh zástupů**; Lord Yahweh → **Pán
  Yahweh**; Most High → Nejvyšší; Almighty → Všemohoucí.
- _Ruach HaQodesh_: follow the EN pronoun (he → on / it → to); agreement follows
  that.
- Common nouns are Czech: messenger → posel, angel → anděl, immerse → ponořit /
  ponoření, the Immerser → Ponořovatel, Teacher → Učitel, Rabbi → Rabbi, Sabbath
  → sabat, Passover → Pascha, Tent of Meeting → stan setkávání. Ark (of the
  covenant) → truhla (smlouvy). Vault (raqia) → klenba. Steadfast love
  (_chesed_) → věrná láska.
- Terms kept in original in EN stay in original (Nephilim, Asherah, Azazel,
  Maskil, Miktam, month names …). Wadi → vádí.

## 3. Structure — must mirror EN exactly

- Line 1: `# <Czech book name> <N>` from the table in §9 (Psalms: `# Žalm 23`).
- Verses: `[N] text` — identical set and order of verse numbers as EN, including
  markers inside bold/poetry (`**[15] …**`). Never merge, split, renumber, add
  or drop a verse. The 16 omitted verses stay omitted.
- Keep every markdown feature 1:1: blank lines between verses, poetry line
  breaks (one Czech line per EN line), bold, italics, em-dashes, psalm
  superscriptions, acrostic headings (`## ת Taw` → `## ת Taw`, keep as is).
- `## Changes` → `## Změny`
- `### Notes` → `### Poznámky`; `### Notes (context, not changes)` →
  `### Poznámky (kontext, ne změny)`; any other heading: translate.
- No blockquotes (`>`), no new headings, no added commentary.

## 4. Změny (Changes) entries

Pattern stays:
`- **"<KJV English>" → „<Czech rendering here>“** (v4, 7) — <Czech explanation>`

- LEFT side: the KJV English wording exactly as in EN (it documents KJV → this
  translation) — English quotes "…".
- RIGHT side: the Czech wording actually used in your Czech verse — Czech quotes
  „…“ (closing mark is “, U+201C — never a straight ").
- Explanation: translate fully into Czech. Keep Hebrew/Greek script,
  transliterations (_shamayim_), references (Jer 4:23 → Jer 4:23 — keep EN book
  abbreviations in references), scholar names, as is.
- Empty: `- No significant deviations from KJV in this chapter.` →
  `- Žádné podstatné odchylky od KJV v této kapitole.`
- Where the explanation is about an English word nuance ("replenish" in 1611
  meant …), translate the explanation; it stays meaningful because the left side
  is KJV English.

## 5. Czech language

- Natural modern literary Czech; reverent but not archaic. Avoid calques from
  English word order.
- Czech typography: „…“ outer quotes, ‚…‘ inner (closing marks “ ‘, never
  straight " '); ellipsis …; dash with spaces `–` (en dash) where EN has `—`.
- Numbers: Czech style (1 000, 3,5). Measures: keep units as EN (cubits → lokty,
  shekel → šekel, ephah → éfa).
- Poetry: keep line structure; prefer natural Czech rhythm over word-for-word.
- Consistency: same Hebrew/Greek term → same Czech word (see §2), unless EN
  varies it deliberately.

## 6. Process per chapter

1. Read EN chapter. 2. Translate the whole file. 3. Write the CZ file (Write
   tool, UTF-8). 4. Run the checker:
   `deno run -A /home/dev/code/gen/rib/tools/cz/check.ts <EN-relative-path> …`
   (e.g. `01-Gen/Gen01.md`) — fix until OK.

- Skip chapters whose CZ file already exists AND passes the checker (the run is
  resumable).

## 7. Quality bar

Every verse re-read against EN (and the original where §1.2 applies) before
writing. No English left in verse text except names/terms per §2. No
summarising, no shortening of Změny/Poznámky.

## 8. Issues log

Possible EN errors / deviations from the original, or hard calls: list them
in your final report, one line each: `- Gen 1:14 — <what, why> (EN kept)`.

## 9. Czech book names (heading `# <name> <N>`)

01 Genesis · 02 Exodus · 03 Leviticus · 04 Numeri · 05 Deuteronomium · 06 Jozue
· 07 Soudců · 08 Rút · 09 1. Samuelova · 10 2. Samuelova · 11 1. Královská ·
12 2. Královská · 13 1. Paralipomenon · 14 2. Paralipomenon · 15 Ezdráš · 16
Nehemjáš · 17 Ester · 18 Jób · 19 Žalm · 20 Přísloví · 21 Kazatel · 22 Píseň
písní · 23 Izajáš · 24 Jeremjáš · 25 Pláč · 26 Ezechiel · 27 Daniel · 28 Ozeáš ·
29 Jóel · 30 Ámos · 31 Abdijáš · 32 Jonáš · 33 Micheáš · 34 Nahum · 35 Abakuk ·
36 Sofonjáš · 37 Ageus · 38 Zacharjáš · 39 Malachiáš · 40 Matouš · 41 Marek · 42
Lukáš · 43 Jan · 44 Skutky · 45 Římanům · 46 1. Korintským · 47 2. Korintským ·
48 Galatským · 49 Efezským · 50 Filipským · 51 Koloským · 52 1. Tesalonickým ·
53 2. Tesalonickým · 54 1. Timoteovi · 55 2. Timoteovi · 56 Titovi · 57
Filemonovi · 58 Židům · 59 Jakubův · 60 1. Petrův · 61 2. Petrův · 62 1. Janův ·
63 2. Janův · 64 3. Janův · 65 Judův · 66 Zjevení

## 10. Harmonization (final pass — binding, overrides earlier batch choices)

- **Yahweh is indeclinable, always.** No endings, no possessive adjective:
  „Yahwehův chrám“ → „chrám Yahweh“, „Yahwehova slova“ → „slova Yahweh“, „v
  Yahwehově domě“ → „v domě Yahweh“. Fix Změny right sides the same way so they
  still match the verse.
- **Jordan** (not Jordán): Jordan, Jordanu, Jordanem · **Euphrates** (not
  Eufrat): Euphrates, Euphratu, Euphratem · **Pharaoh** (not faraon/farao):
  Pharaoh, Pharaoha, Pharaohovi, Pharaohem; possessive Pharaohův.
- **Judah** on the unchanged stem: tribe/land/kingdom → Judah, Judahu, Judahem,
  v Judahu (not Judy/Judě/Judou); the man Judah → Judaha, Judahovi, Judahem.
  Leave Judas/Jude (Iouda in NT) alone unless EN says Judah.
- **Greek/Latin names in -us / -os**: nominative exactly as EN (Titus, Onesimus,
  Epaphroditus); other cases drop -us/-os: Tita, Titovi, Titem, Onesima,
  Epaphrodita, Pilata.
- **Jesus in Notes/Změny** (EN says "Jesus" there): keep EN spelling with Czech
  endings — Jesus, Jesuse, Jesusovi, Jesusem, Jesusův. Never „Ježíš“.
- Female names ending in a consonant or -ah stay undeclined. English-spelled
  places that don't decline naturally (Athens, Rome, Crete, Greece, Italy) stay
  undeclined.
