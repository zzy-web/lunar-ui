# Collapse

Compose collapsible content with CollapseItem. Supports multiple panels, accordion mode, async guards and custom headers.

<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

## Multiple panels and disabled items

<DemoBlock direction="column">
<lu-collapse v-model="open">
  <lu-collapse-item name="overview" title="Overview">Lunar UI uses Vue 3 and theme variables.</lu-collapse-item>
  <lu-collapse-item name="details" title="Details">Each panel can be expanded independently.</lu-collapse-item>
  <lu-collapse-item name="locked" title="Locked" disabled>Unavailable content</lu-collapse-item>
</lu-collapse>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

<template>
  <lu-collapse v-model="open">
    <lu-collapse-item name="overview" title="Overview">Lunar UI uses Vue 3 and theme variables.</lu-collapse-item>
    <lu-collapse-item name="details" title="Details">Each panel can be expanded independently.</lu-collapse-item>
    <lu-collapse-item name="locked" title="Locked" disabled>Unavailable content</lu-collapse-item>
  </lu-collapse>
</template>
```

</template>
</DemoBlock>

## Accordion and title slots

<DemoBlock direction="column">
<lu-collapse v-model="accordion" accordion expand-icon-position="left">
  <lu-collapse-item name="account">
    <template #title="{ isActive }">Account <lu-tag size="small">{{ isActive ? 'Open' : 'Closed' }}</lu-tag></template>
    Edit your profile and preferences.
  </lu-collapse-item>
  <lu-collapse-item name="security" title="Security">Configure account security.</lu-collapse-item>
</lu-collapse>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

<template>
  <lu-collapse v-model="accordion" accordion expand-icon-position="left">
    <lu-collapse-item name="account">
      <template #title="{ isActive }">Account <lu-tag size="small">{{ isActive ? 'Open' : 'Closed' }}</lu-tag></template>
      Edit your profile and preferences.
    </lu-collapse-item>
    <lu-collapse-item name="security" title="Security">Configure account security.</lu-collapse-item>
  </lu-collapse>
</template>
```

</template>
</DemoBlock>

## Async expansion guard

<DemoBlock direction="column">
<lu-switch v-model="allow" active-text="Allow changes" />
<lu-collapse v-model="guarded" :before-collapse="guard">
  <lu-collapse-item name="guarded" title="Wait 500ms before changing">The guard accepted this change.</lu-collapse-item>
</lu-collapse>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

<template>
  <lu-switch v-model="allow" active-text="Allow changes" />
  <lu-collapse v-model="guarded" :before-collapse="guard">
    <lu-collapse-item name="guarded" title="Wait 500ms before changing">The guard accepted this change.</lu-collapse-item>
  </lu-collapse>
</template>
```

</template>
</DemoBlock>

## Lazy content and destruction

<DemoBlock direction="column">
<lu-collapse>
  <lu-collapse-item name="retained" title="Lazy: value is retained" lazy><lu-input-number label="Retained quantity" /></lu-collapse-item>
  <lu-collapse-item name="destroyed" title="Destroy on close: value resets" destroy-on-close><lu-input-number label="Reset quantity" /></lu-collapse-item>
</lu-collapse>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const open = ref(['overview'])
const accordion = ref('account')
const guarded = ref([])
const allow = ref(true)
const guard = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return allow.value
}
</script>

<template>
  <lu-collapse>
    <lu-collapse-item name="retained" title="Lazy: value is retained" lazy><lu-input-number label="Retained quantity" /></lu-collapse-item>
    <lu-collapse-item name="destroyed" title="Destroy on close: value resets" destroy-on-close><lu-input-number label="Reset quantity" /></lu-collapse-item>
  </lu-collapse>
</template>
```

</template>
</DemoBlock>

## Behavior

Use a name array for multiple panels; use a string/number in accordion mode, with null for all closed (zero and empty-string names are supported). Native header buttons support Enter/Space to toggle and Up/Down/Home/End to move focus, skipping disabled items. Names must be unique.

## Collapse Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `CollapseValue` | `[]` | Expanded names; null closes an accordion |
| `accordion` | `boolean` | `false` | Open at most one panel |
| `disabled` | `boolean` | `false` | Disable the group |
| `expandIconPosition` | `left / right` | `right` | Arrow placement |
| `beforeCollapse` | `(name, expanded) => boolean / void / Promise` | `—` | Return false or reject to veto a toggle |

## Events

`update:modelValue(value)` / `change(value)` fire on accepted changes; `collapse-error(error)` reports thrown/rejected guards. Repeated actions are ignored while pending. External value, mode or disabled changes invalidate old requests.

## Slots

Collapse default contains CollapseItem children. CollapseItem default renders content; title / icon receive { isActive }. Do not nest interactive elements inside the header button.

## Types and additional API

CollapseItem props: required name: string | number; title: string = ''; disabled: boolean = false; lazy: boolean = false (mount on first open); destroyOnClose: boolean = false (unmount on close, taking precedence over lazy). Collapse refs expose read-only activeNames; CollapseItem refs expose isActive.

Feature reference：[Element Plus Collapse](https://element-plus.org/en-US/component/collapse.html)。This page documents Lunar UI's supported API; it is not a drop-in replacement.
