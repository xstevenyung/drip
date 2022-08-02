/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Handlers } from "drip/server.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render({ errors: ctx.state.session.flash("errors") });
  },
};

export default function ({ data }) {
  return (
    <>
      <div>{JSON.stringify(data.errors)}</div>

      <form action="/messages" method="post">
        <input type="text" name="message" />
        <input type="number" name="count" />
        <input type="checkbox" name="shouldSend" />
        <input type="text" name="additionalRequest[]" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
