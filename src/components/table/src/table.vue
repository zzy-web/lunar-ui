<template>
  <div class="epx-table" :class="[{ 'epx-table--border': border, 'epx-table--stripe': stripe, 'epx-table--scroll': height != null || maxHeight != null }, `epx-table--${size}`]" :style="{ height: toSize(height), maxHeight: toSize(maxHeight) }">
    <table class="epx-table__inner">
      <colgroup><col v-for="column in columns" :key="column.key" :style="{ width: toSize(column.width ?? (column.type === 'selection' || column.type === 'index' ? 56 : undefined)) }" /></colgroup>
      <thead v-if="showHeader">
        <tr>
          <th v-for="column in columns" :key="column.key" scope="col" :style="getCellStyle(column, true)" :aria-sort="column.sortable ? (sortState.prop === column.prop && sortState.order ? sortState.order : 'none') : undefined">
            <input v-if="column.type === 'selection'" type="checkbox" aria-label="Select all rows" :checked="allSelected(column)" :indeterminate="someSelected(column)" :disabled="!eligibleRows(column).length" @change="toggleAllSelection(column)" />
            <button v-else-if="column.sortable" type="button" class="epx-table__sort" @click="cycleSort(column)">
              <CellContent :column="column" :header="true" /><span aria-hidden="true">{{ sortState.prop === column.prop && sortState.order ? (sortState.order === 'ascending' ? '↑' : '↓') : '↕' }}</span>
            </button>
            <CellContent v-else :column="column" :header="true" />
          </th>
        </tr>
      </thead>
      <tbody v-if="displayData.length">
        <tr v-for="(row, rowIndex) in displayData" :key="rowKey ? getRowKey(row) as string | number : data.indexOf(row)" :class="[{ 'is-selected': isSelected(row), 'is-current': highlightCurrentRow && currentRow === row }, typeof rowClassName === 'function' ? rowClassName({ row, rowIndex }) : rowClassName]" :style="typeof rowStyle === 'function' ? rowStyle({ row, rowIndex }) : rowStyle" @click="handleRowClick(row, rowIndex, $event)">
          <td v-for="column in columns" :key="column.key" :style="getCellStyle(column)">
            <input v-if="column.type === 'selection'" type="checkbox" :aria-label="`Select row ${rowIndex + 1}`" :checked="isSelected(row)" :disabled="!canSelect(row, column)" @click.stop @change="toggleRowSelection(row, undefined, column)" />
            <span v-else-if="column.type === 'index'">{{ typeof column.index === 'function' ? column.index(rowIndex) : rowIndex + (column.index ?? 1) }}</span>
            <div v-else :class="{ 'epx-table__overflow': column.showOverflowTooltip }" :title="column.showOverflowTooltip ? String(getTableValue(row, column.prop) ?? '') : undefined">
              <CellContent :column="column" :row="row" :index="rowIndex" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!data.length" class="epx-table__empty"><slot name="empty">{{ emptyText }}</slot></div>
  </div>
</template>

<script setup lang="ts">
import { toRef, Fragment, isVNode, ref, shallowRef, useSlots, watch } from 'vue'
import type { CSSProperties, Slots, VNode, VNodeChild } from 'vue'
import TableColumnComponent from './table-column.vue'
import { getTableValue } from './types'
import type { TableColumnProps, TableRow, TableSortOrder, TableRowClassName, TableRowStyle } from './types'

