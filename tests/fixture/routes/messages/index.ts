import { Handlers } from "drip/server.ts";
import { redirect } from "drip/helpers.ts";
import { withValidation } from "drip/validation.ts";

export const handler: Handlers = {
  POST: withValidation({
    formData: (z) => ({
      message: z.string().min(2),
      count: z.number(),
      shouldSend: z.boolean(),
      additionalRequest: z.string().array().min(1),
    }),
    onError: () => {
      return redirect("/messages/new");
    },
  }, (_req, ctx) => {
    console.log(ctx.state.validatedData);
    return redirect("/messages/new");
  }),
};
