import { configSync, dev as baseDev } from "./deps.ts";
import { generateTypes as generateDatabaseTypes } from "../supabase/mod.ts";
import { blue, green } from "https://deno.land/std/fmt/colors.ts";

function tagOutput(tag: string, output: Uint8Array) {
  const tagColors = {
    supabase: green,
    tailwind: blue,
  };
  const color = (tag: string) => tagColors[tag];

  return new TextDecoder()
    .decode(output)
    .split("\n")
    .filter(Boolean)
    .map((line) => `${color(tag)(`${tag} |`)} ${line}`)
    .join("\n");
}

export function supabase() {
  return async () => {
    if (!Deno.env.get("SUPABASE_DEV_STARTED")) {
      const cwd = new URL(".", Deno.env.get("CWD")).pathname;

      const process = Deno.run({
        cmd: ["supabase", "start"],
        cwd,
        stdout: "piped",
        stderr: "piped",
      });

      console.log(tagOutput("supabase", await process.output()));
      console.error(tagOutput("supabase", await process.stderrOutput()));
    }

    Deno.env.set("SUPABASE_DEV_STARTED", "true");

    generateDatabaseTypes();
  };
}

export type TailwindModuleOptions = { input: string; output: string };

export function tailwind(options: TailwindModuleOptions) {
  return async () => {
    const cwd = new URL(".", Deno.env.get("CWD")).pathname;

    const process = Deno.run({
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
      stderr: "piped",
    });

    // Should uncomment and replace when https://github.com/tailwindlabs/tailwindcss/pull/9054 is merged
    console.log(tagOutput("tailwind", await process.stderrOutput()));
  };
}

export type DripDevModule = () => Promise<any>;

export async function dev(
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

  if (modules) {
    await Promise.all(modules.map((module) => module()));
    console.log();
  }

  return baseDev(base, entrypoint);
}
