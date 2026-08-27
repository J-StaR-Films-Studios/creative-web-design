# Master Creative Web Development Terminology & Conceptual Matrix

Canonical glossary defining the core vocabulary, mathematical representations, and operational concepts for Awwwards/FWA-tier creative web engineering. Use standard terms and avoid colloquial or ambiguous anti-synonyms.

---

## 1. Kinetic Typography & DOM Architecture

### Character Split Granularity
- **Definition**: The structural decomposition of rendered DOM text into individual inline-block container elements (`<span>`) targeting characters (`chars`), words (`words`), or lines (`lines`).
- **Operational Rule**: Split only the DOM level being animated. Pair character splitting with `smartWrap: true` to prevent line-break hyphenation corruption.
- **_Avoid_**: *text chop, letter slicing, DOM exploding, text shredding*.

### Text Masking (Clip Bounds)
- **Definition**: An overflow-hidden bounding box wrapper enclosing split typography lines or characters, allowing content to slide in from beyond visible bounds without layout shifting.
- **Operational Rule**: Apply `overflow: hidden` on the parent line wrapper while applying `transform: translateY(100%)` to `0%` on inner split text.
- **_Avoid_**: *text hiding, box cropping, secret text, peekaboo text*.

### 3D Perspective Space
- **Definition**: The CSS 3D coordinate context established on a container using `perspective` and `transform-style: preserve-3d`, allowing child elements to translate along the Z-axis (`translateZ`).
- **Operational Rule**: Define `perspective: 1000px` on the viewport wrapper and apply `transform: translateZ(Npx)` on children to create true spatial depth.
- **_Avoid_**: *fake 3D, CSS trick 3D, pseudo depth*.

---

## 2. Motion, Scroll & Orchestration

### Virtual Playhead Synchronization
- **Definition**: The unified clock mechanism where a smooth scroll engine (e.g., Lenis) forwards its interpolated scroll position directly to GSAP's ticker, driving all ScrollTrigger timelines in absolute sync.
- **Operational Rule**: Call `lenis.on('scroll', ScrollTrigger.update)` and register `gsap.ticker.add((time) => lenis.raf(time * 1000))` while disabling GSAP lag smoothing (`gsap.ticker.lagSmoothing(0)`).
- **_Avoid_**: *scroll listening, scroll hijack loop, window scroll event binding, custom lerp scroll*.

### Pin Buffer (Scroll Distance Stride)
- **Definition**: The fixed viewport duration during which a container remains pinned (`position: fixed` under the hood) while virtual scroll progress traverses from `0.0` to `1.0`.
- **Operational Rule**: Define pinning using dynamic functions e.g. `end: () => "+=" + window.innerHeight * 5` to ensure accurate responsive recalculation on resize.
- **_Avoid_**: *sticky height hack, giant scroll page, tall blank div*.

### Normalized Scrub Progress
- **Definition**: A continuous scalar value $\in [0.0, 1.0]$ representing the exact fractional completion of a pinned or tracked scroll sequence.
- **Operational Rule**: Map scalar progress directly to timeline progress or shader uniforms via `timeline.progress(p)` or `material.uniforms.u_progress.value = p`.
- **_Avoid_**: *scroll percentage, raw scroll pixels, scroll step*.

### Linear Interpolation (Lerp)
- **Definition**: The mathematical blending of a current value toward a target value by a fractional factor $t \in [0.0, 1.0]$ per frame: $\text{val} = \text{val} + (\text{target} - \text{val}) \cdot t$.
- **Operational Rule**: Use Lerp for smooth cursor trails, camera easing, and inertia dampening.
- **_Avoid_**: *smooth glide, tween lag, soft delay*.

---

## 3. Canvas 2D & Particle Physics

### Raw Pixel Buffer (ImageData)
- **Definition**: A 1D `Uint8ClampedArray` containing linear sequential $R, G, B, A$ byte values ($0\text{--}255$) extracted from a 2D rendering context via `ctx.getImageData(0, 0, width, height)`.
- **Operational Rule**: Calculate the 1D array index for coordinate $(x, y)$ using the stride formula: $\text{index} = (y \cdot 4 \cdot \text{width}) + (x \cdot 4)$.
- **_Avoid_**: *canvas array, pixel list, bitmap dump*.

