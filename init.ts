import {
  basename,
  join,
  resolve,
} from "https://deno.land/std@0.150.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.150.0/flags/mod.ts";
import { gte } from "https://deno.land/std@0.150.0/semver/mod.ts";
import {
  collect,
  generate,
} from "https://deno.land/x/fresh@1.0.2/src/dev/mod.ts";

export function printError(message: string) {
  console.error(`%cerror%c: ${message}`, "color: red; font-weight: bold", "");
}

export function error(message: string): never {
  printError(message);
  Deno.exit(1);
}

const MIN_VERSION = "1.25.0";

// Check that the minimum supported Deno version is being used.
if (!gte(Deno.version.deno, MIN_VERSION)) {
  let message =
    `Deno version ${MIN_VERSION} or higher is required. Please update Deno.\n\n`;

  if (Deno.execPath().includes("homebrew")) {
    message +=
      "You seem to have installed Deno via homebrew. To update, run: `brew upgrade deno`\n";
  } else {
    message += "To update, run: `deno upgrade`\n";
  }

  error(message);
}

const help = `drip-init

Initialize a new Drip project. This will create all the necessary files for a
new project.

To generate a project in the './foobar' subdirectory:
  drip-init ./foobar

To generate a project in the current directory:
  drip-init .

USAGE:
    drip-init <DIRECTORY>

OPTIONS:
    --force   Overwrite existing files
`;

const CONFIRM_EMPTY_MESSAGE =
  "The target directory is not empty (files could get overwritten). Do you want to continue anyway?";

// const USE_TWIND_MESSAGE =
//   "Do you want to use 'twind' (https://twind.dev/) for styling?";

const USE_VSCODE_MESSAGE = "Do you use VS Code?";

const flags = parse(Deno.args, {
  boolean: ["force", "vscode"],
  default: { "force": null, "vscode": null },
  // boolean: ["force", "twind", "vscode"],
  // default: { "force": null, "twind": null, "vscode": null },
});

if (flags._.length !== 1) {
  error(help);
}

const unresolvedDirectory = Deno.args[0];
const resolvedDirectory = resolve(unresolvedDirectory);

try {
  const dir = [...Deno.readDirSync(resolvedDirectory)];
  const isEmpty = dir.length === 0 ||
    dir.length === 1 && dir[0].name === ".git";
  if (
    !isEmpty &&
    !(flags.force === null ? confirm(CONFIRM_EMPTY_MESSAGE) : flags.force)
  ) {
    error("Directory is not empty.");
  }
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }
}

// const useTwind = flags.twind === null
//   ? confirm(USE_TWIND_MESSAGE)
//   : flags.twind;

const useVSCode = flags.vscode === null
  ? confirm(USE_VSCODE_MESSAGE)
  : flags.vscode;

await Deno.mkdir(join(resolvedDirectory, ".github", "workflows"), {
  recursive: true,
});

await Deno.mkdir(join(resolvedDirectory, "components"), { recursive: true });
await Deno.mkdir(join(resolvedDirectory, "islands"), { recursive: true });
await Deno.mkdir(join(resolvedDirectory, "routes"), { recursive: true });
await Deno.mkdir(join(resolvedDirectory, "static"), { recursive: true });
await Deno.mkdir(join(resolvedDirectory, "stores"), { recursive: true });
await Deno.mkdir(join(resolvedDirectory, "styles"), { recursive: true });
await Deno.mkdir(join(resolvedDirectory, "supabase", "migrations"), {
  recursive: true,
});
await Deno.mkdir(join(resolvedDirectory, "types"), { recursive: true });
if (useVSCode) {
  await Deno.mkdir(join(resolvedDirectory, ".vscode"), { recursive: true });
}
// if (useTwind) {
//   await Deno.mkdir(join(resolvedDirectory, "utils"), { recursive: true });
// }

const DOTENV = `APP_KEY=not-secret

SUPABASE_URL=http://localhost:54321
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs
`;
await Deno.writeTextFile(
  join(resolvedDirectory, ".env"),
  DOTENV,
);
await Deno.writeTextFile(
  join(resolvedDirectory, ".env.example"),
  DOTENV,
);

const GITIGNORE = `
.env
static/styles/main.css

# Supabase
**/supabase/.branches
**/supabase/.temp
`;
await Deno.writeTextFile(
  join(resolvedDirectory, ".gitignore"),
  GITIGNORE,
);

const importMap = {
  "imports": {
    "@/": "./",
    "drip/": "https://deno.land/x/drip@0.0.16/",
    "preact": "https://deno.land/x/drip@0.0.16/preact/mod.ts",
    "preact/hooks": "https://deno.land/x/drip@0.0.16/preact/hooks.ts",
    "preact-render-to-string":
      "https://deno.land/x/drip@0.0.16/preact/render-to-string.ts",
  },
};

