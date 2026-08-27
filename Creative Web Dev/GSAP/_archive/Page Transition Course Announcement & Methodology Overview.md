Here is the complete compilation of the video source material into an operational agent skill following the **Source-to-Skill** pipeline.

---

# Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | `video-notes` / promotional breakdown & announcement |
| **Title** | Osmo: Page Transition Course Announcement & Methodology Overview |
| **Authority** | Osmo Creators (Dylan Brouwer & Dennis Snellenberg — 35+ Site of the Day Awwwards winners) |
| **Coverage** | Principles of web continuity, page transition pitfalls, repeatable architecture vs brittle setups, production-minded animation systems, template patterns. |

### Coverage Gaps Identified
- Low-level source code implementations for specific JavaScript libraries (e.g., GSAP/Barba.js specific boilerplate code) are taught inside the proprietary 20+ lesson course rather than fully displayed in the promotional video. The skill captures the structural methodology, selection rules, architectural constraints, and operational design system.

---

# Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
- id: ku-001
  type: concept
  name: Continuity
  source: src-01, "00:10-00:26"
  confidence: high
  definition: >
    The visual and spatial coherence maintained between different web pages during navigation, transforming disjointed page loads into a cohesive experience.
  attributes: [seamless state transfer, pacing, viewport stability]
  avoid_terms: [page flash, hard jump, instant reload]
  related: [ku-002, ku-010]

- id: ku-002
  type: concept
  name: Page Transition System
  source: src-01, "00:44-01:05"
  confidence: high
  definition: >
    A standardized, repeatable architecture governing the exit, asset preloading/handoff, and entrance animations between routes.
  attributes: [repeatability, low cognitive load, production reliability]
  avoid_terms: [one-off hack, ad-hoc script]
  related: [ku-020, ku-030]

- id: ku-010
  type: principle
  name: Cumulative Detail Over Animation Complexity
  source: src-01, "00:05-00:15"
  confidence: high
  statement: >
    Perceived smoothness and polish come from small, disciplined decisions stacked consistently across page changes, not from overwhelmingly complex animation choreography.
  rationale: >
    Complex animations without solid foundation create lag, disorientation, and fragile builds.
  applies_to: [ku-020, ku-021]

- id: ku-011
  type: principle
  name: Production-Minded Repeatability
  source: src-01, "00:45-00:55, 01:18-01:40"
  confidence: high
  statement: >
    Build systems that can be reused across projects with predictable behavior rather than reinventing transition lifecycles per page.
  rationale: >
    Custom unstandardized setups break on novel routes, dynamic data, and device edge cases.
  applies_to: [ku-020]

- id: ku-020
  type: procedure
  name: Page Transition Architecture Design
  source: src-01, "00:45-01:05"
  confidence: high
  goal: Implement a reliable, maintainable transition system between routes.
  prerequisites: [defined site structure, route taxonomy]
  steps:
    - action: Establish route lifecycle hooks (leave, transition out, enter, transition in)
      criterion: Lifecycle cleanly isolates old container teardown and new container mount
    - action: Select appropriate transition archetype (Column Wipe, Side-by-Side, Parallax, Crossfade)
      criterion: Selected archetype matches brand tone and content layout
    - action: Decouple boilerplate logic from specific scene animations
      criterion: Transition triggers work across all internal links without custom per-link scripts
  outputs:
    - Transition boilerplate structure
    - Configured route handlers

- id: ku-030
  type: constraint
  name: Anti-Fragile Pipeline Guard
  source: src-01, "00:34-00:44"
  confidence: high
  rule: >
    Avoid over-engineering transition lifecycles into complex state trees that turn the build into an unmaintainable mess.
  scope: Route handling and DOM manipulation
  consequence: >
    Causes race conditions, orphaned DOM nodes, memory leaks, and broken back/forward browser history.
  enforced_by: Lifecycle validation gate

- id: ku-040
  type: example
  name: Transition Archetypes
  source: src-01, "00:11-00:22, 01:00-01:05"
  confidence: high
  scenario: Enhancing multi-page navigation across editorial and portfolio sites.
  application: >
    Implemented archetypes such as Column Wipe, Side-by-Side sliding panels, Overlapping Parallax, and Subtle Crossfades.
  outcome: >
    Unified feel across page navigation with clear continuity.
  teaches: >
    Archetypes provide modularity and rapid implementation.
  illustrates: [ku-010, ku-020]

