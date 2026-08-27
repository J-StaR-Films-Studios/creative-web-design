---
name: generative-design-systems
description: |
  Design, build, and deploy real-time generative branding, dynamic graphic systems, 
  and multi-screen retail visual engines using creative coding and web technologies.
  Use when tasked with: programmatic motion design, algorithmic brand identity,
  multi-display retail synchronization, dynamic visual localization, or custom generative design tools.
  Triggers: generative identity, creative coding design, algorithmic branding,
  real-time motion system, dynamic retail screens, programmatic design system.
---

# Generative Design & Real-Time Identity Systems

This skill guides the end-to-end operational process of engineering **generative design systems** and **real-time branding engines**. It operationalizes procedural asset creation, algorithmic layout composition, multi-screen responsive deployment, and data-driven localization.

---

## Core Ground Rules

1. **Design Rules, Not Static Instances**: Define the boundaries, color logic, motion curves, and layout hierarchies. Let algorithms generate the infinite permutations.
2. **Layer Editorial Design Over Algorithmic Visuals**: Pair expressive computation (particle systems, shaders, procedural geometry) with typography, grids, and brand narratives.
3. **Execute Real-Time; Zero Offline Pre-rendering**: Render layouts and motion dynamically via web engines (WebGL, Canvas, Node) to eliminate rendering bottlenecks and enable instant live data reactivity.
4. **Decouple System Architecture from Content State**: Maintain separate layers for the layout engine, generative visual modules, and runtime localization variables.

For canonical terminology and definitions, see [terminology.md](references/terminology.md).

---

## Phase 1: Generative Module Engineering

Deconstruct the brand's visual identity into autonomous, code-driven computational modules.

1. **Classify Visual Primitives**: Break down the visual identity into four modular categories:
   - *Procedural Geometry*: 3D wireframes, Delaunay triangulations, topological surfaces, vector curves.
   - *Kinetic Typography*: SDF-driven font animations, glyph disintegrations, typographic tickers, staggered repeats.
   - *Shaders & Textures*: GLSL fragment shaders, glitch displacement maps, color gradients, audio-reactive meshes.
   - *Simulation Systems*: Particle emitters, physics-based motion capture trails, data-driven vector flows.
2. **Implement Parameter Envelopes**: Write each module in a hardware-accelerated web graphics runtime (WebGL, Three.js, Canvas 2D, PixiJS). Expose normalized input parameters `[0.0 - 1.0]` for speed, density, scale, jitter, and color palette.
3. **Build Parametric GUI Controls**: Embed a lightweight interface (e.g., `dat.gui` or `tweakpane`) to interactively test, tune, and lock parameter boundary limits.

### Completion Gate
- [ ] Every generative module executes in real-time at 60 FPS.
- [ ] Parameter extremes (0.0 and 1.0) maintain visual appeal without glitching or crashing.
- [ ] Interactive GUI allows rapid visual exploration and preset saving.

---

## Phase 2: Algorithmic Layout & Composition Engine

Develop layout heuristics that procedurally assemble modules into brand-coherent graphic compositions.

1. **Establish Dynamic Grid Archetypes**: Define procedural layout schemes:
   - *Stack*: Vertical/horizontal layering of image slices and typography blocks.
   - *Staircase*: Stepped modular offsets following a diagonal trajectory.
   - *Glitch/Slice*: Dynamic geometric offset cuts splitting video and vector elements.
   - *Fill & Frame*: Full-bleed background texture overlaid with structured focal content.
2. **Program Placement Heuristics**: Write rules governing:
   - Visual balance (module weight distribution across the canvas).
   - Editorial hierarchy (brand mark > primary typography > supporting telemetry/data > ambient background).
   - Collision avoidance (ensuring text blocks and logotypes never intersect illegibly).
3. **Enforce Responsive Aspect-Ratio Mapping**: Ensure the layout engine computes relative coordinate systems dynamically across extreme aspect ratios (e.g., 9:16 portrait kiosks, 32:9 ultra-wide ribbons, non-standard column strips).

### Completion Gate
- [ ] Layout engine generates randomized permutations without human intervention.
- [ ] Core typographic messages and brand marks remain 100% legible across all generated iterations.
- [ ] Aspect ratios from 1:3 vertical tickers to 16:9 displays render without manual asset resizing.

---

## Phase 3: Dynamic Localization & Live Data Integration

Connect dynamic data feeds and localization variables to generate store-specific, context-aware content.

1. **Parameterize Brand Variables**: Decouple and expose the following runtime tokens:
   - Location Tokens: Store name, city, country, localized language glyphs.
   - Environmental Tokens: Local weather, temperature, sun position/time-of-day.
   - Activity Telemetry: Running club aggregates, live match trajectories, member stats.
2. **Build Data-to-Visual Translators**: Convert incoming data points into visual geometry:
   - Plot GPS and match trajectories using smooth 3D Bezier splines or stylized particle ribbons.
   - Translate metric integers (e.g., running minutes) into typographic motion scales.
3. **Implement Fallback States**: Establish default brand presets that take over seamlessly during network outages or API latency.

### Completion Gate
- [ ] Mutating a localization key (e.g., `city: "Seoul"` → `city: "London"`) updates all typography, maps, and color accents instantaneously.
- [ ] Live external data feeds directly modulate procedural visuals.
- [ ] Offline fallback states activate automatically if live feeds disconnect.

---

## Phase 4: Multi-Display Deployment & Beat Synchronization

Deploy the real-time system across physical architectural displays using lightweight temporal choreography.

1. **Construct Spatial Display Twin**: Model the physical store's screen arrangement in 3D space to simulate multi-angle sightlines, column arrays, and videowall alignments.
2. **Implement Universal BPM Clock**:
   - Establish a master beat-clock ticker (`tempo = BPM`) calculating continuous cyclic phase `t = (Date.now() % beatDuration) / beatDuration`.
   - Drive all screen transitions, text morphs, and module switches from this common phase, ensuring multi-screen harmony without inter-device network messaging.
3. **Configure Headless Renderers**:
   - For physical stores with dedicated web viewports, run directly via hardware-accelerated browsers.
   - For setups requiring video exports, use headless Node/Puppeteer renderers to record pixel-perfect sequences on demand.

For detailed real-world case studies (Adidas, Nike GVC), see [examples.md](references/examples.md).

### Completion Gate
- [ ] Multiple independent displays run in rhythmic synchrony via beat-clock logic.
- [ ] 3D digital twin validates composition harmony across physical space.
- [ ] Runtime operates continuously 24/7 with zero memory leakage.

---

## Output Artifacts

Upon completing this workflow, deliver:
1. **Generative Module Library**: Modular WebGL/Canvas scripts with exposed parameter controls.
2. **Composition & Responsive Layout Engine**: Algorithmic grid generator adaptable to arbitrary display formats.
3. **Web-Based Runtime Interface**: Real-time control dashboard for managing campaigns, localization variables, and presets.
4. **Deployment & Multi-Screen Synchronization Package**: Standalone browser/Node runtimes configured for multi-display hardware environments.
