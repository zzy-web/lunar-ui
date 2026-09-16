import assert from 'node:assert/strict'
import { LuImage, EpxImage, LuVirtualList, EpxVirtualList } from '../dist/index.js'
import { createRenderer, h, nextTick, ref, toRaw } from 'vue'
import LunarUI, { LuCheckbox, LuSwitch, LuTag, LuCalendar, LuInput, LuButton, LuSelect, LuRadio, LuRadioGroup, LuAlert, LuEmpty, EpxCheckbox, EpxSwitch, EpxTag, EpxCalendar, EpxSelect, EpxRadio, EpxRadioGroup, EpxAlert, EpxEmpty } from '../dist/index.js'
import { LuPagination, EpxPagination, LuProgress, EpxProgress, LuDivider, EpxDivider } from '../dist/index.js'

const teleportHost = { children: [] }
const renderer = createRenderer({
  querySelector: selector => selector === 'body' ? teleportHost : null,
  createElement: type => ({
    type, tagName: type.toUpperCase(), props: {}, children: [], listeners: {}, style: {},
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
assert.equal(findAll(teamRoot, node => node.props?.role === 'combobox')[0].props['aria-label'], 'Team')
assert.equal(teamSelect.options.find(option => option._value === 1).selected, true)
for (const option of teamSelect.options) option.selected = option._value === 2
teamSelect.listeners.change()
await nextTick()
assert.equal(selectedTeam.value, 2)
assert.equal(typeof selectedTeam.value, 'number')
findAll(teamRoot, node => node.props?.class === 'epx-select__clear')[0].props.onClick({ stopPropagation() {} })
await nextTick()
assert.equal(selectedTeam.value, undefined)
assert.equal(findAll(teamRoot, node => node.props?.role === 'combobox')[0].focused, true)
assert.equal(teamSelect.options[0].selected, true)
teamApp.unmount()
const multi = mount(LuSelect, { modelValue: [1, 2], options: selectOptions, multiple: true, clearable: true,
  'onUpdate:modelValue': value => teamUpdates.push(value) })
const multiSelect = findAll(multi.root, node => node.type === 'select')[0]
assert.deepEqual(multiSelect.options.filter(option => option.selected).map(option => option._value), [1, 2])
for (const option of multiSelect.options) option.selected = option._value === 2
multiSelect.listeners.change()
assert.deepEqual(teamUpdates.at(-1), [2])
findAll(multi.root, node => node.props?.class === 'epx-select__clear')[0].props.onClick({ stopPropagation() {} })
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

// Table interaction regression coverage.
const { LuTable, LuTableColumn } = await import('../dist/index.js')
const tableData = ref([{ id: 1, profile: { score: 20 } }, { id: 2, profile: { score: 3 } }, { id: 3, profile: { score: 10 } }])
const showExtra = ref(false), tableRef = ref(), tableRoot = { children: [] }, selections = [], sortEvents = []
const tableApp = renderer.createApp({ render: () => h(LuTable, {
  ref: tableRef, data: tableData.value, rowKey: 'id', height: 200,
  onSelectionChange: rows => selections.push(rows.map(row => row.id)),
  onSortChange: value => sortEvents.push(value)
}, { default: () => [
  h(LuTableColumn, { type: 'selection', selectable: row => row.id !== 3 }),
  h(LuTableColumn, { type: 'index', index: 5 }),
  h(LuTableColumn, { prop: 'profile.score', label: 'Score', sortable: '' }),
  ...(showExtra.value ? [h(LuTableColumn, { label: 'Actions' }, { default: ({ row }) => h('button', {}, `Edit ${row.id}`), header: () => 'Custom header' })] : [])
] }) })
tableApp.mount(tableRoot)
const boxes = () => findAll(tableRoot, n => n.type === 'input')
const rows = () => findAll(tableRoot, n => n.type === 'tbody')[0].children.filter(n => n.type === 'tr')
const textOf = node => (node.text ?? '') + (node.children ?? []).map(textOf).join('')
const sortButton = () => findAll(tableRoot, n => n.props?.class === 'epx-table__sort')[0]
assert.equal(rows().length, 3)
assert.match(textOf(rows()[0]), /520/)
boxes()[1].props.onChange(); await nextTick()
assert.deepEqual(selections.at(-1), [1])
assert.equal(boxes()[0].props.indeterminate, true)
sortButton().props.onClick(); await nextTick()
assert.match(textOf(rows()[0]), /53/)
assert.deepEqual(tableData.value.map(r => r.id), [1, 2, 3])
assert.equal(boxes()[3].props.checked, true)
assert.equal(sortEvents.at(-1).order, 'ascending')
sortButton().props.onClick(); await nextTick()
assert.match(textOf(rows()[0]), /520/)
sortButton().props.onClick(); await nextTick()
assert.equal(sortEvents.at(-1).order, null)
boxes()[0].props.onChange(); await nextTick()
assert.deepEqual(selections.at(-1), [1, 2])
assert.equal(boxes()[0].props.checked, true)
assert.equal(boxes()[3].props.disabled, true)
tableRef.value.clearSelection(); await nextTick()
assert.deepEqual(selections.at(-1), [])
tableRef.value.toggleRowSelection(tableData.value[0], true); await nextTick()
tableData.value = tableData.value.map(row => ({ ...row })); await nextTick()
assert.equal(boxes()[1].props.checked, true)
tableData.value = tableData.value.slice(1); await nextTick()
assert.deepEqual(selections.at(-1), [])
showExtra.value = true; await nextTick()
assert.equal(findAll(tableRoot, n => n.type === 'th').length, 4)
assert.match(textOf(tableRoot), /Custom header/)
assert.match(textOf(tableRoot), /Edit 2/)
tableApp.unmount()
console.log('Passed: table sort cycles, nested values, stable selection, select-all guards, exposed methods, reactive columns and scoped slots.')
const customRows = [{ id: 2 }, { id: 1 }], customRoot = { children: [] }, customRef = ref(), clickedRows = []
const customApp = renderer.createApp({ render: () => h(LuTable, { ref: customRef, data: customRows, onRowClick: row => clickedRows.push(row.id) }, {
  default: () => [h(LuTableColumn, { prop: 'id', sortable: 'custom', label: 'ID' }), h(LuTableColumn, { prop: 'label', formatter: row => `Formatted ${row.id}` }), h(LuTableColumn, { prop: 'legacy' })],
  legacy: ({ row }) => `Legacy ${row.id}`
}) })
customApp.mount(customRoot)
customRef.value.sort('id', 'ascending'); await nextTick()
assert.match(textOf(findAll(customRoot, n => n.type === 'tbody')[0]), /^2Formatted 2Legacy 2/)
findAll(customRoot, n => n.type === 'tbody')[0].children.find(n => n.type === 'tr').props.onClick({})
assert.deepEqual(clickedRows, [2])
customApp.unmount()
const emptyRoot = { children: [] }
const emptyApp = renderer.createApp({ render: () => h(LuTable, { showHeader: false }, { empty: () => 'Nothing here', default: () => h(LuTableColumn, { prop: 'id' }) }) })
emptyApp.mount(emptyRoot)
assert.match(textOf(emptyRoot), /Nothing here/)
assert.equal(findAll(emptyRoot, n => n.type === 'thead').length, 0)
emptyApp.unmount()
console.log('Passed: table custom sorting, formatter, legacy slots, row click and custom empty state.')

const currentData = ref([{ id: 0 }, { id: 1 }, { id: 2 }]), currentKey = ref(0)
const currentRoot = { children: [] }, currentRef = ref(), currentEvents = [], currentClicks = []
const currentApp = renderer.createApp({ render: () => h(LuTable, {
  ref: currentRef, data: currentData.value, rowKey: 'id', currentRowKey: currentKey.value,
  highlightCurrentRow: true, stripe: true, size: 'small',
  rowClassName: ({ rowIndex }) => `row-${rowIndex}`,
  rowStyle: ({ row }) => ({ color: row.id === 1 ? 'red' : 'inherit' }),
  onCurrentChange: (row, oldRow) => currentEvents.push([row, oldRow]),
  onRowClick: (row, index) => currentClicks.push([row.id, index])
}, { default: () => [h(LuTableColumn, { prop: 'id', sortable: true, align: 'right', headerAlign: 'center' })] }) })
currentApp.mount(currentRoot)
const currentRows = () => findAll(currentRoot, n => n.type === 'tbody')[0].children.filter(n => n.type === 'tr')
assert.match(currentRoot.children[0].props.class, /epx-table--small/)
assert.match(currentRows()[0].props.class, /is-current/)
assert.equal(findAll(currentRoot, n => n.type === 'th')[0].props.style.textAlign, 'center')
assert.equal(findAll(currentRoot, n => n.type === 'td')[0].props.style.textAlign, 'right')
assert.equal(currentRows()[1].props.style.color, 'red')
currentRows()[1].props.onClick({}); await nextTick()
assert.deepEqual(currentEvents.at(-1).map(row => row?.id), [1, 0])
assert.deepEqual(currentClicks.at(-1), [1, 1])
const eventCount = currentEvents.length
currentRows()[1].props.onClick({}); await nextTick()
assert.equal(currentEvents.length, eventCount)
currentRef.value.sort('id', 'descending'); await nextTick()
assert.match(currentRows()[1].props.class, /is-current/)
assert.match(currentRows()[0].props.class, /row-0/)
const oldCurrent = currentData.value[1]
currentData.value = currentData.value.map(row => ({ ...row })); await nextTick()
assert.equal(currentEvents.at(-1)[0], currentData.value[1])
assert.equal(currentEvents.at(-1)[1], oldCurrent)
currentData.value = currentData.value.filter(row => row.id !== 1); await nextTick()
assert.equal(currentEvents.at(-1)[0], null)
assert.ok(currentRows().every(row => !row.props.class.includes('is-current')))
currentKey.value = 2; await nextTick()
assert.match(currentRows()[0].props.class, /is-current/)
currentRef.value.setCurrentRow(); await nextTick()
assert.equal(currentEvents.at(-1)[0], null)
currentRef.value.setCurrentRow({ id: 0 }); await nextTick()
assert.equal(currentEvents.at(-1)[0], currentData.value[0])
currentKey.value = null; await nextTick()
assert.equal(currentEvents.at(-1)[0], null)
currentApp.unmount()
console.log('Passed: table current row, zero key, click events, sorting, replacement/removal, external key updates, clearing, size and row/header customization.')

// Tree: exercise actual events and exposed methods with nested, disabled and dynamic data.
const { LuTree, EpxTree } = await import('../dist/index.js')
assert.equal(LuTree, EpxTree)
assert.ok(registered.includes('LuTree'))
const treeData = ref([
  { id: 0, label: 'Root', children: [
    { id: 1, label: 'First' },
    { id: 2, label: 'Branch', children: [{ id: 3, label: 'Nested' }] },
    { id: 4, label: 'Disabled', disabled: true, children: [{ id: 5, label: 'Disabled descendant' }] }
  ] },
  { id: '0', label: 'String key' }
])
const originalTree = JSON.stringify(treeData.value)
const treeRoot = { children: [] }, treeRef = ref(), treeChecks = [], treeChanges = [], treeClicks = [], treeExpands = []
const treeCurrent = ref(0), treeStrict = ref(false)
const treeApp = renderer.createApp({ render: () => h(LuTree, {
  ref: treeRef, data: treeData.value, showCheckbox: true, defaultExpandedKeys: [2], defaultCheckedKeys: [3],
  currentNodeKey: treeCurrent.value, checkStrictly: treeStrict.value,
  onCheck: (data, state) => treeChecks.push(state), onCheckChange: (...args) => treeChanges.push(args),
  onNodeClick: data => treeClicks.push(data.id), onNodeExpand: data => treeExpands.push(data.id)
}, { default: ({ node }) => h('span', {}, `${node.label} / ${node.level}`) }) })
treeApp.mount(treeRoot)
const treeItems = () => findAll(treeRoot, n => n.props?.role === 'treeitem')
const treeItem = label => treeItems().find(n => n.props['aria-label'] === label)
const treeBox = label => findAll(treeItem(label), n => n.type === 'input')[0]
const treeArrow = label => findAll(treeItem(label), n => n.type === 'button')[0]
function treeKeypress(label, key) {
  const item = treeItem(label)
  let prevented = false
  item.props.onKeydown({ key, target: item, currentTarget: item, preventDefault: () => { prevented = true } })
  assert.equal(prevented, true)
}
assert.equal(treeItems().length, 6)
assert.equal(treeItem('Root').props['aria-selected'], true)
assert.equal(treeItem('String key').props['aria-selected'], false)
assert.equal(treeItem('Nested').props['aria-level'], 3)
assert.match(textOf(treeItem('Nested')), /Nested \/ 3/)
assert.deepEqual(treeRef.value.getCheckedKeys(), [2, 3])
assert.deepEqual(treeRef.value.getHalfCheckedKeys(), [0])
assert.equal(treeBox('Root').props.indeterminate, true)
assert.equal(treeChanges.length, 0)
treeBox('First').props.onChange({ target: { checked: true } }); await nextTick()
assert.deepEqual(treeRef.value.getCheckedKeys(), [0, 1, 2, 3])
assert.deepEqual(treeRef.value.getCheckedKeys(true), [1, 3])
assert.deepEqual(treeChecks.at(-1).halfCheckedKeys, [])
assert.ok(treeChanges.some(([data, checked]) => data.id === 0 && checked))
assert.equal(treeItem('Root').props['aria-expanded'], true)
assert.equal(treeClicks.length, 0)
treeRef.value.setChecked(3, false); await nextTick()
assert.deepEqual(treeRef.value.getHalfCheckedKeys(), [0])
assert.deepEqual(treeRef.value.getCheckedKeys(), [1])
treeRef.value.setCheckedKeys([0]); await nextTick()
assert.deepEqual(treeRef.value.getCheckedKeys(), [0, 1, 2, 3])
treeArrow('Disabled').props.onClick({ stopPropagation() {} }); await nextTick()
assert.equal(treeItem('Disabled descendant').props['aria-disabled'], true)
assert.equal(treeBox('Disabled descendant').props.disabled, true)
treeRef.value.setChecked(5, true)
treeItem('Disabled').props.onClick(); await nextTick()
assert.equal(treeRef.value.getCurrentKey(), 0)
assert.ok(!treeRef.value.getCheckedKeys().includes(5))
assert.equal(treeExpands.at(-1), 4)
treeRef.value.setCheckedKeys([]); await nextTick()
assert.deepEqual(treeRef.value.getCheckedKeys(), [])
treeStrict.value = true; await nextTick()
treeRef.value.setCheckedKeys([0]); await nextTick()
assert.deepEqual(treeRef.value.getCheckedKeys(), [0])
assert.deepEqual(treeRef.value.getHalfCheckedKeys(), [])
treeKeypress('First', ' '); await nextTick()
assert.deepEqual(treeRef.value.getCheckedKeys(), [0, 1])
treeKeypress('Root', 'ArrowRight'); await nextTick()
assert.equal(treeItem('First').props.tabindex, 0)
assert.equal(treeItem('First').focused, true)
treeKeypress('First', 'ArrowDown'); await nextTick()
assert.equal(treeItem('Branch').props.tabindex, 0)
treeKeypress('Branch', 'ArrowRight'); await nextTick()
assert.equal(treeItem('Nested').props.tabindex, 0)
treeKeypress('Nested', 'ArrowLeft'); await nextTick()
assert.equal(treeItem('Branch').props.tabindex, 0)
treeKeypress('Branch', 'ArrowLeft'); await nextTick()
assert.equal(treeItem('Nested'), undefined)
treeKeypress('Branch', 'End'); await nextTick()
assert.equal(treeItem('String key').props.tabindex, 0)
treeKeypress('String key', 'Home'); await nextTick()
assert.equal(treeItem('Root').props.tabindex, 0)
treeKeypress('Root', 'ArrowUp'); await nextTick()
assert.equal(treeItem('Root').props.tabindex, 0)
treeKeypress('First', 'Enter'); await nextTick()
assert.equal(treeRef.value.getCurrentKey(), 1)
assert.deepEqual(treeClicks, [1])
const beforeKeys = treeRef.value.getCheckedKeys()
treeItem('First').props.onKeydown({ key: ' ', target: {}, currentTarget: treeItem('First'), preventDefault: () => assert.fail('slot keyboard intercepted') })
assert.deepEqual(treeRef.value.getCheckedKeys(), beforeKeys)
assert.equal(JSON.stringify(treeData.value), originalTree)
treeData.value = JSON.parse(originalTree); await nextTick()
assert.equal(treeRef.value.getCurrentNode(), treeData.value[0].children[0])
assert.equal(treeRef.value.getCheckedNodes().find(node => node.id === 1), treeData.value[0].children[0])
treeCurrent.value = '0'; await nextTick()
assert.equal(treeRef.value.getCurrentKey(), '0')
treeData.value = treeData.value.slice(0, 1); await nextTick()
assert.equal(treeRef.value.getCurrentKey(), null)
treeRef.value.setCurrentKey(1); await nextTick()
treeData.value[0].children = treeData.value[0].children.filter(node => node.id !== 1); await nextTick()
assert.equal(treeRef.value.getCurrentKey(), null)
assert.ok(!treeRef.value.getCheckedKeys().includes(1))
treeData.value = []; await nextTick()
assert.match(textOf(treeRoot), /No Data/)
assert.deepEqual(treeRef.value.getCheckedKeys(), [])
treeApp.unmount()

const mappedTree = mount(LuTree, { data: [{ key: 0, name: 'Mapped', items: [{ key: 1, name: 'Locked', locked: true }] }],
  nodeKey: 'key', props: { label: 'name', children: 'items', disabled: 'locked' }, defaultExpandAll: true })
assert.equal(findAll(mappedTree.root, n => n.props?.role === 'treeitem').length, 2)
assert.equal(findAll(mappedTree.root, n => n.props?.['aria-label'] === 'Locked')[0].props['aria-disabled'], true)
mappedTree.app.unmount()
const emptyTreeRoot = { children: [] }
const emptyTreeApp = renderer.createApp({ render: () => h(LuTree, {}, { empty: () => 'No folders yet' }) })
emptyTreeApp.mount(emptyTreeRoot)
assert.match(textOf(emptyTreeRoot), /No folders yet/)
emptyTreeApp.unmount()
console.log('Passed: tree exports, registration, expansion, linked/strict checks, disabled descendants, slots, keyboard navigation, stable keys, data cleanup, field mapping and empty states.')

const { LuTooltip, EpxTooltip, LuDropdown, EpxDropdown } = await import('../dist/index.js')
assert.equal(LuTooltip, EpxTooltip)
assert.equal(LuDropdown, EpxDropdown)
assert.ok(registered.includes('LuTooltip') && registered.includes('LuDropdown'))
const tooltipRoot = { children: [] }, tooltipDisabled = ref(false), tooltipEvents = [], tooltipUpdates = []
let triggerClicks = 0
const tooltipApp = renderer.createApp({ render: () => h(LuTooltip, {
  content: 'Save changes', showAfter: 0, hideAfter: 0, disabled: tooltipDisabled.value, teleported: false,
  onVisibleChange: value => tooltipEvents.push(value), 'onUpdate:visible': value => tooltipUpdates.push(value)
}, { default: () => h('button', { 'aria-describedby': 'existing-help', onClick: () => triggerClicks++ }, 'Save') }) })
tooltipApp.mount(tooltipRoot)
const tooltipAnchor = () => findAll(tooltipRoot, n => n.props?.class === 'epx-tooltip')[0]
const tooltipPanel = () => findAll(tooltipRoot, n => n.props?.role === 'tooltip')[0]
const tooltipTrigger = () => findAll(tooltipRoot, n => n.type === 'button')[0]
assert.equal(tooltipPanel(), undefined)
tooltipAnchor().props.onMouseenter(); await nextTick()
assert.match(textOf(tooltipPanel()), /Save changes/)
assert.equal(tooltipTrigger().props['aria-describedby'], 'existing-help ' + tooltipPanel().props.id)
tooltipTrigger().props.onClick()
assert.equal(triggerClicks, 1)
tooltipAnchor().props.onFocusin(); await nextTick()
assert.deepEqual(tooltipUpdates, [true])
tooltipAnchor().props.onMouseleave(); await nextTick()
assert.ok(tooltipPanel(), 'focus keeps a tooltip open after pointer leaves')
tooltipAnchor().props.onFocusout({ relatedTarget: null }); await nextTick()
assert.equal(tooltipPanel(), undefined)
assert.equal(tooltipTrigger().props['aria-describedby'], 'existing-help')
tooltipAnchor().props.onMouseenter(); await nextTick()
tooltipAnchor().props.onKeydown({ key: 'Escape', stopPropagation() {} }); await nextTick()
assert.equal(tooltipPanel(), undefined)
tooltipAnchor().props.onMouseenter(); await nextTick()
tooltipDisabled.value = true; await nextTick()
assert.equal(tooltipPanel(), undefined)
tooltipAnchor().props.onFocusin(); await nextTick()
assert.equal(tooltipPanel(), undefined)
assert.deepEqual(tooltipEvents, [true, false, true, false, true, false])
tooltipApp.unmount()

const controlledTip = ref(false), tipControlRoot = { children: [] }, tipRequests = []
const tipControlApp = renderer.createApp({ render: () => h(LuTooltip, {
  content: 'Controlled', visible: controlledTip.value, teleported: false, showAfter: 0, hideAfter: 0,
  'onUpdate:visible': value => tipRequests.push(value)
}, { default: () => h('span', {}, 'Text trigger'), content: () => h('strong', {}, 'Slot description') }) })
tipControlApp.mount(tipControlRoot)
const tipControlAnchor = findAll(tipControlRoot, n => n.props?.class === 'epx-tooltip')[0]
tipControlAnchor.props.onMouseenter(); await nextTick()
assert.deepEqual(tipRequests, [true])
assert.equal(findAll(tipControlRoot, n => n.props?.role === 'tooltip').length, 0)
controlledTip.value = true; await nextTick()
assert.match(textOf(tipControlRoot), /Slot description/)
assert.equal(findAll(tipControlRoot, n => n.type === 'span' && n.props?.tabindex === 0).length, 1)
tipControlApp.unmount()

const delayedTip = mount(LuTooltip, { content: 'Delayed', showAfter: 15, hideAfter: 15, teleported: false })
const delayedAnchor = findAll(delayedTip.root, n => n.props?.class === 'epx-tooltip')[0]
delayedAnchor.props.onMouseenter(); delayedAnchor.props.onMouseleave()
await new Promise(resolve => setTimeout(resolve, 30))
assert.equal(findAll(delayedTip.root, n => n.props?.role === 'tooltip').length, 0)
delayedAnchor.props.onMouseenter()
await new Promise(resolve => setTimeout(resolve, 30)); await nextTick()
assert.equal(findAll(delayedTip.root, n => n.props?.role === 'tooltip').length, 1)
delayedAnchor.props.onMouseleave()
findAll(delayedTip.root, n => n.props?.role === 'tooltip')[0].props.onMouseenter()
await new Promise(resolve => setTimeout(resolve, 30)); await nextTick()
assert.equal(findAll(delayedTip.root, n => n.props?.role === 'tooltip').length, 1)
delayedTip.app.unmount()
let unmountedTipUpdates = 0
const pendingTip = mount(LuTooltip, { content: 'Pending', showAfter: 15, teleported: false, 'onUpdate:visible': () => unmountedTipUpdates++ })
findAll(pendingTip.root, n => n.props?.class === 'epx-tooltip')[0].props.onMouseenter()
pendingTip.app.unmount()
await new Promise(resolve => setTimeout(resolve, 30))
assert.equal(unmountedTipUpdates, 0)
console.log('Passed: tooltip trigger preservation, focus/hover coordination, Escape, disabled state, controlled visibility, content slots and timer cleanup.')

const menuRoot = { children: [] }, menuRef = ref(), menuCommands = [], menuEvents = []
const menuDisabled = ref(false), menuHide = ref(true), menuOptions = ref([
  { label: 'Zero', command: 0 }, { label: 'Disabled', command: 'blocked', disabled: true },
  { label: 'Delete', command: 'delete', divided: true, danger: true }
])
const menuApp = renderer.createApp({ render: () => h(LuDropdown, {
  ref: menuRef, options: menuOptions.value, disabled: menuDisabled.value, hideOnClick: menuHide.value,
  teleported: false, 'aria-label': 'Action menu', onCommand: (...args) => menuCommands.push(args), onVisibleChange: value => menuEvents.push(value)
}, { default: () => 'Actions', item: ({ option }) => `${option.label} action` }) })
menuApp.mount(menuRoot)
const menuTrigger = () => findAll(menuRoot, n => n.props?.['aria-haspopup'] === 'menu')[0]
const menuPanel = () => findAll(menuRoot, n => n.props?.role === 'menu')[0]
const menuItems = () => findAll(menuRoot, n => n.props?.role === 'menuitem')
const menuKey = (key, target = menuItems()[0]) => menuPanel().props.onKeydown({ key, target, preventDefault() {}, stopPropagation() {} })
// Allow the panel render, positioning render and focus continuation to settle.
const settleFloating = () => new Promise(resolve => setImmediate(resolve))
assert.equal(menuTrigger().props['aria-label'], 'Action menu')
assert.equal(menuEvents.length, 0)
menuTrigger().props.onKeydown({ key: 'ArrowUp', preventDefault() {} }); await settleFloating()
assert.equal(menuTrigger().props['aria-expanded'], true)
assert.equal(menuItems()[2].focused, true)
assert.equal(menuPanel().props['aria-labelledby'], menuTrigger().props.id)
assert.equal(menuTrigger().props['aria-controls'], menuPanel().props.id)
assert.match(textOf(menuItems()[0]), /Zero action/)
assert.equal(findAll(menuRoot, n => n.props?.role === 'separator').length, 1)
menuItems()[0].focused = false
menuKey('ArrowDown', menuItems()[2]); await nextTick()
assert.equal(menuItems()[0].focused, true)
menuItems()[2].focused = false
menuKey('ArrowDown', menuItems()[0]); await nextTick()
assert.equal(menuItems()[2].focused, true)
menuItems()[1].props.onClick()
assert.equal(menuCommands.length, 0)
menuKey('Escape'); await nextTick()
assert.equal(menuPanel(), undefined)
assert.equal(menuTrigger().focused, true)
menuRef.value.handleOpen(); await settleFloating()
menuItems()[0].props.onClick(); await nextTick()
assert.equal(menuCommands[0][0], 0)
assert.equal(menuPanel(), undefined)
menuHide.value = false
menuRef.value.handleOpen(); await settleFloating()
menuItems()[2].props.onClick(); await nextTick()
assert.ok(menuPanel())
assert.equal(menuCommands.at(-1)[0], 'delete')
menuItems()[2].props.onFocus()
menuItems()[0].focused = false
menuOptions.value = menuOptions.value.slice(0, 2); await nextTick(); await nextTick()
assert.equal(menuItems()[0].focused, true)
menuKey('Tab'); await nextTick()
assert.equal(menuPanel(), undefined)
menuRef.value.handleOpen(); await nextTick()
menuDisabled.value = true; await nextTick()
assert.equal(menuPanel(), undefined)
assert.equal(menuTrigger().props.disabled, true)
menuRef.value.handleOpen(); await nextTick()
assert.equal(menuPanel(), undefined)
menuApp.unmount()

const menuControl = ref(false), menuControlRoot = { children: [] }, menuRequests = []
const menuControlApp = renderer.createApp({ render: () => h(LuDropdown, {
  visible: menuControl.value, teleported: false, options: [], 'onUpdate:visible': value => menuRequests.push(value)
}, { empty: () => 'Nothing available' }) })
menuControlApp.mount(menuControlRoot)
findAll(menuControlRoot, n => n.props?.['aria-haspopup'] === 'menu')[0].props.onClick(); await nextTick()
assert.deepEqual(menuRequests, [true])
assert.equal(findAll(menuControlRoot, n => n.props?.role === 'menu').length, 0)
menuControl.value = true; await settleFloating()
assert.match(textOf(menuControlRoot), /Nothing available/)
const emptyMenu = findAll(menuControlRoot, n => n.props?.role === 'menu')[0]
assert.equal(emptyMenu.focused, true)
emptyMenu.props.onKeydown({ key: 'ArrowDown', preventDefault() {}, target: emptyMenu })
menuControlApp.unmount()
console.log('Passed: dropdown commands, disabled guards, focus return, arrow navigation, controlled state, empty menus, dynamic options and slots.')

const teleportedTip = mount(LuTooltip, { content: 'Body tooltip', visible: true })
await nextTick()
assert.equal(findAll(teleportedTip.root, n => n.props?.role === 'tooltip').length, 0)
assert.equal(findAll(teleportHost, n => n.props?.role === 'tooltip').length, 1)
teleportedTip.app.unmount()
const teleportedMenu = mount(LuDropdown, { visible: true, options: [{ label: 'Body action', command: 'body' }] })
await nextTick()
assert.equal(findAll(teleportHost, n => n.props?.role === 'menuitem').length, 1)
teleportedMenu.app.unmount()
assert.equal(teleportHost.children.length, 0)
console.log('Passed: floating panels teleport to body and remove their nodes on unmount.')

const searchRef = ref(), searchText = ref('needle')
const searchData = ref([{ id: 0, label: 'Root', children: [
  { id: 1, label: 'Hidden' },
  { id: 2, label: 'Branch', children: [{ id: 3, label: 'Needle' }] }
] }, { id: 4, label: 'Other' }])
const searchRoot = { children: [] }
const searchApp = renderer.createApp({ render: () => h(LuTree, {
  ref: searchRef, data: searchData.value, filterText: searchText.value,
  showCheckbox: true, defaultCheckedKeys: [3], currentNodeKey: 3
}) })
searchApp.mount(searchRoot)
const searchItems = () => findAll(searchRoot, n => n.props?.role === 'treeitem')
const searchLabels = () => searchItems().map(n => n.props['aria-label'])
assert.deepEqual(searchLabels(), ['Root', 'Branch', 'Needle'])
const searchChecks = searchRef.value.getCheckedKeys()
const searchParent = searchItems()[0]
searchParent.props.onKeydown({ key: 'ArrowRight', target: searchParent, currentTarget: searchParent, preventDefault() {} })
await nextTick()
assert.equal(searchItems()[1].props.tabindex, 0)
searchText.value = 'missing'; await nextTick()
assert.deepEqual(searchLabels(), [])
assert.match(textOf(searchRoot), /No Data/)
assert.deepEqual(searchRef.value.getCheckedKeys(), searchChecks)
assert.equal(searchRef.value.getCurrentKey(), 3)
searchText.value = ' '; await nextTick()
assert.deepEqual(searchLabels(), ['Root', 'Other'])
searchRef.value.filter('NEEDLE'); await nextTick()
assert.deepEqual(searchLabels(), ['Root', 'Branch', 'Needle'])
searchData.value[0].children[1].children.push({ id: 5, label: 'Needle two' }); await nextTick()
assert.deepEqual(searchLabels(), ['Root', 'Branch', 'Needle', 'Needle two'])
searchRef.value.filter(''); await nextTick()
assert.deepEqual(searchLabels(), ['Root', 'Other'])
searchApp.unmount()
const customSearch = mount(LuTree, {
  data: [{ id: 0, name: 'Parent', items: [{ id: 1, name: 'Child', code: 'abc' }] }],
  props: { label: 'name', children: 'items' }, filterText: ' abc ',
  filterNodeMethod: (value, data, node) => data.code === value && node.label === 'Child'
})
assert.deepEqual(findAll(customSearch.root, n => n.props?.role === 'treeitem').map(n => n.props['aria-label']), ['Parent', 'Child'])
customSearch.app.unmount()
console.log('Passed: tree search, ancestor expansion, keyboard navigation, empty results, state restoration, reactive data and custom filtering.')

const customValue = ref(1), selectPopupRoot = { children: [] }
const selectPopupApp = renderer.createApp({ render: () => h(LuSelect, {
  modelValue: customValue.value, options: selectOptions, filterable: true,
  'onUpdate:modelValue': value => { customValue.value = value }
}) })
selectPopupApp.mount(selectPopupRoot)
const combo = findAll(selectPopupRoot, node => node.props?.role === 'combobox')[0]
const pressSelect = key => combo.props.onKeydown({ key, preventDefault() {} })
pressSelect('ArrowDown'); await nextTick()
assert.equal(combo.props['aria-expanded'], true)
pressSelect('ArrowDown'); pressSelect('Enter'); await nextTick()
assert.equal(customValue.value, 2)
assert.equal(combo.props['aria-expanded'], false)
combo.props.onInput({ target: { value: 'missing' } }); await nextTick()
assert.match(textOf(teleportHost), /无匹配选项/)
combo.props.onInput({ target: { value: 'One' } }); await nextTick()
assert.equal(findAll(teleportHost, n => n.props?.role === 'option').length, 1)
pressSelect('Enter'); await nextTick()
assert.equal(customValue.value, 1)
pressSelect('ArrowDown'); await nextTick()
pressSelect('End'); pressSelect('Enter'); await nextTick()
assert.equal(customValue.value, 2)
selectPopupApp.unmount()
assert.equal(findAll(teleportHost, n => n.props?.role === 'listbox').length, 0)
console.log('Passed: select custom popup, keyboard selection, disabled option skipping, search and popup cleanup.')

const limitedValue = ref([]), limitedRoot = { children: [] }
const limitedApp = renderer.createApp({ render: () => h(LuSelect, {
  modelValue: limitedValue.value, options: selectOptions.map(o => ({ ...o, group: 'Group' })), multiple: true, showSelectAll: true, multipleLimit: 1,
  'onUpdate:modelValue': value => { limitedValue.value = value }
}, { option: ({ option }) => `Custom ${option.label}` }) })
limitedApp.mount(limitedRoot)
const limitedInput = findAll(limitedRoot, n => n.props?.role === 'combobox')[0]
limitedInput.props.onKeydown({ key: 'ArrowDown', preventDefault() {} }); await nextTick()
const allButton = () => findAll(teleportHost, n => n.props?.class === 'epx-select__all')[0]
allButton().props.onClick(); await nextTick()
assert.deepEqual(limitedValue.value, [1])
assert.match(textOf(teleportHost), /Group/)
assert.match(textOf(teleportHost), /Custom One/)
findAll(teleportHost, n => n.props?.role === 'option')[1].props.onClick(); await nextTick()
assert.deepEqual(limitedValue.value, [1])
findAll(teleportHost, n => n.props?.role === 'option')[0].props.onClick(); await nextTick()
assert.deepEqual(limitedValue.value, [])
limitedApp.unmount()
const remoteRequests = [], remoteRoot = { children: [] }, remoteErrors = []
const remoteApp = renderer.createApp({ render: () => h(LuSelect, {
  debounce: 0, remoteMethod: query => new Promise((resolve, reject) => remoteRequests.push({ query, resolve, reject })),
  onRemoteError: error => remoteErrors.push(error)
}) })
remoteApp.mount(remoteRoot)
const remoteInput = findAll(remoteRoot, n => n.props?.role === 'combobox')[0]
remoteInput.props.onKeydown({ key: 'ArrowDown', preventDefault() {} }); await nextTick()
await new Promise(resolve => setTimeout(resolve, 5))
remoteInput.props.onInput({ target: { value: 'new' } }); await nextTick()
await new Promise(resolve => setTimeout(resolve, 5))
assert.equal(remoteRequests.length, 2)
remoteRequests[1].resolve([{ label: 'New result', value: 2 }]); await nextTick(); await nextTick()
remoteRequests[0].resolve([{ label: 'Old result', value: 1 }]); await nextTick(); await nextTick()
assert.match(textOf(teleportHost), /New result/)
assert.doesNotMatch(textOf(teleportHost), /Old result/)
remoteInput.props.onInput({ target: { value: 'fail' } }); await nextTick()
await new Promise(resolve => setTimeout(resolve, 5))
remoteRequests[2].reject(new Error('Expected failure')); await nextTick(); await nextTick()
assert.equal(remoteErrors.length, 1)
assert.match(textOf(teleportHost), /加载失败/)
remoteApp.unmount()
console.log('Passed: select groups, custom options, select-all limit, deselection, remote races and errors.')
const enhancedValue = ref([1, 2, 3]), enhancedRoot = { children: [] }, enhancedRef = ref(), visibilityEvents = [], removedTags = []
const enhancedApp = renderer.createApp({ render: () => h(LuSelect, {
  ref: enhancedRef, modelValue: enhancedValue.value, options: selectOptions, multiple: true,
  filterable: true, allowCreate: true, defaultFirstOption: true, reserveKeyword: false,
  collapseTags: true, collapseTagsTooltip: true,
  'onUpdate:modelValue': value => { enhancedValue.value = value },
  onVisibleChange: value => visibilityEvents.push(value), onRemoveTag: value => removedTags.push(value)
}) })
enhancedApp.mount(enhancedRoot)
const enhancedInput = findAll(enhancedRoot, n => n.props?.role === 'combobox')[0]
assert.equal(findAll(enhancedRoot, n => n.props?.class === 'epx-select__tag').length, 2)
enhancedRef.value.open(); await nextTick()
assert.deepEqual(visibilityEvents, [true])
enhancedInput.props.onInput({ target: { value: 'New option' } }); await nextTick()
enhancedInput.props.onKeydown({ key: 'Enter', preventDefault() {} }); await nextTick()
assert.deepEqual(enhancedValue.value, [1, 2, 3, 'New option'])
assert.equal(enhancedInput.props.value, '')
enhancedInput.props.onKeydown({ key: 'Backspace', preventDefault() {} }); await nextTick()
enhancedInput.props.onKeydown({ key: 'Backspace', preventDefault() {} }); await nextTick()
assert.deepEqual(removedTags, ['New option', 2])
assert.deepEqual(enhancedValue.value, [1, 3])
enhancedInput.props.onCompositionstart()
enhancedInput.props.onInput({ target: { value: 'draft' } }); await nextTick()
assert.equal(enhancedInput.props.value, '')
enhancedInput.props.onCompositionend({ target: { value: 'Finished' } }); await nextTick()
assert.equal(enhancedInput.props.value, 'Finished')
enhancedRef.value.close(); await nextTick()
assert.deepEqual(visibilityEvents, [true, false])
enhancedApp.unmount()
console.log('Passed: select creation, collapsed tags, reserved keyword, IME, tag removal and visibility events.')
const { LuBadge, EpxBadge, LuAvatar, EpxAvatar, LuSkeleton, EpxSkeleton, LuSkeletonItem, EpxSkeletonItem } = await import('../dist/index.js')
for (const [component, alias] of [[LuBadge, EpxBadge], [LuAvatar, EpxAvatar], [LuSkeleton, EpxSkeleton], [LuSkeletonItem, EpxSkeletonItem]]) {
  assert.equal(component, alias)
  assert.ok(registered.includes(component.name))
}
for (const [props, expected] of [[{ value: 100 }, '99+'], [{ value: '100' }, '100'], [{ value: 0 }, '0'], [{ value: 0, showZero: false }, ''], [{ value: 2, hidden: true }, '']]) {
  const badge = mount(LuBadge, props)
  assert.equal(textOf(badge.root), expected)
  badge.app.unmount()
}
const dot = mount(LuBadge, { isDot: true, label: 'New messages' })
assert.equal(findAll(dot.root, n => n.type === 'sup')[0].props['aria-label'], 'New messages')
dot.app.unmount()
const badgeRoot = { children: [] }
const badgeApp = renderer.createApp({ render: () => h(LuBadge, { value: 120 }, { default: () => h('button', {}, 'Inbox'), content: ({ displayValue }) => `Count ${displayValue}` }) })
badgeApp.mount(badgeRoot)
assert.match(textOf(badgeRoot), /InboxCount 99\+/)
assert.match(findAll(badgeRoot, n => n.type === 'sup')[0].props.class, /is-fixed/)
badgeApp.unmount()
const avatarSrc = ref('first.png'), avatarRoot = { children: [] }, avatarErrors = [], avatarLoads = []
const avatarApp = renderer.createApp({ render: () => h(LuAvatar, { src: avatarSrc.value, alt: 'Profile', size: 64, onError: e => avatarErrors.push(e), onLoad: e => avatarLoads.push(e) }, { default: () => 'Fallback' }) })
avatarApp.mount(avatarRoot)
const avatarImage = () => findAll(avatarRoot, n => n.type === 'img')[0]
assert.equal(avatarImage().props.alt, 'Profile')
assert.equal(avatarRoot.children[0].props.style.width, '64px')
const failureEvent = { type: 'error' }
avatarImage().props.onError(failureEvent); await nextTick()
assert.equal(avatarImage(), undefined)
assert.equal(textOf(avatarRoot), 'Fallback')
assert.equal(avatarRoot.children[0].props['aria-label'], 'Profile')
assert.deepEqual(avatarErrors, [failureEvent])
avatarSrc.value = 'second.png'; await nextTick()
assert.equal(avatarImage().props.src, 'second.png')
avatarImage().props.onLoad({ type: 'load' })
assert.equal(avatarLoads.length, 1)
avatarApp.unmount()
const skeletonLoading = ref(true), skeletonRoot = { children: [] }
const skeletonApp = renderer.createApp({ render: () => h(LuSkeleton, { loading: skeletonLoading.value, count: 2, rows: 2 }, { default: () => h('button', {}, 'Loaded content') }) })
skeletonApp.mount(skeletonRoot)
assert.equal(findAll(skeletonRoot, n => n.props?.class?.includes('epx-skeleton__item--text')).length, 6)
assert.equal(findAll(skeletonRoot, n => n.type === 'button').length, 0)
assert.equal(skeletonRoot.children[0].props['aria-busy'], true)
skeletonLoading.value = false; await nextTick()
assert.equal(textOf(skeletonRoot), 'Loaded content')
assert.equal(skeletonRoot.children[0].props['aria-busy'], false)
skeletonLoading.value = true; await nextTick()
assert.equal(findAll(skeletonRoot, n => n.type === 'button').length, 0)
skeletonApp.unmount()
const skeletonCustomRoot = { children: [] }
const skeletonCustomApp = renderer.createApp({ render: () => h(LuSkeleton, { count: 2 }, { template: ({ index }) => h(LuSkeletonItem, { variant: index ? 'image' : 'circle' }) }) })
skeletonCustomApp.mount(skeletonCustomRoot)
assert.equal(findAll(skeletonCustomRoot, n => n.type === 'svg').length, 1)
skeletonCustomApp.unmount()
console.log('Passed: badge limits/zero/dot/slots, avatar failure/recovery/events, skeleton counts/loading/custom layouts and component registration.')
const { LuUpload, EpxUpload } = await import('../dist/index.js')
assert.equal(LuUpload, EpxUpload)
assert.ok(registered.includes('LuUpload'))
const uploadRoot = { children: [] }, uploadRef = ref(), uploadFiles = ref([]), uploadPending = [], uploadExceeded = [], uploadRejected = []
const uploadApp = renderer.createApp({ render: () => h(LuUpload, {
  ref: uploadRef, fileList: uploadFiles.value, autoUpload: false, multiple: true, limit: 2, accept: '.txt',
  'onUpdate:fileList': value => { uploadFiles.value = value },
  onExceed: files => uploadExceeded.push(files), onReject: (...args) => uploadRejected.push(args),
  httpRequest: options => new Promise((resolve, reject) => uploadPending.push({ options, resolve, reject }))
}) })
uploadApp.mount(uploadRoot)
const rawA = new File(['a'], 'a.txt', { type: 'text/plain' }), rawB = new File(['b'], 'b.txt', { type: 'text/plain' })
uploadRef.value.handleStart(new File(['x'], 'bad.png', { type: 'image/png' }))
assert.equal(uploadRejected[0][1], 'accept')
uploadRef.value.handleStart(rawA); uploadRef.value.handleStart(rawB); await nextTick()
assert.equal(uploadFiles.value.length, 2)
uploadRef.value.handleStart(rawA)
assert.equal(uploadExceeded.length, 1)
const firstSubmission = uploadRef.value.submit()
await nextTick(); await Promise.resolve()
assert.equal(uploadPending.length, 2)
await uploadRef.value.submit()
assert.equal(uploadPending.length, 2)
uploadPending[0].options.onProgress(42); await nextTick()
assert.equal(uploadFiles.value[0].percentage, 42)
uploadRef.value.abort(uploadFiles.value[0]); await nextTick()
assert.equal(uploadPending[0].options.signal.aborted, true)
uploadPending[0].resolve('late result')
uploadPending[1].reject(new Error('network'))
await firstSubmission; await nextTick()
assert.equal(uploadFiles.value[0].status, 'ready')
assert.equal(uploadFiles.value[1].status, 'fail')
const retrySubmission = uploadRef.value.submit(); await nextTick(); await Promise.resolve()
assert.equal(uploadPending.length, 4)
uploadPending[2].resolve({ ok: true }); uploadPending[3].resolve({ ok: true })
await retrySubmission; await nextTick()
assert.ok(uploadFiles.value.every(file => file.status === 'success' && file.percentage === 100))
await uploadRef.value.handleRemove(uploadFiles.value[0]); await nextTick()
assert.equal(uploadFiles.value.length, 1)
uploadRef.value.clearFiles(); await nextTick()
assert.equal(uploadFiles.value.length, 0)
uploadApp.unmount()
const guardedUploadRoot = { children: [] }, guardedUploadRef = ref(), guardedFiles = ref([])
let releaseUploadGuard
const guardedUploadApp = renderer.createApp({ render: () => h(LuUpload, {
  ref: guardedUploadRef, fileList: guardedFiles.value,
  'onUpdate:fileList': value => { guardedFiles.value = value },
  beforeUpload: () => new Promise(resolve => { releaseUploadGuard = resolve }),
  beforeRemove: () => false,
  httpRequest: () => { assert.fail('cancelled validation must not send'); return Promise.resolve() }
}) })
guardedUploadApp.mount(guardedUploadRoot)
guardedUploadRef.value.handleStart(rawA); await nextTick()
await guardedUploadRef.value.handleRemove(guardedFiles.value[0])
assert.equal(guardedFiles.value.length, 1)
guardedUploadRef.value.abort(); releaseUploadGuard(true); await nextTick(); await Promise.resolve()
assert.equal(guardedFiles.value[0].status, 'ready')
guardedUploadApp.unmount()
const disabledUpload = mount(LuUpload, { disabled: true, drag: true, 'onUpdate:fileList': () => assert.fail('disabled drop') })
findAll(disabledUpload.root, n => n.props?.role === 'button')[0].props.onDrop({ preventDefault() {}, dataTransfer: { files: [rawA] } })
disabledUpload.app.unmount()
console.log('Passed: upload registration, accept/limit guards, manual submit, deduplication, progress, cancellation races, retry, removal, async hooks and disabled drop.')
const queueUploadRoot = { children: [] }, queueUploadRef = ref(), queueFiles = ref([]), queueRequests = [], sizeRejected = []
const queueUploadApp = renderer.createApp({ render: () => h(LuUpload, {
  ref: queueUploadRef, fileList: queueFiles.value, multiple: true, autoUpload: false, concurrency: 1, maxSize: 2, listType: 'picture-card',
  'onUpdate:fileList': value => { queueFiles.value = value }, onReject: (file, reason) => sizeRejected.push(reason),
  httpRequest: options => new Promise(resolve => queueRequests.push({ options, resolve }))
}) })
queueUploadApp.mount(queueUploadRoot)
queueUploadRef.value.handleStart(new File(['long'], 'large.txt'))
assert.deepEqual(sizeRejected, ['size'])
queueUploadRef.value.handleStart(new File(['a'], 'image.png', { type: 'image/png' }))
queueUploadRef.value.handleStart(rawB); await nextTick()
assert.equal(findAll(queueUploadRoot, n => n.type === 'img').length, 1)
const queueSubmission = queueUploadRef.value.submit()
const flushUpload = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); await nextTick() }
await flushUpload()
assert.equal(queueRequests.length, 1)
queueUploadRef.value.abort(queueFiles.value[0]); await flushUpload()
assert.equal(queueRequests.length, 2, 'aborting a non-cooperative request must release the queue slot')
assert.equal(queueRequests[0].options.signal.aborted, true)
queueRequests[1].resolve('ok'); await queueSubmission; await nextTick()
assert.equal(queueFiles.value[0].status, 'ready')
assert.equal(queueFiles.value[1].status, 'success')
queueRequests[0].resolve('late'); await flushUpload()
assert.equal(queueFiles.value[0].status, 'ready')
queueUploadRef.value.clearFiles(); await nextTick()
assert.equal(findAll(queueUploadRoot, n => n.type === 'img').length, 0)
queueUploadApp.unmount()
console.log('Passed: upload size rejection, picture thumbnails, concurrency queue, cancellation slot release and stale response isolation.')

const { LuTabs, EpxTabs, LuBreadcrumb, EpxBreadcrumb, LuRate, EpxRate } = await import('../dist/index.js')
for (const [component, alias] of [[LuTabs, EpxTabs], [LuBreadcrumb, EpxBreadcrumb], [LuRate, EpxRate]]) {
  assert.equal(component, alias)
  assert.ok(registered.includes(component.name))
}
const tabItems = ref([{ name: 0, label: 'Overview' }, { name: 'blocked', label: 'Disabled', disabled: true }, { name: 'settings', label: 'Settings' }])
const activeTab = ref(0), tabChanges = [], tabsRoot = { children: [] }
const tabsApp = renderer.createApp({ render: () => h(LuTabs, { items: tabItems.value, modelValue: activeTab.value, 'onUpdate:modelValue': v => { activeTab.value = v }, onChange: v => tabChanges.push(v) }, { settings: () => h('strong', 'Settings panel') }) })
tabsApp.mount(tabsRoot)
const tabButtons = () => findAll(tabsRoot, n => n.props?.role === 'tab')
assert.equal(tabButtons()[0].props['aria-selected'], true)
await tabButtons()[0].props.onKeydown({ key: 'ArrowRight', preventDefault() {} })
assert.equal(activeTab.value, 'settings')
assert.equal(tabButtons()[2].focused, true)
assert.equal(tabButtons()[2].props.tabindex, 0)
tabButtons()[1].props.onClick(); await nextTick()
assert.deepEqual(tabChanges, ['settings'])
await tabButtons()[2].props.onKeydown({ key: 'Home', preventDefault() {} })
assert.equal(activeTab.value, 0)
tabItems.value = [{ name: 'only', label: 'Only' }]; await nextTick()
assert.equal(tabButtons()[0].props['aria-selected'], true)
tabsApp.unmount()
const uncontrolledTabs = mount(LuTabs, { items: [{ name: 'a', label: 'A' }, { name: 'b', label: 'B' }] })
findAll(uncontrolledTabs.root, n => n.props?.role === 'tab')[1].props.onClick(); await nextTick()
assert.equal(findAll(uncontrolledTabs.root, n => n.props?.role === 'tab')[1].props['aria-selected'], true)
uncontrolledTabs.app.unmount()
const crumbs = mount(LuBreadcrumb, { items: [{ label: 'Home', href: '/' }, { label: 'Current', href: '/current' }], separator: '>' })
assert.equal(findAll(crumbs.root, n => n.type === 'a').length, 1)
assert.equal(findAll(crumbs.root, n => n.props?.['aria-current'] === 'page').length, 1)
crumbs.app.unmount()
const rateValue = ref(3), ratingRoot = { children: [] }, ratingChanges = []
const ratingApp = renderer.createApp({ render: () => h(LuRate, { modelValue: rateValue.value, clearable: true, 'onUpdate:modelValue': v => { rateValue.value = v }, onChange: v => ratingChanges.push(v) }) })
ratingApp.mount(ratingRoot)
const slider = ratingRoot.children[0]
slider.props.onKeydown({ key: 'End', preventDefault() {} }); await nextTick()
assert.equal(slider.props['aria-valuenow'], 5)
findAll(ratingRoot, n => n.props?.class?.includes('epx-rate__star'))[4].props.onClick(); await nextTick()
assert.equal(rateValue.value, 0)
slider.props.onKeydown({ key: 'ArrowLeft', preventDefault() {} }); await nextTick()
assert.deepEqual(ratingChanges, [5, 0])
ratingApp.unmount()
for (const state of [{ disabled: true }, { readonly: true }]) {
  const blockedRate = mount(LuRate, { ...state, 'onUpdate:modelValue': () => assert.fail('blocked rating update') })
  blockedRate.root.children[0].props.onKeydown({ key: 'End', preventDefault() {} })
  findAll(blockedRate.root, n => n.props?.class?.includes('epx-rate__star'))[0].props.onClick()
  blockedRate.app.unmount()
}
const invalidRate = mount(LuRate, { modelValue: Infinity, max: NaN })
assert.equal(invalidRate.root.children[0].props['aria-valuenow'], 0)
assert.equal(invalidRate.root.children[0].props['aria-valuemax'], 5)
invalidRate.app.unmount()
console.log('Passed: tabs keyboard/disabled/dynamic/uncontrolled state, breadcrumb current-page semantics, rate keyboard/clear/guards and invalid values.')

// Manual activation moves focus without mounting an unvisited panel.
const manualItems = ref([{ name: 'a', label: 'A' }, { name: 'locked', label: 'Locked', disabled: true }, { name: 'b', label: 'B' }])
const manualRoot = { children: [] }, manualChanges = []
let panelMounts = 0
const StatefulPanel = { setup() { panelMounts++; return () => h('input', { value: 'preserved' }) } }
const manualApp = renderer.createApp({ render: () => h(LuTabs, {
  items: manualItems.value, orientation: 'vertical', activation: 'manual', lazy: true,
  onChange: name => manualChanges.push(name)
}, { a: () => h('p', 'First'), b: () => h(StatefulPanel) }) })
manualApp.mount(manualRoot)
const manualButtons = () => findAll(manualRoot, n => n.props?.role === 'tab')
assert.equal(findAll(manualRoot, n => n.props?.role === 'tablist')[0].props['aria-orientation'], 'vertical')
assert.equal(panelMounts, 0)
await manualButtons()[0].props.onKeydown({ key: 'ArrowRight', preventDefault() { assert.fail('horizontal key must not be consumed') } })
await manualButtons()[0].props.onKeydown({ key: 'ArrowDown', preventDefault() {} })
assert.equal(manualButtons()[2].focused, true)
assert.equal(manualButtons()[2].props.tabindex, 0)
assert.equal(manualButtons()[0].props['aria-selected'], true)
assert.equal(panelMounts, 0)
assert.deepEqual(manualChanges, [])
// Native buttons dispatch click for Enter and Space as well as pointer activation.
manualButtons()[2].props.onClick(); await nextTick()
assert.deepEqual(manualChanges, ['b'])
assert.equal(panelMounts, 1)
manualButtons()[0].props.onClick(); await nextTick()
manualButtons()[2].props.onClick(); await nextTick()
assert.equal(panelMounts, 1)
await manualButtons()[2].props.onKeydown({ key: 'ArrowDown', preventDefault() {} })
assert.equal(manualButtons()[0].props.tabindex, 0)
await manualButtons()[0].props.onKeydown({ key: 'End', preventDefault() {} })
assert.equal(manualButtons()[2].props.tabindex, 0)
manualItems.value = [{ name: 'a', label: 'A' }]; await nextTick()
assert.equal(manualButtons()[0].props.tabindex, 0)
manualItems.value = [{ name: 'a', label: 'A' }, { name: 'b', label: 'B' }]; await nextTick()
assert.equal(panelMounts, 2) // The internally selected name becomes available again.
manualItems.value = []; await nextTick()
assert.equal(manualButtons().length, 0)
manualApp.unmount()
console.log('Passed: vertical/manual tab navigation, lazy mounting, state retention and dynamic removal.')

const { LuInputNumber, EpxInputNumber, LuSlider, EpxSlider, LuCollapse, EpxCollapse, LuCollapseItem, EpxCollapseItem, LuSteps, EpxSteps, LuSegmented, EpxSegmented } = await import('../dist/index.js')
for (const [component, alias] of [[LuInputNumber, EpxInputNumber], [LuSlider, EpxSlider], [LuCollapse, EpxCollapse], [LuCollapseItem, EpxCollapseItem], [LuSteps, EpxSteps], [LuSegmented, EpxSegmented]]) {
  assert.equal(component, alias)
  assert.ok(registered.includes(component.name))
}
const numberValue = ref(0.2), numberChanges = [], numberRoot = { children: [] }, numberProps = ref({ step: 0.1, precision: 2, min: 0, max: 1 })
const numberApp = renderer.createApp({ render: () => h(LuInputNumber, {
  ...numberProps.value, modelValue: numberValue.value, 'aria-label': 'Quantity',
  'onUpdate:modelValue': value => { numberValue.value = value }, onChange: (...args) => numberChanges.push(args)
}) })
numberApp.mount(numberRoot)
const numberInput = () => findAll(numberRoot, n => n.props?.role === 'spinbutton')[0]
const numberButtons = () => findAll(numberRoot, n => n.type === 'button')
assert.equal(numberInput().props['aria-label'], 'Quantity')
numberButtons()[1].props.onClick(); await nextTick()
assert.equal(numberValue.value, 0.3)
assert.deepEqual(numberChanges[0], [0.3, 0.2])
assert.equal(numberInput().props.value, '0.30')
async function typeNumber(text) { numberInput().props.onInput({ target: { value: text } }); await numberInput().props.onChange() }
await typeNumber('100'); assert.equal(numberValue.value, 1)
assert.equal(numberButtons()[1].props.disabled, true)
await typeNumber('not a number'); assert.equal(numberValue.value, 1)
await typeNumber(''); assert.equal(numberValue.value, null)
numberProps.value = { min: 0, max: 10, step: 2, stepStrictly: true, valueOnClear: 'min' }; await nextTick()
await typeNumber('3'); assert.equal(numberValue.value, 4)
await typeNumber(''); assert.equal(numberValue.value, 0)
numberInput().props.onKeydown({ key: 'ArrowUp', preventDefault() {} }); await nextTick()
assert.equal(numberValue.value, 2)
numberProps.value = { min: 0, max: 10000, formatter: value => `$${value}`, parser: value => value.replace(/[$,]/g, '') }; await nextTick()
await typeNumber('$1,234'); assert.equal(numberValue.value, 1234)
assert.equal(numberInput().props.value, '$1234')
numberInput().props.onCompositionstart()
numberInput().props.onInput({ target: { value: '200' } })
await numberInput().props.onChange(); assert.equal(numberValue.value, 1234)
numberInput().props.onCompositionend({ target: { value: '200' } }); await numberInput().props.onChange()
assert.equal(numberValue.value, 200)
numberInput().props.onInput({ target: { value: '100' } })
numberInput().props.onKeydown({ key: 'Escape' }); await nextTick()
assert.equal(numberInput().props.value, '$200')
for (const flag of ['disabled', 'readonly']) {
  numberProps.value = { [flag]: true }; await nextTick()
  await typeNumber('500'); numberButtons()[1].props.onClick()
  numberInput().props.onKeydown({ key: 'ArrowUp', preventDefault() { assert.fail('blocked keyboard') } })
  assert.equal(numberValue.value, 200)
}
numberApp.unmount()
const standaloneNumber = mount(LuInputNumber, { step: 0.1 })
for (let i = 0; i < 3; i++) { findAll(standaloneNumber.root, n => n.type === 'button')[1].props.onClick(); await nextTick() }
assert.equal(findAll(standaloneNumber.root, n => n.props?.role === 'spinbutton')[0].props['aria-valuenow'], 0.3)
standaloneNumber.app.unmount()
console.log('Passed: input number decimal steps, bounds, strict steps, parsing, clear policies, composition, controlled/uncontrolled and guards.')

const sliderValue = ref([20, 60]), sliderChanges = [], sliderInputs = [], sliderProps = ref({ range: true, min: 0, max: 100, step: 10, showStops: true }), sliderRoot = { children: [] }
const sliderApp = renderer.createApp({ render: () => h(LuSlider, {
  ...sliderProps.value, modelValue: sliderValue.value,
  'onUpdate:modelValue': value => { sliderValue.value = value }, onChange: value => sliderChanges.push(value), onInput: value => sliderInputs.push(value)
}) })
sliderApp.mount(sliderRoot)
const sliderHandles = () => findAll(sliderRoot, n => n.props?.role === 'slider')
const runway = findAll(sliderRoot, n => n.props?.class === 'epx-slider__runway')[0]
let capture
runway.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100, bottom: 100 })
runway.setPointerCapture = id => { capture = id }
runway.hasPointerCapture = id => capture === id
runway.releasePointerCapture = () => { capture = undefined }
function pointer(x, handle, id = 1) { return { pointerId: id, button: 0, clientX: x, clientY: 100 - x, preventDefault() {}, target: { closest: () => handle === undefined ? null : { dataset: { sliderHandle: String(handle) } } } } }
assert.equal(findAll(sliderRoot, n => n.props?.class === 'epx-slider__stop').length, 9)
sliderHandles()[0].props.onKeydown({ key: 'End', preventDefault() {} }); await nextTick()
assert.deepEqual(sliderValue.value, [60, 60])
sliderHandles()[1].props.onKeydown({ key: 'Home', preventDefault() {} }); await nextTick()
assert.deepEqual(sliderValue.value, [60, 60])
sliderValue.value = [20, 60]; await nextTick()
const changesBeforeDrag = sliderChanges.length
runway.props.onPointerdown(pointer(80)); await nextTick()
assert.deepEqual(sliderValue.value, [20, 80])
assert.equal(sliderChanges.length, changesBeforeDrag)
runway.props.onPointermove(pointer(95)); await nextTick()
assert.deepEqual(sliderValue.value, [20, 100])
runway.props.onPointerup(pointer(95)); await nextTick()
assert.equal(sliderChanges.length, changesBeforeDrag + 1)
assert.equal(capture, undefined)
runway.props.onPointerdown(pointer(30, 0)); await nextTick()
runway.props.onPointermove(pointer(50, 0, 2)); await nextTick()
assert.deepEqual(sliderValue.value, [30, 100])
runway.props.onPointercancel(pointer(30, 0)); await nextTick()
assert.deepEqual(sliderValue.value, [20, 100])
assert.equal(sliderChanges.length, changesBeforeDrag + 1)
sliderProps.value = { min: 0, max: 1, step: 0.1, vertical: true }; sliderValue.value = 0.2; await nextTick()
sliderHandles()[0].props.onKeydown({ key: 'ArrowUp', preventDefault() {} }); await nextTick()
assert.equal(sliderValue.value, 0.3)
assert.equal(sliderHandles()[0].props['aria-orientation'], 'vertical')
runway.props.onPointerdown(pointer(70)); runway.props.onPointerup(pointer(70)); await nextTick()
assert.equal(sliderValue.value, 0.7)
sliderProps.value = { min: 5, max: 5, disabled: true }; await nextTick()
assert.equal(sliderHandles()[0].props.disabled, true)
assert.equal(sliderHandles()[0].props['aria-valuenow'], 5)
const sliderCount = sliderInputs.length
runway.props.onPointerdown(pointer(50)); sliderHandles()[0].props.onKeydown({ key: 'End', preventDefault() {} })
assert.equal(sliderInputs.length, sliderCount)
sliderProps.value = { min: 0, max: 100, showInput: true, showStops: true, step: 0.00001, marks: { 0: 'Low', 100: { label: 'High', style: { color: 'red' } }, 200: 'Hidden' } }; await nextTick()
assert.equal(findAll(sliderRoot, n => n.props?.class === 'epx-slider__stop').length, 0)
assert.equal(findAll(sliderRoot, n => n.props?.class === 'epx-slider__mark').length, 2)
const sliderNumber = findAll(sliderRoot, n => n.props?.role === 'spinbutton')[0]
sliderNumber.props.onInput({ target: { value: '42' } }); await sliderNumber.props.onChange()
assert.equal(sliderValue.value, 42)
sliderApp.unmount()
console.log('Passed: slider range constraints, pointer capture/drag/cancel, commit events, decimal/vertical keyboard, marks, stops, input and degenerate bounds.')

