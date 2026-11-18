export type CascaderValue = string | number
export interface CascaderOption {
  value: CascaderValue
  label: string
  disabled?: boolean
  children?: readonly CascaderOption[]
}
