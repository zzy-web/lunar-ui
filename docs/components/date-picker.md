# DatePicker 日期选择器

选择本地日期或起止日期，绑定值使用 Date 对象。

<script setup>
import { ref } from 'vue'
const day = ref(null)
const range = ref(null)
const shortcuts = [{ label: '最近 7 天', value: () => {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 6)
  return [start, end]
} }]
</script>

<lu-date-picker v-model="day" locale="zh-CN" />
<lu-date-picker v-model="range" range :shortcuts="shortcuts" locale="zh-CN" placeholder="选择日期范围" />

```vue
<lu-date-picker v-model="day" />
<lu-date-picker v-model="range" range :shortcuts="shortcuts" />
```

## API

| 属性 | 类型 | 默认值 |
| --- | --- | --- |
| `v-model` | `Date / [Date, Date] / null` | `null` |
| `range` / `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `true` |
| `locale` | `zh-CN / en-US` | `zh-CN` |
| `placeholder` | `string` | — |
| `disabled-date` | `(date: Date) => boolean` | — |
| `shortcuts` | `{ label: string, value: () => Date \| [Date, Date] }[]` | — |

确认选择或清空时触发 `change`。范围模式选完两个端点才提交，并按日期排序。两个端点都受 `disabled-date` 约束。按 Escape 可取消尚未完成的选择。
