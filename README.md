# Lunar UI

A compact Vue 3 component library inspired by Element Plus.

## Install

```bash
npm install @your-scope/lunar-ui
```

## Use

```ts
import { createApp } from 'vue'
import LunarUI from '@your-scope/lunar-ui'
import '@your-scope/lunar-ui/dist/style.css'

createApp(App).use(LunarUI).mount('#app')
```

## Components

- `LuButton`
- `LuInput`
- `LuCard`
- `LuForm`
- `LuFormItem`
- `LuTable`
- `LuTableColumn`
- `LuTour`
- `LuDialog`

## Dialog

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

### Dialog Props

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

### Dialog Events

| Event | Description |
| --- | --- |
| `open` | Emitted when the dialog starts opening. |
| `opened` | Emitted after the opening transition finishes. |
| `close` | Emitted when the dialog requests to close. |
| `closed` | Emitted after the closing transition finishes. |

### Dialog Slots

| Slot | Description |
| --- | --- |
| `default` | Main dialog content. |
| `header` | Custom header content. |
| `footer` | Footer actions. |

## Publish

Update `name` in `package.json`, then run:

```bash
npm login
npm run release
```
