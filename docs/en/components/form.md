# Form

`LuForm` and `LuFormItem` collect, align, and validate form data. Use them as `<lu-form>` and `<lu-form-item>`.

<script setup>
import { reactive, ref } from 'vue'

const basicForm = reactive({ name: '', email: '' })
const validateForm = reactive({ username: '', password: '' })
const formRef = ref()
const validateMessage = ref('')

const rules = {
  username: { required: true, message: 'Please enter a username' },
  password: [
    { required: true, message: 'Please enter a password' },
    { validator: (value) => String(value || '').length >= 6 || 'Password must be at least 6 characters' }
  ]
}

async function submitForm() {
  const valid = await formRef.value?.validate()
  validateMessage.value = valid ? 'Valid' : 'Please complete the form'
}

const enhancedRef = ref()
const formDisabled = ref(false)
const formSize = ref('default')
const enhancedMessage = ref('')
const enhancedModel = reactive({ profile: { name: '' }, roles: [], channel: 'email', enabled: true, score: 2.5, amount: 1, volume: 40, mode: 'daily', files: [] })
const enhancedRules = {
  'profile.name': { required: true, min: 2, trigger: 'blur', message: 'Please enter at least 2 characters' },
  roles: { required: true, trigger: 'change', message: 'Select at least one role' }
}
async function validateEnhanced() {
  enhancedMessage.value = await enhancedRef.value.validate() ? 'Valid' : 'Please check the highlighted fields'
}
async function resetEnhanced() {
  await enhancedRef.value.resetFields()
  enhancedMessage.value = ''
}

</script>

## Basic Usage

Pass form data with `model`, and set label width with `label-width`.

<DemoBlock source-label="View source">
  <lu-form :model="basicForm" label-width="80px">
    <lu-form-item label="Name">
      <lu-input v-model="basicForm.name" placeholder="Please enter name" />
    </lu-form-item>
    <lu-form-item label="Email">
      <lu-input v-model="basicForm.email" placeholder="Please enter email" />
    </lu-form-item>
    <lu-form-item>
      <lu-button type="primary">Submit</lu-button>
      <lu-button>Reset</lu-button>
    </lu-form-item>
  </lu-form>

  <template #source>

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({ name: '', email: '' })
</script>

<template>
  <lu-form :model="form" label-width="80px">
    <lu-form-item label="Name">
      <lu-input v-model="form.name" placeholder="Please enter name" />
    </lu-form-item>
    <lu-form-item label="Email">
      <lu-input v-model="form.email" placeholder="Please enter email" />
    </lu-form-item>
    <lu-form-item>
      <lu-button type="primary">Submit</lu-button>
      <lu-button>Reset</lu-button>
    </lu-form-item>
  </lu-form>
</template>
```

  </template>
</DemoBlock>

## Top Labels

Set `label-position="top"` to place labels above controls.

<DemoBlock source-label="View source">
  <lu-form :model="basicForm" label-position="top">
    <lu-form-item label="Name">
      <lu-input v-model="basicForm.name" placeholder="Please enter name" />
    </lu-form-item>
    <lu-form-item label="Email">
      <lu-input v-model="basicForm.email" placeholder="Please enter email" />
    </lu-form-item>
  </lu-form>

  <template #source>

```vue
<template>
  <lu-form :model="form" label-position="top">
    <lu-form-item label="Name">
      <lu-input v-model="form.name" placeholder="Please enter name" />
    </lu-form-item>
    <lu-form-item label="Email">
      <lu-input v-model="form.email" placeholder="Please enter email" />
    </lu-form-item>
  </lu-form>
</template>
```

  </template>
</DemoBlock>

## Validation

Set rules with `rules`, then call `validate()` on the form instance.

<DemoBlock source-label="View source">
  <lu-form ref="formRef" :model="validateForm" :rules="rules" label-width="80px">
    <lu-form-item label="Username" prop="username">
      <lu-input v-model="validateForm.username" placeholder="Please enter username" />
    </lu-form-item>
    <lu-form-item label="Password" prop="password">
      <lu-input v-model="validateForm.password" type="password" placeholder="At least 6 characters" />
    </lu-form-item>
    <lu-form-item>
      <lu-button type="primary" @click="submitForm">Validate</lu-button>
      <span style="margin-left: 12px;">{{ validateMessage }}</span>
    </lu-form-item>
  </lu-form>

  <template #source>

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const form = reactive({ username: '', password: '' })
const rules = {
  username: { required: true, message: 'Please enter a username' },
  password: [
    { required: true, message: 'Please enter a password' },
    { validator: (value) => String(value || '').length >= 6 || 'Password must be at least 6 characters' }
  ]
}

async function submit() {
  const valid = await formRef.value?.validate()
  console.log(valid)
}
</script>

<template>
  <lu-form ref="formRef" :model="form" :rules="rules" label-width="80px">
    <lu-form-item label="Username" prop="username">
      <lu-input v-model="form.username" placeholder="Please enter username" />
    </lu-form-item>
    <lu-form-item label="Password" prop="password">
      <lu-input v-model="form.password" type="password" placeholder="At least 6 characters" />
    </lu-form-item>
    <lu-form-item>
      <lu-button type="primary" @click="submit">Validate</lu-button>
    </lu-form-item>
  </lu-form>
</template>
```

  </template>
