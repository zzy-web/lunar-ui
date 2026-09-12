# Dropdown

Group secondary actions in an accessible menu with disabled items, separators, danger styling and keyboard navigation.

<script setup>
import { ref } from 'vue'
const command = ref('None')
const visible = ref(false)
const options = [
  { label: 'Edit', command: 'edit' },
  { label: 'Copy link', command: 'copy' },
  { label: 'Archive (unavailable)', command: 'archive', disabled: true },
  { label: 'Delete', command: 'delete', danger: true, divided: true }
]
</script>

## Basic usage

Provide `options` and handle the command event. This demo only displays the chosen command; it does not delete or modify anything.

<DemoBlock source-label="View source">
  <lu-dropdown :options="options" label="More actions" @command="value => command = value" />
  <span role="status">Command: {{ command }}</span>
  <template #source>

```vue
<script setup>
const options = [
  { label: 'Edit', command: 'edit' },
  { label: 'Copy link', command: 'copy' },
  { label: 'Archive', command: 'archive', disabled: true },
  { label: 'Delete', command: 'delete', danger: true, divided: true }
]
</script>
<template>
  <lu-dropdown :options="options" label="More actions" @command="value => console.log(value)" />
</template>
```

  </template>
</DemoBlock>

## Sizes and disabled state

The trigger shares Button sizing. The default slot is inside a button: use text or icons, without nested interactive controls.

<DemoBlock source-label="View source">
  <lu-dropdown :options="options" size="small">Small</lu-dropdown>
  <lu-dropdown :options="options">Default</lu-dropdown>
  <lu-dropdown :options="options" size="large">Large</lu-dropdown>
  <lu-dropdown :options="options" disabled>Disabled</lu-dropdown>
  <template #source>

```vue
<lu-dropdown :options="options" size="small">Small</lu-dropdown>
<lu-dropdown :options="options">Default</lu-dropdown>
<lu-dropdown :options="options" size="large">Large</lu-dropdown>
<lu-dropdown :options="options" disabled>Disabled</lu-dropdown>
```

  </template>
</DemoBlock>

## Custom items and controlled visibility

The item slot receives `option`. With `hide-on-click=false`, selection keeps the menu open. Outside interactions, Escape and Tab still close it.

<DemoBlock source-label="View source">
  <lu-dropdown v-model:visible="visible" :options="options" :hide-on-click="false" placement="bottom-end"
    @command="value => command = value">
    Action list
    <template #item="{ option }">
      <span style="flex: 1">{{ option.label }}</span>
      <span v-if="option.command === 'edit'" style="font-size: 12px; opacity: .7">⌘ E</span>
    </template>
  </lu-dropdown>
  <span>Menu is {{ visible ? 'open' : 'closed' }}</span>
  <template #source>

```vue
<lu-dropdown v-model:visible="visible" :options="options" :hide-on-click="false" placement="bottom-end">
  Action list
  <template #item="{ option }">
    <span style="flex: 1">{{ option.label }}</span>
    <span v-if="option.command === 'edit'">⌘ E</span>
  </template>
</lu-dropdown>
```

  </template>
</DemoBlock>

## Empty state

<DemoBlock source-label="View source">
  <lu-dropdown :options="[]" label="No actions" empty-text="No actions are available" />
  <template #source>

```vue
<lu-dropdown :options="[]" label="No actions" empty-text="No actions are available" />
```

  </template>
</DemoBlock>

## Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `DropdownOption[]` | `[]` | Menu items with unique commands. |
| `label` | `string` | `'Actions'` | Trigger text; the default slot takes precedence. |
| `disabled` | `boolean` | `false` | Disable the entire menu. |
| `visible` | `boolean` | `undefined` | Controlled state, supports v-model:visible. |
| `hideOnClick` | `boolean` | `true` | Close after selecting an item. |
| `placement` | `FloatingPlacement` | `'bottom-start'` | Same 12 placements as Tooltip; automatically flips near edges. |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | Trigger and item size. |
| `offset` | `number` | `6` | Gap from the trigger in pixels. |
| `teleported` | `boolean` | `true` | Mount on body to avoid clipping. |
| `emptyText` | `string` | `'No actions'` | Empty message; the empty slot takes precedence. |

## DropdownOption

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | Required | Item text. |
| `command` | `string \| number` | Required | Unique command; numeric zero is valid. |
| `disabled` | `boolean` | `false` | Disable the item; keyboard navigation skips it. |
| `divided` | `boolean` | `false` | Show a separator before the item. |
| `danger` | `boolean` | `false` | Danger colors; does not perform any action itself. |

## Events

| Event | Parameters | Description |
| --- | --- | --- |
| `command` | `(command, option)` | An enabled item was selected; business actions remain with the caller. |
| `update:visible` | `(visible: boolean)` | Request a visibility update. |
| `visible-change` | `(visible: boolean)` | Actual visibility changed. |

## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `default` | — | Trigger button text or icons. |
| `item` | `{ option: DropdownOption }` | Item content; avoid nested interactive elements. |
| `empty` | — | Empty menu content. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `handleOpen` | `() => void` | Open and focus the first enabled item. |
| `handleClose` | `() => void` | Close and return focus to the trigger. |

## Keyboard and positioning

Enter/Space activate the trigger. Down opens at the first enabled item; Up opens at the last. In the menu, Up/Down wrap around and skip disabled items, Home/End jump to the first/last item, and Enter/Space activate an action. Escape returns focus to the trigger. Tab closes and continues normal page navigation. Clicking or focusing outside closes the menu.

The panel uses menu/menuitem roles and references its trigger. Position updates on scrolling, resizing and content changes. Tall menus scroll internally. Panels mount on body; define theme variables on `:root` or `html.dark`. For SSR, enable initially visible controlled panels after client mounting.
