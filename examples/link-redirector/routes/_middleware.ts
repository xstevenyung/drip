import { MiddlewareHandlerContext, session } from "drip/server.ts";

export function handler(req: Request, ctx: MiddlewareHandlerContext) {
  return session.cookieSession(req, ctx);
}
