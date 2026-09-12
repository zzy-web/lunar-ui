# Tree 树形控件

展示目录、组织架构等层级数据，支持节点展开、当前节点、复选框联动和键盘导航。

<script setup>
import { ref } from 'vue'
const tree = ref()
const filterText = ref('')
const selected = ref([])
const data = [
  { id: 'design', label: '设计资源', children: [
    { id: 'colors', label: '色彩规范' },
    { id: 'icons', label: '图标库' }
  ] },
  { id: 'components', label: '组件', children: [
    { id: 'basic', label: '基础组件', children: [
      { id: 'button', label: 'Button 按钮' },
      { id: 'tag', label: 'Tag 标签' }
    ] },
    { id: 'legacy', label: '旧版组件（禁用）', disabled: true }
  ] }
]
const customData = [{ key: 0, name: '项目', items: [{ key: 1, name: '文档' }, { key: 2, name: '归档', locked: true }] }]
</script>

## 基础用法

`data` 使用 `id`、`label`、`children` 字段。所有层级的节点必须具有唯一的字符串或数字 key；数字 `0` 有效。缺少 key 或重复 key 会抛出错误。点击节点切换展开并设置当前节点；箭头只控制展开。

<DemoBlock direction="column">
  <lu-tree :data="data" :default-expanded-keys="['design']" aria-label="资源目录" />
  <template #source>

```vue
<script setup>
const data = [
  { id: 'design', label: '设计资源', children: [
    { id: 'colors', label: '色彩规范' },
    { id: 'icons', label: '图标库' }
  ] }
]
</script>

<template>
  <lu-tree :data="data" :default-expanded-keys="['design']" aria-label="资源目录" />
</template>
```

  </template>
</DemoBlock>

## 复选框与半选

`show-checkbox` 开启复选框，默认父子联动。选中父节点会勾选可用后代，部分子节点勾选时父节点半选。禁用节点及其后代不能选中，不参与父节点的全选计算，但仍可展开查看。复选框不会改变当前节点或展开状态。

<DemoBlock direction="column">
  <lu-tree ref="tree" :data="data" show-checkbox default-expand-all :default-checked-keys="['colors']"
    :expand-on-click-node="false" @check="(_, state) => selected = state.checkedKeys" />
  <div style="display: flex; gap: 8px">
    <lu-button size="small" @click="tree.setCheckedKeys([]); selected = []">清空勾选</lu-button>
    <lu-button size="small" @click="selected = tree.getCheckedKeys(true)">读取叶节点</lu-button>
  </div>
  <p>最近读取的 key：{{ selected.join(', ') || '无' }}</p>
  <template #source>

```vue
<lu-tree ref="tree" :data="data" show-checkbox default-expand-all
  :default-checked-keys="['colors']" :expand-on-click-node="false"
  @check="(data, state) => console.log(state.checkedKeys, state.halfCheckedKeys)" />
<!-- tree.value.getCheckedKeys(true) 读取叶节点；tree.value.setCheckedKeys([]) 清空 -->
```

  </template>
</DemoBlock>

## 独立勾选

开启 `check-strictly` 后，父子勾选互不影响，不产生半选状态。

<DemoBlock direction="column">
  <lu-tree :data="data" show-checkbox check-strictly default-expand-all :default-checked-keys="['components']" />
  <template #source>

```vue
<lu-tree :data="data" show-checkbox check-strictly default-expand-all
  :default-checked-keys="['components']" />
```

  </template>
</DemoBlock>

## 自定义字段和节点内容

使用 `node-key` 指定 key 字段，`props` 映射标签、子节点和禁用字段。默认插槽接收 `{ data, node }`，`node` 包含 key、标签、层级和子节点等信息。节点内的操作按钮可用 `@click.stop` 阻止触发节点选择。

<DemoBlock direction="column">
  <lu-tree :data="customData" node-key="key" :props="{ label: 'name', children: 'items', disabled: 'locked' }" default-expand-all :current-node-key="0">
    <template #default="{ node }">
      <span>{{ node.label }}</span>
      <lu-tag v-if="node.children.length" size="small" style="margin-left: 8px">{{ node.children.length }}</lu-tag>
    </template>
  </lu-tree>
  <template #source>

```vue
<lu-tree :data="customData" node-key="key"
  :props="{ label: 'name', children: 'items', disabled: 'locked' }"
  default-expand-all :current-node-key="0">
  <template #default="{ node }">
    <span>{{ node.label }}</span>
    <lu-tag v-if="node.children.length" size="small">{{ node.children.length }}</lu-tag>
  </template>
</lu-tree>
```

  </template>
</DemoBlock>

## 空状态

<DemoBlock direction="column">
  <lu-tree :data="[]" empty-text="暂无目录" />
  <template #source>

```vue
<lu-tree :data="[]" empty-text="暂无目录" />
<!-- 也可通过 #empty 插槽自定义空状态 -->
```

  </template>
</DemoBlock>

## 搜索节点

将搜索框绑定到 `filter-text`，默认按映射后的节点标签进行不区分大小写的包含匹配。保留匹配节点及其祖先，并自动展开祖先路径；清空搜索后恢复原来的展开状态。搜索不会清空当前节点和勾选状态，父子勾选仍作用于完整子树（包括隐藏节点）。无匹配结果时显示 `empty-text` / `empty` 插槽。

<DemoBlock direction="column">
  <lu-input v-model="filterText" clearable placeholder="Search" aria-label="Search tree" />
  <lu-tree :data="data" :filter-text="filterText" />
  <template #source>

```vue
<script setup>
import { ref } from 'vue'
const filterText = ref('')
</script>

<template>
  <lu-input v-model="filterText" clearable placeholder="Search" />
  <lu-tree :data="data" :filter-text="filterText" />
</template>
```

  </template>
