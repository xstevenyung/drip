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
        text: "Getting Started",
        items: [
          { text: "Why Drip?", link: "/guide/why-drip" },
          { text: "Installation", link: "/guide/installation" },
          { text: "Directory Structure", link: "/guide/directory-structure" },
          { text: "Philosophy", link: "/guide/philosophy" },
        ],
      },

      {
        text: "Guide",
        items: [
          { text: "Routes", link: "/routes" },
          { text: "Database", link: "/database" },
          { text: "Session", link: "/session" },
          { text: "Authentication", link: "/authentication" },
          { text: "Forms", link: "/forms" },
          { text: "Validation", link: "/validation" },
          { text: "Deploy", link: "/deploy" },
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
