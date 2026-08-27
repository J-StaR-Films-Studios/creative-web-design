# Terminology

**Outer Viewport Container**:
The top-level flexbox container locking the vertical scroll frame to 100vh and masking overflowing slide content.
_Avoid_: wrapper div, scroll outer frame, slider window

**Track Container**:
The immediate child flexbox container set to a horizontal row layout (`wrap: nowrap`, `gap: 0`) holding all consecutive slides.
_Avoid_: carousel track, slide list, row wrapper

**Slide Section Container**:
An individual content panel placed directly within the track container, configured with flexible width growth and viewport height.
_Avoid_: slide card, slider item, sub-section

**Sub-Pixel Hairline Seam**:
A 1px background gap artifact rendered between adjacent containers due to floating-point display calculations in web browsers.
_Avoid_: rendering bug, border glitch

**Driver Snippet**:
The lightweight HTML/CSS/JS block that binds page vertical scroll offset to track horizontal CSS transform properties without external library dependencies.
_Avoid_: slider plugin, scroll addon
```

***
