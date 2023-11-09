import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Eiradir Development Guide",
      social: {
        github: "https://github.com/withastro/starlight",
        discord: "https://discord.gg/BsDu2JB",
      },
      logo: {
        src: "./src/assets/icon.png",
      },
	  favicon: '/favicon.png',
      editLink: {
        baseUrl: "https://github.com/Eiradir/eiradir-docs/edit/main/",
      },
      sidebar: [
        {
          label: "First Steps",
          autogenerate: { directory: "first-steps" },
        },
        {
          label: "Core Concepts",
          autogenerate: { directory: "core-concepts" },
        },
        {
          label: "Adding Content",
          autogenerate: { directory: "guides" },
        },
      ],
    }),
  ],
});
