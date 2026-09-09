# Table

`LuTable` displays structured data, and `LuTableColumn` declares columns. Use them as `<lu-table>` and `<lu-table-column>`.

<script setup>
const users = [
  { id: 1, name: 'Alice', role: 'Developer', status: 'Online' },
  { id: 2, name: 'Bob', role: 'Designer', status: 'Offline' },
  { id: 3, name: 'Carol', role: 'Product Manager', status: 'Online' }
]
</script>

## Basic Usage

Pass rows with `data`, and declare columns with `lu-table-column`.

<DemoBlock source-label="View source">
  <lu-table :data="users">
    <lu-table-column prop="name" label="Name" />
    <lu-table-column prop="role" label="Role" />
    <lu-table-column prop="status" label="Status" />
  </lu-table>

  <template #source>

```vue
<script setup lang="ts">
const users = [
  { id: 1, name: 'Alice', role: 'Developer', status: 'Online' },
  { id: 2, name: 'Bob', role: 'Designer', status: 'Offline' }
]
</script>

<template>
  <lu-table :data="users">
    <lu-table-column prop="name" label="Name" />
    <lu-table-column prop="role" label="Role" />
    <lu-table-column prop="status" label="Status" />
  </lu-table>
</template>
```

  </template>
</DemoBlock>

## Border And Stripe

Use `border` for vertical borders and `stripe` for striped rows.

<DemoBlock source-label="View source">
  <lu-table :data="users" border stripe row-key="id">
    <lu-table-column prop="name" label="Name" width="120px" />
    <lu-table-column prop="role" label="Role" />
    <lu-table-column prop="status" label="Status" align="center" />
  </lu-table>

  <template #source>

```vue
<template>
  <lu-table :data="users" border stripe row-key="id">
    <lu-table-column prop="name" label="Name" width="120px" />
    <lu-table-column prop="role" label="Role" />
    <lu-table-column prop="status" label="Status" align="center" />
  </lu-table>
</template>
```

  </template>
</DemoBlock>

## Custom Cells

Use a slot with the same name as `prop` to customize cell content.

<DemoBlock source-label="View source">
  <lu-table :data="users" border>
    <lu-table-column prop="name" label="Name" />
    <lu-table-column prop="status" label="Status" align="center" />
    <template #status="{ row }">
      <span :style="{ color: row.status === 'Online' ? '#67c23a' : '#909399' }">{{ row.status }}</span>
    </template>
  </lu-table>

  <template #source>

```vue
<template>
  <lu-table :data="users" border>
    <lu-table-column prop="name" label="Name" />
    <lu-table-column prop="status" label="Status" align="center" />

    <template #status="{ row }">
      <span :style="{ color: row.status === 'Online' ? '#67c23a' : '#909399' }">
        {{ row.status }}
      </span>
    </template>
  </lu-table>
</template>
```

  </template>
</DemoBlock>

## Empty State

When `data` is empty, the table shows `empty-text`.

<DemoBlock source-label="View source">
  <lu-table :data="[]" empty-text="No records">
    <lu-table-column prop="name" label="Name" />
    <lu-table-column prop="role" label="Role" />
  </lu-table>

  <template #source>

```vue
<template>
  <lu-table :data="[]" empty-text="No records">
    <lu-table-column prop="name" label="Name" />
    <lu-table-column prop="role" label="Role" />
  </lu-table>
</template>
```

  </template>
</DemoBlock>

## Table Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `Record<string, unknown>[]` | `[]` | Table rows. |
| `border` | `boolean` | `false` | Shows vertical borders. |
| `stripe` | `boolean` | `false` | Shows striped rows. |
| `emptyText` | `string` | `'No Data'` | Empty state text. |
| `rowKey` | `string \| ((row) => string \| number)` | `undefined` | Row key. |

## TableColumn Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | `undefined` | Row field name. |
| `label` | `string` | `undefined` | Header text. |
| `width` | `string \| number` | `undefined` | Column width. |
| `align` | `'left' \| 'center' \| 'right'` | `undefined` | Alignment. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Table column declarations. |
| `[prop]` | Custom cell slot named after the column `prop`, with `{ row, index }`. |
