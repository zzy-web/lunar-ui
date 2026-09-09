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
      <span :style="{ color: row.status === '在线' ? 'var(--epx-color-success)' : 'var(--epx-color-info)' }">{{ row.status }}</span>
    </template>
  </lu-table>

  <template #source>

```vue
<template>
  <lu-table :data="users" border>
    <lu-table-column prop="name" label="姓名" />
    <lu-table-column prop="status" label="状态" align="center" />

    <template #status="{ row }">
      <span :style="{ color: row.status === '在线' ? 'var(--epx-color-success)' : 'var(--epx-color-info)' }">
        {{ row.status }}
      </span>
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
