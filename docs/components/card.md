# Card 卡片

`EpxCard` 用于承载一组相关内容。它支持标题、头部插槽、底部插槽、阴影策略和自定义主体样式。

## 基础用法

```vue
<template>
  <epx-card header="卡片标题">
    <p>这里是卡片主体内容。</p>
  </epx-card>
</template>
```

## 自定义头部和底部

```vue
<template>
  <epx-card>
    <template #header>
      <strong>账户信息</strong>
    </template>

    <p>用户名：Lunar</p>

    <template #footer>
      <epx-button type="primary">保存</epx-button>
    </template>
  </epx-card>
</template>
```

## 阴影

```vue
<template>
  <epx-card shadow="always">始终显示阴影</epx-card>
  <epx-card shadow="hover">悬停时显示阴影</epx-card>
  <epx-card shadow="never">不显示阴影</epx-card>
</template>
```

## 自定义主体样式

```vue
<template>
  <epx-card :body-style="{ padding: '24px' }">
    <p>主体区域使用了自定义内边距。</p>
  </epx-card>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `header` | `string` | `undefined` | 卡片标题。 |
| `shadow` | `'always' \| 'hover' \| 'never'` | `'always'` | 卡片阴影显示策略。 |
| `bodyStyle` | `CSSProperties` | `undefined` | 卡片主体区域的内联样式。 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| `default` | 卡片主体内容。 |
| `header` | 自定义头部内容，会覆盖 `header` 属性的渲染内容。 |
| `footer` | 底部内容。 |
