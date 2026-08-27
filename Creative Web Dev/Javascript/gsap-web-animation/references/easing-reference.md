# GSAP Easing Reference

Access the GreenSock Ease Visualizer at `greensock.com/ease-visualizer` to preview and test mathematical curves.

## Standard Eases & Curves

| Ease Name | Behavior & Feel | Typical Use Case |
|---|---|---|
| `none` / `linear` | Constant speed from start to finish | Continuous rotations, background pans, marquee tickers |
| `power1` (`quad`) | Gentle acceleration / deceleration | Subtle UI fades, soft micro-interactions |
| `power2` (`cubic`) | Moderate, natural motion curve | Standard UI transitions, cards, modals |
| `power3` (`quart`) | Strong acceleration into smooth deceleration | Hero entrances, bold sliding menus |
| `power4` (`quint`) | Aggressive start with dramatic deceleration | High-impact reveals, sports/gaming UI |
| `expo` | Extreme exponential acceleration/deceleration | Fast snappiness, heavy component entries |
| `sine` | Very soft sinusoidal curve | Breathing animations, floating elements |

## Specialty Physics Eases

| Ease Name | Parameters / Config | Visual Effect |
|---|---|---|
| `back` | `back.out(overshoot)` (e.g. `back.out(1.7)`) | Overshoots destination before settling |
| `elastic` | `elastic.out(amplitude, period)` | Bouncy spring-like elasticity |
| `bounce` | `bounce.out`, `bounce.in`, `bounce.inOut` | Realistic gravity bouncing on collision |
| `slow` | `slow(linearRatio, power, yoyoMode)` | Slows in the middle, speeds at edges |
| `steps` | `steps(number)` (e.g. `steps(12)`) | Stepped quantization (pixel art, sprite sheets) |

## Direction Suffixes

- **`.out`** (Default): Fast start, slows at the end (best for UI entrances).
- **`.in`**: Slow start, accelerates at the end (best for UI exits).
- **`.inOut`**: Slow start, fast middle, slow end (best for loops and reversible state changes).
