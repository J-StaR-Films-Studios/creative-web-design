# Creative Development / Immersive Web Development Learning Specification

## Problem Statement

The user wants to learn how to build the type of highly interactive, experimental, premium websites represented by references such as Huy Phan, BUNQ LABS, Butter, Superlocal Design, and ORYZO AI.

The desired websites are not conventional marketing websites. They should feel like interactive digital experiences, where the website itself demonstrates the creativity and technical capability of the person or studio behind it.

The user specifically wants to understand the underlying technologies rather than merely copy visual effects. They want to become capable of looking at an advanced creative website and understanding the technical architecture behind it.

The desired learning area sits at the intersection of:

- Creative development
- Creative coding
- Creative web development
- Interactive web design
- Experimental web design
- Immersive web development
- Web animation
- WebGL development
- 3D web development
- Shader programming
- Motion design for the web

A particularly important target is the ability to create advanced typography and interaction effects, including the previously discussed effect where text visually breaks apart into sand/dust/particles in response to cursor interaction and subsequently reconstructs itself.

The user does not simply want to learn “web animation.” They want to understand how user input can become visual computation.

## Solution

Build a structured learning path for **Creative Development**, with **Creative Web Development** as the specific application area.

The curriculum should progressively move from conventional frontend fundamentals into motion, interaction, creative coding, 3D, GPU programming, and advanced immersive web experiences.

The primary progression is:

**HTML/CSS/JavaScript → GSAP → ScrollTrigger → Lenis → Canvas → Three.js → WebGL → GLSL/Shaders → Blender → React/Next.js → React Three Fiber → Rive/p5.js/OGL/Web Audio/Gaussian Splats/WebGPU**

The user should learn each technology through practical recreation of visual effects and complete interactive experiences rather than treating each technology as an isolated programming course.

The ultimate learning objective is to understand the architecture behind award-level creative websites and eventually build original experiences rather than merely reproduce tutorials.

## User Stories

1. As a learner, I want to understand what “creative development” means, so that I can identify the correct field of study.

2. As a learner, I want to distinguish creative development from conventional web development, so that I can focus my learning on interactive digital experiences.

3. As a learner, I want to understand the common design language shared by premium creative websites, so that I can recognize reusable design principles.

4. As a learner, I want to understand how motion becomes part of a website's visual language, so that animation feels intentional rather than decorative.

5. As a learner, I want to understand how typography can become an interactive visual object, so that I can create expressive text experiences.

6. As a learner, I want to create oversized and responsive typography, so that text can function as part of the art direction.

7. As a learner, I want to create character-level and word-level text animations, so that I can build sophisticated typography reveals.

8. As a learner, I want to understand SplitText-style techniques, so that text can be animated by characters, words, or lines.

9. As a learner, I want to create cursor-responsive typography, so that text can react dynamically to user movement.

10. As a learner, I want to create text displacement effects, so that typography can appear to distort, dissolve, or physically move.

11. As a learner, I want to create a sand/dust text effect, so that letters can visually break apart into particles.

12. As a learner, I want particles to respond to cursor position, so that interaction feels physical.

13. As a learner, I want particles to return to their original positions, so that an interaction can naturally reconstruct the original text.

14. As a learner, I want to understand interpolation and decay, so that interactions can smoothly return to their resting state.

15. As a learner, I want to understand requestAnimationFrame, so that I can build custom animation loops.

16. As a learner, I want to understand mouse and pointer events, so that user input can drive visual effects.

17. As a learner, I want to understand mouse coordinates and velocity, so that interaction strength can depend on cursor movement.

18. As a learner, I want to understand DOM manipulation, so that I can dynamically control web elements.

19. As a learner, I want to understand CSS transforms, so that I can create performant movement and deformation.

20. As a learner, I want to understand CSS variables, so that JavaScript and CSS can communicate efficiently.

21. As a learner, I want to understand clip-path, masking, filters, and blend modes, so that I can create sophisticated visual compositions without always relying on WebGL.

22. As a learner, I want to understand perspective and 3D CSS transforms, so that I can create depth in conventional HTML/CSS.

23. As a learner, I want to learn GSAP, so that I can build professional-grade web animations.

24. As a learner, I want to understand GSAP timelines, so that multiple animations can be coordinated.

25. As a learner, I want to learn GSAP ScrollTrigger, so that scrolling can control animation progress.

