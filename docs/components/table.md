# Table 表格

`LuTable` 用于展示结构化数据，`LuTableColumn` 用于声明列，组件标签为 `<lu-table>` 和 `<lu-table-column>`。

<script setup>
import { ref } from 'vue'
const users = [
  { id: 1, name: '张三', role: '开发者', status: '在线' },
  { id: 2, name: '李四', role: '设计师', status: '离线' },
  { id: 3, name: '王五', role: '产品经理', status: '在线' }
]
const pagedUsers = Array.from({ length: 18 }, (_, index) => ({ id: index + 1, name: `用户 ${index + 1}`, score: (index * 17) % 100 }))
const currentPage = ref(1)
const pageSize = ref(5)
const loading = ref(false)
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

## 当前行与行样式

点击行会更新当前行，`highlight-current-row` 开启高亮。当前行与复选框多选独立；复选框点击不会切换当前行。

<DemoBlock>
  <lu-table :data="users" row-key="id" highlight-current-row :current-row-key="1" size="small"
    :row-style="({ row }) => ({ color: row.status === '离线' ? 'var(--epx-text-color-secondary)' : undefined })">
    <lu-table-column prop="id" label="ID" sortable align="right" header-align="center" :width="80" />
    <lu-table-column prop="name" label="姓名" />
    <lu-table-column prop="status" label="状态" />
  </lu-table>
  <template #source>

```vue
<lu-table :data="users" row-key="id" highlight-current-row :current-row-key="1" size="small"
  :row-style="({ row }) => ({ color: row.status === '离线' ? 'var(--epx-text-color-secondary)' : undefined })"
  @current-change="(row, oldRow) => console.log(row, oldRow)">
  <lu-table-column prop="id" label="ID" sortable align="right" header-align="center" :width="80" />
  <lu-table-column prop="name" label="姓名" />
  <lu-table-column prop="status" label="状态" />
</lu-table>
```

  </template>
</DemoBlock>

## 内置分页与加载状态

设置 `pagination` 后，表格对传入的完整 `data` 先排序，再按 `pageSize` 分页。`v-model:current-page` 可同步页码；页大小变化或排序时会返回第一页。`loading` 显示局部遮罩，并暂时禁用选择与分页操作。

<DemoBlock direction="column">
<div style="display:flex; flex-wrap:wrap; gap:8px">
  <lu-button size="small" @click="pageSize = pageSize === 5 ? 3 : 5">每页 {{ pageSize }} 条（点击切换）</lu-button>
  <lu-button size="small" @click="loading = !loading">{{ loading ? '结束加载' : '模拟加载' }}</lu-button>
</div>
<lu-table v-model:current-page="currentPage" :data="pagedUsers" row-key="id" pagination :page-size="pageSize" :loading="loading" loading-text="正在获取用户…" pagination-aria-label="表格分页" border stripe>
  <lu-table-column type="selection" />
  <lu-table-column type="index" label="序号" />
  <lu-table-column prop="name" label="姓名" sortable />
  <lu-table-column prop="score" label="得分" sortable />
</lu-table>
<template #source>

```vue
<script setup lang="ts">
import { ref } from 'vue'
const users = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1, name: `用户 ${index + 1}`, score: (index * 17) % 100
}))
const currentPage = ref(1)
const pageSize = ref(5)
const loading = ref(false)
</script>

<template>
  <lu-button @click="pageSize = pageSize === 5 ? 3 : 5">每页 {{ pageSize }} 条</lu-button>
  <lu-button @click="loading = !loading">{{ loading ? '结束加载' : '模拟加载' }}</lu-button>
  <lu-table v-model:current-page="currentPage" :data="users" row-key="id"
    pagination :page-size="pageSize" :loading="loading" loading-text="正在获取用户…"
    pagination-aria-label="表格分页" border stripe>
    <lu-table-column type="selection" />
    <lu-table-column type="index" label="序号" />
    <lu-table-column prop="name" label="姓名" sortable />
    <lu-table-column prop="score" label="得分" sortable />
  </lu-table>
</template>
```

</template>
</DemoBlock>

页码超出数据范围时会自动回到最后一个有效页，并触发页码事件。表头全选仅作用于当前页；翻页后仍保留其他页已选中的行。若数据由服务端逐页获取，请将 `pagination` 关闭，单独组合 `LuPagination`，并在应用层管理总数与选择状态。

