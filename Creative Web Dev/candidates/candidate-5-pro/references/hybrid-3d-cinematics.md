# Hybrid 3D Cinematics

Orchestrate the ORYZO/Apple paradigm: Syncing heavy pre-rendered 3D video sequences with interactive real-time scrolling.

## 1. Frame-by-Frame Scrubbing Logic

Map ScrollTrigger's playhead directly to an HTML5 Video `currentTime`. Note: Video encoding MUST have a high keyframe frequency (preferably every frame `keyint=1`) to allow reverse scrubbing without lag.

```javascript
const video = document.querySelector('.cinematic-video');

// Wait for metadata so video.duration is available
video.addEventListener('loadedmetadata', () => {
  gsap.to(video, {
    currentTime: video.duration, // Target end of video
    ease: 'none',
    scrollTrigger: {
      trigger: '.video-container',
      start: 'top top',
      end: '+=400%', // 4 viewport heights of scrolling
      scrub: true,
      pin: true,
    }
  });
});
```

## 2. Canvas Image Sequence Fallback

Since mobile devices often struggle with high-bitrate video scrubbing, fallback to mapping scroll progress to an Array of preloaded Canvas Image frames.

```javascript
const canvas = document.getElementById("seq-canvas");
const context = canvas.getContext("2d");

const frameCount = 120;
const currentFrame = index => (
  `/assets/sequence/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
);

const images = [];
const scene = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

gsap.to(scene, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: ".sequence-container",
    scrub: 0.5,
    pin: true,
  },
  onUpdate: () => renderFrame()
});

function renderFrame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[scene.frame], 0, 0);
}
```

## 3. Z-Index Overlay Synchronization

To combine real-time WebGL UI over baked video, place a transparent R3F canvas absolutely positioned over the video element. Match the Three.js camera FOV and focal length to the Blender export camera settings exactly to achieve perspective locking.
