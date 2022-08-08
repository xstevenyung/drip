#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { dev, supabase, tailwind } from "drip/dev.ts";

await dev(import.meta.url, "./main.ts", [
  supabase(),
  tailwind({
    input: "./styles/main.css",
    output: "./static/styles/main.css",
  }),
]);
