# Breadcrumb 面包屑

展示页面层级，末项标识当前页面，其余项目可配置链接。

## 基础用法

<DemoBlock direction="column">
<lu-breadcrumb :items="[{ label: 'Home', href: '../' }, { label: 'Components', href: './' }, { label: 'Breadcrumb' }]" />
<template #source>

```vue
<template>
<lu-breadcrumb :items="[{ label: 'Home', href: '../' }, { label: 'Components', href: './' }, { label: 'Breadcrumb' }]" />
</template>
```

</template>
</DemoBlock>

## 自定义分隔符

<DemoBlock direction="column">
<lu-breadcrumb separator="›" :items="[{ label: 'Home', href: '../' }, { label: 'Components', href: './' }, { label: 'Breadcrumb' }]" />
<template #source>

```vue
<template>
<lu-breadcrumb separator="›" :items="[{ label: 'Home', href: '../' }, { label: 'Components', href: './' }, { label: 'Breadcrumb' }]" />
</template>
```

</template>
</DemoBlock>

## Breadcrumb Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | `[]` | 每项包含 label 和可选 href |
| `separator` | `string` | `/` | 分隔文本 |
| `label` | `string` | `Breadcrumb` | 导航的无障碍名称 |

## 插槽

默认插槽接收 `{ item, index }`，用于自定义内容；`separator` 插槽替换分隔符。末项设置 `aria-current="page"`，不渲染为链接。
