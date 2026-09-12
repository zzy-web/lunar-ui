# Tree

Display folders, organization charts and other hierarchical data with expansion, current-node selection, linked checkboxes and keyboard navigation.

<script setup>
import { ref } from 'vue'
const tree = ref()
const filterText = ref('')
const selected = ref([])
const data = [
  { id: 'design', label: 'Design resources', children: [
    { id: 'colors', label: 'Colors' }, { id: 'icons', label: 'Icons' }
  ] },
  { id: 'components', label: 'Components', children: [
    { id: 'basic', label: 'Basic', children: [{ id: 'button', label: 'Button' }, { id: 'tag', label: 'Tag' }] },
    { id: 'legacy', label: 'Legacy (disabled)', disabled: true }
  ] }
]
const customData = [{ key: 0, name: 'Project', items: [{ key: 1, name: 'Docs' }, { key: 2, name: 'Archive', locked: true }] }]
</script>

## Basic usage

Nodes use `id`, `label` and `children`. Every node must have a unique string or finite numeric key across the entire tree. Zero is valid. Missing or duplicate keys throw an error. Clicking a label selects the node and toggles expansion; the arrow only toggles expansion.

<DemoBlock direction="column" source-label="View source">
  <lu-tree :data="data" :default-expanded-keys="['design']" aria-label="Resource directory" />
  <template #source>

```vue
<script setup>
const data = [{ id: 'design', label: 'Design resources', children: [
  { id: 'colors', label: 'Colors' }, { id: 'icons', label: 'Icons' }
] }]
</script>

<template>
  <lu-tree :data="data" :default-expanded-keys="['design']" aria-label="Resource directory" />
</template>
```

  </template>
</DemoBlock>

## Checkboxes

Enable `show-checkbox` for linked checking. Checking a parent checks its enabled descendants; checking some children makes their parent indeterminate. Disabled nodes and their descendants cannot be selected and are excluded from parent aggregation, but can still be expanded. Checkbox clicks do not change the current node or expansion.

<DemoBlock direction="column" source-label="View source">
  <lu-tree ref="tree" :data="data" show-checkbox default-expand-all :default-checked-keys="['colors']"
    :expand-on-click-node="false" @check="(_, state) => selected = state.checkedKeys" />
  <div style="display: flex; gap: 8px">
    <lu-button size="small" @click="tree.setCheckedKeys([]); selected = []">Clear checks</lu-button>
    <lu-button size="small" @click="selected = tree.getCheckedKeys(true)">Read checked leaves</lu-button>
  </div>
  <p>Last read keys: {{ selected.join(', ') || 'None' }}</p>
  <template #source>

```vue
<lu-tree ref="tree" :data="data" show-checkbox default-expand-all
  :default-checked-keys="['colors']" :expand-on-click-node="false"
  @check="(data, state) => console.log(state.checkedKeys, state.halfCheckedKeys)" />
<!-- tree.value.getCheckedKeys(true) reads checked leaves; setCheckedKeys([]) clears checks. -->
```

  </template>
</DemoBlock>

## Independent checking

With `check-strictly`, checking a node does not affect its parent or children, and no indeterminate states are generated.

<DemoBlock direction="column" source-label="View source">
  <lu-tree :data="data" show-checkbox check-strictly default-expand-all :default-checked-keys="['components']" />
  <template #source>

```vue
<lu-tree :data="data" show-checkbox check-strictly default-expand-all
  :default-checked-keys="['components']" />
```

  </template>
</DemoBlock>

## Custom fields and content

Use `node-key` for the key field and `props` to map other fields. The default slot receives `{ data, node }`. Use `@click.stop` on action buttons inside a node to prevent node activation.

<DemoBlock direction="column" source-label="View source">
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

## Empty state

<DemoBlock direction="column" source-label="View source">
  <lu-tree :data="[]" empty-text="No folders" />
  <template #source>

```vue
<lu-tree :data="[]" empty-text="No folders" />
<!-- Use the empty slot for custom content. -->
```

  </template>
</DemoBlock>

## Search

Bind `filter-text` to a search input. Matching is case-insensitive against the mapped label. Matching nodes and their ancestors remain visible, and ancestor paths expand automatically. Clearing the query restores the previous expansion state. Selection and checkbox state are preserved; checkbox linking still uses the full tree, including hidden nodes. Empty results use `empty-text` / the `empty` slot.

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

Use `treeRef.filter(value)` for imperative filtering. Supply `filter-node-method(value, data, node)` to customize matching. Whitespace-only queries clear the filter; the callback receives trimmed text. Data changes reapply the active filter.

