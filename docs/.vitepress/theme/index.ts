import DefaultTheme from 'vitepress/theme'
import DemoBlock from './components/DemoBlock.vue'
import { LuButton, LuCard, LuDialog, LuForm, LuFormItem, LuInput, LuTable, LuTableColumn, LuTour, LuCheckbox, LuSwitch, LuTag, LuCalendar } from '../../../src'
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
    app.component('LuForm', LuForm)
    app.component('LuFormItem', LuFormItem)
    app.component('LuTable', LuTable)
    app.component('LuTableColumn', LuTableColumn)
    app.component('LuTour', LuTour)
    app.component('LuCheckbox', LuCheckbox)
    app.component('LuSwitch', LuSwitch)
    app.component('LuTag', LuTag)
    app.component('LuCalendar', LuCalendar)
  }
}
