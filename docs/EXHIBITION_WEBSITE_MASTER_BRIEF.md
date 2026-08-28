# MASTER BRIEF & TECHNICAL DOSSIER: THE RESILIENT DAVINCI RETROSPECTIVE & INTERACTIVE EXHIBITION

> **Target Audience**: AI Creative Technologists, Senior Full-Stack Engineers, and Interactive Experience Designers tasked with building the master exhibition website for the `resilient-davinci` workspace.
> **Repository Path**: `c:\Users\johno\Documents\antigravity\resilient-davinci`
> **Artifact Classification**: Complete, Unabridged Operational Brief & Context Package.

---

# TABLE OF CONTENTS
1. [Executive Vision & Purpose](#1-executive-vision--purpose)
2. [The Complete 5-Act Narrative Arc](#2-the-complete-5-act-narrative-arc)
   - [Act I: The Meta-Compiler & Expert System Crucible (MYCIN & CommonKADS)](#act-i-the-meta-compiler--expert-system-crucible-mycin--commonkads)
   - [Act II: The 44-Video Ingestion & The 5-Way Synthesis Tournament](#act-ii-the-44-video-ingestion--the-5-way-synthesis-tournament)
   - [Act III: The Forge of Five Worlds (The Interactive Sub-Websites)](#act-iii-the-forge-of-five-worlds-the-interactive-sub-websites)
   - [Act IV: The Battlefield Fixes & Engineering Invariants](#act-iv-the-battlefield-fixes--engineering-invariants)
   - [Act V: The Master Specification Elevation](#act-v-the-master-specification-elevation)
3. [Exhaustive Sub-Project Catalog & Deep Specs](#3-exhaustive-sub-project-catalog--deep-specs)
   - [1. gemini-hyperthought](#1-gemini-hyperthought)
   - [2. the-horologist (CHRONOS Cal.8800)](#2-the-horologist-chronos-cal8800)
   - [3. terra-archive](#3-terra-archive)
   - [4. void-form](#4-void-form)
   - [5. the-living-archive](#5-the-living-archive)
   - [6. source-to-skill & expert-system-engineer](#6-source-to-skill--expert-system-engineer)
4. [Verbatim Mathematical Formulas & Shader Algorithms](#4-verbatim-mathematical-formulas--shader-algorithms)
5. [Git Archaeology & Provenance Log](#5-git-archaeology--provenance-log)
6. [Website Specification & Exhibition Architecture](#6-website-specification--exhibition-architecture)
   - [Unified Single-Root Architecture](#unified-single-root-architecture)
   - [Full-Canvas Interactive Theater & Sandbox Engine](#full-canvas-interactive-theater--sandbox-engine)
   - [Editorial Storyline & Chapter Flow](#editorial-storyline--chapter-flow)
   - [Design Language & Aesthetic Tokens](#design-language--aesthetic-tokens)

---

# 1. EXECUTIVE VISION & PURPOSE

### The Objective
To create an award-winning, Awwwards/FWA-tier interactive retrospective website that chronicles the intense intellectual, architectural, and creative journey encapsulated in the `resilient-davinci` directory. 

This is not a generic portfolio website. It is an **interactive digital museum and engineering documentary** celebrating the triumph of autonomous knowledge engineering, mathematical motion design, and cutting-edge creative web development.

### Core Dual Function of the Exhibition Website:
1. **The Chronicle (The Story of Trials & Breakthroughs)**: A cinematic, chapter-based editorial experience detailing the evolution from raw 1984 expert system PDFs to autonomous AI skill synthesis and real-time GPU WebGL experiences.
2. **The Living Theater (Interactive Gallery & Canvas Sandbox)**: A unified portal where visitors can explore, inspect, and launch **5 full-scale, production-grade interactive sub-websites** directly inside an immersive full-screen canvas viewport with live telemetry HUDs, code inspectors, and "The Pain Behind This" technical breakdown drawers.

---

# 2. THE COMPLETE 5-ACT NARRATIVE ARC

```
                       [ RAW MULTIMODAL KNOWLEDGE ]
                (45 MYCIN PDFs + 44 Creative Web Dev Videos)
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   ACT I: THE META-COMPILER GENESIS  │
                  │   (CommonKADS P1-P6 & MYCIN Scrape) │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   ACT II: THE 5-WAY SYNTHESIS ARENA │
                  │   (Grafting Formulas, Killing Slop) │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   ACT III: THE FORGE OF FIVE WORLDS │
                  │   (Hyperthought, Horologist, Terra, │
                  │    Void-Form, The Living Archive)   │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   ACT IV: BATTLE SCARS & INVARIANTS │
                  │   (Defeating Lenis Scroll Lock,     │
                  │    Zero-Allocation RAF Loops)       │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   ACT V: THE MASTER SPEC ELEVATION  │
                  │   (Phase 0 Storyboard, Anti-Purple, │
                  │    Playwright Audit Harness)        │
                  └─────────────────────────────────────┘
```

---

## ACT I: THE META-COMPILER & EXPERT SYSTEM CRUCIBLE (MYCIN & CommonKADS)

The project did not start with frontend styling. It began with an ambitious meta-engineering question:
> *"Can we build an autonomous AI system that ingests raw, unstructured human knowledge sources (videos, books, papers, PDFs) and compiles them into a validated, executable AI skill?"*

### The First Test Domain: Classical Expert Systems
To benchmark this concept against the highest standard of procedural rigor, the domain of **Knowledge Engineering (CommonKADS and MYCIN)** was chosen.

#### The 45-PDF Acquisition & Lanczos Compression Gauntlet:
The seminal text *Rule-Based Expert Systems: The MYCIN Experiments of the Stanford Heuristic Programming Project* (Buchanan & Shortliffe, 1984; 752 pages) was fragmented across 45 separate PDF files on legacy Stanford web servers.

*Verbatim from `docs/spec/multi-part-pdf-pipeline.md`:*
```markdown
## Problem Statement
Users researching foundational computer science and artificial intelligence literature often encounter seminal texts distributed as fragmented, chapter-by-chapter PDF files across legacy web servers. In the case of Rule-Based Expert Systems: The MYCIN Experiments of the Stanford Heuristic Programming Project (Buchanan & Shortliffe, 1984), the book is split into 45 individual PDFs covering front matter, 36 chapters, epilog, appendix, references, and indices.

Manually locating, downloading, renaming, ordering, merging, and optimizing dozens of separate PDF files is tedious, error-prone, and often results in bloated, unindexed single files that are difficult to search, read, or distribute. Furthermore, legacy scanned volumes composed of 1-bit monochrome bitmaps require specialized compression strategies to prevent file-size explosion while maintaining text legibility.
```

An automated, idempotent 3-stage acquisition and optimization pipeline was built:
1. `download_mycin_pdfs.ps1`: Automated fetcher with URL-encoding resilience and network retries.
2. `merge_mycin_pdfs.py`: Strict sequential collation into a 752-page monolithic PDF.
3. `compress_mycin_pdf.py`: Dedicated 1-bit monochrome Lanczos downsampler deduplicating unreferenced streams, compressing 37 MB down to 21.8 MB (~29 KB per page) while keeping math and typography razor sharp.

#### The Source-to-Skill Compiler Formulation:
*Verbatim from `docs/spec/source-to-skill-compiler.md`:*
```markdown
## Solution
A formal Knowledge → Methodology → Skill Compiler (source-to-skill) grounded in classical Knowledge Engineering principles (CommonKADS and MYCIN). The system consumes raw multi-modal knowledge sources (video transcripts, technical PDFs, documentation, books), extracts structured knowledge units using formal elicitation probes (P1–P6) and completeness matrices, synthesizes an operational workflow (what a practitioner must do rather than what the text says), and compiles a modular, validated Agent Skill package adhering to progressive disclosure standards.
```

**The CommonKADS Elicitation Probes (P1–P6):**
- **P1 (Conditions)**: Under what exact environmental state or parameter thresholds does this action execute?
- **P2 (Prerequisites)**: What data schemas, libraries, or previous step outputs must exist prior to invocation?
- **P3 (Exceptions & Anti-Patterns)**: What failure modes occur, and what forbidden patterns must be avoided?
- **P4 (Alternatives & Trade-offs)**: What other design options exist, and why was this approach chosen over them?
- **P5 (Invariants)**: What system properties (frame rate budgets, DPR limits, memory bounds) must never be violated?
- **P6 (Checkable Verification)**: What deterministic, measurable assertion proves this step succeeded?

---

## ACT II: THE 44-VIDEO INGESTION & THE 5-WAY SYNTHESIS TOURNAMENT

With the compiler proven on expert systems, the ultimate stress test was initiated: **Creative Web Development (Awwwards / FWA / CSSDA tier)**.

### The Raw Corpus (44 Modular Skills):
A massive curriculum of 44 advanced lessons was ingested, extracted, and structured into modular skills in `Creative Web Dev/GSAP` and `Creative Web Dev/Javascript`:
- Apple 3D Landing Pages, MacBook Pro scroll animations, Sofi 3D Product Scroll.
- Barba.js multi-page cinematic shutter transitions and lifecycle management.
- Canvas 2D frame-by-frame video scrubbers with aspect-corrected math.
- GSAP ScrollTrigger + Lenis smooth scrolling, card stack drift, split-card flips, sticky capsules.
- Kinetic particle systems, vector flow fields, Hooke's Law spring physics, ITU-R BT.601 luminance.
- WebGL shaders: Simplex noise, Curl noise, 4-octave FBM, RGB chromatic aberration.

### The 5-Way Candidate Tournament:
5 competing packages (`candidate-1` through `candidate-5`) were generated and evaluated in a head-to-head tournament.

*Verbatim from `creative-web-development/synthesis-report.md`:*
```markdown
## The "Graft the Best, Discard the Redundant" Rule
- Candidate 1 (Flash): Provided deep mathematical equations (ITU-R BT.601 luminance, 1D-to-2D stride arithmetic, Hooke's Law spring damping, O(N^2/2) upper-triangular constellation optimization), GLSL noise kernels, and the 3D split-card expansion interaction.
- Candidate 2 (Flash): Contributed the canonical terminology dictionary structure with rigorous _Avoid_ anti-synonyms, signature interaction framing, and the 4-phase page transition lifecycle (Leave -> Fetch/Mount -> Enter -> Cleanup).
- Candidate 3 (Flash): Contributed 5 end-to-end production-grade recipes, camera FOV tangent formulas, Blender lightmap baking protocols, and aspect-corrected GLSL cover math.
- Candidate 4 (Pro): Contributed lean, high-level operational clarity, positive imperative steering, and the fast decision matrix router.
- Candidate 5 (Pro): Contributed strict system invariants, memory pre-allocation (zero-allocation render loops), DPR guardrails, and InstancedMesh draw call budgets.
```

**Key Conflict Resolutions in the Synthesis:**
1. **Frame Sequence Scrubbing vs. Native `<video>` Scrubbing**: Native `<video>.currentTime` scrubbing causes keyframe lag and dropped frames. Standardized on **Canvas 2D In-Memory WebP/JPEG Frame Sequence Buffering** for deterministic 60 FPS scrubbing.
2. **GSAP `lagSmoothing(0)`**: Disabled GSAP's default lag smoothing when bound to Lenis to eliminate rubber-banding and position snapping during scroll recovery.
3. **Hard DPR Clamping at 2.0**: Clamped `Math.min(window.devicePixelRatio, 2.0)` across Three.js and Canvas 2D to prevent $9\times\text{--}16\times$ GPU fill-rate explosions on 3x/4x mobile screens.
4. **Particle Physics vs. Static Tweens**: Standardized on **Immutable Anchor Memory `(baseX, baseY)` and Hooke's Law Elastic Damping**, allowing particle typography to repel dynamically and return with 100% legibility reconstruction.

---

## ACT III: THE FORGE OF FIVE WORLDS (THE INTERACTIVE SUB-WEBSITES)

Theory was immediately put into the furnace of real implementation. Five distinct, full-scale interactive web experiences were engineered to prove every facet of the skill.

| Project | Tech Stack | Core Thesis & Signature Mechanics |
|---|---|---|
| **`gemini-hyperthought`** | Vite, Three.js, GSAP, Lenis, Web Audio | **High-Reasoning Architecture**: 3D Silicon Monolith with exploded PBR layers, Tree-of-Thought DAG Thinking Bench with cubic Bezier pulses, Canvas 2D sand particle title decomposition, zero-asset binaural audio drone. |
| **`the-horologist`** | Vite, Three.js, GSAP, Lenis, Web Audio | **CHRONOS Cal.8800 Luxury Chronometer**: Continuous scrollytelling timeline, live mechanical escapement simulation, WebGL distortion canvas, procedural 4Hz acoustic tick synthesis, technical telemetry HUD. |
| **`terra-archive`** | Vite, Canvas 2D, GSAP, Lenis, Web Audio | **Subterranean LIDAR & Cartography**: 2D Simplex Perlin elevation contour engine with cursor ripples, 3D CSS stratigraphic strata split, pinned horizontal gallery with 2.4x chromatic optical loupes, Hooke's Law codex sand reconstruction. |
| **`void-form`** | Vite, React 19, Tailwind v4, Three.js, GSAP | **Brutalist Creative Tech Studio**: Zero-latency hardware pointer with inertial physics follower, The Void 3D Simplex noise manifold, fullscreen FBM fluid shader gallery, 4-axiom interactive manifesto, spatial project expansion modals. |
| **`the-living-archive`** | Next.js 16 (App Router), React 19, Three.js, GSAP, Lenis, Web Audio | **Spatial Digital Memory Museum**: Multi-room 3D memory cosmos, interactive particle system with scroll velocity coupling, memory ghost counter, modal artifact viewer, real-time audio synthesizer. |

---

## ACT IV: THE BATTLEFIELD FIXES & ENGINEERING INVARIANTS

Building these 5 applications revealed subtle, catastrophic browser engine traps that standard AI models consistently fail to recognize.

### The Legendary Scroll-Lock Container Trap (Commit `f986881`):
When combining smooth scroll libraries (Lenis) with nested React/Next.js containers and Tailwind, setting `height: 100%` or `overflow: hidden` on parent wrappers creates a silent scroll trap where `window.scrollY` remains locked at 0 while mouse wheels spin fruitlessly.

**The Invariant Fix Codified into the Skill:**
```css
/* Root CSS Safeguard - Injected into every project */
html {
  min-height: 100%;
}
body {
  min-height: 100vh;
  overflow-x: hidden;
}
html.lenis,
html.lenis body {
  height: auto;
}
```

### Zero-Allocation Render Loop Invariant:
Garbage collection pauses cause micro-stutters during high-speed scrolling.
*Rule*: Zero `new THREE.Vector3()`, `new THREE.Matrix4()`, or object literal instantiations inside `requestAnimationFrame`, `useFrame`, or GSAP ticker listeners. Pre-allocate scratch vectors at module initialization:
```typescript
// Pre-allocated scratch cache
const _v1 = new THREE.Vector3();
const _m1 = new THREE.Matrix4();

function renderLoop() {
  _v1.set(targetX, targetY, targetZ).applyMatrix4(_m1); // In-place mutation
  renderer.render(scene, camera);
}
```

---

## ACT V: THE MASTER SPECIFICATION ELEVATION

All hard-won lessons were crystallized into the master specification: `docs/creative-web-development-spec.md`.

*Verbatim from `docs/creative-web-development-spec.md`:*
```markdown
## Problem Statement
When AI coding models and frontend developers are tasked with creating award-winning, interactive digital experiences (Awwwards / FWA / CSSDA tier), they consistently fall into three failure modes:
1. Static SaaS Template Mentality: Experiences are structured as conventional rows of static cards, generic hero headers, and disconnected text blocks rather than dynamic, time-based visual narratives.
2. Generic AI Aesthetics & Tropes: Interfaces default to clichéd "AI purple/violet" neon glows, dark-mode obsidian glassmorphism, and uninspired gradient borders that lack authentic brand personality and material grounding.
3. Fragile Motion Engineering & Silent Failures: Motion systems suffer from scroll-locking container traps, conflicting render loops, uncalibrated high-DPI scaling, unbudgeted WebGL draw calls, and lack of automated headless testing to verify animation smoothness and shader validity.
```

### The 5 Foundational Pillars:
1. **Phase 0 Storyboarding**: Re-frames web development as a 4-track cinematic timeline ($t = 0.0s \to 10.0s+$: Camera, Subject, Typography, Interaction/Sound).
2. **Material-Grounded Aesthetics**: Strict prohibition of generic purple AI gradients (`#8A2BE2`, `#7928CA`); mandatory palettes derived from physical materials (Titanium Slate `#0F1113`, Chalk Bone `#EDE8DE`, Terracotta Ochre `#C86432`, Signal Vermillion `#FF3B00`, Matte Carbon `#0D0E10`).
3. **3-Tier 3D Strategy & Instant CDN Warehouse**: Zero-auth official glTF CDN models (Khronos & PMNDRS) paired with procedural GPU meshes.
4. **Procedural Web Audio Engine**: Zero-network-asset mechanical escapement ticks and harmonic sine chimes.
5. **Automated Playwright Verification Seam**: Injects `window.__CREATIVE_AUDIT__` exposing FPS, draw calls, and scroll state to headless tests for self-healing verification before user delivery.

---

# 3. EXHAUSTIVE SUB-PROJECT CATALOG & DEEP SPECS

## 1. `gemini-hyperthought`
- **Location**: [`gemini-hyperthought/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/gemini-hyperthought)
- **Tech Stack**: Vite, Vanilla TypeScript, Three.js, GSAP ScrollTrigger, Lenis, Lucide, Web Audio API
- **Key Visual & Interactive Elements**:
  - **The Silicon Monolith**: Beveled brushed titanium outer frame, smoked optical glass inner core, and orbital caliper rings with ACESFilmic tone mapping.
  - **Thinking Bench (Tree-of-Thought DAG)**: Real-time cubic Bezier curves connecting root premises, dynamic node expansion, pulse packets traversing converged proof paths, and node reasoning inspector modals.
  - **Sand/Dust Text Particle Decomposition**: High-DPI canvas rasterization of SF Pro typography into platinum dust particles elastically recovering via Hooke's Law ($k=0.08$).
  - **Reasoning Budget Telemetry HUD**: Segmented switches (`Standard`, `8X`, `64X Pro`, `512X Max`) altering monolith breathing scale and node graph complexity.
  - **Dual-Oscillator Binaural Audio**: Velvet lowpass ambient drone modulated by scroll depth and reasoning budget.

## 2. `the-horologist` (CHRONOS Cal.8800)
- **Location**: [`the-horologist/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/the-horologist)
- **Tech Stack**: Vite, TypeScript, Three.js, GSAP ScrollTrigger, Lenis, Web Audio API
- **Key Visual & Interactive Elements**:
  - **Cinematic Shutter Portal**: Dual-blade aperture opening with real-time timebase calibration indicator (`00:00:00:00`).
  - **Precision Horological Escapement**: Live mechanical gear train simulations with high-precision balance wheel oscillations and pallet fork locking.
  - **Background WebGL Distortion Canvas**: Dynamic fluid refractive shaders reflecting mouse velocity and scroll inertia.
  - **Persistent Telemetry HUD**: Live FPS counter, active escapement mode indicator, and acoustic tick toggle.
  - **Procedural Acoustic Tick Engine**: 4Hz alternating highpass triangle pulses (2,800Hz / 2,200Hz) simulating Swiss mechanical escapement acoustics.

## 3. `terra-archive`
- **Location**: [`terra-archive/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/terra-archive)
- **Tech Stack**: Vite, TypeScript, Canvas 2D, GSAP ScrollTrigger, Lenis, Web Audio API
- **Key Visual & Interactive Elements**:
  - **Topographic LIDAR Contour Engine**: 2D Simplex noise with fractional Brownian motion, marching squares isoline rendering across 18 elevation thresholds, and radial cursor ripples.
  - **3D Stratigraphic Strata Split**: `perspective: 1200px` 3D CSS container splitting terrain into 4 subterranean slices (Crust to Archaean Bedrock) along the Z-axis.
  - **Pinned Horizontal Specimen Gallery**: Pinned vertical-to-horizontal translation displaying 3 procedural relics (Antikythera Core, Proto-Elamite Cylinder, Cuneiform Monolith).
  - **2.4x Optical Loupe with Chromatic Aberration**: Interactive magnifier canvas featuring composite RGB channel separation and HUD crosshairs.
  - **Codex Sand Reconstruction**: Particles cascading downward in gravity before reconverging via Hooke's Law into *"WHAT LIES BENEATH SURVIVES ALL ERAS"*.
  - **Subterranean Audio Engine**: 52Hz sine oscillator through a 110Hz lowpass filter with brown-noise seismic rumble.

## 4. `void-form`
- **Location**: [`void-form/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/void-form)
- **Tech Stack**: Vite, React 19, Tailwind CSS v4, Three.js, GSAP ScrollTrigger, Lenis, Lucide
- **Key Visual & Interactive Elements**:
  - **Dual-Layer Hardware/Spring Cursor**: Instant 1:1 hardware dot paired with an inertial spring follower that elongates with velocity and morphs into contextual badges (`VIEW`, `EXPLORE`, `DRAG`, `ENTER`, `MUTATE`, `CLOSE`).
  - **The Void 3D Core**: Procedural non-Euclidean icosahedron deforming in real-time via 3D Simplex noise vertex shaders and cursor-tracking studio lights.
  - **Fluid FBM Distortion Gallery**: Custom GLSL fragment shader with 4-octave Fractional Brownian Motion, mouse velocity tracking, and RGB chromatic aberration.
  - **Spatial Project Expansion**: Seamlessly expands case studies (`AFTERIMAGE`, `SOFT MACHINE`, `ZERO GRAVITY`, `DIGITAL SKIN`, `UNFINISHED`) from click origin into full-screen views with neural volumetric simulations.
  - **4-Axiom Interactive Manifesto**: Distinct physical behaviors (`STRANGE` dissolves to dust, `USEFUL` stretches elastically, `MOVE` inverts color and glitches, `MATTER` shears with velocity).

## 5. `the-living-archive`
- **Location**: [`the-living-archive/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/the-living-archive)
- **Tech Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Three.js, GSAP ScrollTrigger, Lenis, Web Audio API
- **Key Visual & Interactive Elements**:
  - **Spatial Digital Museum Engine**: Multi-room architecture (`image`, `document`, `sound`, `code`) connecting historical memory nodes.
  - **Particle Velocity Engine**: Canvas 2D particle swarm dynamically reacting to scroll velocity and cursor force fields.
  - **Memory Ghosts & Counters**: Live telemetry tracking preserved artifacts, active room coordinates, and memory ghosts.
  - **Artifact Modal Inspector**: Full-fidelity artifact modal inspection with metadata, tags, and preservation status.
  - **Global Sound Architecture**: Modular audio engine providing environmental hums, UI clicks, and room transition reverberations.

## 6. `source-to-skill` & `expert-system-engineer`
- **Location**: [`source-to-skill/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/source-to-skill) & [`expert-system-engineer/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/expert-system-engineer)
- **Role in the Story**: The foundational AI engines that made the entire repository possible.
- **Key Mechanics**: CommonKADS 3-layer knowledge modeling, certainty factor calculus ($CF \in [-1.0, 1.0]$), backward-chaining goal stacks, static condition-action conflict verification, and progressive disclosure skill packaging.

---

# 4. VERBATIM MATHEMATICAL FORMULAS & SHADER ALGORITHMS

Downstream developers must utilize these exact mathematical formulations:

### 1. Photometric Luminance (ITU-R BT.601)
Used for extracting particle coordinates from rasterized canvas text:
$$\text{Luminance} = \frac{\sqrt{0.299 R^2 + 0.587 G^2 + 0.114 B^2}}{100}$$

### 2. 1D-to-2D Linear Byte Stride
Used for sampling raw pixel byte arrays from `ctx.getImageData()`:
$$\text{Index} = (y \times 4 \times \text{width}) + (x \times 4)$$
$$\text{Red} = \text{data}[\text{Index}], \quad \text{Green} = \text{data}[\text{Index}+1], \quad \text{Blue} = \text{data}[\text{Index}+2], \quad \text{Alpha} = \text{data}[\text{Index}+3]$$

### 3. Hooke's Law Elastic Return & Proximity Repulsion
Used for tactile particle typography:
$$F_{\text{spring}} = -k \cdot (p - p_{\text{base}}) - d \cdot v$$
$$F_{\text{repel}} = -\frac{\vec{\Delta}_{\text{mouse}}}{r} \cdot \left(1 - \frac{r}{R_{\text{max}}}\right) \cdot \text{ForceFactor} \quad (\text{for } r < R_{\text{max}})$$

### 4. Upper-Triangular Double-Loop Optimization
Used for particle constellations, halving distance checks from $O(N^2)$ to $O(N(N-1)/2)$:
```javascript
for (let i = 0; i < count; i++) {
  for (let j = i + 1; j < count; j++) {
    const dx = particles[i].x - particles[j].x;
    const dy = particles[i].y - particles[j].y;
    const distSq = dx * dx + dy * dy;
    if (distSq < maxDistSq) {
      // Draw connection line with alpha proportional to distance
    }
  }
}
```

### 5. Blender Sensor FOV to Three.js PerspectiveCamera FOV Matching
$$\text{FOV}_{\text{vertical}} = 2 \cdot \arctan\left(\frac{\text{SensorHeight}}{2 \cdot \text{FocalLength}}\right) \cdot \left(\frac{180}{\pi}\right)$$

### 6. Aspect-Corrected Cover UV Mapping (GLSL)
Used in WebGL image distortion fragment shaders to replicate CSS `object-fit: cover`:
```glsl
vec2 getCoverUv(vec2 uv, vec2 planeRes, vec2 mediaRes) {
  vec2 ratio = vec2(
    min((planeRes.x / planeRes.y) / (mediaRes.x / mediaRes.y), 1.0),
    min((planeRes.y / planeRes.x) / (mediaRes.y / mediaRes.x), 1.0)
  );
  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}
```

---

# 5. GIT ARCHAEOLOGY & PROVENANCE LOG

The exact chronological commit history defining the journey:

```
4829063  Initial commit
5541197  feat: add source-to-skill skill and project breakdown
385b912  chore: configure .gitignore to exclude large pdf binaries
88e5cf2  feat(expert-systems): add knowledge engineering scripts, first-pass extractions, and skill
de52a9f  feat(creative-dev): add learning specification and 44 modular javascript & gsap skills
599d5b9  feat(creative-dev): add 5 tournament candidate packages, dual syntheses, and evaluations
8ca981a  feat(creative-dev): deploy winning master creative web development skill
945e815  feat(app): add gemini-hyperthought interactive creative web application
e5bedd8  feat(app): update gemini-hyperthought audio, crucible, particles, and scroll orchestration
0c3f4d7  feat(app): add the-horologist luxury kinetic chronometer web experience
38f423d  feat(app): add terra-archive subterranean lidar and cartography web experience
f986881  fix(motion): resolve scroll lock by decoupling html/body height and injecting Lenis CSS rules
0b2b093  feat(skill): elevate creative-web-development with Phase 0 storyboarding, 3D CDN warehouse, Web Audio, and automated verification harness
8db2c92  feat(skill): clarify Phase 0 as an adaptable multi-shot template matrix
45ccf77  feat(app): add void-form creative technology studio web experience
501a16e  docs: add creative web development master specification and update project artifacts
```

---

# 6. WEBSITE SPECIFICATION & EXHIBITION ARCHITECTURE

## UNIFIED SINGLE-ROOT ARCHITECTURE

The master exhibition website should live at the root of the project and serve as the central portal.

```
                  ┌──────────────────────────────────────────────────────────┐
                  │                 ROOT STORY & GALLERY HUB                 │
                  │   - The Chronicle of Trials & Triumphs (Storyline)       │
                  │   - Interactive Timeline & Formula Sandbox               │
                  │   - Live Knowledge & Skill Inspector (CommonKADS)        │
                  └─────────────────────────────┬────────────────────────────┘
                                                │
                                                ▼
     ┌────────────────────────────────────────────────────────────────────────────────────┐
     │                      FULL-CANVAS THEATER / EMBEDDED SHOWCASE                       │
     │  (Seamless Fullscreen Modal / Canvas Viewport with Live Telemetry & Tech Inspector)│
     ├───────────────────┬──────────────────┬─────────────────┬────────────────┬──────────┤
     │   /the-horologist │ /hyperthought    │  /terra-archive │   /void-form   │ /living- │
     │                   │                  │                 │                │  archive │
     └───────────────────┴──────────────────┴─────────────────┴────────────────┴──────────┘
```

### Static Build Strategy:
- Sub-projects (`gemini-hyperthought`, `the-horologist`, `terra-archive`, `void-form`, `the-living-archive`) are built into static distribution sub-paths:
  - `/gallery/gemini-hyperthought/`
  - `/gallery/the-horologist/`
  - `/gallery/terra-archive/`
  - `/gallery/void-form/`
  - `/gallery/the-living-archive/`
- The master root website links or dynamically embeds these builds into the **Full-Canvas Theater**.

---

## FULL-CANVAS INTERACTIVE THEATER & SANDBOX ENGINE

When a visitor clicks on any of the 5 projects in the gallery:
1. **Zero Page Reload**: The experience expands into a full-screen canvas iframe / overlay container with smooth GSAP scaling.
2. **Persistent Ambient HUD**:
   - **Top Left**: Project Monogram, Classification, and Live State.
   - **Top Center**: Live FPS counter, Active Shader Pass, WebGL Draw Calls.
   - **Top Right**: Audio toggle, Source Code Inspector toggle, Close/Exit Theater button (`ESC`).
3. **"The Pain Behind This" Drawer**:
   - A slide-out panel detailing the exact technical hurdles, mathematical breakthroughs, and bug fixes that occurred during the building of that specific sub-app.
4. **Live Code / Spec Inspector**:
   - A high-contrast monospace viewer showing the exact `SPEC.md`, shaders, or particle physics loops powering the active experience.

---

## EDITORIAL STORYLINE & CHAPTER FLOW

The website narrative should unfold across 5 curated chapters:

1. **PROLOGUE: The Ambition**
   - The thesis: Moving beyond generic AI prompt wrappers to autonomous knowledge engineering and Awwwards-tier creative coding.
2. **CHAPTER I: The Ingestion of 1984 (MYCIN & CommonKADS)**
   - The 45-PDF extraction pipeline, Lanczos monochrome compression, and CommonKADS P1–P6 elicitation engine.
3. **CHAPTER II: The 44-Video Synthesis Arena**
   - The extraction of 44 advanced creative web development techniques, the 5-way candidate tournament, and the mathematical formula fusion.
4. **CHAPTER III: The Crucible of Five Worlds (The Interactive Gallery)**
   - The interactive gallery and full-canvas launchpad for `gemini-hyperthought`, `the-horologist`, `terra-archive`, `void-form`, and `the-living-archive`.
5. **CHAPTER IV: The Battle Scars (The Slain Bugs & Invariants)**
   - The deep dive into the Lenis scroll lock trap, zero-allocation RAF loops, and DPR clamping.
6. **EPILOGUE: The Master Specification**
   - The ultimate operational law: Phase 0 4-track storyboards, Anti-Purple material palettes, and Playwright verification harnesses.

---

## DESIGN LANGUAGE & AESTHETIC TOKENS

To reflect the philosophy codified in the repository, the website MUST adhere to the following design system:

### Material-Grounded Color Palette:
- **Pitch Slate / Deep Void**: `#060709` / `#0D0E10` (Primary Background)
- **Chalk Bone / Antique White**: `#EDE8DE` / `#F5F5F7` (Primary Typography & Accents)
- **Titanium Slate**: `#1B1E22` / `#2C3036` (Surfaces & Structural Borders)
- **Terracotta Ochre**: `#C86432` (Geological & Archaeological Highlights)
- **Signal Vermillion / Safety Orange**: `#FF3B00` / `#FF4800` (Telemetry Warnings & Active States)
- **Horological Gold / Brass**: `#D4AF37` (Precision Escapement Accents)
- **STRICT PROHIBITION**: Zero generic AI purple/violet gradients (`#8A2BE2`, `#7928CA`).

### Typography:
- **Editorial Headings**: `Cinzel`, `Playfair Display`, or high-contrast Italian modern serif.
- **Body & Structural Copy**: `SF Pro Display`, `Inter`, or `Space Grotesk` with tight optical tracking (`-0.03em`).
- **Telemetry & Code Readouts**: `JetBrains Mono` or `Space Mono`.

### Motion & Audio:
- **Smooth Inertial Scrolling**: Lenis smooth scroll coupled to `gsap.ticker` with `lagSmoothing(0)`.
- **Particle Dynamics**: Canvas 2D particle dust with Hooke's Law anchor restoration.
- **Procedural Sound**: Web Audio API ambient drones, mechanical escapement ticks, and transition chimes.

---

### End of Dossier
*This document is ready to be provided to any downstream agent to design and implement the master retrospective exhibition website.*
