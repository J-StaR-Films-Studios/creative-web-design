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