const collapseValue = ref([0]), collapseProps = ref({}), collapseChanges = [], collapseErrors = [], collapseRoot = { children: [] }
let collapseMounts = 0
const CollapseContent = { setup() { collapseMounts++; return () => h('input', { value: 'Retained' }) } }
const collapseApp = renderer.createApp({ render: () => h(LuCollapse, {
  ...collapseProps.value, modelValue: collapseValue.value, 'onUpdate:modelValue': value => { collapseValue.value = value },
  onChange: value => collapseChanges.push(value), onCollapseError: error => collapseErrors.push(error)
}, { default: () => [
  h(LuCollapseItem, { name: 0, title: 'First' }, { default: () => h('p', 'First content') }),
  h(LuCollapseItem, { name: 'b', title: 'Second', lazy: true }, { default: () => h(CollapseContent) }),
  h(LuCollapseItem, { name: 'locked', title: 'Locked', disabled: true })
] }) })
collapseApp.mount(collapseRoot)
const collapseHeaders = () => findAll(collapseRoot, n => n.type === 'button')
assert.equal(collapseHeaders()[0].props['aria-expanded'], true)
assert.equal(collapseMounts, 0)
await collapseHeaders()[1].props.onClick(); await nextTick()
assert.deepEqual(collapseValue.value, [0, 'b']); assert.equal(collapseMounts, 1)
await collapseHeaders()[1].props.onClick(); await nextTick()
await collapseHeaders()[1].props.onClick(); await nextTick()
assert.equal(collapseMounts, 1)
await collapseHeaders()[2].props.onClick(); assert.deepEqual(collapseValue.value, [0, 'b'])
collapseProps.value = { accordion: true }; await nextTick()
await collapseHeaders()[1].props.onClick(); await nextTick(); assert.equal(collapseValue.value, 'b')
await collapseHeaders()[1].props.onClick(); await nextTick(); assert.equal(collapseValue.value, null)
let allowCollapse, guardCalls = 0
collapseProps.value = { accordion: true, beforeCollapse: () => { guardCalls++; return new Promise(resolve => { allowCollapse = resolve }) } }; await nextTick()
const pendingToggle = collapseHeaders()[0].props.onClick(); await nextTick()
assert.equal(collapseHeaders()[0].props['aria-busy'], true)
await collapseHeaders()[1].props.onClick(); assert.equal(guardCalls, 1)
allowCollapse(false); await pendingToggle; await nextTick(); assert.equal(collapseValue.value, null)
const staleToggle = collapseHeaders()[0].props.onClick(); await nextTick()
collapseValue.value = 'b'; await nextTick()
allowCollapse(true); await staleToggle; await nextTick(); assert.equal(collapseValue.value, 'b')
collapseProps.value = { accordion: true, beforeCollapse: () => Promise.reject(new Error('Blocked')) }; await nextTick()
await collapseHeaders()[0].props.onClick(); assert.equal(collapseErrors.length, 1)
assert.equal(collapseValue.value, 'b')
collapseProps.value = { accordion: true, beforeCollapse: () => true }; await nextTick()
await collapseHeaders()[0].props.onClick(); await nextTick(); assert.equal(collapseValue.value, 0)
collapseApp.unmount()
const destroyRoot = { children: [] }, destroyApp = renderer.createApp({ render: () => h(LuCollapse, {}, { default: () => h(LuCollapseItem, { name: 'd', title: 'Destroy', destroyOnClose: true }, { default: () => h('strong', 'Disposable') }) }) })
destroyApp.mount(destroyRoot)
assert.equal(findAll(destroyRoot, n => n.type === 'strong').length, 0)
await findAll(destroyRoot, n => n.type === 'button')[0].props.onClick(); await nextTick()
assert.equal(findAll(destroyRoot, n => n.type === 'strong').length, 1)
await findAll(destroyRoot, n => n.type === 'button')[0].props.onClick(); await nextTick()
assert.equal(findAll(destroyRoot, n => n.type === 'strong').length, 0)
destroyApp.unmount()
console.log('Passed: collapse multiple/accordion/zero names, lazy retention, destruction, async veto/rejection/concurrency and stale results.')

