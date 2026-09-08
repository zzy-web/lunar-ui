import type { App } from 'vue'
import { EpxButton } from './components/button'
import { EpxCard } from './components/card'
import { EpxDialog } from './components/dialog'
import { EpxInput } from './components/input'
import './styles/index.css'

const components = [EpxButton, EpxInput, EpxCard, EpxDialog]

export { EpxButton, EpxInput, EpxCard, EpxDialog }
export * from './components/button'
export * from './components/input'
export * from './components/card'
export * from './components/dialog'

export default {
  install(app: App) {
    components.forEach((component) => app.component(component.name!, component))
  }
}
