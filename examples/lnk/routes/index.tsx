/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "drip/server.ts";
import { validateJSON } from "drip/validation.ts";
import { database } from "drip/database.ts";
import { TableRow } from "@/types/database.gen.ts";
import CreateLinkForm from "@/islands/CreateLinkForm.tsx";
import GlobalAlert from "@/islands/GlobalAlert.tsx";
import shape from "@/validations/link.ts";

export type Data = {};

export const handler: Handlers<Data> = {
  async POST(req, ctx) {
    const { validatedData, errors } = await validateJSON(req, shape);

    if (errors) {
      return new Response(JSON.stringify({ errors }), { status: 422 });
    }

    const { error, data } = await database.from<TableRow<"links">>("links")
      .insert(validatedData)
      .single();

    if (error) {
      console.error(error);

      return new Response(null, { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  },
};

export default function ({}: PageProps<Data>) {
  return (
    <main class="h-screen bg-gray-50">
      <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            LNK
          </h1>
          <p class="text-gray-500 text-center">
            Short link for free, forever
          </p>
        </div>

        <GlobalAlert />

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <CreateLinkForm baseURL={Deno.env.get("APP_URL") as string} />
          </div>
        </div>

        <p class="text-gray-500 text-center pt-4 text-sm">
          ⚡️ Powered by{" "}
          <a
            href="https://github.com/xstevenyung/drip"
            target="_blank"
            class="text-green-600 font-semibold hover:underline hover:text-green-700 transition-all duration-200"
          >
            Drip
          </a>
        </p>
      </div>
    </main>
  );
}
