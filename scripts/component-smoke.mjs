import assert from 'node:assert/strict'
import { createRenderer, h, nextTick, ref } from 'vue'
import LunarUI, { LuCheckbox, LuSwitch, LuTag, LuCalendar, EpxCheckbox, EpxSwitch, EpxTag, EpxCalendar } from '../dist/index.js'

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
assert.equal(LuCalendar, EpxCalendar)
const registered = []
LunarUI.install({ component: name => registered.push(name) })
for (const name of ['LuCheckbox', 'LuSwitch', 'LuTag', 'LuCalendar']) assert.ok(registered.includes(name))
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

function findAll(node, predicate) {
  return [...(predicate(node) ? [node] : []), ...(node.children ?? []).flatMap(child => findAll(child, predicate))]
}
function dateButtons(root) {
  return findAll(root, node => node.props?.class === 'epx-calendar__day')
}
function dateButton(root, day) {
  return dateButtons(root).find(node => node.props['aria-label'] === day)
}
const calendarValue = ref(new Date(2024, 1, 15, 18))
const originalTimestamp = calendarValue.value.getTime()
const changes = [], panels = [], calendarRoot = { children: [] }
const calendarApp = renderer.createApp({
  render: () => h(LuCalendar, {
    modelValue: calendarValue.value,
    disabledDate: date => date.getDate() === 20,
    'onUpdate:modelValue': date => { calendarValue.value = date },
    onChange: date => changes.push(date),
    onPanelChange: date => panels.push(date)
  })
})
calendarApp.mount(calendarRoot)
assert.equal(dateButtons(calendarRoot).length, 42)
assert.equal(dateButtons(calendarRoot)[0].props['aria-label'], '2024-01-29')
assert.ok(dateButton(calendarRoot, '2024-02-29'))
assert.equal(dateButton(calendarRoot, '2024-02-15').props['aria-pressed'], true)
assert.equal(calendarValue.value.getTime(), originalTimestamp)
assert.equal(dateButton(calendarRoot, '2024-02-20').props.disabled, true)
dateButton(calendarRoot, '2024-02-20').props.onClick()
assert.equal(changes.length, 0)
dateButton(calendarRoot, '2024-02-29').props.onClick()
await nextTick()
assert.equal(calendarValue.value.getHours(), 0)
assert.equal(calendarValue.value.getDate(), 29)
assert.equal(dateButton(calendarRoot, '2024-02-29').props['aria-pressed'], true)
dateButton(calendarRoot, '2024-03-01').props.onClick()
await nextTick()
assert.equal(panels.at(-1).getMonth(), 2)
assert.equal(changes.length, 2)
calendarValue.value = new Date(2024, 11, 31)
await nextTick()
const navigation = () => findAll(calendarRoot, node => node.type === 'button' && node.props.class !== 'epx-calendar__day')
navigation()[2].props.onClick()
await nextTick()
assert.equal(panels.at(-1).getFullYear(), 2025)
assert.equal(panels.at(-1).getMonth(), 0)
assert.equal(calendarValue.value.getMonth(), 11)
navigation()[0].props.onClick()
await nextTick()
assert.equal(panels.at(-1).getMonth(), 11)
assert.equal(panels.at(-1).getFullYear(), 2024)
navigation()[1].props.onClick()
await nextTick()
assert.ok(dateButton(calendarRoot, new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-01'))
calendarApp.unmount()
const sunday = mount(LuCalendar, { modelValue: new Date(2023, 1, 1), firstDayOfWeek: 0, locale: 'en-US' })
assert.equal(dateButtons(sunday.root)[0].props['aria-label'], '2023-01-29')
assert.equal(dateButton(sunday.root, '2023-02-29'), undefined)
assert.equal(findAll(sunday.root, node => node.type === 'th')[0].text, 'Sun')
sunday.app.unmount()
const standalone = mount(LuCalendar, {})
const standaloneDay = dateButtons(standalone.root)[10].props['aria-label']
dateButton(standalone.root, standaloneDay).props.onClick()
await nextTick()
assert.equal(dateButton(standalone.root, standaloneDay).props['aria-pressed'], true)
standalone.app.unmount()
const invalid = mount(LuCalendar, { modelValue: new Date(NaN) })
assert.equal(dateButtons(invalid.root).length, 42)
invalid.app.unmount()
const slotRoot = { children: [] }
const slotApp = renderer.createApp({ render: () => h(LuCalendar, { modelValue: new Date(2024, 1, 1) }, {
  'date-cell': ({ data }) => h('span', {}, 'Event ' + data.day),
  header: ({ title }) => h('strong', {}, title)
}) })
slotApp.mount(slotRoot)
assert.equal(findAll(slotRoot, node => node.type === 'strong').length, 1)
assert.ok(findAll(slotRoot, node => node.text === 'Event 2024-02-29').length)
slotApp.unmount()
console.log('Passed: calendar leap years, week start, disabled dates, selection, external updates, month/year navigation, uncontrolled state and slots.')
