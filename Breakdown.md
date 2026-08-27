## Project Goal / Big Picture

The user initially asked about **expert systems in Computer Science**, specifically whether there are formal rules, books, PDFs, or established methodologies that explain how to build expert systems properly and systematically, like someone who has been doing it for years.

The important discovery was that the user’s actual goal is **not simply to learn expert systems**.

The real goal is to build an **AI skill that can ingest knowledge sources and produce a new skill/capability from that knowledge**.

The expert-system material is intended to be the **first test case / domain** for this larger system.

The broader vision is:

**Sources → knowledge extraction → methodology extraction → synthesis → validation → executable skill / teaching package**

The user wants to be able to provide things like:

* YouTube links
* Multiple YouTube videos
* PDFs/books
* Websites
* potentially other documents/sources

The system should be able to consume those sources, extract the important knowledge, understand the methodology being taught, and then produce a **skill that teaches/encodes that methodology**.

The system may also eventually be capable of producing a package that can **teach another model how to perform the same methodology**, potentially including explanations, examples, counterexamples, exercises, and evaluations.

---

# What We Discussed About Expert Systems

We established the traditional expert-system architecture:

**Knowledge Base + Inference Engine → Expert Decision**

Important components discussed:

* Knowledge Base
* Inference Engine
* Working Memory
* User Interface
* Explanation Facility

Classic rule-based example:

```text
IF engine_wont_start
AND battery_light_is_on
→ battery_problem

IF engine_wont_start
AND battery_light_is_off
AND fuel_level_is_low
→ fuel_problem
```

Classic historical systems mentioned:

* MYCIN
* DENDRAL

The key broader discipline identified was **Knowledge Engineering**.

---

# The Main Methodology We Identified

The strongest methodology discussed was **CommonKADS**.

The user wants something closer to a **repeatable engineering methodology** than a collection of generic “IF/THEN rules.”

CommonKADS was highlighted because it provides structured models around:

* Organization
* Tasks
* Agents
* Knowledge
* Communication
* Design

Knowledge engineering was described as involving things such as:

* knowledge acquisition
* expert interviews
* domain modelling
* task analysis
* concept identification
* knowledge representation
* rule extraction
* inference design
* validation
* consistency checking
* system design
* implementation

The historical MYCIN work was also identified as useful because it demonstrates how a real-world serious expert system was engineered.

---

# Resources We Identified

These were the key free/accessible resources discussed:

### CommonKADS

Official site:

