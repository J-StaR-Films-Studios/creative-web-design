# Transition Archetypes

## 1. Subtle Crossfade
- **Usage**: Editorial sites, commerce checkouts, dashboard sub-routes.
- **Mechanism**:
  - Outgoing: Opacity `1 -> 0` (200ms, `ease-out`)
  - Incoming: Opacity `0 -> 1` (300ms, `ease-in`) with slight translateY (`10px -> 0px`).
- **Advantage**: Clean, lightweight, low cognitive burden.

## 2. Side-by-Side Slide
- **Usage**: Multi-step funnels, adjacent case studies, tabbed full-page navigation.
- **Mechanism**:
  - Outgoing: Translates `0% -> -100%` along the X axis.
  - Incoming: Starts at `100%` and translates to `0%` in parallel.
- **Advantage**: Communicates clear spatial layout and ordering.

## 3. Column Wipe / Shutter
- **Usage**: Hero portfolio transitions, creative agency homepages.
- **Mechanism**:
  - Overlay grid/columns scale or translate across the screen to obscure the viewport.
  - New route mounts while viewport is concealed.
  - Columns peel away in staggered sequence to reveal the new page.
- **Advantage**: High visual impact while concealing asset loading.

## 4. Overlapping Parallax
- **Usage**: Image/case-study heavy portfolio links.
- **Mechanism**:
  - Incoming page slides over the outgoing page at a higher velocity (`translateY(100vh -> 0)`).
  - Outgoing page scales down slightly (`scale(1 -> 0.95)`) with a subtle darkening overlay.
- **Advantage**: Immersive depth and premium visual hierarchy.