// if (useTwind) {
//   importMap.imports["@twind"] = "./utils/twind.ts";
//   importMap.imports["twind"] = "https://esm.sh/twind@0.16.17";
//   importMap.imports["twind/"] = "https://esm.sh/twind@0.16.17/";
// }
const IMPORT_MAP_JSON = JSON.stringify(importMap, null, 2) + "\n";
await Deno.writeTextFile(
  join(resolvedDirectory, "import_map.json"),
  IMPORT_MAP_JSON,
);

let ROUTES_INDEX_TSX = `/** @jsx h */
import { h } from "preact";\n`;
// if (useTwind) ROUTES_INDEX_TSX += `import { tw } from "@twind";\n`;
ROUTES_INDEX_TSX += `import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div>
      <p>
        Welcome to \`drip\`. Try updating this message in the ./routes/index.tsx
        file, and refresh.
      </p>
      <Counter start={3} />
    </div>
  );
}
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "routes", "index.tsx"),
  ROUTES_INDEX_TSX,
);

const COMPONENTS_BUTTON_TSX = `/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "drip/runtime.ts";
export function Button(props: h.JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
    />
  );
}
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "components", "Button.tsx"),
  COMPONENTS_BUTTON_TSX,
);

const ISLANDS_COUNTER_TSX = `/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface CounterProps {
  start: number;
}

export default function Counter(props: CounterProps) {
  const [count, setCount] = useState(props.start);
  return (
    <div>
      <p>{count}</p>
      <Button onClick={() => setCount(count - 1)}>-1</Button>
      <Button onClick={() => setCount(count + 1)}>+1</Button>
    </div>
  );
}
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "islands", "Counter.tsx"),
  ISLANDS_COUNTER_TSX,
);

const ROUTES_GREET_TSX = `/** @jsx h */
import { h } from "preact";
import { PageProps } from "drip/server.ts";

export default function Greet(props: PageProps) {
  return <div>Hello {props.params.name}</div>;
}
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "routes", "[name].tsx"),
  ROUTES_GREET_TSX,
);

const STATIC_LOGO =
  `<svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M34.092 8.845C38.929 20.652 34.092 27 30 30.5c1 3.5-2.986 4.222-4.5 2.5-4.457 1.537-13.512 1.487-20-5C2 24.5 4.73 16.714 14 11.5c8-4.5 16-7 20.092-2.655Z" fill="#FFDB1E"/>
  <path d="M14 11.5c6.848-4.497 15.025-6.38 18.368-3.47C37.5 12.5 21.5 22.612 15.5 25c-6.5 2.587-3 8.5-6.5 8.5-3 0-2.5-4-5.183-7.75C2.232 23.535 6.16 16.648 14 11.5Z" fill="#fff" stroke="#FFDB1E"/>
  <path d="M28.535 8.772c4.645 1.25-.365 5.695-4.303 8.536-3.732 2.692-6.606 4.21-7.923 4.83-.366.173-1.617-2.252-1.617-1 0 .417-.7 2.238-.934 2.326-1.365.512-4.223 1.29-5.835 1.29-3.491 0-1.923-4.754 3.014-9.122.892-.789 1.478-.645 2.283-.645-.537-.773-.534-.917.403-1.546C17.79 10.64 23 8.77 25.212 8.42c.366.014.82.35.82.629.41-.14 2.095-.388 2.503-.278Z" fill="#FFE600"/>
  <path d="M14.297 16.49c.985-.747 1.644-1.01 2.099-2.526.566.121.841-.08 1.29-.701.324.466 1.657.608 2.453.701-.715.451-1.057.852-1.452 2.106-1.464-.611-3.167-.302-4.39.42Z" fill="#fff"/>
</svg>`;
await Deno.writeTextFile(
  join(resolvedDirectory, "static", "logo.svg"),
  STATIC_LOGO,
);

try {
  const faviconArrayBuffer = await fetch("https://fresh.deno.dev/favicon.ico")
    .then((d) => d.arrayBuffer());
  await Deno.writeFile(
    join(resolvedDirectory, "static", "favicon.ico"),
    new Uint8Array(faviconArrayBuffer),
  );
} catch {
  // Skip this and be silent if there is a nework issue.
}

const MAIN_TS = `/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "drip/server.ts";
import manifest from "./fresh.gen.ts";
await start(manifest);
`;

// if (useTwind) {
//   MAIN_TS += `
// import { config, setup } from "@twind";
// import { virtualSheet } from "twind/sheets";

// const sheet = virtualSheet();
// sheet.reset();
// setup({ ...config, sheet });

// function render(ctx: RenderContext, render: InnerRenderFunction) {
//   const snapshot = ctx.state.get("twind") as unknown[] | null;
//   sheet.reset(snapshot || undefined);
//   render();
//   ctx.styles.splice(0, ctx.styles.length, ...(sheet).target);
//   const newSnapshot = sheet.reset();
//   ctx.state.set("twind", newSnapshot);
// }

// `;
// }

const MAIN_TS_PATH = join(resolvedDirectory, "main.ts");
await Deno.writeTextFile(MAIN_TS_PATH, MAIN_TS);

