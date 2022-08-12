# Session

Since HTTP driven applications are stateless, sessions provide a way to store
information about the user across multiple requests. That user information is
typically placed in a persistent store / backend that can be accessed from
subsequent requests.

Drip ships with [`fresh_session`](https://github.com/xstevenyung/fresh-session),
a simple session middleware that rely on JWT to store information in the cookie.

## How does it work?

::: warning

Fresh Session rely on an `APP_KEY` environment variable to encrypt your session
token.

Don't forget to generate a random token in production to avoid security issues.
More info in the [Deploy section](/deploy)

:::

```tsx
import { Handlers } from "drip/server.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    // The session is accessible via the `ctx.state`
    const { session } = ctx.state;

    // Access data stored in the session
    session.get("email");
    // Set new value in the session
    session.set("email", "hello@deno.dev");
    // returns `true` if the session has a value with a specific key, else `false`
    session.has("email");
    // clear all the session data
    session.clear();
    // Access all session data value as an object
    session.data;
    // Add flash data which will disappear after accessing it
    session.flash("success", "Successfully flashed a message!");
    // Accessing the flashed data
    // /!\ This flashed data will disappear after accessing it one time.
    session.flash("success");

    return ctx.render({
      session: session.data, // You can pass the whole session data to the page
    });
  },
};
```
