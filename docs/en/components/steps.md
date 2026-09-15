# Steps

Show workflow progress with five statuses, horizontal/vertical layouts, a simple theme and optional interactive steps.

<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

## Basic progress

<DemoBlock direction="column">
<lu-steps :active="active" :items="items" finish-status="success" />
<lu-button @click="active = (active + 1) % 4">Next step</lu-button>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

<template>
  <lu-steps :active="active" :items="items" finish-status="success" />
  <lu-button @click="active = (active + 1) % 4">Next step</lu-button>
</template>
```

</template>
</DemoBlock>

## Centered and interactive steps

<DemoBlock direction="column">
<lu-steps v-model:active="active" :items="items" clickable align-center finish-status="success" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

<template>
  <lu-steps v-model:active="active" :items="items" clickable align-center finish-status="success" />
</template>
```

</template>
</DemoBlock>

## Vertical statuses and slots

<DemoBlock direction="column">
<lu-steps :active="1" :items="review" direction="vertical">
  <template #title="{ item, index }">{{ index + 1 }}. {{ item.title }}</template>
</lu-steps>
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

<template>
  <lu-steps :active="1" :items="review" direction="vertical">
    <template #title="{ item, index }">{{ index + 1 }}. {{ item.title }}</template>
  </lu-steps>
</template>
```

</template>
</DemoBlock>

## Simple theme

<DemoBlock direction="column">
<lu-steps :active="active" :items="items" simple finish-status="success" />
<template #source>

```vue
<script setup>
import { ref } from 'vue'
const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your profile' },
  { title: 'Verify', description: 'Confirm your details' },
  { title: 'Complete', description: 'You are ready to go' }
]
const review = [{ title: 'Uploaded', status: 'success' }, { title: 'Review', status: 'error', description: 'Please retry' }, { title: 'Publish' }]
</script>

<template>
  <lu-steps :active="active" :items="items" simple finish-status="success" />
</template>
```

</template>
</DemoBlock>

## Behavior

active is zero-based; equal to item count means completion. An item's status overrides automatic status. Steps are display-only by default. clickable enables click, arrow and Home/End selection, skipping disabled items. Configure steps through an items array, consistent with the library's data-driven Tabs API.

## Steps Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `active` | `number` | `0` | Current step; supports v-model:active and internal state |
| `items` | `StepItem[]` | `[]` | Titles, descriptions, icons, statuses and disabled flags |
| `direction` | `horizontal / vertical` | `horizontal` | Direction |
| `processStatus / finishStatus` | `StepStatus` | `process / finish` | Current / completed status |
| `alignCenter` | `boolean` | `false` | Center horizontal content |
| `simple` | `boolean` | `false` | Simple theme, hides descriptions |
| `space` | `number / string` | `—` | Fixed spacing, numeric pixels; ignored in simple mode |
| `clickable` | `boolean` | `false` | Enable step selection |
| `label` | `string` | `Progress` | Accessible list label |
| `statusLabels` | `Partial<Record<StepStatus, string>>` | `English labels` | Localized screen-reader status text |

## Events

`update:active(index)` and `change(index, previous)` fire when the user selects a different enabled step; external active updates do not emit.

## Slots

title / description receive { item, index }; icon receives { item, index, status }.

## Types and additional API

StepItem: required title: string; optional description: string, icon: string (text icon; use slots for complex icons), status: StepStatus, disabled: boolean. StepStatus is wait, process, finish, success or error.

Feature reference：[Element Plus Steps](https://element-plus.org/en-US/component/steps.html)。This page documents Lunar UI's supported API; it is not a drop-in replacement.
