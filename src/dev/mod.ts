import { configSync, dev as baseDev } from "./deps.ts";
import {
  generateTypes as generateDatabaseTypes,
  startDev as startSupabaseDev,
} from "../supabase/mod.ts";

export function supabase() {
  return async () => {
    if (!Deno.env.get("SUPABASE_DEV_STARTED")) {
      await startSupabaseDev();
    }

    Deno.env.set("SUPABASE_DEV_STARTED", "true");

    generateDatabaseTypes();
  };
}

export type TailwindModuleOptions = { input: string; output: string };

export function tailwind(options: TailwindModuleOptions) {
  return () => {
    const cwd = new URL(".", Deno.env.get("CWD")).pathname;

    return Deno.run({
      cmd: [
        "npx",
        "tailwindcss",
        "-i",
        options.input,
        "-o",
        options.output,
      ],
      cwd,
      stdout: "piped",
    }).status();
  };
}

export type DripDevModule = () => Promise<any>;

export function dev(
  base: string,
  entrypoint: string,
  modules?: DripDevModule[],
) {
  Deno.env.set("CWD", base);

  // copied from https://deno.land/std@0.148.0/dotenv/load.ts
  if (!(Deno.readTextFileSync instanceof Function)) {
    // Avoid errors that occur in deno deploy: https://github.com/denoland/deno_std/issues/1957
    console.warn(
      `Deno.readTextFileSync is not a function: No .env data was read.`,
    );
  } else {
    configSync({
      export: true,
      safe: true,
      path: new URL(".env", base).pathname,
    });
  }

  return Promise.all([
    baseDev(base, entrypoint),
    ...(modules ? modules.map((module) => module()) : []),
  ]);
}
