export type StepStatus = 'wait' | 'process' | 'finish' | 'success' | 'error'
export interface StepItem {
  title: string
  description?: string
  status?: StepStatus
  icon?: string
  disabled?: boolean
}
