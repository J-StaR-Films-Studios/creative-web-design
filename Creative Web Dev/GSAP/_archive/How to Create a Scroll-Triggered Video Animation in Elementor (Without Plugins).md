# Pipeline Execution Summary

### Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Video Tutorial |
| **Title** | How to Create a Scroll-Triggered Video Animation in Elementor (Without Plugins) |
| **Authority** | Nicolai (michellewp.com) — Web Designer / Elementor Specialist |
| **Coverage** | Elementor container setup, video widget configuration, sticky position styling, GSAP/ScrollTrigger custom script injection, z-index layering, and video framerate optimization (30 fps conversion). |

---

### Phase 2: Knowledge Extraction (Spec)

```yaml
- id: ku-001
  type: concept
  name: Scroll-Triggered Video Scrubbing
  source: src-01, "00:00 - 00:35"
  confidence: high
  definition: >
    Binding the playback position (currentTime) of an HTML5 video element 
    to the page's scroll position via GSAP and ScrollTrigger.
  avoid_terms: [autoplay video, parallax video]

- id: ku-002
  type: procedure
  name: Base Container Configuration
  source: src-01, "00:48 - 00:57, 01:38 - 01:55, 02:30 - 02:45"
  confidence: high
  goal: Create an expanded viewport scroll track for video playback.
  steps:
    - action: Create a Flexbox Container with 100% full width.
      criterion: Container width is explicitly set to 100%.
    - action: Set Container Min-Height to 500 VH.
      criterion: Container height allows sufficient scroll track length (500vh).
    - action: Remove default padding and set negative top margin (-120px) to overlay the header if needed.
      criterion: Video container touches full viewport edges seamlessly.
  outputs: [Configured scroll track container]

- id: ku-003
  type: procedure
  name: Self-Hosted Video Widget Configuration
  source: src-01, "00:58 - 01:32"
  confidence: high
  goal: Embed a clean video element without default controls or autoplay conflicts.
  steps:
    - action: Drag Video Widget into container and select Source as Self Hosted MP4.
      criterion: Video source is a valid .mp4 file.
    - action: Enable 'Mute' under Video Options.
      criterion: Video is muted to ensure programmatic playback compliance.
    - action: Disable 'Player Controls' and 'Autoplay'.
      criterion: No native UI controls (playbar, scrub bar) are visible.
  outputs: [Configured raw video element]

- id: ku-004
  type: procedure
  name: Sticky Positioning Setup
  source: src-01, "03:22 - 03:50"
  confidence: high
  goal: Lock video element in viewport while user traverses the 500vh container.
  steps:
    - action: Open Video Widget > Advanced > Motion Effects.
      criterion: Motion Effects panel opened.
    - action: Set 'Sticky' to 'Top'.
      criterion: Element sticks to the top of the viewport during scroll.
    - action: Enable 'Stay In Column'.
      criterion: Sticky behavior releases once the parent container ends.
  outputs: [Sticky video viewport lock]

- id: ku-005
  type: procedure
  name: GSAP Scroll Script Injection
  source: src-01, "02:46 - 03:10"
  confidence: high
  goal: Inject GSAP and ScrollTrigger libraries to tie scroll offset to video playback.
  steps:
    - action: Drag HTML Widget below the video inside the container.
      criterion: HTML widget present in structure.
    - action: Paste GSAP + ScrollTrigger script snippet.
      criterion: Script binds window scroll to video currentTime without errors.
  outputs: [Active scroll-driven animation script]

- id: ku-006
  type: procedure
  name: Z-Index Content Stacking
  source: src-01, "03:58 - 04:37"
  confidence: high
  goal: Ensure subsequent page sections scroll over or under the video properly without being obscured.
  steps:
    - action: Set Video Container Z-Index to 0.
      criterion: Video stays in base stacking context.
    - action: Set Following Content Container Z-Index to 1.
      criterion: Subsequent content scrolls over top of the video container.
  outputs: [Correct layered visual hierarchy]

- id: ku-007
  type: constraint
  name: Video Framerate & Format Constraint
  source: src-01, "01:10 - 01:15, 04:40 - 05:18"
  confidence: high
  rule: Video must be in .mp4 format and strictly encoded at 30 frames per second (fps) to avoid stuttering/lag during scrubbing.
  scope: Pre-upload asset preparation.
  enforced_by: Online video converter tool (Video2Edit or similar).
```

---

# Compiled Skill Package

Below is the complete skill package generated according to the skill structure and formatting guidelines.

```
elementor-scroll-video/
├── SKILL.md
└── references/
    ├── video-optimization.md
    └── gsap-snippet.md
```

---

### `elementor-scroll-video/SKILL.md`

