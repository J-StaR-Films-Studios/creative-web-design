# Specification: Creative Web Development Operational Framework & Storyboarding Engine

## Problem Statement

When AI coding models and frontend developers are tasked with creating award-winning, interactive digital experiences (Awwwards / FWA / CSSDA tier), they consistently fall into three failure modes:
1. **Static SaaS Template Mentality**: Experiences are structured as conventional rows of static cards, generic hero headers, and disconnected text blocks rather than dynamic, time-based visual narratives.
2. **Generic AI Aesthetics & Tropes**: Interfaces default to clichéd "AI purple/violet" neon glows, dark-mode obsidian glassmorphism, and uninspired gradient borders that lack authentic brand personality and material grounding.
3. **Fragile Motion Engineering & Silent Failures**: Motion systems suffer from scroll-locking container traps (e.g. `height: 100%`), conflicting render loops, uncalibrated high-DPI scaling, unbudgeted WebGL draw calls, and lack of automated headless testing to verify animation smoothness and shader validity.

## Solution

A master operational framework, compiler skill, and automated verification harness that:
1. Re-frames website development as **Cinematic Video Storyboarding**, mapping normalized scroll progress ($0% \to 100%$) directly to a continuous virtual playhead ($t = 0.0s \to 10.0s+$) with 4 synchronized tracks (Camera, Subject Action, Typography, and Interactive Sound).
2. Mandates **Material-Grounded Aesthetics**, enforcing an explicit ban on generic AI purple gradients and requiring palettes derived from physical materials (Titanium, Carbon, Bone, Ochre, Platinum, Brass).
3. Provides a **3-Tier 3D Strategy** with an **Instant CDN 3D Asset Warehouse** (Khronos & PMNDRS zero-auth `.glb` models) paired with procedural mathematical GPU meshes and 3D CSS perspective transforms.
4. Integrates a lightweight **Procedural Web Audio Engine** providing tactile escapement clicks and harmonic chimes without loading external audio media.
5. Deploys an **Automated Creative Verification Layer** (`window.__CREATIVE_AUDIT__` + headless Playwright runner) giving agents deterministic machine-readable feedback on scroll fluidity, 60 FPS frame budgets, and WebGL errors.

---

## User Stories

1. As a creative technologist, I want the system to translate abstract design prompts into a bespoke 4-to-10+ shot cinematic storyboard, so that the resulting website flows like an advertisement video rather than a static template.
2. As a creative technologist, I want every shot in the storyboard to define 4 synchronized tracks (Camera, Subject, Typography, Interaction), so that all motion layers execute in perfect harmonic alignment.
3. As a developer, I want the system to enforce material-grounded color palettes, so that the generated UI avoids generic AI purple gradients and looks bespoke and premium.
4. As a developer, I want a direct CDN warehouse of production-ready 3D models (PBR helmets, cameras, watches, hardware), so that I can ingest 3D assets on impulse without authentication or paywalls.
5. As an engineer, I want procedural 3D mathematical mesh generators (refractive glass icosahedrons, Simplex-noise spheres), so that I have immediate 3D visual capabilities when network or asset access is unavailable.
6. As a frontend engineer, I want canonical Lenis smooth scrolling bound to GSAP ScrollTrigger under a unified ticker with `lagSmoothing(0)`, so that virtual scroll physics and WebGL render loops never stutter.
7. As a frontend engineer, I want root CSS safeguards that decouple `html` and `body` heights, so that mouse wheel scrolling is never accidentally locked by CSS container traps.
8. As a visual designer, I want offscreen Canvas 2D particle text decomposition with immutable anchor memory (`baseX`, `baseY`), so that typography can shatter into fine gold/titanium dust under mouse force fields and return elastically via Hooke's Law.
9. As a creative developer, I want custom GLSL shader kernels (2D Simplex Noise, 4-octave rotational FBM, Curl Noise, RGB chromatic aberration), so that background and surface visuals respond dynamically to cursor velocity.
10. As a performance engineer, I want universal device pixel ratio clamping (`Math.min(devicePixelRatio, 2.0)`), so that high-DPI Retina screens do not overload GPU fill rates.
11. As a performance engineer, I want strict WebGL draw call budgeting ($< 50$ mobile, $< 100$ desktop) via `THREE.InstancedMesh`, so that complex multi-object scenes maintain 60 FPS.
12. As a performance engineer, I want zero heap allocations inside active animation loops (`requestAnimationFrame`), so that garbage collection pauses do not cause visible micro-stutter.
13. As a creative developer, I want an in-memory Canvas 2D image sequence scrubber with aspect-ratio `object-fit: cover` math, so that I can deliver photorealistic offline-baked Blender Cycles cinematics on consumer mobile devices without WebGL crashes.
14. As an accessibility engineer, I want dual-DOM text splitting with intact `aria-label` or `<h1 class="sr-only">` elements, so that screen readers read complete sentences instead of isolated characters.
15. As a creative technologist, I want procedural Web Audio synthesis for mechanical escapement clicks and harmonic chimes, so that user interactions feel tactile and visceral without downloading external MP3 assets.
16. As an autonomous AI agent, I want a runtime telemetry collector (`window.__CREATIVE_AUDIT__`), so that my performance, draw calls, and scroll state are measurable programmatically.
17. As an autonomous AI agent, I want a headless Playwright verification test suite, so that I can automatically detect and self-heal scroll locks, frame drops, or shader syntax errors before user presentation.

