# Source-to-Skill Knowledge Extraction & Synthesis

**Source Material:** *Knowledge Engineering and Management: The CommonKADS Methodology* (Schreiber, Akkermans, Anjewierden, de Hoog, Shadbolt, Van de Velde, Wielinga; MIT Press, 2000).

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Book / Reference Methodology Textbook |
| **Title** | *Knowledge Engineering and Management: The CommonKADS Methodology* |
| **Authority** | Guus Schreiber, Hans Akkermans, Anjo Anjewierden, Robert de Hoog, Nigel Shadbolt, Walter Van de Velde, Bob Wielinga (University of Amsterdam, Vrije Universiteit Amsterdam, University of Nottingham, etc. — primary architects of KADS & CommonKADS ESPRIT projects). |
| **Coverage** | Comprehensive engineering lifecycle for knowledge-intensive systems: Context Modeling (Organization, Task, Agent Models), Knowledge Management, Conceptual Knowledge Modeling (Domain, Inference, Task layers), Task Template Catalog (Classification, Assessment, Diagnosis, Monitoring, Synthesis, Configuration Design, Assignment, Planning, Scheduling), Knowledge Elicitation Techniques, Communication Modeling, Knowledge System Design (MVC, structure-preserving design), Implementation, and Spiral Risk-Driven Project Management. |

### Coverage Gaps Identified
- Automated Machine Learning rule-induction algorithms are referenced conceptually but mathematical derivations are pointed to external literature.
- Formal CML language grammar is partially excerpted in the text/appendix; full formal semantics of certain third-party extensions (e.g., advanced multi-agent KQML/FIPA coordination engines) rely on external standards.

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# CONCEPTS
# ==============================================================================

- id: ku-001
  type: concept
  name: Knowledge Model
  source: src-01, "Chapter 2, p. 19; Chapter 5, pp. 86-90"
  confidence: high
  definition: >
    An implementation-independent conceptual specification of the knowledge and 
    reasoning requirements used in performing a knowledge-intensive task, structured 
    into domain, inference, and task knowledge.
  attributes:
    - domain_knowledge
    - inference_knowledge
    - task_knowledge
  avoid_terms: [rule base, expert system code, database schema]
  related: [ku-002, ku-003, ku-004]

- id: ku-002
  type: concept
  name: Domain Knowledge
  source: src-01, "Chapter 5, pp. 91-104; Chapter 13, pp. 318-331"
  confidence: high
  definition: >
    The static information and knowledge structures of an application domain, 
    composed of domain schemas (concepts, relations, rule types) and knowledge bases 
    (factual instances and rule instances).
  attributes:
    - domain_schemas
    - knowledge_bases
  avoid_terms: [data model, ontology file]
  related: [ku-001, ku-005, ku-006]

- id: ku-003
  type: concept
  name: Inference Knowledge
  source: src-01, "Chapter 5, pp. 104-111; Chapter 13, pp. 331-341"
  confidence: high
  definition: >
    The specification of primitive reasoning steps (inferences) and the functional 
    roles (knowledge roles) that domain objects play during reasoning, abstracting 
    away control flow.
  attributes:
    - inferences
    - dynamic_knowledge_roles
    - static_knowledge_roles
    - transfer_functions
  avoid_terms: [algorithms, methods, functions]
  related: [ku-001, ku-004, ku-007]

- id: ku-004
  type: concept
  name: Task Knowledge
  source: src-01, "Chapter 5, pp. 112-117; Chapter 13, pp. 342-345"
  confidence: high
  definition: >
    The specification of reasoning goals and the strategies (task methods) 
    that achieve them through hierarchical decomposition into subtasks and inferences, 
    including procedural control structures.
  attributes:
    - task_goal
    - task_roles
    - task_methods
    - control_structure
  avoid_terms: [procedural code, execution scripts]
  related: [ku-001, ku-003]

- id: ku-005
  type: concept
  name: Knowledge Role
  source: src-01, "Chapter 5, pp. 105-108"
  confidence: high
  definition: >
    A functional placeholder that specifies the role a domain entity plays 
    in a reasoning process, enabling decoupling of functional inferences from domain data.
  attributes:
    - dynamic_role (run-time variable inputs/outputs)
    - static_role (stable knowledge base references)
    - domain_mapping
  avoid_terms: [variable, data parameter]
  related: [ku-002, ku-003]

