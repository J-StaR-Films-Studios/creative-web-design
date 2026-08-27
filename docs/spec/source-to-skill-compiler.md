# Specification: Source-to-Skill Knowledge Compiler & Expert System Engineering

## Problem Statement

AI coding agents struggle with specialized, nuanced programming workflows, architectural paradigms, and domain-specific methodologies because base LLMs lack deep procedural context. When standard agents attempt to "learn" from educational materials (YouTube tutorials, technical documentation, academic papers, books), they default to shallow text summarization. This produces vague guidelines rather than operational procedural knowledge, resulting in agents that fail when executing complex, idiomatic, or edge-case-heavy programming tasks.

## Solution

A formal **Knowledge $\rightarrow$ Methodology $\rightarrow$ Skill Compiler** (`source-to-skill`) grounded in classical Knowledge Engineering principles (CommonKADS and MYCIN). The system consumes raw multi-modal knowledge sources (video transcripts, technical PDFs, documentation, books), extracts structured knowledge units using formal elicitation probes (P1–P6) and completeness matrices, synthesizes an operational workflow (what a practitioner must *do* rather than what the text *says*), and compiles a modular, validated Agent Skill package adhering to progressive disclosure standards.

---

## User Stories

1. As a developer, I want to provide one or more YouTube video transcripts to the compiler, so that the agent can extract the exact coding techniques demonstrated by domain experts.
2. As a developer, I want the compiler to extract explicit procedural steps with verifiable completion criteria, so that downstream agents execute tasks deterministically.
3. As a developer, I want the compiler to identify hard constraints, forbidden patterns, and edge cases mentioned in the sources, so that agents avoid common implementation bugs.
4. As a developer, I want the compiler to detect and flag contradictions across multiple sources, so that I can resolve conflicting domain advice before a skill is generated.
5. As a developer, I want the extraction process to use formal CommonKADS elicitation probes (P1–P6: conditions, prerequisites, exceptions, alternatives, invariants, checks), so that questions and extractions are grounded in proven methodology rather than LLM improvisation.
6. As a developer, I want an intermediate Knowledge Spec artifact generated between source ingestion and skill compilation, so that knowledge units maintain strict source provenance and confidence ratings.
7. As a developer, I want the compiled output to be structured as a standard Agent Skill directory (`SKILL.md` + `references/`), so that it is 100% portable across any agent environment.
8. As a developer, I want `SKILL.md` to remain concise (<500 lines) with detailed schemas, tables, and patterns pushed into on-demand reference files, so that context windows are preserved.
9. As a developer, I want domain terms defined with `_Avoid_` anti-synonyms in a `terminology.md` file, so that agents adhere strictly to canonical project vocabulary.
10. As a developer, I want the compiler to generate concrete worked examples and test scenarios, so that downstream agents have few-shot patterns to reference during code generation.
11. As a developer, I want a dedicated `expert-system-engineer` skill to design rule-based consultant architectures, so that I can build diagnostic, classification, and decision-tree engines with certainty factor calculus.
12. As a developer, I want static completeness and consistency verification (conflict, redundancy, subsumption checks), so that rule bases are guaranteed to be gap-free before deployment.
13. As a developer, I want backward-chaining inference with goal stacks and history trees, so that the system can provide dynamic `WHY` and `HOW` reasoning explanations.
14. As a developer, I want to point any agent at a newly compiled programming skill, so that it follows the exact methodology from the training videos to the letter.

---

## Implementation Decisions

### 1. Two-Tier System Architecture
- **`source-to-skill` (Universal Compiler)**: Generic, domain-independent pipeline that ingests any source material (transcripts, docs, PDFs) and compiles a validated skill package.
- **`expert-system-engineer` (Domain Skill Artifact)**: A standalone, specialized skill synthesized from CommonKADS and MYCIN source extractions, used whenever an agent needs to design or code rule-based expert systems.

### 2. Intermediate Knowledge Specification (Knowledge Spec)
- Rejects single-pass summarization. Requires compiling raw source extractions into a structured YAML intermediate representation containing typed knowledge units:
  - `concept`: Domain entities, value types, relationships.
  - `principle`: Core governing heuristics and rationale.
  - `procedure`: Ordered actions, inputs, outputs, completion gates.
  - `constraint`: Hard boundaries, invariants, forbidden patterns.
  - `example` / `counterexample`: Concrete positive and negative case traces.
- Every unit enforces metadata attributes: `id`, `source` (provenance), `confidence` (high/medium/low), and `related`.

### 3. Knowledge Engineering Rigor (CommonKADS Integration)
- **Three-Layer Modeling**: Decouples static Domain Knowledge (schemas/relations) from Inference Knowledge (black-box reasoning steps/roles) and Task Knowledge (goals/control flow).
- **Elicitation Probes (P1–P6)**: Standardizes how the agent interrogates source material:
  - P1: Condition boundaries
  - P2: Prerequisites & inputs
  - P3: Exceptions & anti-patterns
  - P4: Alternatives & trade-offs
  - P5: Invariants
  - P6: Checkable verification criteria

### 4. Rule-Based Execution & Verification (MYCIN/EMYCIN Integration)
- **Context Tree & Parameter Dictionary**: Hierarchical entity scoping with explicit parameter types (`SINGLE-VALUED`, `MULTI-VALUED`, `YES-NO`) and `ASKFIRST` flags.
- **Certainty Factor Calculus**: Standardized formula for accumulating belief/disbelief in $[-1.0, +1.0]$ with $AND$ premise minimization and threshold guardrails ($\text{TALLY} \le 0.2$).
- **Static Verification**: Condition-action tables to detect Conflicts, Redundancies, Subsumptions, and Completeness gaps.
- **Explanation Facilities**: Goal-stack unwinding for runtime `WHY` queries, subgoal descent for `HOW` queries, and post-hoc QA parsing.

### 5. Skill Packaging & Progressive Disclosure
- Conforms to the `agent-engineering` suite standards:
  - `SKILL.md`: Imperative instructions, positive steering, leading words, <500 lines.
  - `references/`: On-demand documentation (terminology, patterns, deep guides, examples).
  - Portable folder drop-in without external runtime dependencies.

---

## Testing Decisions

### 1. Source Fidelity Verification
- For every knowledge unit in the intermediate spec, verify an explicit counterpart in the compiled skill (as a workflow step, decision branch, reference entry, or documented exclusion).

### 2. Operational Scenario Walkthroughs
- The compiler must construct and execute at least 3 realistic test scenarios against the compiled skill to verify that:
  - Execution order is logical.
  - All decision branches are covered.
  - A practitioner following the steps reaches the correct outcome.

### 3. Static Rule Consistency Checks
- For rule-based systems, verify condition-action matrices for zero unresolved conflicts, duplicate firings, or unhandled null branches.

---

## Out of Scope

- **Direct Audio/Video Decoding**: The compiler operates on text transcripts, subtitles, or extracted notes, not raw binary video/audio streams.
- **Model Weight Fine-Tuning**: Focuses purely on in-context agent skills, prompt structures, and external knowledge bases, not training PyTorch/JAX models.
- **Continuous IoT Telemetry Engines**: Designed for transactional, consultative, and batch procedural workflows, not real-time sub-millisecond streaming telemetry.

---

## Further Notes

- Both [`source-to-skill/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/source-to-skill) and [`expert-system-engineer/`](file:///c:/Users/johno/Documents/antigravity/resilient-davinci/expert-system-engineer) are fully compiled, checked, and ready for immediate deployment across any Antigravity or AI agent workflow.
