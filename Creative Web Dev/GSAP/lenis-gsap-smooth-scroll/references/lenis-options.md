# Lenis Configuration Settings Reference

Pass these properties to `new Lenis({ ... })` to customize scroll physics.

| Option | Type | Default | Description |
|---|---|---|---|
| `wrapper` | `HTMLElement` \| `window` | `window` | Container element used for listening and managing scroll viewport. |
| `content` | `HTMLElement` | `document.documentElement` | Scrollable container content holding all DOM elements. |
| `eventsTarget` | `HTMLElement` \| `window` | `wrapper` | Element that listens to touch and wheel events. |
| `smoothWheel` | `boolean` | `true` | Enables smooth easing on mouse wheel and touchpad actions. |
| `lerp` | `number` | `0.1` | Linear interpolation intensity between 0 and 1 (lower = smoother/slower). |
| `duration` | `number` | `1.2` | Duration of scroll animation in seconds (overridden if `lerp` is specified). |
| `easing` | `function` | `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` | Custom easing curve function. |
| `orientation` | `'vertical'` \| `'horizontal'` | `'vertical'` | Primary scroll trajectory axis. |
| `gestureOrientation` | `'vertical'` \| `'horizontal'` | `'vertical'` | Gesture detection axis for trackpads and touch devices. |
| `syncTouch` | `boolean` | `false` | Emulates inertial wheel scrolling physics on native touch drag. |
| `touchMultiplier` | `number` | `1` | Touch gesture scroll speed multiplier. |
| `wheelMultiplier` | `number` | `1` | Mouse wheel scroll speed multiplier. |
| `infinite` | `boolean` | `false` | Loops scrolling indefinitely between page top and bottom bounds. |
| `autoResize` | `boolean` | `true` | Automatically detects window size and DOM height mutations. |
