# Button 按钮

`EpxButton` 用于触发操作。它支持不同语义类型、尺寸、朴素样式、圆角、加载中和禁用状态。

## 基础用法

```vue
<template>
  <epx-button>默认按钮</epx-button>
  <epx-button type="primary">主要按钮</epx-button>
  <epx-button type="success">成功按钮</epx-button>
  <epx-button type="warning">警告按钮</epx-button>
  <epx-button type="danger">危险按钮</epx-button>
</template>
```

## 朴素按钮

```vue
<template>
  <epx-button plain>朴素按钮</epx-button>
  <epx-button type="primary" plain>主要按钮</epx-button>
  <epx-button type="success" plain>成功按钮</epx-button>
</template>
```

## 尺寸

```vue
<template>
  <epx-button size="large">大型按钮</epx-button>
  <epx-button>默认按钮</epx-button>
  <epx-button size="small">小型按钮</epx-button>
</template>
```

## 状态

```vue
<template>
  <epx-button round>圆角按钮</epx-button>
  <epx-button loading>加载中</epx-button>
  <epx-button disabled>禁用按钮</epx-button>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'default'` | 按钮类型。 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 按钮尺寸。 |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 `button` 的 `type` 属性。 |
| `plain` | `boolean` | `false` | 是否使用朴素按钮样式。 |
| `round` | `boolean` | `false` | 是否使用圆角按钮样式。 |
| `loading` | `boolean` | `false` | 是否显示加载中状态。 |
| `disabled` | `boolean` | `false` | 是否禁用按钮。 |

## 事件

| 事件名 | 说明 |
| --- | --- |
| `click` | 点击按钮时触发。禁用或加载中状态不会触发。 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮内容。 |
