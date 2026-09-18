# Statistic 数值统计

展示仪表盘指标、金额和数量。使用主题变量，支持深色模式。

## 基础用法

<DemoBlock>
  <lu-statistic title="活跃用户" :value="128640" />
  <lu-statistic title="本月收入" :value="98652.38" :precision="2" prefix="¥" />
  <lu-statistic title="完成率" :value="92.6" :precision="1" suffix="%" />
  <template #source>

```vue
<template>
  <lu-statistic title="活跃用户" :value="128640" />
  <lu-statistic title="本月收入" :value="98652.38" :precision="2" prefix="¥" />
  <lu-statistic title="完成率" :value="92.6" :precision="1" suffix="%" />
</template>
```

  </template>
</DemoBlock>

## 自定义格式与插槽

`formatter` 优先于精度和分隔符配置。返回值作为纯文本显示。

<DemoBlock>
  <lu-statistic title="下载量" :value="128640" :formatter="value => `${(value / 10000).toFixed(1)} 万`">
    <template #suffix><lu-tag type="success">增长 12%</lu-tag></template>
  </lu-statistic>
  <lu-statistic title="自定义分隔符" :value="12345.67" :precision="2" group-separator=" " decimal-separator="," />
  <template #source>

```vue
<template>
  <lu-statistic title="下载量" :value="128640" :formatter="value => `${(value / 10000).toFixed(1)} 万`">
    <template #suffix><lu-tag type="success">增长 12%</lu-tag></template>
  </lu-statistic>
  <lu-statistic title="自定义分隔符" :value="12345.67" :precision="2" group-separator=" " decimal-separator="," />
</template>
```

  </template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `number` | `0` | 数值，非有限数默认显示 `—` |
| `title` | `string` | — | 指标名称 |
| `precision` | `number` | `0` | 小数位数，取整并限制在 0–20，非有限数按 0 处理 |
| `groupSeparator` | `string` | `,` | 千位分隔符，空字符串取消分隔 |
| `decimalSeparator` | `string` | `.` | 小数分隔符 |
| `prefix` / `suffix` | `string` | — | 前缀 / 后缀 |
| `formatter` | `(value: number) => string \| number` | — | 自定义显示，接收原始数值 |
| `valueStyle` | `CSSProperties` | — | 数值区域样式 |

## 插槽

`title`、`prefix`、`suffix` 插槽覆盖对应属性。组件为只读展示，不触发事件。

默认使用固定的三位分组规则，避免服务端与客户端系统语言不同导致格式不一致。金额计算应在业务层完成；组件负责数值展示与舍入。
