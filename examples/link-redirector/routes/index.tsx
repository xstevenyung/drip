/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "drip/server.ts";
import { redirectBack } from "drip/helpers.ts";
import { error, validateFormData, z, ZodIssue } from "drip/validation.ts";
import { database } from "drip/database.ts";
import { TableRow } from "@/types/database.gen.ts";

export type Data = { errors?: ZodIssue[]; success?: string; error?: string };

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    const errors = ctx.state.session.flash("_errors");
    const error = ctx.state.session.flash("_error");
    const success = ctx.state.session.flash("_success");

    return ctx.render({ success, errors, error });
  },

  async POST(req, ctx) {
    const { validatedData, errors } = await validateFormData(req, {
      slug: z.string({ required_error: "Slug is required" })
        .min(3, "Slug must be 3 characters long minimum")
        .regex(/^[a-zA-Z-]+$/, "Slug is invalid"),
      target_url: z.string({
        required_error: "Target URL is required",
        invalid_type_error: "Target URL is invalid",
      })
        .trim()
        .url({ message: "Target URL is invalid" }),
    });

    if (errors) {
      ctx.state.session.flash("_errors", errors);
      return redirectBack(req, { fallback: "/" });
    }

    const { error } = await database.from<TableRow<"links">>("links")
      .insert(validatedData);

    if (error) {
      ctx.state.session.flash("_error", "Something went wrong");

      console.error(error);

      return redirectBack(req, { fallback: "/" });
    }

    ctx.state.session.flash("_success", "Link saved!");

    return redirectBack(req, { fallback: "/" });
  },
};

export default function ({ data }: PageProps<Data>) {
  return (
    <main class="h-screen bg-gray-50">
      <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create you first link redirection free & forever
          </h2>
        </div>

        {!!data.success && (
          <div class="sm:mx-auto sm:w-full sm:max-w-md pt-4">
            <div class="rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">
                    {data.success}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!!data.errors?.length && (
          <div class="sm:mx-auto sm:w-full sm:max-w-md pt-4">
            <div class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    There were {data.errors.length} errors with your submission
                  </h3>
                  <div class="mt-2 text-sm text-red-700">
                    <ul role="list" class="list-disc pl-5 space-y-1">
                      {data.errors.map((error) => {
                        return <li>{error.message}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6" method="POST">
              <div>
                <label
                  for="slug"
                  class={[
                    "block text-sm font-medium",
                    error(data.errors, "slug")
                      ? "text-red-500"
                      : "text-gray-700",
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
                      error(data.errors, "slug")
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
                    error(data.errors, "target_url")
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
                      error(data.errors, "target_url")
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
                >
                  Create it!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
