import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Tracium',
  description: 'Execution Intelligence Infrastructure',
  head: [
    ['meta', { name: 'theme-color', content: '#e76f51' }],
  ],

  themeConfig: {
    logo: undefined,
    siteTitle: 'Tracium',

    nav: [
      { text: 'Guide', link: '/guide/what-is-tracium' },
      { text: 'Engine', link: '/engine/overview' },
      { text: 'API', link: '/api/rest-api' },
      { text: 'Ecosystem', link: '/ecosystem/products' },
      {
        text: 'v0.1.0',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Roadmap', link: '/guide/roadmap' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Tracium?', link: '/guide/what-is-tracium' },
            { text: 'Why Tracium?', link: '/guide/why-tracium' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Execution as Data', link: '/guide/execution-as-data' },
            { text: 'UEF: Universal Execution Format', link: '/guide/uef' },
            { text: 'State Timeline', link: '/guide/state-timeline' },
            { text: 'Recording Modes', link: '/guide/recording-modes' },
          ],
        },
        {
          text: 'Going Deeper',
          items: [
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Roadmap', link: '/guide/roadmap' },
          ],
        },
      ],

      '/engine/': [
        {
          text: 'Tracium Engine',
          items: [
            { text: 'Overview', link: '/engine/overview' },
            { text: 'How It Works', link: '/engine/how-it-works' },
            { text: 'JDI Adapter', link: '/engine/jdi-adapter' },
            { text: 'State Engine', link: '/engine/state-engine' },
            { text: 'Configuration', link: '/engine/configuration' },
          ],
        },
      ],

      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'REST API', link: '/api/rest-api' },
            { text: 'UEF Schema', link: '/api/uef-schema' },
            { text: 'Error Codes', link: '/api/errors' },
          ],
        },
      ],

      '/ecosystem/': [
        {
          text: 'Ecosystem',
          items: [
            { text: 'Products', link: '/ecosystem/products' },
            { text: 'Nerva (Orchestration)', link: '/ecosystem/nerva' },
            { text: 'Prism (Visualization)', link: '/ecosystem/prism' },
            { text: 'Atlas (Repo Analyzer)', link: '/ecosystem/atlas' },
            { text: 'Vector (SDK)', link: '/ecosystem/vector' },
            { text: 'Pulse (IDE Plugin)', link: '/ecosystem/pulse' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/traciumio' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Execution Intelligence Infrastructure',
      copyright: 'Tracium',
    },
  },
})
