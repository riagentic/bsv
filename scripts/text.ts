// deno task text — bible/word/* → text/{en,cz}/NN.md (one file per book) + text/index.json
// + text/glossary-{en,cz}.md and text/terms.json (from content/), mirrored into android/app/src/main/assets/text/
// (the APK overlay copies real files only). A CZ book ships only once every chapter exists.
import { join } from "@std/path";

type Book = { n: number; id: string; name: string; chapters: number };

const SRC = {
  en: "bible/word/bible-kjv-v2",
  cz: "bible/word/bible-kjv-v2-cz",
} as const;
const OUTS = ["text", "android/app/src/main/assets/text"];

export const CZ_NAMES = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numeri",
  "Deuteronomium",
  "Jozue",
  "Soudců",
  "Rút",
  "1. Samuelova",
  "2. Samuelova",
  "1. Královská",
  "2. Královská",
  "1. Paralipomenon",
  "2. Paralipomenon",
  "Ezdráš",
  "Nehemjáš",
  "Ester",
  "Jób",
  "Žalmy",
  "Přísloví",
  "Kazatel",
  "Píseň písní",
  "Izajáš",
  "Jeremjáš",
  "Pláč",
  "Ezechiel",
  "Daniel",
  "Ozeáš",
  "Jóel",
  "Ámos",
  "Abdijáš",
  "Jonáš",
  "Micheáš",
  "Nahum",
  "Abakuk",
  "Sofonjáš",
  "Ageus",
  "Zacharjáš",
  "Malachiáš",
  "Matouš",
  "Marek",
  "Lukáš",
  "Jan",
  "Skutky apoštolů",
  "Římanům",
  "1. Korintským",
  "2. Korintským",
  "Galatským",
  "Efezským",
  "Filipským",
  "Koloským",
  "1. Tesalonickým",
  "2. Tesalonickým",
  "1. Timoteovi",
  "2. Timoteovi",
  "Titovi",
  "Filemonovi",
  "Židům",
  "Jakubův",
  "1. Petrův",
  "2. Petrův",
  "1. Janův",
  "2. Janův",
  "3. Janův",
  "Judův",
  "Zjevení Janovo",
];

const sorted = async (dir: string, pick: (e: Deno.DirEntry) => boolean) =>
  (await Array.fromAsync(Deno.readDir(dir))).filter(pick).map((e) => e.name)
    .sort();

/** EN book name = its first chapter heading minus the number ("# 1 Samuel 1" → "1 Samuel"). */
const headingName = (md: string) => md.match(/^# (.+?) \d+\s*$/m)?.[1] ?? "?";

async function build(
  lang: keyof typeof SRC,
): Promise<[Book[], Map<string, string>]> {
  const books: Book[] = [];
  const files = new Map<string, string>();
  let dirs: string[];
  try {
    dirs = await sorted(
      SRC[lang],
      (e) => e.isDirectory && /^\d\d-/.test(e.name),
    );
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) return [books, files];
    throw e;
  }
  for (const dir of dirs) {
    const n = Number(dir.slice(0, 2));
    const chapters = await sorted(
      join(SRC[lang], dir),
      (e) => e.isFile && e.name.endsWith(".md"),
    );
    const texts = await Promise.all(
      chapters.map((c) => Deno.readTextFile(join(SRC[lang], dir, c))),
    );
    const md = texts.map((t) => t.trim()).join("\n\n");
    const nn = String(n).padStart(2, "0");
    files.set(`${lang}/${nn}.md`, md + "\n");
    books.push({
      n,
      id: dir.slice(3),
      name: lang === "cz"
        ? CZ_NAMES[n - 1]
        : n === 19
        ? "Psalms"
        : headingName(texts[0]),
      chapters: chapters.length,
    });
  }
  return [books, files];
}

if (import.meta.main) {
  const [en, enFiles] = await build("en");
  const [czAll, czFiles] = await build("cz");
  if (en.length !== 66) {
    throw new Error(`expected 66 EN books in ${SRC.en}, found ${en.length}`);
  }
  const cz = czAll.filter((b) => b.chapters === en[b.n - 1].chapters);
  for (const b of czAll) {
    if (!cz.includes(b)) {
      czFiles.delete(`cz/${String(b.n).padStart(2, "0")}.md`);
    }
  }
  for (const lang of ["en", "cz"]) {
    czFiles.set(
      `glossary-${lang}.md`,
      await Deno.readTextFile(`content/glossary.${lang}.md`),
    );
  }
  czFiles.set("terms.json", await Deno.readTextFile("content/terms.json"));
  const index = JSON.stringify({ en, cz });
  for (const out of OUTS) {
    await Deno.remove(out, { recursive: true }).catch((e) => {
      if (!(e instanceof Deno.errors.NotFound)) throw e;
    });
    for (const [path, md] of [...enFiles, ...czFiles]) {
      await Deno.mkdir(join(out, path, ".."), { recursive: true });
      await Deno.writeTextFile(join(out, path), md);
    }
    await Deno.writeTextFile(join(out, "index.json"), index);
  }
  console.log(
    `text: en ${en.length} books, cz ${cz.length}/${czAll.length} complete books, glossaries → ${
      OUTS.join(", ")
    }`,
  );
}
