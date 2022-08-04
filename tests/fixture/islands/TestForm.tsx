/** @jsx h */
import { h } from "preact";

export default function () {
  return (
    <form
      action="/messages"
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/messages?message=1", {
          method: "POST",
          body: JSON.stringify({ message: "az" }),
          headers: { "Content-Type": "application/json" },
        });
      }}
    >
      <input type="text" name="message" />
      <input type="number" name="count" />
      <input type="checkbox" name="shouldSend" />
      <input type="text" name="additionalRequest" />
      <input type="text" name="additionalRequest" />
      <input type="date" name="sentAt" />
      <button type="submit">Send</button>
    </form>
  );
}
