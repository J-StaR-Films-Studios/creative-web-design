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
