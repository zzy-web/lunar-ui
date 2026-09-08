# Card

`EpxCard` groups related content. It supports a title, header slot, footer slot, shadow behavior, and custom body styles.

## Basic Usage

```vue
<template>
  <epx-card header="Card title">
    <p>Card body content goes here.</p>
  </epx-card>
</template>
```

## Custom Header And Footer

```vue
<template>
  <epx-card>
    <template #header>
      <strong>Account</strong>
    </template>

    <p>Username: Lunar</p>

    <template #footer>
      <epx-button type="primary">Save</epx-button>
    </template>
  </epx-card>
</template>
```

## Shadow

```vue
<template>
  <epx-card shadow="always">Always shows shadow</epx-card>
  <epx-card shadow="hover">Shows shadow on hover</epx-card>
  <epx-card shadow="never">Never shows shadow</epx-card>
</template>
```

## Custom Body Style

```vue
<template>
  <epx-card :body-style="{ padding: '24px' }">
    <p>The body uses custom padding.</p>
  </epx-card>
</template>
```

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
