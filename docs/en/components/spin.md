# Spin

Show loading feedback for asynchronous work, either on its own or over content.

## Basic usage

<DemoBlock>
  <lu-spin text="Loading…" />
  <template #source>

```vue
<lu-spin text="Loading…" />
```

  </template>
</DemoBlock>

## Content overlay

Setting `loading` to `false` removes the overlay and status indicator.

<DemoBlock>
  <lu-spin :loading="true" text="Fetching data" style="width: 100%">
    <lu-card style="min-height: 120px">Content waiting for data.</lu-card>
  </lu-spin>
  <template #source>

```vue
<lu-spin :loading="loading" text="Fetching data">
  <lu-card>Content waiting for data.</lu-card>
</lu-spin>
```

  </template>
</DemoBlock>

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `loading` | `boolean` | `true` | Show the loading state |
| `text` | `string` | — | Visible loading message and accessible name |
| `ariaLabel` | `string` | `Loading` | Accessible name when no text is set |
| `size` | `number` | `32` | Default spinner diameter in pixels |

## Slots

`default` contains the content to cover; `indicator` replaces the spinner. Set `text` or `ariaLabel` when using a custom indicator.