## Table Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `Record<string, unknown>[]` | `[]` | 表格数据。 |
| `border` | `boolean` | `false` | 是否显示纵向边框。 |
| `stripe` | `boolean` | `false` | 是否显示斑马纹。 |
| `emptyText` | `string` | `'No Data'` | 空状态文本。 |
| `rowKey` | `string \| ((row) => string \| number)` | `undefined` | 行 key。 |
| `height` | `string \| number` | `undefined` | 数字（px）或 CSS 长度；滚动时固定表头。 |
| `maxHeight` | `string \| number` | `undefined` | 数字（px）或 CSS 长度；滚动时固定表头。 |
| `showHeader` | `boolean` | `true` | 是否显示表头，默认 `true`。 |
| `defaultSort` | `{ prop: string; order: TableSortOrder }` | `undefined` | 初始排序 `{ prop, order }`，`order` 为 `ascending`、`descending` 或 `null`。 |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | `small \| default \| large`，默认 `default`。内联 `--epx-table-cell-padding` 可覆盖尺寸预设。 |
| `highlightCurrentRow` | `boolean` | `false` | 是否高亮当前行，默认 `false`；通过 `--epx-table-current-row-bg` 自定义高亮背景。 |
| `currentRowKey` | `string \| number \| null` | `undefined` | `string \| number \| null`，需要 `rowKey`。初始化或值变化时定位当前行，传入 `null` 清除；点击仍可切换当前行。 |
| `rowClassName` | `string \| (({ row, rowIndex }) => string)` | `undefined` | 类名字符串或 `({ row, rowIndex }) => string`。 |
| `rowStyle` | `CSSProperties \| (({ row, rowIndex }) => CSSProperties)` | `undefined` | 样式对象或 `({ row, rowIndex }) => CSSProperties`。索引为排序后的显示索引；斑马纹、悬停与选中背景优先于行背景。 |
| `pagination` | `boolean` | `false` | 对完整 `data` 启用客户端分页。 |
| `currentPage` | `number` | `1` | 当前页；支持 `v-model:current-page`。 |
| `pageSize` | `number` | `10` | 每页条数；至少为 1。 |
| `paginationAriaLabel` | `string` | `'Table pages'` | 分页导航的无障碍名称。 |
| `paginationPrevText` / `paginationNextText` | `string` | `'上一页'` / `'下一页'` | 翻页按钮文字。 |
| `paginationPageLabel` | `string` | `'第'` | 页码按钮的无障碍标签前缀。 |
| `hidePaginationOnSinglePage` | `boolean` | `false` | 只有一页时隐藏分页导航。 |
| `loading` | `boolean` | `false` | 显示加载遮罩并禁用交互。 |
| `loadingText` | `string` | `'Loading…'` | 加载提示。 |

## TableColumn Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `prop` | `string` | `undefined` | 数据字段名。 |
| `label` | `string` | `undefined` | 表头文本。 |
| `width` | `string \| number` | `undefined` | 列宽度。 |
| `align` | `'left' \| 'center' \| 'right'` | `undefined` | 对齐方式。 |
| `headerAlign` | `'left' \| 'center' \| 'right'` | `align` | `left \| center \| right`，默认沿用 `align`。 |
| `type` | `'default' \| 'selection' \| 'index'` | `'default'` | `default`、`selection` 或 `index`；后两者默认列宽 56px。 |
| `index` | `number \| ((index: number) => number \| string)` | `1` | 序号起始值（默认 1），或 `(index) => number \| string`。 |
| `sortable` | `boolean \| 'custom'` | `false` | `boolean \| 'custom'`，默认关闭；排序列需要 `prop`。 |
| `sortMethod` | `(a, b) => number` | `undefined` | 自定义比较函数，返回数字，降序自动反转结果。 |
| `selectable` | `(row, index) => boolean` | `undefined` | 是否允许选中，默认允许；index 为原始数据索引。 |
| `formatter` | `(row, column, value, index) => VNodeChild` | `undefined` | 格式化内容，可返回 VNode。 |
| `showOverflowTooltip` | `boolean` | `false` | 单行省略，鼠标悬停通过原生 title 显示原始字段值。 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| `default` | 表格列声明。 |
| `[prop]` | 与列 `prop` 同名的自定义单元格插槽，参数为 `{ row, index }`。 |
| `empty` | 自定义空状态，覆盖 emptyText。 |
| `TableColumn.default` | 自定义单元格：{ row, column, index, $index }。 |
| `TableColumn.header` | 自定义列头：{ column }。 |

## 样式变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--epx-table-cell-padding` | `14px 16px` | 单元格内边距，窄屏默认 12px 10px。 |
| `--epx-table-header-bg` | `var(--epx-fill-color-light)` | 表头背景。 |
| `--epx-table-row-hover-bg` | `var(--epx-color-primary-light-9)` | 悬停或包含键盘焦点的行背景。 |
| `--epx-table-stripe-bg` | `var(--epx-fill-color-lighter)` | 斑马纹行背景。 |

## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `sort-change` | `{ prop, order }` | 排序状态变化。 |
| `selection-change` | `rows` | 多选结果变化。 |
| `select` | `rows, row` | 切换行勾选时触发。 |
| `select-all` | `rows` | 切换全选时触发。 |
| `row-click` | `row, index, event` | 点击行，索引为显示索引；复选框点击不触发。 |
| `current-change` | `row, oldRow` | 当前行变化；同 key 数据替换也触发，清空为 null。 |
| `update:currentPage` | `page` | 页码变化时同步 `v-model:current-page`。 |
| `page-change` | `page` | 页码变化或数据收缩导致页码修正。 |

## 方法

| 方法名 | 签名 | 说明 |
| --- | --- | --- |
| `sort` | `(prop, order)` | 设置排序。 |
| `clearSort` | `()` | 恢复传入数据顺序。 |
| `toggleRowSelection` | `(row, selected?)` | 切换行勾选，遵守 selectable，也触发 select。 |
| `toggleAllSelection` | `()` | 切换可选行的全选状态。 |
| `clearSelection` | `()` | 清空多选。 |
| `getSelectionRows` | `() => TableRow[]` | 读取多选结果。 |
| `setCurrentRow` | `(row?)` | 设置当前行，按 rowKey 匹配；省略参数清空。 |

多选建议设置唯一、稳定的 `row-key`。同 key 数据对象更新后保留选择，移出 `data` 的行自动清除选择。内置分页跨页保留选择；未设置 row-key 时按对象身份跟踪选择。全选只作用于当前页允许选择的行。

## 使用建议

- 为列设置清晰的标题和适合内容的宽度，避免表格在窄屏中难以扫描。
- 排序或筛选后保持行标识稳定，使选择状态对应正确数据。
