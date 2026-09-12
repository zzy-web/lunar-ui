# Progress

Display task completion or indeterminate progress. Percentages are clamped to 0–100; non-finite values become 0. Theme variables support dark mode.

<script setup lang="ts">
import { ref } from 'vue'
const percentage = ref(40)
</script>

## Examples

<DemoBlock direction="column">
<lu-progress :percentage="percentage" aria-label="Upload" />
  <lu-button @click="percentage = Math.min(100, percentage + 10)">+10%</lu-button>
  <lu-button @click="percentage = 0">Reset</lu-button>
  <lu-progress :percentage="100" status="success" />
  <lu-progress :percentage="65" status="warning" :stroke-width="12" />
  <lu-progress :percentage="30" status="exception" />
  <lu-progress indeterminate aria-label="Loading" />
  <lu-progress :percentage="75" color="#8b5cf6" :format="value => value + ' / 100'" />

<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const percentage = ref(40)
</script>

<template>
  <lu-progress :percentage="percentage" aria-label="Upload" />
  <lu-button @click="percentage = Math.min(100, percentage + 10)">+10%</lu-button>
  <lu-button @click="percentage = 0">Reset</lu-button>
  <lu-progress :percentage="100" status="success" />
  <lu-progress :percentage="65" status="warning" :stroke-width="12" />
  <lu-progress :percentage="30" status="exception" />
  <lu-progress indeterminate aria-label="Loading" />
  <lu-progress :percentage="75" color="#8b5cf6" :format="value => value + ' / 100'" />
</template>
```

</template>
</DemoBlock>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `percentage` | `number` | `0` | Progress percentage |
| `status` | `'default' / 'success' / 'warning' / 'exception'` | `'default'` | Status color |
| `strokeWidth` | `number` | `8` | Track height in pixels, minimum 1; non-finite values become 8 |
| `showText` | `boolean` | `true` | Show text |
| `indeterminate` | `boolean` | `false` | Indeterminate progress; omits aria-valuenow |
| `color` | `string` | `—` | Custom bar color, overrides status |
| `ariaLabel` | `string` | `'进度'` | Accessible progress name |
| `format` | `(percentage: number) => string` | `—` | Format text using the clamped percentage |

## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `default` | `{ percentage: number }` | The default slot receives `{ percentage: number }` and replaces the progress text. It is hidden when `:show-text="false"`. |

## Accessibility

Provide a meaningful `aria-label` for each task. Indeterminate animations respect reduced motion preferences. This component emits no events.
