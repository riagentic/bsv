# Tagging a book (binding for tagging helpers)

Read `SPEC.md` (token format) first. Worked example: `41-Mark/Mark01.md` in your
language (tagged with the first, smaller lexicon; Mark gets a second pass too).

Files: EN `/home/dev/code/gen/word/bible-kjv-v2/NN-Book/BookNN.md`, CZ
`/home/dev/code/gen/word/bible-kjv-v2-cz/NN-Book/BookNN.md`. You do ONE language
of ONE book (or group); don't touch anything else.

## What to do

1. Tag every occurrence in verse text (never in `#` headings) (never under
   `## Changes` / `## Změny`) of every lexicon key whose forms differ in your
   language: `⟦key|original|traditional⟧`, both forms complete and grammatical
   in that sentence (case, number, article, capital).
2. The lexicon is `content/terms.json` + `content/terms.d/*.json`. A name/term
   that is missing: add it to `content/terms.d/tag-<NN>-<lang>.json` (format and
   rules: `LEXICON.md`), never edit other files there.
3. The text must not change. The "original" reading must equal what the verse
   already says, EXCEPT fixing English-letter leftovers in CZ (Jerusalem →
   Jerušalajim…) or a name spelled against the lexicon. Nothing else: no
   rewording, no fidelity edits.
4. Scripts are fine for fixed forms (EN: `Yahweh` → `⟦yhwh|Yahweh|the LORD⟧`).
   Czech declension needs judgement: map each case form to the same case of the
   traditional name (Ješuovi → Ježíši, Mošovi → Mojžíšovi). Review every change.
