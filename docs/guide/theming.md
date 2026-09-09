# 主题定制

组件共享 CSS 变量，可统一调整颜色、表面和圆角，无需修改组件源码。现有 `epx` 变量前缀保留以兼容已有主题。

## 品牌色

```css
:root {
  --epx-color-primary: #635bff;
  --epx-color-primary-light-3: #817aff;
  --epx-color-primary-light-5: #a19cff;
  --epx-color-primary-light-7: #c4c1ff;
  --epx-color-primary-light-9: #f0efff;
  --epx-border-radius-base: 6px;
}
```

主色与浅色阶应同步设置，以保持悬停、选中和朴素状态一致。覆盖样式需在组件库样式之后加载。

## 暗色模式

```html
<html class="dark">
```

也可以通过容器上的 `data-theme="dark"` 局部启用暗色主题。Dialog 和 Tour 包含传送至页面外层的内容，建议在 `html` 上设置主题以覆盖弹层。

## 常用变量

- `--epx-color-primary` / `success` / `warning` / `danger` / `info`：语义颜色。
- `--epx-text-color-primary` / `--epx-text-color-regular`：正文与次级文本。
- `--epx-bg-color` / `--epx-bg-color-overlay`：组件背景与浮层背景。
- `--epx-border-color` / `--epx-border-color-light`：控件边框与分隔线。
- `--epx-border-radius-base`：基础圆角。
- `--epx-transition-duration`：过渡时长。
