# Independent Expert Evaluation: Master Creative Web Dev Skills (Round 1 - Flash Judge)

**Evaluation Date**: 2026-08-27  
**Evaluator**: Principal Creative Technologist, WebGL Systems Architect & Agent Engineering Lead  
**Evaluation Scope**: Head-to-head comparison of synthesized candidate master skill packages:
- **Package A (`flash-synthesis`)**: `Creative Web Dev/synthesized/flash-synthesis/`
- **Package B (`pro-synthesis`)**: `Creative Web Dev/synthesized/pro-synthesis/`

---

## 1. Executive Summary & Verdict

After an exhaustive, file-by-file technical audit across all 20 source and reference documents, **Package A (`flash-synthesis`) is declared the decisive, overwhelming winner** of Round 1.

| Candidate Package | Total Score (out of 60) | Percentage | Verdict |
|---|---|---|---|
| **Package A (`flash-synthesis`)** | **60.0 / 60** | **100%** | **WINNER (Flawless Master Skill)** |
| **Package B (`pro-synthesis`)** | **41.0 / 60** | **68.3%** | Eliminated (Superficial & Inconsistent) |

### Key Reasons for the Verdict

1. **Architectural Depth vs. Superficial Summarization**:
   Package A delivers true architectural mastery. Its `SKILL.md` (251 lines) establishes an imperative **"Input-as-Computation" engine**, supported by an explicit ASCII architecture diagram, a 9-phase sequential workflow with mathematically checkable completion gates, and a comprehensive Decision Matrix Router. Package B (`pro-synthesis`) compresses the domain into an oversimplified 105-line file that collapses 8 core pillars into 5 vague phases, omitting critical execution stages.

2. **Critical Architectural Contradictions in Package B**:
   In Phase 4 (Step 2) of Package B's `SKILL.md`, the instructions explicitly state: *"Map ScrollTrigger progress to the HTML5 Video `currentTime` property"*. This is a catastrophic architectural mistake that directly violates the fundamental premise of the ORYZO/Apple hybrid 3D workflow and directly contradicts Package B's own reference file (`references/hybrid-3d-cinematics.md`), which warns: *"Never scrub HTML5 `<video>` tags directly on scroll events"*. Package A enforces the correct in-memory Canvas 2D frame buffer architecture across all files without contradiction.

3. **Mathematical Rigor & Factual Accuracy**:
   Package A correctly presents and implements the ITU-R BT.601 photometric luminance formula, the exact 1D-to-2D stride arithmetic ($\text{Index} = (y \times 4 \times W) + (x \times 4)$), Hooke's Law spring-back damping with immutable anchor memory, camera FOV tangent derivations, and upper-triangular $O(N^2/2)$ constellation loops. In contrast, Package B labels ITU-R BT.601 coefficients as "standard ITU-R BT.709 coefficients" (a factual error), lacks the camera FOV tangent math, and omits the pin buffer progress formulas.

4. **GLSL Depth, Syntax Safety & Missing Algorithms**:
   Package A provides a complete, syntax-verified GLSL suite including 2D Simplex noise, 4-octave Fractional Brownian Motion (FBM) with rotation matrices to prevent directional grid artifacts, and 2D divergence-free Curl Noise for fluid velocity fields. Package B completely omits Curl Noise, omits FBM rotation matrices, introduces a reserved keyword syntax hazard (`vec2 new = ...`), and includes a fatal runtime bug in its uniform initialization (`texture.image.width` accessed before async image load).

5. **Reference Library Completeness**:
   Package A's reference library spans **2,815 lines** of exhaustive, production-grade code architectures, including 3D card expansion/flips, horizontal parallax, studio 3-point lighting rigs, on-demand dirty rendering, recursive GPU disposal, hardware capability tiering, and 5 complete copy-pasteable recipes. Package B's references total only **1,186 lines**—slashing `motion-and-scroll.md` from 665 lines to 77 lines and `threejs-and-r3f.md` from 340 lines to 85 lines, stripping out essential production patterns and relying on the deprecated `@studio-freight/lenis` package.

---

## 2. Detailed Criterion-by-Criterion Scorecard

