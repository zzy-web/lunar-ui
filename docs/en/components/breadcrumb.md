# Breadcrumb

Show the current page in a navigation hierarchy.

## Basic usage

<DemoBlock direction="column">
<lu-breadcrumb :items="[{ label: 'Home', href: '../' }, { label: 'Components', href: './' }, { label: 'Breadcrumb' }]" />
<template #source>

```vue
<template>
<lu-breadcrumb :items="[{ label: 'Home', href: '../' }, { label: 'Components', href: './' }, { label: 'Breadcrumb' }]" />
</template>
```

</template>
</DemoBlock>

## Custom separator

<DemoBlock direction="column">
<lu-breadcrumb separator="›" :items="[{ label: 'Home', href: '../' }, { label: 'Components', href: './' }, { label: 'Breadcrumb' }]" />
<template #source>

```vue
<template>
<lu-breadcrumb separator="›" :items="[{ label: 'Home', href: '../' }, { label: 'Components', href: './' }, { label: 'Breadcrumb' }]" />
</template>
```

</template>
</DemoBlock>

## Breadcrumb Props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | `[]` | Label and optional href |
| `separator` | `string` | `/` | Separator text |
| `label` | `string` | `Breadcrumb` | Accessible navigation name |

## Slots

The default slot receives `{ item, index }`. The `separator` slot replaces the separator. The last item uses `aria-current="page"` and never renders a link.
