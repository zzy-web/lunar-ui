import { defineConfig } from 'vitepress'
import { componentGroups } from './components'

const socialLinks = [{ icon: 'github', link: 'https://github.com/zzy-web/lunar-ui' }] as const
function theme(en: boolean) {
  const prefix = en ? '/en' : ''
  return {
    nav: [
      { text: en ? 'Guide' : '指南', link: `${prefix}/guide/quick-start` },
      { text: en ? 'Components' : '组件', link: `${prefix}/components/` },
      { text: '0.1.0', link: 'https://github.com/zzy-web/lunar-ui' }
    ],
    sidebar: [
      { text: en ? 'Get started' : '开始使用', items: [
        { text: en ? 'Introduction' : '介绍', link: `${prefix}/` },
        { text: en ? 'Quick start' : '快速开始', link: `${prefix}/guide/quick-start` },
        { text: en ? 'Theming' : '主题定制', link: `${prefix}/guide/theming` },
        { text: en ? 'All components' : '组件总览', link: `${prefix}/components/` }
      ] },
      ...componentGroups.map(group => ({
        text: en ? group.en : group.zh,
        collapsed: false,
        items: group.items.map(item => ({ text: en ? item.name : `${item.name} ${item.zh}`, link: `${prefix}/components/${item.slug}` }))
      }))
    ],
    outline: { label: en ? 'On this page' : '本页目录', level: [2, 3] as [number, number] },
    docFooter: { prev: en ? 'Previous' : '上一页', next: en ? 'Next' : '下一页' },
    lastUpdated: { text: en ? 'Last updated' : '最后更新' },
    darkModeSwitchLabel: en ? 'Appearance' : '外观',
    sidebarMenuLabel: en ? 'Menu' : '菜单',
    returnToTopLabel: en ? 'Back to top' : '返回顶部',
    socialLinks
  }
}
export default defineConfig({
  title: 'Lunar UI',
  description: '轻量、易用、支持主题定制的 Vue 3 组件库。',
  base: '/lunar-ui/',
  outDir: '.vitepress/dist',
  lastUpdated: true,
  markdown: {
    config(md) {
      // Keep scrolling on a wrapper so the table itself can fill the article width.
      md.renderer.rules.table_open = () => '<div class="lu-api-table" tabindex="0"><table>\n'
      md.renderer.rules.table_close = () => '</table></div>\n'
    }
  },
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: { root: { translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: { noResultsText: '没有找到相关结果', resetButtonTitle: '清除搜索', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } }
        } } }
      }
    }
  },
  locales: {
    root: { label: '简体中文', lang: 'zh-CN', themeConfig: theme(false) },
    en: { label: 'English', lang: 'en-US', description: 'A lightweight, themeable Vue 3 component library.', themeConfig: theme(true) }
  }
})