defineOptions({ name: 'LuTable' })
type Column = TableColumnProps & { key: string; slots?: Slots }
const props = withDefaults(defineProps<{
  data?: TableRow[]
  border?: boolean
  stripe?: boolean
  emptyText?: string
  rowKey?: string | ((row: TableRow) => string | number)
  height?: string | number
  maxHeight?: string | number
  showHeader?: boolean
  defaultSort?: { prop: string; order: TableSortOrder }
  size?: 'small' | 'default' | 'large'
  highlightCurrentRow?: boolean
  currentRowKey?: string | number | null
  rowClassName?: TableRowClassName
  rowStyle?: TableRowStyle
}>(), { data: () => [], emptyText: 'No Data', showHeader: true, size: 'default' })
const emit = defineEmits<{
  'sort-change': [value: { prop: string | undefined; order: TableSortOrder }]
  'selection-change': [selection: TableRow[]]
  'select': [selection: TableRow[], row: TableRow]
  'select-all': [selection: TableRow[]]
  'row-click': [row: TableRow, index: number, event: MouseEvent]
  'current-change': [currentRow: TableRow | null, oldCurrentRow: TableRow | null]
}>()
const slots = useSlots()
// Read declaration slots during render, so reactive v-if/v-for columns stay current.
function readColumns(nodes: VNode[], prefix = ''): Column[] {
  return nodes.flatMap((node, index) => {
    if (!isVNode(node)) return []
    const key = `${prefix}${String(node.key ?? index)}`
    if (node.type === Fragment) return readColumns(node.children as VNode[], `${key}-`)
    if (node.type !== TableColumnComponent) return []
    const raw = node.props || {}
    const column = Object.fromEntries(Object.entries(raw).map(([name, value]) => [name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), value])) as Column
    return [{ ...column, sortable: raw.sortable === '' ? true : column.sortable, showOverflowTooltip: (raw.showOverflowTooltip ?? raw['show-overflow-tooltip']) === '' ? true : column.showOverflowTooltip, key, slots: node.children as Slots | undefined }]
  })
}
// A getter avoids caching slot output independently of its parent render.
const columns = toRef(() => readColumns(slots.default?.() || []))
const sortState = ref<{ prop: string | undefined; order: TableSortOrder }>({ prop: props.defaultSort?.prop, order: props.defaultSort?.order ?? null })
const selectedKeys = ref(new Set<unknown>())
const currentRow = shallowRef<TableRow | null>(null)
function setCurrentRow(row?: TableRow | null) {
  const next = row == null ? null : props.data.find(candidate => getRowKey(candidate) === getRowKey(row)) ?? null
  const previous = currentRow.value
  if (next === previous) return
  currentRow.value = next
  emit('current-change', next, previous)
}
function handleRowClick(row: TableRow, index: number, event: MouseEvent) {
  setCurrentRow(row)
  emit('row-click', row, index, event)
}
watch(() => props.currentRowKey, key => {
  setCurrentRow(key != null && props.rowKey ? props.data.find(row => getRowKey(row) === key) : null)
}, { immediate: true })
watch(() => props.data.map(getRowKey), () => {
  if (currentRow.value) setCurrentRow(currentRow.value)
  else if (props.currentRowKey != null && props.rowKey) {
    setCurrentRow(props.data.find(row => getRowKey(row) === props.currentRowKey))
  }
})
function getRowKey(row: TableRow) {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  return props.rowKey ? getTableValue(row, props.rowKey) as string | number : row
}
function isSelected(row: TableRow) { return selectedKeys.value.has(getRowKey(row)) }
function getSelectionRows() { return props.data.filter(isSelected) }
function canSelect(row: TableRow, column?: Column) { return column?.selectable?.(row, props.data.indexOf(row)) ?? true }
function eligibleRows(column: Column) { return props.data.filter(row => canSelect(row, column)) }
function allSelected(column: Column) { const rows = eligibleRows(column); return rows.length > 0 && rows.every(isSelected) }
function someSelected(column: Column) { return !allSelected(column) && eligibleRows(column).some(isSelected) }
function selectionChanged() { emit('selection-change', getSelectionRows()) }
function toggleRowSelection(row: TableRow, selected?: boolean, column = columns.value.find(c => c.type === 'selection')) {
  if (!props.data.includes(row) || !canSelect(row, column)) return
  const next = selected ?? !isSelected(row)
  if (next === isSelected(row)) return
  if (next) selectedKeys.value.add(getRowKey(row))
  else selectedKeys.value.delete(getRowKey(row))
  selectionChanged()
  emit('select', getSelectionRows(), row)
}
function clearSelection() {
  if (!selectedKeys.value.size) return
  selectedKeys.value.clear()
  selectionChanged()
}
function toggleAllSelection(column = columns.value.find(c => c.type === 'selection')) {
  if (!column) return
  const selected = !allSelected(column)
  eligibleRows(column).forEach(row => {
    if (selected) selectedKeys.value.add(getRowKey(row))
    else selectedKeys.value.delete(getRowKey(row))
  })
  selectionChanged()
  emit('select-all', getSelectionRows())
}
watch(() => props.data.map(getRowKey), keys => {
  const valid = new Set<unknown>(keys)
  const retained = new Set([...selectedKeys.value].filter(key => valid.has(key)))
  if (retained.size !== selectedKeys.value.size) { selectedKeys.value = retained; selectionChanged() }
})
function sort(prop: string, order: TableSortOrder) {
  sortState.value = { prop, order }
  emit('sort-change', { ...sortState.value })
}
function clearSort() { sortState.value = { prop: undefined, order: null }; emit('sort-change', { ...sortState.value }) }
function cycleSort(column: Column) {
  if (!column.prop) return
  const order = sortState.value.prop === column.prop ? sortState.value.order : null
  sort(column.prop, order === null ? 'ascending' : order === 'ascending' ? 'descending' : null)
}
function sortedData(): TableRow[] {
  const { prop, order } = sortState.value
  const column = columns.value.find(c => c.prop === prop)
  if (!order || !column?.sortable || column.sortable === 'custom') return props.data
  return [...props.data].sort((a, b) => {
    const left = getTableValue(a, prop), right = getTableValue(b, prop)
    const result = column.sortMethod ? column.sortMethod(a, b) : left == null ? (right == null ? 0 : 1) : right == null ? -1 : typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right), undefined, { numeric: true })
    return order === 'ascending' ? result : -result
  })
}
const displayData = toRef(sortedData)
function toSize(value?: string | number) { return typeof value === 'number' || (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value)) ? `${value}px` : value }
function getCellStyle(column: Column, header = false): CSSProperties { return { textAlign: header ? column.headerAlign ?? column.align : column.align } }
function CellContent({ column, row, index = 0, header = false }: { column: Column; row?: TableRow; index?: number; header?: boolean }): VNodeChild {
  if (header) return column.slots?.header?.({ column }) ?? column.label
  if (!row) return ''
  const scope = { row, column, index, $index: index }
  return column.slots?.default?.(scope) ?? (column.prop ? slots[column.prop]?.(scope) : undefined) ?? column.formatter?.(row, column, getTableValue(row, column.prop), index) ?? String(getTableValue(row, column.prop) ?? '')
}
defineExpose({ clearSelection, toggleRowSelection, toggleAllSelection, getSelectionRows, sort, clearSort, setCurrentRow })
</script>
