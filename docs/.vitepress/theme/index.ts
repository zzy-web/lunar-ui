import DefaultTheme from 'vitepress/theme'
import DemoBlock from './components/DemoBlock.vue'
import { LuButton, LuCard, LuDialog, LuInput } from '../../../src'
import '../../../src/styles/index.css'
import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoBlock', DemoBlock)
    app.component('LuButton', LuButton)
    app.component('LuInput', LuInput)
    app.component('LuCard', LuCard)
    app.component('LuDialog', LuDialog)
  }
}