26. As a learner, I want to create scrubbed animations, so that animation progress directly follows scrolling.

27. As a learner, I want to create pinned sections, so that content can remain fixed while an animation sequence progresses.

28. As a learner, I want to create horizontal scrolling experiences, so that I can build unconventional layouts.

29. As a learner, I want to create sophisticated page transitions, so that navigation feels like part of the experience.

30. As a learner, I want to understand staggered animation, so that groups of elements can move organically.

31. As a learner, I want to learn Lenis, so that websites can have smooth, controlled scrolling.

32. As a learner, I want to understand how Lenis integrates with GSAP and ScrollTrigger, so that scrolling and animation remain synchronized.

33. As a learner, I want to understand Canvas 2D, so that I can build custom interactive graphics.

34. As a learner, I want to build particle systems using Canvas, so that I can experiment with interactive visual effects.

35. As a learner, I want to create mouse-reactive particle systems, so that I can understand basic interaction physics.

36. As a learner, I want to learn procedural noise, so that I can create organic rather than purely mathematical motion.

37. As a learner, I want to understand Three.js, so that I can create interactive 3D experiences in the browser.

38. As a learner, I want to understand scenes, cameras, renderers, meshes, geometries, materials, textures, and lights, so that I understand the Three.js rendering model.

39. As a learner, I want to connect Three.js animations to scrolling, so that camera movement and 3D scenes can respond to the user's journey through a page.

40. As a learner, I want to understand WebGL, so that I understand the GPU-powered foundation beneath advanced browser graphics.

41. As a learner, I want to understand shaders, so that I can manipulate visual output at the pixel and vertex level.

42. As a learner, I want to learn GLSL, so that I can create custom graphical effects.

43. As a learner, I want to understand UV coordinates, so that I can manipulate textures and images inside shaders.

44. As a learner, I want to create fragment shaders, so that I can control individual pixels.

45. As a learner, I want to create vertex shaders, so that I can manipulate geometry.

46. As a learner, I want to learn shader-based noise, so that I can create organic distortions.

47. As a learner, I want to create image distortion shaders, so that images can deform interactively.

48. As a learner, I want to create mouse-driven shader distortion, so that the cursor can act as a force field.

49. As a learner, I want to create WebGL text distortion, so that typography can become a GPU-driven interactive surface.

50. As a learner, I want to understand how DOM text can become a texture or graphical representation, so that conventional typography can participate in WebGL effects.

51. As a learner, I want to understand how user input can become a visual computation pipeline, so that I can reason about advanced interactions rather than copy implementations.

52. As a learner, I want to understand Blender, so that I can create sophisticated 3D assets for websites.

53. As a learner, I want to understand how Blender assets can be exported to the web, so that pre-rendered or optimized 3D content can be integrated into interactive sites.

54. As a learner, I want to understand GLTF/GLB workflows, so that Blender assets can be efficiently used in Three.js.

55. As a learner, I want to understand baked animation and pre-rendered assets, so that visually expensive scenes can be presented without requiring everything to run in real time.

56. As a learner, I want to understand hybrid 3D workflows, so that I can combine baked cinematic assets with real-time WebGL interaction.

57. As a learner, I want to learn React and Next.js, so that I can integrate advanced creative experiences into production-quality websites.

58. As a learner, I want to learn React Three Fiber, so that Three.js scenes can be integrated naturally into React applications.

59. As a learner, I want to understand Rive, so that I can create interactive vector animations and state-driven visual components.

60. As a learner, I want to understand p5.js, so that I can experiment rapidly with creative coding and generative graphics.

61. As a learner, I want to understand OGL, so that I can work closer to the WebGL/GLSL layer when Three.js abstraction is unnecessary.

62. As a learner, I want to understand Web Audio, so that interaction can optionally include responsive sound.

63. As a learner, I want to eventually understand Gaussian splats, so that I can experiment with emerging browser-based 3D experiences.

64. As a learner, I want to eventually understand WebGPU, so that I can progress beyond traditional WebGL where appropriate.

65. As a learner, I want to understand how cursor velocity can become an interaction force, so that motion can feel physical.

66. As a learner, I want to understand how scroll position can become animation progress, so that scrolling can drive complex visual narratives.

67. As a learner, I want to understand how multiple systems communicate, so that GSAP, Lenis, Three.js, shaders, and DOM elements can operate as one experience.

