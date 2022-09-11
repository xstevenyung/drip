# Routes

Drip is based on [Fresh](https://fresh.deno.dev/) and by extension uses
file-based routing [à la Next.js](https://nextjs.org/docs/routing/introduction)

## Routing

### Index routes

The router will automatically route files named `index` to the root of the
directory.

- `routes/index.tsx` -> `/`
- `routes/blog/index.tsx` -> `/blog`

### Nested routes

The router supports nested files. If you create a nested folder structure, files
will automatically be routed in the same way still.

- `routes/blog/hello-world.tsx` -> `/blog/hello-world`
- `routes/dashboard/settings/user.tsx` -> `/dashboard/settings/user`

### Dynamic route segments

Dynamic routes don't just match a single static path, but rather a whole bunch
of different paths based on a pattern.

Dynamic segments of the route will be between bracket like
`/routes/greet/[name].tsx`

## Pages

In Drip, a page is a **Preact** component exported from a `.js`, `.jsx`, `.ts`
or `.tsx` file in the `routes` directory. Each page is associated with a route
based on its file name.

**Example**: if you create a page `routes/about.tsx` that exports a Preact
component like below, it will be accessible via `/about`

```tsx
export default function About() {
  return <h1>About</h1>;
}
```

::: warning

Due to some limitation with Deno Deploy, we have to include the flag
`/** jsx h */` at the top of all our `jsx/tsx` files.

:::

## Handlers

Routes actually consist of two parts: handlers, and the page component. Up to
now, only the page component.

Handlers receive a `Request` and return a `Response`. They can be used for
executing code on the server-side.

### HTTP Methods

Each route handlers can define a function per
[HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

```tsx
// /routes/greet/[name].tsx
import { Handlers } from "drip/server.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    // your code here
  },

  POST(req, ctx) {
    // your code here
  },

  PUT(req, ctx) {
    // your code here
  },

  PATCH(req, ctx) {
    // your code here
  },

  DELETE(req, ctx) {
    // your code here
  },
};
```

### Passing down data

Handlers can be used to fetch data and pass it down to the page to display it
using `ctx.render`.

**Example**: We can fetch info from an external API and pass it down to the page
to display the information to the user.

```tsx
// /routes/user/[name].tsx
import { Handlers, PageProps } from "drip/server.ts";

type Data = { bio: string };

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    // We can access our dynamic segment value via `ctx.params`
    const { name } = ctx.params;

    // We fetch information from the Github API
    const { bio } = await fetch(`https://api.github.com/users/${name}`)
      .then((response) => response.json());

    // We use `ctx.render` to pass down data to the route component
    return ctx.render({ bio });
  },
};

export default function ({ data }: PageProps<Data>) {
  return (
    <div>
      {/* Now we can access it via `data`*/}
      <p>Bio: {data.bio}</p>
    </div>
  );
}
```

### API routes

While handlers can work seemlessly with a page to pass down data, it's also
possible to create API endpoints.

**Example**: We can transform our previous example into an API endpoint.

```tsx
// /routes/api/user/[name].tsx
import { Handlers, PageProps } from "drip/server.ts";
import { json } from "drip/helpers.ts";

type Data = { bio: string };

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    // We can access our dynamic segment value via `ctx.params`
    const { name } = ctx.params;

    // We fetch information from the Github API
    const { bio } = await fetch(`https://api.github.com/users/${name}`)
      .then((response) => response.json());

    // We can just return a JSON Response instead of `ctx.render` to transform our page into an API endpoint
    return json({ bio });
  },
};
```
