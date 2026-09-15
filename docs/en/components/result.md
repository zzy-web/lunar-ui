# Result

Display an operation outcome and next actions. Include the outcome in the title; built-in icons are decorative.

## Basic usage

<DemoBlock>
<lu-result icon="success" title="Saved successfully" sub-title="Your project is ready." />
<template #source>

```vue
<template>
  <lu-result icon="success" title="Saved successfully" sub-title="Your project is ready." />
</template>
```

</template>
</DemoBlock>

## Props

- `icon`: `success | warning | error | info`, default `info`.
- `title`: result title.
- `subTitle`: supporting description.

## Slots

`icon`, `title`, `sub-title`, `default` (additional content), `extra` (actions). Slots override the corresponding props.

The component emits no events. Bind action handlers to buttons in the `extra` slot.