68. As a learner, I want to recreate individual effects from reference websites, so that I can learn by reverse-engineering real experiences.

69. As a learner, I want to eventually recreate an entire reference experience, so that I can validate that I understand the underlying architecture.

70. As a learner, I want to move beyond recreating references, so that I can develop my own visual language.

71. As a learner, I want to understand performance implications, so that complex experiences remain usable on real devices.

72. As a learner, I want to learn restraint in creative development, so that adding more technology does not make an experience visually incoherent.

73. As a learner, I want to understand art direction alongside engineering, so that the final website feels designed rather than merely technically impressive.

74. As a learner, I want to understand how minimal interfaces can coexist with complex interactions, so that navigation remains simple while the experience remains rich.

75. As a learner, I want to create memorable signature interactions, so that a website has a distinctive identity.

76. As a learner, I want to understand the difference between adding animation and designing an interaction system, so that my work feels intentional.

77. As a learner, I want to understand creative technology as an intersection of design, motion, branding, and engineering, so that I can approach projects holistically.

78. As a learner, I want to become capable of looking at an advanced creative website and identifying the likely technologies behind its effects, so that I can independently research and reproduce techniques.

79. As a learner, I want to use YouTube and other educational resources to learn individual technologies, so that I can build the skill incrementally.

80. As a learner, I want the learning path to prioritize practical technologies over unnecessary complexity, so that I reach useful results quickly.

## Implementation Decisions

### 1. Terminology

The overall field will be referred to as **Creative Development**.

The user's specific specialization will be referred to as **Creative Web Development** or **Immersive Web Development**.

“Creative Coding” will be treated as a related discipline rather than the complete name of the field.

### 2. Learning progression

The curriculum will follow this general progression:

**Frontend fundamentals**
- HTML
- CSS
- JavaScript

**Motion**
- GSAP
- GSAP timelines
- ScrollTrigger
- SplitText
- page transitions
- staggered animation

**Scrolling**
- Lenis
- GSAP/Lenis synchronization

**Creative coding**
- Canvas
- particle systems
- mouse interaction
- interpolation
- procedural noise

**3D**
- Three.js
- scenes
- cameras
- meshes
- materials
- textures
- lighting
- GLTF/GLB

**GPU graphics**
- WebGL
- GLSL
- vertex shaders
- fragment shaders
- UVs
- noise
- displacement
- texture manipulation

**3D production**
- Blender
- baked animation
- pre-rendered assets
- hybrid real-time/baked workflows

**Production application**
- React
- Next.js
- React Three Fiber

**Specialized technologies**
- Rive
- p5.js
- OGL
- Web Audio
- Gaussian splats
- WebGPU

### 3. Priority order

The highest-priority technologies are:

1. JavaScript
2. GSAP
3. ScrollTrigger
4. Lenis
5. Canvas
6. Three.js
7. WebGL
8. GLSL/Shaders

Blender and React/Next.js should support the graphics work rather than replace the core creative-development learning.

Rive, p5.js, OGL, Web Audio, Gaussian splats, and WebGPU are specialized extensions.

### 4. Technology role separation

Each technology should be understood according to its role:

- **JavaScript:** interaction logic and browser control
- **CSS:** layout, styling, transforms, filters, and lightweight visual effects
- **GSAP:** animation orchestration
- **ScrollTrigger:** scroll-driven animation
- **Lenis:** smooth scrolling
- **Canvas:** custom 2D graphics and particles
- **Three.js:** browser-based 3D
- **WebGL:** GPU rendering foundation
- **GLSL:** custom GPU visual computation
- **Blender:** 3D asset and animation production
- **React/Next.js:** production application architecture
- **React Three Fiber:** Three.js inside React
- **Rive:** interactive vector animation
- **p5.js:** creative coding and generative experiments
- **OGL:** lightweight WebGL abstraction
- **Web Audio:** interactive sound
- **Gaussian splats/WebGPU:** advanced future-facing graphics

### 5. Interaction model

Advanced interactions should be understood as input-to-computation pipelines.

For cursor interactions:

**Cursor → coordinates/velocity → interaction force → animation/shader/particle state → rendered result**

For scrolling:

**Scroll input → Lenis → normalized/progressive scroll state → ScrollTrigger/animation timeline → DOM/Three.js/shader state → rendered result**

### 6. Signature interaction strategy

The goal is not to add as many effects as possible.

