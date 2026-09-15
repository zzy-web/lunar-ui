import type { InjectionKey } from 'vue'
export type CollapseName = string | number
export type CollapseValue = CollapseName | CollapseName[] | null
export interface CollapseContext {
  readonly activeNames: CollapseName[]
  readonly disabled: boolean
  readonly pending: CollapseName | undefined
  readonly expandIconPosition: 'left' | 'right'
  toggle: (name: CollapseName, available: () => boolean) => Promise<void>
  invalidate: () => void
}
export const collapseKey: InjectionKey<CollapseContext> = Symbol('LuCollapse')
