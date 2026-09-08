import { defineConfig } from 'vitepress'

const socialLinks = [
  { icon: 'github', link: 'https://git.chatgpt-team.site/2365586c-3e98-4d23-82d3-e4b1956311b1/appgprj_6aa018a4d3f48191b8ef9129d5a72a76' }
] as const

export default defineConfig({
  title: 'Lunar UI',
  description: '一个受 Element Plus 启发的轻量 Vue 3 组件库。',
  base: '/lunar-ui/',
  outDir: '../dist',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Lunar UI',
      description: '一个受 Element Plus 启发的轻量 Vue 3 组件库。',
      themeConfig: {
        nav: [
          { text: '指南', link: '/' },
          { text: '组件', link: '/components/dialog' }
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '介绍', link: '/' }
            ]
          },
          {
            text: '组件',
            items: [
              { text: 'Dialog 对话框', link: '/components/dialog' }
            ]
          }
        ],
        socialLinks
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Lunar UI',
      description: 'A compact Vue 3 component library inspired by Element Plus.',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/' },
          { text: 'Components', link: '/en/components/dialog' }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Introduction', link: '/en/' }
            ]
          },
          {
            text: 'Components',
            items: [
              { text: 'Dialog', link: '/en/components/dialog' }
            ]
          }
        ],
        socialLinks
      }
    }
  }
})
