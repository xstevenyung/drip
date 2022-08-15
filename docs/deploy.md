# Deploy

Drip provide a default GitHub Action to automatically deploy to
[Deno Deploy](https://deno.com/deploy) and [Supabase](https://supabase.com/).

## Supabase Setup

1. Go to [app.supabase.com](https://app.supabase.com).
2. Click on "New Project".
3. Enter your project details.
4. Wait for the new database to launch (now is the time to make that coffee, it
   should take a few minutes)

::: tip

Save your database password somewhere, we will need it later on

:::

When your new database is created we are going to grab a few infos before the
next step.

In your freshly created project, you should have this screen:

Grab the public anon API key and the project URL:

## Deno Deploy Setup

If you don't have a [Deno Deploy](https://deno.com/deploy) account yet, now is
the time to [create one for free](https://deno.com/deploy).

Now that your database is up and running, let's setup Deno Deploy.

1. Go to [dash.deno.com/projects](https://dash.deno.com/projects)
2. Click on "New Project"
3. Enter your project details
4. Don't forget to use "GitHub Action" as a deployment method
5. Add you environment variables
   1. `APP_KEY` should be a random and long enough key
   2. `SUPABASE_URL` should be the URL you grabbed before
   3. `SUPABASE_KEY` should be the anon public API key you grabbed before

::: tip

You can generate a random key in Deno using:

`btoa(self.crypto.getRandomValues(new Uint8Array(64)))`

:::

## GitHub Action

We provided a simple GitHub Action for deploying to Supabase and Deno Deploy.

You will have to update `.github/workflows/deploy.yml` to point to your Deno
Deploy project.

```yaml{35}
name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: [ubuntu-latest]

    permissions:
      id-token: write # This is required to allow the GitHub Action to authenticate with Deno Deploy.
      contents: read

    steps:
      - name: Clone repository
        uses: actions/checkout@v3

      - name: Install Supabase CLI
        run: brew install supabase/tap/supabase

      - name: Run migration
        shell: bash
        env:
          DATABASE_PASSWORD: ${{ secrets.DATABASE_PASSWORD }}
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        # TODO: change `supabase-project-ref` and supply `DATABASE_PASSWORD` + `SUPABASE_ACCESS_TOKEN` in Github Secrets
        run: |
          supabase link --project-ref supabase-project-ref -p $DATABASE_PASSWORD 
          supabase db push -p $DATABASE_PASSWORD

      - uses: actions/setup-node@v3
        with:
          node-version: 16

      - run: npm install

      - run: npx tailwindcss -i ./styles/main.css -o ./static/styles/main.css -m

      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Deploy to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: your-project-name # TODO: change this for the name of the project on Deno Deploy
          entrypoint: main.ts # the entrypoint to deploy
          import-map: import_map.json
```

We also need to specific our database password (that you saved earlier) and a
`SUPABASE_ACCESS_TOKEN`(that you can generate
[here](https://app.supabase.com/account/tokens)) as a GitHub secrets:

1. Go to your repo
2. Go to `Settings` > `Secrets` > `Actions`
3. Click on `New repository secret`
4. Set "name" to `DATABASE_PASSWORD` & "value" to your password from Supabase
5. Set "name" to `SUPABASE_ACCESS_TOKEN` & "value" to your recently generated
   access token

::: tip

If you forgot your database password, it's possible to reset it in the Supabase
dashboard in `Settings` > `Database`

:::

Now all you have to do is push to the `main` branch and your modification will
be automatically deploy in production.

Congratulation you are now live on the interweb! 🎉🍾
