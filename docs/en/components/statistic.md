# Statistic

Display dashboard metrics, amounts and counts with theme and dark-mode support.

## Basic usage

<DemoBlock>
  <lu-statistic title="Active users" :value="128640" />
  <lu-statistic title="Monthly revenue" :value="98652.38" :precision="2" prefix="$" />
  <lu-statistic title="Completion" :value="92.6" :precision="1" suffix="%" />
  <template #source>

```vue
<template>
  <lu-statistic title="Active users" :value="128640" />
  <lu-statistic title="Monthly revenue" :value="98652.38" :precision="2" prefix="$" />
  <lu-statistic title="Completion" :value="92.6" :precision="1" suffix="%" />
</template>
```

  </template>
</DemoBlock>

## Custom formatting and slots

`formatter` overrides precision and separators. Its result is rendered as plain text.

<DemoBlock>
  <lu-statistic title="Downloads" :value="128640" :formatter="value => `${(value / 1000).toFixed(1)}K`">
    <template #suffix><lu-tag type="success">Up 12%</lu-tag></template>
  </lu-statistic>
  <lu-statistic title="Custom separators" :value="12345.67" :precision="2" group-separator=" " decimal-separator="," />
  <template #source>

```vue
<template>
  <lu-statistic title="Downloads" :value="128640" :formatter="value => `${(value / 1000).toFixed(1)}K`">
    <template #suffix><lu-tag type="success">Up 12%</lu-tag></template>
  </lu-statistic>
  <lu-statistic title="Custom separators" :value="12345.67" :precision="2" group-separator=" " decimal-separator="," />
</template>
```

  </template>
</DemoBlock>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Numeric value; non-finite values display `—` by default |
| `title` | `string` | — | Metric label |
| `precision` | `number` | `0` | Decimal places, truncated and clamped to 0–20; non-finite precision uses 0 |
| `groupSeparator` | `string` | `,` | Thousands separator; empty string disables grouping |
| `decimalSeparator` | `string` | `.` | Decimal separator |
| `prefix` / `suffix` | `string` | — | Content before / after the value |
| `formatter` | `(value: number) => string \| number` | — | Custom display receiving the original value |
| `valueStyle` | `CSSProperties` | — | Styles for the value area |

## Slots

`title`, `prefix` and `suffix` override the corresponding props. This read-only component emits no events.

The default uses fixed three-digit grouping to keep server and client formatting consistent across system languages. Perform monetary calculations in application code; this component handles display and rounding.
