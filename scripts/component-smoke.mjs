import assert from 'node:assert/strict'
import { createRenderer, h, nextTick, ref } from 'vue'
import LunarUI, { LuCheckbox, LuSwitch, LuTag, LuCalendar, LuInput, LuButton, LuSelect, LuRadio, LuRadioGroup, LuAlert, LuEmpty, EpxCheckbox, EpxSwitch, EpxTag, EpxCalendar, EpxSelect, EpxRadio, EpxRadioGroup, EpxAlert, EpxEmpty } from '../dist/index.js'
import { LuPagination, EpxPagination, LuProgress, EpxProgress, LuDivider, EpxDivider } from '../dist/index.js'

const teleportHost = { children: [] }
const renderer = createRenderer({
  querySelector: selector => selector === 'body' ? teleportHost : null,
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
