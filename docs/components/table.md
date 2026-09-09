# Table 表格

`LuTable` 用于展示结构化数据，`LuTableColumn` 用于声明列，组件标签为 `<lu-table>` 和 `<lu-table-column>`。

<script setup>
const users = [
  { id: 1, name: '张三', role: '开发者', status: '在线' },
  { id: 2, name: '李四', role: '设计师', status: '离线' },
  { id: 3, name: '王五', role: '产品经理', status: '在线' }
]
</script>

## 基础用法

通过 `data` 传入数据，通过 `lu-table-column` 声明列。

<DemoBlock>
  <lu-table :data="users">
    <lu-table-column prop="name" label="姓名" />
    <lu-table-column prop="role" label="角色" />
    <lu-table-column prop="status" label="状态" />
  </lu-table>

  <template #source>

```vue
<script setup lang="ts">
const users = [
  { id: 1, name: '张三', role: '开发者', status: '在线' },
  { id: 2, name: '李四', role: '设计师', status: '离线' }
]
</script>

<template>
  <lu-table :data="users">
    <lu-table-column prop="name" label="姓名" />
    <lu-table-column prop="role" label="角色" />
    <lu-table-column prop="status" label="状态" />
  </lu-table>
</template>
```

  </template>
</DemoBlock>

## 边框和斑马纹

使用 `border` 显示纵向边框，使用 `stripe` 显示斑马纹。

<DemoBlock>
  <lu-table :data="users" border stripe row-key="id">
    <lu-table-column prop="name" label="姓名" width="120px" />
    <lu-table-column prop="role" label="角色" />
    <lu-table-column prop="status" label="状态" align="center" />
  </lu-table>

  <template #source>

```vue
<template>
  <lu-table :data="users" border stripe row-key="id">
    <lu-table-column prop="name" label="姓名" width="120px" />
    <lu-table-column prop="role" label="角色" />
    <lu-table-column prop="status" label="状态" align="center" />
  </lu-table>
</template>
```

  </template>
</DemoBlock>

## 自定义单元格

使用与 `prop` 同名的插槽自定义单元格内容。

<DemoBlock>
  <lu-table :data="users" border>
    <lu-table-column prop="name" label="姓名" />
    <lu-table-column prop="status" label="状态" align="center" />
    <template #status="{ row }">
      <lu-tag :type="row.status === '在线' ? 'success' : 'info'" size="small">{{ row.status }}</lu-tag>
    </template>
  </lu-table>

  <template #source>

```vue
<template>
  <lu-table :data="users" border>
    <lu-table-column prop="name" label="姓名" />
    <lu-table-column prop="status" label="状态" align="center" />

    <template #status="{ row }">
      <lu-tag :type="row.status === '在线' ? 'success' : 'info'" size="small">
        {{ row.status }}
      </lu-tag>
    </template>
  </lu-table>
</template>
```

  </template>
</DemoBlock>

## 空状态

数据为空时会展示 `empty-text`。

<DemoBlock>
  <lu-table :data="[]" empty-text="暂无数据">
    <lu-table-column prop="name" label="姓名" />
    <lu-table-column prop="role" label="角色" />
  </lu-table>

  <template #source>

```vue
<template>
  <lu-table :data="[]" empty-text="暂无数据">
    <lu-table-column prop="name" label="姓名" />
    <lu-table-column prop="role" label="角色" />
  </lu-table>
</template>
```

  </template>
</DemoBlock>

## 紧凑布局

通过单元格内边距变量调整信息密度，列配置保持不变。配色随明暗主题切换。

<DemoBlock>
  <lu-table :data="users" stripe style="--epx-table-cell-padding: 8px 12px" row-key="id">
    <lu-table-column prop="name" label="姓名" />
    <lu-table-column prop="role" label="角色" />
    <lu-table-column prop="status" label="状态" align="center" />
  </lu-table>
  <template #source>

```vue
<lu-table :data="users" stripe style="--epx-table-cell-padding: 8px 12px" row-key="id">
  <lu-table-column prop="name" label="姓名" />
  <lu-table-column prop="role" label="角色" />
  <lu-table-column prop="status" label="状态" align="center" />
</lu-table>
```

  </template>
</DemoBlock>

## Table Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `Record<string, unknown>[]` | `[]` | 表格数据。 |
| `border` | `boolean` | `false` | 是否显示纵向边框。 |
| `stripe` | `boolean` | `false` | 是否显示斑马纹。 |
| `emptyText` | `string` | `'No Data'` | 空状态文本。 |
| `rowKey` | `string \| ((row) => string \| number)` | `undefined` | 行 key。 |

## TableColumn Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `prop` | `string` | `undefined` | 数据字段名。 |
| `label` | `string` | `undefined` | 表头文本。 |
| `width` | `string \| number` | `undefined` | 列宽度。 |
| `align` | `'left' \| 'center' \| 'right'` | `undefined` | 对齐方式。 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| `default` | 表格列声明。 |
| `[prop]` | 与列 `prop` 同名的自定义单元格插槽，参数为 `{ row, index }`。 |

## 样式变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--epx-table-cell-padding` | `14px 16px` | 单元格内边距，窄屏默认 12px 10px。 |
| `--epx-table-header-bg` | `var(--epx-fill-color-light)` | 表头背景。 |
| `--epx-table-row-hover-bg` | `var(--epx-color-primary-light-9)` | 悬停或包含键盘焦点的行背景。 |
| `--epx-table-stripe-bg` | `var(--epx-fill-color-lighter)` | 斑马纹行背景。 |
