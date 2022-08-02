/** @jsx h */
import { h } from "../deps/preact.ts";
import { z as baseZod, ZodType } from "./deps.ts";
import { HandlerContext } from "../deps/fresh/server.ts";
import type { State } from "../server/mod.ts";

export function error(errors, key) {
  if (!errors) return null;
  return errors.find((error) => error.path.includes(key));
}

export const formDataZod = {
  ...baseZod,
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
  formData: (z: any) => Record<string, ZodType>;
  onError: (
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
    const data: Record<string, any> = {};
    formData.forEach((value: any, key) => {
      if (value === "") {
        value = undefined;
      }

      if (!Number.isNaN(Number(value))) {
        value = Number(value);
      }
      console.log(value);

      data[key] = value;
    });

    try {
      ctx.state.validatedData = baseZod.object(validation.formData(formDataZod))
        .parse(data);
    } catch (e) {
      if (e instanceof baseZod.ZodError) {
        ctx.state.session.flash("errors", e.issues);

        return validation.onError(req, ctx);
      }

      throw e;
    }

    return handler(req, ctx);
  };
}

export * from "./deps.ts";