const stepValue = ref(1), stepItems = ref([{ title: 'Account', description: 'Profile' }, { title: 'Verify' }, { title: 'Locked', disabled: true }, { title: 'Done', status: 'error' }]), stepsRoot = { children: [] }, stepsChanges = []
const stepsApp = renderer.createApp({ render: () => h(LuSteps, { items: stepItems.value, active: stepValue.value, clickable: true, finishStatus: 'success', 'onUpdate:active': value => { stepValue.value = value }, onChange: (...args) => stepsChanges.push(args) }) })
stepsApp.mount(stepsRoot)
const stepNodes = () => findAll(stepsRoot, n => n.type === 'li')
const stepButtons = () => findAll(stepsRoot, n => n.type === 'button')
assert.ok(stepNodes()[0].props.class.includes('is-success'))
assert.ok(stepNodes()[3].props.class.includes('is-error'))
assert.equal(stepNodes()[1].props['aria-current'], 'step')
await stepButtons()[1].props.onKeydown({ key: 'ArrowRight', preventDefault() {} })
assert.equal(stepValue.value, 3); assert.equal(stepButtons()[3].focused, true)
assert.deepEqual(stepsChanges[0], [3, 1])
stepButtons()[2].props.onClick(); assert.equal(stepValue.value, 3)
stepValue.value = 4; await nextTick()
assert.equal(stepNodes().some(node => node.props['aria-current']), false)
stepItems.value = []; await nextTick(); assert.equal(stepNodes().length, 0)
stepsApp.unmount()
const simpleSteps = mount(LuSteps, { items: [{ title: 'Start', description: 'Hidden' }], simple: true, direction: 'vertical' })
assert.equal(findAll(simpleSteps.root, n => n.props?.class === 'epx-step__description').length, 0)
assert.equal(findAll(simpleSteps.root, n => n.type === 'button').length, 0)
simpleSteps.app.unmount()
console.log('Passed: steps status overrides, completion, disabled navigation, change payloads, empty items and simple display.')

