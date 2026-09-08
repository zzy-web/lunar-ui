# Input

`EpxInput` captures single-line text. It supports `v-model`, native input types, placeholder text, sizes, disabled state, readonly state, and prefix or suffix slots.

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <epx-input v-model="value" placeholder="Please enter text" />
</template>
```

## Sizes

```vue
<template>
  <epx-input size="large" placeholder="Large input" />
  <epx-input placeholder="Default input" />
  <epx-input size="small" placeholder="Small input" />
</template>
```

## Disabled And Readonly

```vue
<template>
  <epx-input model-value="Cannot edit" disabled />
  <epx-input model-value="Readonly text" readonly />
</template>
```

## Prefix And Suffix

```vue
<template>
  <epx-input v-model="keyword" placeholder="Search">
    <template #prefix>🔍</template>
    <template #suffix>.com</template>
  </epx-input>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | Input value. |
| `type` | `string` | `'text'` | Native `input` `type` attribute. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Input size. |
| `placeholder` | `string` | `undefined` | Placeholder text. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `readonly` | `boolean` | `false` | Makes the input readonly. |

## Events

| Event | Description |
| --- | --- |
| `update:modelValue` | Emitted when the input value changes. Used by `v-model`. |
| `input` | Emitted when the input value changes. |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | Prefix content. |
| `suffix` | Suffix content. |
