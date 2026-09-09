# Input

`LuInput` supports text, passwords and textareas. Use it as `<lu-input>`, with `v-model`, clearing, character counts, sizes, disabled and readonly states, and prefix or suffix slots.

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

## Clearable input

<DemoBlock>
  <lu-input v-model="inputValue" clearable aria-label="Name" placeholder="Enter a name" clear-label="Clear input" />
<template #source>

```vue
<lu-input v-model="value" clearable aria-label="Name" />
```

</template>
</DemoBlock>

## Password visibility

<DemoBlock>
  <lu-input v-model="keyword" show-password autocomplete="new-password" aria-label="Password" password-label="Show password" />
<template #source>

```vue
<lu-input v-model="password" show-password autocomplete="new-password" aria-label="Password" />
```

</template>
</DemoBlock>

## Textarea and character count

<DemoBlock>
  <lu-input v-model="inputValue" type="textarea" :rows="4" :maxlength="120" show-word-limit aria-label="Description" />
<template #source>

```vue
<lu-input v-model="description" type="textarea" :rows="4" :maxlength="120" show-word-limit aria-label="Description" />
```

</template>
</DemoBlock>

## Extended API

- `clearable` / `showPassword` / `showWordLimit`: boolean, default `false`.
- `maxlength`: optional native character limit; the counter appears only when set and is hidden for passwords.
- `rows`: textarea rows, default `3`.
- `resize`: `none | both | horizontal | vertical`, default `vertical`.
- `clearLabel` / `passwordLabel`: accessible action labels, default `Clear input` / `Show password`.
- `change(value: string)`: native committed change, or clear action.
- `clear()`: emitted when the clear button is used.
- `focus(event: FocusEvent)` / `blur(event: FocusEvent)`: native focus events.
- Exposed methods: `focus()`, `blur()`, `select()`.

The original `input` and `update:modelValue` events remain supported. Input updates wait until IME composition completes. Native attributes are forwarded to the input or textarea, including `id`, `name` and ARIA attributes. The counter follows native UTF-16 length semantics. Prefix and suffix slots apply to single-line inputs.