const segmentValue = ref(false), segmentOptions = ref([{ value: false, label: 'Off' }, { value: 'blocked', label: 'Blocked', disabled: true }, { value: 0, label: 'Zero' }, { value: '0', label: 'Text zero' }]), segmentDisabled = ref(false), segmentRoot = { children: [] }, segmentChanges = []
const segmentApp = renderer.createApp({ render: () => h(LuSegmented, {
  modelValue: segmentValue.value, options: segmentOptions.value, disabled: segmentDisabled.value, name: 'mode',
  'onUpdate:modelValue': value => { segmentValue.value = value }, onChange: value => segmentChanges.push(value)
}, { default: ({ item, selected }) => h('span', `${item.label} ${selected ? 'selected' : ''}`) }) })
segmentApp.mount(segmentRoot)
const segments = () => findAll(segmentRoot, n => n.props?.role === 'radio')
assert.equal(segments()[0].props['aria-checked'], true)
await segments()[0].props.onKeydown({ key: 'ArrowRight', preventDefault() {} })
assert.equal(segmentValue.value, 0)
assert.equal(segments()[2].focused, true)
assert.equal(findAll(segmentRoot, n => n.type === 'input')[0].props.value, '0')
await segments()[2].props.onKeydown({ key: 'End', preventDefault() {} })
assert.equal(segmentValue.value, '0')
segments()[1].props.onClick(); assert.equal(segmentValue.value, '0')
segmentDisabled.value = true; await nextTick()
segments()[0].props.onClick(); assert.equal(segmentValue.value, '0')
assert.equal(segments().every(node => node.props.tabindex === -1), true)
segmentDisabled.value = false; segmentOptions.value = [{ value: 'new', label: 'New' }]; await nextTick()
assert.equal(segments()[0].props.tabindex, 0)
assert.equal(segments()[0].props['aria-checked'], false)
assert.deepEqual(segmentChanges, [0, '0'])
segmentApp.unmount()
const verticalSegment = mount(LuSegmented, { options: ['A', 'B'], direction: 'vertical' })
await findAll(verticalSegment.root, n => n.props?.role === 'radio')[0].props.onKeydown({ key: 'ArrowDown', preventDefault() {} })
assert.equal(findAll(verticalSegment.root, n => n.props?.role === 'radio')[1].props['aria-checked'], true)
verticalSegment.app.unmount()
console.log('Passed: segmented typed/false/zero values, slots, native form value, keyboard/disabled navigation and dynamic options.')

