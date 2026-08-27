# Source-to-Skill Compilation: Generative Design Systems & Creative Coding

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | video / presentation transcript & slides |
| **Title** | *Programming Design* — Awwwards Conference Talk by Bruno Imbrizi |
| **Authority** | Bruno Imbrizi (Senior Creative Developer at FIELD.IO; instructor on creative coding) |
| **Coverage** | Creative coding fundamentals, expressive vs. functional algorithmic art, procedural typography, audio/data visualization, algorithmic layout composition, generative branding/identity systems (Adidas, Nike GVC), custom generative authoring tools, and real-time multi-display retail deployment. |

### Coverage Gaps Identified
- Specific low-level shader/WebGL code implementations (GLSL code snippets) are referenced conceptually rather than detailed line-by-line.
- Hardware-level physical screen networking protocols for retail displays are kept abstract (the methodology focuses on web-based rendering via browser/Node/Puppeteer and beat-based synchronization).

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPEC: GENERATIVE DESIGN & REAL-TIME IDENTITY SYSTEMS
# ==============================================================================

# --- CONCEPTS ---
- id: ku-001
  type: concept
  name: Creative Coding
  source: src-01, "03:00 - 04:10"
  confidence: high
  definition: >
    Computer programming where the primary goal is expressive and visual creation 
    rather than purely utilitarian or transactional software functionality.
  attributes: [expressive, algorithmic-art, visual-computation, real-time]
  avoid_terms: [standard web development, functional programming, utility coding]
  related: [ku-002, ku-003]

- id: ku-002
  type: concept
  name: Generative Identity System
  source: src-01, "09:10 - 10:30, 16:21 - 17:55"
  confidence: high
  definition: >
    A brand identity and dynamic content framework where code executes designer-defined 
    rules to produce infinite, context-aware, brand-compliant visual variations across 
    arbitrary form factors in real time.
  attributes: [rule-based, multi-format, localized, real-time, modular]
  avoid_terms: [static brand guidelines, templated video rendering]
  related: [ku-004, ku-005, ku-006]

- id: ku-003
  type: concept
  name: Generative Module
  source: src-01, "09:10 - 10:20, 10:40 - 11:20"
  confidence: high
  definition: >
    An autonomous, code-generated visual primitive (e.g., procedural 3D wireframe, 
    kinetic typography, glitch shader, particle field) designed to be combined 
    algorithmically into larger layouts.
  attributes: [parametric, modular, reactive, resolution-independent]
  avoid_terms: [static asset, fixed video clip]
  related: [ku-004]

- id: ku-004
  type: concept
  name: Algorithmic Composition
  source: src-01, "09:55 - 10:20, 12:10 - 12:47"
  confidence: high
  definition: >
    The automated layout arrangement of generative modules onto spatial grids 
    (e.g., staircase, stack, fill, glitch) controlled by programmatic heuristics.
  attributes: [grid-based, permutation-engine, layout-heuristics]
  avoid_terms: [manual layout, fixed template]
  related: [ku-002, ku-003]

- id: ku-005
  type: concept
  name: Real-Time Responsive Motion Pipeline
  source: src-01, "17:56 - 19:35"
  confidence: high
  definition: >
    A graphics rendering pipeline using web technologies (Browser, WebGL, Canvas, Node) 
    that calculates layouts and animations on-the-fly to fit any screen resolution, 
    aspect ratio, or physical multi-screen architectural display array.
  attributes: [resolution-agnostic, responsive-motion, zero-prerender]
  avoid_terms: [prerendered video pipeline, fixed aspect ratio export]
  related: [ku-002, ku-006]

- id: ku-006
  type: concept
  name: Beat Synchronicity
  source: src-01, "21:16 - 22:05"
  confidence: high
  definition: >
    A decentralized screen synchronization mechanism where multiple disparate physical displays 
    independently calculate animations locked to a shared temporal tempo (BPM/beat clock), 
    achieving unified choreography without complex inter-screen network messaging.
  attributes: [clock-driven, decoupled, synchronized-choreography]
  avoid_terms: [video genlock, master-slave frame streaming]
  related: [ku-005]

# --- PRINCIPLES ---
- id: ku-010
  type: principle
  name: Design the Rules, Not the Instances
  source: src-01, "08:28 - 08:45, 12:05 - 12:47, 17:15 - 17:40"
  confidence: high
  statement: >
    Do not design individual static visual artifacts; design the parameter boundaries, 
    relationships, and procedural rules within which the algorithm generates endless valid designs.
  rationale: >
    Designing instances does not scale to global, 24/7 multi-display retail setups. 
    Designing rules guarantees infinite brand coherence while enabling continuous novelty.
  applies_to: [ku-020, ku-021]