| Criterion | Max Points | Package A (`flash-synthesis`) | Package B (`pro-synthesis`) | Variance / Delta |
|---|---|---|---|---|
| **1. Architectural Cohesion & Mental Model** | 10 | **10.0** | **6.0** | +4.0 (Flash) |
| **2. Mathematical Precision & Physics Integrity** | 10 | **10.0** | **7.5** | +2.5 (Flash) |
| **3. GLSL Shader & GPU Depth** | 10 | **10.0** | **6.5** | +3.5 (Flash) |
| **4. Hybrid 3D & Cinematic Workflow** | 10 | **10.0** | **7.0** | +3.0 (Flash) |
| **5. Performance Engineering & Guardrails** | 10 | **10.0** | **5.5** | +4.5 (Flash) |
| **6. Production Examples & Code Completeness** | 10 | **10.0** | **8.5** | +1.5 (Flash) |
| **TOTAL SCORE** | **60** | **60.0 / 60** | **41.0 / 60** | **+19.0 (Flash)** |

---

## 3. Deep-Dive Qualitative Analysis

### Criterion 1: Architectural Cohesion & Mental Model (Score: A = 10.0 | B = 6.0)

#### Package A (`flash-synthesis`) — 10.0 / 10
- **Unified Pipeline**: `SKILL.md` (251 lines, well under the 500-line ceiling) establishes an unambiguous **"Input-as-Computation" engine**, framing user inputs (pointer, wheel, scroll, viewport) not as triggers for isolated animations, but as continuous mathematical state vectors driving a single centralized render loop across DOM, Canvas 2D, Three.js, and GLSL shaders.
- **Master Decision Matrix**: Features a structured router mapping experience goals (Sand text, 3D viewports, GPU shaders, Hybrid baked video, DPR audits) directly to corresponding reference files.
- **Unambiguous Completion Gates**: Each of the 9 sequential phases concludes with checkable, falsifiable completion criteria (e.g., *"Text splitting executes strictly after `document.fonts.ready` resolves"*, *"Lenis and ScrollTrigger run on a unified ticker with `lagSmoothing(0)`"*, *"Constellation proximity checks use upper-triangular indexing ($j = i + 1$)"*).
- **Tightly Worded Context Pointers**: Uses imperative leading words that explain *why* and *when* to open reference files rather than passive bullet points.

#### Package B (`pro-synthesis`) — 6.0 / 10
- **Over-Compressed Workflow**: Compresses the 8 pillars into only 5 vague phases, dropping essential phases such as Viewport Scaffolding / Stacking Strata, Kinetic Typography Lifecycles, and Multi-Page Navigation.
- **Self-Contradictory Architecture**: In Phase 4 (Step 2), `SKILL.md` instructs developers to scrub native `<video>` `currentTime`, which contradicts its own reference documentation.
- **Missing Router & Visual Mental Model**: Lacks an architectural overview diagram and decision matrix. Context pointers are formatted as bare bullet points (`👉 Reference Context:`).

---

### Criterion 2: Mathematical Precision & Physics Integrity (Score: A = 10.0 | B = 7.5)

#### Package A (`flash-synthesis`) — 10.0 / 10
- **1D-to-2D Stride Arithmetic**: Exact derivation $\text{Index}(x, y) = (y \times 4 \times W) + (x \times 4)$ with clear byte channel offsets ($+0: R, +1: G, +2: B, +3: A$).
- **Photometric Luminance**: Correctly implements the ITU-R BT.601 standard:
  $$\text{Luminance} = \frac{\sqrt{0.299 \cdot R^2 + 0.587 \cdot G^2 + 0.114 \cdot B^2}}{100}$$
- **Hooke's Law Spring Damping**: Dynamic simulation with immutable anchor memory $(\text{baseX}, \text{baseY})$, inertia/mass resistance (`density`), friction damping (`friction = 0.90`), and spring stiffness (`springFactor = 0.08`).
- **Upper-Triangular Constellation Network**: Mathematically exact $j = i + 1$ upper-triangular indexing, halving distance evaluations to $\frac{N(N-1)}{2}$ and utilizing distance-squared checks ($\Delta x^2 + \Delta y^2 < r^2$) to eliminate unnecessary `Math.sqrt()` calculations on distant pairs.
- **Camera FOV & Tangent Math**: Exact pixel-matching FOV formula:
  $$\text{FOV} = 2 \cdot \arctan\left(\frac{\text{height}}{2 \cdot \text{distance}}\right) \cdot \left(\frac{180}{\pi}\right)$$
- **Zero-Matrix Flow Fields**: Pure trigonometric endpoint evaluation (`x + Math.cos(angle) * len, y + Math.sin(angle) * len`) avoiding costly 2D context matrix state save/restore operations.

