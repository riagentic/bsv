import { testCell } from "aio/testing";
import { reader } from "../src/cell.ts";

testCell(
  reader,
  "language → book → up, remembering the last book",
  async (t) => {
    await t.expect.rejects(() => t.send.openBook(1), /language first/);
    t.send.setLang("en");
    t.send.openBook(43);
    t.expect.state((s) => s.lang === "en" && s.book === 43 && s.last.en === 43);
    t.send.setLang("cz"); // switching language keeps the book
    t.expect.state((s) => s.lang === "cz" && s.book === 43);
    t.send.up();
    t.expect.state((s) => s.book === null && s.lang === "cz");
    t.send.up();
    t.expect.state((s) => s.lang === null);
  },
);

testCell(reader, "zoom clamps, theme and position stick", (t) => {
  t.send.setZoom(500);
  t.expect.state((s) => s.zoom === 250);
  t.send.setZoom(10);
  t.expect.state((s) => s.zoom === 60);
  t.send.setTheme("dark");
  t.send.setPos("19", "c23v4");
  t.expect.state((s) => s.theme === "dark" && s.pos["19"] === "c23v4");
});
