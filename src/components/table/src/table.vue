<template>
  <div class="epx-table" :class="{ 'epx-table--border': border, 'epx-table--stripe': stripe }">
    <table class="epx-table__inner">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :style="getCellStyle(column)">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length">
        <tr v-for="(row, rowIndex) in data" :key="getRowKey(row, rowIndex)">
          <td v-for="column in columns" :key="column.key" :style="getCellStyle(column)">
            <slot :name="column.prop" :row="row" :index="rowIndex">
              {{ column.prop ? row[column.prop] : '' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!data.length" class="epx-table__empty">{{ emptyText }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { CSSProperties, VNode } from 'vue'

defineOptions({ name: 'LuTable' })

type TableRow = Record<string, unknown>
type TableColumn = {
  key: string
  prop?: string
  label?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<{
  data?: TableRow[]
  border?: boolean
  stripe?: boolean
  emptyText?: string
  rowKey?: string | ((row: TableRow) => string | number)
}>(), {
  data: () => [],
  emptyText: 'No Data'
})

const slots = useSlots()

const columns = computed(() => {
  const nodes = slots.default?.() || []
  return nodes.flatMap((node, index) => getColumnsFromNode(node, index))
})

function getColumnsFromNode(node: VNode, index: number): TableColumn[] {
  if (Array.isArray(node.children)) {
    return node.children.flatMap((child, childIndex) => getColumnsFromNode(child as VNode, childIndex))
  }
  const props = (node.props || {}) as Record<string, unknown>
  const prop = props.prop as string | undefined
  const label = props.label as string | undefined
  if (!prop && !label) return []
  return [{
    key: prop || `column-${index}`,
    prop,
    label,
    width: props.width as string | number | undefined,
    align: props.align as TableColumn['align']
  }]
}

function getCellStyle(column: TableColumn) {
  const style: CSSProperties = {}
  if (column.width !== undefined) style.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  if (column.align) style.textAlign = column.align
  return style
}

function getRowKey(row: TableRow, index: number) {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  if (typeof props.rowKey === 'string') return row[props.rowKey] as string | number
  return index
}
</script>