</DemoBlock>


## Shared state, nested fields and reset

The controls inherit the form disabled state and size. An explicit control or group size takes precedence. Reset restores the values captured when each field mounted; uploads in this example are local only.

<DemoBlock direction="column">
<lu-switch v-model="formDisabled" active-text="Disable form" />
<lu-segmented v-model="formSize" :options="['small', 'default', 'large']" label="Form size" />
<lu-form ref="enhancedRef" :model="enhancedModel" :rules="enhancedRules" :disabled="formDisabled" :size="formSize" label-position="top" @submit="validateEnhanced">
  <lu-form-item label="Name" prop="profile.name" for="enhanced-name">
    <lu-input id="enhanced-name" v-model="enhancedModel.profile.name" clearable placeholder="At least 2 characters" />
  </lu-form-item>
  <lu-form-item label="Roles" prop="roles">
    <lu-checkbox-group v-model="enhancedModel.roles" :max="2">
      <lu-checkbox value="reader" label="Reader" />
      <lu-checkbox value="editor" label="Editor" />
      <lu-checkbox value="owner" label="Owner" />
    </lu-checkbox-group>
  </lu-form-item>
  <lu-form-item label="Channel" prop="channel">
    <lu-radio-group v-model="enhancedModel.channel">
      <lu-radio value="email" label="Email" />
      <lu-radio value="sms" label="SMS" />
    </lu-radio-group>
  </lu-form-item>
  <lu-form-item label="Frequency" prop="mode">
    <lu-select v-model="enhancedModel.mode" :options="[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }]" aria-label="Frequency" />
  </lu-form-item>
  <lu-form-item label="Enabled" prop="enabled"><lu-switch v-model="enhancedModel.enabled" aria-label="Enabled" /></lu-form-item>
  <lu-form-item label="Amount" prop="amount"><lu-input-number v-model="enhancedModel.amount" :min="0" :max="10" /></lu-form-item>
  <lu-form-item label="Satisfaction" prop="score"><lu-rate v-model="enhancedModel.score" allow-half clearable show-score /></lu-form-item>
  <lu-form-item label="Volume" prop="volume"><lu-slider v-model="enhancedModel.volume" show-input /></lu-form-item>
  <lu-form-item label="Attachments" prop="files"><lu-upload v-model:file-list="enhancedModel.files" :auto-upload="false" multiple :limit="3" /></lu-form-item>
  <lu-button native-type="submit" type="primary">Validate</lu-button>
  <lu-button @click="resetEnhanced">Reset</lu-button>
  <span role="status">{{ enhancedMessage }}</span>
</lu-form>
<template #source>

