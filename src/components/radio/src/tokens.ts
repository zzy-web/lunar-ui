import type { InjectionKey } from 'vue'
export type RadioValue = string | number | boolean
export interface RadioGroupContext {
  modelValue?: RadioValue
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  name: string
  change: (value: RadioValue) => void
}
export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('LuRadioGroup')
