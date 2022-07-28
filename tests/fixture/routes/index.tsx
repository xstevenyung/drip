/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "fresh/server.ts";
import { database } from "drip/database.ts";
import { TableRow } from "@/types/database.gen.ts";
import { State } from "./_middleware.ts";
import PollForm from "@/islands/PollForm.tsx";

export type Data = { polls: TableRow<"polls">[] };

export const handler: Handlers<Data, State> = {
  async GET(_req, ctx) {
    const polls =
      (await database.from<TableRow<"polls">>("polls").select()).data || [];
    return ctx.render({ polls });
  },

  async POST(req) {
    const formData = await req.formData();

    await database.from<TableRow<"polls">>("polls").insert({
      question: formData.get("question") as string,
    });

    return new Response(null, { status: 204 });
  },
};

export default function ({ data }: PageProps) {
  return (
    <>
      <div>{JSON.stringify(data)}</div>

      <PollForm />
    </>
  );
}
