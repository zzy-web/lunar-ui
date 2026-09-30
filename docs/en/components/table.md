# Table

`LuTable` displays structured data, and `LuTableColumn` declares columns. Use them as `<lu-table>` and `<lu-table-column>`.

<script setup>
import { ref } from 'vue'
const users = [
  { id: 1, name: 'Alice', role: 'Developer', status: 'Online' },
  { id: 2, name: 'Bob', role: 'Designer', status: 'Offline' },
  { id: 3, name: 'Carol', role: 'Product Manager', status: 'Online' }
]
const pagedUsers = Array.from({ length: 18 }, (_, index) => ({ id: index + 1, name: `User ${index + 1}`, score: (index * 17) % 100 }))
const currentPage = ref(1)
const pageSize = ref(5)
const loading = ref(false)
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

## Current row and row styles

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

## Built-in pagination and loading

Enable `pagination` to sort the complete `data` array before slicing it by `pageSize`. Use `v-model:current-page` to track the page. Changing page size or sorting returns to page one. `loading` adds a local overlay and temporarily disables selection and pagination.

<DemoBlock direction="column">
<div style="display:flex; flex-wrap:wrap; gap:8px">
  <lu-button size="small" @click="pageSize = pageSize === 5 ? 3 : 5">{{ pageSize }} rows per page (click to change)</lu-button>
  <lu-button size="small" @click="loading = !loading">{{ loading ? 'Finish loading' : 'Simulate loading' }}</lu-button>
</div>
<lu-table v-model:current-page="currentPage" :data="pagedUsers" row-key="id" pagination :page-size="pageSize" :loading="loading" loading-text="Fetching users…" pagination-prev-text="Previous" pagination-next-text="Next" pagination-page-label="Page" border stripe>
  <lu-table-column type="selection" />
  <lu-table-column type="index" label="#" />
  <lu-table-column prop="name" label="Name" sortable />
  <lu-table-column prop="score" label="Score" sortable />
</lu-table>
<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const users = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1, name: `User ${index + 1}`, score: (index * 17) % 100
}))
const currentPage = ref(1)
const pageSize = ref(5)
const loading = ref(false)
</script>

<template>
  <lu-button @click="pageSize = pageSize === 5 ? 3 : 5">{{ pageSize }} rows per page</lu-button>
  <lu-button @click="loading = !loading">{{ loading ? 'Finish loading' : 'Simulate loading' }}</lu-button>
  <lu-table v-model:current-page="currentPage" :data="users" row-key="id"
    pagination :page-size="pageSize" :loading="loading" loading-text="Fetching users…"
    pagination-prev-text="Previous" pagination-next-text="Next" pagination-page-label="Page" border stripe>
    <lu-table-column type="selection" />
    <lu-table-column type="index" label="#" />
    <lu-table-column prop="name" label="Name" sortable />
    <lu-table-column prop="score" label="Score" sortable />
  </lu-table>
