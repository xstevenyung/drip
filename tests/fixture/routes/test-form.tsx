/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { z } from "drip/validation.ts";
import { Head } from "drip/runtime.ts";
import { error, Input, withValidation } from "drip/validation.ts";

export const handler = {
  GET(_req, ctx) {
    const errors = ctx.state.session.flash("errors");
    return ctx.render({ errors });
  },
  POST: withValidation(
    {
      formData: {
        username: z.string(),
        password: z.string().min(8),
      },
    },
    (req, ctx) => {
      return new Response(null, { status: 204 });
    },
  ),
};

export default function ({ data }) {
  return (
    <>
      <Head>
        <style>
          {`input.invalid { border-color: red;}`}
        </style>
      </Head>
      <form
        method="post"
        style="display: flex; flex-direction: column; align-items:start;"
      >
        <label for="username">Username</label>
        <input
          id="username"
          name="username"
        />

        <label for="password">Password</label>
        <Input
          id="password"
          name="password"
          errors={data.errors}
        />
        {!!error(data.errors, "password")
          ? <p>{error(data.errors, "password").message}</p>
          : null}

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
