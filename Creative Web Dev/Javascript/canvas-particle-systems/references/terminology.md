# Terminology

**Canvas Rendering Context 2D (`CanvasRenderingContext2D`)**:
The drawing state machine object returned by `canvas.getContext('2d')` that provides methods to render shapes, text, images, and manipulate bitmap pixels.
_Avoid_: canvas screen, 2D renderer engine

**Drawing Buffer Dimensions**:
The internal pixel resolution of the canvas surface specified by `canvas.width` and `canvas.height`.
_Avoid_: CSS width, element layout size

**Animation Loop**:
A recursive loop synchronizing game or rendering state updates with the browser screen refresh rate via `requestAnimationFrame`.
_Avoid_: setInterval loop, tick timeout

**Velocity Vector**:
A 2D vector defined by components `speedX` ($\Delta x$) and `speedY` ($\Delta y$) applied to a particle position per animation frame.
_Avoid_: direction speed, movement momentum

**Pythagorean Euclidean Distance**:
The straight-line metric between two 2D points calculated as $\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$.
_Avoid_: point gap, spatial delta

**HSL Color Model**:
A cylindrical color coordinate system specifying Hue (degrees 0–360), Saturation (percentage), and Lightness (percentage).
_Avoid_: RGB color wheel, color gradient code

**Fading Trail Effect**:
A rendering technique that replaces full buffer clearing (`clearRect`) with a low-opacity rectangular overlay (`fillRect` with alpha $0.02 - 0.1$), causing historical frames to fade exponentially.
_Avoid_: motion blur filter, ghosting bug
