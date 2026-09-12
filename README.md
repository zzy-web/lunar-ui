# Lunar UI

A compact Vue 3 component library inspired by Element Plus.

## Local development

Build and pack this repository to try `lunar-ui` locally before publishing.

```bash
npm ci
npm run dev
# Build and create a local package (prepack builds the library automatically):
npm pack
```

## Use

```ts
import { createApp } from 'vue'
import LunarUI from 'lunar-ui'
import 'lunar-ui/dist/style.css'

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
- `LuCheckbox`
- `LuSwitch`
- `LuTag`
- `LuCalendar`
- `LuSelect`
- `LuRadio`
- `LuRadioGroup`
- `LuAlert`
- `LuEmpty`
- `LuPagination`
- `LuProgress`
- `LuDivider`

## Validation

- `npm run test:components`: build the library and run interaction checks.
- `npm run typecheck`: check library, playground and documentation Vue types.
- `npm run build`: build library files in `dist` and documentation in `docs/.vitepress/dist`.
- `npm run docs:preview`: preview the built documentation.

The documentation includes Chinese and English pages, local search, a filterable component overview, and interactive examples with copyable source.

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

The npm package name is `lunar-ui`. Sign in with an account that can publish it:

```bash
npm login --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
npm run release
```

Publishing uses the official npm registry and public access, regardless of your
local download mirror. `prepublishOnly` runs type checking and component tests;
`prepack` builds the JavaScript bundles, CSS and TypeScript declarations. Only
`dist`, package metadata, this README and the license are included in the package.

For a local install, run `npm pack` and install the generated `.tgz` in your Vue 3
application with `npm install /path/to/lunar-ui-0.1.0.tgz`. For later releases,
increment the version with `npm version patch` (or `minor` / `major`) before
publishing; npm does not allow overwriting an existing version.
