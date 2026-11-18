export type DateRange = [Date, Date]
export type DatePickerValue = Date | DateRange | null
export interface DatePickerShortcut {
  label: string
  value: () => Date | DateRange
}
