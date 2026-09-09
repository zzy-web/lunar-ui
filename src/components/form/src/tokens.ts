import type { InjectionKey } from 'vue'

export type FormRule = {
  required?: boolean
  message?: string
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>
}

export type FormRules = Record<string, FormRule | FormRule[]>

export type FormItemContext = {
  prop?: string
  validate: () => Promise<boolean>
  clearValidate: () => void
}

export type FormContext = {
  model?: Record<string, unknown>
  rules?: FormRules
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('LuForm')
