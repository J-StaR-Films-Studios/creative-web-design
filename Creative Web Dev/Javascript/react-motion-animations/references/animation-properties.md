# Animation Properties & Physics Reference

## Transition Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `duration` | `number` | `0.3` | Total animation time in seconds. |
| `ease` | `string \| array` | `"easeOut"` | Easing curve: `"linear"`, `"easeIn"`, `"easeOut"`, `"easeInOut"`, or cubic-bezier array. |
| `type` | `string` | `"tween"` | Transition calculation engine: `"tween"`, `"spring"`, `"inertia"`, `"keyframes"`. |
| `stiffness` | `number` | `100` | Spring tension. Higher = faster, snappier movement. |
| `damping` | `number` | `10` | Opposing friction force. Lower = more bounce; `0` = oscillates forever. |
| `mass` | `number` | `1` | Mass of the moving object. Higher = more inertia and slower acceleration. |
| `repeat` | `number` | `0` | Number of times to loop. Use `Infinity` for persistent loops. |
| `repeatType` | `string` | `"loop"` | Looping style: `"loop"` (start over), `"reverse"` (back and forth), `"mirror"` (alternates). |
| `repeatDelay` | `number` | `0` | Pause duration between loop repetitions in seconds. |
| `staggerChildren` | `number` | `0` | Delay between consecutive child animations in seconds. |
| `delayChildren` | `number` | `0` | Initial delay before starting the first child animation in seconds. |

---

## Recommended Presets for UI Elements

### 1. Interactive Button (Tap & Hover)
```javascript
{
  type: "spring",
  stiffness: 300,
  damping: 15
}
```

### 2. Standard Modal & Alert Entrance/Exit
```javascript
{
  duration: 0.25,
  ease: "easeOut"
}
```

### 3. Page Route Transition
```javascript
{
  duration: 0.35,
  ease: "easeOut"
}
```

### 4. Staggered Feature List
```javascript
// Parent transition configuration:
{
  staggerChildren: 0.12,
  delayChildren: 0.1
}
```

---

## AnimatePresence Modes

| Mode | Behavior | Best Used For |
|---|---|---|
| `sync` (default) | Exiting and entering elements animate simultaneously. | Overlapping toasts, simple list item additions/removals. |
| `wait` | Entering element waits until exiting element completes exit animation. | Page route transitions, multi-step wizards, accordion tabs. |
| `popLayout` | Exiting elements are popped out of flow (`position: absolute`) so siblings reflow immediately. | Grid rearranging, dynamic card sorting. |
