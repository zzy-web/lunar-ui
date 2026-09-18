import type { InjectionKey } from 'vue'

export type CheckboxValue = string | number | boolean

export interface CheckboxGroupContext {
  modelValue: readonly CheckboxValue[]
  size: 'large' | 'default' | 'small'
  name?: string
  isDisabled: (value: CheckboxValue | undefined) => boolean
  change: (value: CheckboxValue, checked: boolean) => boolean
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('LuCheckboxGroup')
