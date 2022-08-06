/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { error, z } from "drip/validation.ts";
import { Form } from "drip/runtime.ts";
import { pointer } from "@/stores/drip.ts";
import { Stores, useStore } from "fresh-store";

const shape = {
  slug: z.string({ required_error: "Slug is required" })
    .min(3, "Slug must be 3 characters long minimum")
    .regex(/^[a-zA-Z-]+$/, "Slug is invalid"),
  target_url: z.string({
    required_error: "Target URL is required",
    invalid_type_error: "Target URL is invalid",
  })
    .trim()
    .url({ message: "Target URL is invalid" }),
};

export default function () {
  // console.log(store);

  return (
    <Form method="POST" shape={shape} class="space-y-6">
      {({ errors, state }) => {
        useEffect(() => {
          Stores.get(pointer)?.set({ errors, state });
        }, [errors, state]);
        return (
          <>
            <div>
              <label
                for="slug"
                class={[
                  "block text-sm font-medium",
                  error(errors, "slug") ? "text-red-500" : "text-gray-700",
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
                    error(errors, "slug")
                      ? "border-red-300"
                      : "border-gray-300",
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
                  error(errors, "target_url")
                    ? "text-red-500"
                    : "text-gray-700",
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
                    error(errors, "target_url")
                      ? "border-red-300"
                      : "border-gray-300",
                  ].join(" ")}
                  placeholder="https://my-awesome-portfolio.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={state !== "idle"}
              >
                {state === "idle" ? "Create it!" : (
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