</DemoBlock>

也可通过组件 ref 调用 `filter(value: string)`。使用 `filter-node-method(value, data, node)` 自定义匹配，返回布尔值。纯空白查询视为清空，回调接收去除首尾空白后的文本；数据更新会重新应用当前搜索。

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `TreeData[]` | `[]` | 节点数据，默认 `[]`。 |
| `nodeKey` | `string` | `'id'` | 唯一 key 字段，默认 `id`。 |
| `props` | `TreeFieldNames` | `{ label: 'label', children: 'children', disabled: 'disabled' }` | 字段映射，默认 `{ label: 'label', children: 'children', disabled: 'disabled' }`。 |
| `showCheckbox` | `boolean` | `false` | 显示复选框，默认 `false`。 |
| `checkStrictly` | `boolean` | `false` | 父子独立勾选，默认 `false`。 |
| `defaultExpandAll` | `boolean` | `false` | 初始化展开全部节点，默认 `false`。 |
| `defaultExpandedKeys` | `TreeKey[]` | `[]` | 初始展开的 key，默认 `[]`，同时展开其祖先。 |
| `defaultCheckedKeys` | `TreeKey[]` | `[]` | 初始勾选的 key，默认 `[]`，忽略禁用节点和不存在的 key。 |
| `currentNodeKey` | `TreeKey \| null` | `undefined` | 初始化及值变化时设置当前节点，`null` 清空；用户点击仍可切换。 |
| `highlightCurrent` | `boolean` | `true` | 高亮当前节点，默认 `true`。 |
| `expandOnClickNode` | `boolean` | `true` | 点击标签切换展开，默认 `true`；关闭后仍可使用箭头展开。 |
| `indent` | `number` | `18` | 每级缩进像素，默认 `18`。 |
| `emptyText` | `string` | `'No Data'` | 空状态文本，默认 `No Data`。 |
| `ariaLabel` | `string` | `'Tree'` | 树的无障碍名称，默认 `Tree`。 |

默认展开和勾选仅在初始化时应用。数据更新时保留仍存在的 key，移除失效状态并重新计算父节点；新增节点默认未勾选。同 key 数据替换后查询方法返回新数据。组件不会修改传入的节点数据。

## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `node-click` | `data, node` | 点击可用节点。 |
| `node-expand` | `data, node` | 切换展开状态。 |
| `node-collapse` | `data, node` | 切换展开状态。 |
| `current-change` | `data, node` | 当前 key 变化，清空时两个参数均为 `null`。 |
| `check` | `data, state` | 用户通过复选框或空格勾选，`state` 包含 `checkedKeys`、`checkedNodes`、`halfCheckedKeys`、`halfCheckedNodes`。 |
| `check-change` | `data, checked, indeterminate` | 每个勾选或半选状态变化的节点，包括联动节点；方法调用也触发，初始化不触发。 |

## 方法

| 方法名 | 签名 | 说明 |
| --- | --- | --- |
| `getCheckedKeys` | `(leafOnly?: boolean) => TreeKey[]` | 读取勾选 key，可仅返回叶节点。 |
| `getCheckedNodes` | `(leafOnly?: boolean) => TreeData[]` | 读取勾选节点数据。 |
| `getHalfCheckedKeys` | `() => TreeKey[]` | 读取半选 key。 |
| `getHalfCheckedNodes` | `() => TreeData[]` | 读取半选节点数据。 |
| `setCheckedKeys` | `(keys: TreeKey[]) => void` | 设置勾选 key，传入 [] 清空。 |
| `setChecked` | `(key: TreeKey, checked: boolean) => void` | 设置单个节点勾选状态，遵守禁用和联动配置。 |
| `getCurrentKey` | `() => TreeKey \| null` | 读取当前 key。 |
| `getCurrentNode` | `() => TreeData \| null` | 读取当前节点数据。 |
| `setCurrentKey` | `(key?: TreeKey \| null) => void` | 设置当前节点，省略参数清空。 |

通过组件 ref 调用 `getCheckedKeys(leafOnly?)`、`getCheckedNodes(leafOnly?)`、`getHalfCheckedKeys()`、`getHalfCheckedNodes()`、`setCheckedKeys(keys)`、`setChecked(key, checked)`、`getCurrentKey()`、`getCurrentNode()`、`setCurrentKey(key?)`。设置方法遵守禁用状态；`setCheckedKeys([])` 清空勾选，`setCurrentKey()` 清空当前节点。

## 插槽

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `{ data: TreeData, node: TreeNode }` | 自定义节点内容。 |
| `empty` | — | 自定义空状态，覆盖 emptyText。 |

默认插槽接收 `{ data, node }`；`empty` 插槽覆盖空状态文本。导出 `TreeKey`、`TreeData`、`TreeNode`、`TreeFieldNames`、`TreeCheckState` 类型，兼容 `EpxTree` 别名。

## 键盘与主题

Tab 进入树，↑/↓ 移动焦点，→ 展开或进入子节点，← 收起或返回父节点，Home/End 跳到首末可见节点，Enter 激活节点，空格切换勾选（无复选框时激活）。禁用节点可获得焦点并展开查看，但不能选中。插槽内控件保留自己的键盘操作。

组件使用 `tree` / `treeitem` 语义，提供层级、展开、选中和半选状态。使用 `--epx-tree-node-height`（默认沿用 `--epx-control-height`，即 `32px`）、`--epx-tree-node-hover-bg`、`--epx-tree-current-bg` 调整外观，颜色随明暗主题变化。复选框与 Checkbox、Table 共享外观，禁用节点仍保持清晰的文字与边框。
