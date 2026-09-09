import assert from 'node:assert/strict'
import { createRenderer, h, nextTick, ref } from 'vue'
import LunarUI, { LuCheckbox, LuSwitch, LuTag, EpxCheckbox, EpxSwitch, EpxTag } from '../dist/index.js'

const renderer = createRenderer({
  createElement: type => ({ type, props: {}, children: [] }),
  createText: text => ({ text }), createComment: text => ({ text }),
  setText: (node, text) => { node.text = text },
  setElementText: (node, text) => { node.text = text },
  patchProp: (node, key, prev, value) => { node.props[key] = value },
  insert: (node, parent) => { parent.children.push(node); node.parent = parent },
  remove: node => { const list = node.parent.children; list.splice(list.indexOf(node), 1) },
  parentNode: node => node.parent, nextSibling: () => null
})
function mount(component, props) {
  const root = { children: [] }
  const app = renderer.createApp({ render: () => h(component, props) })
  app.mount(root)
  return { root, app }
}
assert.equal(LuCheckbox, EpxCheckbox)
assert.equal(LuSwitch, EpxSwitch)
assert.equal(LuTag, EpxTag)
const registered = []
LunarUI.install({ component: name => registered.push(name) })
for (const name of ['LuCheckbox', 'LuSwitch', 'LuTag']) assert.ok(registered.includes(name))
for (const component of [LuCheckbox, LuSwitch]) {
  const updates = [], changes = []
  const { root, app } = mount(component, { modelValue: false, 'aria-label': 'Example', 'onUpdate:modelValue': v => updates.push(v), onChange: v => changes.push(v) })
  const control = component === LuCheckbox ? root.children[0].children.find(n => n.type === 'input') : root.children[0]
  assert.equal(control.props['aria-label'], 'Example')
  if (component === LuCheckbox) control.props.onChange({ target: { checked: true } })
  else { assert.equal(control.props.role, 'switch'); control.props.onClick() }
  assert.deepEqual(updates, [true]); assert.deepEqual(changes, [true]); app.unmount()
  const blocked = mount(component, { disabled: true, 'onUpdate:modelValue': () => assert.fail('disabled update') })
  const disabled = component === LuCheckbox ? blocked.root.children[0].children.find(n => n.type === 'input') : blocked.root.children[0]
  assert.equal(disabled.props.disabled, true)
  if (component === LuCheckbox) disabled.props.onChange({ target: { checked: true } })
  else disabled.props.onClick()
  blocked.app.unmount()
}
const loading = mount(LuSwitch, { loading: true, 'onUpdate:modelValue': () => assert.fail('loading update') })
loading.root.children[0].props.onClick(); assert.equal(loading.root.children[0].props.disabled, true)
loading.app.unmount()
const checked = ref(false), indeterminate = ref(true), root = { children: [] }
const app = renderer.createApp({ render: () => h(LuCheckbox, { modelValue: checked.value, indeterminate: indeterminate.value }) })
app.mount(root)
const input = root.children[0].children.find(n => n.type === 'input')
assert.equal(input.props.indeterminate, true)
checked.value = true; indeterminate.value = false; await nextTick()
assert.equal(input.props.checked, true); assert.equal(input.props.indeterminate, false); app.unmount()
let closed = 0
const tag = mount(LuTag, { closable: true, closeLabel: 'Remove item', onClose: () => closed++ })
const close = tag.root.children[0].children.find(n => n.type === 'button')
assert.equal(close.props['aria-label'], 'Remove item')
close.props.onClick({ stopPropagation() {} })
assert.equal(closed, 1); assert.equal(tag.root.children.length, 1); tag.app.unmount()
console.log('Passed: exports, registration, controlled updates, disabled/loading guards, indeterminate state, tag close event.')
