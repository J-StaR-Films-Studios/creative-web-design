# Terminology

**gltfjsx**:
A command-line tool that compiles GLTF/GLB 3D files into declarative React Three Fiber JSX components.
_Avoid_: model converter, 3D translator

**React Three Fiber (R3F)**:
A React renderer for Three.js that brings declarative component structures to WebGL scenes.
_Avoid_: ThreeJS wrapper, WebGL library

**Drei**:
A collection of useful helpers, abstractions, and staging components designed for React Three Fiber (e.g., `<Environment>`, `<Lightformer>`, `<PresentationControls>`).
_Avoid_: Three plugins, helper pack

**ScrollTrigger**:
A GSAP plugin that triggers animations, pins elements, and links timeline progress directly to scroll position.
_Avoid_: scroll listener, scroll watcher

**Zustand**:
A lightweight, fast, boilerplate-free state management library used to coordinate UI actions with 3D canvas parameters.
_Avoid_: Redux alternative, global variable store

**Bento Grid**:
A UI layout style that arranges cards of varying sizes into a visually cohesive modular masonry grid.
_Avoid_: tile display, card list
