import { MiddlewareHandlerContext, session } from "drip/server.ts";

export function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<session.WithSession>,
) {
  return session.cookieSession(req, ctx);
}
