# Tooltip

Show a short description on hover or keyboard focus, with delayed display and automatic viewport positioning.

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>

## Basic usage

Place the trigger in the default slot. Buttons receive a description without losing their existing events or description IDs. Plain text and native text elements can also receive keyboard focus. Escape dismisses the tooltip.

<DemoBlock source-label="View source">
  <lu-tooltip content="Save your changes"><lu-button>Save</lu-button></lu-tooltip>
  <lu-tooltip content="Keyboard focus also opens this hint" effect="light"><span>Focus this text</span></lu-tooltip>
  <lu-tooltip content="Not shown" disabled><lu-button>Disabled hint</lu-button></lu-tooltip>
  <template #source>

```vue
<lu-tooltip content="Save your changes"><lu-button>Save</lu-button></lu-tooltip>
<lu-tooltip content="Keyboard focus also opens this hint" effect="light">
  <span>Focus this text</span>
</lu-tooltip>
<lu-tooltip content="Not shown" disabled><lu-button>Disabled hint</lu-button></lu-tooltip>
```

  </template>
</DemoBlock>

## Placement

Use top, bottom, left or right, optionally followed by `-start` or `-end`. Panels flip when space is limited and update when the page scrolls or resizes.

<DemoBlock source-label="View source">
  <lu-tooltip v-for="placement in ['top', 'bottom', 'left', 'right', 'bottom-start', 'bottom-end']"
    :key="placement" :placement="placement" :content="'Placement: ' + placement">
    <lu-button size="small">{{ placement }}</lu-button>
  </lu-tooltip>
  <template #source>

```vue
<lu-tooltip placement="bottom-start" content="Bottom, aligned to the start" :offset="10">
  <lu-button>Show hint</lu-button>
</lu-tooltip>
```

  </template>
</DemoBlock>

## Content and delay

The content slot overrides the prop. Hovering over the tooltip keeps it open. Use explanatory content rather than interactive controls inside the tooltip.

<DemoBlock source-label="View source">
  <lu-tooltip :show-after="300" :hide-after="200" effect="light">
    <lu-button>Keyboard shortcut</lu-button>
    <template #content><strong>Save changes</strong><br />Windows: Ctrl + S<br />macOS: ⌘ + S</template>
  </lu-tooltip>
  <template #source>

```vue
<lu-tooltip :show-after="300" :hide-after="200" effect="light">
  <lu-button>Keyboard shortcut</lu-button>
  <template #content><strong>Save changes</strong><br />Ctrl + S / ⌘ + S</template>
</lu-tooltip>
```

  </template>
</DemoBlock>

## Controlled visibility

<DemoBlock source-label="View source">
  <lu-switch v-model="visible" aria-label="Show hint" />
  <lu-tooltip v-model:visible="visible" content="Visibility is shared with the switch"><lu-button>Controlled hint</lu-button></lu-tooltip>
  <template #source>

```vue
<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
<template>
  <lu-switch v-model="visible" aria-label="Show hint" />
  <lu-tooltip v-model:visible="visible" content="Visibility is shared with the switch">
    <lu-button>Controlled hint</lu-button>
  </lu-tooltip>
</template>
```

  </template>
</DemoBlock>

## Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `''` | Description text; the content slot takes precedence. |
| `placement` | `FloatingPlacement` | `'top'` | Top/bottom/left/right with optional -start/-end alignment. |
| `effect` | `'dark' \| 'light'` | `'dark'` | Contrasting or light surface using theme variables. |
| `disabled` | `boolean` | `false` | Hide the tooltip and cancel pending timers. |
| `visible` | `boolean` | `undefined` | Controlled state, supports v-model:visible. |
| `showAfter` | `number` | `150` | Show delay in milliseconds; 0 is immediate. |
| `hideAfter` | `number` | `100` | Hide delay in milliseconds. |
| `offset` | `number` | `8` | Gap from the trigger in pixels. |
| `teleported` | `boolean` | `true` | Mount on body to avoid scroll-container clipping. |

## Events

| Event | Parameters | Description |
| --- | --- | --- |
| `update:visible` | `(visible: boolean)` | Request a visibility update. |
| `visible-change` | `(visible: boolean)` | Actual visibility changed. |

## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `default` | — | One trigger element, or plain text. Existing events and aria-describedby are retained. |
| `content` | — | Custom noninteractive description. |

## Usage notes

The panel uses `role="tooltip"` and is associated with the trigger through `aria-describedby`. Custom trigger components must forward attributes to a focusable root. Native disabled buttons cannot receive keyboard focus; use a focusable text trigger to explain disabled actions. Disabled state overrides controlled visibility. Empty content does not show a panel.

Panels mount on body by default. Define theme variables on `:root` or `html.dark`. Use `teleported=false` only where ancestors do not clip or transform fixed elements. For SSR, enable initially visible controlled panels after client mounting.
