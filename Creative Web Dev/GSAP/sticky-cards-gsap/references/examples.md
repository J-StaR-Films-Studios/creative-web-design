# Worked Examples

## Example 1: Standard 4-Card Luxury Showcase

**Scenario**: A portfolio showcasing 4 architectural concepts with hero video/image presentation.

**Application**:
- Card 0: Morphing capsule hero starting at scale 0.5, expanding over 300vh scroll with a repeating background slogan marquee.
- Cards 1–3: Pinned stacked cards entering from bottom with scale 2 image parallax, unfurling from 150px rounded borders to 25px rectangles.
- Outro: Final card pinned with `pinSpacing: true`, allowing standard content footer to roll into view naturally.

**Outcome**: A 60 FPS scroll experience matching Awwwards Site of the Day standards.

---

## Example 2: Mobile Viewport Adaptation

**Scenario**: Handling narrow mobile screens under 900px width.

**Application**:
- CSS media query drops headline font-size from `5rem` to `2rem`.
- Description width expands from `40%` to `90%`.
- Intro card `margin-top` adjusted to maintain comfortable scroll pace on touch screens.

**Outcome**: Zero layout breaking or text overflow across mobile devices.
