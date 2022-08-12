import { createRegisterHandlers } from "drip/auth.ts";
import { RegisterPage } from "drip/auth.ts";

export const handler = createRegisterHandlers({
  url: "/register",
  afterSuccessfulURL: "/dashboard",
});

export default RegisterPage;
