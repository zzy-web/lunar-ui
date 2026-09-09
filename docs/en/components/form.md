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

## Form Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | `undefined` | Form data object. |
| `rules` | `FormRules` | `undefined` | Form validation rules. |
| `labelWidth` | `string \| number` | `undefined` | Label width. |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | Label position. |

## Form Methods

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