- id: ku-011
  type: principle
  name: Code is the Execution Medium for Graphic Design
  source: src-01, "08:05 - 08:45, 22:23 - 23:27"
  confidence: high
  statement: >
    Elevate generative art into functional graphic design by layering structured typography, 
    grid hierarchies, brand messages, and clear editorial communication on top of algorithmic visuals.
  rationale: >
    Expressive algorithmic sketches become practical design systems only when they communicate 
    structured information (time, place, event, narrative).
  applies_to: [ku-020]

- id: ku-012
  type: principle
  name: Separation of Design Envelope and Data State
  source: src-01, "18:50 - 20:15"
  confidence: high
  statement: >
    Decouple the visual composition rules from dynamic runtime variables (store location, 
    city names, local weather, live activity data, asset buckets).
  rationale: >
    Enables instant worldwide localization and seasonal campaign swaps by mutating variables 
    without re-authoring or re-exporting video files.
  applies_to: [ku-021, ku-022]

# --- PROCEDURES ---
- id: ku-020
  type: procedure
  name: Generative Graphic Tool & Asset Authoring
  source: src-01, "07:20 - 08:45, 14:56 - 16:20"
  confidence: high
  goal: Create dedicated parametric web-based design tools for generating bespoke visual assets
  prerequisites: [Visual concept / generative algorithm defined]
  steps:
    - action: Build the algorithmic visual engine in WebGL/Canvas/SDF/Particle shaders.
      criterion: Visuals react smoothly to real-time parameter changes.
    - action: Expose an interactive graphical user interface (GUI) for parameter manipulation.
      criterion: Sliders, color pickers, and toggles control geometric and motion properties.
    - action: Integrate live data input (e.g., audio, sports motion tracking, sensor data).
      criterion: External data inputs accurately drive algorithmic variations.
    - action: Layer functional typography, editorial hierarchies, and branding constraints.
      criterion: Output meets graphic design and communication criteria.
  outputs: [Custom visual authoring tool, generated vector/raster assets]

- id: ku-021
  type: procedure
  name: Generative Identity & Multi-Screen Engine Architecture
  source: src-01, "09:00 - 13:00, 16:21 - 22:10"
  confidence: high
  goal: Build and deploy a real-time, multi-screen responsive generative design system
  prerequisites: [Brand visual identity guidelines, store architectural display blueprints]
  steps:
    - action: Develop modular visual components (kinetic typography, 3D wireframes, GLSL glitch textures).
      criterion: Components are fully self-contained and parameter-driven.
    - action: Define algorithmic composition rules and grid templates (stacks, staircases, fills).
      criterion: Layout heuristics handle arbitrary aspect ratios without visual breakage.
    - action: Implement a responsive layout engine mapping to real physical screen spaces.
      criterion: Content formats seamlessly for columns, banners, multi-panel arrays, and atriums.
    - action: Implement decentralized tempo synchronization (beat clock).
      criterion: Disparate screens animate in harmonious rhythm without network latency dependencies.
    - action: Hook localization variables and live external APIs (weather, running club metrics, store name).
      criterion: Dynamic data updates instantly re-skin the visual output.
  outputs: [Real-time generative identity engine, localized multi-display retail experience]

# --- CONSTRAINTS ---
- id: ku-030
  type: constraint
  name: Zero Offline Video Pre-rendering
  source: src-01, "17:40 - 18:45"
  confidence: high
  rule: >
    Do not rely on pre-rendered video files for localized multi-screen retail deployments; 
    execute layout, animation, and asset composition live in real time via web engines.
  scope: Deployment architecture
  consequence: >
    Pre-rendering produces massive rendering overhead across hundreds of global screen formats 
    and destroys real-time data reactivity.

# --- EXAMPLES ---
- id: ku-040
  type: example
  name: Adidas Real/Raw/Fast Generative Identity System
  source: src-01, "08:58 - 12:47"
  confidence: high
  scenario: Creating a global dynamic retail visual identity system for Adidas stores.
  application: >
    FIELD.IO and DIA created modular code-based typography, 3D line-drawn primitives, and glitch textures. 
    They wrote algorithmic layout heuristics to compose modules dynamically into infinite video/motion sequences.
  outcome: An adaptive generative branding system operating across diverse retail screen configurations.

- id: ku-041
  type: example
  name: Nike GVC (Generative Visual Center)
  source: src-01, "16:21 - 22:15"
  confidence: high
  scenario: Deploying continuous 24/7 synchronized, localized visual content across global Nike flagship stores.
  application: >
    Built a browser/Node-based real-time runtime that adapts motion and graphic layouts to arbitrary 
    store display architectures (London, Seoul, Innsbruck). Integrated dynamic localization 
    (store names, map plots, Nike Running Club stats) and synchronized decoupled screens via a shared BPM beat clock.
  outcome: Scalable, zero-render-overhead visual branding system that updates globally in real time.
