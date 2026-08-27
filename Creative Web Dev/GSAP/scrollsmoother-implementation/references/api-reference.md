# ScrollSmoother API Reference

## Configuration Options (`ScrollSmoother.create({...})`)

| Option | Type | Default | Description |
|---|---|---|---|
| `wrapper` | `String \| Element` | `"#smooth-wrapper"` | Outer container selector or element. |
| `content` | `String \| Element` | `"#smooth-content"` | Inner content container selector or element. |
| `smooth` | `Number` | `0.8` | Seconds for content to catch up to native scroll position. |
| `smoothTouch` | `Number \| Boolean` | `0` | Smoothing duration on touch devices (0 = native 1:1 touch scroll). |
| `effects` | `Boolean \| String` | `false` | When `true`, parses `data-speed` and `data-lag` attributes on DOM elements. |
| `onUpdate` | `Function(self)` | `null` | Callback executed every time smooth scroll updates. `self` is the ScrollSmoother instance. |
| `onStop` | `Function(self)` | `null` | Callback executed when smooth scroll completes catch-up. |

---

## Instance Methods

### `smoother.scrollTo(target, smooth, position)`
- **`target`**: `String | Element | Number` — CSS selector, DOM element, or pixel number.
- **`smooth`**: `Boolean` — `true` for animated ease, `false` for instant jump.
- **`position`**: `String` (Optional) — Viewport/target alignment string (e.g., `"center center"`, `"top top"`, `"top 100px"`).

### `smoother.offset(target, position)`
- Returns the exact pixel scroll value where `target` meets `position` in the viewport.
- Useful for passing target scroll positions to `gsap.to(smoother, { scrollTop: ... })`.

### `smoother.paused(boolean)`
- Getter/Setter for scroll state.
- `smoother.paused(true)`: Halts scrolling and freezes screen.
- `smoother.paused(false)`: Unfreezes scrolling.

### `smoother.getVelocity()`
- Returns current scroll velocity in pixels per second (positive when scrolling down, negative when scrolling up).

### `smoother.effects(targets, config)`
- Programmatically assigns speed and lag without HTML data attributes.
- **`config` options**:
  - `speed`: `Number | "auto"`
  - `lag`: `Number | Function`
  - `refresh`: `Boolean`
