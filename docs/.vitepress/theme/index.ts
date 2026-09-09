import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoBlock from './components/DemoBlock.vue'
import ComponentOverview from './components/ComponentOverview.vue'
import LunarUI from '../../../src'
import './styles.css'
import './polish.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(LunarUI)
    app.component('DemoBlock', DemoBlock)
    app.component('ComponentOverview', ComponentOverview)
  }
} satisfies Theme
