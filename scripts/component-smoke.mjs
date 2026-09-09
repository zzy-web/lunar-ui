import assert from 'node:assert/strict'
import { createRenderer, h, nextTick, ref } from 'vue'
import LunarUI, { LuCheckbox, LuSwitch, LuTag, LuCalendar, LuInput, LuButton, LuSelect, LuRadio, LuRadioGroup, LuAlert, LuEmpty, EpxCheckbox, EpxSwitch, EpxTag, EpxCalendar, EpxSelect, EpxRadio, EpxRadioGroup, EpxAlert, EpxEmpty } from '../dist/index.js'
import { LuPagination, EpxPagination, LuProgress, EpxProgress, LuDivider, EpxDivider } from '../dist/index.js'

const renderer = createRenderer({
  createElement: type => ({
    type, tagName: type.toUpperCase(), props: {}, children: [], listeners: {},
    addEventListener(name, handler) { this.listeners[name] = handler },
    removeEventListener(name) { delete this.listeners[name] },
    focus() { this.focused = true }, blur() { this.focused = false }, select() { this.textSelected = true },
    get options() { return this.children.filter(node => node.type === 'option') },
    get selectedIndex() { return this.options.findIndex(option => option.selected) },
    set selectedIndex(index) { this.options.forEach((option, i) => { option.selected = i === index }) }
  }),
  createText: text => ({ text }), createComment: text => ({ text }),
  setText: (node, text) => { node.text = text },
  setElementText: (node, text) => { node.text = text },
  patchProp: (node, key, prev, value) => {
    node.props[key] = value
    if (['multiple', 'selected', 'disabled', 'value'].includes(key)) node[key] = value
    if (key === 'value') node._value = value
  },
  insert: (node, parent, anchor = null) => {
    if (node.parent) {
      const previous = node.parent.children.indexOf(node)
      if (previous >= 0) node.parent.children.splice(previous, 1)
    }
    const index = anchor ? parent.children.indexOf(anchor) : -1
    if (index < 0) parent.children.push(node)
    else parent.children.splice(index, 0, node)
    node.parent = parent
  },
  remove: node => { const list = node.parent.children; list.splice(list.indexOf(node), 1) },
  parentNode: node => node.parent,
  nextSibling: node => node.parent?.children[node.parent.children.indexOf(node) + 1] ?? null
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
for (const [component, alias] of [[LuSelect, EpxSelect], [LuRadio, EpxRadio], [LuRadioGroup, EpxRadioGroup], [LuAlert, EpxAlert], [LuEmpty, EpxEmpty]]) assert.equal(component, alias)
const registered = []
LunarUI.install({ component: name => registered.push(name) })
for (const name of ['LuCheckbox', 'LuSwitch', 'LuTag', 'LuCalendar', 'LuSelect', 'LuRadio', 'LuRadioGroup', 'LuAlert', 'LuEmpty']) assert.ok(registered.includes(name))
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

// Exercise Vue's select directive with the renderer host's native-event adapter.
const selectOptions = [{ label: 'One', value: 1 }, { label: 'Two', value: 2 }, { label: 'Disabled', value: 3, disabled: true }]
const selectedTeam = ref(1), teamRoot = { children: [] }, teamUpdates = []
const teamApp = renderer.createApp({
  render: () => h(LuSelect, { modelValue: selectedTeam.value, options: selectOptions, clearable: true, 'aria-label': 'Team',
    'onUpdate:modelValue': value => { selectedTeam.value = value; teamUpdates.push(value) }
  })
})
teamApp.mount(teamRoot)
const teamSelect = findAll(teamRoot, node => node.type === 'select')[0]
assert.equal(teamSelect.props['aria-label'], 'Team')
assert.equal(teamSelect.options.find(option => option._value === 1).selected, true)
for (const option of teamSelect.options) option.selected = option._value === 2
teamSelect.listeners.change()
await nextTick()
assert.equal(selectedTeam.value, 2)
assert.equal(typeof selectedTeam.value, 'number')
findAll(teamRoot, node => node.type === 'button')[0].props.onClick()
await nextTick()
assert.equal(selectedTeam.value, undefined)
assert.equal(teamSelect.focused, true)
assert.equal(teamSelect.options[0].selected, true)
teamApp.unmount()
const multi = mount(LuSelect, { modelValue: [1, 2], options: selectOptions, multiple: true, clearable: true,
  'onUpdate:modelValue': value => teamUpdates.push(value) })
const multiSelect = findAll(multi.root, node => node.type === 'select')[0]
assert.deepEqual(multiSelect.options.filter(option => option.selected).map(option => option._value), [1, 2])
for (const option of multiSelect.options) option.selected = option._value === 2
multiSelect.listeners.change()
assert.deepEqual(teamUpdates.at(-1), [2])
findAll(multi.root, node => node.type === 'button')[0].props.onClick()
assert.deepEqual(teamUpdates.at(-1), [])
multi.app.unmount()
for (const state of [{ disabled: true }, { loading: true }]) {
  const blockedSelect = mount(LuSelect, { ...state, options: selectOptions, 'onUpdate:modelValue': () => assert.fail('blocked select update') })
  const select = findAll(blockedSelect.root, node => node.type === 'select')[0]
  select.options[1].selected = true
  select.listeners.change()
  assert.equal(select.props.disabled, true)
  blockedSelect.app.unmount()
}
const radioValue = ref('first'), groupDisabled = ref(false), radioRoot = { children: [] }, radioUpdates = []
const radioApp = renderer.createApp({ render: () => h(LuRadioGroup, {
  modelValue: radioValue.value, disabled: groupDisabled.value, size: 'large',
  'aria-label': 'Plan', 'onUpdate:modelValue': value => { radioValue.value = value; radioUpdates.push(value) }
}, () => [h(LuRadio, { value: 'first', border: true }), h(LuRadio, { value: 'second' }), h(LuRadio, { value: 'third', disabled: true })]) })
radioApp.mount(radioRoot)
const radios = findAll(radioRoot, node => node.type === 'input')
assert.equal(radios[0].props.checked, true)
assert.equal(radios[0].props.name, radios[1].props.name)
radios[1].props.onChange()
await nextTick()
assert.equal(radioValue.value, 'second')
assert.equal(radios[0].props.checked, false)
radios[2].props.onChange()
assert.deepEqual(radioUpdates, ['second'])
groupDisabled.value = true
await nextTick()
assert.equal(radios[0].props.disabled, true)
radios[0].props.onChange()
assert.deepEqual(radioUpdates, ['second'])
radioApp.unmount()
const inputUpdates = [], inputChanges = []
let inputCleared = 0
const richInput = mount(LuInput, { modelValue: 'hello', clearable: true, id: 'username', name: 'username', maxlength: 20, showWordLimit: true,
  'onUpdate:modelValue': value => inputUpdates.push(value), onChange: value => inputChanges.push(value), onClear: () => inputCleared++ })
const nativeInput = findAll(richInput.root, node => node.type === 'input')[0]
assert.equal(nativeInput.props.id, 'username')
assert.equal(nativeInput.props.name, 'username')
assert.equal(nativeInput.props.maxlength, 20)
nativeInput.props.onCompositionstart()
nativeInput.props.onInput({ target: { value: '拼' }, isComposing: true })
assert.equal(inputUpdates.length, 0)
nativeInput.props.onCompositionend({ target: { value: '拼音' } })
assert.deepEqual(inputUpdates, ['拼音'])
nativeInput.props.onInput({ target: { value: '拼音' }, isComposing: false })
assert.deepEqual(inputUpdates, ['拼音'])
findAll(richInput.root, node => node.type === 'button')[0].props.onClick()
assert.equal(inputUpdates.at(-1), '')
assert.deepEqual(inputChanges, [''])
assert.equal(inputCleared, 1)
assert.equal(nativeInput.focused, true)
richInput.app.unmount()
const password = mount(LuInput, { modelValue: 'secret', showPassword: true })
const passwordInput = findAll(password.root, node => node.type === 'input')[0]
assert.equal(passwordInput.props.type, 'password')
await findAll(password.root, node => node.type === 'button')[0].props.onClick()
await nextTick()
assert.equal(passwordInput.props.type, 'text')
assert.equal(findAll(password.root, node => node.type === 'button')[0].props['aria-pressed'], true)
password.app.unmount()
const textarea = mount(LuInput, { type: 'textarea', rows: 5, readonly: true, modelValue: 'Read only', clearable: true,
  'onUpdate:modelValue': () => assert.fail('readonly update') })
const nativeTextarea = findAll(textarea.root, node => node.type === 'textarea')[0]
assert.equal(nativeTextarea.props.rows, 5)
nativeTextarea.props.onInput({ target: { value: 'changed' } })
assert.equal(findAll(textarea.root, node => node.type === 'button').length, 0)
textarea.app.unmount()
let alertClosed = 0
const alert = mount(LuAlert, { type: 'error', title: 'Failed', onClose: () => alertClosed++ })
assert.equal(findAll(alert.root, node => node.props?.role === 'alert').length, 1)
findAll(alert.root, node => node.type === 'button')[0].props.onClick({})
await nextTick()
assert.equal(alertClosed, 1)
assert.equal(findAll(alert.root, node => node.props?.role === 'alert').length, 0)
alert.app.unmount()
const empty = mount(LuEmpty, { description: 'No results' })
assert.equal(findAll(empty.root, node => node.text === 'No results').length, 1)
empty.app.unmount()
const busy = mount(LuButton, { loading: true, onClick: () => assert.fail('busy button click') })
const busyButton = findAll(busy.root, node => node.type === 'button')[0]
assert.equal(busyButton.props['aria-busy'], true)
busyButton.props.onClick({})
busy.app.unmount()
console.log('Passed: select native value mapping/multiple/clear/guards, radio groups, input IME/clear/password/textarea, alert dismissal, empty state and button loading.')

for (const [component, alias] of [[LuPagination, EpxPagination], [LuProgress, EpxProgress], [LuDivider, EpxDivider]]) {
  assert.equal(component, alias)
  assert.ok(registered.includes(component.name))
}
const activePage = ref(1), recordTotal = ref(1000), paginationDisabled = ref(false)
const paginationRoot = { children: [] }, pageChanges = []
const paginationApp = renderer.createApp({ render: () => h(LuPagination, {
  currentPage: activePage.value, total: recordTotal.value, disabled: paginationDisabled.value,
  'onUpdate:currentPage': value => { activePage.value = value }, onChange: value => pageChanges.push(value)
}) })
paginationApp.mount(paginationRoot)
const paginationButtons = () => findAll(paginationRoot, node => node.type === 'button')
const activeButton = () => paginationButtons().find(node => node.props['aria-current'] === 'page')
assert.equal(paginationButtons()[0].props.disabled, true)
paginationButtons()[0].props.onClick()
activeButton().props.onClick()
assert.deepEqual(pageChanges, [])
paginationButtons().at(-1).props.onClick()
await nextTick()
assert.equal(activePage.value, 2)
assert.equal(activeButton().text, '2')
activePage.value = 50
await nextTick()
assert.deepEqual(paginationButtons().slice(1, -1).map(node => node.text), ['1', '49', '50', '51', '100'])
assert.equal(findAll(paginationRoot, node => node.props?.class === 'epx-pagination__ellipsis').length, 2)
paginationButtons().at(-2).props.onClick()
await nextTick()
assert.equal(activePage.value, 100)
assert.equal(paginationButtons().at(-1).props.disabled, true)
assert.deepEqual(paginationButtons().slice(1, -1).map(node => node.text), ['1', '96', '97', '98', '99', '100'])
paginationDisabled.value = true
await nextTick()
assert.ok(paginationButtons().every(node => node.props.disabled))
paginationButtons()[0].props.onClick()
assert.deepEqual(pageChanges, [2, 100])
recordTotal.value = 15
await nextTick()
assert.equal(activeButton().text, '2')
assert.equal(activePage.value, 100)
assert.deepEqual(pageChanges, [2, 100])
paginationApp.unmount()
for (const props of [{ total: 0 }, { total: NaN, currentPage: Infinity }, { total: -10, pageSize: 0 }, { total: 10, pageSize: Infinity }]) {
  const view = mount(LuPagination, props)
  const buttons = findAll(view.root, node => node.type === 'button')
  assert.equal(buttons.length, 3)
  assert.equal(buttons[0].props.disabled, true)
  assert.equal(buttons.at(-1).props.disabled, true)
  view.app.unmount()
}
const hiddenPagination = mount(LuPagination, { total: 0, hideOnSinglePage: true })
assert.equal(findAll(hiddenPagination.root, node => node.type === 'nav').length, 0)
hiddenPagination.app.unmount()
const hugePagination = mount(LuPagination, { total: Number.MAX_VALUE, pageSize: 1, currentPage: Number.MAX_VALUE })
assert.ok(findAll(hugePagination.root, node => node.type === 'button').length <= 9)
hugePagination.app.unmount()
console.log('Passed: pagination registration, navigation, ellipses, controlled updates, disabled guards, total changes and invalid inputs.')

for (const [percentage, expected] of [[-5, 0], [145, 100], [NaN, 0], [Infinity, 0], [42.5, 42.5]]) {
  const view = mount(LuProgress, { percentage, strokeWidth: -1, ariaLabel: 'Upload', format: value => `Done ${value}` })
  const track = findAll(view.root, node => node.props?.role === 'progressbar')[0]
  assert.equal(track.props['aria-label'], 'Upload')
  assert.equal(track.props['aria-valuenow'], expected)
  assert.equal(track.props.style.height, '1px')
  assert.equal(track.children[0].props.style.width, `${expected}%`)
  assert.ok(findAll(view.root, node => node.text === `Done ${expected}`).length)
  view.app.unmount()
}
const unknownProgress = mount(LuProgress, { indeterminate: true, showText: false, color: '#123456' })
assert.equal(findAll(unknownProgress.root, node => node.props?.role === 'progressbar')[0].props['aria-valuenow'], undefined)
assert.equal(findAll(unknownProgress.root, node => node.type === 'span').length, 0)
assert.equal(findAll(unknownProgress.root, node => node.props?.class === 'epx-progress__bar')[0].props.style.backgroundColor, '#123456')
unknownProgress.app.unmount()
const slotProgressRoot = { children: [] }, livePercentage = ref(20), liveIndeterminate = ref(false)
const slotProgressApp = renderer.createApp({ render: () => h(LuProgress, { percentage: livePercentage.value, indeterminate: liveIndeterminate.value }, {
  default: ({ percentage }) => h('strong', {}, `${percentage} complete`)
}) })
slotProgressApp.mount(slotProgressRoot)
livePercentage.value = 80
await nextTick()
assert.equal(findAll(slotProgressRoot, node => node.type === 'strong')[0].text, '80 complete')
liveIndeterminate.value = true
await nextTick()
assert.equal(findAll(slotProgressRoot, node => node.props?.role === 'progressbar')[0].props['aria-valuenow'], undefined)
slotProgressApp.unmount()
for (const direction of ['horizontal', 'vertical']) {
  const dividerRoot = { children: [] }
  const dividerApp = renderer.createApp({ render: () => h(LuDivider, { direction, dashed: true, contentPosition: 'left' }, () => 'Section') })
  dividerApp.mount(dividerRoot)
  const separator = findAll(dividerRoot, node => node.props?.role === 'separator')[0]
  assert.equal(separator.props['aria-orientation'], direction)
  assert.ok(separator.props.class.includes('is-dashed'))
  assert.equal(findAll(dividerRoot, node => node.type === 'span').length, direction === 'horizontal' ? 1 : 0)
  dividerApp.unmount()
}
console.log('Passed: progress clamping, formatting, slots, updates and indeterminate semantics; divider orientations and slots.')
