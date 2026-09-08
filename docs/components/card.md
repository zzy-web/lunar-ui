# Card 卡片

`LuCard` 用于承载一组相关内容，组件标签为 `<lu-card>`。它支持标题、头部插槽、底部插槽、阴影策略和自定义主体样式。

## 基础用法

使用 `header` 设置简单标题。

<DemoBlock>
  <lu-card header="卡片标题">
    <p>这里是卡片主体内容。</p>
  </lu-card>

  <template #source>

```vue
<template>
  <lu-card header="卡片标题">
    <p>这里是卡片主体内容。</p>
  </lu-card>
</template>
```

  </template>
</DemoBlock>

## 自定义头部和底部

使用 `header` 和 `footer` 插槽组织更复杂的内容。

<DemoBlock>
  <lu-card>
    <template #header>
      <strong>账户信息</strong>
    </template>
    <p>用户名：Lunar</p>
    <template #footer>
      <lu-button type="primary">保存</lu-button>
    </template>
  </lu-card>

  <template #source>

```vue
<template>
  <lu-card>
    <template #header>
      <strong>账户信息</strong>
    </template>

    <p>用户名：Lunar</p>

    <template #footer>
      <lu-button type="primary">保存</lu-button>
    </template>
  </lu-card>
</template>
```

  </template>
</DemoBlock>

## 阴影

通过 `shadow` 控制卡片阴影显示策略。

<DemoBlock>
  <lu-card shadow="always">始终显示阴影</lu-card>
  <lu-card shadow="hover">悬停时显示阴影</lu-card>
  <lu-card shadow="never">不显示阴影</lu-card>

  <template #source>

```vue
<template>
  <lu-card shadow="always">始终显示阴影</lu-card>
  <lu-card shadow="hover">悬停时显示阴影</lu-card>
  <lu-card shadow="never">不显示阴影</lu-card>
</template>
```

  </template>
</DemoBlock>

## 自定义主体样式

通过 `body-style` 调整卡片主体区域。

<DemoBlock>
  <lu-card :body-style="{ padding: '24px' }">
    <p>主体区域使用了自定义内边距。</p>
  </lu-card>

  <template #source>

```vue
<template>
  <lu-card :body-style="{ padding: '24px' }">
    <p>主体区域使用了自定义内边距。</p>
  </lu-card>
</template>
```

  </template>
</DemoBlock>

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
