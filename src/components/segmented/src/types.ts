export type SegmentedValue = string | number | boolean
export interface SegmentedOption {
  value: SegmentedValue
  label: string
  disabled?: boolean
}
