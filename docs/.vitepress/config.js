export default {
  title: "Drip",
  description: "Dripping hot fullstack framework",
  themeConfig: {
    nav: [
      // { text: "Get Started", link: "/get-started" },
      // { text: "Changelog", link: "https://github.com/..." },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Why Drip?", link: "/guide/why-drip" },
          { text: "Installation", link: "/guide/installation" },
          { text: "Directory Structure", link: "/guide/directory-structure" },
          { text: "Philosophy", link: "/guide/philosophy" },
        ],
      },

      {
        text: "Routes",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "Introduction", link: "/routes/introduction" },
        ],
      },

      {
        text: "Database",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "Introduction", link: "/database/introduction" },
        ],
      },

      {
        text: "Session",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "Introduction", link: "/session/introduction" },
        ],
      },

      {
        text: "Authentication",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "Introduction", link: "/auth/introduction" },
          { text: "Starter Kit", link: "/auth/starter-kit" },
        ],
      },

      {
        text: "Forms",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "Introduction", link: "/forms/introduction" },
          { text: "Plain HTML Form", link: "/forms/html-form" },
          { text: "Drip Form", link: "/forms/drip-form" },
        ],
      },

      {
        text: "Validation",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "Introduction", link: "/validation/introduction" },
          {
            text: "Client-side Validation",
            link: "/validation/client-side-validation",
          },
        ],
      },

      {
        text: "Deploy",
        collapsible: true,
        collapsed: true,
        items: [
          { text: "Deno Deploy", link: "/deploy/deno-deploy" },
          { text: "Supabase", link: "/deploy/supabase" },
        ],
      },

      {
        text: "Advanced",
        items: [
          { text: "Stores", link: "/advanced/stores" },
          { text: "Typescript", link: "/advanced/typescript" },
        ],
      },

      {
        text: "Screencasts",
        items: [
          { text: "Link Redirector", link: "/screencasts/link-redirector" },
          {
            text: "Charge with Stripe",
            link: "/screencasts/charge-with-stripe",
          },
        ],
      },
    ],
  },
};