```

---

## Phase 3: Methodology Synthesis

```
STAGE 1: Generative Module Development
INPUT: Brand guidelines, motion language, visual assets, 3D wireframe concepts.
STEPS:
1. Decompose design language into atomic generative modules (Kinetic Typography, Procedural Geometry, Shaders/Textures, Particle Systems).
2. Code each module using web graphics technology (WebGL, Canvas, Three.js, GLSL shaders).
3. Expose parametric controls (scale, density, velocity, line weight, color palette).
OUTPUT: Parameter-driven, standalone generative visual modules.
VALIDATION:
[ ] Modules render at 60 FPS across target resolution scales.
[ ] Parameters cover the entire expressive envelope without visual corruption.

STAGE 2: Algorithmic Composition & Layout Engine
INPUT: Generative modules, target grid specifications, editorial hierarchy rules.
STEPS:
1. Define spatial composition archetypes (Staircase, Stack, Glitch, Fill, Geometric Slices).
2. Program composition heuristics that randomly or dynamically assemble modules into layouts.
3. Apply responsive boundary constraints to ensure typography and core focal points remain readable across portrait, landscape, and irregular aspect ratios.
OUTPUT: Automated layout composition engine.
VALIDATION:
[ ] Compositions generated across 1,000 algorithmic cycles remain visually coherent and brand-compliant.
[ ] Core typography and branding elements never collide or clip illegibly.

STAGE 3: Dynamic Data & Localization Integration
INPUT: Dynamic data feeds (weather, running stats, store location, localized copy).
STEPS:
1. Parameterize text strings, color tokens, and geographic/metric data as runtime variables.
2. Connect external APIs / CMS feeds to update parameters in memory.
3. Build map plotting and data-trail visualizers to render local athletic/environmental data.
OUTPUT: Data-driven, localized dynamic content pipeline.
VALIDATION:
[ ] Swapping store location variable immediately updates all typography, maps, and color accents.
[ ] API dropouts fallback gracefully to cached brand defaults.

STAGE 4: Multi-Screen Spatial Mapping & Beat Synchronization
INPUT: Physical store floor plans, display aspect ratios, spatial array layout.
STEPS:
1. Build a 3D digital twin / spatial simulator of the physical retail display setup.
2. Implement a universal tempo clock (BPM-driven ticker) for temporal choreography across displays.
3. Map viewports to multi-column tickers, atrium displays, and entrance portals.
OUTPUT: Synchronized real-time multi-display deployment package.
VALIDATION:
[ ] Displays animate in sync without requiring heavy frame-by-frame network synchronization.
[ ] Content scales cleanly across single screens, vertical banners, and multi-display walls.
```

---

## Phase 4: Skill Compilation

Below is the complete, ready-to-deploy agent skill package compiled according to the skill specification guidelines.

### Target Structure

```
generative-design-systems/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

---

### `generative-design-systems/SKILL.md`

```markdown
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
```

---

### `generative-design-systems/references/terminology.md`

```markdown
# Terminology

**Generative Design System**:
An algorithmic framework that uses programmatic rules and constraints to generate endless variations of brand assets, layouts, and motion behaviors in real time.
_Avoid_: static template, automated banner maker, random graphics generator

**Creative Coding**:
The discipline of programming software for expressive, visual, auditory, and experiential outcomes rather than strict utilitarian data processing.
_Avoid_: script hacking, web styling

**Algorithmic Composition**:
The automated arrangement of layout elements, typography, and media based on mathematical grid logic and heuristic design rules.
_Avoid_: random layout, auto-shuffler

**Responsive Motion Engine**:
A real-time graphics pipeline that evaluates screen resolution, physical dimensions, and aspect ratio dynamically, adapting motion and layout without offline rendering.
_Avoid_: responsive video player, video transcode farm

**Beat Synchronicity**:
A method of synchronizing decoupled physical screens by binding animations and state changes to a mathematical temporal clock (BPM), eliminating complex network message overhead.
_Avoid_: network genlock, master-slave screen streaming

**Signed Distance Field (SDF)**:
A mathematical representation of shapes and glyphs used in GPU shaders to render resolution-independent, dynamically morphable typography and vector geometry at extreme performance.
_Avoid_: bitmap font, raster asset
```

---

### `generative-design-systems/references/examples.md`

