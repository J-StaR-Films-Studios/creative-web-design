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
