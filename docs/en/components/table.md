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
      <lu-tag :type="row.status === 'Online' ? 'success' : 'info'" size="small">{{ row.status }}</lu-tag>
    </template>
  </lu-table>

  <template #source>

```vue
<template>
  <lu-table :data="users" border>
    <lu-table-column prop="name" label="Name" />
    <lu-table-column prop="status" label="Status" align="center" />

    <template #status="{ row }">
      <lu-tag :type="row.status === 'Online' ? 'success' : 'info'" size="small">
        {{ row.status }}
      </lu-tag>
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

## Compact layout

Override the cell padding to adjust density without changing the column API. Colors follow the active light or dark theme.

<DemoBlock source-label="View source">
  <lu-table :data="users" stripe style="--epx-table-cell-padding: 8px 12px" row-key="id">
    <lu-table-column prop="name" label="Name" />
    <lu-table-column prop="role" label="Role" />
    <lu-table-column prop="status" label="Status" align="center" />
  </lu-table>
  <template #source>

```vue
<lu-table :data="users" stripe style="--epx-table-cell-padding: 8px 12px" row-key="id">
  <lu-table-column prop="name" label="Name" />
  <lu-table-column prop="role" label="Role" />
  <lu-table-column prop="status" label="Status" align="center" />
</lu-table>
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

## Style variables

| Variable | Default | Description |
| --- | --- | --- |
| `--epx-table-cell-padding` | `14px 16px` | Cell padding; defaults to 12px 10px on narrow screens. |
| `--epx-table-header-bg` | `var(--epx-fill-color-light)` | Header background. |
| `--epx-table-row-hover-bg` | `var(--epx-color-primary-light-9)` | Hovered or keyboard-focused row background. |
| `--epx-table-stripe-bg` | `var(--epx-fill-color-lighter)` | Striped row background. |

## Sorting, selection and index columns

<DemoBlock source-label="View source">
  <lu-table :data="users" row-key="id" border :max-height="260" :default-sort="{ prop: 'id', order: 'descending' }">
    <lu-table-column type="selection" :selectable="row => row.id !== 2" />
    <lu-table-column type="index" label="#" />
    <lu-table-column prop="id" label="ID" sortable :width="80" />
    <lu-table-column prop="name" label="Name" sortable />
    <lu-table-column prop="role" label="Role" show-overflow-tooltip />
  </lu-table>
  <template #source>

```vue
<lu-table :data="users" row-key="id" border :max-height="260"
  :default-sort="{ prop: 'id', order: 'descending' }"
  @selection-change="rows => selectedRows = rows">
  <lu-table-column type="selection" :selectable="row => row.id !== 2" />
  <lu-table-column type="index" label="#" />
  <lu-table-column prop="id" label="ID" sortable :width="80" />
  <lu-table-column prop="name" label="Name" sortable />
  <lu-table-column prop="role" label="Role" show-overflow-tooltip />
</lu-table>
```

  </template>
</DemoBlock>

Sorting cycles through ascending, descending and unsorted without mutating `data`. Numbers sort numerically. Use `sortable="custom"` to emit sorting events for server-side sorting. Nested paths such as `profile.name` are supported.

## Column slots and formatting

Column `default` slots receive `{ row, column, index, $index }`; `header` receives `{ column }`. Column slots take precedence over table field slots, then `formatter`, then the raw value.

<DemoBlock source-label="View source">
  <lu-table :data="users" stripe>
    <lu-table-column prop="name" label="Name">
      <template #header>Member name</template>
      <template #default="{ row }"><strong>{{ row.name }}</strong></template>
    </lu-table-column>
    <lu-table-column prop="role" label="Role" :formatter="(row, column, value) => 'Role: ' + value" />
  </lu-table>
  <template #source>

```vue
<lu-table-column prop="name" label="Name">
  <template #header>Member name</template>
  <template #default="{ row }"><strong>{{ row.name }}</strong></template>
</lu-table-column>
<lu-table-column prop="role" label="Role"
  :formatter="(row, column, value) => 'Role: ' + value" />
```

  </template>
</DemoBlock>

## Additional API

### Current row and row styles

Click a row to make it current. Enable `highlight-current-row` to show its background. The current row is independent of checkbox selection; checkbox clicks do not change it.

<DemoBlock source-label="View source">
  <lu-table :data="users" row-key="id" highlight-current-row :current-row-key="1" size="small">
    <lu-table-column prop="id" label="ID" sortable align="right" header-align="center" :width="80" />
    <lu-table-column prop="name" label="Name" />
    <lu-table-column prop="status" label="Status" />
  </lu-table>
  <template #source>

```vue
<lu-table :data="users" row-key="id" highlight-current-row :current-row-key="1" size="small"
  @current-change="(row, oldRow) => console.log(row, oldRow)">
  <lu-table-column prop="id" label="ID" sortable align="right" header-align="center" :width="80" />
  <lu-table-column prop="name" label="Name" />
  <lu-table-column prop="status" label="Status" />
</lu-table>
```

  </template>
</DemoBlock>

- `size`: `small | default | large`, defaults to `default`. An inline `--epx-table-cell-padding` overrides the preset.
- `highlightCurrentRow`: defaults to `false`. Customize the background using `--epx-table-current-row-bg`.
- `currentRowKey`: `string | number | null`, requires `rowKey`. Applied initially and whenever the key changes; `null` clears the current row. Clicking can still change the current row.
- `rowClassName`: a class string or `({ row, rowIndex }) => string`.
- `rowStyle`: a style object or `({ row, rowIndex }) => CSSProperties`. Indices refer to displayed order. Stripe, hover and selection backgrounds take precedence over the row background.
- Column `headerAlign`: `left | center | right`, falls back to `align`.
- `current-change(row, oldRow)`: emitted when the current row object changes, including replacement with the same key. Removing the row clears it; no current row is represented by `null`.
- `setCurrentRow(row?)`: exposed method to set or clear the current row. With `rowKey`, rows are matched by key. Sorting preserves the current row; checkbox selection methods do not affect it.

### Sorting and selection

- Table `height` / `maxHeight`: numbers (px) or CSS lengths; the header stays visible when scrolling.
- Table `showHeader`: defaults to `true`.
- Table `defaultSort`: initial `{ prop, order }`, where order is `ascending`, `descending` or `null`.
- Column `type`: `default`, `selection` or `index`; selection and index columns default to 56px.
- Column `index`: starting number (default 1), or `(index) => number | string`.
- Column `sortable`: `boolean | 'custom'`, off by default; requires a `prop`.
- Column `sortMethod(a, b)`: numeric comparator; descending reverses its result.
- Column `selectable(row, index)`: whether a row can be selected; index refers to the original data.
- Column `formatter(row, column, value, index)`: formatted content, including VNodes.
- Column `showOverflowTooltip`: single-line ellipsis with the raw field value in a native title tooltip.
- Table `empty` slot: custom empty content, overriding `emptyText`.

Events: `sort-change({ prop, order })`, `selection-change(rows)`, `select(rows, row)`, `select-all(rows)`, and `row-click(row, index, event)`. Row-click indices refer to the displayed order; checkbox clicks do not trigger row-click.

Exposed methods: `sort(prop, order)`, `clearSort()`, `toggleRowSelection(row, selected?)`, `toggleAllSelection()`, `clearSelection()`, `getSelectionRows()`. Clearing sort restores input order. Selection methods respect `selectable`; toggling a row also emits `select`.

Use a unique, stable `row-key` to preserve selection when row objects are replaced. Rows removed from `data` are deselected; selection is not retained across pages. Without a row key, selection uses object identity. Select-all applies only to selectable rows.
