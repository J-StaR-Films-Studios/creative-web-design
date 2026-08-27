# Terminology & Constraints

**Aspect Ratio Canvas Slicing**:
The process of dividing a single master graphic into $N$ equal vertical raster slices whose combined widths match the master aspect ratio.
_Avoid_: CSS background position shifting, dynamic clip-path masks.

**State-Guarded Scrubbing**:
Combining continuous scroll position mapping with discrete threshold-triggered GSAP tweens protected by boolean flags.
_Avoid_: Triggering unconditional `gsap.to()` tweens inside an `onUpdate` tick.

**Preserve-3D Stacking**:
A CSS rendering configuration where children of an element exist in shared 3D space (`transform-style: preserve-3d`) enabling 180-degree backface concealment (`backface-visibility: hidden`).
_Avoid_: Opacity fading to emulate 3D flipping, flat 2D layer swaps.

**Lag Smoothing**:
A GSAP setting that prevents jumps when the CPU lags. Set to `0` when using Lenis so smooth-scroll ticker deltas remain strictly synchronized.
_Avoid_: Default lag smoothing with virtual scroll engines.
