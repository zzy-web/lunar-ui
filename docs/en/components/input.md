# Input

`LuInput` captures single-line text. Use it as `<lu-input>`. It supports `v-model`, native input types, placeholder text, sizes, disabled state, readonly state, and prefix or suffix slots.

<script setup>
import { ref } from 'vue'

const inputValue = ref('')
const keyword = ref('')
</script>

## Basic Usage

Use `v-model` to bind the input value.

<DemoBlock source-label="View source">
  <lu-input v-model="inputValue" placeholder="Please enter text" />

  <template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <lu-input v-model="value" placeholder="Please enter text" />
</template>
```

  </template>
</DemoBlock>

## Sizes

Use `size` to set the input size.

<DemoBlock source-label="View source">
  <lu-input size="large" placeholder="Large input" />
  <lu-input placeholder="Default input" />
  <lu-input size="small" placeholder="Small input" />

  <template #source>

```vue
<template>
  <lu-input size="large" placeholder="Large input" />
  <lu-input placeholder="Default input" />
  <lu-input size="small" placeholder="Small input" />
</template>
```

  </template>
</DemoBlock>

## Disabled And Readonly

`disabled` prevents interaction, while `readonly` only prevents editing.

<DemoBlock source-label="View source">
  <lu-input model-value="Cannot edit" disabled />
  <lu-input model-value="Readonly text" readonly />

  <template #source>

```vue
<template>
  <lu-input model-value="Cannot edit" disabled />
  <lu-input model-value="Readonly text" readonly />
</template>
```

  </template>
</DemoBlock>

## Prefix And Suffix

Use the `prefix` and `suffix` slots to extend the input.

<DemoBlock source-label="View source">
  <lu-input v-model="keyword" placeholder="Search">
    <template #prefix>Search</template>
    <template #suffix>.com</template>
  </lu-input>

  <template #source>

```vue
<template>
  <lu-input v-model="keyword" placeholder="Search">
    <template #prefix>Search</template>
    <template #suffix>.com</template>
  </lu-input>
</template>
```

  </template>
</DemoBlock>

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
