# Rate

Choose an integer star rating with pointer or keyboard.

<script setup>
import { ref } from 'vue'
const score = ref(3)
const halfScore = ref(2.5)
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

## Half-star rating

<DemoBlock>
<lu-rate v-model="halfScore" allow-half clearable show-score label="Half-star rating" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const halfScore = ref(2.5)
</script>
<template>
  <lu-rate v-model="halfScore" allow-half clearable show-score label="Half-star rating" />
</template>
```

</template>
</DemoBlock>

`allowHalf` defaults to false. When enabled, the left/right half of each star selects a half/full value and arrow keys move by 0.5. Clicking the current half-star clears it when `clearable` is enabled.

Inside `LuForm`, this component inherits its disabled state and default size; an explicit component/group size takes precedence. See [Form](./form).
