# VirtualList

Render only visible rows plus a buffer. Fixed-height mode clips overflowing content. Enable `dynamic` for wrapping text, images and expandable content.

<script setup>
import { ref } from 'vue'
const list = ref()
const items = Array.from({ length: 10000 }, (_, id) => ({ id, name: `Record ${id + 1}` }))
const expanded = ref({})
const stories = Array.from({ length: 1000 }, (_, id) => ({ id, text: 'A record that wraps with the available width. '.repeat(id % 4 + 1) }))
const picture = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160"><rect width="480" height="160" fill="#409eff"/><circle cx="360" cy="50" r="30" fill="white"/></svg>')
</script>


## Ten thousand rows

<DemoBlock direction="column">
<lu-button @click="list?.scrollToIndex(4999, 'center')">Go to row 5000</lu-button>
<lu-virtual-list ref="list" :items="items" item-key="id" :height="280" :item-height="44" label="Records">
  <template #default="{ item }"><div style="padding: 10px 16px">{{ item.name }}</div></template>
</lu-virtual-list>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const list = ref()
const items = Array.from({ length: 10000 }, (_, id) => ({ id, name: `Record ${id + 1}` }))
</script>

<template>
  <lu-button @click="list?.scrollToIndex(4999, 'center')">Go to row 5000</lu-button>
  <lu-virtual-list ref="list" :items="items" item-key="id" :height="280" :item-height="44" label="Records">
    <template #default="{ item }"><div style="padding: 10px 16px">{{ item.name }}</div></template>
  </lu-virtual-list>
</template>
```

</template>
</DemoBlock>


## Dynamic heights

<DemoBlock direction="column">
<lu-virtual-list :items="stories" item-key="id" dynamic :item-height="120" :height="360" label="Dynamic records">
  <template #default="{ item }">
    <article style="padding: 16px; border-bottom: 1px solid var(--epx-border-color-light)">
      <strong>Record {{ item.id + 1 }}</strong>
      <p>{{ item.text }}</p>
      <lu-image v-if="item.id % 5 === 0" :src="picture" width="100%" alt="Blue illustration" lazy />
      <lu-button size="small" @click="expanded[item.id] = !expanded[item.id]">Toggle details</lu-button>
      <p v-if="expanded[item.id]">{{ item.text.repeat(3) }}</p>
    </article>
  </template>
</lu-virtual-list>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const list = ref()
const items = Array.from({ length: 10000 }, (_, id) => ({ id, name: `Record ${id + 1}` }))
const expanded = ref({})
const stories = Array.from({ length: 1000 }, (_, id) => ({ id, text: 'A record that wraps with the available width. '.repeat(id % 4 + 1) }))
const picture = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="160"><rect width="480" height="160" fill="#409eff"/><circle cx="360" cy="50" r="30" fill="white"/></svg>')
</script>

<template>
  <lu-virtual-list :items="stories" item-key="id" dynamic :item-height="120" :height="360" label="Dynamic records">
    <template #default="{ item }">
      <article style="padding: 16px; border-bottom: 1px solid var(--epx-border-color-light)">
        <strong>Record {{ item.id + 1 }}</strong>
        <p>{{ item.text }}</p>
        <lu-image v-if="item.id % 5 === 0" :src="picture" width="100%" alt="Blue illustration" lazy />
        <lu-button size="small" @click="expanded[item.id] = !expanded[item.id]">Toggle details</lu-button>
        <p v-if="expanded[item.id]">{{ item.text.repeat(3) }}</p>
      </article>
    </template>
  </lu-virtual-list>
</template>
```

</template>
</DemoBlock>

`ResizeObserver` tracks image loads, text wrapping and expansion. Measurements are cached by stable key. Height changes and insertions above the viewport preserve the reading anchor. Width changes clear old measurements and remeasure visible rows.

Unrendered rows use estimates; distant scroll targets are corrected after measurement. Supply unique stable keys and an `itemHeight` near the average height. Use inner padding rather than outer row margins. Call `resetHeights()` after offscreen content changes. Continuous size tracking requires `ResizeObserver` support.

## VirtualList Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `T[]` | `[]` | Data array; slot types follow the item type |
| `height` | `number` | `300` | Viewport height in pixels |
| `itemHeight` | `number` | `40` | Fixed or estimated row height in pixels |
| `dynamic` | `boolean` | `false` | Enable dynamic height measurement |
| `overscan` | `number` | `3` | Extra rows rendered on each side |
| `itemKey` | `keyof T / ((item: T, index: number) => string / number)` | `—` | Stable key property or function; defaults to index |
| `label` | `string` | `Virtual list` | Accessible list name |



## Events

| Event | Parameters | Description |
| --- | --- | --- |
| `scroll` | `(offset: number)` | Native scroll event; offset is in pixels |
| `rangeChange` | `({ start: number, end: number })` | Emitted initially and on range changes; includes overscan, with exclusive end |



## Slots

| Slot | Parameters | Description |
| --- | --- | --- |
| `default` | `{ item: T, index: number }` | Row content with a zero-based index |
| `empty` | `—` | Empty-state content |



## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `scrollTo` | `(offset: number) => void` | Scroll to a clamped pixel offset |
| `scrollToIndex` | `(index: number, align?: 'start' / 'center' / 'end' / 'auto') => void` | Position an item; defaults to start, auto keeps visible items in place |
| `resetHeights` | `() => void` | Clear cached heights and remeasure mounted rows |



## Usage notes

Nonpositive or nonfinite height and itemHeight values use defaults; negative overscan becomes zero. Data shrinkage and dimension changes correct the offset. The container supports native keyboard scrolling. Rows unmount outside the rendered range; keep persistent state in your data.
