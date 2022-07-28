import type { Handlers, MiddlewareHandlerContext } from "./deps.ts";
import type { State } from "../server/mod.ts";
import { database, User } from "../supabase/mod.ts";

export type AuthState = { user: User | null } & State;

export type HandlersOptions = {
  url: string;
  afterSuccessfulURL: string;
};

const DEFAULT_HANDLERS_OPTIONS: HandlersOptions = {
  url: "/login",
  afterSuccessfulURL: "/",
};

export type AuthMiddlewareOptions = { onError?: () => Response };

export function createAuthMiddleware(options: AuthMiddlewareOptions) {
  return async function (
    _req: Request,
    ctx: MiddlewareHandlerContext<AuthState>,
  ) {
    const token = ctx.state.session.get("token");
    const { user } = await database.auth.api.getUser(token);

    if (!user && options.onError) {
      return options.onError ? options.onError() : ctx.next();
    }

    ctx.state.user = user;
    // auth user with supabase token
    database.auth.setAuth(token);

    return ctx.next();
  };
}

export function createLoginHandlers(
  options: Partial<HandlersOptions> = {},
): Handlers<null, State> {
  const opts = { ...DEFAULT_HANDLERS_OPTIONS, ...options };

  return {
    async POST(req, ctx) {
      const formData = await req.formData();

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email && !password) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: opts.url,
          },
        });
      }

      const { user, error, session } = await database.auth.signIn({
        email,
        password,
      });

      if (!user || !session || error) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: opts.url,
          },
        });
      }

      ctx.state.session.set("token", session.access_token);
      ctx.state.session.set("userId", user.id);

      return new Response(null, {
        status: 303,
        headers: {
          Location: opts.afterSuccessfulURL,
        },
      });
    },
  };
}

export function createRegisterHandlers(
  options: Partial<HandlersOptions> = {},
): Handlers<any, State> {
  const opts = { ...DEFAULT_HANDLERS_OPTIONS, ...options };

  return {
    async POST(req, ctx) {
      const formData = await req.formData();

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email && !password) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: opts.url,
          },
        });
      }

      await database.auth.signUp({
        email,
        password,
      });
      const { user, error, session } = await database.auth.signIn({
        email,
        password,
      });

      if (!user || !session || error) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: opts.url,
          },
        });
      }

      ctx.state.session.set("token", session.access_token);
      ctx.state.session.set("userId", user.id);

      return new Response(null, {
        status: 303,
        headers: {
          Location: opts.afterSuccessfulURL,
        },
      });
    },
  };
}

export * from "./template/mod.ts";
