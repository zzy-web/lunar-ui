import type { App } from 'vue'
import { EpxButton, LuButton } from './components/button'
import { EpxCard, LuCard } from './components/card'
import { EpxDialog, LuDialog } from './components/dialog'
import { EpxForm, EpxFormItem, LuForm, LuFormItem } from './components/form'
import { EpxInput, LuInput } from './components/input'
import './styles/index.css'

const components = [LuButton, LuInput, LuCard, LuDialog, LuForm, LuFormItem]

export { EpxButton, EpxInput, EpxCard, EpxDialog, EpxForm, EpxFormItem, LuButton, LuInput, LuCard, LuDialog, LuForm, LuFormItem }
export * from './components/button'
export * from './components/input'
export * from './components/card'
export * from './components/dialog'
export * from './components/form'

export default {
  install(app: App) {
    components.forEach((component) => app.component(component.name!, component))
  }
}
