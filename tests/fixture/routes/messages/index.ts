import { Handlers } from "drip/server.ts";
import { withValidation, z } from "drip/validation.ts";

export const handler: Handlers = {
  POST: withValidation({
    searchParams: {
      message: z.string().min(2),
      // count: z.number().min(12),
      // shouldSend: z.boolean(),
      // additionalRequest: z.string().array().min(1),
      // sentAt: z.date(),
    },
  }, (req) => {
    return new Response(null, { status: 204 });
  }),
};