### Perceived Photometric Luminance
- **Definition**: The weighted brightness of a pixel based on human eye spectral sensitivity (ITU-R BT.601 standard):
  $$\text{Luminance} = \frac{\sqrt{0.299 \cdot R^2 + 0.587 \cdot G^2 + 0.114 \cdot B^2}}{100}$$
- **Operational Rule**: Use perceived luminance to dictate particle size, speed, opacity, or elevation rather than raw unweighted RGB averages.
- **_Avoid_**: *color brightness, grayscale average, pixel lightness*.

### Anchor Memory (Origin Rest State)
- **Definition**: The immutable initial coordinates (`baseX`, `baseY`) stored inside each particle instance, representing its resting home position.
- **Operational Rule**: Store `baseX = x` and `baseY = y` at generation time; apply elastic spring damping toward these coordinates whenever external force fields dissipate.
- **_Avoid_**: *home point, starting spot, original coordinate*.

### Sand / Dust Text Decomposition
- **Definition**: The visual conversion of rasterized typographic glyphs into thousands of discrete physics particles that scatter under cursor repulsion and reconstruct via anchor memory springs.
- **Operational Rule**: Rasterize text to an offscreen canvas buffer, sample alpha values ($A > 128$) at regular stride intervals, instantiate anchored particles, clear the canvas, and execute the physics loop.
- **_Avoid_**: *text shatter, font dissolve, letter explosion*.

### Constellation Network (Pairwise Proximity)
- **Definition**: An interactive visual graph where dynamic lines are drawn between particles whose Euclidean distance falls below a defined threshold $r_{max}$.
- **Operational Rule**: Use upper-triangular loop iteration ($j = i + 1$) to calculate distances without duplicate comparisons, scaling line opacity as $1.0 - (d / r_{max})$.
- **_Avoid_**: *spiderweb lines, dot connector, particle mesh lines*.

---

## 4. Three.js & WebGL Scene Graphs

### Viewport-to-Scene Coordinate Projection
- **Definition**: The mathematical mapping of 2D screen pixels / pointer coordinates to 3D world coordinates on a specified projection plane using a camera raycaster or frustum bounding calculations.
- **Operational Rule**: Match camera FOV and Z-distance to screen dimensions so that 1 Three.js unit equals 1 CSS pixel on plane $Z = 0$: $\text{fov} = 2 \cdot \arctan\left(\frac{\text{height}}{2 \cdot \text{dist}}\right) \cdot \left(\frac{180}{\pi}\right)$.
- **_Avoid_**: *3D screen guess, camera eyeball, manual mesh placing*.

### DRACO / Meshopt Geometry Compression
- **Definition**: Open-source spatial compression libraries that compress 3D mesh geometry (vertices, normals, UVs, weights) by 70–90% for rapid over-the-network loading.
- **Operational Rule**: Always process production `.glb` assets through Draco or Meshopt compression and instantiate `DRACOLoader` with web worker decoding.
- **_Avoid_**: *raw 3D file, uncompressed OBJ, heavy GLTF*.

### Instanced Mesh (GPU Draw Call Batching)
- **Definition**: A single WebGL draw call rendering $N$ copies of identical geometry with unique transformation matrices and color attributes stored in GPU buffer attributes.
- **Operational Rule**: Use `THREE.InstancedMesh` instead of creating multiple individual `THREE.Mesh` instances whenever rendering duplicate objects (particles, geometric cards, foliage).
- **_Avoid_**: *mesh loop, clone mesh group, multi-object draw*.

---

## 5. GPU Shaders & GLSL Math

### Vertex Displacement
- **Definition**: The geometric manipulation of 3D vertex positions in the vertex shader stage prior to rasterization, altering model or plane topology dynamically via uniforms or procedural noise.
- **Operational Rule**: Modify `gl_Position` using `position + normal * displacement` inside the vertex shader.
- **_Avoid_**: *mesh warping, CPU geometry deformation, vertex morphing*.

### Normalized UV Coordinates
- **Definition**: The 2D texture coordinate space $\in [0.0, 1.0]^2$ mapped across a polygon surface, where $(0,0)$ represents bottom-left (or top-left depending on convention) and $(1,1)$ represents top-right.
- **Operational Rule**: Correct UV aspect ratios in shaders to prevent texture stretching: `vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);`.
- **_Avoid_**: *texture XY, pixel coordinates, image map coords*.

