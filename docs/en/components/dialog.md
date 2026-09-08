# Dialog

`EpxDialog` displays content in a modal layer above the page. It supports `v-model`, title and footer slots, Escape key close, overlay click close, body scroll locking, centered content, and optional destroy-on-close rendering.

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <epx-button type="primary" @click="visible = true">Open dialog</epx-button>

  <epx-dialog v-model="visible" title="Confirm update" width="420px">
    <p>Dialog content goes here.</p>

    <template #footer>
      <epx-button @click="visible = false">Cancel</epx-button>
      <epx-button type="primary" @click="visible = false">Confirm</epx-button>
    </template>
  </epx-dialog>
</template>
```

## Centered Dialog

```vue
<template>
  <epx-dialog v-model="visible" title="Notice" width="360px" center>
    <p>This dialog centers its body text and footer actions.</p>

    <template #footer>
      <epx-button type="primary" @click="visible = false">Got it</epx-button>
    </template>
  </epx-dialog>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | required | Controls dialog visibility with `v-model`. |
| `title` | `string` | `undefined` | Dialog title. |
| `ariaLabel` | `string` | `undefined` | Accessible label when no title is rendered. |
| `width` | `string` | `50%` | Dialog width. |
| `top` | `string` | `15vh` | Dialog top spacing. |
| `modal` | `boolean` | `true` | Shows the modal overlay background. |
| `lockScroll` | `boolean` | `true` | Locks body scrolling while open. |
| `closeOnClickModal` | `boolean` | `true` | Closes when clicking the overlay. |
| `closeOnPressEscape` | `boolean` | `true` | Closes when pressing Escape. |
| `showClose` | `boolean` | `true` | Shows the close button in the header. |
| `center` | `boolean` | `false` | Centers dialog text and footer actions. |
| `destroyOnClose` | `boolean` | `false` | Removes dialog content from the DOM after close. |

## Events

| Event | Description |
| --- | --- |
| `open` | Emitted when the dialog starts opening. |
| `opened` | Emitted after the opening transition finishes. |
| `close` | Emitted when the dialog requests to close. |
| `closed` | Emitted after the closing transition finishes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Main dialog content. |
| `header` | Custom header content. |
| `footer` | Footer actions. |
