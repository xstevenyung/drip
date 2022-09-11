import { createRegisterHandler } from "drip/auth.ts";
import { RegisterPage } from "drip/auth.ts";

export const handler = createRegisterHandler({
  url: "/register",
  afterSuccessfulURL: "/dashboard",
});

export default RegisterPage;
