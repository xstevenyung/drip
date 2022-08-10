# Directory Structure

## The `/components` Directory

The `components` directory serve no real purpose but to organize your codebase,
it's mainly used to share components between `routes` and `islands` which will
dictacte how there will work but by itself doesn't nothing but render HTML.

## The `/islands` Directory

The `islands` directory is where you will put component that will need to be
served to the client. It's based on the
[islands architecture](https://jasonformat.com/islands-architecture/) to create
small island of interactivity through out your app instead of shipping tons of
JS code to your client.

This directory comes from [Fresh](https://fresh.deno.dev/docs/concepts/islands).

## The `/routes` Directory

The `routes` directory regroup all our components served as separated pages.
Each page is associated with a route based on its file name.

**Example**: If you create `pages/about.tsx` that exports a React component like
below, it will be accessible at `/about`.

This directory comes from [Fresh](https://fresh.deno.dev/docs/concepts/routes).

## The `/static` Directory

The `static` directory houses your assets such as images and CSS.

This directory comes from
[Fresh](https://fresh.deno.dev/docs/concepts/static-files).

## The `/stores` Directory

The `stores` directory houses all your stores for sharing state between islands.

The stores are based on [Statery](https://github.com/hmans/statery).

## The `/supabase` Directory

The `supabase` directory includes your database migrations and supabase
configuration file required for local development.

## The `/types` Directory

The `types` directory houses all the types shared across the app. We notably
generate a `database.gen.ts` which will type your database schema for provide
the best DX while working with your database.