assert.equal(LuImage, EpxImage)
assert.equal(LuVirtualList, EpxVirtualList)
for (const name of ['LuImage', 'LuVirtualList']) assert.ok(registered.includes(name))
const imageSource = ref('first.png'), imageRoot = { children: [] }, imageApi = ref(), imageEvents = []
const imageApp = renderer.createApp({ render: () => h(LuImage, {
  ref: imageApi, src: imageSource.value, alt: 'Landscape', lazy: true, width: 200, height: 100,
  onLoad: () => imageEvents.push('load'), onError: () => imageEvents.push('error')
}, { placeholder: () => 'Loading', error: ({ retry }) => h('button', { onClick: retry }, 'Retry') }) })
imageApp.mount(imageRoot)
const images = () => findAll(imageRoot, n => n.type === 'img')
const staleImage = images()[0]
assert.equal(staleImage.props.loading, 'lazy')
assert.equal(staleImage.props.alt, 'Landscape')
imageSource.value = 'second.png'; await nextTick()
staleImage.props.onError({}); await nextTick()
assert.equal(images().length, 1)
assert.deepEqual(imageEvents, [])
images()[0].props.onError({}); await nextTick()
assert.equal(images().length, 0)
findAll(imageRoot, n => n.type === 'button')[0].props.onClick(); await nextTick()
assert.equal(images().length, 1)
images()[0].props.onLoad({}); await nextTick()
assert.equal(imageRoot.children[0].props['aria-busy'], false)
assert.equal(findAll(imageRoot, n => n.props?.class === 'epx-image__placeholder').length, 0)
assert.deepEqual(imageEvents, ['error', 'load'])
imageSource.value = ''; await nextTick()
assert.equal(images().length, 0)
imageApp.unmount()

