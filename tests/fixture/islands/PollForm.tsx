/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Form } from "drip/runtime.ts";

export default function () {
  return (
    <Form method="post">
      {({ state }) => {
        return (
          <fieldset disabled={state === "submitting"}>
            <p>{state}</p>

            <input type="text" name="question" />

            <button type="submit">
              {state === "submitting" ? "Loading..." : "Start"}
            </button>
          </fieldset>
        );
      }}
    </Form>
  );
}
