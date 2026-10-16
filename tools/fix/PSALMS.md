# Psalms — cautions for the source pass (binding with BRIEF.md and OT.md)

- Layout: one Hebrew colon per printed line, Hebrew order; model `10-2Sam/2Sam22.md` (= Ps 18). Keep the file's form: `# Psalm N`, the heading as an unnumbered line above `[1]`, verses `[n]` in KJV numbers.
- Headings are Hebrew verse text (Hebrew v1, sometimes v1–2): translate every word, add none. Name the Hebrew numbering in Notes once ("Hebrew counts the heading as v1: our v1 = Heb v2").
- Heading formulas (reviewer rows, one wording through the book):
  לַמְנַצֵּחַ "To the overseer" (the 1 Chr 15:21 verb "oversee"; traditional "To the chief musician" in Changes) · מִזְמוֹר "A psalm" · שִׁיר "A song" · מִזְמוֹר שִׁיר "A psalm, a song" (Hebrew order) · תְּפִלָּה "A prayer" · שִׁיר הַמַּעֲלוֹת "A song of the ascents" (120–134; 121 שִׁיר לַמַּעֲלוֹת "A song for the ascents") · לְדָוִד "Of David" (לְ: by / for / belonging to — say once in Changes; do not choose "by") · לִבְנֵי־קֹרַח "Of the sons of Korah" · לְהַזְכִּיר "To bring to remembrance" · לְתוֹדָה "For thanksgiving" · בִּנְגִינוֹת "with stringed instruments" · עַל + a tune name: "upon" + the name as printed (token if a key exists: `gittith`, `sheminith`, `alamoth`, `mahalath`, `shiggaion`, `maskil`, `miktam`, `higgaion`; else plain, transliterated, "meaning unknown" in Changes).
- No vocative "O" / „ó“: "Hear, ⟦yhwh⟧" (reviewer row; the Hebrew has no such word). בָּחַן "try" / „prověřit“ (reviewer row).
- סֶלָה keeps the `selah` token on its own line where the file has it.
- הַלְלוּ־יָהּ: `praise-the-lord` token (the lexicon's OT key; `hallelujah` is the NT key, Rev 19); יָהּ alone: `yah` token.
- אַשְׁרֵי "Happy" ("Happy is the man", as Deut 33:29; 1 Kgs 10:8; CZ „Blaze“), never "Blessed" (that is בָּרוּךְ). CZ heading words: see the "Psalm headings" reviewer row.
- Refrain כִּי לְעוֹלָם חַסְדּוֹ "for his steadfast-love is forever" with the `steadfast-love` token (row; 1 Chr 16:34; 2 Chr 5:13); Ps 136 every verse.
- Parallels (finished, reuse where the Hebrew is the same, differences in Changes, nothing levelled): Ps 18 = 2 Sam 22 · Ps 105:1–15; 96:1–13; 106:1, 47–48 = 1 Chr 16:8–36 · Ps 132:8–10 = 2 Chr 6:41–42 · Ps 14 = Ps 53 and Ps 40:13–17 = Ps 70; 57:7–11 + 60:5–12 = Ps 108 (whoever finishes second aligns; Elohistic psalms keep אֱלֹהִים where the twin has יהוה).
- "from the age and to the age" rows (Ps 41:13; 90:2; 103:17; 106:48): "and" only where וְ stands.
- Ps 1:2; 63:6; 77:12; 143:5 הָגָה "softly recite" / „polohlasem si říkat“ (reviewer row).
- Divine names exactly as printed: Elohistic psalms (42–83) have אֱלֹהִים where others have יהוה — never level. אֲדֹנָי `adonai`, יָהּ `yah`, עֶלְיוֹן `elyon`, שַׁדַּי `shaddai`, אֵל `el`, אֱלוֹהַּ `eloah`.
- Verses quoted in the NT (2:7; 8:4–6; 16:8–11; 22; 40:6–8; 45:6–7; 69; 95:7–11; 102:25–27; 104:4; 110; 118:22): the Hebrew as it stands, never levelled to the NT quotation (or the reverse); the difference in Changes. 22:16 כָּאֲרִי "like a lion" as printed; "pierced" (versions) in Changes, from memory. 40:6 "ears you have dug for me".
- Acrostics (9–10, 25, 34, 37, 111, 112, 119, 145): name the letter scheme in Notes; do not imitate it; Ps 119 keeps the letter headings as the file has them.
- Qere always in the verse, ketiv in Changes (e.g. 100:3 qere וְלוֹ "and his we are").
- Hebrew numbering differs by one where the heading is a verse; orig.ts shows `(Heb x:y)`.
- Run `words.ts` on your chapters again before finishing: many workers add Psalm rows at once. Look up a word (`--word`) before adding a row.
