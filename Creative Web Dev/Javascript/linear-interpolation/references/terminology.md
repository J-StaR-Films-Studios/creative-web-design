# Terminology

**Linear Interpolation (Lerp)**:
The mathematical calculation of an intermediate value between two reference points along a linear trajectory using a normalized factor.
_Avoid_: tweening (too generic), linear regression (different mathematical concept)

**Interpolation Factor ($t$)**:
The normalized scalar value representing fractional progress between start ($t=0.0$) and end ($t=1.0$).
_Avoid_: step count, raw delta

**Convex Combination**:
A linear combination of points where all coefficients are non-negative and sum to 1 (specifically $(1 - t)$ and $t$).
_Avoid_: weighted average without normalization
