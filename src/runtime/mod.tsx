/** @jsx h */
import { h, JSX, useReducer } from "./deps.ts";
import {
  error as findError,
  validateFormData,
  ZodIssue,
  ZodRawShape,
} from "../validation/mod.ts";
import { makeStore, useStore } from "./deps.ts";

export type GlobalStoreState = {
  _errors: ZodIssue[] | null | undefined;
  _success: string | null | undefined;
} & Record<string, any>;

const initialGlobalStore: GlobalStoreState = { _errors: null, _success: null };

const globalStore = makeStore<GlobalStoreState>({ ...initialGlobalStore });

export function updateGlobalStore(newState: Partial<GlobalStoreState>) {
  globalStore.set((state) => ({ ...state, ...newState }));
}

export function resetGlobalStore() {
  globalStore.set({ ...initialGlobalStore });
}

export const useGlobalStore = () => useStore(globalStore);

export type FormStatus = "idle" | "submitting";

export type FormState = {
  data: any;
  errors: ZodIssue[] | null | undefined;
  status: FormStatus;
};

export type FormProps = {
  method?: string;
  action?: string;
  children: (
    state: FormState,
    action: { error: (key: string) => ZodIssue | null | undefined },
  ) => any;
  onSuccess?: (data: any) => void;
  shape: ZodRawShape;
};

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
    & JSX.HTMLAttributes<HTMLFormElement>,
) {
  const [formState, dispatch] = useReducer<
    {
      data: any;
      errors: ZodIssue[] | null | undefined | null;
      status: FormStatus;
    },
    | { type: "errors"; value: ZodIssue[] | null | undefined }
    | { type: "reset" }
    | { type: "status"; value: FormStatus }
    | { type: "data"; value?: any }
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

        const { target } = e;

        if (target instanceof HTMLFormElement) {
          dispatch({ type: "reset" });

          // We can even do client-side validation with the exact same code!
          const { validatedData, errors: validationErrors } =
            await validateFormData(
              new FormData(target),
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
              console.log({ data });
              dispatch({ type: "data", value: data });

              target.reset();

              if (handleSuccess) {
                handleSuccess(data);
              }
            }
          }).finally(() => {
            dispatch({ type: "status", value: "idle" });
          });
        }
      }}
    >
      {children({ ...formState }, {
        error: (key) => findError(formState.errors, key),
      })}
    </form>
  );
}

export * from "../deps/fresh/runtime.ts";
export * from "../deps/statery.ts";
