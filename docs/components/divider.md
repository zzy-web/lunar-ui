# Divider 分割线

分隔内容区域，支持水平、垂直、虚线和自定义文字。



## 示例

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

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `direction` | `'horizontal' / 'vertical'` | `'horizontal'` | 方向 |
| `contentPosition` | `'left' / 'center' / 'right'` | `'center'` | 水平分割线的文字位置 |
| `dashed` | `boolean` | `false` | 使用虚线 |

## 插槽

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `default` | — | 默认插槽设置水平分割线文字；垂直模式不渲染插槽。组件提供 `separator` 语义与方向信息，不触发事件。 |