const virtualItems = ref(Array.from({ length: 10000 }, (_, id) => ({ id }))), virtualRoot = { children: [] }, virtualApi = ref(), virtualRanges = [], virtualScrolls = []
const virtualApp = renderer.createApp({ render: () => h(LuVirtualList, {
  ref: virtualApi, items: virtualItems.value, height: 200, itemHeight: 40, overscan: 2, itemKey: 'id',
  onRangeChange: range => virtualRanges.push(range), onScroll: offset => virtualScrolls.push(offset)
}, { default: ({ item, index }) => h('span', `${index}:${item.id}`), empty: () => 'Nothing here' }) })
virtualApp.mount(virtualRoot)
const virtualRows = () => findAll(virtualRoot, n => n.props?.role === 'listitem')
assert.equal(virtualRows().length, 7)
assert.equal(virtualRows()[0].props['aria-setsize'], 10000)
virtualApi.value.scrollToIndex(5000, 'center'); await nextTick()
assert.equal(virtualRoot.children[0].scrollTop, 199920)
assert.equal(virtualRows().length, 9)
assert.deepEqual(virtualRanges.at(-1), { start: 4996, end: 5005 })
virtualApi.value.scrollToIndex(5000, 'auto'); await nextTick()
assert.equal(virtualRoot.children[0].scrollTop, 199920)
virtualApi.value.scrollToIndex(99999, 'end'); await nextTick()
assert.equal(virtualRoot.children[0].scrollTop, 399800)
assert.equal(virtualRows().at(-1).props['aria-posinset'], 10000)
virtualItems.value = virtualItems.value.slice(0, 3); await nextTick()
assert.equal(virtualRoot.children[0].scrollTop, 0)
assert.equal(virtualRows().length, 3)
virtualItems.value = Array.from({ length: 100 }, (_, id) => ({ id })); await nextTick()
virtualRoot.children[0].props.onScroll({ target: { scrollTop: 85 } }); await nextTick()
assert.deepEqual(virtualScrolls, [85])
assert.equal(virtualRows().length, 10)
virtualApi.value.scrollTo(-100); await nextTick()
assert.equal(virtualRoot.children[0].scrollTop, 0)
virtualItems.value = []; await nextTick()
assert.equal(virtualRows().length, 0)
assert.deepEqual(virtualRanges.at(-1), { start: 0, end: 0 })
virtualApp.unmount()
const invalidVirtual = mount(LuVirtualList, { items: [1, 2], height: NaN, itemHeight: 0, overscan: -2 })
assert.equal(invalidVirtual.root.children[0].props.style.height, '300px')
assert.equal(findAll(invalidVirtual.root, n => n.props?.role === 'listitem').length, 2)
invalidVirtual.app.unmount()
console.log('Passed: image lazy attributes, stale events, error/retry/load; virtual list bounded rendering, positioning, shrinkage, scrolling, empty and invalid dimensions.')