5. Divine names, as the text has them today (the token replaces `*Elohim*`
   including its asterisks):
   - EN `Yahweh` → `⟦yhwh|Yahweh|the LORD⟧` ("LORD" without "the" after "O", in
     a vocative, or after a possessive); `Lord Yahweh` / `Adonai Yahweh` → one
     token `⟦adonai-yhwh|Lord Yahweh|Lord GOD⟧` /
     `⟦adonai-yhwh|Adonai Yahweh|Lord GOD⟧`. `*Elohim*` meaning the one God →
     `⟦elohim|Elohim|God⟧`; "god(s)" / "divine beings" in plain English stays
     untagged.
   - CZ `Yahweh` (English letters, undeclined today) → `⟦yhwh|Jahve|Hospodin⟧`,
     both declined for the sentence: Jahve · Jahveho · Jahvovi · Jahveho · Jahve
     · o Jahvovi · s Jahvem = Hospodin · Hospodina · Hospodinu · Hospodina ·
     Hospodine · o Hospodinu · s Hospodinem. `Pán Yahweh` →
     `⟦adonai-yhwh|Pán Jahve|Panovník Hospodin⟧` (Pána Jahveho / Panovníka
     Hospodina, Pane Jahve / Panovníku Hospodine…). `*Elohim*` →
     `⟦elohim|Elohim|Bůh⟧`: Elohim stays undeclined, Bůh declines (Boha, Bohu,
     Bohem, Bože; `⟦elohim|Synu Elohim|Synu Božím⟧`,
     `království ⟦elohim|Elohim|Boží⟧`, as in Mark).
   - New Testament (books 40–66): the text's "Yahweh" (κύριος quoting YHWH) has
     traditional form EN "the Lord" (ESV NT, never "LORD"); CZ = the word ČEP
     has in THAT verse (usually Hospodin: Mk 12:29 "Hospodin, Bůh náš", 12:36
     "Řekl Hospodin"; sometimes Pán: Mk 1:3 "cestu Páně"). Check it:
     `https://www.bibleserver.com/CEP/<Czech book><chapter>` (e.g. Marek12).
     An OT quote or allusion whose Hebrew has YHWH but the text writes "the
     Lord" / "Pán" is tagged the same way (Mark 11:9
     `⟦yhwh|Yahweh|the Lord⟧`); "Lord" meaning Yeshua or a master stays plain.
   - `Yahweh of hosts` → `⟦yhwh|Yahweh|the LORD⟧ of hosts`; CZ `Yahweh zástupů`
     → `⟦yhwh|Jahve|Hospodin⟧ zástupů`. "hosts" / "zástupů" stay plain (there is
     no Tzevaot in the text; don't invent it).
   - CZ Moše declines like "soudce": Moše (gen/acc too, "skrze Moše") ·
     Mošovi · Mošem. Paro: Paro · Paroha · Parohovi · Parohem · Parohův = ČEP farao · faraóna ·
     faraónovi · faraónem · faraónův (ó in every form but "farao").
   - Other English-letter names in CZ (Moses, Jerusalem, Yeshua, David stays)
     become the Czech lexicon forms, declined.
6. An English-letter leftover whose Czech forms are equal (orig == trad, e.g.
   Asher → Ašer, Sinai → Sinaj) is fixed as plain text, no token; `diff.ts`
   lists it as `NOTE leftover`.
7. Divine/terms kept as Hebrew in running text (Torah, Shabbat, Sheol…) are
   tagged only where their lexicon forms differ in your language.

8. Consistency (from earlier books):
   - A singular gentilic uses the singular key if it exists (`hittite`,
     `amorite`, `jebusite`…), else the plural key (`⟦canaanites|Kenaani|Canaanite⟧`); CZ Hebrew plurals stay undeclined (Kenaanim,
     Levijim), the traditional side declines.
   - CZ Baal: singular = same both sides → plain "Baal"; plural only is tagged
     `⟦baal|Baalům|baalům⟧` (ČEP lowercases the plural).
   - CZ `*Elohim*` meaning "of God" → `⟦elohim|Elohim|Boží⟧` (dům Boží).
   - "Almighty / Most High *Elohim*" (El Shaddai / El Elyon, to be fixed later):
     tag only `elohim`.
   - A Hebrew term the text renders in plain words (sabbath, mercy seat, the
     Feast of Booths) gets a token with the Hebrew term as the original form, in
     BOTH languages, when the sentence stays grammatical; if agreement would
     break (CZ "Pascha" + feminine pronouns), leave it plain and say so.
   - "Lord" / "Pán" where the Hebrew is אֲדֹנָי (Adonai, not adon/adoni) →
     `⟦adonai|Adonai|the Lord⟧` (EN; article inside the token) /
     `⟦adonai|Adonaj|Pán⟧` (CZ, both declined: Adonaje/Pána, Adonaji/Pánu,
     Adonaji/Pane). "Most High" alone → `elyon` (OT only; NT ὕψιστος stays plain).
   - `torah` traditional side = the word ESV / ČEP has in THAT verse (ESV:
     law, Law, teaching, instruction; ČEP: zákon or Zákon, mostly lowercase).
     Check `https://www.bibleserver.com/ESV/<Book><N>` and `/CEP/…` when unsure.
   - The text already glosses a Hebrew term right after it ("moshaot — saving
     acts —"): put the gloss inside the original form so the traditional
     reading does not repeat it (`⟦nishmat-adam|nishmat adam — breath of man
     —|spirit of man⟧`).
   - Czech verb/pronoun agreement: when the original and traditional forms
     differ in gender/number, widen the token over the agreeing words
     (`⟦sabeans|vpadla Ševa|vpadli Šebovci⟧`), never beyond the sentence.
   - The original form never adds words the text lacks ("země Aššur" for
     "Asýrie" is wrong). A name the text translates ("Terror on Every Side")
     keeps that meaning inside the original form:
     `⟦magor-missabib|Magor Missaviv — Terror on Every Side|Terror on Every Side⟧`.
   - Keys used only where their note says: `asa-asaph`, `amon-amos` = Matt 1
     only (King Asa / Amon elsewhere stay plain); `huram` = the Benjaminite,
     Hiram of Tyre is `hiram` even when spelled Huram.

## Scratch files

Write helper scripts and temp files ONLY under
`/tmp/claude-1000/-home-dev-code-gen-rib/ac95f3e2-9c9a-4336-a0a5-e0c8a63ec227/scratchpad/j<job id>/`
(absolute path; never a `scratchpad/` inside rib) (other jobs run at the same
time). Never write into the Bible folders except
your own files.

## Gates (per file, until both are clean)

    deno run -A /home/dev/code/gen/rib/tools/terms/check.ts <en|cz> NN-Book/BookNN.md
    deno run -A /home/dev/code/gen/rib/tools/terms/diff.ts <en|cz> NN-Book/BookNN.md

`check.ts` must print OK. If a leak stem hits a word that is a DIFFERENT
name/word standing correctly untagged, add that exact word to
`tools/terms/allow.d/<NN>-<lang>.json` (`{"<lang>": ["Word@NN-Book/BookNN.md", …]}`, scoped to the file it is in; your own file
only) and list it in your reply; never edit `allow.json`, `content/terms.json`
or other jobs' files. `diff.ts` must end with `text unchanged outside
tokens`
(any FAIL = you changed text: undo it). Its NOTE lines count words a token
replaced by a different form (Yahweh → Jahvem): each must be a rule-3/5 change;
put the top NOTE lines in your reply. A stem that is a different word (e.g.
Herodias vs Herod) goes into `tools/terms/allow.json` under your language: say
so in the reply.

Paths are relative to the language root. Don't commit; don't run git commands
that change anything.

## Reply

`<book> <lang>: N tokens · M files OK · NOTE summary`, plus at most 6 lines: new
keys added, allow.json words, doubts.