- id: ku-006
  type: concept
  name: Rule Type
  source: src-01, "Chapter 5, pp. 99-102; Chapter 13, pp. 324-327"
  confidence: high
  definition: >
    A schema construct representing the logical and structural dependency between 
    expressions about concepts/relations, characterized by antecedent, consequent, 
    cardinality, and a connection symbol.
  attributes:
    - antecedent
    - consequent
    - connection_symbol
    - cardinality
  avoid_terms: [if-then production rule, coded statement]
  related: [ku-002]

- id: ku-007
  type: concept
  name: Transfer Function
  source: src-01, "Chapter 5, pp. 108-109; Chapter 9, pp. 216-218"
  confidence: high
  definition: >
    A primitive functional unit in the knowledge model representing interaction 
    between the reasoning system and an external agent (human or software), categorized 
    by information holder and initiative.
  attributes:
    - obtain (system initiative, external info)
    - receive (external initiative, external info)
    - present (system initiative, internal info)
    - provide (external initiative, internal info)
  avoid_terms: [I/O subroutine, UI call]
  related: [ku-003, ku-008]

- id: ku-008
  type: concept
  name: CommonKADS Model Suite
  source: src-01, "Chapter 2, pp. 17-20"
  confidence: high
  definition: >
    An interrelated set of six aspect models answering Why (Organization, Task, Agent), 
    What (Knowledge, Communication), and How (Design) to specify, justify, and construct 
    a knowledge system.
  attributes:
    - organization_model
    - task_model
    - agent_model
    - knowledge_model
    - communication_model
    - design_model
  avoid_terms: [system specifications, documentation templates]
  related: [ku-001, ku-009]

- id: ku-009
  type: concept
  name: Structure-Preserving Design
  source: src-01, "Chapter 11, pp. 273-275"
  confidence: high
  definition: >
    A software engineering design principle stating that the conceptual distinctions, 
    structures, and knowledge roles defined in the analysis models must be explicitly 
    preserved in the target software architecture.
  attributes:
    - transparency
    - maintainability
    - reusability
    - explanation_generation
  avoid_terms: [direct compilation, flattened coding]
  related: [ku-008]

# ==============================================================================
# PRINCIPLES
# ==============================================================================

- id: ku-010
  type: principle
  name: Knowledge-Level Principle
  source: src-01, "Chapter 2, p. 16; Newell (1982)"
  confidence: high
  statement: >
    Model knowledge at a conceptual level independent of implementation details and 
    programming constructs before making software design decisions.
  rationale: >
    Decoupling analysis from implementation prevents premature technical constraints 
    and ensures human-understandable domain modeling.
  applies_to: [ku-020, ku-021, ku-022]

- id: ku-011
  type: principle
  name: Constructive Modeling vs. Knowledge Mining
  source: src-01, "Chapter 2, pp. 15-16; Chapter 4, pp. 74-75"
  confidence: high
  statement: >
    Knowledge engineering is not "mining jewels out of an expert's head" into a machine, 
    but a constructive, collaborative activity creating purposeful aspect models.
  rationale: >
    Expertise is contextual, frequently routinized/tacit, and cannot be extracted as 
    a fixed substance without structured conceptual reconstruction.
  applies_to: [ku-020, ku-023]

- id: ku-012
  type: principle
  name: Function-Data Decoupling via Knowledge Roles
  source: src-01, "Chapter 5, pp. 106-107, 118-120"
  confidence: high
  statement: >
    Inferences and tasks must define input and output through domain-independent knowledge 
    roles, mapping to domain concepts separately.
  rationale: >
    Enables cataloging and reuse of generic problem-solving patterns (task templates) 
    across completely disparate application domains.
  applies_to: [ku-021, ku-022]

