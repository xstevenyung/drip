# Validation

## Introduction

Drip uses [Zod](https://zod.dev/) to validate data, we added a few methods to
integrate nicely with Fresh and make that process as smooth as possible.

## Validating Form Data

Deno Fresh and by definition Drip rely highly on the native web platform to do
things. Form Data are the native way to send and submit plain HTML form but
there can be tedious to work with.

### How Drip improve Form Data

On a plain form, the browser with send a `FormData` to send information to the
server.

The issue is that all data are transfered as string or `File` to the server.

```tsx
/** @jsx h */
import { h } from "preact";

export const handler = {
  POST(req) {
    const formData = await req.formData();

    formData.get("participantCount"); // will return a string number (e.g.: "2")
    formData.get("shouldSendInvite"); // will return "on" if true, undefinied if false
    formData.get("startedAt"); // will return the date in a string format (e.g.: `2022-08-04T09:35:59.602Z`)
  },
};

export default function EventForm() {
  return (
    <form method="post">
      <input type="text" name="name" />
      <input type="number" name="participantCount" />
      <input type="checkbox" name="shouldSendInvite" />
      <input type="date" name="startedAt" />
      <button type="submit">Send</button>
    </form>
  );
}
```

All of those makes `FormData` pretty tedious to work with for validation as it
requires manually data change every time.

#### The Drip way

If we take back our previous example:

```tsx
/** @jsx h */
import { h } from "preact";
import { formDataValidator, withValidation } from "drip/validation.ts";
import { redirect } from "drip/helpers.ts";

export const handler = {
  POST: withValidation({
    formData: {
      name: formDataValidator.string().min(2),
      participantCount: formDataValidator.number(),
      shouldSendInvite: formDataValidator.boolean(),
      startedAt: formDataValidator.date(),
    },
    onError: () => redirect("/somewhere"),
  }, (_req, ctx) => {
    // We can now access the validatedData in the right type
    const { participantCount, shouldSendInvite, startedAt } =
      ctx.state.validatedData;

    participantCount; // is a number
    shouldSendInvite; // is a boolean
    startedAt; // is a `Date`
  }),
};

export default function EventForm() {
  return (
    <form method="post">
      <input type="text" name="name" />
      <input type="number" name="participantCount" />
      <input type="checkbox" name="shouldSendInvite" />
      <input type="date" name="startedAt" />
      <button type="submit">Send</button>
    </form>
  );
}
```

We access only valid data via `ctx.state.validatedData` and those are casted to
the right type making it easier to work with.

## Validating JSON Body

TODO

## All validation rules

All validations rules are available in the
[Zod documentation](https://zod.dev/?id=primitives).
