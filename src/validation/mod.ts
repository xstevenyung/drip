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
  formData?: Record<string, ZodType>;
  searchParams?: Record<string, ZodType>;
  body?: Record<string, ZodType>;
  onError?: (
    req: Request,
    ctx: HandlerContext<any, State & { validatedData: object }>,
  ) => Response;
};

export function sourceToJSON(source: FormData | URLSearchParams) {
  let data: Record<string, any> = {};

  source.forEach((_, key) => {
    const values = source.getAll(key);
    data[key] = values.length === 1 ? values[0] : values;
  });

  return data;
}

export function wrapStringySchema(schema) {
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
  if (validation.formData) {
    validation.formData = wrapStringySchema(validation.formData);
  }

  if (validation.searchParams) {
    validation.searchParams = wrapStringySchema(validation.searchParams);
  }

  return async (
    req: Request,
    ctx: HandlerContext<any, State & { validatedData: object }>,
  ) => {
    ctx.state.validatedData = {};

    try {
      if (validation.searchParams) {
        const { searchParams } = new URL(req.url);

        ctx.state.validatedData = {
          ...ctx.state.validatedData,
          ...z.object(validation.searchParams).parse(
            sourceToJSON(searchParams),
          ),
        };
      }

      if (validation.formData) {
        const formData = await req.formData();

        ctx.state.validatedData = {
          ...ctx.state.validatedData,
          ...z.object(validation.formData).parse(sourceToJSON(formData)),
        };
      }

      if (validation.body) {
        const data = await req.json();

        ctx.state.validatedData = {
          ...ctx.state.validatedData,
          ...z.object(validation.body).parse(data),
        };
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        if (req.headers.get("Content-Type") === "application/json") {
          return validation.onError
            ? validation.onError(req, ctx)
            : new Response(JSON.stringify(e.issues), {
              status: 422,
              headers: { "Content-Type": "application/json" },
            });
        } else {
          ctx.state.session.flash("errors", e.issues);

          return validation.onError
            ? validation.onError(req, ctx)
            : redirectBack(req, { fallback: "/" });
        }
      }

      throw e;
    }

    return handler(req, ctx);
  };
}

export * from "./deps.ts";
