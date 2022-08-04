/** @jsx h */
import { h } from "../deps/preact.ts";
import { z as baseZod, ZodType } from "./deps.ts";
import { HandlerContext } from "../deps/fresh/server.ts";
import type { State } from "../server/mod.ts";
import { redirectBack } from "../helpers/mod.ts";

export function error(errors, key) {
  if (!errors) return null;
  return errors.find((error) => error.path.includes(key));
}

export const formDataValidator = {
  ...baseZod,
  // We handle checkbox "on" value
  boolean(params?: any) {
    return baseZod.union([
      baseZod.literal("on").transform(() => true),
      baseZod.literal(undefined).transform(() => false),
      baseZod.boolean(params),
    ]);
  },
};

export type InputProps = { errors: any[]; name: string; class: string };

export function Input(
  { errors, name, class: className, ...forwardedProps }: InputProps,
) {
  return (
    <input
      {...{ name }}
      {...forwardedProps}
      class={[className, error(errors, name) ? "invalid" : ""].join(" ")}
    />
  );
}

export type Validation = {
  formData: Record<string, ZodType>;
  onError?: (
    req: Request,
    ctx: HandlerContext<any, State & { validatedData: object }>,
  ) => Response;
};

export function withValidation(
  validation: Validation,
  handler: (
    req: Request,
    ctx: HandlerContext<any, State & { validatedData: object }>,
  ) => Response | Promise<Response>,
) {
  return async (
    req: Request,
    ctx: HandlerContext<any, State & { validatedData: object }>,
  ) => {
    const formData = await req.formData();
    const data = new Map();
    formData.forEach((value: any, key) => {
      // Turn all empty string to undefined for later validation
      if (value === "") {
        value = undefined;
      }

      // Transform valid number as number
      if (!Number.isNaN(Number(value))) {
        value = Number(value);
      }

      if (typeof value === "string" && !isNaN(Date.parse(value))) {
        value = new Date(value);
      }

      // handle input suffixed w/ `[]`
      const matches = key.match(/(.+)\[\]/);
      if (matches) {
        key = matches[1];
        value = (data.has(key) ? [...data.get(key), value] : [value])
          .filter(Boolean);
      }

      data.set(key, value);

      // TODO file
    });

    try {
      ctx.state.validatedData = baseZod.object(validation.formData)
        .parse(Object.fromEntries(data));
    } catch (e) {
      if (e instanceof baseZod.ZodError) {
        ctx.state.session.flash("errors", e.issues);

        return validation.onError
          ? validation.onError(req, ctx)
          : redirectBack(req, { fallback: "/" });
      }

      throw e;
    }

    return handler(req, ctx);
  };
}

export * from "./deps.ts";
