# Technical Specification: "TERRA ARCHIVE" — Subterranean LIDAR & Cartographic Journey

## Problem Statement

Users exploring digital cultural, archaeological, and scientific archives often encounter static, text-heavy catalog pages or disconnected image galleries that fail to convey the scale, geologic depth, and physical mystique of subterranean excavation. Standard web experiences lack cinematic pacing, physical tactile feedback, and unified visual computation that bridges historical artifacts with modern cartographic and LIDAR telemetry.

## Solution

Build an interactive subterranean cartography and archaeological discovery web experience styled like a documentary film opening. The experience translates vertical scrolling into a continuous descent from the Earth's topographic crust down to Archaean bedrock (-3,500m), orchestrating 4 distinct cinematic shots:
1. Generative 2D Perlin noise elevation contours with interactive cursor ripples.
2. Pinned 3D perspective stratigraphic breakdown with 4 separating subterranean strata slices and kinetic sand particle cascading.
3. Pinned horizontal artifact gallery with interactive optical loupes delivering 2.4x magnification and RGB chromatic aberration.
4. Codex thesis reconstruction where dispersed sand particles converge into typography with zero memory leaks and interactive cursor repulsion physics.

---

## User Stories

1. As an exploration enthusiast, I want to see generative real-time elevation contour lines on the landing surface, so that I immediately experience an authentic LIDAR topographical scanning environment.
2. As a visitor, I want moving my cursor over the topographic surface to generate elevation displacement ripples, so that I can feel real-time physical interaction with the terrain contours.
3. As a visitor, I want a persistent cartographic HUD with latitude, longitude, and depth gauges, so that I maintain spatial and documentary context throughout my descent.
4. As a visitor, I want smooth, momentum-driven scrolling that does not stutter or fight native trackpad gestures, so that the descent feels cinematic and fluid.
5. As a visitor, I want scrolling into Shot 2 to pin the viewport and split the terrain into 4 distinct subterranean strata slices along the 3D Z-axis, so that I can visually inspect the geological layering from Crust to Archaean Bedrock.
6. As a visitor, I want each geological strata layer to display its depth range, petrological classification, age epoch, and density, so that the experience provides authentic archaeological documentation.
7. As a visitor, I want the stratigraphic title typography to decompose into fine dust and sand particles that cascade downward under gravity when I scroll, so that the transition mirrors physical sediment collapse.
8. As a visitor, I want sand particles to drift and settle gracefully when scrolling pauses, so that the visual environment maintains atmospheric immersion without erratic flickering.
9. As a visitor, I want scrolling into Shot 3 to pin the viewport and translate my vertical scroll gestures into horizontal gallery progression, so that I can browse through archaeological specimens at constant velocity.
10. As a visitor, I want to inspect 3 distinct archaeological relics (Obsidian Antikythera Core, Proto-Elamite Basalt Cylinder, Cuneiform Geodetic Monolith), so that I can study their unique physical geometries, inscriptions, and discovery depths.
11. As a visitor, I want hovering over any artifact canvas to activate an interactive optical loupe that follows my cursor, so that I can magnify intricate details at 2.4x zoom.
12. As a visitor, I want the optical loupe to exhibit radial RGB chromatic aberration and scanline crosshairs, so that it mimics an authentic optical-mechanical archaeological lens.
13. As a visitor, I want scrolling into Shot 4 to reveal the codex reconstruction phase, where dispersed sand particles re-converge deterministically into the final thesis statement *"WHAT LIES BENEATH SURVIVES ALL ERAS"*, so that the narrative arc reaches a rewarding resolution.
14. As a visitor, I want to interact with the reconstructed codex text by hovering my cursor to repel particles like sand in a tomb, with Hooke's Law spring recovery returning them to their immutable anchors, so that the typography feels alive and tactile.
15. As a visitor, I want an optional ambient procedural audio toggle that generates subterranean sub-bass hums and sonar clicks without loading bulky external audio files, so that I can enhance my sensory immersion.
16. As a visitor, I want a "Re-initialize Expedition" button at the bottom that smoothly scrolls back to the top of the archive, so that I can easily experience the journey again.
17. As a mobile or tablet user, I want the 3D transforms, particle counts, and horizontal gallery to adapt responsively to my screen width and touch gestures, so that performance remains at 60 FPS without layout breakage.
18. As a user with screen readers, I want intact semantic headings and copy available in the accessibility tree, so that I can access all textual and historical content without hearing fragmented character spans.

---

## Implementation Decisions

### Visual Identity & Design System
- **Palette**: Strictly enforced raw subterranean tones: Raw Subterranean Umber (`#141312`), Chalk Bone (`#EDE8DE`), Terracotta Ochre (`#C86432`), and Subterranean Silt (`#8C8275`). Zero generic purple AI gradients or neon cyberpunk tropes.
- **Typography**: `Playfair Display` for high-contrast editorial titling, paired with `Space Grotesk` and `JetBrains Mono` for technical cartographic readouts.