[https://commonkads.org/](https://commonkads.org/)

CommonKADS methodology paper / accessible ResearchGate copy:

[https://www.researchgate.net/publication/220628697_CommonKADS_A_comprehensive_methodology_for_KBS_development](https://www.researchgate.net/publication/220628697_CommonKADS_A_comprehensive_methodology_for_KBS_development)

CommonKADS textbook:

**Knowledge Engineering and Management: The CommonKADS Methodology**

ResearchGate:

[https://www.researchgate.net/publication/235705607_Knowledge_Engineering_and_Management_-_The_CommonKADS_Methodology](https://www.researchgate.net/publication/235705607_Knowledge_Engineering_and_Management_-_The_CommonKADS_Methodology)

Official MIT Press page:

[https://direct.mit.edu/books/monograph/3278/Knowledge-Engineering-and-ManagementThe-CommonKADS](https://direct.mit.edu/books/monograph/3278/Knowledge-Engineering-and-ManagementThe-CommonKADS)

The specific parts highlighted as particularly useful were:

* Knowledge Engineering Basics
* Task and Organizational Context
* Knowledge Model Components
* Template Knowledge Models
* Knowledge Model Construction
* Knowledge-Elicitation Techniques
* Case Study
* Designing Knowledge Systems
* Implementation

### MYCIN / Rule-Based Expert Systems

**Rule-Based Expert Systems: The MYCIN Experiments of the Stanford Heuristic Programming Project**

ResearchGate:

[https://www.researchgate.net/publication/292780022_Rule-Based_Expert_Systems](https://www.researchgate.net/publication/292780022_Rule-Based_Expert_Systems)

### Guus Schreiber

Academic publications/resources:

[https://cs.vu.nl/~guus/publ.html](https://cs.vu.nl/~guus/publ.html)

### IJCAI CommonKADS tutorial

[https://www.ijcai.org/past/ijcai-97/CI/TUTORIAL/sp3.html](https://www.ijcai.org/past/ijcai-97/CI/TUTORIAL/sp3.html)

---

# The User’s Actual Endgame

The user clarified that the intended system would be something like:

> Give it a YouTube link, or a bunch of YouTube links, PDFs, websites, etc., and have it extract the methodology/knowledge and then create another skill from it.

Potentially:

> It could even teach another model how to do the stuff exactly, including examples and many other supporting materials.

So the intended system is much closer to a:

**Knowledge → Methodology → Capability compiler**

or:

**Knowledge Engineering / Skill Compiler**

than a simple expert-system generator.

---

# Important Architectural Idea We Discussed

We explicitly distinguished this from ordinary RAG.

Typical RAG:

```text
Question
↓
Retrieve chunks
↓
LLM
↓
Answer
```

The desired system is closer to:

```text
Sources
↓
Extract
↓
Structure
↓
Synthesize
↓
Model methodology
↓
Validate
↓
Compile
↓
Skill / Teaching artifact
```

The goal is not merely to answer questions about the sources.

The goal is to **extract an operational capability from the sources**.

---

# Proposed High-Level Pipeline

The architecture we discussed conceptually:

```text
                KNOWLEDGE SOURCES
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       YouTube       PDFs       Websites
          │           │           │
          └───────────┼───────────┘
                      ▼
             KNOWLEDGE INGESTION
                      ↓
             KNOWLEDGE EXTRACTION
                      ↓
                 SYNTHESIS
                      ↓
            METHODOLOGY MODEL
                      ↓
              EXEMPLAR LIBRARY
                      ↓
               SKILL COMPILER
                 /         \
                /           \
               ▼             ▼
          GENERATED       TEACHING
             SKILL          PACKAGE
```

The generated skill could be one output.

The teaching package for another model could be another output.

---

# Potential Skill Compiler Output

The conceptual output structure discussed looked roughly like:

```text
expert-system-engineer/
│
├── SKILL.md
├── methodology.md
├── terminology.md
├── workflows/
│   ├── problem-definition.md
│   ├── knowledge-acquisition.md
│   ├── conceptualization.md
│   ├── inference-design.md
│   └── validation.md
│
├── rules/
│   ├── methodology-rules.md
│   └── validation-rules.md
│
├── examples/
│   ├── worked-example-01.md
│   ├── worked-example-02.md
│   └── failure-example-01.md
│
└── evaluations/
    ├── test-cases.md
    └── grading-rubric.md
```

This is **conceptual**, not a fixed required structure yet.

---

# Critical Design Idea: Intermediate Knowledge Specification

A major idea was that the system should probably **not jump directly from raw source material to a final skill**.

Instead, there should be an intermediate structured representation of what was learned.

Conceptually something like:

```yaml
concept:
  name: Knowledge Acquisition

principle:
  statement: >
    Domain knowledge must be elicited and validated
    before formal representation.

procedure:
  - identify_expert
  - elicit_knowledge
  - structure_knowledge
  - validate_with_expert

constraints:
  - do_not_generate_rules_before_domain_model
  - distinguish_explicit_from_tacit_knowledge

examples:
  - ...

counterexamples:
  - ...

evidence:
  - source: commonkads_book
    location: chapter_8

confidence:
  level: high

relationships:
  depends_on:
    - problem_definition

validation:
  tests:
    - knowledge_source_identified
    - expert_confirmation_required
```

The purpose is to provide a **structured intermediate layer between source material and the generated skill**.

This allows:

* provenance
* source attribution
* conflict detection
* confidence
* explicit principles
* procedures
* constraints
* examples
* counterexamples
* relationships
* validation criteria

---

# Strong Design Principle: Skill Should Learn What To Do, Not Just What The Source Says

One of the most important ideas:

The system should ask:

> **What does a competent practitioner actually need to be able to DO?**

Rather than merely producing a summary.

For example, instead of:

> “CommonKADS says task modelling is important.”

The generated methodology could encode:

```text
STAGE: TASK ANALYSIS

INPUT
- Problem definition
- Stakeholders
- Domain description

QUESTIONS
1. What task must the system perform?
2. What is the task's goal?
3. What inputs are required?
4. What outputs are expected?
5. What reasoning steps are involved?
6. Who performs the task currently?
7. What knowledge is required?

OUTPUT
- Task definition
- Task decomposition
- Inputs
- Outputs
- Required knowledge
- Reasoning structure

VALIDATION
[ ] Task has measurable goal
[ ] Inputs are identified
[ ] Outputs are identifiable
[ ] Knowledge requirements are explicit
[ ] Task boundaries are defined
```

This was meant as an example of turning source knowledge into an **operational methodology**.

---

# Potential “Model Teacher” Output

A second possible output is not a skill but a package designed to teach another model.

Potential structure:

```text
Concepts
↓
Principles
↓
Examples
↓
Counterexamples
↓
Exercises
↓
Expected reasoning
↓
Evaluation criteria
↓
Testing
↓
Identify weaknesses
↓
Remediation
```

So the system could potentially produce something like:

> “Here is everything another model needs to learn to reproduce this methodology.”

This would be much richer than a summary.

---

# Skill Workflow We Discussed for Expert Systems

For the expert-system case specifically, the intended generated methodology could contain phases such as:

### Phase 0 — Expert System Suitability

Determine whether the problem should be an expert system at all.

Possible alternatives include:

* normal deterministic algorithm
* ML
* computer vision
* LLM
* expert system

The system should not blindly force every problem into an expert-system architecture.

### Phase 1 — Knowledge Acquisition

Identify:

* experts
* sources
* domain knowledge
* tacit knowledge
* explicit knowledge

Potentially use structured interviews/questions.

### Phase 2 — Conceptualization

Identify:

* concepts
* attributes
* relationships
* states
* events
* constraints

### Phase 3 — Knowledge Representation

Choose an appropriate representation, potentially:

* production rules
* frames
* semantic networks
* ontologies
* decision tables
* decision trees
* cases
* certainty factors
* combinations

The key principle was that the system should **choose based on the knowledge**, rather than always defaulting to IF/THEN rules.

### Phase 4 — Inference

Determine:

* forward chaining
* backward chaining
* hybrid
* rule priority
* conflict resolution
* certainty
* explanation traces

### Phase 5 — Verification & Validation

Check for:

* contradictory rules
* unreachable rules
* missing rules
* circular reasoning
* overlapping rules
* ambiguous knowledge
* other consistency/completeness issues

### Phase 6 — Implementation

Only after the knowledge and inference models are sufficiently validated should the implementation be generated.

Possible implementation components:

```text
Python
+
Rule Engine
+
Knowledge Base
+
Inference Engine
+
Explanation Engine
+
API/UI
```

But technology should be selected based on the problem, not assumed.

---

# A Key Validation Idea

The system should not simply trust an LLM when it says:

> “I understood the sources.”

Instead, the generated skill should be **tested against the source methodology**.

Conceptually:

```text
SOURCE MATERIAL
↓
SKILL COMPILER
↓
GENERATED SKILL
↓
TEST CASE GENERATOR
↓
MANY TEST CASES
↓
Does skill behave according to sources?
        │
     NO │ YES
        ↓
      REVISE
        ↓
     TEST AGAIN
```

This creates a much stronger loop where the resulting skill is evaluated based on behavior.

---

# Important Concern: Source Reliability

A major caution was discussed.

**Source material is not automatically truth.**

Potential problems:

* YouTube educator may teach incorrect information
* books may disagree
* lecturers may omit exceptions
* transcripts may lose visual/diagram information
* sources may conflict
* sources may differ in quality/authority

Therefore the overall system should eventually support things such as:

* provenance
* evidence
* source ranking
* conflict resolution
* confidence
* validation
* distinction between consensus and isolated claims
* identification of gaps

Otherwise the system risks building a very sophisticated machine for **compiling misinformation into high-quality-looking skills**.

---

# User’s Intended Development Strategy

The user plans to send files that describe **how they currently create skills**.

Those files are important.

The current plan is:

1. User provides the skill-creation materials/files.
2. We study how the existing skill system works.
3. We use that framework as the foundation.
4. We then integrate the stronger ideas discussed here where useful.
5. Eventually create the actual prompt/instructions for the model that will perform this source → skill generation.
6. The user explicitly said **not to start writing that final model prompt until they say “write it”** or otherwise indicate it is time.
7. Until then, conversation should remain focused on planning/discussion rather than prematurely generating the final skill-creation prompt.

The user specifically said they are likely going to transfer the conversation because of Free-tier limits, so this summary exists to preserve the context.

---

# Communication Preference for This Project

The user explicitly said the previous responses were **too long**.

For future discussion:

* Keep discussion with the user relatively concise.
* Avoid repeatedly explaining the entire architecture.
* Focus on the current decision/problem.
* However, when writing the actual instructions **for the model**, those can and should be detailed and precise.
* The user will indicate when something is intended to be **model-facing output rather than discussion with them**.

The user wants a clear separation between:

**Conversation with the user**
vs.
**Actual instructions/prompt being sent to the model.**

---

# What Has NOT Been Finalized Yet

These are still open decisions:

* Exact skill format
* Exact source-ingestion pipeline
* How YouTube content will be retrieved/transcribed
* How PDFs/websites will be processed
* Exact intermediate representation
* How source conflicts will be resolved
* How source quality will be scored
* Whether the generated output should always be a skill, or sometimes a teaching package
* Exact validation/evaluation framework
* Exact folder/file structure
* Exact prompt/skill instructions
* Which parts of CommonKADS/MYCIN should become mandatory methodology versus optional knowledge
* How much autonomy the generated skill should have
* How the skill should know when it has extracted “enough” knowledge

Most importantly, **we need to inspect the user’s own skill-creation files before locking these down.**

The next useful action is therefore: **user sends the skill-creation files, we study them, and only then design the final source-to-skill system around that existing framework.**