const DEV_TS = `#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { dev, supabase, tailwind } from "drip/dev.ts";

await dev(import.meta.url, "./main.ts", [
  supabase(),
  tailwind({
    input: "./styles/main.css",
    output: "./static/styles/main.css",
  }),
]);
`;
const DEV_TS_PATH = join(resolvedDirectory, "dev.ts");
await Deno.writeTextFile(DEV_TS_PATH, DEV_TS);
try {
  await Deno.chmod(DEV_TS_PATH, 0o777);
} catch {
  // this throws on windows
}

const config = {
  tasks: {
    start: "deno run -A --watch=static/,routes/ dev.ts",
  },
  importMap: "./import_map.json",
};
const DENO_CONFIG = JSON.stringify(config, null, 2) + "\n";

await Deno.writeTextFile(join(resolvedDirectory, "deno.json"), DENO_CONFIG);

const README_MD = `# drip project

### Usage

Start the project:

\`\`\`
deno task start
\`\`\`

This will watch the project directory and restart as necessary.
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "README.md"),
  README_MD,
);

const vscodeSettings = {
  "deno.enable": true,
  "deno.lint": true,
  "editor.defaultFormatter": "denoland.vscode-deno",
};

const VSCODE_SETTINGS = JSON.stringify(vscodeSettings, null, 2) + "\n";

if (useVSCode) {
  await Deno.writeTextFile(
    join(resolvedDirectory, ".vscode", "settings.json"),
    VSCODE_SETTINGS,
  );
}

const vscodeExtensions = {
  recommendations: ["denoland.vscode-deno"],
};

const VSCODE_EXTENSIONS = JSON.stringify(vscodeExtensions, null, 2) + "\n";

if (useVSCode) {
  await Deno.writeTextFile(
    join(resolvedDirectory, ".vscode", "extensions.json"),
    VSCODE_EXTENSIONS,
  );
}

const SUPABASE_CONFIG =
  `# A string used to distinguish different Supabase projects on the same host. Defaults to the working
# directory name when running \`supabase init\`.
project_id = "${basename(resolvedDirectory)}"

[api]
# Port to use for the API URL.
port = 54321
# Schemas to expose in your API. Tables, views and stored procedures in this schema will get API
# endpoints. public and storage are always included.
schemas = []
# Extra schemas to add to the search_path of every request.
extra_search_path = ["extensions"]
# The maximum number of rows returns from a view, table, or stored procedure. Limits payload size
# for accidental or malicious requests.
max_rows = 1000

[db]
# Port to use for the local database URL.
port = 54322
# The database major version to use. This has to be the same as your remote database's. Run \`SHOW
# server_version;\` on the remote database to check.
major_version = 14

[studio]
# Port to use for Supabase Studio.
port = 54323

# Email testing server. Emails sent with the local dev setup are not actually sent - rather, they
# are monitored, and you can view the emails that would have been sent from the web interface.
[inbucket]
# Port to use for the email testing server web interface.
port = 54324
smtp_port = 54325
pop3_port = 54326

[auth]
# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used
# in emails.
site_url = "http://localhost:8000"
# A list of *exact* URLs that auth providers are permitted to redirect to post authentication.
additional_redirect_urls = ["https://localhost:8000"]
# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 seconds (one
# week).
jwt_expiry = 3600
# Allow/disallow new user signups to your project.
enable_signup = true

[auth.email]
# Allow/disallow new user signups via email to your project.
enable_signup = true
# If enabled, a user will be required to confirm any email change on both the old, and new email
# addresses. If disabled, only the new email is required to confirm.
double_confirm_changes = true
# If enabled, users need to confirm their email address before signing in.
enable_confirmations = false

# Use an external OAuth provider. The full list of providers are: \`apple\`, \`azure\`, \`bitbucket\`,
# \`discord\`, \`facebook\`, \`github\`, \`gitlab\`, \`google\`, \`twitch\`, \`twitter\`, \`slack\`, \`spotify\`.
[auth.external.apple]
enabled = false
client_id = ""
secret = ""
`;
await Deno.writeTextFile(
  join(resolvedDirectory, "supabase", "config.toml"),
  SUPABASE_CONFIG,
);

const GITHUB_ACTION = `name: Deploy
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

      - name: Set Remote DB
        shell: bash
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
        run: supabase db remote set $SUPABASE_URL

      - name: Push Migrations
        run: supabase db push

      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Deploy to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: your-deno-deploy-project # the name of the project on Deno Deploy
          entrypoint: main.ts # the entrypoint to deploy
          import-map: import_map.json
`;
await Deno.writeTextFile(
  join(resolvedDirectory, ".github", "workflows", "deploy.yml"),
  GITHUB_ACTION,
);

const manifest = await collect(resolvedDirectory);
await generate(resolvedDirectory, manifest);

// Specifically print unresolvedDirectory, rather than resolvedDirectory in order to
// not leak personal info (e.g. `/Users/MyName`)
console.log("\n%cProject created!", "color: green; font-weight: bold");
console.log(`\nIn order to start the development server, run:\n`);
console.log(`$ cd ${unresolvedDirectory}`);
console.log("$ deno task start");
