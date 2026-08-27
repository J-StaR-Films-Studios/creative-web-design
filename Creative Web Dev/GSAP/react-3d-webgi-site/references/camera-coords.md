# 3D Camera Coordinate Matrix (iPhone 14 Pro Spec)

Reference camera position and target vectors extracted from WebGi Editor for Apple promotional layout.

## Desktop Coordinate System

| View / Section | Camera Position $(X, Y, Z)$ | Camera Target $(X, Y, Z)$ | Scrub / Duration |
|---|---|---|---|
| **Hero (Initial)** | `(1.56, 5.0, 0.01)` | `(-0.55, 0.32, 0.0)` | Initial Load |
| **Sound Section** | `(-3.38, -10.74, -5.93)` | `(1.52, 0.77, -1.08)` | `scrub: 2` |
| **Display Section** | `(1.56, 5.0, 0.01)` | `(-0.55, 0.32, 0.0)` | `scrub: 2` |
| **Interactive Preview** | `(13.04, -2.01, 2.29)` | `(0.11, 0.0, 0.0)` | `duration: 2` (Smooth tween) |

## Mobile & Tablet Responsive Coordinate System

| View / Section | Camera Position $(X, Y, Z)$ | Camera Target $(X, Y, Z)$ | Notes |
|---|---|---|---|
| **Hero (Initial)** | `(-16.7, 1.17, 11.7)` | `(0.0, 1.37, 0.0)` | Compasses narrow portrait aspect |
| **Sound Section** | `(-7.0, -12.2, -6.0)` | `(0.7, 1.9, 0.7)` | Shifted right to preserve text clearance |
| **Display Section** | `(9.36, 10.95, 0.09)` | `(-1.62, 0.02, -0.06)` | Scaled for vertical display framing |
| **Interactive Preview** | `(13.04, -2.01, 2.29)` | `(0.11, 0.0, 0.0)` | Centered for touch-drag orbit |
