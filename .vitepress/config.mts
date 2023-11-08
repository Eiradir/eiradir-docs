import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Eiradir Development Guide",
  description: "Documentation and guides for Eiradir developers.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/setup' }
    ],

    sidebar: [
      {
        text: 'First Steps',
        items: [
          { text: 'Getting Started', link: '/setup' },
          { text: 'How to Contribute', link: '/CONTRIBUTING' }
        ]
      },
      {
        text: 'Core Knowledge',
        items: [
          { text: 'Server Plugins', link: '/server-plugins' },
        ]
      },
      {
        text: 'Adding Content',
        items: [
          { text: 'Items', link: '/items' },
          { text: 'Clothing', link: '/clothing' },
          { text: 'Visual Traits', link: '/vists' },
          { text: 'Tiles', link: '/tiles' },
          { text: 'Interactions', link: '/interactions' },
          { text: 'Processes', link: '/processes' },
          { text: 'HUDs', link: '/huds' },
          { text: 'Tooltips', link: '/tooltips' },
          { text: 'Menus', link: '/menus' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Eiradir/eiradir-docs' },
      { icon: 'discord', link: 'https://discord.gg/BsDu2JB'}
    ]
  }
})
