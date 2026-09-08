import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Lunar UI',
  description: 'A compact Vue 3 component library inspired by Element Plus.',
  base: '/lunar-ui/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'Components', link: '/components/dialog' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'Dialog', link: '/components/dialog' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://git.chatgpt-team.site/2365586c-3e98-4d23-82d3-e4b1956311b1/appgprj_6aa018a4d3f48191b8ef9129d5a72a76' }
    ]
  }
})
