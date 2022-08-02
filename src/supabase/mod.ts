import { ensureFile, supabase } from "./deps.ts";

export let database: supabase.SupabaseClient;

export function setup() {
  if (!Deno.env.get("SUPABASE_URL") || !Deno.env.get("SUPABASE_KEY")) {
    console.error("Missing SUPABASE_URL and/or SUPABASE_KEY env variables");
  }

  database = supabase.createClient(
    Deno.env.get("SUPABASE_URL") as string,
    Deno.env.get("SUPABASE_KEY") as string,
  );
}

export function startDev() {
  const cwd = new URL(".", Deno.env.get("CWD")).pathname;

  const process = Deno.run({
    cmd: ["supabase", "start"],
    cwd,
  });

  return process.status();
}

export async function generateTypes() {
  const destination = new URL("./types/database.gen.ts", Deno.env.get("CWD"))
    .pathname;

  await ensureFile(destination);

  const process = await Deno.run({
    cmd: ["supabase", "gen", "types", "typescript", "--local"],
    cwd: new URL(".", Deno.env.get("CWD")).pathname,
    stdout: "piped",
  });

  const output = new TextDecoder().decode(await process.output());

  if (
    new TextDecoder().decode(await Deno.readFile(destination)).includes(output)
  ) {
    return null;
  }

  await Deno.writeTextFile(
    destination,
    `
${output}
export type TableRow<
  T extends keyof Database["public"]["Tables"],
  P extends keyof Database["public"]["Tables"][T] = "Row",
> = Database["public"]["Tables"][T][P];
    `,
  );
}

export type User = supabase.User;