## Props

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `TreeData[]` | `[]` | node data, defaults to `[]`. |
| `nodeKey` | `string` | `'id'` | unique key field, defaults to `id`. |
| `props` | `TreeFieldNames` | `{ label: 'label', children: 'children', disabled: 'disabled' }` | field mappings, defaults to `{ label: 'label', children: 'children', disabled: 'disabled' }`. |
| `showCheckbox` | `boolean` | `false` | show checkboxes, defaults to `false`. |
| `checkStrictly` | `boolean` | `false` | independent checks, defaults to `false`. |
| `defaultExpandAll` | `boolean` | `false` | initially expand every branch, defaults to `false`. |
| `defaultExpandedKeys` | `TreeKey[]` | `[]` | initially expanded keys, defaults to `[]`; ancestors are expanded too. |
| `defaultCheckedKeys` | `TreeKey[]` | `[]` | initially checked keys, defaults to `[]`; disabled and unknown keys are ignored. |
| `currentNodeKey` | `TreeKey \| null` | `undefined` | applied initially and when its value changes; `null` clears selection. Clicking can still change the current node. |
| `highlightCurrent` | `boolean` | `true` | highlight the current node, defaults to `true`. |
| `expandOnClickNode` | `boolean` | `true` | label clicks toggle expansion, defaults to `true`; arrows remain available when disabled. |
| `indent` | `number` | `18` | indentation per level in pixels, defaults to `18`. |
| `emptyText` | `string` | `'No Data'` | defaults to `No Data`. |
| `ariaLabel` | `string` | `'Tree'` | accessible tree name, defaults to `Tree`. |

Expansion and check defaults apply only on initialization. Data updates retain existing keys, remove invalid state and recalculate parents. New nodes start unchecked. Methods return fresh data after objects are replaced with the same keys. Input data is never mutated.

## Events

| Event | Parameters | Description |
| --- | --- | --- |
| `node-click` | `data, node` | enabled node activated. |
| `node-expand` | `data, node` | expansion toggled. |
| `node-collapse` | `data, node` | expansion toggled. |
| `current-change` | `data, node` | current key changed; both arguments are `null` when cleared. |
| `check` | `data, state` | a user checks via checkbox or Space. State includes `checkedKeys`, `checkedNodes`, `halfCheckedKeys` and `halfCheckedNodes`. |
| `check-change` | `data, checked, indeterminate` | each node whose checked or mixed state changed, including linked nodes and method calls. Initialization does not emit this event. |

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getCheckedKeys` | `(leafOnly?: boolean) => TreeKey[]` | Read checked keys, optionally leaves only. |
| `getCheckedNodes` | `(leafOnly?: boolean) => TreeData[]` | Read checked node data. |
| `getHalfCheckedKeys` | `() => TreeKey[]` | Read indeterminate keys. |
| `getHalfCheckedNodes` | `() => TreeData[]` | Read indeterminate node data. |
| `setCheckedKeys` | `(keys: TreeKey[]) => void` | Set checked keys; [] clears checks. |
| `setChecked` | `(key: TreeKey, checked: boolean) => void` | Set a node check, respecting disabled and linkage settings. |
| `getCurrentKey` | `() => TreeKey \| null` | Read the current key. |
| `getCurrentNode` | `() => TreeData \| null` | Read current node data. |
| `setCurrentKey` | `(key?: TreeKey \| null) => void` | Set the current node; omit the key to clear. |

Call these through a component ref: `getCheckedKeys(leafOnly?)`, `getCheckedNodes(leafOnly?)`, `getHalfCheckedKeys()`, `getHalfCheckedNodes()`, `setCheckedKeys(keys)`, `setChecked(key, checked)`, `getCurrentKey()`, `getCurrentNode()` and `setCurrentKey(key?)`. Setters respect disabled state. Use `setCheckedKeys([])` to clear checks and `setCurrentKey()` to clear the current node.

## Slots

| Slot | Scope | Description |
| --- | --- | --- |
| `default` | `{ data: TreeData, node: TreeNode }` | Custom node content. |
| `empty` | — | Custom empty state, overriding emptyText. |

The default slot receives `{ data, node }`; `empty` overrides empty text. Types `TreeKey`, `TreeData`, `TreeNode`, `TreeFieldNames` and `TreeCheckState` are exported. `EpxTree` is an alias of `LuTree`.

## Keyboard and theme

Tab enters the tree. Up/Down move focus; Right expands or enters a child; Left collapses or moves to the parent; Home/End jump to the first/last visible node. Enter activates a node. Space checks a node, or activates it without checkboxes. Disabled nodes remain focusable and expandable but cannot be selected. Controls in node slots retain their own keyboard behavior.

Tree/treeitem roles expose levels, positions, expansion, current selection and mixed checking. Customize `--epx-tree-node-height` (defaults to `--epx-control-height`, or `32px`), `--epx-tree-node-hover-bg` and `--epx-tree-current-bg`. Colors follow the light/dark theme. Checkboxes share their appearance with Checkbox and Table; disabled nodes retain readable labels and borders.
