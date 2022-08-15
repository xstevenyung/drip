/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "drip/server.ts";
import manifest from "./fresh.gen.ts";

import { Link } from "./models/link.ts";
setTimeout(() => {
  Link.query.test(123).then(console.log);
}, 2000);
await start(manifest);
