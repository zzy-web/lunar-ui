# Pagination

Control the current page with `v-model:current-page`. Use it with table slicing or server requests. Displayed pages are clamped to the valid range; external total changes do not emit events or rewrite the bound value.

<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

## Examples

<DemoBlock direction="column">
<lu-pagination prev-text="Previous" next-text="Next" page-label="Page" aria-label="Pagination" v-model:current-page="page" :total="200" :page-size="10" />
  <p>Page: {{ page }}</p>
  <lu-pagination prev-text="Previous" next-text="Next" page-label="Page" aria-label="Pagination" :current-page="5" :total="100" disabled size="small" />

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <lu-pagination prev-text="Previous" next-text="Next" page-label="Page" aria-label="Pagination" v-model:current-page="page" :total="200" :page-size="10" />
  <p>Page: {{ page }}</p>
  <lu-pagination prev-text="Previous" next-text="Next" page-label="Page" aria-label="Pagination" :current-page="5" :total="100" disabled size="small" />
</template>
```

</template>
</DemoBlock>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `currentPage` | `number` | `1` | Current page, starting at 1 |
| `total` | `number` | `0` | Total records; negative and non-finite values become 0, capped at Number.MAX_SAFE_INTEGER |
| `pageSize` | `number` | `10` | Records per page, floored to at least 1; non-finite values become 10 |
| `disabled` | `boolean` | `false` | Disable all navigation |
| `hideOnSinglePage` | `boolean` | `false` | Hide with one page, including empty data |
| `size` | `'large' / 'default' / 'small'` | `'default'` | Size |
| `ariaLabel` | `string` | `'分页'` | Accessible navigation name |
| `pageLabel` | `string` | `'第'` | Page button accessible label prefix |
| `prevText` | `string` | `'上一页'` | Previous button text |
| `nextText` | `string` | `'下一页'` | Next button text |

## Events

- `update:currentPage(value: number)`: emitted when a user selects a different valid page.
- `change(value: number)`: emitted alongside the model update.

## Usage notes

This component does not fetch or slice data. Empty datasets display page 1 with previous and next disabled. Native buttons support Tab focus and Enter / Space activation. Set `prev-text="Previous"`, `next-text="Next"`, `page-label="Page"` and `aria-label="Pagination"` for English labels.
