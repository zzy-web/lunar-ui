import type { InjectionKey } from 'vue'

export type FormRule = {
  required?: boolean
  trigger?: 'blur' | 'change' | ('blur' | 'change')[]
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  message?: string
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>
}

export type FormRules = Record<string, FormRule | FormRule[]>

export type FormItemContext = {
  prop?: string
  validate: (trigger?: 'blur' | 'change') => Promise<boolean>
  clearValidate: () => void
  resetField: () => Promise<void>
}

export type FormContext = {
  model?: Record<string, unknown>
  rules?: FormRules
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('LuForm')
