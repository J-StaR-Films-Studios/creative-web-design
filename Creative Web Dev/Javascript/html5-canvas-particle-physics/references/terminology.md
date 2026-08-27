# Terminology

**2D Rendering Context (`CanvasRenderingContext2D`)**:
The drawing interface on an HTML5 `<canvas>` element providing hardware-accelerated 2D rasterization methods.
_Avoid_: canvas DOM node, webgl engine

**Uint8ClampedArray**:
A typed array storing 8-bit unsigned integers clamped strictly to the range 0–255, forming the underlying representation of canvas pixel buffers.
_Avoid_: standard JavaScript array, pixel matrix

**Linear Stride**:
The multiplication factor (4 bytes: R, G, B, A) required to map 2D spatial pixel coordinates $(x, y)$ to a 1D flattened array index: $(y \times 4 \times W) + (x \times 4)$.
_Avoid_: 2D matrix indexing

**Perceived Relative Luminance**:
The non-linear brightness of a color calculated using human eye spectral weighting ($0.299R^2 + 0.587G^2 + 0.114B^2$), accounting for higher retinal sensitivity to green light.
_Avoid_: RGB average, simple grayscale

**CORS Tainting**:
A browser security state triggered when loading external or non-server assets onto a canvas, permanently disabling `getImageData()` and `toDataURL()`.
_Avoid_: canvas crash, image fetch error

**Base Anchor (`baseX, baseY`)**:
The immutable origin coordinates assigned to a particle during initialization, used as an elastic spring target after displacement.
_Avoid_: home point, spawn coordinate

**Constellation Network**:
A visual particle graph where lines are drawn dynamically between any two particles whose Euclidean distance is less than a predefined threshold.
_Avoid_: node mesh, spider graph
