# Technical Specification: VOID/FORM — The Creative Developer Gauntlet

## Problem Statement

Conventional web interfaces often feel like static documents, generic SaaS templates, or cookie-cutter portfolio sites laden with repetitive visual tropes (purple AI gradients, generic glassmorphism cards, disconnected Three.js canvas demos, and floaty/laggy custom cursors). Users and award juries (e.g., Awwwards, FWA, CSSDA) seek an avant-garde, unified digital experience where every pixel embodies the core thesis: **“Everything is temporary.”**

To achieve award-level recognition, the digital experience must synthesize kinetic typography, high-DPI Canvas 2D particle physics, custom GLSL visual computation shaders, 3D non-Euclidean geometry, spatial case study transitions, and self-contained procedural audio design into a coherent, responsive, and accessible interactive artwork.

---

## Solution

Build an experimental, GPU-accelerated digital art installation for the creative-technology studio **VOID/FORM**.

The system is engineered as an **Input-to-Computation Engine** (`User Input → State/Physics → Visual & Audio Computation → Rendered DOM / Canvas / WebGL`):
1. **Genesis Opening:** An atmospheric loading sequence with independent letter orbits and telemetry progress ($00 \to 100$) before a cinematic dissolve into the main experience.
2. **Instant 1:1 Precision Cursor with Physical Follower:** A zero-latency hardware pointer dot paired with an inertial spring follower that stretches with velocity and morphs into contextual badges (`VIEW`, `EXPLORE`, `DRAG`, `ENTER`, `SEND`, `MUTATE`, `CLOSE`).
3. **Hero Kinetic & Particle Typography:** Large statement `WE BUILD THINGS THAT SHOULDN'T EXIST YET.` featuring granular character repulsion on hover, with seamless toggle to 2,000+ physics particles with Hooke's Law anchor memory.
4. **The Void 3D Core:** A procedural non-Euclidean manifold in Three.js displacing surface normals via 3D Simplex noise and reactive studio lighting tracking the cursor.
5. **Fluid Shader Distortion Gallery:** A fullscreen photographic sequence running custom GLSL fragment shaders with mouse-velocity tracking, 4-octave Fractional Brownian Motion (FBM), and RGB chromatic aberration splitting.
6. **Editorial Project Archive & Spatial Expansion:** Massive non-grid compositions (`AFTERIMAGE`, `SOFT MACHINE`, `ZERO GRAVITY`, `DIGITAL SKIN`, `UNFINISHED`) that expand smoothly from their clicked coordinates into full-color, scrollable spatial case studies with neural simulation toggles and collision-free navigation.
7. **Interactive 4-Axiom Manifesto:** Distinct physical behaviors across four statements (`MAKE IT STRANGE` dissolves into particle dust, `MAKE IT USEFUL` stretches with kinetic elastic tension, `MAKE IT MOVE` inverts contrast and glitches, `MAKE IT MATTER` triggers fluid velocity shear waves).
8. **Differential Word Parallax About:** Large statement `WE ARE INTERESTED IN THE SPACE BETWEEN DESIGN AND TECHNOLOGY.` with multi-speed differential word parallax along scroll.
9. **Quiet Resolution Contact:** `LET'S MAKE SOMETHING.` with letter separation physics and magnetic `SEND` email action.
10. **Procedural Web Audio Engine:** 100% client-synthesized audio design (sub-bass drone, acoustic mechanical clicks, harmonic velocity sweeps, and transition impacts) with minimal HUD toggle.

---

## User Stories

