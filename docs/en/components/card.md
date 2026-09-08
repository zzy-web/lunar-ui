# Card

`LuCard` groups related content. Use it as `<lu-card>`. It supports a title, header slot, footer slot, shadow behavior, and custom body styles.

## Basic Usage

Use `header` for a simple title.

<DemoBlock source-label="View source">
  <lu-card header="Card title">
    <p>Card body content goes here.</p>
  </lu-card>

  <template #source>

```vue
<template>
  <lu-card header="Card title">
    <p>Card body content goes here.</p>
  </lu-card>
</template>
```

  </template>
</DemoBlock>

## Custom Header And Footer

Use the `header` and `footer` slots for richer content.

<DemoBlock source-label="View source">
  <lu-card>
    <template #header>
      <strong>Account</strong>
    </template>
    <p>Username: Lunar</p>
    <template #footer>
      <lu-button type="primary">Save</lu-button>
    </template>
  </lu-card>

  <template #source>

```vue
<template>
  <lu-card>
    <template #header>
      <strong>Account</strong>
    </template>

    <p>Username: Lunar</p>

    <template #footer>
      <lu-button type="primary">Save</lu-button>
    </template>
  </lu-card>
</template>
```

  </template>
</DemoBlock>

## Shadow

Use `shadow` to control when the card shadow appears.

<DemoBlock source-label="View source">
  <lu-card shadow="always">Always shows shadow</lu-card>
  <lu-card shadow="hover">Shows shadow on hover</lu-card>
  <lu-card shadow="never">Never shows shadow</lu-card>

  <template #source>

```vue
<template>
  <lu-card shadow="always">Always shows shadow</lu-card>
  <lu-card shadow="hover">Shows shadow on hover</lu-card>
  <lu-card shadow="never">Never shows shadow</lu-card>
</template>
```

  </template>
</DemoBlock>

## Custom Body Style

Use `body-style` to adjust the card body.

<DemoBlock source-label="View source">
  <lu-card :body-style="{ padding: '24px' }">
    <p>The body uses custom padding.</p>
  </lu-card>

  <template #source>

```vue
<template>
  <lu-card :body-style="{ padding: '24px' }">
    <p>The body uses custom padding.</p>
  </lu-card>
</template>
```

  </template>
</DemoBlock>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string` | `undefined` | Card title. |
| `shadow` | `'always' \| 'hover' \| 'never'` | `'always'` | Card shadow behavior. |
| `bodyStyle` | `CSSProperties` | `undefined` | Inline style for the card body. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Card body content. |
| `header` | Custom header content. Overrides the rendered `header` prop content. |
| `footer` | Footer content. |
