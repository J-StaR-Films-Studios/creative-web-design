# Pixel & Physics Mathematics

## 1. 1D Flattened Buffer Indexing

A canvas of dimensions $W \times H$ produces an `ImageData.data` array of length $W \times H \times 4$.

```
Pixel (x, y) Buffer Layout:
[R, G, B, A,  R, G, B, A,  R, G, B, A, ...]
 ^           ^           ^
 (0,0)       (1,0)       (2,0)
```

$$\text{Index}_{\text{Red}}(x, y) = (y \times 4 \times W) + (x \times 4)$$
$$\text{Index}_{\text{Green}}(x, y) = \text{Index}_{\text{Red}} + 1$$
$$\text{Index}_{\text{Blue}}(x, y) = \text{Index}_{\text{Red}} + 2$$
$$\text{Index}_{\text{Alpha}}(x, y) = \text{Index}_{\text{Red}} + 3$$

---

## 2. Luminance & Grayscale Conversion Formulas

### Simple Arithmetic Mean (Flat Average)
$$\text{Luminance}_{\text{flat}} = \frac{R + G + B}{3}$$

### Photometric Relative Brightness (Human Perception)
$$\text{Luminance}_{\text{weighted}} = \frac{\sqrt{0.299 \cdot R^2 + 0.587 \cdot G^2 + 0.114 \cdot B^2}}{100}$$

---

## 3. Physics Vector & Distance Formulas

### Euclidean Distance
$$\text{dx} = x_{\text{target}} - x_{\text{particle}}$$
$$\text{dy} = y_{\text{target}} - y_{\text{particle}}$$
$$\text{Distance} = \sqrt{\text{dx}^2 + \text{dy}^2}$$

### Radial Force & Repulsion Displacement
$$\text{ForceScalar} = \frac{\text{Radius}_{\text{max}} - \text{Distance}}{\text{Radius}_{\text{max}}}$$
$$\text{UnitVector}_x = \frac{\text{dx}}{\text{Distance}}, \quad \text{UnitVector}_y = \frac{\text{dy}}{\text{Distance}}$$
$$\Delta x = -\text{UnitVector}_x \cdot \text{ForceScalar} \cdot \text{Density}$$
$$\Delta y = -\text{UnitVector}_y \cdot \text{ForceScalar} \cdot \text{Density}$$

### Spring-Back Return Easing
$$x_{t+1} = x_t - \frac{x_t - x_{\text{base}}}{\text{dampingFactor}}$$
$$y_{t+1} = y_t - \frac{y_t - y_{\text{base}}}{\text{dampingFactor}}$$
