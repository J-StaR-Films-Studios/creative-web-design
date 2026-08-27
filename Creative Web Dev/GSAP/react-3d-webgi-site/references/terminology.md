# Terminology

**WebGi SDK**:
A high-performance Three.js framework optimized for photorealistic WebGL rendering, tone mapping, and automated post-processing pipelines.
_Avoid_: Three.js canvas helper, WebGL graphic library

**GSAP ScrollTrigger**:
The GreenSock animation plugin that links timeline progress directly to browser viewport scroll depth and element trigger thresholds.
_Avoid_: scroll listener, scroll watcher

**Camera Target Vector**:
The 3D point $(X, Y, Z)$ in world space at which the WebGL camera is centered and looking toward.
_Avoid_: camera focus, look-at coordinate

**Camera Position Vector**:
The physical location $(X, Y, Z)$ of the camera lens relative to the origin of the 3D scene.
_Avoid_: camera distance, viewpoint coordinate

**Draco Compression**:
An open-source library for compressing and decompressing 3D geometric meshes and point clouds to drastically reduce GLB payload sizes.
_Avoid_: 3D zip, model minifier

**Tone Mapping**:
The algorithmic mapping of high-dynamic-range (HDR) color values to low-dynamic-range display color space, including background alpha clipping.
_Avoid_: color grading, screen filter
