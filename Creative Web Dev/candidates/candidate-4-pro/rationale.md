# Rationale: Agent Engineering Choices

## 1. Modular Extraction
The skill is strictly decomposed into a `< 500` line master `SKILL.md` orchestrator, with implementation logic deferred to `references/`. This prevents agent context window flooding, allowing the LLM to selectively load specific domains (e.g., `shaders-and-glsl.md`) only when implementing a shader.

## 2. Imperative Construction
Instructions in the skill bypass descriptive narrative. Phrases like "Construct the particle buffer" ensure the LLM operates as an execution engine rather than a summarizer.

## 3. Strict Terminology
By enforcing canonical terms in `terminology.md` and explicitly banning anti-synonyms (e.g., forbidding "Progress bar" in favor of "Playhead"), we eliminate semantic drift and hallucination across agent sub-tasks.

## 4. Phase Gates
Checkable markdown lists at the end of each phase act as hard programmatic breaks. This forces the agent into a validation loop before advancing down the pipeline, essential for compounding complex domains like Canvas 2D and ScrollTrigger.