- id: ku-013
  type: principle
  name: Risk-Driven Spiral Project Lifecycle
  source: src-01, "Chapter 2, p. 17; Chapter 15, pp. 380-385"
  confidence: high
  statement: >
    Manage knowledge projects through iterative cycles (Review -> Risk -> Plan -> Monitor) 
    governed by targeted model states and risk assessment, rather than rigid waterfalls or ad-hoc prototyping.
  rationale: >
    Accommodates the exploratory nature of externalizing tacit knowledge while maintaining 
    rigorous management control.
  applies_to: [ku-025]

# ==============================================================================
# CONSTRAINTS
# ==============================================================================

- id: ku-014
  type: constraint
  name: Inferences are Declarative Black Boxes
  source: src-01, "Chapter 5, p. 105; Chapter 7, pp. 176-177"
  confidence: high
  rule: >
    Inferences must be specified purely declaratively by their input/output roles and 
    static knowledge mappings. They must not contain internal control or procedural loops.
  scope: Knowledge model specification (inference layer)
  consequence: >
    If a reasoning step requires internal sequencing, condition checks, or multiple steps 
    to be explainable, it must be promoted to a composite task and decomposed via a task method.
  enforced_by: Knowledge model validation rules

- id: ku-015
  type: constraint
  name: Model Before Rules
  source: src-01, "Chapter 5, pp. 86, 103; Chapter 7, pp. 180-183"
  confidence: high
  rule: >
    Do not populate full knowledge bases with rule instances until domain schema types, 
    inferences, and task methods are structurally specified and validated.
  scope: Knowledge acquisition and specification workflow
  consequence: >
    Rules collected before establishing schema structures cause inconsistent syntax, 
    unmaintainable flat bases, and wasted elicitation effort.
  enforced_by: Phase gating in model construction

# ==============================================================================
# PROCEDURES
# ==============================================================================

- id: ku-020
  type: procedure
  name: Context & Organizational Feasibility Analysis
  source: src-01, "Chapter 3, pp. 27-35, 64-65"
  confidence: high
  goal: Scrutinize organizational environment, isolate knowledge bottlenecks, and assess project feasibility.
  prerequisites: [Project brief initiated]
  steps:
    - action: Complete OM-1 (Problems & Opportunities, organizational context, candidate solutions).
      criterion: High-level business mission, drivers, and initial solution portfolio documented.
    - action: Complete OM-2 (Variant aspects: structure, process, people, resources, culture/power).
      criterion: UML activity diagram of current business process and organizational chart established.
    - action: Complete OM-3 (Process Breakdown into tasks).
      criterion: All business tasks characterized by agent, location, knowledge asset, knowledge-intensity, and significance (1-5).
    - action: Complete OM-4 (Knowledge Assets analysis).
      criterion: Assets evaluated for right form, right place, right time, and right quality.
    - action: Produce Feasibility Decision Document (OM-5).
      criterion: Business, technical, and project feasibility scored with concrete proposed action focus.
  outputs: [Organizational Model (OM-1 to OM-5), Scoping & Feasibility Document]

- id: ku-021
  type: procedure
  name: Task & Agent Impact Analysis
  source: src-01, "Chapter 3, pp. 44-51, 64-65"
  confidence: high
  goal: Analyze targeted knowledge-intensive task and evaluate operational agent impact.
  prerequisites: [Feasibility confirmed in OM-5]
  steps:
    - action: Complete Task Analysis Worksheet (TM-1).
      criterion: Task goal, value, 3D info structure (functional, static class diagram, dynamic control), resources, and criteria specified.
    - action: Complete Knowledge Item Bottleneck Worksheet (TM-2).
      criterion: Knowledge nature, form, availability, and specific bottlenecks identified.
    - action: Complete Agent Model Worksheet (AM-1).
      criterion: Agent competencies, responsibilities, communication links, and constraints cataloged.
    - action: Produce Impact & Improvement Decision Document (OTA-1).
      criterion: Organizational and agent-specific changes, user attitudes, and accompanying measures synthesized.
  outputs: [Task Model (TM-1, TM-2), Agent Model (AM-1), Impact Document (OTA-1)]