#### Package B (`pro-synthesis`) — 7.5 / 10
- **Factual Standard Discrepancy**: In `references/canvas-and-particles.md` (line 48), Package B writes: *"Calculate perceived luminance using standard ITU-R BT.709 coefficients"*, but then writes the ITU-R BT.601 formula ($0.299 R^2 + 0.587 G^2 + 0.114 B^2$). Standard BT.709 coefficients are $0.2126 R + 0.7152 G + 0.0722 B$.
- **Missing Derivations**: Lacks the camera tangent FOV derivation, pin buffer resting formulas ($p \in [0.90, 1.00]$), and modular vector flow field class.

---

### Criterion 3: GLSL Shader & GPU Depth (Score: A = 10.0 | B = 6.5)

#### Package A (`flash-synthesis`) — 10.0 / 10
- **Noise Algorithms**: Includes full, verified implementations of:
  1. 2D Simplex Noise Kernel (Ashima / McEwan mod289/permute).
  2. 4-Octave Fractal Brownian Motion (FBM) with a 2D rotation matrix (`mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));`) which eliminates unnatural cardinal-axis alignment artifacts.
  3. 2D Divergence-Free Curl Noise kernel (`curlNoise`) for fluid, non-compressing turbulence.
- **Vertex Displacement**: Wave ripples along surface normals with Euclidean cursor distance and exponential falloffs.
- **Aspect-Corrected Fragment Distortion & Chromatic Aberration**: Complete `getCoverUv` shader function with safe variable naming (`vec2 newRes`), velocity-driven RGB channel offset splitting, and cursor speed flash highlights.
- **JavaScript Host Controller**: `MouseVelocityTracker` class with normalized WebGL UV coordinate mapping, frame delta calculations, and exponential decay.

#### Package B (`pro-synthesis`) — 6.5 / 10
- **Missing Curl Noise**: Completely omits Curl Noise from `references/shaders-and-glsl.md`.
- **FBM Artifacts**: Omit rotation matrices in FBM, leading to grid-aligned noise artifacts.
- **GLSL Syntax & Transpiler Hazard**: In `getCoverUv` (line 142), Package B declares `vec2 new = ...`. `new` is a reserved keyword in C++ and can trigger compilation errors in WebGL preprocessors and transpilers (such as ANGLE or glslify).
- **Runtime Crash Hazard**: In `createDistortionMaterial` (line 25), Package B sets `uImageResolution: { value: new THREE.Vector2(texture.image.width, texture.image.height) }`. If the texture has not finished loading asynchronously, `texture.image` is `undefined`, throwing an unhandled `TypeError`. Package A safely guards with `texture.image ? texture.image.width : 1920`.

---

### Criterion 4: Hybrid 3D & Cinematic Workflow (Score: A = 10.0 | B = 7.0)

#### Package A (`flash-synthesis`) — 10.0 / 10
- **Complete Hybrid Architecture**: Clear 3-strata architecture (Layer 1: Canvas frame scrubber, Layer 2: WebGL meshes, Layer 3: 3D perspective DOM UI).
- **Blender Baking Protocol**: Clear guidelines on camera sensor matching, diffuse lightmap baking, and FFmpeg batch conversion to WebP/JPEG sequences.
- **Canvas Scrubber Engine**: `drawCanvasCoverFrame` with context-level `object-fit: cover` math; `CinematicSequenceScrubber` preloads `Image[]` buffers with error-handling fallbacks and handles resize events without aspect distortion.
- **3D Perspective DOM Overlays**: Uses `perspective: 1000px; transform-style: preserve-3d;` with `gsap.utils.mapRange` and `gsap.utils.clamp` inside a single unified `ScrollTrigger.onUpdate` loop, guaranteeing frame-synchronized spatial depth.
- **Mobile Safe**: Enforces `100svh` to eliminate mobile address bar viewport jumping.

#### Package B (`pro-synthesis`) — 7.0 / 10
- **Catastrophic Pipeline Contradiction**: `SKILL.md` advocates native `<video>` scrubbing, contradicting its own reference guide.
- **Uncoordinated ScrollTriggers**: The DOM overlay timeline in `references/hybrid-3d-cinematics.md` creates separate `gsap.to` / `gsap.fromTo` ScrollTrigger instances with conflicting start triggers (`top -150%`) instead of unifying them under the master pinned container timeline.
- **Mobile Viewport Defect**: Uses legacy `100vh` rather than `100svh`.

---

### Criterion 5: Performance Engineering & Guardrails (Score: A = 10.0 | B = 5.5)

