# Timeline

Present events in reading order using native list semantics. Set `aria-label` to name the timeline.


## Basic usage

<DemoBlock direction="column">
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

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `timestamp` | `string` | `—` | Displayed time |
| `datetime` | `string` | `—` | Machine-readable date/time for the time element |
| `hideTimestamp` | `boolean` | `false` | Hide time and its slot |
| `placement` | `top / bottom` | `bottom` | Time position relative to content |
| `type` | `primary / success / warning / danger / info` | `primary` | Node type |
| `color` | `string` | `—` | Custom color; overrides type |
| `size` | `normal / large` | `normal` | Node size |
| `hollow` | `boolean` | `false` | Use a hollow node |



## Timeline Slots

| Slot | Parameters | Description |
| --- | --- | --- |
| `default` | `—` | Timeline items |



## TimelineItem Slots

| Slot | Parameters | Description |
| --- | --- | --- |
| `default` | `—` | Item content |
| `timestamp` | `—` | Custom time content |
| `dot` | `—` | Custom decorative node |



## Usage notes

Place LuTimelineItem children in reading order. Native list semantics support naming with aria-label. hideTimestamp also hides the timestamp slot. The dot slot is decorative and should not contain interactive controls. Describe status in text. These components emit no events.
