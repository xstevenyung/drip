import { database } from "drip/database.ts";
import { TableRow } from "@/types/database.gen.ts";
import type { PostgrestFilterBuilder } from "https://esm.sh/v89/@supabase/postgrest-js@0.37.4/dist/module/index.d.ts";

export class Link {
  constructor(data: TableRow<"links", "Insert">) {
  }

  static get _supabaseQueryBuilder() {
    return database.from<TableRow<"links">>("links");
  }

  static get queryBuilder() {
    return this._supabaseQueryBuilder;
  }

  static get query() {
    return new Proxy(this.queryBuilder.select(), {
      get: (target, property) => {
        if (
          typeof property === "string" &&
          Object.keys(this.scopes).includes(property)
        ) {
          return (args: any) => this.scopes[property](target, args);
        }

        return target[property];
      },
    });
  }

  static get scopes(): Record<
    string,
    (
      query: PostgrestFilterBuilder<TableRow<"links">>,
      args: any,
    ) => PostgrestFilterBuilder<TableRow<"links">>
  > {
    return {
      test(query, value) {
        return query.eq("slug", value);
      },
    };
  }

  static async find(id: TableRow<"links">["id"]) {
    const result = await Link.queryBuilder.select().eq("id", id).limit(1);

    if (!result.data?.length) return null;

    return result.data[0];
  }

  static create(data: TableRow<"links", "Insert">) {
    return Link.queryBuilder.insert(data);
  }
}