const savedResizeObserver = globalThis.ResizeObserver
const resizeObservers = new Set()
globalThis.ResizeObserver = class {
  constructor(callback) { this.callback = callback; resizeObservers.add(this) }
  observe(element) { this.element = toRaw(element) }
  disconnect() { resizeObservers.delete(this) }
}
try {
  const dynamicItems = ref(Array.from({ length: 100 }, (_, id) => ({ id })))
  const dynamicRoot = { children: [] }, dynamicApi = ref()
  const dynamicApp = renderer.createApp({ render: () => h(LuVirtualList, {
    ref: dynamicApi, items: dynamicItems.value, dynamic: true, height: 120, itemHeight: 40, overscan: 2, itemKey: 'id'
  }, { default: ({ item }) => h('span', String(item.id)) }) })
  dynamicApp.mount(dynamicRoot)
  const rows = () => findAll(dynamicRoot, n => n.props?.role === 'listitem')
  const total = () => findAll(dynamicRoot, n => n.props?.class === 'epx-virtual-list__spacer')[0].props.style.height
  const resize = (row, height) => {
    row.getBoundingClientRect = () => ({ height })
    const observer = [...resizeObservers].find(observer => observer.element === row)
    assert.ok(observer)
    observer.callback([])
  }
  resize(rows()[0], 100); await nextTick()
  assert.equal(total(), '4060px')
  assert.equal(rows()[0].props.style, undefined)
  dynamicApi.value.scrollTo(110); await nextTick()
  resize(rows()[0], 160); await nextTick()
  assert.equal(dynamicRoot.children[0].scrollTop, 170, 'growing a row above the viewport preserves the anchor')
  resize(rows()[0], 80); await nextTick()
  assert.equal(dynamicRoot.children[0].scrollTop, 90, 'shrinking a row above the viewport preserves the anchor')
  dynamicItems.value = [{ id: -1 }, ...dynamicItems.value]; await nextTick()
  assert.equal(dynamicRoot.children[0].scrollTop, 130, 'prepending keeps the same stable-key item in view')
  assert.equal(total(), '4080px', 'height follows its stable key')
  dynamicItems.value = dynamicItems.value.filter(item => item.id !== -1); await nextTick()
  assert.equal(dynamicRoot.children[0].scrollTop, 90)
  dynamicApi.value.scrollToIndex(50, 'center'); await nextTick()
  const targetRow = rows().find(row => row.props['aria-posinset'] === 51)
  resize(targetRow, 120); await nextTick()
  assert.equal(dynamicRoot.children[0].scrollTop, 2040, 'center alignment corrects after target measurement')
  assert.ok(rows().length <= 8)
  const viewportObserver = [...resizeObservers].find(observer => observer.element === dynamicRoot.children[0])
  dynamicRoot.children[0].clientWidth = 240
  viewportObserver.callback([]); await nextTick()
  assert.equal(total(), '4080px', 'width changes discard offscreen measurements and remeasure mounted rows')
  dynamicItems.value = []; await nextTick()
  assert.equal(rows().length, 0)
  assert.equal(dynamicRoot.children[0].scrollTop, 0)
  dynamicApp.unmount()
  assert.equal(resizeObservers.size, 0, 'all observers disconnect on unmount')
} finally {
  if (savedResizeObserver === undefined) delete globalThis.ResizeObserver
  else globalThis.ResizeObserver = savedResizeObserver
}
console.log('Passed: dynamic measurements, height changes, scroll anchors, stable-key prepend/removal, estimated positioning, width invalidation and observer cleanup.')

