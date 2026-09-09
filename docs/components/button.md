# Button 按钮

`LuButton` 用于触发操作，组件标签为 `<lu-button>`。它提供常用语义类型、尺寸、朴素样式、圆角、加载中和禁用状态。

## 基础用法

通过 `type` 设置按钮的语义样式。

<DemoBlock>
  <lu-button>默认按钮</lu-button>
  <lu-button type="primary">主要按钮</lu-button>
  <lu-button type="success">成功按钮</lu-button>
  <lu-button type="warning">警告按钮</lu-button>
  <lu-button type="danger">危险按钮</lu-button>

  <template #source>

```vue
<template>
  <lu-button>默认按钮</lu-button>
  <lu-button type="primary">主要按钮</lu-button>
  <lu-button type="success">成功按钮</lu-button>
  <lu-button type="warning">警告按钮</lu-button>
  <lu-button type="danger">危险按钮</lu-button>
</template>
```

  </template>
</DemoBlock>

## 朴素按钮

添加 `plain` 可以得到更轻的按钮视觉。

<DemoBlock>
  <lu-button plain>朴素按钮</lu-button>
  <lu-button type="primary" plain>主要按钮</lu-button>
  <lu-button type="success" plain>成功按钮</lu-button>
  <lu-button type="warning" plain>警告按钮</lu-button>
  <lu-button type="danger" plain>危险按钮</lu-button>

  <template #source>

```vue
<template>
  <lu-button plain>朴素按钮</lu-button>
  <lu-button type="primary" plain>主要按钮</lu-button>
  <lu-button type="success" plain>成功按钮</lu-button>
  <lu-button type="warning" plain>警告按钮</lu-button>
  <lu-button type="danger" plain>危险按钮</lu-button>
</template>
```

  </template>
</DemoBlock>

## 尺寸

使用 `size` 控制按钮大小。

<DemoBlock>
  <lu-button size="large">大型按钮</lu-button>
  <lu-button>默认按钮</lu-button>
  <lu-button size="small">小型按钮</lu-button>

  <template #source>

```vue
<template>
  <lu-button size="large">大型按钮</lu-button>
  <lu-button>默认按钮</lu-button>
  <lu-button size="small">小型按钮</lu-button>
</template>
```

  </template>
</DemoBlock>

## 状态

`loading` 和 `disabled` 状态下不会触发点击事件。

<DemoBlock>
  <lu-button round>圆角按钮</lu-button>
  <lu-button type="primary" loading>加载中</lu-button>
  <lu-button disabled>禁用按钮</lu-button>

  <template #source>

```vue
<template>
  <lu-button round>圆角按钮</lu-button>
  <lu-button type="primary" loading>加载中</lu-button>
  <lu-button disabled>禁用按钮</lu-button>
</template>
```

  </template>
</DemoBlock>

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

## 文字、链接与图标按钮

<DemoBlock>
<lu-button type="primary" text>编辑</lu-button>
<lu-button type="primary" link>查看详情</lu-button>
<lu-button type="primary" circle aria-label="添加项目"><template #icon>+</template></lu-button>
<lu-button loading>保存中</lu-button>
<template #source>

```vue
<lu-button type="primary" text>编辑</lu-button>
<lu-button type="primary" link>查看详情</lu-button>
<lu-button type="primary" circle aria-label="添加项目"><template #icon>+</template></lu-button>
<lu-button loading>保存中</lu-button>
```

</template>
</DemoBlock>

`text`、`link`、`circle` 是可选布尔属性，默认 `false`。`icon` 插槽在文字前展示图标；加载时替换为旋转指示并设置 `aria-busy`。纯图标按钮需设置 `aria-label`。link 模式仍为按钮，页面跳转请使用链接元素。
