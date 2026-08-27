# Terminology

**SplitType**:
A JavaScript library that parses text within a DOM element and wraps lines, words, and individual characters into separate `<div>` or `<span>` nodes for animation targeting.
_Avoid_: text parser, string slicer

**CSS Clip-Path**:
A CSS property that sets a specific clipping region (such as a polygon or rectangle). Visual pixels falling outside this region are hidden from the viewport.
_Avoid_: overflow cutter, crop wrapper

**GSAP (GreenSock Animation Platform)**:
A high-performance JavaScript animation suite used to manipulate DOM properties, transforms, and timing sequences.
_Avoid_: CSS timer, DOM script animator

**Stagger**:
A timing parameter in multi-target tweens that offsets the starting point of each subsequent element in the selection array.
_Avoid_: loop delay, frame offset

**Line-Height Calibration**:
The practice of reducing font line-height to match glyph cap-height, preventing empty buffer zones within CSS clip masks.
_Avoid_: vertical padding hack
