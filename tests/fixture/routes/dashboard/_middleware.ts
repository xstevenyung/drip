import { createAuthMiddleware } from "drip/auth.ts";

export const handler = createAuthMiddleware({
  onError() {
    return new Response(null, {
      status: 303,
      headers: { "Location": "/login" },
    });
  },
});