- id: ku-050
  type: counterexample
  name: The Over-Complex Fragile Build
  source: src-01, "00:39-00:44"
  confidence: high
  scenario: Building bespoke complex transition logic directly inside view templates.
  mistake: Coupling route transitions directly to page-specific animations without a unified lifecycle manager.
  consequence: Build turns into a mess; high maintenance cost, broken state on fast navigation.
  correction: Separate global transition lifecycle from local page timeline execution.
  teaches: Avoid over-complexity and lack of architectural clarity.
  illustrates: [ku-011, ku-030]
```

---

# Phase 3: Methodology Synthesis

### Operational Stage: Page Transition Engineering Pipeline

```
STAGE 1: Archetype & Scope Selection
INPUT
- Site route hierarchy and page types
- Brand motion intensity target (subtle vs expressive)

STEPS
1. Audit route continuity requirements — completion criterion: Route matrix maps source page to destination page behavior.
2. Select transition archetype (Subtle Crossfade, Column Wipe, Side-by-Side, Overlapping Parallax) — completion criterion: Archetype chosen based on content density and visual hierarchy.

DECISION POINTS
- If content is media-heavy / immersive → select Overlapping Parallax or Column Wipe.
- If content is text-heavy / utilitarian → select Subtle Crossfade or Directional Slide.

OUTPUT
- Transition specification map.

---

STAGE 2: Lifecycle & Boilerplate Scaffolding
INPUT
- Transition specification map
- Web framework / routing setup

STEPS
1. Configure lifecycle hooks (onLeave -> onEnter -> onComplete) — completion criterion: Old page unmounts and new page mounts without layout jumps or orphaned DOM elements.
2. Implement global link interceptor — completion criterion: Intercepts internal router clicks while respecting modifier keys and external URLs.
3. Bind transition timeline to lifecycle hooks — completion criterion: Timeline completes cleanly before route history finishes update.

DECISION POINTS
- If route fails to resolve within timeout → force fallback standard hard navigation.
- If user triggers back/forward button (popstate) → bypass entry animation or run reverse timeline.

OUTPUT
- Production-ready transition wrapper.

---

STAGE 3: Production Validation & Resilience Check
INPUT
- Functional transition build

STEPS
1. Test rapid multi-click stress testing — completion criterion: No animation overlapping, race conditions, or frozen UI.
2. Validate accessibility & motion sensitivity (`prefers-reduced-motion`) — completion criterion: Instant or simple opacity swap replaces complex transforms when reduced motion is requested.

OUTPUT
- Validated, production-grade page transition architecture.
```

---

# Phase 4: Skill Compilation

Below is the complete compiled agent skill file structure and content.

### `page-transition-architecture/SKILL.md`

```markdown
---
name: page-transition-architecture
description: |
  Architect and implement robust, production-ready web page transitions.
  Use when designing website motion systems, implementing route transitions,
  evaluating smooth navigation patterns, or refactoring fragile animation setups.
  Triggers: page transition, route transition, smooth navigation, web continuity,
  screen transitions, transition lifecycle.
---

# Page Transition Architecture

Design and implement production-ready page transitions that deliver continuity between routes without introducing fragile or unmaintainable codebases.

## Core Principles

1. **Cumulative Precision**: Perceived smoothness stems from precise, stacked micro-decisions (timings, easing, continuity), not gratuitous animation complexity.
2. **Lifecycle Decoupling**: Separate route transition lifecycle management (leave/enter orchestration) from scene-level element animations.
3. **Resilience First**: A transition system must fail gracefully to standard routing rather than freezing the user interface.

---

## Phase 1: Transition System Selection

Evaluate site content and brand requirements to assign transition archetypes to route transitions.

1. Classify route pairs into transition archetypes:
   - **Subtle Crossfade / Fade-Through**: Best for utility, editorial, and high-frequency navigation.
   - **Directional Side-by-Side**: Best for sequential journeys, steps, or sibling gallery pages.
   - **Column / Grid Wipe**: Best for high-impact brand showcases and hero shifts.
   - **Overlapping Parallax**: Best for visual-heavy editorial and case study handoffs.
2. Define entry and exit states for shared elements (headers, persistent nav, canvas viewports).
3. Set base duration constraints: exit (250–400ms), overlay/wipe (300–500ms), entry (300–600ms).

For archetype patterns and layout schemas, see [references/archetypes.md](references/archetypes.md).

