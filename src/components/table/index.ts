import Table from './src/table.vue'
import TableColumn from './src/table-column.vue'

export const EpxTable: typeof Table = Table
export const EpxTableColumn: typeof TableColumn = TableColumn
export const LuTable: typeof Table = Table
export const LuTableColumn: typeof TableColumn = TableColumn
export default LuTable
export type { TableRow, TableColumnProps, TableSortOrder, TableRowScope, TableRowClassName, TableRowStyle } from './src/types'
