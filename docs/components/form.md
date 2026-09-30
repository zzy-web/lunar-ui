# Form 表单

`LuForm` 和 `LuFormItem` 用于收集、排列和校验表单数据，组件标签为 `<lu-form>` 和 `<lu-form-item>`。

<script setup>
import { reactive, ref } from 'vue'

const basicForm = reactive({ name: '', email: '' })
const validateForm = reactive({ username: '', password: '' })
const formRef = ref()
const validateMessage = ref('')

const rules = {
  username: { required: true, message: '请输入用户名' },
  password: [
    { required: true, message: '请输入密码' },
    { validator: (value) => String(value || '').length >= 6 || '密码至少 6 位' }
  ]
}

async function submitForm() {
  const valid = await formRef.value?.validate()
  validateMessage.value = valid ? '校验通过' : '请完善表单'
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

## 基础用法

通过 `model` 传入表单数据，使用 `label-width` 控制标签宽度。

<DemoBlock>
  <lu-form :model="basicForm" label-width="80px">
    <lu-form-item label="姓名">
      <lu-input v-model="basicForm.name" placeholder="请输入姓名" />
    </lu-form-item>
    <lu-form-item label="邮箱">
      <lu-input v-model="basicForm.email" placeholder="请输入邮箱" />
    </lu-form-item>
    <lu-form-item>
      <lu-button type="primary">提交</lu-button>
      <lu-button>重置</lu-button>
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
    <lu-form-item label="姓名">
      <lu-input v-model="form.name" placeholder="请输入姓名" />
    </lu-form-item>
    <lu-form-item label="邮箱">
      <lu-input v-model="form.email" placeholder="请输入邮箱" />
    </lu-form-item>
    <lu-form-item>
      <lu-button type="primary">提交</lu-button>
      <lu-button>重置</lu-button>
    </lu-form-item>
  </lu-form>
</template>
```

  </template>
</DemoBlock>

## 顶部标签

设置 `label-position="top"` 可以让标签显示在控件上方。

<DemoBlock>
  <lu-form :model="basicForm" label-position="top">
    <lu-form-item label="姓名">
      <lu-input v-model="basicForm.name" placeholder="请输入姓名" />
    </lu-form-item>
    <lu-form-item label="邮箱">
      <lu-input v-model="basicForm.email" placeholder="请输入邮箱" />
    </lu-form-item>
  </lu-form>

  <template #source>

```vue
<template>
  <lu-form :model="form" label-position="top">
    <lu-form-item label="姓名">
      <lu-input v-model="form.name" placeholder="请输入姓名" />
    </lu-form-item>
    <lu-form-item label="邮箱">
      <lu-input v-model="form.email" placeholder="请输入邮箱" />
    </lu-form-item>
  </lu-form>
</template>
```

  </template>
</DemoBlock>

## 表单校验

通过 `rules` 设置规则，调用表单实例的 `validate()` 执行校验。

<DemoBlock>
  <lu-form ref="formRef" :model="validateForm" :rules="rules" label-width="80px">
    <lu-form-item label="用户名" prop="username">
      <lu-input v-model="validateForm.username" placeholder="请输入用户名" />
    </lu-form-item>
    <lu-form-item label="密码" prop="password">
      <lu-input v-model="validateForm.password" type="password" placeholder="至少 6 位" />
    </lu-form-item>
    <lu-form-item>
      <lu-button type="primary" @click="submitForm">校验</lu-button>
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
  username: { required: true, message: '请输入用户名' },
  password: [
    { required: true, message: '请输入密码' },
    { validator: (value) => String(value || '').length >= 6 || '密码至少 6 位' }
  ]
}

async function submit() {
  const valid = await formRef.value?.validate()
  console.log(valid)
}
</script>

<template>
  <lu-form ref="formRef" :model="form" :rules="rules" label-width="80px">
    <lu-form-item label="用户名" prop="username">
      <lu-input v-model="form.username" placeholder="请输入用户名" />
    </lu-form-item>
    <lu-form-item label="密码" prop="password">
      <lu-input v-model="form.password" type="password" placeholder="至少 6 位" />
    </lu-form-item>
    <lu-form-item>
      <lu-button type="primary" @click="submit">校验</lu-button>
    </lu-form-item>
  </lu-form>
</template>
```

  </template>
</DemoBlock>


## 统一状态、嵌套字段与重置

所有表单控件继承表单的禁用状态和尺寸；控件或分组显式设置的尺寸优先。重置恢复各字段挂载时的初始值，此示例中的附件只保存在本地，不会发送上传请求。

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

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | `undefined` | 表单数据对象。 |
| `rules` | `FormRules` | `undefined` | 表单校验规则。 |
| `labelWidth` | `string \| number` | `undefined` | 标签宽度。 |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | 标签位置。 |

## Form 方法

必填规则会拒绝 `undefined`、`null`、空字符串和空数组，适用于 CheckboxGroup、多选 Select 等数组字段。`0` 和 `false` 是有效值；需要必须勾选协议时，请使用自定义校验。字段值变化会自动执行 change 规则，焦点离开表单项会执行 blur 规则。`validate()` 忽略 trigger 并执行全部规则。

| 方法名 | 说明 |
| --- | --- |
| `validate` | 校验所有已注册的表单项，返回 `Promise<boolean>`。 |
| `clearValidate` | 清空所有表单项的校验状态。 |

## FormItem Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | `undefined` | 表单项标签。 |
| `prop` | `string` | `undefined` | 对应 `model` 和 `rules` 的字段名。 |
| `required` | `boolean` | `false` | 是否必填。 |
| `rules` | `FormRule \| FormRule[]` | `undefined` | 当前表单项的校验规则。 |

## 插槽

| 组件 | 插槽名 | 说明 |
| --- | --- | --- |
| `LuForm` | `default` | 表单内容。 |
| `LuFormItem` | `default` | 表单项内容。 |

## 新增表单 API

- `disabled?: boolean`：统一禁用所有后代 Lunar 表单控件及按钮；子控件不能覆盖表单禁用状态。
- `size?: 'small' | 'default' | 'large'`：设置默认控件尺寸。Upload 没有尺寸变体。
- `validateField(prop: string | string[]): Promise<boolean>`：仅校验指定字段。
- `clearValidate(prop?: string | string[])`：清空指定或全部字段的错误，同时使旧的异步校验结果失效。
- `resetFields(prop?: string | string[]): Promise<void>`：恢复指定或全部已挂载字段的初始值并清空错误；再次校验前请等待重置完成。原生 reset 按钮会自动调用此方法。
- `submit(event)`：发出已阻止默认提交的原生事件。在提交处理函数内调用并等待 `validate()`，通过后再保存。

`FormItem.prop` 支持 `profile.name`、`rows[0].title` 等路径，rules 使用相同完整路径作为键。动态修改 prop 后会重新捕获该字段初始值。重置快照递归复制普通对象、数组和日期，File/Blob 保持原对象；替换 model 不会覆盖初始快照。

`FormItem` 新增 `for?: string`，可与控件 ID 关联标签；`validateOnChange?: boolean` 默认为 `true`，设为 false 可关闭值变化时自动校验，失焦及手动校验仍有效。默认插槽提供 `{ error, validating }`。实例暴露 `validate(trigger?)`、`clearValidate()`、`resetField()`、`errorMessage` 和 `validating`。

## 校验规则

`FormRule` 在原有 required、message、validator 之外，支持 `trigger: 'blur' | 'change' | ('blur' | 'change')[]`、`min`、`max`、`len` 和 `pattern: RegExp`。数值字段检查数值范围，字符串和数组检查长度；非必填空值跳过范围与正则检查，自定义 validator 仍会执行。validator 返回 true、false、错误字符串或相应 Promise，抛出异常或 Promise 拒绝会转换为字段错误。已过期的异步校验返回 false，不会覆盖新结果或重置后的状态。

## 使用建议

- 把校验规则写在对应字段附近，并在提交时再次校验整个表单。
- 重置行为应与用户预期一致：恢复初始数据还是清空字段，需要在业务中明确。
