# Troubleshooting & Antipatterns

## Visual Jump / Stutter at Loop Reset

### Root Cause
Applying `gap` directly to `.carousel` or applying external `margin-right` to `.group`. The translation calculates `-100%` of `.group` width, ignoring parent gap.

```
INCORRECT:
.carousel {
  display: flex;
  gap: 1rem; /* ❌ Causes jump */
}

CORRECT:
.carousel {
  display: flex;
  gap: 0;
}
.group {
  gap: 1rem;
  padding-right: 1rem; /* ✅ Preserves 100% translation boundary */
}
```

---

## Cards Squeezing / Squishing on Small Screens

### Root Cause
Default flex behavior allows items to shrink (`flex-shrink: 1`).

```
INCORRECT:
.card {
  width: 200px; /* ❌ Flexbox will compress this */
}

CORRECT:
.card {
  flex: 0 0 200px; /* ✅ Disables flex-shrink */
}
```

---

## Pause on Hover (Extension)

To pause marquee motion during user interaction:

```css
.carousel:hover .group {
  animation-play-state: paused;
}
```
