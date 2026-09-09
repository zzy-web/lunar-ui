import type { App } from 'vue'
import { EpxButton, LuButton } from './components/button'
import { EpxCard, LuCard } from './components/card'
import { EpxDialog, LuDialog } from './components/dialog'
import { EpxForm, EpxFormItem, LuForm, LuFormItem } from './components/form'
import { EpxInput, LuInput } from './components/input'
import { EpxTable, EpxTableColumn, LuTable, LuTableColumn } from './components/table'
import { EpxTour, LuTour } from './components/tour'
import { LuCheckbox } from './components/checkbox'
import { LuSwitch } from './components/switch'
import { LuTag } from './components/tag'
import { LuCalendar } from './components/calendar'
import './styles/index.css'

const components = [LuButton, LuInput, LuCard, LuDialog, LuForm, LuFormItem, LuTable, LuTableColumn, LuTour, LuCheckbox, LuSwitch, LuTag, LuCalendar]

export { EpxButton, EpxInput, EpxCard, EpxDialog, EpxForm, EpxFormItem, EpxTable, EpxTableColumn, EpxTour, LuButton, LuInput, LuCard, LuDialog, LuForm, LuFormItem, LuTable, LuTableColumn, LuTour }
export * from './components/button'
export * from './components/input'
export * from './components/card'
export * from './components/dialog'
export * from './components/form'
export * from './components/table'
export * from './components/tour'
export * from './components/checkbox'
export * from './components/switch'
export * from './components/tag'
export * from './components/calendar'

export default {
  install(app: App) {
    components.forEach((component) => app.component(component.name!, component))
  }
}
