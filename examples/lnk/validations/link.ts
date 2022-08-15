import { z } from "drip/validation.ts";

export default {
  slug: z.string({ required_error: "Slug is required" })
    .min(3, "Slug must be 3 characters long minimum")
    .regex(/^[a-zA-Z-]+$/, "Slug is invalid"),
  target_url: z.string({
    required_error: "Target URL is required",
    invalid_type_error: "Target URL is invalid",
  })
    .trim()
    .url({ message: "Target URL is invalid" }),
};
