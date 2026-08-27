# Webflow GSAP Terminology & Concepts

**Native GSAP Timeline**:
The visual multi-track animation editor embedded inside Webflow Designer that interfaces directly with the GSAP runtime.
_Avoid_: custom JS embed, external code editor, legacy Webflow IX2

**Custom Selector**:
A targeting method in the GSAP interactions panel allowing CSS-style selector queries (such as `*` for all children or attribute queries) within a scoped parent.
_Avoid_: hardcoded element IDs, manual child class binding

**Split Text Stagger**:
An automated GSAP capability that fragments text blocks into animated character, word, or line units without DOM re-authoring.
_Avoid_: manual span tags, CSS split-letter hacks

**Scrub on Scroll**:
A continuous animation mode where timeline frame playback directly corresponds to the scroll offset percentage between two viewport triggers.
_Avoid_: scroll-into-view trigger, unlinked page scroll

**Boomerang Playback (Yoyo)**:
An animation configuration where a timeline automatically oscillates forward and in reverse repeatedly.
_Avoid_: infinite keyframe loops, recursive custom timeouts

**Scope Filter (`Within`)**:
An interaction constraint that limits rule evaluation strictly to children of the element that received the trigger event.
_Avoid_: global class targeting, page-wide selector matching