</template>
```

</template>
</DemoBlock>

If the data shrinks, the page clamps to the last valid page and emits the page events. Select-all affects only the current page, while previously selected rows remain selected across pages. For server-fetched pages, turn off `pagination`, compose `LuPagination` separately, and manage total count and selection in your app.

## Table Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `Record<string, unknown>[]` | `[]` | Table rows. |
| `border` | `boolean` | `false` | Shows vertical borders. |
| `stripe` | `boolean` | `false` | Shows striped rows. |
| `emptyText` | `string` | `'No Data'` | Empty state text. |
| `rowKey` | `string \| ((row) => string \| number)` | `undefined` | Row key. |
| `height` | `string \| number` | `undefined` | numbers (px) or CSS lengths; the header stays visible when scrolling. |
| `maxHeight` | `string \| number` | `undefined` | numbers (px) or CSS lengths; the header stays visible when scrolling. |
| `showHeader` | `boolean` | `true` | defaults to `true`. |
| `defaultSort` | `{ prop: string; order: TableSortOrder }` | `undefined` | initial `{ prop, order }`, where order is `ascending`, `descending` or `null`. |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | `small \| default \| large`, defaults to `default`. An inline `--epx-table-cell-padding` overrides the preset. |
| `highlightCurrentRow` | `boolean` | `false` | defaults to `false`. Customize the background using `--epx-table-current-row-bg`. |
| `currentRowKey` | `string \| number \| null` | `undefined` | `string \| number \| null`, requires `rowKey`. Applied initially and whenever the key changes; `null` clears the current row. Clicking can still change the current row. |
| `rowClassName` | `string \| (({ row, rowIndex }) => string)` | `undefined` | a class string or `({ row, rowIndex }) => string`. |
| `rowStyle` | `CSSProperties \| (({ row, rowIndex }) => CSSProperties)` | `undefined` | a style object or `({ row, rowIndex }) => CSSProperties`. Indices refer to displayed order. Stripe, hover and selection backgrounds take precedence over the row background. |
| `pagination` | `boolean` | `false` | Paginate the full `data` array on the client. |
| `currentPage` | `number` | `1` | Current page; supports `v-model:current-page`. |
| `pageSize` | `number` | `10` | Rows per page, at least 1. |
| `paginationAriaLabel` | `string` | `'Table pages'` | Accessible name of the pagination navigation. |
| `paginationPrevText` / `paginationNextText` | `string` | `'上一页'` / `'下一页'` | Previous and next button labels. |
| `paginationPageLabel` | `string` | `'第'` | Accessible page button label prefix. |
| `hidePaginationOnSinglePage` | `boolean` | `false` | Hide pagination when there is only one page. |
| `loading` | `boolean` | `false` | Show an overlay and disable interactions. |
| `loadingText` | `string` | `'Loading…'` | Loading message. |

## TableColumn Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | `undefined` | Row field name. |
| `label` | `string` | `undefined` | Header text. |
| `width` | `string \| number` | `undefined` | Column width. |
| `align` | `'left' \| 'center' \| 'right'` | `undefined` | Alignment. |
| `headerAlign` | `'left' \| 'center' \| 'right'` | `align` | `left \| center \| right`, falls back to `align`. |
| `type` | `'default' \| 'selection' \| 'index'` | `'default'` | `default`, `selection` or `index`; selection and index columns default to 56px. |
| `index` | `number \| ((index: number) => number \| string)` | `1` | starting number (default 1), or `(index) => number \| string`. |
| `sortable` | `boolean \| 'custom'` | `false` | `boolean \| 'custom'`, off by default; requires a `prop`. |
| `sortMethod` | `(a, b) => number` | `undefined` | numeric comparator; descending reverses its result. |
| `selectable` | `(row, index) => boolean` | `undefined` | whether a row can be selected; index refers to the original data. |
| `formatter` | `(row, column, value, index) => VNodeChild` | `undefined` | formatted content, including VNodes. |
| `showOverflowTooltip` | `boolean` | `false` | single-line ellipsis with the raw field value in a native title tooltip. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Table column declarations. |
| `[prop]` | Custom cell slot named after the column `prop`, with `{ row, index }`. |
| `empty` | Custom empty state, overriding emptyText. |
| `TableColumn.default` | Custom cell: { row, column, index, $index }. |
| `TableColumn.header` | Custom column header: { column }. |

## Style variables

| Variable | Default | Description |
| --- | --- | --- |
| `--epx-table-cell-padding` | `14px 16px` | Cell padding; defaults to 12px 10px on narrow screens. |
| `--epx-table-header-bg` | `var(--epx-fill-color-light)` | Header background. |
| `--epx-table-row-hover-bg` | `var(--epx-color-primary-light-9)` | Hovered or keyboard-focused row background. |
| `--epx-table-stripe-bg` | `var(--epx-fill-color-lighter)` | Striped row background. |

## Events

| Event | Parameters | Description |
| --- | --- | --- |
| `sort-change` | `{ prop, order }` | Sorting changed. |
| `selection-change` | `rows` | Selection changed. |
| `select` | `rows, row` | A row check was toggled. |
| `select-all` | `rows` | Select-all was toggled. |
| `row-click` | `row, index, event` | Row clicked; index is display order. Checkbox clicks do not trigger it. |
| `current-change` | `row, oldRow` | Current row changed, including same-key replacement; null when cleared. |
| `update:currentPage` | `page` | Updates `v-model:current-page`. |
| `page-change` | `page` | Page changed or was corrected after data shrank. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `sort` | `(prop, order)` | Set sorting. |
| `clearSort` | `()` | Restore input order. |
| `toggleRowSelection` | `(row, selected?)` | Toggle a row check, respecting selectable; also emits select. |
| `toggleAllSelection` | `()` | Toggle all eligible rows. |
| `clearSelection` | `()` | Clear selection. |
| `getSelectionRows` | `() => TableRow[]` | Read selected rows. |
| `setCurrentRow` | `(row?)` | Set the current row, matching rowKey; omit to clear. |

Use a unique, stable `row-key` to preserve selection when row objects are replaced. Rows removed from `data` are deselected. Built-in pagination retains selection across pages. Without a row key, selection uses object identity. Select-all applies only to selectable rows on the current page.

## Usage tips

- Give columns clear headings and widths that fit their content.
- Keep row identity stable through sorting and filtering so selection stays attached to the right data.