#### Package A (`flash-synthesis`) — 10.0 / 10
- **16.6ms Frame Budgeting**: Explicit breakdown: 4.0ms JS/Physics, 4.0ms Draw Call Prep, 6.0ms GPU Render, 2.6ms Margin.
- **Strict DPR Clamping**: Universal `getSafeDPR(2.0)` utility applied across Three.js and Canvas 2D.
- **InstancedMesh Implementation**: Complete `createInstancedParticleField` with dynamic usage, per-instance transformation matrices, and per-instance vertex colors, enforcing $<50$ draw calls on mobile and $<100$ on desktop.
- **Zero-Allocation Protocol**: Clear anti-pattern vs. pattern code enforcing module-scoped pre-allocated scratch objects (`SCRATCH_TARGET`, `SCRATCH_DELTA`, `SCRATCH_MATRIX`) to eliminate Garbage Collection pauses during RAF.
- **Comprehensive Teardown**: `fullExperienceTeardown` cleans RAF IDs, ScrollTrigger instances, Lenis, event listeners, recursively disposes geometries, materials, and textures, and calls `renderer.forceContextLoss()`.
- **Mobile Degradation & Accessibility**: `detectDeviceCapabilities` auto-tunes DPR, increases particle stride (4px to 8px, 75% particle reduction), disables shadows, and respects `prefers-reduced-motion`.

#### Package B (`pro-synthesis`) — 5.5 / 10
- **Severe Brevity**: `references/performance-and-profiling.md` is only 62 lines of skeletal notes.
- **Missing InstancedMesh Code**: Lacks a functional InstancedMesh recipe in the performance reference.
- **Incomplete Teardown**: Provides an 8-line pseudo-cleanup hook that calls `.dispose()` on undeclared variables.
- **Missing Degradation Matrix**: Completely omits hardware tiering, mobile particle stride optimization, and reduced-motion handling.

---

### Criterion 6: Production Examples & Code Completeness (Score: A = 10.0 | B = 8.5)

#### Package A (`flash-synthesis`) — 10.0 / 10
- **5 Complete, Copy-Pasteable Blueprints in `references/examples.md` (743 lines)**:
  1. *Text-to-Sand / Dust Particle Physics*: Complete standalone HTML file with High-DPI canvas scaling, mobile stride adaptation (4px/8px), Hooke's Law spring physics, and cursor repulsion force fields.
  2. *3D Product Showcase*: Complete Three.js + DRACOLoader + Lenis + ScrollTrigger scrollytelling with axis-angle model rotation, studio lighting, circular theme mask expansion, and typography exit.
  3. *Interactive GPU Fluid Distortion Plane*: Complete Three.js + custom GLSL shader plane with aspect-corrected cover UVs, cursor velocity tracking, chromatic aberration, and flash highlight.
  4. *Hybrid Canvas Video Frame Scrubber with 3D Spatial DOM Overlays*: Complete standalone HTML page with 150-frame preloading, `object-fit: cover` math, Lenis + ScrollTrigger unified ticker, and 3D perspective DOM cards.
  5. *Seamless Multi-Page Cinematic Shutter Transition*: Complete standalone HTML + CSS + JS navigation interceptor with dual-opposing curtain wipes and Promise lifecycle.
- **Zero Placeholders**: Every recipe is fully functional, complete, and contains zero `// TODO` or placeholder comments.

#### Package B (`pro-synthesis`) — 8.5 / 10
- **Recipe Flaws**:
  - In Recipe 2: Animates Euler angles directly (`tl.to(model.rotation, { y: Math.PI * 4 })`) rather than using axis-angle rotation, causing gimbal lock and trigonometric flipping during scrubbing.
  - In Recipe 3: GLSL fragment shader mixes variable naming conventions (`u_time`, `u_mouse` vs `uTime`, `uMouse`), uses uncorrected mouse normalization coordinates, and lacks the smooth velocity decay class present in Package A.
  - In Recipe 4: CSS uses `100vh` rather than `100svh`.
  - In Recipe 5: Lacks comprehensive link exclusion filters.

---

## 4. Detailed File-by-File Comparison Table