1. As a visitor, I want to experience an opening sequence with independent floating letters and live telemetry progress ($00 \to 100$), so that the website establishes a cinematic atmosphere before becoming interactive.
2. As a visitor, I want an instantaneous 1:1 hardware pointer dot that never lags, so that I maintain exact aiming precision at all times.
3. As a visitor, I want the custom cursor's follower ring to stretch along movement vectors and display contextual labels on interactive elements, so that the cursor feels like an object with physical mass.
4. As a visitor, I want hero typography characters to repel and tilt individually when I move my mouse near them, so that the typography behaves like an interactive material.
5. As a visitor, I want to toggle the hero statement into thousands of Canvas 2D sand particles, so that I can interact with the text as dynamic physics dust that springs back to its original positions.
6. As a visitor, I want smooth inertial scrolling synchronized with animations under a single master RAF ticker, so that the scrollytelling experience never stutters or drops frames.
7. As a visitor, I want to explore **The Void** section featuring a 3D procedural manifold whose surface normals displace under 3D Simplex noise, so that the geometric monolith reacts to my cursor and scroll.
8. As a visitor, I want studio lighting in The Void to dynamically track my cursor coordinates, so that the 3D scene feels alive rather than like a static preset.
9. As a visitor, I want to interact with a fullscreen image gallery where moving the mouse causes fluid UV wave displacement and RGB chromatic aberration, so that the images feel like liquid optical surfaces.
10. As a visitor, I want to explore an editorial archive of 5 massive project compositions rather than a conventional card grid, so that each project is presented as an artistic editorial statement.
11. As a visitor, I want project titles to stretch across the viewport and display preview transforms when hovered, so that project discovery feels kinetic and responsive.
12. As a visitor, I want clicking a project to expand the case study into a full-screen spatial view preserving continuity, so that I can inspect high-resolution color galleries, theoretical frameworks, compute metrics, and tech stacks.
13. As a visitor, I want to toggle an interactive neural volumetric simulation inside the project view, so that I can inspect real-time enhanced computational graphics.
14. As a visitor, I want the project modal header to remain distinct and unobstructed by the background HUD, with clear close mechanisms via a prominent button or ESC key.
15. As a visitor, I want each statement in the Interactive Manifesto to exhibit a unique physical reaction (`STRANGE` dissolves into dust, `USEFUL` stretches elastically, `MOVE` inverts color and glitches, `MATTER` shears with velocity), so that every interaction provides a distinct surprise.
16. As a visitor, I want the About section's words to drift and distort at differential scroll velocities, so that reading feels like an editorial poster coming alive in 3D space.
17. As a visitor, I want the final contact section to separate letters on hover and reveal `HELLO@VOIDFORM.STUDIO` with a `SEND` cursor state and copy feedback, so that reaching out is tactile and frictionless.
18. As a visitor, I want an optional procedural Web Audio experience (default OFF) that synthesizes ambient sub-drones, mechanical ticks, harmonic sweeps, and aperture impacts with zero network audio bandwidth.
19. As a mobile visitor, I want touch-safe drag physics, responsive font clamping, and mobile-optimized particle strides, so that the site performs at 60 FPS on touch devices without horizontal overflow.
20. As a screen-reader user, I want intact semantic headings and `aria-hidden` attributes on split visual spans, so that assistive devices read intact sentences rather than individual spelled-out letters.

---

## Implementation Decisions

### 1. Unified Master Ticker Architecture
- Binds **Lenis** smooth scrolling directly to **GSAP ScrollTrigger.update** and disables lag smoothing (`gsap.ticker.lagSmoothing(0)`).
- Drives all rendering subsystems (Three.js render loop, Canvas 2D physics, mouse velocity tracking) through a single centralized RAF clock to eliminate desynchronization and redundant loop allocations.

### 2. Dual-Layer Cursor Physics Engine
- **Instant Hardware Pointer:** Locked to `(targetX, targetY)` with zero interpolation delay and a high-contrast white dot that remains permanently visible.
- **Inertial Spring Follower:** Interpolates with `lerpFactor = 0.18`, velocity stretching `scaleX = 1 + speed * factor` and `scaleY = 1 / (1 + speed * factor)`, and dynamic contextual badge states (`VIEW`, `EXPLORE`, `DRAG`, `ENTER`, `SEND`, `MUTATE`, `CLOSE`).

