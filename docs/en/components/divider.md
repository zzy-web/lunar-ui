# Divider

Separate content with horizontal, vertical, dashed or labeled dividers.



## Examples

<DemoBlock direction="column">
<div style="width: 100%">
    <p>Overview</p>
    <lu-divider />
    <lu-divider content-position="left">Details</lu-divider>
    <lu-divider dashed>More</lu-divider>
    <lu-divider content-position="right">End</lu-divider>
    <span>Edit</span><lu-divider direction="vertical" /><span>Share</span>
  </div>

<template #source>

```vue
<template>
  <div style="width: 100%">
    <p>Overview</p>
    <lu-divider />
    <lu-divider content-position="left">Details</lu-divider>
    <lu-divider dashed>More</lu-divider>
    <lu-divider content-position="right">End</lu-divider>
    <span>Edit</span><lu-divider direction="vertical" /><span>Share</span>
  </div>
</template>
```

</template>
</DemoBlock>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'horizontal' / 'vertical'` | `'horizontal'` | Direction |
| `contentPosition` | `'left' / 'center' / 'right'` | `'center'` | Text position for horizontal dividers |
| `dashed` | `boolean` | `false` | Use dashed borders |

## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `default` | — | The default slot provides horizontal divider content; vertical mode does not render it. Includes separator semantics and orientation. This component emits no events. |
