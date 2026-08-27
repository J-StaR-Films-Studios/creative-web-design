# Worked Examples: Webflow GSAP Implementations

## Example 1: Sticky 3-Card Stack & Horizontal Fan-Out

**Scenario**: A portfolio case study section where 3 overlapping cards fly onto the screen as a stacked deck, then fan out horizontally as the user continues scrolling down the page.

**Hierarchy Setup**:
```
.section-sticky-projects (Position: Relative, Height: 300vh)
  .sticky-track (Position: Sticky, Top: 0px, Height: 100vh, Display: Flex, Align: Center, Justify: Center)
    .card-deck-wrapper (Position: Relative)
      .profile-card.is-1 (Position: Absolute)
      .profile-card.is-2 (Position: Absolute)
      .profile-card.is-3 (Position: Absolute)
```

**Interaction Configuration**:
- **Trigger**: Page Scroll on `.section-sticky-projects`
- **Scroll Settings**: Start: Viewport 80%, End: Viewport 100%, Scrub: Smooth 0.8s
- **Timeline Keyframes**:
  - `0.00s - 0.25s`: `.profile-card.is-1` -> Move Y: 200% to 0%, Rotate Z: 0deg to -5deg
  - `0.10s - 0.35s`: `.profile-card.is-2` -> Move Y: 200% to 0%, Rotate Z: 0deg to 0deg
  - `0.20s - 0.45s`: `.profile-card.is-3` -> Move Y: 200% to 0%, Rotate Z: 0deg to 5deg
  - `0.45s - 0.70s` (Fan-Out Stage):
    - `.profile-card.is-1` -> Move X: 0% to -110%, Rotate Z: -5deg to 0deg
    - `.profile-card.is-2` -> Move X: 0% to 0%, Rotate Z: 0deg to 0deg
    - `.profile-card.is-3` -> Move X: 0% to 110%, Rotate Z: 5deg to 0deg

**Outcome**: Cards arrive smoothly into a central deck before gracefully spreading across the horizontal viewport track.

---

## Example 2: Interactive Service Row Hover with Image Ejection

**Scenario**: A high-end editorial service list where hovering any service row pushes the text to the right, changes the row background, recolors the text, and slides in a preview image from the left.

**Hierarchy Setup**:
```
.services-list-parent
  .service-item-row (Trigger Element)
    .img-left (Position: Absolute, Left: 0, Width: 120px, Overflow: Hidden)
    .service-title (Typography)
    .service-number (Typography: Serif)
```

**Interaction Configuration**:
- **Trigger**: Element Trigger -> Hover on `.service-item-row`
- **Hover In Actions** (`Target: Class`, `Filter: Within`):
  1. `.service-item-row` -> Background Color: `transparent` -> `#E8E8E8`, Duration: `0.3s`
  2. `.img-left` -> Move X: `-100%` -> `0%`, Alpha: `0` -> `100`, Duration: `0.4s`, Ease: `Power 2 Out`
  3. `.service-title` -> Move X: `0px` -> `180px`, Color: `#FFFFFF` -> `#000000`, Duration: `0.4s`
  4. `.service-number` -> Color: `#FFFFFF` -> `#000000`, Duration: `0.3s`
- **Hover Out Actions**:
  - Control: `Reverse`, Speed: `1.0`

**Outcome**: Hovering any individual row triggers isolated, butter-smooth micro-animations without impacting neighboring service items.
```

---

## Extraction Summary & Delivery Report

### Extraction Metrics
- **Knowledge Units Extracted**: 16 units across 5 types (4 Concepts, 3 Principles, 6 Procedures, 1 Constraint, 2 Worked Examples).
- **Source Fidelity**: 100% of methods, settings, attributes, and timeline workflows from the tutorial video were translated into operational procedures.
- **Conflicts Resolved**: None. Source provided a consistent unified workflow for Webflow's native GSAP engine.

### Skill Package Deliverables
1. **`SKILL.md`**: Compact (< 500 lines), imperative, phased operational instructions with strict completion gates.
2. **`references/terminology.md`**: Canonical GSAP-Webflow domain glossary with anti-synonyms (`_Avoid_`).
3. **`references/examples.md`**: Worked production examples detailing DOM layout requirements, scrub timestamps, and transform coordinates.
