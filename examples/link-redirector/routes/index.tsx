/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "drip/server.ts";
import { validateJSON, z, ZodIssue } from "drip/validation.ts";
import { database } from "drip/database.ts";
import { TableRow } from "@/types/database.gen.ts";
import CreateLinkForm from "@/islands/CreateLinkForm.tsx";
import GlobalAlert from "@/islands/GlobalAlert.tsx";

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

export type Data = { errors?: ZodIssue[]; success?: string; error?: string };

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    const errors = ctx.state.session.flash("_errors");
    const error = ctx.state.session.flash("_error");
    const success = ctx.state.session.flash("_success");

    return ctx.render({ success, errors, error });
  },

  async POST(req, ctx) {
    const { validatedData, errors } = await validateJSON(req, shape);

    if (errors) {
      return new Response(JSON.stringify({ errors }), { status: 422 });
    }

    const { error } = await database.from<TableRow<"links">>("links")
      .insert(validatedData);

    if (error) {
      // ctx.state.session.flash("_error", "Something went wrong");

      console.error(error);

      // return redirectBack(req, { fallback: "/" });
      return new Response(null, { status: 500 });
    }

    // ctx.state.session.flash("_success", "Link saved!");

    // return redirectBack(req, { fallback: "/" });
    return new Response(null, { status: 204 });
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

        <GlobalAlert />

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <CreateLinkForm />
          </div>
        </div>
      </div>
    </main>
  );
}
