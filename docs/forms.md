# Forms

`<form />` is the original way data was sent on the web. Drip utilizes
`<form />` but allows progressive enhancement
[à la Remix](https://remix.run/docs/en/v1/guides/data-writes).

## Plain HTML Forms

In the modern days of web, we got too used to storing form information right in
the state. But with our islands architecture, creating plain form whenever
possible allows for create DX and allow us to ship less javascript to the
client.

### Our first HTML form

Let's go back to our link shortener project. We want to allow our user to create
new redirection to our links.

```tsx
// routes/index.tsx
import { h } from "preact";
import { Handlers } from "drip/server.ts";
import { redirectBack } from "drip/helpers.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    // We can retrieve form data using `req.formData`
    const formData = await req.formData();

    formData.get("slug"); // will return the slug value

    // Then we redirect back to the previous page aka our form below
    return redirectBack(req, { fallback: "/" });
  },
};

export default function () {
  return (
    <form method="post">
      <input type="text" name="slug" />

      <input type="text" name="target_url" />

      <button type="submit">Create</button>
    </form>
  );
}
```

### Adding validation

Now that we can ask our user for input, we need to validate the data sent to the
server.

```tsx{10-13}
// routes/index.tsx
import { Handlers } from "drip/server.ts";
import { redirectBack } from "drip/helpers.ts";
import { validateFormData, z } from "drip/validation.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const { validatedData, errors } = validateFormData(req, {
      slug: z.string(),
      target_url: z.string().url(),
    });

    // if any validation are detected, we can stop and send back the errors
    if (errors) {
      ctx.state.session.flash("_errors", errors);

      return redirectBack(req, { fallback: "/" });
    }

    // We can now access validated data only to ensure our users didn't sent us bad data
    validatedData.slug;

    // Then we redirect back to the previous page aka our form below
    return redirectBack(req, { fallback: "/" });
  },
};

export default function () {
  return (
    <form method="post">
      <input type="text" name="slug" />

      <input type="text" name="target_url" />

      <button type="submit">Create</button>
    </form>
  );
}
```

### Displaying valiation errors

Previously, we used `ctx.state.session.flash` to flash errors, we can now pass
those errors down to our form to show the users what is wrong.

```tsx{10-12}
// routes/index.tsx
import { Handlers } from "drip/server.ts";
import { redirectBack } from "drip/helpers.ts";
import { validateFormData, z, error } from "drip/validation.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    // We retrieve our errors and pass them to our page component
    const errors = ctx.state.session.flash("_errors");
    return ctx.render({ errors });
  },

  async POST(req, ctx) {
    const { validatedData, errors } = validateFormData(req, {
      slug: z.string(),
      target_url: z.string().url(),
    });

    // if any validation are detected, we can stop and send back the errors
    if (errors) {
      ctx.state.session.flash("_errors", errors);

      return redirectBack(req, { fallback: "/" });
    }

    // We can now access validated data only to ensure our users didn't sent us bad data
    validatedData.slug;

    // Then we redirect back to the previous page aka our form below
    return redirectBack(req, { fallback: "/" });
  },
};

export default function ({ data }) {
  return (
    <form method="post">
      {/* We can style out input whenever a validation error occurs... */}
      <input type="text" name="slug" class={error(data.errors, 'slug') ? 'invalid' : ''} />
      {/* ... and we can display the error message */}
      {!!error(data.errors, 'slug') && <p>{error(data.errors, 'slug').message}</p>}

      <input type="text" name="target_url" class={error(data.errors, 'target_url') ? 'invalid' : ''} />
      {!!error(data.errors, 'target_url') && <p>{error(data.errors, 'target_url').message}</p>}

      <button type="submit">Create</button>
    </form>
  );
}
```

## Enhanced JavaScript Form

In some (a lot) of cases, you might need more than a plain `<form />` and that's
fine, we got you!

You can easily replace `<form />` with Drip's `<Form />` component. This
component will be used in an island to enable a lot of client-side magic

```tsx
// islands/CreateLinkForm.tsx

export default function () {
  return (
    <Form>
      {({ status }, { error })}
      <input
        type="text"
        name="slug"
        class={error("slug") ? "invalid" : ""}
      />
      {/* we can use `error` with just passing the name of the field now! */}
      {!!error("slug") && <p>{error("slug").message}</p>}

      <input
        type="text"
        name="target_url"
        class={error("target_url") ? "invalid" : ""}
      />
      {!!error("target_url") && <p>{error("target_url").message}</p>}

      <button type="submit">
        {/* We have access to a `status` variable to display feedback to our users when we are doing something */}
        {status === "idle" ? "Create" : "Creating..."}
      </button>
    </Form>
  );
}
```
