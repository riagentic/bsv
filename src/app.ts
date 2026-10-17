// Entry. `assets` is declared here (the server mounts it) AND in deno.json
// (the build embeds it). The APK never runs this file — see scripts/text.ts.
import "./cell.ts";
import { aio } from "aio";

await aio.run({
  assets: { "/text": "./text" },
  ui: { title: "Bible Source Version", width: 1000, height: 780 },
  electron: { ignoreDebugEnv: true },
});