### Completion Gate
- [ ] Every major route pair is mapped to an archetype.
- [ ] Base timing and easing curves are explicitly defined.
- [ ] Shared persistent UI elements are tagged for retention during route handoffs.

---

## Phase 2: Lifecycle Scaffolding

Implement the standard 4-stage transition lifecycle.

```
[Link Clicked] 
       │
       ▼
1. LEAVE (Animate current page out / capture exit state)
       │
       ▼
2. FETCH / MOUNT (Load new route DOM, insert into container)
       │
       ▼
3. ENTER (Animate new page in / transition overlay clear)
       │
       ▼
4. CLEANUP (Destroy old DOM, reset scroll position, reinit scripts)
```

1. Intercept internal navigation events while preserving default browser behaviors (`Cmd/Ctrl + click`, external links, hash links).
2. Isolate incoming and outgoing view containers within a transition wrapper.
3. Implement container unmounting and memory cleanup to prevent memory leaks.
4. Manage scroll restoration: lock scroll during transition, reset to top (or hash target) prior to Enter stage.

For canonical terminology and lifecycle state definitions, see [references/terminology.md](references/terminology.md).

### Completion Gate
- [ ] Old DOM container cleans up completely on transition end.
- [ ] Scroll position updates correctly without visual jumping.
- [ ] Browser history navigation (`popstate`) triggers proper transition lifecycle.

---

## Phase 3: Resilience & Edge Case Hardening

Harden the transition engine against production failure modes.

1. **Race Condition Prevention**: Lock navigation events during an active transition lifecycle to prevent overlapping triggers from rapid clicks.
2. **Fallback Timeout**: Set a hard network/animation timeout (e.g., 2000ms). If the destination route fails to load or animation hangs, force a direct route change.
3. **Accessibility Guardrail**: Check media query `prefers-reduced-motion: reduce`. When active, replace transform/scale/wipe timelines with an immediate crossfade (≤100ms) or instant swap.

### Completion Gate
- [ ] Rapid clicking on links does not cause race conditions or duplicate DOM elements.
- [ ] Timeout fallback executes reliably on network failure.
- [ ] `prefers-reduced-motion` bypasses spatial transforms.
```

---

### `page-transition-architecture/references/terminology.md`

```markdown
# Terminology

**Continuity**:
The visual and spatial coherence maintained across route changes so that the interface feels like a single unified environment.
_Avoid_: page hopping, hard blinking

**Transition Lifecycle**:
The deterministic sequence of hooks (`leave`, `load`, `enter`, `cleanup`) executed during route changes.
_Avoid_: page loader script, transition hack

**Container Handoff**:
The process of swapping the outgoing page DOM container with the incoming page DOM container within a persistent shell.
_Avoid_: full page wipe, iframe reload

**Archetype**:
A standardized, reusable motion pattern (e.g., Column Wipe, Side-by-Side, Parallax) applied across routes.
_Avoid_: bespoke one-off animation

**Reduced Motion Fallback**:
An alternative minimal transition executed when users have enabled motion sensitivity settings at the OS level.
_Avoid_: ignoring accessibility settings
```

---

### `page-transition-architecture/references/archetypes.md`

```markdown
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
```

---

# Phase 5: Validation & Delivery

### Extraction Summary
- **Total Knowledge Units Extracted**: 8 (Concepts: 2, Principles: 2, Procedures: 1, Constraints: 1, Examples: 1, Counterexamples: 1).
- **Key Conflict / Trap Resolved**: Random one-off tutorials vs overly complex bloated codebases → resolved via a modular, decoupled 4-stage lifecycle architecture with pre-built archetypes.

### Operational Verification & Walkthrough
1. **Scenario A (Agency Portfolio Case Study Handoff)**:
   - System maps route to *Overlapping Parallax* archetype.
   - Lifecycle intercepts link click, plays exit timeline on outgoing container, loads new route, animates entrance, and cleans up old DOM.
2. **Scenario B (Rapid Multi-Click / Network Lag)**:
   - Rapid click guard locks concurrent transition requests.
   - 2000ms fallback timeout triggers hard navigation if bundle loading stalls.
3. **Scenario C (Accessibility / Reduced Motion Enabled)**:
   - System queries `prefers-reduced-motion: reduce` and defaults to an instantaneous opacity swap.

### Known Limitations
- Does not contain specific library-dependent syntax (e.g., Barba.js, Next.js template handlers, Nuxt transition hooks), focusing instead on framework-agnostic architecture and lifecycle principles.