- id: ku-022
  type: procedure
  name: Knowledge Model Construction
  source: src-01, "Chapter 7, pp. 167-186; Chapter 5, pp. 85-117; Chapter 6, pp. 123-166"
  confidence: high
  goal: Construct a verified, implementation-independent conceptual specification of domain, inference, and task knowledge.
  prerequisites: [TM-1 and TM-2 completed]
  steps:
    - action: Conduct Knowledge Identification (domain familiarization, glossary, scenario drafting, potential component cataloging).
      criterion: Domain glossary established and initial reusable templates identified.
    - action: Select Task Template from catalog (Classification, Assessment, Diagnosis, Monitoring, Synthesis, Configuration Design, Assignment, Planning, Scheduling).
      criterion: Appropriate generic inference structure and task decomposition selected.
    - action: Construct Initial Domain Schema (concepts, attributes, value types, relations, subtype hierarchies).
      criterion: Static conceptual model specified independently of task methods.
    - action: Complete Knowledge Model Specification via middle-out or middle-in approach.
      criterion: All inference specs, knowledge roles (dynamic/static), domain mappings, rule types, and task methods with control structures specified.
    - action: Refine and Validate Knowledge Model (paper-based scenario walkthrough or mock-up prototype trace).
      criterion: Scenarios successfully simulated without missing inferences or unmapped roles.
    - action: Populate Knowledge Bases with verified instances.
      criterion: Domain rules and factual instances authored in CML syntax under appropriate knowledge base containers.
  outputs: [Knowledge Model Specification (Domain Schema, Knowledge Bases, Inference Knowledge, Task Knowledge), KM-1 Documentation Document]

- id: ku-023
  type: procedure
  name: Knowledge Elicitation Execution
  source: src-01, "Chapter 8, pp. 187-214"
  confidence: high
  goal: Elicit domain expertise using natural and contrived techniques matched to knowledge types.
  prerequisites: [Domain familiarization completed]
  steps:
    - action: Select elicitation technique based on target knowledge (Unstructured Interview for orientation; Structured Interview with standard probes P1-P6 for rules; Protocol Analysis for dynamic reasoning/task control; Laddering for concept hierarchies; Concept Sorting/Repertory Grids for latent dimensions/attributes).
      criterion: Technique selection justified against target knowledge category.
    - action: Execute elicitation session with tape/video recording and realistic problem scenarios.
      criterion: Verbatim recording and behavioral observation obtained.
    - action: Transcribe protocol promptly and apply task template/inference coding scheme.
      criterion: Transcript text marked up into concepts, attributes, values, inferences, and rules.
    - action: Validate elicited findings with expert using teach-back techniques.
      criterion: Intermediate representation verified and amended by domain specialist.
  outputs: [Marked-up Transcripts, Concept Ladders, Repertory Grid Dendrograms, Elicited Rule Sets]

- id: ku-024
  type: procedure
  name: Communication Modeling
  source: src-01, "Chapter 9, pp. 215-240"
  confidence: high
  goal: Model communicative transactions and information exchanges between agents and transfer functions.
  prerequisites: [Task leaf nodes, transfer functions, and Agent Model available]
  steps:
    - action: Identify core information objects exchanged between distinct pairs of leaf tasks.
      criterion: Every cross-agent information transfer isolated.
    - action: Construct Dialogue Diagram and Communication Plan control.
      criterion: Top-level agent dialogue diagram and state-transition/pseudocode control specified.
    - action: Describe individual Transactions (Worksheet CM-1).
      criterion: Transaction name, agents involved, core object, communication plan, and pre/post-conditions documented.
    - action: Detail Information Exchange Specification (Worksheet CM-2).
      criterion: Messages categorized by intention (speech act types: Request, Propose, Require, Offer, Order, Agree, Reject-td/ta, Ask, Reply, Report, Inform), syntactic form, medium, and supporting help items.
    - action: Validate Communication Model via walk-through, Wizard of Oz simulation, or Nielsen's heuristic usability evaluation.
      criterion: Dialogue structure, message completeness, and usability criteria verified.
  outputs: [Communication Model (Communication Plan, Dialogue Diagram, CM-1, CM-2)]