---

## Implementation Decisions

### 1. Pre-Production Storyboarding Architecture (Phase 0)
- The experience flow is divided into $N$ sequential shots ($N \in [4, 10+]$) scaling with project scope:
  - **Micro/Teaser**: 4 shots ($25\%$ scroll per shot).
  - **Product Showcase**: 6–7 shots ($15\%$ scroll per shot).
  - **Editorial Scrollytelling**: 8–10+ shots ($10\%$ scroll per shot).
- Each shot explicitly specifies: (1) Camera Vector, (2) Subject Action, (3) Typography Track, and (4) Interactive/Sound Trigger.
- The storyboard table is an adaptable exemplar pattern; agents must author custom narratives specific to the user's domain.

### 2. Aesthetic & Color Guardrails
- Hardcoded prohibition of generic AI purple/neon gradients (`#8A2BE2`, `#7928CA`) and dark-mode obsidian clichés.
- Palette tokens must be derived from physical materials with 4–6 named hex values (e.g. Titanium Slate `#0F1113`, Chalk Bone `#EDE8DE`, Safety Orange `#FF4800`, Matte Carbon `#0D0E10`, Terracotta `#C86432`, Raw Platinum `#E5E9EC`).

### 3. Unified Ticker & Scroll Mechanics
- Lenis smooth scroll engine drives all scroll physics; GSAP ScrollTrigger evaluates timeline progress.
- Root CSS invariant: `html { min-height: 100%; }` and `body { min-height: 100vh; overflow-x: hidden; }` combined with `html.lenis, html.lenis body { height: auto; }` to permanently prevent mouse wheel scroll locks.
- `gsap.ticker.lagSmoothing(0)` enforces real-time synchronization between pointer/wheel inputs and visual output.
- `document.fonts.ready` gates all text splitting and `ScrollTrigger.refresh()` calculations.

### 4. 3-Tier 3D Strategy & Instant CDN Warehouse
- **Tier 1 (Direct CDN 3D Assets)**: Khronos Group official glTF CDN (`DamagedHelmet.glb`, `AntiqueCamera.glb`, `FlightHelmet.gltf`, `WaterBottle.glb`) and PMNDRS CDN (`watch-v1.glb`, `mac-draco.glb`).
- **Tier 2 (Procedural GPU Meshes)**: Pure mathematical Three.js geometries (`IcosahedronGeometry`, `TorusGeometry`) with custom transmission or wireframe shaders.
- **Tier 3 (Layered 3D DOM Perspective)**: `perspective: 1200px` with `transform-style: preserve-3d` for content cards and specs.

### 5. Procedural Web Audio Engine
- Built directly on the native Web Audio API (`AudioContext`).
- Generates 4Hz alternating highpass-filtered triangle waves (2,800Hz / 2,200Hz) for mechanical escapement ticking.
- Generates pure sine-wave exponential decay oscillations (520Hz – 660Hz) for harmonic state-transition chimes.

### 6. Automated Diagnostic Harness & Verification Seam
- Injects `window.__CREATIVE_AUDIT__` exposing: `isScrollUnlocked` (`maxScroll > 0`), `fpsAverage`, `frameDrops`, `webglDrawCalls`, and `shaderErrors`.
- Headless Playwright script (`scripts/verifyExperience.js`) executes synthetic scrolling sweeps, inspects the audit object, and exits with code 1 if scroll is trapped, draw calls exceed 100, or console errors occur.

---

## Testing Decisions

1. **High-Level Behavior Verification**: Tests simulate real user interaction sequences (scroll from $0\% \to 50\% \to 100\%$, pointer hover over particle canvases, and resize events) rather than testing internal private variables.
2. **The Verification Seam**:
   - **Primary Seam**: The global `window.__CREATIVE_AUDIT__` telemetry bridge evaluated by a headless browser runner.
   - **Performance Invariants**: Average FPS $\ge 55$, WebGL draw calls $< 50$ on mobile / $< 100$ on desktop, and `maxScroll > 0`.
   - **Error Trapping**: Trapping WebGL compile shader logs (`gl.getShaderInfoLog`) and browser console errors during synthetic animation execution.

---

## Out of Scope

- Backend database schemas, authentication systems, or server-side API endpoints (purely focused on client-side creative frontend engineering).
- Video editing software integrations (baking is performed offline in standard 3D suites like Blender and ingested as standard WebP/JPEG frame sequences or `.glb` files).
- Complex physics engine simulations (e.g. Havok/Cannon ragdolls); lightweight Hooke's Law spring physics and custom vector fields are used instead to preserve 60 FPS budgets.

---

## Further Notes

- The complete operational skill package is deployed at `creative-web-development/`.
- Working reference implementations include `the-horologist` (Horological kinetic chronometer), `gemini-hyperthought` (AI reasoning crucible), and `terra-archive` (Subterranean cartography & LIDAR).
