export type SelectValue = string | number
export interface SelectOption {
  label: string
  value: SelectValue
  group?: string
  disabled?: boolean
}
