# Cascader 

Choose a path through nested categories. Each level uses a native select so it works with the platform keyboard and mobile picker.

<script setup>
import { ref } from 'vue'

const path = ref(['frontend', 'vue'])
const options = [
  { value: 'frontend', label: 'Frontend', children: [
    { value: 'vue', label: 'Vue' }, { value: 'css', label: 'CSS' }
  ] },
  { value: 'backend', label: 'Backend', children: [
    { value: 'python', label: 'Python' }, { value: 'node', label: 'Node.js' }
  ] }
]
</script>

<lu-cascader v-model="path" :options="options" clearable filterable label="Technology" placeholder="Select" />
<p>{{ path.join(' / ') }}</p>

```vue
<lu-cascader v-model="path" :options="options" clearable filterable />
```

## API

| Prop | Type | Default |
| --- | --- | --- |
| `options` | `CascaderOption[]` | — |
| `v-model` | `(string \| number)[]` | `[]` |
| `disabled` / `clearable` / `check-strictly` / `filterable` | `boolean` | `false` |
| `search-label` / `no-match-text` | `string` | `Search options` / `No matching options` |
| `label` / `placeholder` / `clear-label` | `string` | `Category` / `Select` / `Clear selection` |

Options contain `label`, `value`, optional `disabled`, and optional `children`. Values must be unique among siblings. Selecting a leaf emits the complete path in `change`. Enable `check-strictly` to commit parent paths too. Clearing emits an empty array.

Enable `filterable` to match complete paths by any level's label. The search ignores case and surrounding whitespace, and skips disabled branches. Selecting a result restores the level selectors with the chosen path. Escape clears the search.
