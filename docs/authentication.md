# Authentication

Drip ships with an Authentication Starter Kit based on
[Supabase Auth](https://supabase.com/docs/guides/auth), we provide simple
authentication for your app so you can focus on building your product right out
of the gate.

We try to make it as easy as possible to get started with authentication. Thanks
to Supabase, you will get email confirmation, forget password & more
out-of-the-box.

## Register page

```tsx
// routes/register.tsx
import { createRegisterHandler, RegisterPage } from "drip/auth.ts";

export const handler = createRegisterHandler({
  // Change it to match in what file your are placing your code
  url: "/register",
  // Change it to match where you want to redirect the user on successfully register
  afterSuccessfulURL: "/dashboard",
});

export default RegisterPage;
```

### Customize your Registration Page looks

If you need to customize the registration page template, you can always copy the
[template source code](https://github.com/xstevenyung/drip/blob/main/src/auth/template/register.tsx)
to customize it yourself

::: info

The only requirement when customizing the registration template is to send a
`POST` request with `username` and `password`.

:::

## Login page

```tsx
// routes/login.tsx
import { createLoginHandler, LoginPage } from "drip/auth.ts";

export const handler = createLoginHandler({
  // Change it to match in what file your are placing your code
  url: "/login",
  // Change it to match where you want to redirect the user on successfully logged in
  afterSuccessfulURL: "/dashboard",
});

export default LoginPage;
```

### Customize your Login Page looks

If you need to customize the registration page template, you can always copy the
[template source code](https://github.com/xstevenyung/drip/blob/main/src/auth/template/login.tsx)
to customize it yourself

::: info

The only requirement when customizing the login template is to send a `POST`
request with `username` and `password`.

:::

## Forget password / Reset password

## Change email or/and password
