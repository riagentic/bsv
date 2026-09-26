// deno task icon — src/ui/mark.ts → src/icon.png (1024px, via inkscape).
import { MARK } from "../src/ui/mark.ts";

const svg = await Deno.makeTempFile({ suffix: ".svg" });
await Deno.writeTextFile(svg, MARK);
const { code } = await new Deno.Command("inkscape", {
  args: [
    svg,
    "--export-type=png",
    "--export-filename=src/icon.png",
    "-w",
    "1024",
    "-h",
    "1024",
  ],
}).output();
await Deno.remove(svg);
if (code !== 0) throw new Error(`inkscape exited ${code}`);
console.log("icon: src/icon.png");
