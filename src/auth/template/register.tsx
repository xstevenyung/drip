/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "../deps.ts";

export default function () {
  return (
    <>
      <h1>Register</h1>

      <form method="post">
        <div>
          <label for="email">Email</label>
          <input id="email" type="email" name="email" required />
        </div>

        <div>
          <label for="password">password</label>
          <input id="password" type="password" name="password" required />
        </div>

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
