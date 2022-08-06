/** @jsx h */
import { h, useState } from "./deps.ts";
import { validateFormData, ZodIssue, ZodRawShape } from "../validation/mod.ts";

export type FormState = "idle" | "submitting";
export type FormProps = {
  method?: string;
  action?: string;
  children: (
    data: { data: any; state: FormState; errors: ZodIssue[] | null },
  ) => any;
  shape: ZodRawShape;
};

export function Form(
  { method = "get", action, children, shape, ...forwardedProps }:
    & FormProps
    & Record<any, any>,
) {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState<ZodIssue[] | null>(null);
  const [state, setState] = useState<FormState>("idle");

  return (
    <form
      {...{ method, action }}
      {...forwardedProps}
      onSubmit={async (e) => {
        e.preventDefault();

        setErrors(null);

        // We can even do client-side validation with the exact same code!
        const { validatedData, errors: validationErrors } =
          await validateFormData(
            new FormData(e.target),
            shape,
          );

        if (validationErrors) {
          setErrors(validationErrors);
          return null;
        }

        setState("submitting");

        await fetch(action || window.location.pathname, {
          method,
          body: JSON.stringify(validatedData),
          headers: { "Content-Type": "application/json" },
        }).then(async (response) => {
          // We handle server-side errors in case there is some
          if (response.status === 422) {
            const { errors } = await response.json();
            return setErrors(errors);
          }

          setData(await response.json());
        }).finally(() => {
          setState("idle");
        });
      }}
    >
      {children({ data, state, errors })}
    </form>
  );
}

export * from "../deps/fresh/runtime.ts";