A high-quality creative website should have one or more **signature interactions** that are memorable and tightly connected to its visual identity.

The previously discussed sand/dust typography effect is an example of this principle.

### 7. Visual-design principle

The target websites demonstrate a philosophy of:

**strong art direction + typography + motion + interaction + technology + restraint**

Technology should reinforce the visual concept rather than become the visual concept itself.

The goal is not:

**Three.js + particles + distortion + WebGL + effects everywhere**

but:

**clear visual idea + carefully selected technology that makes that idea possible.**

### 8. Reference websites

The following references establish the target visual and experiential category:

- Huy Phan — huyml.co
- BUNQ LABS — bunqlabs.com
- Butter — butter.video
- Superlocal Design — superlocaldesign.com
- ORYZO AI — oryzo.ai

These references share characteristics including strong art direction, unconventional layouts, expressive typography, minimal UI, interaction-driven motion, experimental navigation, immersive visual effects, and technology used as an invisible enabling layer.

### 9. ORYZO-style architectural principle

A key lesson from the ORYZO-style implementation is that not everything needs to be rendered in real time.

High-quality experiences can combine:

- pre-baked renders
- optimized 3D assets
- real-time WebGL
- camera movement
- parallax
- shader effects
- DOM overlays
- animation libraries

This hybrid approach can provide cinematic visual quality while controlling browser performance.

### 10. Learning methodology

The user should learn by building.

The recommended pattern is:

**Learn concept → recreate small effect → combine effects → recreate reference interaction → build original implementation**

Rather than:

**watch entire course → memorize API → move on**

The user should search for specific technologies and effects on YouTube, including:

- Creative Development
- Creative Coding
- GSAP
- GSAP ScrollTrigger
- Lenis + GSAP
- Canvas particle systems
- Three.js
- Three.js + GSAP
- WebGL
- GLSL
- Fragment shaders
- Vertex shaders
- UV coordinates
- Shader noise
- Image distortion shaders
- Mouse distortion shaders
- Text distortion
- Blender + Three.js
- GLTF/GLB
- React Three Fiber
- Rive
- p5.js

## Testing Decisions

Because this conversation does not contain an existing repository or implementation, no concrete automated test seams can truthfully be specified yet.

For a future implementation, testing should prioritize **external behavior over implementation details**.

Good tests should verify things such as:

- interactive elements respond to pointer input;
- animations reach the expected visible state;
- animations restore to the expected resting state;
- scroll-driven interactions respond correctly to scroll progress;
- navigation transitions reach the correct destination;
- interactive components remain functional across viewport sizes;
- WebGL-enhanced components degrade gracefully where required;
- interactions do not prevent normal page navigation or accessibility;
- performance-sensitive systems do not unnecessarily create runaway animation loops.

The preferred seam should be the highest-level user-visible interaction possible rather than testing internal GSAP timelines, shader implementation details, or Three.js object construction directly.

No prior-art test patterns can be established without access to the target repository.

## Out of Scope

The following are outside the immediate learning target:

- conventional brochure-style website development as the primary focus;
- purely static UI/UX design;
- learning every JavaScript framework;
- mastering every 3D engine;
- building an entire game engine;
- treating WebGL as mandatory for every website;
- adding effects simply because they are technically possible;
- reproducing reference websites commercially without appropriate rights;
- requiring every visual to run entirely in real time;
- learning advanced WebGPU before understanding the WebGL/GLSL fundamentals;
- making technology the primary goal instead of the resulting experience.

The immediate objective is not mastery of every technology in the stack. The objective is to develop enough understanding to design and implement sophisticated interactive web experiences.

## Further Notes

The strongest conceptual takeaway from the discussion is:

> **The user is not really learning web animation. They are learning how to turn user input into visual computation.**

The desired endpoint is the ability to see an experience such as interactive typography, a distorted image, a 3D camera journey, particle dispersion, or a shader effect and reason backwards from the visual result to the technical architecture.

Eventually, the user should be able to look at an advanced website and think in terms of systems:

**DOM + CSS + JavaScript + GSAP + Lenis + Canvas + Three.js + WebGL + GLSL + 3D assets**

rather than seeing the result as unexplained “wizardry.”

The ideal professional identity for this direction is therefore:

**Creative Developer / Creative Web Developer**

with specialization in:

**Interactive Web Experiences, Motion, WebGL, 3D, and Creative Coding.**