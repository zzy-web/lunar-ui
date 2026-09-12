import type { CSSProperties, VNodeChild } from 'vue'

export type TableRow = Record<string, unknown>
export type TableSortOrder = 'ascending' | 'descending' | null
export interface TableRowScope { row: TableRow; rowIndex: number }
export type TableRowClassName = string | ((scope: TableRowScope) => string)
export type TableRowStyle = CSSProperties | ((scope: TableRowScope) => CSSProperties)
export interface TableColumnProps {
  prop?: string
  label?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  type?: 'default' | 'selection' | 'index'
  index?: number | ((index: number) => number | string)
  sortable?: boolean | 'custom'
  sortMethod?: (a: TableRow, b: TableRow) => number
  formatter?: (row: TableRow, column: TableColumnProps, value: unknown, index: number) => VNodeChild
  selectable?: (row: TableRow, index: number) => boolean
  showOverflowTooltip?: boolean
}

export function getTableValue(row: TableRow, prop?: string): unknown {
  return prop?.split('.').reduce<unknown>((value, key) =>
    value != null && typeof value === 'object' ? (value as TableRow)[key] : undefined, row)
}
