# Video Optimization Reference

## Framerate Calibration
Scroll-triggered video playback calculates `video.currentTime` relative to the window scroll percentage. If a video is encoded with inconsistent keyframes, high bitrates, or frame rates above 30 FPS, the browser decoder will drop frames, causing visible stutter.

### Conversion Settings
When converting files via tools like Video2Edit, Handbrake, or FFmpeg:
- **Format**: MP4 (`H.264 / AAC`)
- **Frame Rate**: `30 fps` (Constant Frame Rate preferred)
- **Audio**: Muted / Removed (audio tracks increase file size without providing utility)
- **Resolution**: Match standard display targets (1080p / 1920x1080 for hero desktop).
