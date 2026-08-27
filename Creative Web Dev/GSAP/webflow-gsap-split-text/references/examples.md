# Worked Examples

## Example 1: Hero Heading Stagger on Page Load

**Scenario**: A large hero headline (`How we redefine creative excellence`) reveals word-by-word sliding up from behind a clip mask immediately upon page load.

**Configuration**:
- **Trigger**: Page load (Play from beginning, 0s delay).
- **Target**: Class `.heading-4vw`
- **Action Type**: `From`
- **Properties**:
  - `Opacity`: 0% → 100%
  - `Move Y`: 50px → 0px
  - `Duration`: 0.5s
  - `Ease`: `Power 4 out`
- **SplitText**:
  - `Split by`: `Word`
  - `Stagger Total time`: `0.8s`
  - `From`: `Start`
  - `Mask`: `Word`

**Outcome**: Each word slides cleanly up from an invisible clipping box with punchy deceleration upon landing.

---

## Example 2: Paragraph Scroll Highlight Reveal

**Scenario**: A body paragraph starts dim gray and highlights to crisp white line-by-line as the user scrolls down through the section.

**Configuration**:
- **Trigger**: Scroll
- **Controls**: `Scrub on scroll` (Smooth: `0.8s`)
- **Scroll Markers**:
  - `Start`: Element `Top` at Viewport `Bottom`
  - `End`: Element `Bottom` at Viewport `80%`
- **Target**: Class `.text-size-xdisplay`
- **Action Type**: `From`
- **Properties**:
  - `Text Color`: `#3c3c3c` (dark gray) → `#ffffff` (white)
  - `Move Y`: 50px → 0px
  - `Opacity`: 0% → 100%
- **SplitText**:
  - `Split by`: `Line`
  - `Stagger Total time`: `1.0s`
  - `Mask`: `None`

**Outcome**: Text smoothly shifts color and elevation directly synced to the user's scroll speed without clipping.

---

## Example 3: Viewport Entry Reveal with Reset on Scroll Back

**Scenario**: A feature block text statement animates autonomously when scrolled into view, and resets if the user scrolls completely back past it.

**Configuration**:
- **Trigger**: Scroll
- **Controls**: `Trigger actions`
  - `Enter`: `Play`
  - `Leave`: `None`
  - `Enter back`: `None`
  - `Leave back`: `Reset`
- **Scroll Markers**:
  - `Start`: Element `Top` at Viewport `Bottom`
  - `End`: Element `Bottom` at Viewport `Top`
- **Action Type**: `From`
- **Properties**:
  - `Opacity`: 0% → 100%
  - `Move Y`: 50px → 0px
  - `Duration`: 1.0s
  - `Ease`: `Power 1 out`
- **SplitText**:
  - `Split by`: `Word`
  - `Stagger Total time`: `1.0s`
  - `Mask`: `Word`

**Outcome**: Animation plays smoothly on scroll-down; scrolling back up resets the elements so downward scrolling triggers the reveal again.
