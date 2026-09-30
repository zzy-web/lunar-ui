# Spin 加载中

用于异步操作的加载反馈，可独立显示，也可覆盖一块内容。

## 基础用法

<DemoBlock>
  <lu-spin text="加载中…" />
  <template #source>

```vue
<lu-spin text="加载中…" />
```

  </template>
</DemoBlock>

## 内容遮罩

`loading` 为 `false` 时，遮罩与状态提示都会移除。

<DemoBlock>
  <lu-spin :loading="true" text="正在获取数据" style="width: 100%">
    <lu-card style="min-height: 120px">这里是等待加载的内容。</lu-card>
  </lu-spin>
  <template #source>

```vue
<lu-spin :loading="loading" text="正在获取数据">
  <lu-card>这里是等待加载的内容。</lu-card>
</lu-spin>
```

  </template>
</DemoBlock>

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `loading` | `boolean` | `true` | 是否显示加载状态 |
| `text` | `string` | — | 可见的加载提示，同时用作无障碍名称 |
| `ariaLabel` | `string` | `Loading` | 未设置 `text` 时的无障碍名称 |
| `size` | `number` | `32` | 默认旋转图标的像素尺寸 |

## 插槽

`default` 为需要遮罩的内容；`indicator` 可替换旋转图标。自定义图标时仍应提供 `text` 或 `ariaLabel`。
