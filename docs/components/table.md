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

## 排序、多选与序号

`sortable` 支持升序、降序、取消排序三态，数字按数值排序，不修改传入的数组。`sortable="custom"` 只触发 `sort-change`，供服务端排序使用。`prop` 支持 `profile.name` 这样的嵌套路径。

<DemoBlock>
  <lu-table :data="users" row-key="id" border :max-height="260" :default-sort="{ prop: 'id', order: 'descending' }">
    <lu-table-column type="selection" :selectable="row => row.id !== 2" />
    <lu-table-column type="index" label="#" />
    <lu-table-column prop="id" label="ID" sortable :width="80" />
    <lu-table-column prop="name" label="姓名" sortable />
    <lu-table-column prop="role" label="角色" show-overflow-tooltip />
  </lu-table>
  <template #source>

```vue
<lu-table :data="users" row-key="id" border :max-height="260"
  :default-sort="{ prop: 'id', order: 'descending' }"
  @selection-change="rows => selectedRows = rows"
  @sort-change="({ prop, order }) => console.log(prop, order)">
  <lu-table-column type="selection" :selectable="row => row.id !== 2" />
  <lu-table-column type="index" label="#" />
  <lu-table-column prop="id" label="ID" sortable :width="80" />
  <lu-table-column prop="name" label="姓名" sortable />
  <lu-table-column prop="role" label="角色" show-overflow-tooltip />
</lu-table>
```

  </template>
</DemoBlock>

## 列级插槽与格式化

列的 `default` 插槽接收 `{ row, column, index, $index }`，`header` 插槽接收 `{ column }`。列插槽优先于表格同名插槽，再回退到 `formatter` 和原始值。

<DemoBlock>
  <lu-table :data="users" stripe>
    <lu-table-column prop="name" label="姓名">
      <template #header>成员姓名</template>
      <template #default="{ row }"><strong>{{ row.name }}</strong></template>
    </lu-table-column>
    <lu-table-column prop="role" label="角色" :formatter="(row, column, value) => '职位：' + value" />
    <lu-table-column label="状态">
      <template #default="{ row }"><lu-tag size="small">{{ row.status }}</lu-tag></template>
    </lu-table-column>
  </lu-table>
  <template #source>

```vue
<lu-table-column prop="name" label="姓名">
  <template #header>成员姓名</template>
  <template #default="{ row }"><strong>{{ row.name }}</strong></template>
</lu-table-column>
<lu-table-column prop="role" label="角色"
  :formatter="(row, column, value) => '职位：' + value" />
```

  </template>
</DemoBlock>

## 新增 API

- Table `height` / `maxHeight`：数字（px）或 CSS 长度；滚动时固定表头。
- Table `showHeader`：是否显示表头，默认 `true`。
- Table `defaultSort`：初始排序 `{ prop, order }`，`order` 为 `ascending`、`descending` 或 `null`。
- Column `type`：`default`、`selection` 或 `index`；后两者默认列宽 56px。
- Column `index`：序号起始值（默认 1），或 `(index) => number | string`。
- Column `sortable`：`boolean | 'custom'`，默认关闭；排序列需要 `prop`。
- Column `sortMethod(a, b)`：自定义比较函数，返回数字，降序自动反转结果。
- Column `selectable(row, index)`：是否允许选中，默认允许；index 为原始数据索引。
- Column `formatter(row, column, value, index)`：格式化内容，可返回 VNode。
- Column `showOverflowTooltip`：单行省略，鼠标悬停通过原生 title 显示原始字段值。
- Table `empty` 插槽：自定义空状态，优先于 `emptyText`。

事件：`sort-change({ prop, order })`、`selection-change(rows)`、`select(rows, row)`、`select-all(rows)`、`row-click(row, index, event)`。行点击索引为排序后的索引；复选框点击不会触发行点击。

通过组件 ref 调用：`sort(prop, order)`、`clearSort()`、`toggleRowSelection(row, selected?)`、`toggleAllSelection()`、`clearSelection()`、`getSelectionRows()`。`clearSort` 恢复传入数据顺序。选择方法遵守 `selectable`；切换行选择也触发 `select`。

多选建议设置唯一、稳定的 `row-key`。同 key 数据对象更新后保留选择，移出 `data` 的行自动清除选择；不保留跨分页选择。未设置 row-key 时按对象身份跟踪选择。全选只作用于允许选择的行。
