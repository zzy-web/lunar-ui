# Theming

Components share CSS custom properties, so colors and surfaces can be customized without changing component code. Existing `epx` variable names are retained for compatibility.

## Brand color

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

Set the primary color and its lighter variants together to keep hover, selected and plain states consistent. Load overrides after the library stylesheet.

## Dark mode

```html
<html class="dark">
```

Alternatively scope the dark palette to a container with `data-theme="dark"`. For teleported dialogs and tours, set the theme on `html` so overlays inherit it.

## Common variables

- `--epx-color-primary` / `success` / `warning` / `danger` / `info`：semantic colors.
- `--epx-text-color-primary` / `--epx-text-color-regular`：text colors.
- `--epx-bg-color` / `--epx-bg-color-overlay`：page and overlay surfaces.
- `--epx-border-color` / `--epx-border-color-light`：control and divider borders.
- `--epx-border-radius-base`：base corner radius.
- `--epx-transition-duration`：transition duration.
- `--epx-text-color-secondary` / `--epx-text-color-disabled`: secondary and disabled text colors, with light/dark values.
- `--epx-control-height`: Tree and default Checkbox row height, defaults to `32px`.
- `--epx-control-size`: Checkbox, Tree and Table checkbox size, defaults to `16px`.
