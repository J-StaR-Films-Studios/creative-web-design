# ToggleActions Reference

The `toggleActions` property accepts a single string containing **four space-separated keywords**:

```javascript
toggleActions: 'onEnter onLeave onEnterBack onLeaveBack';
```

## The Four Transition States

| Position | State Name | Trigger Event |
|---|---|---|
| **1st Token** | `onEnter` | User scrolls **DOWN**; top of element crosses `scroller-start` into view. |
| **2nd Token** | `onLeave` | User scrolls **DOWN**; bottom of element crosses `scroller-end` out of view. |
| **3rd Token** | `onEnterBack` | User scrolls **UP**; bottom of element crosses `scroller-end` back into view. |
| **4th Token** | `onLeaveBack` | User scrolls **UP**; top of element crosses `scroller-start` out of view. |

---

## Permitted Action Keywords

| Keyword | Playback Behavior |
|---|---|
| `play` | Plays the animation forward from its current position. |
| `pause` | Freezes the animation at its current frame. |
| `resume` | Unfreezes and continues playing forward. |
| `reverse` | Plays the animation backward toward the start. |
| `restart` | Resets playhead to 0 and plays forward from the beginning. |
| `reset` | Resets playhead to 0 and pauses. |
| `complete` | Jumps immediately to the end frame and finishes. |
| `none` | Does nothing at this transition boundary. |

---

## Common ToggleAction Recipes

- `'play none none none'` — Play once on entry; never replay or reverse (standard one-shot trigger).
- `'play pause reverse complete'` — Play on enter, pause if scrolled past, reverse when entering back, complete when leaving top.
- `'play reverse play reverse'` — Play forward whenever in viewport; reverse whenever exiting viewport in either direction.
- `'restart none none reverse'` — Restart from beginning each time user scrolls down into section; reverse when scrolling out the top.
