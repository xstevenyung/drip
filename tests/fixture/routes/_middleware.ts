import type { MiddlewareHandlerContext } from "drip/server.ts";
import { session } from "drip/server.ts";

export type State = session.WithSession;

export function handler(req: Request, ctx: MiddlewareHandlerContext<State>) {
  return session.cookieSession(req, ctx);
}