const previewApi = ref(), previewRoot = { children: [] }, previewSources = ref(['one.png', 'two.png']), previewEvents = []
const previewApp = renderer.createApp({ render: () => h(LuImage, {
  ref: previewApi, src: 'thumb.png', previewSrcList: previewSources.value, infinite: false,
  minScale: 0.5, maxScale: 2, zoomRate: 2,
  onShow: () => previewEvents.push('show'), onClose: () => previewEvents.push('close'), onSwitch: index => previewEvents.push(index)
}) })
previewApp.mount(previewRoot)
const viewerButton = label => findAll(teleportHost, n => n.props?.['aria-label'] === label)[0]
const previewImage = () => findAll(teleportHost, n => n.type === 'img')[0]
findAll(previewRoot, n => n.type === 'img')[0].props.onLoad({})
await nextTick()
findAll(previewRoot, n => n.props?.['aria-haspopup'] === 'dialog')[0].props.onClick()
await nextTick()
assert.equal(findAll(teleportHost, n => n.props?.role === 'dialog').length, 1)
assert.equal(previewImage().props.src, 'one.png')
assert.equal(viewerButton('Previous image').props.disabled, true)
previewImage().props.onLoad({}); await nextTick()
viewerButton('Zoom in').props.onClick(); await nextTick()
assert.ok(previewImage().props.style.transform.includes('scale(2)'))
assert.equal(viewerButton('Zoom in').props.disabled, true)
viewerButton('Rotate right').props.onClick(); await nextTick()
assert.ok(previewImage().props.style.transform.includes('rotate(90deg)'))
previewImage().props.onPointerdown({ button: 0, pointerId: 1, clientX: 10, clientY: 20, currentTarget: previewImage(), preventDefault() {} })
previewImage().props.onPointermove({ pointerId: 1, clientX: 60, clientY: 80 }); await nextTick()
assert.ok(previewImage().props.style.transform.includes('translate(50px, 60px)'))
previewImage().props.onPointerup({ pointerId: 1 })
viewerButton('Reset image').props.onClick(); await nextTick()
assert.equal(previewImage().props.style.transform, 'translate(0px, 0px) rotate(0deg) scale(1)')
const oldPreview = previewImage()
viewerButton('Next image').props.onClick(); await nextTick()
assert.equal(previewImage().props.src, 'two.png')
assert.equal(viewerButton('Next image').props.disabled, true)
oldPreview.props.onError({}); await nextTick()
assert.ok(previewImage())
previewImage().props.onError({}); await nextTick()
assert.equal(previewImage(), undefined)
findAll(teleportHost, n => n.type === 'button' && n.text === 'Retry')[0].props.onClick(); await nextTick()
assert.equal(previewImage().props.src, 'two.png')
viewerButton('Close preview').props.onClick(); await nextTick()
assert.equal(findAll(teleportHost, n => n.props?.role === 'dialog').length, 0)
assert.deepEqual(previewEvents, ['show', 1, 'close'])
previewApi.value.showPreview(999); await nextTick()
assert.equal(previewImage().props.src, 'two.png')
previewSources.value = []; await nextTick()
assert.equal(findAll(teleportHost, n => n.props?.role === 'dialog').length, 0)
previewApp.unmount()
console.log('Passed: image preview opening, navigation boundaries, zoom bounds, rotation, dragging, reset, stale events, retry, close and source removal.')

const originalPreviewDocument = globalThis.document
const previewKeyHandlers = new Set()
let restoredPreviewFocus = 0
const previewOrigin = { isConnected: true, focus() { restoredPreviewFocus++ } }
globalThis.document = {
  activeElement: previewOrigin,
  body: { style: { overflow: 'auto' } },
  addEventListener(name, callback) { if (name === 'keydown') previewKeyHandlers.add(callback) },
  removeEventListener(name, callback) { if (name === 'keydown') previewKeyHandlers.delete(callback) }
}
try {
  const keyboardApi = ref(), keyboardRoot = { children: [] }
  const keyboardApp = renderer.createApp({ render: () => h(LuImage, { ref: keyboardApi, previewSrcList: ['a.png', 'b.png'] }) })
  keyboardApp.mount(keyboardRoot)
  keyboardApi.value.showPreview(); await nextTick(); await nextTick()
  assert.equal(document.body.style.overflow, 'hidden')
  assert.equal(viewerButton('Close preview').focused, true)
  const key = (key, extras = {}) => {
    let prevented = false
    for (const callback of previewKeyHandlers) callback({ key, preventDefault() { prevented = true }, stopPropagation() {}, ...extras })
    return prevented
  }
  assert.equal(key('ArrowLeft'), true)
  await nextTick()
  assert.equal(previewImage().props.src, 'b.png', 'infinite mode wraps from first to last')
  key('ArrowRight'); await nextTick()
  assert.equal(previewImage().props.src, 'a.png')
  previewImage().props.onLoad({}); await nextTick()
  key('+'); key('r'); await nextTick()
  assert.ok(previewImage().props.style.transform.includes('scale(1.2)'))
  assert.ok(previewImage().props.style.transform.includes('rotate(90deg)'))
  key('0'); await nextTick()
  assert.ok(previewImage().props.style.transform.includes('scale(1)'))
  const keyboardPanel = findAll(teleportHost, node => node.props?.role === 'dialog')[0]
  const keyboardButtons = findAll(keyboardPanel, node => node.type === 'button' && !node.props.disabled)
  keyboardPanel.querySelectorAll = () => keyboardButtons
  document.activeElement = keyboardButtons[0]
  assert.equal(key('Tab', { shiftKey: true }), true)
  assert.equal(keyboardButtons.at(-1).focused, true)
  document.activeElement = keyboardButtons.at(-1)
  assert.equal(key('Tab'), true)
  assert.equal(keyboardButtons[0].focused, true)
  key('Escape'); await nextTick()
  assert.equal(findAll(teleportHost, node => node.props?.role === 'dialog').length, 0)
  assert.equal(document.body.style.overflow, 'auto')
  assert.equal(restoredPreviewFocus, 1)
  assert.equal(previewKeyHandlers.size, 0)
  keyboardApp.unmount()
} finally {
  if (originalPreviewDocument === undefined) delete globalThis.document
  else globalThis.document = originalPreviewDocument
}
console.log('Passed: preview keyboard navigation/zoom/rotation/reset, focus cycling/return, Escape and scroll-lock cleanup.')
