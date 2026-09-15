# Timeline

Present events in reading order using native list semantics. Set `aria-label` to name the timeline.

## Basic usage

<DemoBlock>
<lu-timeline aria-label="Project history">
  <lu-timeline-item timestamp="2026-09-15" datetime="2026-09-15" type="success" placement="top"><lu-card>Project created</lu-card></lu-timeline-item>
  <lu-timeline-item timestamp="10:00" type="warning" size="large" hollow>Review in progress</lu-timeline-item>
  <lu-timeline-item timestamp="11:00" color="#8b5cf6">Ready to publish</lu-timeline-item>
</lu-timeline>
<template #source>

```vue
<template>
  <lu-timeline aria-label="Project history">
    <lu-timeline-item timestamp="2026-09-15" datetime="2026-09-15" type="success" placement="top"><lu-card>Project created</lu-card></lu-timeline-item>
    <lu-timeline-item timestamp="10:00" type="warning" size="large" hollow>Review in progress</lu-timeline-item>
    <lu-timeline-item timestamp="11:00" color="#8b5cf6">Ready to publish</lu-timeline-item>
  </lu-timeline>
</template>
```

</template>
</DemoBlock>

## TimelineItem Props

- `timestamp`: displayed time text.
- `datetime`: machine-readable date/time for the HTML `time` element.
- `hideTimestamp`: hide time and its slot, default `false`.
- `placement`: `top | bottom`, default `bottom`.
- `type`: `primary | success | warning | danger | info`, default `primary`.
- `color`: custom node color, overrides `type`.
- `size`: `normal | large`, default `normal`.
- `hollow`: hollow node, default `false`.

## Slots

Place `LuTimelineItem` children in the timeline's default slot. Items provide `default` (content), `timestamp` (time content) and `dot` (decorative node). Do not place interactive controls in custom nodes.

The components emit no events. Describe status in text as well as using node colors.