- id: ku-025
  type: procedure
  name: System Design via Reference Architecture
  source: src-01, "Chapter 11, pp. 271-294; Chapter 12, pp. 295-315"
  confidence: high
  goal: Map conceptual analysis models into a structure-preserving software architecture.
  prerequisites: [Knowledge Model and Communication Model validated]
  steps:
    - action: Specify System Architecture (Worksheet DM-1).
      criterion: Subsystem structure (Model-View-Controller), control model, and object decomposition defined.
    - action: Identify Target Implementation Platform (Worksheet DM-2).
      criterion: Platform selected evaluating typing, declarative rule handling, GUI libraries, and interaction protocols.
    - action: Specify Architectural Components (Worksheet DM-3).
      criterion: Controller event handlers, task execute methods, inference execution/probing methods (has-solution/new-solution), dynamic role datatypes (set/list/element), and knowledge base access functions detailed.
    - action: Specify Application within Architecture (Worksheet DM-4).
      criterion: Direct mapping of tasks, inferences, roles, rules, and UI views completed.
  outputs: [Design Model (DM-1, DM-2, DM-3, DM-4), Software Architecture Specification]

# ==============================================================================
# EXAMPLES & COUNTEREXAMPLES
# ==============================================================================

- id: ku-030
  type: example
  name: CommonKADS Assessment Template Application (Housing Case)
  source: src-01, "Chapter 10, pp. 241-270; Appendix, pp. 419-432"
  confidence: high
  scenario: >
    Allocating public rental housing in the Netherlands based on complex legal eligibility criteria.
  application: >
    Applied assessment task template using middle-out construction: abstracting raw case data 
    (household size -> household type; age -> age category), evaluating four distinct norm categories 
    (residence type, household size, rent-income match, residence-specific constraints), and matching 
    evaluated norms to produce eligibility decision.
  outcome: >
    Clear separation of static legal rules from dynamic case evaluation; system easily prototyped 
    and validated in Prolog and AionDS.
  teaches: >
    Domain schemas and inference structures from generic task templates can be directly instantiated 
    to rapidly produce robust knowledge systems.
  illustrates: [ku-001, ku-012, ku-022]

- id: ku-031
  type: counterexample
  name: Premature Automation Without Organization Modeling (Social Security Case)
  source: src-01, "Chapter 3, pp. 36-44"
  confidence: high
  scenario: >
    Municipal social security benefit office suffering huge backlogs attempted to build a legal 
    decision-support knowledge system assuming law complexity was the bottleneck.
  mistake: >
    Skipped thorough organizational and workload analysis; assumed decision-making was the primary delay.
  consequence: >
    Field study revealed decision-making accounted for <10% of workload, while paper archiving/reporting 
    consumed >60%. Full automation would fail due to tacit human "cheat/fudge" handling.
  correction: >
    Execute OM-1 through OM-5 first. Redirect project from an automated KBS to streamlining 
    archiving/reporting workflows.
  teaches: >
    Organizational context modeling prevents building the wrong system for the wrong problem.
  illustrates: [ku-008, ku-020]
```

---

## Phase 3: Methodology Synthesis (Operational Stages)

```
STAGE 1: Organizational Context & Feasibility Scoping

INPUT
- Raw problem statements, strategic business directives, stakeholder briefs.

STEPS
1. Identify stakeholders (knowledge providers, users, decision-makers) — completion criterion: Stakeholder evaluation matrix established.
2. Formulate problem-opportunity portfolio and invariant organizational context using Worksheet OM-1 — completion criterion: Business mission, drivers, and solution candidates documented.
3. Map focus area structure and business processes using Worksheet OM-2 and UML Activity Diagrams — completion criterion: Primary vs. secondary process workflows diagrammed with swim lanes.
4. Decompose business processes into discrete tasks using Worksheet OM-3 — completion criterion: Tasks scored for significance (1-5) and knowledge intensity.
5. Audit knowledge assets using Worksheet OM-4 — completion criterion: Bottlenecks categorized by form, place, time, and quality.
6. Evaluate business, technical, and project feasibility using Worksheet OM-5 — completion criterion: Concrete go/no-go recommendation and focus area selected.

