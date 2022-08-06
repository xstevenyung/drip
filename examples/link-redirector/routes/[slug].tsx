import { Handlers } from "drip/server.ts";
import { database } from "drip/database.ts";
import { TableRow } from "../types/database.gen.ts";
import { redirect } from "drip/helpers.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { slug } = ctx.params;

    const { data, error } = await database.from<TableRow<"links">>(
      "links",
    )
      .select()
      .eq("slug", slug)
      .limit(1);

    if (error) {
      return new Response(null, { status: 500 });
    }

    if (!data.length) {
      return new Response(null, { status: 404 });
    }

    return redirect(data[0].target_url);
  },
};
