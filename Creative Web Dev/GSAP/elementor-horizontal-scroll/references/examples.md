# Worked Examples

## Example 1: 3D Multi-Layer Product Hero Slide

**Scenario**: A slide with a large background text heading, a center featured product bottle, and two background floating fruit images requiring 3D depth effect.

**Application**:
1. Outer Container: `mdw-horizontal-scroll`.
2. Heading Widget: Fixed width `1000px`, padding-top `130px`.
3. Background Fruit Image 1 (Left): Class `mdw-hs-movement-translate-x-10`.
4. Foreground Bottle Image (Center): Position `Absolute`, Class `mdw-hs-movement-translate-x-20`.
5. Background Fruit Image 2 (Right): Position `Absolute`, Class `mdw-hs-movement-translate-x-30`.

**Outcome**: As user scrolls horizontally, the background fruit moves slowly (10), the bottle moves medium (20), and the foreground fruit moves rapidly (30), producing a realistic 3D depth parallax illusion.

---

## Example 2: In-Track Jump Link with Rotating CTA Badge

**Scenario**: A landing hero slide contains a circular badge ("Scroll Down • Explore More") that must rotate continuously and scroll directly to Slide 3 upon clicking.

**Application**:
1. Circular badge heading widget assigned class: `mdw-hs-movement-rotate-10`.
2. Target Slide 3 container assigned class: `mdw-section-3`.
3. Badge link URL set to: `#mdw-section-3`.

**Outcome**: Badge rotates smoothly in sync with scroll progress. Clicking the badge instantly jumps horizontal scroll directly to Slide 3.

---

## Example 3: Mobile Stacking Fallback

**Scenario**: A horizontal track with 4 rich content slides needs to scroll horizontally on Desktop and Tablet, but convert to standard vertical stacking on mobile smartphones to ensure readable typography.

**Application**:
1. In driver HTML widget, configure:
   ```css
   body {
     --disable-movement-mobile: true;
     --disable-horizontal-scroll-mobile: true;
   }
   ```
2. In Elementor Mobile Breakpoint:
   - Outer Viewport Container: `Min-Height: auto`, `Overflow: visible`.
   - Track Container: `Direction: Column (vertical)`.
   - Slide Containers: `Width: 100%`, `Min-Height: auto`.

**Outcome**: On mobile screens, the page scrolls vertically without horizontal jamming, while desktop retains full horizontal animation.