### 3. Word-Preserving Kinetic & Particle Typography
- **Hero & Contact Structure:** Sentences are decomposed into arrays of words, where each word is wrapped in an intact `whitespace-nowrap inline-flex` container containing split character spans. This strictly prevents mid-word line-wrapping bugs while enabling granular individual character repulsion.
- **Canvas 2D Sand Particle Simulation:** Text is rasterized to an offscreen buffer at logical resolution scaled by DPR (clamped to $\le 2.0$), extracting active alpha pixels with an optimized stride (4px desktop, 7px mobile for 75% performance gain). Particles store immutable anchor memory `(baseX, baseY)` and restore via Hooke's Law spring damping.

### 4. WebGL & Custom GLSL Shaders
- **The Void Core:** Three.js scene utilizing an Icosahedron geometry deformed in real-time via a custom vertex shader executing 3D Simplex noise and mouse proximity falloff. Point light positions track cursor coordinates to produce dynamic specular sheens and Fresnel rim highlights.
- **Fluid Distortion Plane:** Fullscreen plane driven by a custom GLSL fragment shader utilizing 4-octave Fractional Brownian Motion (FBM), mouse velocity directional displacement, and differential spatial sampling across Red, Green, and Blue channels for chromatic aberration.

### 5. Color Management & Material Tokens
- Enforces physical, material-grounded tokens:
  - Pitch Slate: `#060709` / Deep Void `#0b0d12`
  - Bone Chalk: `#EDE8DE` / Ash Slate `#8E929A`
  - Signal Vermillion: `#FF3B00`
- Strictly eliminates generic purple AI gradients and glassmorphism cards in favor of contrast, whitespace, and sharp technical monospace readouts.

### 6. Procedural Web Audio API Synthesizer
- 100% self-contained audio synthesis using `AudioContext`, `OscillatorNode`, `BiquadFilterNode`, and `GainNode`.
- Features ambient sub-bass drone (43.65Hz / 65.41Hz lowpass filtered), acoustic mechanical ticks on character/button hover, harmonic sweeps modulated by mouse velocity, and sub-bass aperture impacts on transitions.

---

## Testing Decisions

### What Makes a Good Test
- Tests must verify external interactive behavior, shader stability, physics restitution, and DOM accessibility rather than internal implementation minutiae.
- Avoid mock assertions that duplicate TypeScript type checks.

### Verified Behaviors:
1. **Compilation & Type Safety:** `pnpm run build` executes with zero TypeScript errors under strict type-checking.
2. **Unified Ticker Performance:** Master ticker maintains steady 60+ FPS without garbage collection spikes or heap allocations inside RAF loops.
3. **Cursor Latency & Precision:** Zero-delay hardware dot provides immediate aiming feedback while follower smoothly lags and morphs.
4. **Typography Line Integrity:** Hero and Contact headings preserve word cohesion across all responsive viewport widths without mid-word breaks.
5. **Spatial Expansion Modal:** Opens smoothly with rich color galleries and neural simulation controls, with dedicated collision-free header controls and ESC key dismissal.
6. **Procedural Audio Synthesis:** Mute/unmute toggle correctly initializes and ramps audio gain with zero external network asset requests.
7. **Accessibility Standards:** Dual-DOM markup provides intact semantic headings for screen readers while visual split spans are tagged with `aria-hidden="true"`.

---

## Out of Scope

- Backend database integrations or user authentication systems (VOID/FORM is a standalone, client-side digital art experience).
- Server-side rendering (SSR) of WebGL canvas contexts (all WebGL and Canvas 2D routines initialize client-side in the browser).
- External uncompressed audio file streaming (procedural Web Audio API is used exclusively).

---

## Further Notes

- **Repository Location:** All source files, assets, components, and shaders reside in [`void-form/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/void-form).
- **Execution & Dev Server:** The project can be run locally via `pnpm dev` inside `void-form/` and previewed on localhost.