```vue
<script setup>
import { reactive, ref } from 'vue'

const enhancedRef = ref()
const formDisabled = ref(false)
const formSize = ref('default')
const enhancedMessage = ref('')
const enhancedModel = reactive({ profile: { name: '' }, roles: [], channel: 'email', enabled: true, score: 2.5, amount: 1, volume: 40, mode: 'daily', files: [] })
const enhancedRules = {
  'profile.name': { required: true, min: 2, trigger: 'blur', message: 'Please enter at least 2 characters' },
  roles: { required: true, trigger: 'change', message: 'Select at least one role' }
}
async function validateEnhanced() {
  enhancedMessage.value = await enhancedRef.value.validate() ? 'Valid' : 'Please check the highlighted fields'
}
async function resetEnhanced() {
  await enhancedRef.value.resetFields()
  enhancedMessage.value = ''
}
</script>

<template>
<lu-switch v-model="formDisabled" active-text="Disable form" />
<lu-segmented v-model="formSize" :options="['small', 'default', 'large']" label="Form size" />
<lu-form ref="enhancedRef" :model="enhancedModel" :rules="enhancedRules" :disabled="formDisabled" :size="formSize" label-position="top" @submit="validateEnhanced">
  <lu-form-item label="Name" prop="profile.name" for="enhanced-name">
    <lu-input id="enhanced-name" v-model="enhancedModel.profile.name" clearable placeholder="At least 2 characters" />
  </lu-form-item>
  <lu-form-item label="Roles" prop="roles">
    <lu-checkbox-group v-model="enhancedModel.roles" :max="2">
      <lu-checkbox value="reader" label="Reader" />
      <lu-checkbox value="editor" label="Editor" />
      <lu-checkbox value="owner" label="Owner" />
    </lu-checkbox-group>
  </lu-form-item>
  <lu-form-item label="Channel" prop="channel">
    <lu-radio-group v-model="enhancedModel.channel">
      <lu-radio value="email" label="Email" />
      <lu-radio value="sms" label="SMS" />
    </lu-radio-group>
  </lu-form-item>
  <lu-form-item label="Frequency" prop="mode">
    <lu-select v-model="enhancedModel.mode" :options="[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }]" aria-label="Frequency" />
  </lu-form-item>
  <lu-form-item label="Enabled" prop="enabled"><lu-switch v-model="enhancedModel.enabled" aria-label="Enabled" /></lu-form-item>
  <lu-form-item label="Amount" prop="amount"><lu-input-number v-model="enhancedModel.amount" :min="0" :max="10" /></lu-form-item>
  <lu-form-item label="Satisfaction" prop="score"><lu-rate v-model="enhancedModel.score" allow-half clearable show-score /></lu-form-item>
  <lu-form-item label="Volume" prop="volume"><lu-slider v-model="enhancedModel.volume" show-input /></lu-form-item>
  <lu-form-item label="Attachments" prop="files"><lu-upload v-model:file-list="enhancedModel.files" :auto-upload="false" multiple :limit="3" /></lu-form-item>
  <lu-button native-type="submit" type="primary">Validate</lu-button>
  <lu-button @click="resetEnhanced">Reset</lu-button>
  <span role="status">{{ enhancedMessage }}</span>
</lu-form>
</template>
```

</template>
</DemoBlock>

## Form Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | `undefined` | Form data object. |
| `rules` | `FormRules` | `undefined` | Form validation rules. |
| `labelWidth` | `string \| number` | `undefined` | Label width. |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | Label position. |

## Form Methods

Required rules reject `undefined`, `null`, empty strings and empty arrays, including CheckboxGroup and multiple Select fields. `0` and `false` are valid values; use a custom validator when an agreement must be checked. Value changes automatically validate change rules; leaving a field validates blur rules. `validate()` always runs all rules regardless of trigger.

| Method | Description |
| --- | --- |
| `validate` | Validates all registered form items and returns `Promise<boolean>`. |
| `clearValidate` | Clears validation state for all form items. |

## FormItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `undefined` | Form item label. |
| `prop` | `string` | `undefined` | Field name for `model` and `rules`. |
| `required` | `boolean` | `false` | Marks the field as required. |
| `rules` | `FormRule \| FormRule[]` | `undefined` | Validation rules for this item. |

## Slots

| Component | Slot | Description |
| --- | --- | --- |
| `LuForm` | `default` | Form content. |
| `LuFormItem` | `default` | Form item content. |

## Additional form APIs

- `disabled?: boolean` disables all descendant Lunar form controls and buttons. A child cannot override a disabled form.
- `size?: 'small' | 'default' | 'large'` provides the default control size. Upload has no size variant.
- `validateField(prop: string | string[]): Promise<boolean>` validates selected fields.
- `clearValidate(prop?: string | string[])` clears selected or all fields, including pending validation results.
- `resetFields(prop?: string | string[]): Promise<void>` restores selected or all mounted fields and clears errors. Await it before validating again. Native reset buttons call this automatically.
- `submit(event)` emits the prevented native submit event. Call and await `validate()` in your submit handler before saving.

`FormItem.prop` supports `profile.name` and `rows[0].title`; use that exact path as the rules key. Changing a mounted item's `prop` captures the new field's initial value. Reset snapshots recursively copy plain objects, arrays and dates; File/Blob instances retain their identity. Replacing the model does not replace the initial snapshot.

`FormItem` adds `for?: string` for a control ID and `validateOnChange?: boolean` (default `true`) to disable automatic change validation when set to false. Blur/manual validation remains available. Its default slot receives `{ error, validating }`. The instance exposes `validate(trigger?)`, `clearValidate()`, `resetField()`, `errorMessage` and `validating`.

## Validation rules

`FormRule` supports `trigger: 'blur' | 'change' | ('blur' | 'change')[]`, `min`, `max`, `len`, and `pattern: RegExp`, in addition to `required`, `message` and `validator`. Numeric bounds apply to numbers; string/array bounds apply to length. Empty optional values skip bounds and pattern checks; custom validators still run. A validator returns `true`, `false`, an error string, or a Promise of these values. Thrown/rejected errors become field errors. An obsolete async validation resolves `false` and cannot overwrite a newer result or a reset.
