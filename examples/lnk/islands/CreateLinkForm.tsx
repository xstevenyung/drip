import { Form } from "drip/runtime.ts";
import shape from "@/validations/link.ts";
import { updateGlobalStore } from "drip/runtime.ts";

export type Props = { baseURL: string };

export default function ({ baseURL }: Props) {
  return (
    <Form
      method="POST"
      shape={shape}
      onSuccess={(data) => {
        updateGlobalStore({
          _success: (
            <>
              Sucessfully created

              <button
                type="button"
                class="flex gap-0.5 items-center"
                onClick={() => {
                  navigator.clipboard
                    .writeText(`${baseURL}/${data.slug}`);
                }}
              >
                <span class="underline">{baseURL}/{data.slug}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </button>
            </>
          ),
        });
      }}
      class="space-y-6"
    >
      {({ status }, { error }) => {
        return (
          <>
            <div>
              <label
                for="slug"
                class={[
                  "block text-sm font-medium",
                  error("slug") ? "text-red-500" : "text-gray-700",
                ].join(" ")}
              >
                Slug
              </label>
              <div class="mt-1">
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  class={[
                    "appearance-none block w-full px-3 py-2 border  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    error("slug") ? "border-red-300" : "border-gray-300",
                  ].join(" ")}
                  placeholder="my-awesome-link"
                />
              </div>
            </div>

            <div>
              <label
                for="target-url"
                class={[
                  "block text-sm font-medium",
                  error("target_url") ? "text-red-500" : "text-gray-700",
                ].join(" ")}
              >
                Target URL
              </label>
              <div class="mt-1">
                <input
                  id="target-url"
                  name="target_url"
                  type="text"
                  class={[
                    "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    error("target_url") ? "border-red-300" : "border-gray-300",
                  ].join(" ")}
                  placeholder="https://my-awesome-portfolio.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={status !== "idle"}
              >
                {status === "idle" ? "Let's go!" : (
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    >
                    </circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    >
                    </path>
                  </svg>
                )}
              </button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
