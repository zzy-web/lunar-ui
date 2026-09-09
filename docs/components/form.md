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

## Form Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | `undefined` | 表单数据对象。 |
| `rules` | `FormRules` | `undefined` | 表单校验规则。 |
| `labelWidth` | `string \| number` | `undefined` | 标签宽度。 |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | 标签位置。 |

## Form 方法

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