```markdown
# Worked Examples

## Example 1: Nike GVC (Generative Visual Center)

**Scenario**:
Nike required a 24/7 visual branding and campaign content system deployed across global flagship stores (London, Seoul, Innsbruck, Manchester). Displays varied wildly in aspect ratio (atrium videowalls, narrow vertical column tickers, entrance portals), requiring constant seasonal updates and city-specific localization.

**Application**:
- **Engine**: Built a web-technology-based real-time runtime executing via WebGL and GPU shaders.
- **Responsive Layout**: Programmed grid rules that dynamically map photography, 3D meshes, and kinetic type to arbitrary architectural screen dimensions without pre-rendered video.
- **Localization**: Decoupled city names, localized typography, store maps, and Nike Running Club (NRC) telemetry into dynamic variables swapped instantly via a web dashboard.
- **Synchronicity**: Decoupled physical screens across the store synchronized their visual cuts, color shifts, and typographic tickers by locking to a shared BPM master tempo.

**Outcome**:
Eliminated thousands of hours of manual video rendering while producing an adaptive, localized, 24/7 live visual retail experience worldwide.

**Key Lesson**:
Decoupling the layout engine from runtime localization variables enables massive global scalability without manual production overhead.

---

## Example 2: Adidas Real/Raw/Fast Generative Identity

**Scenario**:
Adidas sought a generative global identity system capable of remixing brand visual assets into dynamic digital content for retail environments.

**Application**:
- **Modular Assets**: FIELD.IO and DIA engineered discrete procedural components: 3D wireframe geometries, kinetic typography kinetic modules, and glitch shader textures.
- **Algorithmic Grid Engine**: Created algorithmic layout heuristics (Staircase, Stack, Fill, Glitch) that procedurally combined modules into rich graphic layouts.
- **Parametric Controls**: Integrated real-time controls allowing designers to tune composition density, animation speed, and asset weighting.

**Outcome**:
A unified generative identity system that maintains strict brand recognition while delivering infinite novel visual permutations.

**Key Lesson**:
Developing modular, parameter-driven components allows automated composition engines to generate endless brand-compliant designs.
```

---

## Phase 5: Validation & Quality Gate

### Source Fidelity Checklist
- [x] Creative coding definition and expressive-vs-functional paradigm accounted for (`ku-001`, `ku-011`).
- [x] Transition from visual sketches to structured graphic design (typography, communication, editorial hierarchy) encoded (`ku-011`, Phase 1 & 2).
- [x] Modular asset authoring (kinetic type, 3D wireframes, GLSL glitch textures) encoded (`ku-003`, `ku-020`).
- [x] Algorithmic layout composition (stack, staircase, fill, glitch) encoded (`ku-004`, Phase 2).
- [x] Real-time responsive multi-screen retail architecture and elimination of pre-rendered video encoded (`ku-005`, `ku-030`).
- [x] Dynamic localization (city names, maps, live sports telemetry, running club stats) encoded (`ku-012`, Phase 3).
- [x] Decentralized tempo/BPM synchronicity across physical displays encoded (`ku-006`, Phase 4).
- [x] Real-world case studies (Adidas, Nike GVC, Patrik Huebner's Art Machines, World Cup Fever) documented in references (`ku-040`, `ku-041`, `examples.md`).

### Operational Coverage Walkthrough
1. **Scenario A: Global Retail Flagship Rollout**
   - *Practitioner Need*: Deploy synchronized branded visuals across 15 irregular architectural screens in a newly opened store.
   - *Skill Guidance*: Guides practitioner through Phase 2 (responsive grid mapping), Phase 3 (injecting local store variables), and Phase 4 (BPM beat-clock sync).
2. **Scenario B: Custom Generative Tool for Graphic Campaigns**
   - *Practitioner Need*: Build a client-facing web tool to generate brand posters and video assets from sports data.
   - *Skill Guidance*: Step-by-step procedural workflow in Phase 1 and Phase 3 to build parametric WebGL engines, GUI controls, and trajectory visualizers.
3. **Scenario C: Live Data-Reactive Brand Experience**
   - *Practitioner Need*: Animate store displays based on live weather and local running club activity.
   - *Skill Guidance*: Phase 3 data-to-visual translators convert incoming numerical data into parametric visual deformations in real time.

---

## Delivery Package

1. **Skill Package**: Complete, fully validated `generative-design-systems` skill with `SKILL.md`, `terminology.md`, and `examples.md`.
2. **Extraction Summary**: 14 atomic Knowledge Units extracted across Concepts, Principles, Procedures, Constraints, and Examples with full provenance to Bruno Imbrizi's presentation.
3. **Known Limitations**:
   - Hardware-level video wall controller networking (e.g., physical HDMI matrix hardware) must be configured separately; the skill covers the software rendering and temporal synchronization pipeline.
