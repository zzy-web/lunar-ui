<template>
  <div class="epx-tree" role="tree" :aria-label="ariaLabel" :aria-multiselectable="showCheckbox || undefined">
    <div v-for="node in visibleNodes" :key="node.key"
      :ref="element => setElement(node.key, element)"
      class="epx-tree__node" :class="{ 'is-current': highlightCurrent && currentKey === node.key, 'is-disabled': node.disabled }"
      role="treeitem" :aria-label="node.label" :aria-level="node.level"
      :aria-posinset="node.index + 1" :aria-setsize="node.siblingCount"
      :aria-expanded="node.children.length ? activeExpanded.has(node.key) : undefined"
      :aria-selected="currentKey === node.key" :aria-disabled="node.disabled || undefined"
      :aria-checked="showCheckbox ? (halfChecked.has(node.key) ? 'mixed' : checked.has(node.key)) : undefined"
      :tabindex="focusKey === node.key ? 0 : -1" :style="{ paddingInlineStart: `${(node.level - 1) * indent + 8}px` }"
      @focus="focusKey = node.key" @click="activate(node)" @keydown="onKeydown($event, node)">
      <button v-if="node.children.length" class="epx-tree__toggle" type="button" tabindex="-1"
        :aria-label="`${activeExpanded.has(node.key) ? 'Collapse' : 'Expand'} ${node.label}`"
        :aria-expanded="activeExpanded.has(node.key)" @click.stop="toggleExpand(node)">
        <svg viewBox="0 0 16 16" aria-hidden="true" :class="{ 'is-expanded': activeExpanded.has(node.key) }"><path d="m6 3 5 5-5 5" /></svg>
      </button>
      <span v-else class="epx-tree__spacer" aria-hidden="true" />
      <input v-if="showCheckbox" class="epx-tree__checkbox" type="checkbox" tabindex="-1"
        :aria-label="node.label" :checked="checked.has(node.key)" :indeterminate="halfChecked.has(node.key)"
        :disabled="node.disabled" @click.stop @change="checkNode(node, ($event.target as HTMLInputElement).checked)" />
      <span class="epx-tree__label"><slot :node="node" :data="node.data">{{ node.label }}</slot></span>
    </div>
    <div v-if="!visibleNodes.length" class="epx-tree__empty"><slot name="empty">{{ emptyText }}</slot></div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { TreeKey, TreeData, TreeFieldNames, TreeNode, TreeCheckState } from './types'

