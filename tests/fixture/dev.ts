#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { dev } from "drip/dev.ts";

await dev(import.meta.url, "./main.ts");
