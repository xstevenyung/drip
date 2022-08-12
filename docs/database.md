# Database

Drip rely on Supabase for everything about the databases. Supabase is a great
open source project that provide an alternative to Firebase without any vendor
lock-in as the database behind it is plain simple PostgreSQL.

If you are already familiar with Supabase, you can skip to the
[next chapter](/session).

## Supabase Studio

Supabase uses a CLI to manage a local instance of your database. We are going to
see quickly how it works and get your up and running in no time.

::: info

Didn't install it yet? Check out the
[Supabase documentation](https://github.com/supabase/cli) for more info

`supabase -v` should run successfully before you can move to the next section

:::

## Start your first local instance of Supabase

When you are starting your Drip project, we will automatically start Supabase
locally, but you can always start it yourself using `supabase start`

Once the command has finished, you should be able to see the container running
in Docker:

```bash
$ docker ps

CONTAINER ID   IMAGE                                    COMMAND                  CREATED          STATUS                    PORTS                                                                       NAMES
e8cd4f72fce8   supabase/studio:latest                   "docker-entrypoint.s…"   27 seconds ago   Up 26 seconds             0.0.0.0:54323->3000/tcp                                                     supabase_studio_link-redirector
637db79070fd   supabase/postgres-meta:v0.40.0           "docker-entrypoint.s…"   27 seconds ago   Up 27 seconds             8080/tcp                                                                    supabase_pg_meta_link-redirector
e5d87ba13cfb   supabase/pgadmin-schema-diff:cli-0.0.4   "sleep infinity"         28 seconds ago   Up 27 seconds                                                                                         supabase_differ_link-redirector
af1f09c57717   supabase/storage-api:v0.15.0             "docker-entrypoint.s…"   28 seconds ago   Up 27 seconds             5000/tcp                                                                    supabase_storage_link-redirector
8d5d4fca41f4   postgrest/postgrest:v9.0.0.20220211      "/bin/sh -c postgrest"   28 seconds ago   Up 28 seconds             3000/tcp                                                                    supabase_rest_link-redirector
5590766b7fa1   supabase/realtime:v0.22.4                "./prod/rel/realtime…"   28 seconds ago   Up 28 seconds                                                                                         supabase_realtime_link-redirector
fff53e03a78e   inbucket/inbucket:stable                 "/start-inbucket.sh …"   29 seconds ago   Up 28 seconds (healthy)   0.0.0.0:54326->1100/tcp, 0.0.0.0:54325->2500/tcp, 0.0.0.0:54324->9000/tcp   supabase_inbucket_link-redirector
84b90496f175   supabase/gotrue:v2.6.18                  "gotrue"                 29 seconds ago   Up 28 seconds                                                                                         supabase_auth_link-redirector
695e0ca64dbd   kong:2.1                                 "sh -c 'cat <<'EOF' …"   29 seconds ago   Up 29 seconds             8001/tcp, 8443-8444/tcp, 0.0.0.0:54321->8000/tcp                            supabase_kong_link-redirector
6a4b98f4703b   supabase/postgres:14.1.0.21              "docker-entrypoint.s…"   42 seconds ago   Up 41 seconds             0.0.0.0:54322->5432/tcp                                                     supabase_db_link-redirector
```

::: tip

If you face this error:
`Error: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`,
you need to start Docker first

:::

## Meet Supabase Studio (locally)

Once Supabase is successfully started, it will run various services on different
port. For now, the only one we are insterested about is Supabase Studio where
most our work will be done at <a href="http://localhost:54323" target="_blank">
`http://localhost:54323`</a>

![Supabase Studio](/assets/supabase-studio.png)

::: info

We are going to use the "Default Project" for the rest of our example.

:::

## Create your first table

If you are familiar with other solutions, it might be unsettling to work with
Supabase Studio at first a lot of things are done in the UI but bare with us.
You will appreciate the work done for you in no time, pinky promess!

First, let's go to the "Table Editor" then "Create Table":

// TODO Illustration

For this example, we are going to create a Link Shortener app:

![Supabase Studio create links table](/assets/supabase-studio-create-links-table.png)

::: info

We are not going to focus on RLS (Row Level Security) in the chapter but if you
are interested about it, you can jump to
[Row Level Security chapter](/authorization/rls)

:::

## Saving your database changes (database migration)

Supabase will do a diff on your database changes to generate a SQL script called
a migration.

You can create that migration automatically by running
`supabase db commit <migration_name>`

## Insert data in your database

Drip initialize and manage your Supabase client. You can interact with your
database the same way you would will plain Supabase (cf.
[Supabase doc for more info](https://supabase.com/docs/reference/javascript/insert))

```ts
import { database } from "drip/database.ts";
// Those types are auto-generated by Drip using Supabase CLI
import type { TableRow } from "@/types/database.gen.ts";

const { error, data } = await database.from<TableRow<"links">>("links")
  .insert({ slug: "hello-drip", target_url: "https://drip.deno.dev/" })
  .single();
```

::: info

All interaction with the database are made with Supabase JS Client which has
complete documentation [here](https://supabase.com/docs/reference)

:::

## Resetting your database

Oops, you messed up your database and want to go back to the previous working
state?

Just run `supabase db reset` and you should be good to go!

::: warning

All unsaved changed will be lost

:::
