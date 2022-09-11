import type { Handlers, MiddlewareHandlerContext } from "./deps.ts";
import type { State } from "../server/mod.ts";
import { database, User } from "../supabase/mod.ts";
import { validateFormData, z } from "../validation/mod.ts";
import { redirect, redirectBack } from "../helpers/mod.ts";

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

export function createLoginHandler(
  options: Partial<HandlersOptions> = {},
): Handlers<null, State> {
  const opts = { ...DEFAULT_HANDLERS_OPTIONS, ...options };

  return {
    async POST(req, ctx) {
      const { validatedData, errors: validationErrors } =
        await validateFormData(req, {
          email: z.string().email(),
          password: z.string(),
        });

      if (validationErrors) {
        ctx.state.session.flash("_errors", validationErrors);

        return redirectBack(req, { fallback: opts.url });
      }

      const { user, error, session } = await database.auth
        .signIn(validatedData);

      if (!user || !session || error) {
        return redirectBack(req, { fallback: opts.url });
      }

      ctx.state.session.set("token", session.access_token);
      ctx.state.session.set("userId", user.id);

      return redirect(opts.afterSuccessfulURL);
    },
  };
}

export function createRegisterHandler(
  options: Partial<HandlersOptions> = {},
): Handlers<any, State> {
  const opts = { ...DEFAULT_HANDLERS_OPTIONS, ...options };

  return {
    async POST(req, ctx) {
      const { validatedData, errors: validationErrors } =
        await validateFormData(req, {
          email: z.string().email(),
          password: z.string(),
        });

      if (validationErrors) {
        ctx.state.session.flash("_errors", validationErrors);

        return redirectBack(req, { fallback: opts.url });
      }

      await database.auth.signUp(validatedData);
      const { user, error, session } = await database.auth
        .signIn(validatedData);

      if (!user || !session || error) {
        return redirectBack(req, { fallback: opts.url });
      }

      ctx.state.session.set("token", session.access_token);
      ctx.state.session.set("userId", user.id);

      return redirect(opts.afterSuccessfulURL);
    },
  };
}

export function createForgotPasswordHandler(
  options: Partial<HandlersOptions> = {},
): Handlers<any, State> {
  const opts = { ...DEFAULT_HANDLERS_OPTIONS, ...options };

  return {
    async POST(req, ctx) {
      const { validatedData, errors } = await validateFormData(req, {
        email: z.string().email(),
      });

      if (!validatedData || errors) {
        ctx.state.session.flash("_errors", errors);

        return redirectBack(req, { fallback: opts.url });
      }

      await database.auth.api.resetPasswordForEmail(validatedData.email);

      return redirectBack(req, { fallback: opts.url });
    },
  };
}

export * from "./template/mod.ts";