DECISION POINTS
- If major process bottleneck is non-cognitive/logistical (e.g., filing/archiving) → Redirect to business process reengineering (refrain from KBS development).
- If knowledge is excessively tacit/unverbalizable → Downscale automation scope to intelligent assistant/support tool.
- If feasible → Proceed to Stage 2.

OUTPUT
- Completed Organization Model (OM-1 to OM-5) and Feasibility Decision Document.

VALIDATION
[ ] Process workflow diagrammed with clear inputs/outputs.
[ ] All knowledge assets audited across the 4 dimensions (form, place, time, quality).
[ ] Feasibility document reviewed and signed off by business stakeholders.
```

```
STAGE 2: Task, Agent, and Communication Impact Modeling

INPUT
- Scoped target task and Organization Model from Stage 1.

STEPS
1. Perform detailed task decomposition using Worksheet TM-1 — completion criterion: 3D model (functional I/O, class diagram, control flow) completed.
2. Conduct knowledge bottleneck analysis using Worksheet TM-2 — completion criterion: Epistemic nature, physical form, and access limits isolated.
3. Model agent roles and competencies using Worksheet AM-1 and UML Use-Case diagrams — completion criterion: Agent responsibilities, authority, and constraints cataloged.
4. Construct Communication Plan and Dialogue Diagram — completion criterion: Cross-agent leaf-task transactions mapped with control logic.
5. Specify detailed Transactions (CM-1) and Information Exchanges (CM-2) — completion criterion: Preconditions, postconditions, and messages typed with speech-act intentions (Request, Propose, Inform, Order, Agree, etc.).
6. Synthesize impacts into Worksheet OTA-1 — completion criterion: Change management actions and retraining plans formulated.

DECISION POINTS
- If agent-agent communication involves complex negotiation/bidding → Deploy multi-agent conversation policies (e.g., Homebots market auction).
- If interaction is standard advisory → Employ ASK/REPLY and INFORM patterns.

OUTPUT
- Task Model (TM-1, TM-2), Agent Model (AM-1), Communication Model (CM-1, CM-2), and Impact Document (OTA-1).

VALIDATION
[ ] Every cross-agent information flow has a corresponding transaction.
[ ] Messages typed with both propositional content and communicative intention.
[ ] Stakeholder acceptance verified via communication walkthrough or Wizard of Oz test.
```

```
STAGE 3: Conceptual Knowledge Modeling & Template Instantiation

INPUT
- Detailed Task Model (TM-1, TM-2) and elicited domain data.

STEPS
1. Select appropriate Task Template from library (Classification, Assessment, Diagnosis, Monitoring, Configuration Design, Assignment, Planning, Scheduling) — completion criterion: Annotated inference structure matches domain reasoning.
2. Specify Domain Schema constructs (Concepts, Attributes, Value Types, Relations, Subtype hierarchies, Viewpoints) — completion criterion: Domain conceptualizations specified independently of reasoning methods.
3. Model Inference Knowledge — completion criterion: Primitive inferences declaratively specified as black boxes linked to dynamic and static knowledge roles.
4. Construct Task Knowledge — completion criterion: Task goals and task methods specified with pseudocode control structures (incorporating `has-solution`, `new-solution`).
5. Define Rule Types — completion criterion: Schema-level expressions specified with antecedents, consequents, and meaningful connection symbols.
6. Validate Knowledge Model conceptually — completion criterion: Paper-based walkthrough table or rapid reasoning prototype trace executes test scenarios successfully.
7. Populate Knowledge Bases — completion criterion: Rule instances and domain facts authored under appropriate `USES` schema declarations.

DECISION POINTS
- If task template is sufficiently detailed → Use Middle-Out specification approach.
- If task template requires decomposition → Use Middle-In specification approach (hierarchical method decomposition).
- If domain requires multiple classification dimensions → Use `VIEWPOINTS` with multiple inheritance.
- If single inference requires internal control/probing → Convert inference into a composite subtask with its own task method.

OUTPUT
- Formal Knowledge Model (Domain Schema, Knowledge Bases, Inference Knowledge, Task Knowledge) and KM-1 Documentation Document.