### Fractal Brownian Motion (FBM) Noise
- **Definition**: A multi-octave procedural noise algorithm that sums successive iterations of noise with increasing frequencies (lacunarity) and decreasing amplitudes (gain/persistence):
  $$\text{FBM}(p) = \sum_{i=0}^{N-1} \text{amplitude}_i \cdot \text{noise}(p \cdot \text{frequency}_i)$$
- **Operational Rule**: Use 3 to 6 octaves of FBM for organic smoke, fluid ripples, terrain displacement, and turbulence in GLSL.
- **_Avoid_**: *random fuzz, TV static, jitter texture*.

### Chromatic Aberration (RGB Channel Shift)
- **Definition**: A post-processing or fragment shader effect that separates Red, Green, and Blue texture samples by varying directional UV offsets proportional to velocity or radial distance.
- **Operational Rule**: Sample texture: `vec4(texture2D(t, uv + offset).r, texture2D(t, uv).g, texture2D(t, uv - offset).b, 1.0)`.
- **_Avoid_**: *color glitch, 3D glasses effect, color blur*.

---

## 6. Hybrid 3D Cinematics & Pipelines

### Pre-Rendered Frame Scrubbing
- **Definition**: The playback of high-fidelity, offline-rendered image sequences (CGI from Blender / Cinema 4D) painted sequentially to a 2D canvas locked to scroll progress, achieving photorealistic lighting with zero GPU runtime cost.
- **Operational Rule**: Never scrub native HTML5 `<video>` tags. Preload numbered JPG/WebP frames into an in-memory `Image[]` buffer and paint via `ctx.drawImage()`.
- **_Avoid_**: *video scrubbing, MP4 scroll animation, video scroll bar*.

### Texture & Lightmap Baking
- **Definition**: The process of pre-computing complex raytraced lighting, ambient occlusion, global illumination, and shadow maps inside 3D software (Blender) and writing them directly into diffuse UV texture maps.
- **Operational Rule**: Bake lighting into textures in Blender so real-time WebGL models can use performant `MeshBasicMaterial` without requiring expensive dynamic shadows.
- **_Avoid_**: *burnt shadows, baked graphics, hardcoded light*.

### Hybrid Overlay Composition
- **Definition**: The visual layering of pre-rendered background canvas sequences, interactive real-time WebGL models, and 3D perspective DOM typography into a single seamless experience (e.g. ORYZO AI / Apple).
- **Operational Rule**: Align the virtual camera FOV and clipping planes of the real-time 3D scene with the pre-rendered video camera, stacking DOM overlays at matching depth layers.
- **_Avoid_**: *mixed graphics, video background with text, stacked layout*.

---

## 7. Performance & Memory Management

### Device Pixel Ratio (DPR) Clamping
- **Definition**: Restricting the rendering resolution backing scale on High-DPI / Retina displays to a safe ceiling (maximum 2.0) to prevent exponential GPU fill-rate exhaustion on 3x screens.
- **Operational Rule**: Always initialize renderers and canvas scale with: `Math.min(window.devicePixelRatio, 2)`.
- **_Avoid_**: *window.devicePixelRatio unbounded, full native retina scale, retina unlimited*.

### Zero-Allocation Render Loop
- **Definition**: The strict architectural practice of avoiding object instantiations (`new THREE.Vector3()`, `new Array()`, string concatenations) inside `requestAnimationFrame` or `useFrame` loops to eliminate Garbage Collection (GC) frame drops.
- **Operational Rule**: Pre-allocate scratch vectors, matrices, and reusable objects in file or component scope. Mutate existing properties in-place.
- **_Avoid_**: *allocating in tick, new vector in loop, inline object literal in RAF*.

### Context & GPU Resource Disposal
- **Definition**: The explicit deallocation of GPU textures, buffer geometries, materials, shader programs, and event listeners when components unmount or pages transition.
- **Operational Rule**: Recursively traverse Three.js objects calling `geometry.dispose()`, `material.dispose()`, `texture.dispose()`, and remove RAF tickers.
- **_Avoid_**: *garbage collector reliance, unmount drop, DOM wipe*.
