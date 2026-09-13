# Rate

Choose an integer star rating with pointer or keyboard.

<script setup>
import { ref } from 'vue'
const score = ref(3)
</script>

## Basic usage

<DemoBlock direction="column">
<lu-rate v-model="score" clearable show-score label="Satisfaction" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const score = ref(3)
</script>

<template>
<lu-rate v-model="score" clearable show-score label="Satisfaction" />
</template>
```

</template>
</DemoBlock>

## Sizes and states

<DemoBlock direction="column">
<lu-rate :model-value="4" size="small" readonly show-score />
<lu-rate :model-value="3" disabled />
<lu-rate v-model="score" size="large" :max="10" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const score = ref(3)
</script>

<template>
<lu-rate :model-value="4" size="small" readonly show-score />
<lu-rate :model-value="3" disabled />
<lu-rate v-model="score" size="large" :max="10" />
</template>
```

</template>
</DemoBlock>

## Rate Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Integer rating; v-model |
| `max` | `number` | `5` | Clamped to an integer from 1 to 100 |
| `disabled / readonly` | `boolean` | `false` | Prevent updates |
| `clearable` | `boolean` | `false` | Click the current rating to clear |
| `showScore` | `boolean` | `false` | Display numeric score |
| `size` | `small / default / large` | `default` | Star size |
| `label` | `string` | `Rating` | Accessible name |

## Events and keyboard

`update:modelValue` and `change` emit the new score. Arrow keys change it by one; Home clears and End selects the maximum. Non-finite values display as zero; fractional values are rounded.
