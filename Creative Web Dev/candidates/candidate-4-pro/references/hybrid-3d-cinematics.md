# Hybrid 3D Cinematics

Integrating pre-rendered Blender sequences with real-time DOM/WebGL.

## 1. Video Scrubbing Architecture
Bind a `<video>` element's `currentTime` to scroll progress.

```javascript
const video = document.querySelector('.hero-video');
video.pause();

ScrollTrigger.create({
  trigger: ".video-container",
  start: "top top",
  end: "+=3000", // 3000px of scrolling
  pin: true,
  scrub: true,
  onUpdate: (self) => {
    // Map progress (0-1) to video duration
    if (video.duration) {
      video.currentTime = self.progress * video.duration;
    }
  }
});
```

## 2. Image Sequence Fallback (Mobile)
Mobile video decoding can be slow/choppy on scrub. Use an image sequence on Canvas.
```javascript
const canvas = document.getElementById('sequence');
const ctx = canvas.getContext('2d');
const images = []; // Array of preloaded Image objects
const frameCount = 120;

const playhead = { frame: 0 };

gsap.to(playhead, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 0.5
  },
  onUpdate: () => {
    ctx.drawImage(images[playhead.frame], 0, 0);
  }
});
```
