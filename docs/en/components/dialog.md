# Dialog

`LuDialog` displays content in a modal layer above the page. Use it as `<lu-dialog>`. It supports `v-model`, title and footer slots, Escape key close, overlay click close, body scroll locking, centered content, and optional destroy-on-close rendering.

<script setup>
import { ref } from 'vue'

const basicVisible = ref(false)
const centeredVisible = ref(false)
</script>

## Basic Usage

Use `v-model` to control dialog visibility.

<DemoBlock source-label="View source">
  <lu-button type="primary" @click="basicVisible = true">Open dialog</lu-button>

  <lu-dialog v-model="basicVisible" title="Confirm update" width="420px">
    <p>Dialog content goes here.</p>

    <template #footer>
      <lu-button @click="basicVisible = false">Cancel</lu-button>
      <lu-button type="primary" @click="basicVisible = false">Confirm</lu-button>
    </template>
  </lu-dialog>

  <template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <lu-button type="primary" @click="visible = true">Open dialog</lu-button>

  <lu-dialog v-model="visible" title="Confirm update" width="420px">
    <p>Dialog content goes here.</p>

    <template #footer>
      <lu-button @click="visible = false">Cancel</lu-button>
      <lu-button type="primary" @click="visible = false">Confirm</lu-button>
    </template>
  </lu-dialog>
</template>
```

  </template>
</DemoBlock>

## Centered Dialog

Add `center` to center the body text and footer actions.

<DemoBlock source-label="View source">
  <lu-button @click="centeredVisible = true">Open centered dialog</lu-button>

  <lu-dialog v-model="centeredVisible" title="Notice" width="360px" center>
    <p>This dialog centers its body text and footer actions.</p>

    <template #footer>
      <lu-button type="primary" @click="centeredVisible = false">Got it</lu-button>
    </template>
  </lu-dialog>

  <template #source>

```vue
<template>
  <lu-dialog v-model="visible" title="Notice" width="360px" center>
    <p>This dialog centers its body text and footer actions.</p>

    <template #footer>
      <lu-button type="primary" @click="visible = false">Got it</lu-button>
    </template>
  </lu-dialog>
</template>
```

  </template>
</DemoBlock>

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
