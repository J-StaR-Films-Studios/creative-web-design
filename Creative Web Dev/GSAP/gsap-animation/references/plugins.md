# GSAP Plugins Reference

## Plugin CDNs

```html
<!-- Draggable Plugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Draggable.min.js"></script>

<!-- TextPlugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/TextPlugin.min.js"></script>

<!-- ScrollTrigger Plugin -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
```

---

## Draggable Configuration

| Property | Type | Description |
|---|---|---|
| `type` | string | Movement axis: `"x"`, `"y"`, `"x,y"`, or `"rotation"`. |
| `bounds` | selector / element | Constrains draggable area to target container selector or viewport. |

---

## TextPlugin Configuration

| Property | Type | Description |
|---|---|---|
| `text` | string / object | Target string to type out or replace with typewriter animation. |
| `duration` | number | Duration in seconds for text generation. |

---

## ScrollTrigger Configuration

| Property | Type | Description |
|---|---|---|
| `trigger` | selector / element | Element that triggers animation when scrolled into viewport. |
| `start` | string | Trigger point: `"[trigger-edge] [scroller-edge]"` (e.g. `"top bottom"`, `"top 80%"`). |
| `end` | string | End point: `"[trigger-edge] [scroller-edge]"` (e.g. `"bottom top"`, `"bottom 20%"`). |
| `scrub` | boolean / number | `true` links progress to scrollbar; number (e.g. `2`, `3`) adds smooth catch-up delay. |
| `markers` | boolean | Set `true` to render visual trigger/start/end debug markers. |
