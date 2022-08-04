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
        text: "Introduction",
        items: [
          { text: "Why Drip?", link: "/why-drip" },
          { text: "Installation", link: "/installation" },
          { text: "Directory Structure", link: "/directory-structure" },
          { text: "Philosophy", link: "/philosophy" },
        ],
      },

      {
        text: "Your First App",
        items: [
          { text: "Frontend", link: "/frontend" },
          { text: "Database", link: "/database" },
          { text: "Session", link: "/session" },
          { text: "Authentication", link: "/auth" },
          { text: "Validation", link: "/validation" },
          { text: "Deploy", link: "/deploy" },
        ],
      },

      {
        text: "Advanced",
        items: [
          { text: "Typescript", link: "/typescript" },
        ],
      },
    ],
  },
};