defineOptions({ name: 'LuTree' })
const props = withDefaults(defineProps<{
  data?: TreeData[]
  nodeKey?: string
  props?: TreeFieldNames
  showCheckbox?: boolean
  checkStrictly?: boolean
  defaultExpandAll?: boolean
  defaultExpandedKeys?: TreeKey[]
  defaultCheckedKeys?: TreeKey[]
  currentNodeKey?: TreeKey | null
  highlightCurrent?: boolean
  expandOnClickNode?: boolean
  indent?: number
  emptyText?: string
  filterText?: string
  filterNodeMethod?: (value: string, data: TreeData, node: TreeNode) => boolean
  ariaLabel?: string
}>(), {
  data: () => [], nodeKey: 'id', props: () => ({}), defaultExpandedKeys: () => [],
  defaultCheckedKeys: () => [], highlightCurrent: true, expandOnClickNode: true,
  filterText: '', indent: 18, emptyText: 'No Data', ariaLabel: 'Tree'
})
const emit = defineEmits<{
  'node-click': [data: TreeData, node: TreeNode]
  'node-expand': [data: TreeData, node: TreeNode]
  'node-collapse': [data: TreeData, node: TreeNode]
  'current-change': [data: TreeData | null, node: TreeNode | null]
  'check': [data: TreeData, state: TreeCheckState]
  'check-change': [data: TreeData, checked: boolean, indeterminate: boolean]
}>()
const nodes = computed(() => {
  const keys = new Set<TreeKey>()
  function build(data: TreeData[], parentKey: TreeKey | null, level: number, disabled = false): TreeNode[] {
    return data.map((item, index) => {
      const key = item[props.nodeKey]
      if ((typeof key !== 'string' && typeof key !== 'number') || (typeof key === 'number' && !Number.isFinite(key))) {
        throw new Error(`[LuTree] Each node needs a string or finite number in "${props.nodeKey}".`)
      }
      if (keys.has(key)) throw new Error(`[LuTree] Duplicate node key: ${key}`)
      keys.add(key)
      const children = item[props.props.children ?? 'children']
      const node: TreeNode = {
        key, data: item, label: String(item[props.props.label ?? 'label'] ?? ''), parentKey, level,
        disabled: disabled || Boolean(item[props.props.disabled ?? 'disabled']), children: [], index, siblingCount: data.length
      }
      node.children = build(Array.isArray(children) ? children : [], key, level + 1, node.disabled)
      return node
    })
  }
  return build(props.data, null, 1)
})
const allNodes = computed(() => {
  const result: TreeNode[] = []
  function visit(list: TreeNode[]) { list.forEach(node => { result.push(node); visit(node.children) }) }
  visit(nodes.value)
  return result
})
const nodeMap = computed(() => new Map(allNodes.value.map(node => [node.key, node])))
const expanded = ref(new Set<TreeKey>())
const query = ref(props.filterText)
watch(() => props.filterText, value => { query.value = value })
function filter(value: string) { query.value = value }
const filtering = computed(() => query.value.trim().length > 0)
const filteredKeys = computed(() => {
  const keys = new Set<TreeKey>()
  if (!filtering.value) return keys
  const value = query.value.trim()
  function visit(node: TreeNode): boolean {
    const matches = props.filterNodeMethod
      ? props.filterNodeMethod(value, node.data, node)
      : node.label.toLowerCase().includes(value.toLowerCase())
    const childMatches = node.children.map(visit).some(Boolean)
    if (matches || childMatches) keys.add(node.key)
    return matches || childMatches
  }
  nodes.value.forEach(visit)
  return keys
})
const searchExpanded = ref(new Set<TreeKey>())
watch(filteredKeys, keys => {
  searchExpanded.value = new Set(allNodes.value.filter(node =>
    node.children.some(child => keys.has(child.key))).map(node => node.key))
}, { immediate: true })
const activeExpanded = computed(() => filtering.value ? searchExpanded.value : expanded.value)
const checked = ref(new Set<TreeKey>())
const halfChecked = ref(new Set<TreeKey>())
const currentKey = ref<TreeKey | null>(null)
const focusKey = ref<TreeKey | null>(null)
const elements = new Map<TreeKey, HTMLElement>()
function setElement(key: TreeKey, element: Element | ComponentPublicInstance | null) {
  if (element) elements.set(key, element as HTMLElement)
  else elements.delete(key)
}
const visibleNodes = computed(() => {
  const result: TreeNode[] = []
  function visit(list: TreeNode[]) {
    list.forEach(node => {
      if (filtering.value && !filteredKeys.value.has(node.key)) return
      result.push(node)
      if (activeExpanded.value.has(node.key)) visit(node.children)
    })
  }
  visit(nodes.value)
  return result
})
function setSubtree(node: TreeNode, value: boolean, keys: Set<TreeKey>) {
  if (node.disabled) return
  if (value) keys.add(node.key)
  else keys.delete(node.key)
  if (!props.checkStrictly) node.children.forEach(child => setSubtree(child, value, keys))
}
function normalize(keys: Set<TreeKey>) {
  const half = new Set<TreeKey>()
  if (!props.checkStrictly) {
    for (const node of [...allNodes.value].reverse()) {
      const children = node.children.filter(child => !child.disabled)
      if (node.disabled || !children.length) continue
      if (children.every(child => keys.has(child.key))) keys.add(node.key)
      else {
        keys.delete(node.key)
        if (children.some(child => keys.has(child.key) || half.has(child.key))) half.add(node.key)
      }
    }
  }
  return { keys, half }
}
function applyChecks(keys: Set<TreeKey>, notify = true) {
  const state = normalize(keys)
  const previous = checked.value, previousHalf = halfChecked.value
  checked.value = state.keys
  halfChecked.value = state.half
  if (notify) allNodes.value.forEach(node => {
    if (previous.has(node.key) !== state.keys.has(node.key) || previousHalf.has(node.key) !== state.half.has(node.key)) {
      emit('check-change', node.data, state.keys.has(node.key), state.half.has(node.key))
    }
  })
}
function getCheckedKeys(leafOnly = false): TreeKey[] {
  return allNodes.value.filter(node => checked.value.has(node.key) && (!leafOnly || !node.children.length)).map(node => node.key)
}
function getCheckedNodes(leafOnly = false): TreeData[] { return getCheckedKeys(leafOnly).map(key => nodeMap.value.get(key)!.data) }
function getHalfCheckedKeys(): TreeKey[] { return allNodes.value.filter(node => halfChecked.value.has(node.key)).map(node => node.key) }
function getHalfCheckedNodes(): TreeData[] { return getHalfCheckedKeys().map(key => nodeMap.value.get(key)!.data) }
function setCheckedKeys(keys: TreeKey[]) {
  const next = new Set<TreeKey>()
  keys.forEach(key => { const node = nodeMap.value.get(key); if (node) setSubtree(node, true, next) })
  applyChecks(next)
}
function setChecked(key: TreeKey, value: boolean) {
  const node = nodeMap.value.get(key)
  if (!node || node.disabled) return
  const next = new Set(checked.value)
  setSubtree(node, value, next)
  applyChecks(next)
}
function checkNode(node: TreeNode, value: boolean) {
  if (node.disabled) return
  focusNode(node.key)
  setChecked(node.key, value)
  emit('check', node.data, {
    checkedKeys: getCheckedKeys(), checkedNodes: getCheckedNodes(),
    halfCheckedKeys: getHalfCheckedKeys(), halfCheckedNodes: getHalfCheckedNodes()
  })
}
function setCurrentKey(key: TreeKey | null = null) {
  const node = key == null ? undefined : nodeMap.value.get(key)
  const next = node && !node.disabled ? node.key : null
  if (next === currentKey.value) return
  currentKey.value = next
  emit('current-change', next == null ? null : node!.data, next == null ? null : node!)
}
function getCurrentKey() { return currentKey.value }
function getCurrentNode() { return currentKey.value == null ? null : nodeMap.value.get(currentKey.value)?.data ?? null }
function toggleExpand(node: TreeNode) {
  if (!node.children.length) return
  focusNode(node.key)
  if (activeExpanded.value.has(node.key)) {
    let focused = focusKey.value == null ? undefined : nodeMap.value.get(focusKey.value)
    while (focused?.parentKey != null) {
      if (focused.parentKey === node.key) { focusNode(node.key); break }
      focused = nodeMap.value.get(focused.parentKey)
    }
    activeExpanded.value.delete(node.key)
    emit('node-collapse', node.data, node)
  } else {
    activeExpanded.value.add(node.key)
    emit('node-expand', node.data, node)
  }
}
function activate(node: TreeNode) {
  focusNode(node.key)
  if (node.disabled) return
  setCurrentKey(node.key)
  if (props.expandOnClickNode) toggleExpand(node)
  emit('node-click', node.data, node)
}
function focusNode(key: TreeKey) {
  focusKey.value = key
  void nextTick(() => elements.get(key)?.focus())
}
function onKeydown(event: KeyboardEvent, node: TreeNode) {
  // Leave controls supplied by the node slot in charge of their own keyboard events.
  if (event.target !== event.currentTarget) return
  const index = visibleNodes.value.findIndex(item => item.key === node.key)
  let target: TreeNode | undefined
  switch (event.key) {
    case 'ArrowDown': target = visibleNodes.value[index + 1]; break
    case 'ArrowUp': target = visibleNodes.value[index - 1]; break
    case 'Home': target = visibleNodes.value[0]; break
    case 'End': target = visibleNodes.value[visibleNodes.value.length - 1]; break
    case 'ArrowRight':
      if (node.children.length && !activeExpanded.value.has(node.key)) toggleExpand(node)
      else target = node.children.find(child => !filtering.value || filteredKeys.value.has(child.key))
      break
    case 'ArrowLeft':
      if (node.children.length && activeExpanded.value.has(node.key)) toggleExpand(node)
      else if (node.parentKey != null) target = nodeMap.value.get(node.parentKey)
      break
    case 'Enter': activate(node); break
    case ' ': if (props.showCheckbox) checkNode(node, !checked.value.has(node.key)); else activate(node); break
    default: return
  }
  event.preventDefault()
  if (target) focusNode(target.key)
}
let initialized = false
watch(allNodes, list => {
  const valid = new Set(list.map(node => node.key))
  expanded.value = new Set([...expanded.value].filter(key => valid.has(key)))
  if (!initialized) {
    props.defaultExpandedKeys.forEach(key => {
      let node = nodeMap.value.get(key)
      while (node) { expanded.value.add(node.key); node = node.parentKey == null ? undefined : nodeMap.value.get(node.parentKey) }
    })
    if (props.defaultExpandAll) list.forEach(node => { if (node.children.length) expanded.value.add(node.key) })
    const initial = new Set<TreeKey>()
    props.defaultCheckedKeys.forEach(key => { const node = nodeMap.value.get(key); if (node) setSubtree(node, true, initial) })
    applyChecks(initial, false)
    initialized = true
  } else {
    applyChecks(new Set([...checked.value].filter(key => valid.has(key) && !nodeMap.value.get(key)!.disabled)))
  }
  if (currentKey.value != null && (!valid.has(currentKey.value) || nodeMap.value.get(currentKey.value)!.disabled)) setCurrentKey(null)
}, { immediate: true })
watch(() => props.checkStrictly, () => applyChecks(new Set(checked.value)))
watch(() => props.currentNodeKey, key => setCurrentKey(key ?? null), { immediate: true })
watch(visibleNodes, list => {
  if (list.some(node => node.key === focusKey.value)) return
  focusKey.value = list[0]?.key ?? null
}, { immediate: true })
defineExpose({ filter, getCheckedKeys, getCheckedNodes, getHalfCheckedKeys, getHalfCheckedNodes, setCheckedKeys, setChecked, getCurrentKey, getCurrentNode, setCurrentKey })
</script>
