# Terminology & CSS Specifications

**Group Wrapper**:
The direct child of the marquee container that holds one full set of items and undergoes the `@keyframes` transform.
_Avoid_: inner slider, tape track, scroll container

**Flex Shorthand (`flex: 0 0 <basis>`)**:
A combination rule specifying `flex-grow: 0` (do not expand), `flex-shrink: 0` (do not compress), and `flex-basis: <size>` (intrinsic reference width).
_Avoid_: static width, absolute box

**Trailing Gap Compensation**:
The technique of applying `padding-right` equivalent to `gap` on the translated group while keeping outer container gap at zero to preserve mathematical translation continuity.
_Avoid_: margin hack, spacer element

**Aria-Hidden Clone**:
A duplicate subtree marked with `aria-hidden="true"` so screen readers perceive only a single set of content items.
_Avoid_: accessibility shadow, invisible clone
