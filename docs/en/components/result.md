# Result

Display an operation outcome and next actions. Include the outcome in the title; built-in icons are decorative.

<script setup>
import { ref } from 'vue'
const saved = ref(false)
</script>


## Basic usage

<DemoBlock direction="column">
<lu-result icon="success" title="Saved successfully" sub-title="Your project is ready.">
  <template #extra><lu-button type="primary" @click="saved = !saved">{{ saved ? 'Confirmed' : 'Confirm' }}</lu-button></template>
</lu-result>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const saved = ref(false)
</script>

<template>
  <lu-result icon="success" title="Saved successfully" sub-title="Your project is ready.">
    <template #extra><lu-button type="primary" @click="saved = !saved">{{ saved ? 'Confirmed' : 'Confirm' }}</lu-button></template>
  </lu-result>
</template>
```

</template>
</DemoBlock>

## Result Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `success / warning / error / info` | `info` | Result icon type |
| `title` | `string` | `—` | Result title |
| `subTitle` | `string` | `—` | Supporting description |



## Slots

| Slot | Parameters | Description |
| --- | --- | --- |
| `icon` | `—` | Custom icon |
| `title` | `—` | Custom title |
| `sub-title` | `—` | Custom description |
| `default` | `—` | Additional content |
| `extra` | `—` | Action area |



## Usage notes

Slots override their corresponding props. Built-in icons are decorative; describe the outcome in the title. The component emits no events; bind action handlers to buttons in the extra slot.
