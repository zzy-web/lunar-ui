# Button

`EpxButton` triggers actions. It supports semantic types, sizes, plain style, rounded corners, loading state, and disabled state.

## Basic Usage

```vue
<template>
  <epx-button>Default</epx-button>
  <epx-button type="primary">Primary</epx-button>
  <epx-button type="success">Success</epx-button>
  <epx-button type="warning">Warning</epx-button>
  <epx-button type="danger">Danger</epx-button>
</template>
```

## Plain Buttons

```vue
<template>
  <epx-button plain>Plain</epx-button>
  <epx-button type="primary" plain>Primary</epx-button>
  <epx-button type="success" plain>Success</epx-button>
</template>
```

## Sizes

```vue
<template>
  <epx-button size="large">Large</epx-button>
  <epx-button>Default</epx-button>
  <epx-button size="small">Small</epx-button>
</template>
```

## States

```vue
<template>
  <epx-button round>Round</epx-button>
  <epx-button loading>Loading</epx-button>
  <epx-button disabled>Disabled</epx-button>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Button type. |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Button size. |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native `button` `type` attribute. |
| `plain` | `boolean` | `false` | Uses the plain button style. |
| `round` | `boolean` | `false` | Uses rounded button corners. |
| `loading` | `boolean` | `false` | Shows the loading state. |
| `disabled` | `boolean` | `false` | Disables the button. |

## Events

| Event | Description |
| --- | --- |
| `click` | Emitted when the button is clicked. Disabled or loading buttons do not emit it. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Button content. |
