# Button

`LuButton` triggers actions. Use it as `<lu-button>`. It supports semantic types, sizes, plain style, rounded corners, loading state, and disabled state.

## Basic Usage

Use `type` to set the button style.

<DemoBlock source-label="View source">
  <lu-button>Default</lu-button>
  <lu-button type="primary">Primary</lu-button>
  <lu-button type="success">Success</lu-button>
  <lu-button type="warning">Warning</lu-button>
  <lu-button type="danger">Danger</lu-button>

  <template #source>

```vue
<template>
  <lu-button>Default</lu-button>
  <lu-button type="primary">Primary</lu-button>
  <lu-button type="success">Success</lu-button>
  <lu-button type="warning">Warning</lu-button>
  <lu-button type="danger">Danger</lu-button>
</template>
```

  </template>
</DemoBlock>

## Plain Buttons

Add `plain` for a lighter visual style.

<DemoBlock source-label="View source">
  <lu-button plain>Plain</lu-button>
  <lu-button type="primary" plain>Primary</lu-button>
  <lu-button type="success" plain>Success</lu-button>
  <lu-button type="warning" plain>Warning</lu-button>
  <lu-button type="danger" plain>Danger</lu-button>

  <template #source>

```vue
<template>
  <lu-button plain>Plain</lu-button>
  <lu-button type="primary" plain>Primary</lu-button>
  <lu-button type="success" plain>Success</lu-button>
  <lu-button type="warning" plain>Warning</lu-button>
  <lu-button type="danger" plain>Danger</lu-button>
</template>
```

  </template>
</DemoBlock>

## Sizes

Use `size` to control button size.

<DemoBlock source-label="View source">
  <lu-button size="large">Large</lu-button>
  <lu-button>Default</lu-button>
  <lu-button size="small">Small</lu-button>

  <template #source>

```vue
<template>
  <lu-button size="large">Large</lu-button>
  <lu-button>Default</lu-button>
  <lu-button size="small">Small</lu-button>
</template>
```

  </template>
</DemoBlock>

## States

Loading and disabled buttons do not emit click events.

<DemoBlock source-label="View source">
  <lu-button round>Round</lu-button>
  <lu-button type="primary" loading>Loading</lu-button>
  <lu-button disabled>Disabled</lu-button>

  <template #source>

```vue
<template>
  <lu-button round>Round</lu-button>
  <lu-button type="primary" loading>Loading</lu-button>
  <lu-button disabled>Disabled</lu-button>
</template>
```

  </template>
</DemoBlock>

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

## Text, link and icon buttons

<DemoBlock>
<lu-button type="primary" text>Edit</lu-button>
<lu-button type="primary" link>Details</lu-button>
<lu-button type="primary" circle aria-label="Add item"><template #icon>+</template></lu-button>
<lu-button loading>Saving</lu-button>
<template #source>

```vue
<lu-button type="primary" text>Edit</lu-button>
<lu-button type="primary" link>Details</lu-button>
<lu-button type="primary" circle aria-label="Add item"><template #icon>+</template></lu-button>
<lu-button loading>Saving</lu-button>
```

</template>
</DemoBlock>

`text`, `link` and `circle` are optional booleans, default `false`. The `icon` slot places an icon before the label; loading replaces that icon with a spinner and sets `aria-busy`. Icon-only buttons need `aria-label`. Link mode styles a button; use an anchor for navigation.
