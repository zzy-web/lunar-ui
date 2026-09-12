# Dropdown 下拉菜单

将次要操作收纳到菜单，支持禁用项、分组分隔线、危险操作样式以及完整键盘导航。

<script setup>
import { ref } from 'vue'
const command = ref('尚未选择')
const visible = ref(false)
const options = [
  { label: '编辑', command: 'edit' },
  { label: '复制链接', command: 'copy' },
  { label: '归档（不可用）', command: 'archive', disabled: true },
  { label: '删除', command: 'delete', danger: true, divided: true }
]
</script>

## 基础用法

通过 `options` 配置操作。点击菜单项触发 `command`，示例仅显示所选命令，不执行删除等操作。

<DemoBlock>
  <lu-dropdown :options="options" label="更多操作" @command="value => command = value" />
  <span role="status">当前命令：{{ command }}</span>
  <template #source>

```vue
<script setup>
const options = [
  { label: '编辑', command: 'edit' },
  { label: '复制链接', command: 'copy' },
  { label: '归档', command: 'archive', disabled: true },
  { label: '删除', command: 'delete', danger: true, divided: true }
]
</script>
<template>
  <lu-dropdown :options="options" label="更多操作" @command="value => console.log(value)" />
</template>
```

  </template>
</DemoBlock>

## 尺寸与禁用

菜单触发器与 Button 使用相同的尺寸和状态样式。默认插槽用于按钮内部的文字或图标，请勿再嵌套按钮、链接或其他交互控件。

<DemoBlock>
  <lu-dropdown :options="options" size="small">小号菜单</lu-dropdown>
  <lu-dropdown :options="options">默认菜单</lu-dropdown>
  <lu-dropdown :options="options" size="large">大号菜单</lu-dropdown>
  <lu-dropdown :options="options" disabled>禁用菜单</lu-dropdown>
  <template #source>

```vue
<lu-dropdown :options="options" size="small">小号菜单</lu-dropdown>
<lu-dropdown :options="options">默认菜单</lu-dropdown>
<lu-dropdown :options="options" size="large">大号菜单</lu-dropdown>
<lu-dropdown :options="options" disabled>禁用菜单</lu-dropdown>
```

  </template>
</DemoBlock>

## 自定义菜单项与受控状态

`item` 插槽接收 `option`，用来补充图标或快捷键。设置 `hide-on-click=false` 后，选择操作时保持菜单显示；点击外部、Escape 或 Tab 仍会关闭。

<DemoBlock>
  <lu-dropdown v-model:visible="visible" :options="options" :hide-on-click="false" placement="bottom-end"
    @command="value => command = value">
    操作列表
    <template #item="{ option }">
      <span style="flex: 1">{{ option.label }}</span>
      <span v-if="option.command === 'edit'" style="font-size: 12px; opacity: .7">⌘ E</span>
    </template>
  </lu-dropdown>
  <span>菜单{{ visible ? '已展开' : '已关闭' }}</span>
  <template #source>

```vue
<lu-dropdown v-model:visible="visible" :options="options" :hide-on-click="false" placement="bottom-end">
  操作列表
  <template #item="{ option }">
    <span style="flex: 1">{{ option.label }}</span>
    <span v-if="option.command === 'edit'">⌘ E</span>
  </template>
</lu-dropdown>
```

  </template>
</DemoBlock>

## 空状态

<DemoBlock>
  <lu-dropdown :options="[]" label="暂无操作" empty-text="当前没有可用操作" />
  <template #source>

```vue
<lu-dropdown :options="[]" label="暂无操作" empty-text="当前没有可用操作" />
```

  </template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `DropdownOption[]` | `[]` | 菜单项，command 必须唯一。 |
| `label` | `string` | `'Actions'` | 触发按钮文字，默认插槽优先。 |
| `disabled` | `boolean` | `false` | 禁用整个菜单。 |
| `visible` | `boolean` | `undefined` | 受控显示状态，支持 `v-model:visible`。 |
| `hideOnClick` | `boolean` | `true` | 选择菜单项后关闭。 |
| `placement` | `FloatingPlacement` | `'bottom-start'` | 与 Tooltip 相同的 12 种方向和对齐。空间不足时自动翻转。 |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | 触发按钮和菜单项尺寸。 |
| `offset` | `number` | `6` | 菜单与触发器的间距，像素。 |
| `teleported` | `boolean` | `true` | 浮层挂到 body，避免滚动容器裁切。 |
| `emptyText` | `string` | `'No actions'` | 空菜单说明，empty 插槽优先。 |

## DropdownOption

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | 必填 | 菜单项文字。 |
| `command` | `string \| number` | 必填 | 唯一命令标识，数字 0 有效。 |
| `disabled` | `boolean` | `false` | 禁用菜单项，键盘导航跳过。 |
| `divided` | `boolean` | `false` | 在此项前显示分隔线。 |
| `danger` | `boolean` | `false` | 危险操作配色，仅影响外观。 |

## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `command` | `(command, option)` | 选择可用项时触发，不自动执行任何业务操作。 |
| `update:visible` | `(visible: boolean)` | 请求更新菜单显示状态。 |
| `visible-change` | `(visible: boolean)` | 实际显示状态变化后触发。 |

## 插槽

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `default` | — | 触发按钮内的文字或图标。 |
| `item` | `{ option: DropdownOption }` | 菜单项内部内容，避免嵌套交互元素。 |
| `empty` | — | 空菜单内容。 |

## 方法

| 方法名 | 签名 | 说明 |
| --- | --- | --- |
| `handleOpen` | `() => void` | 打开菜单，聚焦第一个可用项。 |
| `handleClose` | `() => void` | 关闭菜单，焦点返回触发按钮。 |

## 键盘与浮层

触发按钮支持 Enter / Space；↓ 打开并聚焦首项，↑ 打开并聚焦末项。菜单中 ↑/↓ 循环移动并跳过禁用项，Home/End 跳到首末项，Enter/Space 执行选项。Escape 关闭并返回触发器；Tab 关闭并继续正常页面导航。点击或聚焦外部也会关闭。

菜单提供 `menu` / `menuitem` 语义，并关联触发器。浮层在滚动、窗口缩放与内容尺寸变化时重新定位，超高菜单内部可滚动。默认传送至 body，主题变量建议在 `:root` 或 `html.dark` 定义。SSR 初始受控显示应在客户端挂载后开启。
