// Language → books → reader, with the dictionary as a layer on top. Navigation is cell state (no URL router: the APK
// serves the page from /assets/). Android Back calls window.__back (see the
// android/ MainActivity overlay); Esc / Alt+← do the same on desktop.
import type { JSX } from "aio";
import { afterRender, onWindowEvent } from "aio/air";
import { reader } from "./cell.ts";
import Books from "./ui/Books.tsx";
import { dict, goUp, isDark } from "./ui/chrome.tsx";
import Dictionary from "./ui/Dictionary.tsx";
import Reader from "./ui/Reader.tsx";
import NamesChoice from "./ui/NamesChoice.tsx";
import Welcome from "./ui/Welcome.tsx";

(globalThis as { __back?: () => boolean }).__back = goUp;

export default function App(): JSX.Element {
  const depth = reader.lang ? (reader.book !== null ? 2 : 1) : 0;
  const dark = isDark();
  afterRender(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.lang = reader.lang === "cz" ? "cs" : "en";
  });
  onWindowEvent("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" || (e.altKey && e.key === "ArrowLeft")) goUp();
  });
  return (
    <>
      {depth === 0
        ? <Welcome />
        : reader.names === null
        ? <NamesChoice />
        : depth === 1
        ? <Books />
        : <Reader />}
      {dict.value && depth > 0 ? <Dictionary /> : null}
    </>
  );
}
