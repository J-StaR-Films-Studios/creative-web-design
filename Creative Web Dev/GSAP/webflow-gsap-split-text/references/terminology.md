# Terminology

**GSAP Visual Interactions**:
The native Webflow timeline interface that configures GreenSock Animation Platform tweens and ScrollTriggers visually without writing manual script tags.
_Avoid_: legacy interactions, custom JS code, Webflow IX2

**SplitText**:
The GSAP utility integrated into Webflow that deconstructs a text block into constituent DOM spans (`Word`, `Line`, `Letter`) to enable staggered, individual character/word animations.
_Avoid_: manual span wrapping, text fragmentation

**Split Mask**:
An automated clipping boundary applied to split text units that hides them outside their bounding box during transform animations.
_Avoid_: overflow div hack, CSS clipping mask

**Scrub on Scroll**:
A ScrollTrigger mode where animation playback position is directly mapped 1:1 to the scrollbar position with optional inertia smoothing.
_Avoid_: parallax scroll, manual scroll listener

**Trigger Actions**:
A ScrollTrigger execution mode that triggers discrete playback states (`Play`, `Pause`, `Resume`, `Restart`, `Reverse`, `Reset`) at specific viewport intersection boundaries.
_Avoid_: threshold triggers, scroll waypoint