```markdown
---
name: elementor-scroll-video
description: |
  Build interactive, scroll-triggered video scrub animations in WordPress using Elementor and GSAP.
  Use when implementing dynamic scroll-controlled video playback, interactive product reveals,
  or zero-plugin kinetic video storytelling.
  Triggers: scroll video elementor, video scrub on scroll, gsap scrolltrigger video, elementor video animation.
---

# Elementor Scroll-Triggered Video Animation

Implement high-performance, scroll-controlled video scrubbing inside Elementor (Free or Pro) using Flexbox Containers and GSAP ScrollTrigger without external paid plugins.

## Ground Rules

1. **Asset Prep First**: The source video must be an `.mp4` file encoded at exactly 30 frames per second (FPS) to prevent scrub stutter.
2. **Strict Viewport Pinning**: The video widget must use Elementor's sticky motion effect bounded by `Stay In Column`.
3. **Layer Hierarchy**: Explicitly configure Z-Index values across sections to prevent subsequent layout blocks from hiding behind the sticky canvas.

---

## Phase 1: Video Asset Preparation

Ensure the video asset meets playback and performance standards before uploading.

1. Verify the format is `.mp4`.
2. Ensure the frame rate is locked at **30 FPS**.
   - If frame rate is variable or higher than 30 FPS, convert the video using an encoding tool before uploading.
   - For specific conversion settings, see [video-optimization.md](references/video-optimization.md).
3. Upload the prepared video to the WordPress Media Library.

### Completion Gate
- [ ] Asset is `.mp4`
- [ ] Asset is encoded at 30 FPS
- [ ] Asset is accessible in WordPress Media Library

---

## Phase 2: Container & Layout Architecture

Construct the scroll track container that defines how long the user scrolls to complete the video playback.

1. Add a new **Flexbox Container**.
2. Configure container layout settings:
   - **Content Width**: `Full Width` (or `Boxed` with `Width: 100%`)
   - **Min Height**: `500 VH` (adjust scroll distance: higher VH = slower scrub, lower VH = faster scrub)
3. Remove layout spacing:
   - Under **Advanced > Layout**, unlink and set **Padding** to `0px` on all sides.
   - *(Optional header overlay)*: Set **Margin Top** to `-120px` (or header height) and set background to transparent.

### Completion Gate
- [ ] Container width is `100%`
- [ ] Container min-height is set to `500 VH`
- [ ] Container padding is zeroed out

---

## Phase 3: Video Element Configuration

Add and style the self-hosted video element.

1. Drag an Elementor **Video Widget** into the top of the container.
2. Under **Content > Video**:
   - **Source**: Select `Self Hosted`.
   - **Choose Video File**: Select the uploaded 30 FPS `.mp4` file.
3. Under **Video Options**:
   - Set **Mute** to `YES` (Required for programmatic scrubbing).
   - Set **Autoplay** to `NO`.
   - Set **Player Controls** to `HIDE`.
   - Set **Download Button** to `HIDE`.
4. Configure Sticky Viewport Behavior:
   - Navigate to **Advanced > Motion Effects**.
   - Set **Sticky** to `Top`.
   - Toggle **Stay in Column** to `YES`.

### Completion Gate
- [ ] Video source is set to Self-Hosted MP4
- [ ] Mute is active; Controls and Autoplay are deactivated
- [ ] Sticky is set to `Top` with `Stay in Column` enabled

---

## Phase 4: Script Injection & Z-Index Layering

Inject the GSAP ScrollTrigger script and configure viewport layering.

1. Drag an **HTML Widget** directly beneath the Video Widget inside the same container.
2. Insert the standard GSAP ScrollTrigger video scrub script.
   - For the exact script snippet, see [gsap-snippet.md](references/gsap-snippet.md).
3. Set Layer Stacking Contexts (**Advanced > Layout > Z-Index**):
   - **Video Track Container**: Set **Z-Index** to `0`.
   - **Subsequent Content Container(s)**: Set **Z-Index** to `1` (or higher).
4. Save/Update the page and test live in a separate browser tab.

### Completion Gate
- [ ] HTML widget contains complete GSAP script
- [ ] Video Container has Z-Index `0`
- [ ] Subsequent page sections have Z-Index `1`+
- [ ] Video scrubs forward on scroll down and reverses on scroll up smoothly
```

---

### `elementor-scroll-video/references/video-optimization.md`

```markdown
# Video Optimization Reference

## Framerate Calibration
Scroll-triggered video playback calculates `video.currentTime` relative to the window scroll percentage. If a video is encoded with inconsistent keyframes, high bitrates, or frame rates above 30 FPS, the browser decoder will drop frames, causing visible stutter.

### Conversion Settings
When converting files via tools like Video2Edit, Handbrake, or FFmpeg:
- **Format**: MP4 (`H.264 / AAC`)
- **Frame Rate**: `30 fps` (Constant Frame Rate preferred)
- **Audio**: Muted / Removed (audio tracks increase file size without providing utility)
- **Resolution**: Match standard display targets (1080p / 1920x1080 for hero desktop).
```

---

### `elementor-scroll-video/references/gsap-snippet.md`

```markdown
# GSAP ScrollTrigger Injection Snippet

Paste this snippet into the Elementor **HTML Widget** placed inside the video container:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
jQuery(document).ready(function($) {
  gsap.registerPlugin(ScrollTrigger);

  const video = document.querySelector(".elementor-video");

  if (video) {
    // Ensure video metadata is loaded before binding
    video.onloadedmetadata = function() {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: video.closest('.e-con'), // Targets the parent Elementor flex container
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

      tl.fromTo(video, { currentTime: 0 }, { currentTime: video.duration || 1, ease: "none" });
    };
  }
});
</script>
```
```

---

### Phase 5: Validation & Verification

1. **Source Fidelity Check**:
   - Container sizing (100% width, 500vh height) encoded in Phase 2.
   - Video settings (Mute, hide controls, disable autoplay) encoded in Phase 3.
   - Motion effects (Sticky Top + Stay in column) encoded in Phase 3.
   - Script placement & GSAP code captured in Phase 4 / `gsap-snippet.md`.
   - Z-Index layering fix (Container 0, Content 1) captured in Phase 4.
   - 30 FPS constraint captured in Phase 1 / `video-optimization.md`.
2. **Operational Test**:
   - *Test Scenario*: A user adds a 4K 60fps video directly. The skill catches this at Phase 1 via `video-optimization.md` and enforces 30fps conversion before container setup.
   - *Test Scenario*: Subsequent page content hides underneath the sticky video. The skill catches this in Phase 4 via explicit Z-index layer mapping.
