# DatePicker 

Select a local calendar day or a start and end date. The model uses Date objects.

<script setup>
import { ref } from 'vue'
const day = ref(null)
const range = ref(null)
const shortcuts = [{ label: 'Last 7 days', value: () => {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 6)
  return [start, end]
} }]
</script>

<lu-date-picker v-model="day" locale="en-US" />
<lu-date-picker v-model="range" range :shortcuts="shortcuts" locale="en-US" placeholder="Select a date range" />

```vue
<lu-date-picker v-model="day" />
<lu-date-picker v-model="range" range :shortcuts="shortcuts" />
```

## API

| Prop | Type | Default |
| --- | --- | --- |
| `v-model` | `Date / [Date, Date] / null` | `null` |
| `range` / `disabled` | `boolean` | `false` |
| `clearable` | `boolean` | `true` |
| `locale` | `zh-CN / en-US` | `zh-CN` |
| `placeholder` | `string` | — |
| `disabled-date` | `(date: Date) => boolean` | — |
| `shortcuts` | `{ label: string, value: () => Date \| [Date, Date] }[]` | — |

The `change` event fires when a selection is committed or cleared. A range is committed after choosing both endpoints. Endpoints are sorted and validated against `disabled-date`. Escape cancels a partial selection.
