/** @jsx h */
import { h, useReducer } from "./deps.ts";
import { validateFormData, ZodIssue, ZodRawShape } from "../validation/mod.ts";
import { makeStore, useStore } from "./deps.ts";

const initialGlobalStore = { _errors: null, _success: null };

const globalStore = makeStore({ ...initialGlobalStore });

export function updateGlobalStore(newState: any) {
  globalStore.set((state) => ({ ...state, ...newState }));
}

export function resetGlobalStore() {
  globalStore.set({ ...initialGlobalStore });
}

export const useGlobalStore = () => useStore(globalStore);

export type FormStatus = "idle" | "submitting";
export type FormProps = {
  method?: string;
  action?: string;
  children: (
    data: { data: any; status: FormStatus; errors: ZodIssue[] | null },
  ) => any;
  onSuccess?: (data: any) => void;
  shape: ZodRawShape;
};

type FormState = { data: any; errors: ZodIssue[] | null; status: FormStatus };

const initialFormState: FormState = {
  errors: null,
  data: null,
  status: "idle",
};

export function Form(
  {
    method = "get",
    action,
    children,
    shape,
    onSuccess: handleSuccess,
    ...forwardedProps
  }:
    & FormProps
    & Record<any, any>,
) {
  const [formState, dispatch] = useReducer<
    { data: any; errors: ZodIssue[] | null; status: FormStatus },
    { type: "data" | "errors" | "status" | "reset"; value?: any }
  >(
    (state, action) => {
      if (action.type === "reset") {
        resetGlobalStore();
        return { ...initialFormState };
      }

      if (action.type === "errors") {
        updateGlobalStore({ _errors: action.value });
      }

      return { ...state, [action.type]: action.value };
    },
    { ...initialFormState },
  );

  return (
    <form
      {...{ method, action }}
      {...forwardedProps}
      onSubmit={async (e) => {
        e.preventDefault();

        dispatch({ type: "reset" });

        // We can even do client-side validation with the exact same code!
        const { validatedData, errors: validationErrors } =
          await validateFormData(
            new FormData(e.target),
            shape,
          );

        if (validationErrors) {
          dispatch({ type: "errors", value: validationErrors });
          return null;
        }

        dispatch({ type: "status", value: "submitting" });

        await fetch(action || window.location.pathname, {
          method,
          body: JSON.stringify(validatedData),
          headers: { "Content-Type": "application/json" },
        }).then(async (response) => {
          // We handle server-side errors in case there is some
          if (response.status === 422) {
            const { errors } = await response.json();
            dispatch({ type: "errors", value: errors });
          }

          if (response.status < 300) {
            const body = await response.text();
            const data = body.length > 0 ? JSON.parse(body) : null;
            dispatch({ type: "data", value: data });

            e.target.reset();

            if (handleSuccess) {
              handleSuccess(data);
            }
          }
        }).finally(() => {
          dispatch({ type: "status", value: "idle" });
        });
      }}
    >
      {children({ ...formState })}
    </form>
  );
}

export * from "../deps/fresh/runtime.ts";
export * from "../deps/statery.ts";
