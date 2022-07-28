import { Manifest, session, start as baseStart, StartOptions } from "./deps.ts";
import { setup as setupSupabase } from "../supabase/mod.ts";

export type State = session.WithSession;

export function start(routes: Manifest, options: StartOptions = {}) {
  setupSupabase();

  return baseStart(routes, options);
}

export * from "./deps.ts";
export { session } from "./deps.ts";
