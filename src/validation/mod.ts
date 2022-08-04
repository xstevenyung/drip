/** @jsx h */
import {
  z,
  ZodArray,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodNumber,
  ZodString,
  ZodType,
} from "./deps.ts";
import { HandlerContext } from "../deps/fresh/server.ts";
import type { State } from "../server/mod.ts";
import { redirectBack } from "../helpers/mod.ts";

export function error(errors, key) {
  if (!errors) return null;
  return errors.find((error) => error.path.includes(key));
}

export type Validation = {
  formData: Record<string, ZodType>;
  onError?: (
    req: Request,
    ctx: HandlerContext<any, State & { validatedData: object }>,
  ) => Response;
};

export function formDataToJSON(formData: FormData) {
  let data: Record<string, any> = {};

  formData.forEach((_, key) => {
    const values = formData.getAll(key);
    data[key] = values.length === 1 ? values[0] : values;
  });

  return data;
}

export function wrapFormDataSchema(schema) {
  Object.entries(schema).forEach(([key, value]) => {
    if (value instanceof ZodString) {
      schema[key] = z.preprocess(
        (value) => {
          if (value === "") value = undefined;
          return value;
        },
        value,
      );
    }

    if (value instanceof ZodNumber || value instanceof ZodBigInt) {
      schema[key] = z.preprocess(
        (value) => {
          if (value === "") value = undefined;
          return !Number.isNaN(Number(value)) ? Number(value) : value;
        },
        value,
      );
    }

    if (value instanceof ZodDate) {
      schema[key] = z.preprocess(
        (value) => {
          if (typeof value !== "string") return undefined;
          return !isNaN(Date.parse(value)) ? new Date(value) : value;
        },
        value,
      );
    }

    if (value instanceof ZodBoolean) {
      schema[key] = z.preprocess(
        (value) => {
          return value === "on" ? true : false;
        },
        value,
      );
    }

    if (value instanceof ZodArray) {
      schema[key] = z.preprocess(
        (value) => {
          return Array.isArray(value) ? value.filter(Boolean) : [];
        },
        value,
      );
    }
  });

  return schema;
}

export function withValidation(
  validation: Validation,
  handler: (
    req: Request,
    ctx: HandlerContext<any, State & { validatedData: object }>,
  ) => Response | Promise<Response>,
) {
  validation.formData = wrapFormDataSchema(validation.formData);

  return async (
    req: Request,
    ctx: HandlerContext<any, State & { validatedData: object }>,
  ) => {
    const formData = await req.formData();

    try {
      ctx.state.validatedData = z.object(validation.formData)
        .parse(formDataToJSON(formData));
    } catch (e) {
      if (e instanceof z.ZodError) {
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

// export type InputProps = { errors: any[]; name: string; class: string };

// export function Input(
//   { errors, name, class: className, ...forwardedProps }: InputProps,
// ) {
//   return (
//     <input
//       {...{ name }}
//       {...forwardedProps}
//       class={[className, error(errors, name) ? "invalid" : ""].join(" ")}
//     />
//   );
// }

export * from "./deps.ts";