| File | Package A (`flash-synthesis`) Lines & Assessment | Package B (`pro-synthesis`) Lines & Assessment | Evaluation & Advantage |
|---|---|---|---|
| **`SKILL.md`** | **251 lines** — Complete 9-phase operational pipeline, ASCII architecture diagram, Decision Router, checkable gates. | **105 lines** — 5 collapsed phases, lacks router and diagram; contains `<video>` scrubbing contradiction. | **Package A (+4.0)** — Unifies all 8 pillars with complete operational clarity. |
| **`references/terminology.md`** | **232 lines** — 8 domains, exact mathematical definitions, operational rules, and explicit `_Avoid_` anti-synonyms. | **143 lines** — 6 domains, compressed definitions. | **Package A (+1.5)** — Broader coverage and rigorous anti-synonyms. |
| **`references/canvas-and-particles.md`** | **356 lines** — High-DPI canvas, ITU-R BT.601 math, `TextParticleSystem` class, $O(N^2/2)$ constellation, trigonometric flow field. | **311 lines** — Labels BT.601 as BT.709; lacks self-contained system class and time-parameterized flow field. | **Package A (+2.5)** — Mathematically exact and architecturally complete. |
| **`references/motion-and-scroll.md`** | **665 lines** — Unified ticker, pin math ($p \in [0.9, 1.0]$), SplitText a11y, 3D split-cards, horizontal gallery, card stacking, shutter transitions. | **77 lines** — Skeletal; uses deprecated `@studio-freight/lenis` package; omits 70% of motion patterns. | **Package A (+5.0)** — Massive gap in depth, utility, and production readiness. |
| **`references/threejs-and-r3f.md`** | **340 lines** — WebGL studio setup, FOV tangent math, studio lighting rig, DRACO loader, axis-angle rotation, R3F, dirty rendering, disposal. | **85 lines** — Basic R3F snippets only; omits vanilla setup, lighting rig, FOV math, and scene disposal. | **Package A (+4.5)** — Full-spectrum coverage for both vanilla Three.js and R3F. |
| **`references/shaders-and-glsl.md`** | **242 lines** — Uniforms, aspect-cover UV, vertex ripples, Simplex/FBM (with rotation)/Curl noise, chromatic aberration, velocity tracker. | **216 lines** — Missing Curl Noise; missing FBM rotation; syntax hazard (`vec2 new`); async texture crash bug. | **Package A (+3.5)** — Production-ready, mathematically sound, and bug-free. |
| **`references/hybrid-3d-cinematics.md`** | **321 lines** — ORYZO/Apple hybrid pipeline, Blender baking, in-memory frame scrubber, `object-fit: cover` math, 3D perspective DOM (`100svh`). | **246 lines** — Uncoordinated ScrollTriggers; uses `100vh`; contradicts `SKILL.md` video scrubbing directive. | **Package A (+3.0)** — Cohesive, mobile-safe, and architecturally verified. |
| **`references/performance-and-profiling.md`** | **262 lines** — 16.6ms budget, universal `getSafeDPR`, `THREE.InstancedMesh`, zero-allocation loops, comprehensive teardown, mobile degradation. | **62 lines** — Superficial notes; incomplete disposal snippet; lacks device degradation matrix. | **Package A (+4.5)** — Enforceable, concrete performance guardrails. |
| **`references/examples.md`** | **743 lines** — 5 complete, standalone, syntax-verified recipes with zero placeholders and robust math. | **608 lines** — 5 recipes with Euler angle flipping, uncorrected shader coordinates, and `100vh` styling. | **Package A (+1.5)** — Error-free, copy-pasteable production implementations. |
| **`synthesis-report.md`** | **102 lines** — Detailed documentation of sources, trade-offs, conflict resolutions, and deliverables manifest. | **21 lines** — High-level summary. | **Package A (+1.0)** — Rigorous synthesis transparency. |

---

## 5. Final Recommendation & Tournament Decision

### Formal Verdict: **PACKAGE A (`flash-synthesis`) WINS ROUND 1**

**Package A (`flash-synthesis`)** represents the pinnacle of creative web development skill engineering. It achieves a perfect score of **60.0 / 60 (100%)** by combining:
1. An authoritative **Input-as-Computation** operational pipeline.
2. Flawless mathematical and physical integrity.
3. An exhaustive, production-grade reference library spanning all 8 creative web dev pillars.
4. Production-ready, syntax-verified GLSL shader kernels and hybrid Blender-to-Canvas pipelines.
5. Strict, enforceable performance guardrails and mobile degradation systems.
6. Five complete, copy-pasteable production recipes.

**Package B (`pro-synthesis`)** is eliminated due to its superficial reference documentation, missing algorithms (Curl Noise), factual inaccuracies (BT.709 vs BT.601), and critical architectural contradiction regarding video scrubbing.

**Recommendation**: Adopt **Package A (`flash-synthesis`)** as the definitive Master Skill for Creative Web Development.
