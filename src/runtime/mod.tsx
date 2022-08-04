/** @jsx h */
import { h, useState } from "./deps.ts";

export type FormState = "pending" | "submitting" | "submitted";

export type FormErrors = Record<string, string[]> | null;

export type FormProps = {
  children: (
    data: { state: FormState; errors: FormErrors },
  ) => any;
  method: string;
  action?: string;
};

export function Form(
  { children, method, action, ...forwardedProps }: FormProps,
) {
  const [state, setState] = useState<FormState>("pending");
  const [errors, setErrors] = useState<FormErrors>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  return (
    <form
      {...{ method, action }}
      {...forwardedProps}
      onSubmit={async (e) => {
        e.preventDefault();

        setState("submitting");

        setFormData(new FormData(e.target));
        await fetch(action || window.location.pathname, {
          method,
          body: formData,
        });

        setState("submitted");
      }}
    >
      {children({ state, errors })}
    </form>
  );
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

export * from "../deps/fresh/runtime.ts";
