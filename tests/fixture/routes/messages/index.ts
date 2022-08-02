import { Handlers } from "drip/server.ts";
import { redirect } from "drip/helpers.ts";
import { formDataValidator, withValidation } from "drip/validation.ts";

export const handler: Handlers = {
  POST: withValidation({
    formData: {
      message: formDataValidator.string().min(2),
      count: formDataValidator.number(),
      shouldSend: formDataValidator.boolean(),
      additionalRequest: formDataValidator.string().array().min(1),
      sentAt: formDataValidator.date(),
    },
    onError: () => {
      return redirect("/messages/new");
    },
  }, (_req, ctx) => {
    console.log(ctx.state.validatedData);
    return redirect("/messages/new");
  }),
};