VALIDATION
[ ] SKILL/Model contains zero implementation-specific primitives.
[ ] Inferences are strictly declarative black boxes.
[ ] All knowledge roles possess valid domain mappings.
[ ] Every test scenario paper simulation executes to completion without deadlocks.
```

```
STAGE 4: Structure-Preserving System Design & Implementation

INPUT
- Validated Knowledge Model, Communication Model, and non-functional requirements.

STEPS
1. Formulate System Architecture using Worksheet DM-1 — completion criterion: Model-View-Controller subsystem boundaries established.
2. Select Target Implementation Platform using Worksheet DM-2 — completion criterion: Platform verified for typing, rule execution, and view bindings.
3. Detail Architectural Components using Worksheet DM-3 — completion criterion: Controller event handlers, task execution methods, inference execution algorithms, dynamic role memory data types (set/list/element), and KB access methods specified.
4. Execute Application Design Mapping using Worksheet DM-4 — completion criterion: Explicit 1-to-1 mapping of conceptual model entities into software components preserving domain vocabulary.
5. Implement and verify running system — completion criterion: Prototype execution traces generated and verified against domain scenarios.

DECISION POINTS
- If implementation platform lacks native rule types → Construct relational table interpreter or embed declarative rule-chaining engine.
- If real-time event handling is required → Implement asynchronous agenda/demon controller with concurrency controls.

OUTPUT
- Design Model (DM-1 to DM-4) and Executable Knowledge System Software.

VALIDATION
[ ] Structure-preserving design check: Every knowledge model construct is traceable in code.
[ ] Dynamic roles function properly as system working memory.
[ ] Automated or user-driven tracer produces intelligible reasoning explanations in domain vocabulary.
```

---

## Phase 4 & 5: Skill Validation & Delivery Summary

### 1. Extraction Summary
- **Knowledge Units Extracted:** 18 units across Concepts (9), Principles (4), Constraints (2), Procedures (6), Examples/Counterexamples (2).
- **Core Methodology Synthesized:** Full 4-stage operationalized CommonKADS lifecycle encompassing organizational scoping, task/agent/communication analysis, 3-layer conceptual modeling, and structure-preserving MVC design.
- **Key Source Discrepancies Resolved:** Clarified difference between general functional decomposition (DFDs) vs. CommonKADS function-data decoupling via knowledge roles; distinguished natural vs. contrived elicitation techniques.

### 2. Operational Test Scenario Walkthroughs

| Scenario | Workflow Path | Expected Result |
|---|---|---|
| **Scenario A: Diagnostic Support for Industrial Equipment** | Stage 1 (OM-1–5) -> Stage 2 (TM-1–2) -> Stage 3 (Select Diagnosis Template -> Causal Model Schema -> `cover`, `select`, `specify`, `verify` Inferences -> Generate-and-test Task Method) -> Stage 4 (MVC Design) | Accurately identifies root fault from symptom inputs using causal-dependency rules while preserving explanation traces. |
| **Scenario B: Assessment of Policy / Loan Eligibility** | Stage 1 -> Stage 2 -> Stage 3 (Select Assessment Template -> `abstract`, `specify`, `select`, `evaluate`, `match` -> Norm Requirements & Decision Rules) -> Stage 4 | Transforms raw applicant data into abstracted features, evaluates norms, and outputs clear eligible/not-eligible decisions. |
| **Scenario C: Multi-Agent Resource Allocation (e.g. Energy Grid/Homebots)** | Stage 1 -> Stage 2 (Communication Plan -> Dialogue Diagram -> CM-1/CM-2 with `PROPOSE`, `INFORM`, `REQUEST` speech acts) -> Stage 3 (Assignment/Scheduling Template) -> Stage 4 (Event-driven controller) | Coordinates distributed negotiation and auction transactions between agents to achieve market equilibrium. |

### 3. Known Limitations & Unresolved Items
- **Creative / Open-Ended Design:** CommonKADS synthesis and configuration design templates require predefined component catalogues; unbounded creative synthesis is outside methodology scope.
- **Machine Learning Integration:** Automated rule-induction from large datasets is accommodated as an elicitation aid but requires separate external ML tooling.
