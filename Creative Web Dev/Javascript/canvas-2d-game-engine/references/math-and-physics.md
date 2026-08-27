# Math & Physics Reference

Mathematical formulas and physics calculations used in 2D canvas games.

## 1. Angle Between Two Coordinates

To calculate the directional angle $\theta$ in radians from source point $(x_1, y_1)$ to destination point $(x_2, y_2)$:

$$\theta = \text{atan2}(y_2 - y_1, x_2 - x_1)$$

```javascript
const angle = Math.atan2(targetY - sourceY, targetX - sourceX)
```

## 2. Resolving Cartesian Velocities

To project an angle $\theta$ and scalar speed $s$ into directional velocity components:

$$v_x = \cos(\theta) \cdot s$$
$$v_y = \sin(\theta) \cdot s$$

```javascript
const velocity = {
  x: Math.cos(angle) * speed,
  y: Math.sin(angle) * speed
}
```

## 3. Euclidean Distance & Circle Collision

The distance $d$ between two circular bodies $A$ and $B$:

$$d = \sqrt{(A_x - B_x)^2 + (A_y - B_y)^2}$$

Using `Math.hypot`:

```javascript
const dist = Math.hypot(A.x - B.x, A.y - B.y)
const isColliding = (dist - A.radius - B.radius) < 1
```

## 4. Bipolar Particle Dispersion & Drag (Friction)

Randomized velocity with equal bidirectional dispersion and exponential deceleration:

```javascript
// Initial impulse
const velocity = {
  x: (Math.random() - 0.5) * (Math.random() * maxPower),
  y: (Math.random() - 0.5) * (Math.random() * maxPower)
}

// Frame update with drag
const friction = 0.99
velocity.x *= friction
velocity.y *= friction
```

## 5. Viewport Perimeter Spawning Logic

To distribute entity spawn points uniformly around the four outer edges of a screen:

```javascript
let x, y
const radius = Math.random() * (30 - 4) + 4

if (Math.random() < 0.5) {
  // Horizontal bounds (Left or Right)
  x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
  y = Math.random() * canvas.height
} else {
  // Vertical bounds (Top or Bottom)
  x = Math.random() * canvas.width
  y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
}
```