### Unified Playhead & Scroll Architecture
- Synchronized smooth scrolling (Lenis) with GSAP ScrollTrigger timelines under the central `gsap.ticker`.
- Disabled lag smoothing (`gsap.ticker.lagSmoothing(0)`) to maintain real-time lockstep between scroll position and Canvas/3D DOM layers.

### Topographic Contour Engine (Shot 1)
- Built on Canvas 2D using 2D Simplex/Perlin noise field sampling with fractional Brownian motion (FBM).
- Marching squares isoline interpolation across 18 discrete elevation thresholds with ochre major contours and bone minor contours.
- Radial displacement wave simulation on cursor movement that adds dynamic height perturbation to nearby vertices.

### 3D Stratigraphic Layer Split (Shot 2)
- 3D CSS container utilizing `perspective: 1200px` and `transform-style: preserve-3d`.
- 4 layered SVG strata panels that translate along the Z-axis (`translateZ: -300px to +300px`), rotate on X-axis (`rotateX: 45deg`), and tilt on Z-axis (`rotateZ: -10deg`) driven by normalized scroll progress ($0.0 \to 1.0$).

### Offscreen Canvas Sampling & Sand Physics (Shots 2 & 4)
- Typographic glyphs are rendered to an offscreen `CanvasRenderingContext2D` buffer with `willReadFrequently: true`.
- Linear 1D-to-2D byte stride sampling with ITU-R BT.601 photometric luminance filtering extracts valid particle coordinates.
- Mobile-adaptive sampling stride (4px desktop / 6px mobile) to clamp particle count under performance budgets.
- Particles store dynamic simulation vectors $(x, y, v_x, v_y)$ and immutable anchor memories $(baseX, baseY)$.
- Physics engine supports 4 behavioral modes:
  - `TITLE`: Fixed rest state on Shot 2 title.
  - `CASCADE`: Downward gravitational acceleration ($+0.45\text{ px/frame}^2$) with Simplex noise turbulence.
  - `SUSPENDED`: Low-velocity atmospheric Brownian drift across the specimen hall.
  - `CODEX`: Hooke's Law spring restitution ($F_s = -k \cdot \Delta x$) converging onto the thesis statement anchors, paired with cursor repulsion ($F_r = -\frac{\vec{\Delta}}{d} \cdot \frac{R-d}{R} \cdot \text{density}$).

### Horizontal Artifact Gallery & Chromatic Loupe (Shot 3)
- Pinned horizontal track mapping vertical scroll distance to negative X translation (`x: -totalDistance`).
- 3 procedural high-DPI canvas specimen renderers producing intricate geometries (epicyclic gears, cuneiform cylinders, geodetic monoliths).
- High-performance optical loupe on Canvas 2D featuring $2.4\times$ zoom, composite RGB channel separation (offsetting Red and Cyan/Blue passes), circular aperture clipping, and HUD crosshairs.

### Subterranean Audio Engine
- Pure Web Audio API synthesis (zero network audio files): 52Hz sine oscillator through a 110Hz lowpass filter, combined with a brown-noise seismic generator through a bandpass filter.
- User-gesture compliant initialization and toggle with smooth gain ramps.

---

## Testing Decisions

### What Makes a Good Test
- Tests must verify external visual and interactive behavior (accurate DPR scaling, deterministic particle anchor restoration, ticker synchronization, responsive layout clamping) rather than private helper mechanics.

### Modules Tested & Verified
1. **High-DPI Canvas Backing Scale**: Verified DPR clamping $\le 2.0$ across standard and Retina displays.
2. **Noise & Elevation Sampling**: Verified continuity and bounding within $[-1.0, 1.0]$.
3. **Particle Anchor Convergence**: Verified that when in `CODEX` mode without mouse interference, particle coordinates converge within $\epsilon < 0.5\text{px}$ of immutable anchor memory.
4. **ScrollTrigger Pin Buffering & Unpinning**: Verified that all pinned sequences release smoothly without layout jumping.
5. **TypeScript & Bundling**: Verified complete clean build via `tsc && vite build` with zero compiler warnings or bundle errors.

---

## Out of Scope

- Multi-user collaboration or live multiplayer cursor synchronization.
- Heavy WebGL 3D asset downloads / external GLTF/DRACO model fetching (procedural Canvas 2D and SVG architecture preferred for instant loading and zero asset weight).
- External audio file streaming (procedural Web Audio API synthesizer used instead).
- Server-side database persistence (experience is client-side deterministic scrollytelling).

---

## Further Notes

- The project lives in `terra-archive/` and is completely self-contained.
- To run development server: `cd terra-archive && npm run dev`
- To produce production distribution: `cd terra-archive && npm run build`
