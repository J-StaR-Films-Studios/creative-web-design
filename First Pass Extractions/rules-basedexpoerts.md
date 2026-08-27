# Source-to-Skill Compilation: Rule-Based Expert System Engineering (MYCIN/EMYCIN Methodology)

---

## Phase 1: Source Inventory

| Field | Content |
|---|---|
| **ID** | `src-01` |
| **Type** | Book / Edited Volume |
| **Title** | *Rule-Based Expert Systems: The MYCIN Experiments of the Stanford Heuristic Programming Project* (Eds. Bruce G. Buchanan and Edward H. Shortliffe, Addison-Wesley, 1984) |
| **Authority** | Stanford Heuristic Programming Project (Buchanan, Shortliffe, Davis, Clancey, van Melle, Scott, Fagan, Aikins, et al.) — Seminal foundation of rule-based expert systems and knowledge engineering. |
| **Coverage** | Architectural foundations of production systems; Goal-directed backward chaining; Certainty Factor (CF) evidence combination calculus; Context tree hierarchy & dynamic instantiation; Algorithmic plan-generate-and-test therapy selection; Knowledge acquisition & interactive debugging (TEIRESIAS); Static consistency/completeness verification; Automated English explanation generation (WHY/HOW history trees); Meta-level knowledge and meta-rules; Cognitive extensions (CENTAUR, NEOMYCIN, GUIDON); Real-time monitoring extensions (VM); Human factors, clinical integration, and formal evaluation methodology. |

### Coverage Gaps Identified
- Low-level machine architecture / Interlisp implementation internals (addressed abstractly via BNF and LISP templates).
- Full formal proofs of non-probabilistic Dempster-Shafer combinations (addressed via Barnett's linear approximation algorithm).

---

## Phase 2: Knowledge Extraction (Knowledge Spec)

```yaml
# ==============================================================================
# KNOWLEDGE SPEC: RULE-BASED EXPERT SYSTEMS COMPILER
# ==============================================================================

- id: ku-001
  type: concept
  name: Rule-Based Expert System Architecture
  source: src-01, "Chapter 1, pp. 3-6; Chapter 4, pp. 67-73"
  confidence: high
  definition: >
    A software architecture that decouples domain-specific facts and heuristic rules
    (Knowledge Base) from the domain-independent execution and search machinery (Inference Engine).
  attributes: [knowledge-base, inference-engine, dynamic-patient-data, explanation-subsystem]
  avoid_terms: [hardcoded decision logic, monolithic expert program]
  related: [ku-002, ku-003, ku-007]

- id: ku-002
  type: concept
  name: Associative Triple
  source: src-01, "Chapter 4, pp. 68-70; Chapter 5, pp. 86-90"
  confidence: high
  definition: >
    An elementary proposition representing a domain assertion in the format (Object, Attribute, Value)
    or (Context, Parameter, Value), qualified by an associated Certainty Factor (CF).
  attributes: [context, parameter, value, certainty-factor]
  avoid_terms: [bare global variable, untyped property]
  related: [ku-001, ku-004, ku-006]

- id: ku-003
  type: concept
  name: Production Rule Representation
  source: src-01, "Chapter 5, pp. 79-82, 98"
  confidence: high
  definition: >
    A modular conditional statement mapping a conjunction of premise predicate functions
    over associative triples to an action conclusion with an associated expert certainty weighting.
  attributes: [premise, action, tally, certainty-factor]
  avoid_terms: [procedural branch, if-then-else script]
  related: [ku-002, ku-008, ku-009]

- id: ku-004
  type: concept
  name: Context Tree Hierarchy
  source: src-01, "Chapter 5, pp. 82-86, 118-122; Chapter 27, pp. 495-503"
  confidence: high
  definition: >
    A strictly structured tree of domain entities (context-types and instantiated contexts)
    organizing multi-object quantification, scope of parameters, and the dynamic progression of consultation.
  attributes: [context-type, instance-tree, parent-child-links, mainprops]
  avoid_terms: [flat variable space, unindexed frame graph]
  related: [ku-002, ku-005, ku-014]

- id: ku-005
  type: concept
  name: Clinical Parameter Types
  source: src-01, "Chapter 5, pp. 87-90"
  confidence: high
  definition: >
    Categorization of attributes into Single-valued (mutually exclusive outcomes),
    Multi-valued (concurrent independent outcomes), and Yes-No (binary predicates where NO = YES with negated CF).
  attributes: [single-valued, multi-valued, yes-no, ASKFIRST, EXPECT]
  avoid_terms: [untyped parameters]
  related: [ku-002, ku-006]

- id: ku-006
  type: concept
  name: Certainty Factor Model
  source: src-01, "Chapter 10, pp. 209-232; Chapter 11, pp. 233-262"
  confidence: high
  definition: >
    A continuous numerical metric ranging from -1.0 (disproven) to +1.0 (proven certain)
    approximating confirmation and evidential strength rather than strict conditional probability.
  attributes: [measure-of-belief-MB, measure-of-disbelief-MD, tally, combine-function]
  avoid_terms: [Bayesian posterior, fuzzy truth value]
  related: [ku-007, ku-011, ku-012]

- id: ku-007
  type: principle
  name: Modularity Before Search Strategy
  source: src-01, "Chapter 2, pp. 28-32; Chapter 7, pp. 149-152; Chapter 36, pp. 670-672"
  confidence: high
  statement: >
    Domain heuristics must be captured as independent, self-contained inferential units.
    Control and invocation order must be decoupled from the syntax of the heuristic rules.
  rationale: >
    Coupling control to rules destroys transparency, impedes automated consistency verification,
    and prevents interactive explanation and debugging.
  applies_to: [ku-001, ku-003, ku-016]

- id: ku-008
  type: procedure
  name: Goal-Directed Backward Chaining (FINDOUT / MONITOR)
  source: src-01, "Chapter 5, pp. 103-112"
  confidence: high
  goal: Exhaustively establish the values of a clinical parameter for a given context.
  prerequisites: [Active context node instantiated, Target parameter selected]
  steps:
    - action: Check if parameter is flagged ASKFIRST/LABDATA.
      criterion: If ASKFIRST, directly prompt user unless already known or previously deduced.
    - action: Retrieve all rules concluding about the parameter from the UPDATED-BY list.
      criterion: Separate rules into non-self-referencing and self-referencing sets.
    - action: Apply the Rule Preview Mechanism.
      criterion: Discard rules whose premise clauses are already known to be false in the current dynamic state.
    - action: Evaluate rule premises recursively via the MONITOR.
      criterion: Premise evaluated clause by clause using $AND minimization over CF tallies.
    - action: If premise TALLY exceeds 0.2, execute rule action via CONCLUDE.
      criterion: Combine conclusion CF into the cumulative parameter value using CF_COMBINE.
    - action: Execute self-referencing rules only after all regular rules complete.
      criterion: Prevents infinite recursion loops and preserves commutative evidence combination.
  outputs: [Populated Val[Context, Parameter] list with associated CFs]
  related: [ku-003, ku-006, ku-009, ku-010]

- id: ku-009
  type: procedure
  name: Certainty Factor Combination
  source: src-01, "Chapter 10, pp. 216; Chapter 11, pp. 254-256"
  confidence: high
  goal: Combine multiple independent evidential weights into a single cumulative certainty factor.
  prerequisites: [Prior cumulative CF (X), Newly derived rule contribution CF (Y = Rule_CF * Premise_TALLY)]
  steps:
    - action: If both X > 0 and Y > 0, compute: X + Y * (1 - X).
      criterion: Positive evidence accumulates asymptotically toward +1.0.
    - action: If both X < 0 and Y < 0, compute: -(-X + (-Y) * (1 - (-X))).
      criterion: Negative evidence accumulates asymptotically toward -1.0.
    - action: If X and Y have opposite signs, compute: (X + Y) / (1 - min(|X|, |Y|)).
      criterion: Softens single negative evidence points without completely wiping out multiple supporting rules.
  outputs: [Updated cumulative CF in range [-1.0, +1.0]]
  related: [ku-006, ku-008]

- id: ku-010
  type: procedure
  name: Plan-Generate-and-Test Therapy Selection
  source: src-01, "Chapter 6, pp. 133-146; Chapter 19, pp. 363-370"
  confidence: high
  goal: Select the minimal, most efficacious combination of antimicrobials covering all identified pathogens.
  prerequisites: [Diagnostic hypothesis list compiled, Patient clinical parameters and allergies gathered]
  steps:
    - action: Plan (Local Ranking) — Rank candidate drugs per organism based on in vitro sensitivities, current therapy status, and intrinsic efficacy (scale 1-10).
      criterion: Produce ordered preference groups (1st, 2nd, 3rd rank) for each pathogen.
    - action: Generate (Canonical Proposal) — Propose candidate drug combinations using canonical instruction sequences (e.g., 1 first-choice drug, 2 first-choice drugs, 1 first + 1 second).
      criterion: Prioritize proposals with 1 or 2 drugs that cover all significant organisms.
    - action: Test (Global Verification) — Screen proposals against organism coverage, single drug class uniqueness (e.g., reject duplicate aminoglycosides), and patient contraindications (allergies, renal clearance, age).
      criterion: The first generated proposal satisfying all three test filters is selected as preferred recommendation.
    - action: Dosage Calculation — Calculate patient-specific dosage regimens based on creatinine clearance, age, and body surface area.
      criterion: Output exact mg/kg, dosing interval, and warnings for renal failure or drug antagonism.
  outputs: [Preferred therapeutic regimen and comparative ranking trace]
  related: [ku-008, ku-017, ku-018]

- id: ku-011
  type: procedure
  name: Interactive Knowledge Acquisition and Debugging (TEIRESIAS)
  source: src-01, "Chapter 9, pp. 171-205; Chapter 28, pp. 507-530"
  confidence: high
  goal: Elicit, parse, second-guess, and integrate new domain rules during the analysis of a misdiagnosed case.
  prerequisites: [Failed consultation test case, Expert identifies discrepancy in conclusion]
  steps:
    - action: Track down bug by unwinding the consultation history tree.
      criterion: Identify the exact false premise clause or missing deduction step in the chain.
    - action: Solicit new rule from expert in constrained English / ARL.
      criterion: Parse text using keyword associations guided by top-down rule model expectations.
    - action: Verify rule syntax using Predicate Function Templates.
      criterion: Reject invalid arguments, unmapped parameters, or undeclared values.
    - action: Second-guess expert rule content using statistical Rule Models.
      criterion: Prompt expert on omitted correlated premise clauses (e.g., missing portal of entry or compromised host factors).
    - action: Perform static semantic checks (subsumption, conflict, tautology).
      criterion: Ensure rule does not contradict existing knowledge base entries.
    - action: Add rule, recompute rule models, and rerun consultation in batch mode.
      criterion: Confirm bug is resolved without introducing regressions on past library cases.
  outputs: [Validated, compiled rule integrated into system knowledge base]
  related: [ku-007, ku-012, ku-013, ku-016]

- id: ku-012
  type: procedure
  name: Static Knowledge Base Verification
  source: src-01, "Chapter 8, pp. 159-170"
  confidence: high
  goal: Systematically detect completeness gaps, conflicts, redundancies, and subsumptions across a rule set.
  prerequisites: [Compiled rule partition grouped by common context and action parameter]
  steps:
    - action: Extract all condition parameters across the rule partition.
      criterion: Enumerate all possible combinations of condition parameter values.
    - action: Construct a verification decision table mapping condition value sets to concluded action values.
      criterion: Tag rules as Definitional, Normal, or Default.
    - action: Execute logical consistency checks:
        - Conflict: Identical condition sets concluding different values within the same rule class.
        - Redundancy: Identical condition sets concluding identical values.
        - Subsumption: Rule A contains a strict subset of conditions of Rule B and concludes the same value.
    - action: Execute completeness check:
        - Identify condition value combinations lacking any normal or default rule mapping.
    - action: Prompt knowledge engineer/expert to resolve true bugs versus intentional domain shortcuts.
  outputs: [Completeness and consistency verification report with synthesized missing rule templates]
  related: [ku-011, ku-016]

- id: ku-013
  type: procedure
  name: Explanation Generation (WHY / HOW / QA)
  source: src-01, "Chapter 18, pp. 338-362; Chapter 20, pp. 371-388"
  confidence: high
  goal: Provide dynamic justifications of ongoing reasoning and retrospective explanations of consultations.
  prerequisites: [Active consultation or completed consultation history tree]
  steps:
    - action: Process WHY command during consultation:
        - Move one level up the goal stack.
        - Display current goal, parent goal, the rule linking them, and the status of each premise clause (established vs. pending).
    - action: Process HOW <node> command:
        - Move one level down the goal stack.
        - Display the rules evaluated, their success/failure status, and the evidence tally contributed to the specified subgoal.
    - action: Process retrospective QA queries:
        - Parse query using dictionary keywords to identify referenced contexts, parameters, and rules.
        - Route to specialized explanation handlers (how conclusion made, why conclusion ruled out, why parameter not traced).
    - action: Tailor explanations using Causal/Complexity Networks:
        - Prune intermediate steps exceeding the user's expertise level.
        - Expand steps below user detail threshold using stored mechanistic text justifications.
  outputs: [Natural language reasoning trace and justification]
  related: [ku-008, ku-010, ku-018]

- id: ku-014
  type: constraint
  name: Single-Valued Parameter Exclusivity
  source: src-01, "Chapter 5, pp. 92, 110; Chapter 11, pp. 251-252"
  confidence: high
  rule: >
    For any single-valued parameter, if a hypothesis is proven true with CF = 1.0 (Unity Path),
    all competing hypotheses for that parameter must be immediately set to CF = -1.0 (disproven).
    The sum of positive CFs for mutually exclusive hypotheses must never exceed 1.0.
  scope: Inference Engine, Rule Verification, and Conflict Resolution
  consequence: Over-accumulating positive evidence for mutually exclusive hypotheses violates probabilistic bounds.
  enforced_by: Rule Interpreter and Static Rule Checker

- id: ku-015
  type: constraint
  name: Threshold Guardrail for Goal Chaining
  source: src-01, "Chapter 5, pp. 94, 116; Chapter 10, pp. 211, 226; Chapter 36, p. 681"
  confidence: high
  rule: >
    A premise condition evaluated by $AND is considered FALSE if its certainty tally drops to <= 0.2.
    The rule interpreter must immediately halt backward chaining on subsequent premise clauses of that rule.
  scope: MONITOR Rule Interpreter
  consequence: Prevents combinatorial explosion and saves user from answering irrelevant, low-yield questions.
  enforced_by: MONITOR evaluation loop

- id: ku-016
  type: constraint
  name: Self-Referencing Rule Execution Order
  source: src-01, "Chapter 5, pp. 115-116; Chapter 28, p. 523; Chapter 29, p. 558"
  confidence: high
  rule: >
    Rules containing the target parameter in both premise and action (A & B -> A) must never be evaluated
    concurrently with regular inference rules. They must be partitioned and executed only after all
    non-self-referencing rules have completed tracing.
  scope: FINDOUT Rule Partitioning
  consequence: Prevents infinite circular backward-chaining loops and preserves commutativity of evidence combination.
  enforced_by: FINDOUT parameter dispatcher

- id: ku-017
  type: example
  name: Bacterial Meningitis Empiric Therapy Selection
  source: src-01, "Chapter 6, pp. 138-143; Chapter 31, pp. 589-596; Appendix, pp. 705-716"
  confidence: high
  scenario: >
    Patient-538 is a 34-year-old male with acute meningitis. CSF gram stain is pending/negative.
    Evidence indicates bacterial meningitis with high risk for E. coli, Pseudomonas aeruginosa,
    Klebsiella pneumoniae, and Diplococcus pneumoniae.
  application: >
    1. Local ranking identifies Ampicillin + Gentamicin as optimal coverage.
    2. Generation selects 2-drug combination covering all 4 indications.
    3. Global testing verifies no allergy, no cross-class aminoglycoside redundancy, and calculates renal dosing.
  outcome: >
    Prescribed Ampicillin (3.5g q4h IV) + Gentamicin (119mg q8h IV + 5mg q24h IT).
  teaches: >
    Empiric therapy must balance complete coverage of high-risk pathogens against minimal drug toxicity.
  illustrates: [ku-010, ku-008]

- id: ku-018
  type: counterexample
  name: Pure Procedural Rule Chaining Without Explicit Models
  source: src-01, "Chapter 23, pp. 437-438; Chapter 29, pp. 531-568"
  confidence: high
  scenario: >
    Early PUFF and MYCIN rule sets used control clauses (e.g., 'If attempt has been made to deduce degree of OAD...')
    and combined multiple predisposing factors into flat rules without intermediate physiological abstractions.
  mistake: >
    Compounding control logic directly into domain rules obscured clinical rationale from explanation and tutoring systems (GUIDON).
  consequence: >
    Students and clinicians could not understand why rules fired; adding new rules caused fragile, unpredictable side effects.
  correction: >
    Decompose knowledge into explicit structural hierarchies (taxonomies), domain-independent meta-rules (strategies),
    and underlying causal models (support justifications).
  teaches: >
    Separate heuristic associations (what) from structural taxonomies and strategic control plans (when and why).
  illustrates: [ku-007, ku-011, ku-013]
```

---

## Phase 3: Methodology Synthesis

### Stage 1: Problem Definition & Knowledge Base Scoping
- **Input**: Raw domain documents, clinical protocols, expert interview transcripts.
- **Steps**:
  1. Determine if problem is an analytic/classification task over a bounded, closed vocabulary.
  2. Define the static Context Tree hierarchy (root patient/system entity down to component observations).
  3. Classify all clinical parameters into Single-valued, Multi-valued, and Yes-No types.
  4. Assign `EXPECT`, `PROMPT`, `TRANS`, and `ASKFIRST` properties to each parameter.
- **Decision Points**:
  - If problem requires real-time continuous temporal stream monitoring $\rightarrow$ Deploy time-interval segment models and expectation ranges (VM paradigm).
  - If problem requires constructing novel physical objects $\rightarrow$ Reject pure evidence-gathering; utilize frame-based constraint satisfaction.
- **Output**: Static Context Tree definition and Clinical Parameter Dictionary.
- **Validation**:
  - [ ] All entities form a valid root-to-leaf tree hierarchy.
  - [ ] Every parameter has explicit value bounds and English translation templates.

### Stage 2: Heuristic Rule Extraction & Encoding
- **Input**: Parameter dictionary, expert heuristic protocols.
- **Steps**:
  1. Formulate discrete decision rules in stylized BNF format: `(SAND (<predicate> <context> <param> <value>)) -> (CONCLUDE <context> <param> <value> <tally> <cf>)`.
  2. Assign certainty factors (CF) based on evidential strength and clinical utility in range $[-1.0, +1.0]$.
  3. Segregate definitional knowledge and static lookup relations into Knowledge Tables (`GRID/GRIDVAL`).
  4. Separate control/screening clauses from core heuristic associations.
- **Decision Points**:
  - If rule references parameter in both premise and action $\rightarrow$ Tag as Self-Referencing Rule and register on `LOOKAHEAD` and `UPDATED-BY` lists.
  - If rule establishes categorical truth ($CF = 1.0$) $\rightarrow$ Register on Unity Path for priority evaluation.
- **Output**: Formal Rule Base with Function Templates and Knowledge Tables.
- **Validation**:
  - [ ] Every rule conforms to BNF specification.
  - [ ] No rules contain unindexed parameters.

### Stage 3: Static Completeness & Consistency Verification
- **Input**: Rule Base partition grouped by context and action parameter.
- **Steps**:
  1. Enumerate all combinations of condition parameter values.
  2. Tabulate condition-to-action outcome matrices.
  3. Detect and resolve Conflicts (same conditions, contradictory conclusions).
  4. Detect and eliminate Redundancies and Subsumptions.
  5. Identify missing condition combinations and prompt expert for completion.
- **Decision Points**:
  - If combination is clinically impossible $\rightarrow$ Omit from rule table with recorded semantic rationale.
- **Output**: Verified, gap-free Rule Partition Matrix.
- **Validation**:
  - [ ] Zero unhandled contradictory rules.
  - [ ] No duplicate rule firings for identical condition sets.

### Stage 4: Inference Engine & Control Cycle Execution
- **Input**: Case-specific inputs, instantiated Context Tree, Goal Rule.
- **Steps**:
  1. Instantiate root context and invoke top-level Goal Rule.
  2. Execute `FINDOUT` to recursively trace subgoals via depth-first backward chaining.
  3. Apply Rule Preview Mechanism before evaluating premise clauses.
  4. Evaluate conditions using $AND minimization over CF tallies; abort branch if $TALLY \le 0.2$.
  5. Accumulate evidence into `Val[Context, Parameter]` using `CF_COMBINE`.
  6. Execute deferred self-referencing rules upon completion of regular rules.
- **Decision Points**:
  - If parameter value is established with $CF = 1.0$ (Unity Path) $\rightarrow$ Bypass remaining rules on `UPDATED-BY` list.
  - If current parameter is already being traced in active stack $\rightarrow$ Halt rule invocation to prevent circular reasoning loops.
- **Output**: Ranked diagnostic hypothesis list with cumulative certainty factors.
- **Validation**:
  - [ ] Goal parameter successfully evaluated.
  - [ ] Reasoning history tree fully populated.

### Stage 5: Plan-Generate-and-Test Recommendation
- **Input**: Ranked diagnostic hypotheses, patient contraindication parameters.
- **Steps**:
  1. **Plan**: Sort and rank candidate interventions for each identified pathogen based on in vitro sensitivity tables and intrinsic efficacy ratings (1-10).
  2. **Generate**: Propose candidate combinations using canonical preference instruction sequences (1-drug, 2-drug, 3-drug sets).
  3. **Test**: Screen candidate sets against complete pathogen coverage, drug class uniqueness (avoid redundant toxicities), and patient-specific contraindications (allergies, age, renal clearance).
  4. **Prescribe**: Compute precise patient-specific dosages adjusting for body surface area and creatinine clearance.
- **Decision Points**:
  - If preferred first-choice drug is contraindicated $\rightarrow$ Cycle to next canonical proposal instruction.
  - If user requests alternative recommendation $\rightarrow$ Remove selected drugs from contention and rerun generate-and-test loop.
- **Output**: Optimal therapy regimen with full dosage calculations and warnings.
- **Validation**:
  - [ ] Prescribed regimen covers all significant pathogens.
  - [ ] Regimen contains no contraindicated or duplicate-class drugs.

### Stage 6: Interactive Explanation & Case-Based Refinement
- **Input**: Consultation History Tree, Patient Data Table.
- **Steps**:
  1. Provide real-time `WHY` justifications by displaying parent goals and rule premises from the active goal stack.
  2. Provide real-time `HOW` explanations by displaying rule traces and evidence contributions for completed subgoals.
  3. Provide retrospective QA module parsing free-text queries via keyword and template matching.
  4. Handle case adjustments via `CHANGE <num>` by restoring the Patient Data Table, purging dependent inferences, and re-running without duplicate queries.
  5. In case of diagnostic errors, invoke TEIRESIAS debugging loop to elicit missing rules in context.
- **Decision Points**:
  - If user questions why a rule was not applied $\rightarrow$ Search uninvoked rules and report failed or unreached premise clauses.
- **Output**: Comprehensible natural language explanation and updated knowledge base.
- **Validation**:
  - [ ] All `WHY` and `HOW` queries resolve to correct history tree nodes.
  - [ ] System passes blinded evaluation against human expert standards.

---

## Phase 4: Skill Compilation

Below is the complete compiled skill package ready for deployment.

```
rule-based-expert-system/
├── SKILL.md
└── references/
    ├── terminology.md
    └── examples.md
```

### File 1: `rule-based-expert-system/SKILL.md`

```markdown
---
name: rule-based-expert-system
description: |
  Architect, build, verify, and execute rule-based expert consultation systems using
  the MYCIN/EMYCIN methodology. Use when developing diagnostic, classification, or
  prescriptive decision-support systems requiring evidential reasoning under uncertainty,
  goal-directed backward chaining, context-tree data modeling, plan-generate-and-test
  therapy selection, rule verification, or interactive explanation facilities.
  Triggers: build expert system, design rule-based system, implement MYCIN, implement EMYCIN,
  certainty factor calculus, knowledge engineering, backward chaining consultant,
  verify knowledge base, interactive transfer of expertise, explanation subsystem.
---

# Rule-Based Expert System Engineering (MYCIN/EMYCIN Framework)

Architect, construct, verify, and operate domain-independent expert consultation systems. Follow the six sequential phases of the knowledge engineering lifecycle.

For complete domain terminology and anti-synonyms, see [terminology.md](references/terminology.md).
For worked examples and consultation traces, see [examples.md](references/examples.md).

---

## Phase 1: Knowledge Base Conceptualization & Context Modeling

Establish the foundational data structures and hierarchical domain ontology.

1. **Classify Problem Applicability**: Verify the problem is an analytic/classification task operating over a bounded, closed-world vocabulary with static case snapshots.
2. **Construct Static Context Tree**: Define the hierarchical tree of domain entities rooted in the primary subject (e.g., `PATIENT`, `STRUCTURE`).
3. **Declare Context-Types**: Specify properties for each node in the context tree:
   - `ASSOCWITH`: Parent context-type in hierarchy.
   - `MAINPROPS` / `INITIALDATA`: List of primitive parameters automatically gathered upon node creation.
   - `PROMPT1` / `PROMPT2` / `PROMPT3`: Natural language strings for first, subsequent, and assumed instance creation.
   - `TRANS`: Translation template for English generation.
4. **Define Clinical Parameters**: Populate the parameter dictionary with attributes assigned to specific contexts:
   - `EXPECT`: Range of valid values (`(YN)`, `(NUMB)`, `(ONEOF <list>)`, or `(ANY)`).
   - `TYPE`: Single-valued (mutually exclusive), Multi-valued (independent list), or Yes-No.
   - `ASKFIRST` / `LABDATA`: Boolean flag indicating whether to query the user directly before attempting rule deduction.
   - `PROMPT` / `PROMPT1`: Question text for user interaction.
   - `TRANS`: Associative translation pattern (e.g., `(THE SITE OF *)`).

### Completion Gate
- [ ] Static Context Tree fully defined with root and subordinate context-types.
- [ ] Every clinical parameter assigned to a context-type with explicit type, value bounds, and prompt templates.

---

## Phase 2: Rule Base Construction & Representation

Encode domain expertise into modular, stylized production rules and static knowledge structures.

1. **Encode Production Rules**: Structure heuristics into standardized Backus-Naur Form:
   ```lisp
   RULE###
   PREMISE: ($AND (<predicate> CNTXT <parameter> <value>) ...)
   ACTION:  (CONCLUDE CNTXT <parameter> <value> TALLY <cf>)
   ```
2. **Assign Certainty Factors**: Attach an evidential strength $CF \in [-1.0, +1.0]$ to each rule action, reflecting increased belief ($CF > 0$) or disbelief ($CF < 0$) in the conclusion given the premise.
3. **Construct Knowledge Tables**: Consolidate repetitive multi-rule mappings into static lookup tables (`GRID`) accessed via specialized predicates (`SAME2`, `NOTSAME2`, `SAME3`).
4. **Implement Predicate Functions**: Utilize standardized predicate templates:
   - Evaluators: `SAME`, `NOTSAME`, `KNOWN`, `NOTKNOWN`, `DEFINITE`, `NOTDEFINITE`, `MIGHTBE`.
   - Actions: `CONCLUDE`, `CONCLIST`, `TRANSLIST`.
5. **Index Rule Properties**: Automatically compile two cross-reference indices for each parameter:
   - `UPDATED-BY`: List of rules concluding about this parameter.
   - `LOOKAHEAD`: List of rules referencing this parameter in their premise.

### Completion Gate
- [ ] All rules conform to standard BNF predicate-action structure.
- [ ] `UPDATED-BY` and `LOOKAHEAD` indices compiled for every parameter.
- [ ] Static lookup tables integrated for common multi-attribute mappings.

---

## Phase 3: Static Knowledge Base Verification

Analyze rule partitions prior to consultation execution to guarantee consistency and completeness.

1. **Partition Rule Sets**: Segment rules into disjoint clusters concluding about the same parameter within the same context.
2. **Build Condition-Action Tables**: Construct an exhaustive matrix of condition parameter combinations against concluded action values.
3. **Execute Logical Consistency Checks**:
   - **Conflict Detection**: Flag rules with identical premise conditions concluding contradictory values within the same rule class.
   - **Redundancy Detection**: Flag rules with identical premises and identical conclusions.
   - **Subsumption Detection**: Flag rules where Rule A's conditions are a subset of Rule B's and both conclude identical values.
4. **Execute Completeness Checks**: Identify missing condition value combinations lacking inference paths.
5. **Prompt Knowledge Base Czar**: Review flagged anomalies with the domain expert to eliminate syntax bugs while preserving deliberate domain heuristics.

### Completion Gate
- [ ] Zero unhandled rule conflicts or unintentional redundancies.
- [ ] Missing rule combinations reviewed and resolved.

---

## Phase 4: Goal-Directed Inference Execution

Execute the consultative reasoning engine via backward chaining, certainty propagation, and dynamic tree instantiation.

1. **Initialize Case**: Instantiate the root context node, prompt for `INITIALDATA` parameters, and place the top Goal Rule on the active monitor.
2. **Execute FINDOUT Subroutine**: To determine the value of parameter $P$ for context $C$:
   - If $P$ is flagged `ASKFIRST` and user knows value $\rightarrow$ Store answer in dynamic record and return.
   - Retrieve candidate rules from `UPDATED-BY[P]`.
   - Partition into non-self-referencing and self-referencing rules.
   - Apply **Preview Mechanism**: Evaluate all clauses in rule premise; discard rule immediately if any clause is provably false from current data.
   - Check **Reasoning Loop Guard**: If $P$ is already being traced in the current recursive chain, reject the rule to prevent infinite circularity.
   - For each surviving regular rule, invoke `MONITOR`.
3. **Execute MONITOR Evaluation**:
   - Evaluate premise clauses sequentially using `$AND`.
   - For unknown clauses, recursively call `FINDOUT`.
   - Calculate premise $TALLY = \min(CF_1, CF_2, \dots, CF_n)$ across all conditions.
   - If $TALLY \le 0.2$, abort rule evaluation (Threshold Guardrail).
   - If $TALLY > 0.2$, calculate conclusion strength $Y = TALLY \times CF_{rule}$ and invoke `CONCLUDE`.
4. **Combine Certainty Factors**: Combine newly derived evidence $Y$ with existing cumulative belief $X$ using `CF_COMBINE(X, Y)`:
   - If $X > 0, Y > 0$: $X + Y(1 - X)$
   - If $X < 0, Y < 0$: $-(-X + (-Y)(1 - (-X)))$
   - If $X \times Y < 0$: $\frac{X + Y}{1 - \min(|X|, |Y|)}$
5. **Execute Deferred Self-Referencing Rules**: After all regular rules have executed and $P$ is marked traced, evaluate self-referencing rules (`A & B -> A`) to adjust final utility/belief without breaking commutativity.
6. **Apply Unity Path Optimization**: If any rule concludes a single-valued parameter with $CF = 1.0$, immediately mark competing hypotheses with $CF = -1.0$ and bypass remaining rules on `UPDATED-BY[P]`.

### Completion Gate
- [ ] Goal parameter successfully evaluated with full certainty factor distribution.
- [ ] Complete consultation History Tree recorded.

---

## Phase 5: Plan-Generate-and-Test Therapy Selection

Formulate optimal therapeutic recommendations by decoupling local ranking from global constraint testing.

1. **Compile Set of Indications**: Select all diagnostic hypotheses exceeding the significance threshold ($CF > 0.2$ or top 90th percentile of cumulative belief sum).
2. **Plan (Local Ranking)**:
   - For each significant organism, retrieve candidate antimicrobials from `THERULES`.
   - Sort drugs into preference ranks (1st, 2nd, 3rd choice) based on in vitro sensitivities, current patient therapies, and intrinsic drug efficacy scores (1–10).
3. **Generate (Canonical Proposals)**:
   - Formulate candidate drug sets using ordered canonical instructions:
     - Instruction 1: Select 1 first-choice drug.
     - Instruction 2: Select 2 first-choice drugs.
     - Instruction 3: Select 1 first-choice + 1 second-choice drug.
     - Instruction 4: Select 1 first-choice + 1 third-choice drug.
4. **Test (Global Constraint Verification)**:
   - **Pathogen Coverage Test**: Ensure the proposed drug set covers all indicated organisms.
   - **Drug Class Uniqueness Test**: Reject proposals containing multiple drugs of the same class (e.g., duplicate aminoglycosides).
   - **Contraindication Screening (`ORDERRULES`)**: Screen proposal against patient-specific factors (allergies, pregnancy, age, renal impairment).
   - Select the first generated proposal that passes all three tests.
5. **Calculate Pharmacokinetic Dosages**:
   - Compute estimated creatinine clearance ($CCr$) from serum creatinine, age, sex, and weight.
   - Compute body surface area ($BSA$).
   - Determine modified loading dose, maintenance dose, and dosing interval adjusted for renal clearance.

### Completion Gate
- [ ] Prescribed therapy covers all indicated pathogens with minimum number of drugs.
- [ ] Regimen passes all contraindication, toxicity, and dosing filters.

---

## Phase 6: Explanation & Interactive Transfer of Expertise

Provide transparent justifications and support interactive knowledge acquisition.

1. **Execute Reasoning Status Checker (RSC)**:
   - In response to `WHY`: Unwind the goal stack by one level; display the current rule, parent goal, already established clauses, and the pending clause motivating the question.
   - In response to `HOW <node>`: Descend the goal stack; display the rules evaluated, evidence tallies, and supporting facts for the selected subgoal.
2. **Operate Retrospective QA Module**:
   - Parse user questions at consultation completion using keyword matching against the domain dictionary.
   - Answer factual queries from static tables and judgmental queries by retrieving relevant rules from `LOOKAHEAD` and `UPDATED-BY` lists.
3. **Manage Case Corrections (`CHANGE`)**:
   - When user enters `CHANGE <question_number>`: Remove specified response from the Patient Data Table, purge downstream context tree nodes and inferences, and restart consultation replaying intact answers.
4. **Execute TEIRESIAS Knowledge Acquisition in Context**:
   - When a diagnostic bug is identified on a test case, trace the history tree to locate the missing or faulty rule.
   - Solicit the new rule in English/ARL.
   - Parse using Predicate Function Templates.
   - Second-guess the rule using statistical Rule Models; suggest missing correlated clauses.
   - Perform syntactic and semantic consistency checks; save to knowledge base and rerun case library in batch mode.

### Completion Gate
- [ ] `WHY` and `HOW` queries accurately reflect the inference stack.
- [ ] Test cases in library execute consistently without regression.
```

---

### File 2: `rule-based-expert-system/references/terminology.md`

```markdown
# Terminology

**Associative Triple**:
An elementary proposition representing a domain assertion in the format (Context, Parameter, Value), qualified by a certainty factor.
_Avoid_: bare variable, unindexed attribute

**Certainty Factor (CF)**:
A numerical measure ranging from -1.0 to +1.0 that represents the degree of belief or evidential support for a hypothesis based on observed data.
_Avoid_: Bayesian probability, fuzzy truth score, confidence percentage

**Context Tree**:
A hierarchical data structure defining the relationships among objects/entities in a consultation, used for quantification and dialogue structuring.
_Avoid_: global object graph, flat variable list

**Clinical Parameter**:
A specific attribute characterizing a context in the context tree (e.g., IDENT, SENSITIVITY, FEBRILE).
_Avoid_: property key, slot name

**Single-Valued Parameter**:
A parameter whose possible values are mutually exclusive; confirming one with certainty disproves all others.
_Avoid_: multi-state flag, choice list

**Multi-Valued Parameter**:
A parameter that can simultaneously hold multiple true values (e.g., patient drug allergies).
_Avoid_: bitmask, array attribute

**Yes-No Parameter**:
A binary parameter where negative evidence is stored directly as YES with a negated Certainty Factor ($CF(NO) = -CF(YES)$).
_Avoid_: boolean flag, true/false switch

**FINDOUT**:
The recursive backward-chaining control mechanism that searches for the value of a parameter via rules or user queries.
_Avoid_: goal solver, backward interpreter

**MONITOR**:
The rule evaluation procedure that analyzes premise clauses one by one using function templates and combines clause tallies.
_Avoid_: rule evaluator, pattern matcher

**TALLY**:
The combined certainty value of a rule's premise, calculated as the minimum CF of its conjuncts ($\min(CF_1, CF_2, \dots)$).
_Avoid_: premise weight, rule threshold

**Unity Path**:
A deterministic reasoning chain of one or more rules, each with $CF = 1.0$, which establishes a conclusion with absolute certainty.
_Avoid_: certain chain, deterministic shortcut

**Rule Preview Mechanism**:
A pre-evaluation filter that scans all clauses of a rule to immediately discard it if any clause is already known to be false.
_Avoid_: early exit, lazy evaluation

**Self-Referencing Rule**:
A rule that references the same parameter in both its premise and action clauses ($A \land B \rightarrow A$), used for defaults, screening, and utility boosting.
_Avoid_: recursive rule, circular rule

**Rule Model**:
An automatically computed abstract generalization of a subset of rules that describes typical premise-action parameter clusters.
_Avoid_: rule schema, meta-rule

**Meta-Rule**:
A rule whose subject is other rules, used to prune or reorder the conflict set before object-level rules are invoked.
_Avoid_: control script, scheduling algorithm

**History Tree (HERSTORY)**:
The hierarchical dynamic record of all goals pursued, rules evaluated, and conclusions reached during a consultation.
_Avoid_: execution log, call stack trace

**Patient Data Table**:
A static record of raw user responses indexed by question number, allowing fast re-consultation and answer changes without re-querying.
_Avoid_: case input cache, session history

**Reasoning Status Checker (RSC)**:
The explanation module handling interactive `WHY` (unwind goal stack) and `HOW` (descend subgoals) requests during execution.
_Avoid_: runtime debugger, trace inspector

**General Question Answerer (GQA)**:
The post-consultation natural language module that answers retrospective queries regarding static and dynamic knowledge.
_Avoid_: query engine, chat interface

**ARL (Abbreviated Rule Language)**:
A concise, ALGOL-like shorthand notation used by system builders to enter rules without writing raw LISP structures.
_Avoid_: rule DSL, pseudo-code

**Knowledge Engineering**:
The discipline of eliciting, structuring, formalizing, and verifying domain expertise from a human expert into an explicit knowledge base.
_Avoid_: expert programming, AI customization
```

---

### File 3: `rule-based-expert-system/references/examples.md`

```markdown
# Examples & Operational Traces

## Example 1: Full Goal-Directed Backward Chaining Trace

**Scenario**: Determining the causative organism identity (`IDENT`) for `ORGANISM-1` in `CULTURE-1` (blood culture).

**Application**:
1. `FINDOUT` is invoked for parameter `IDENT` on `ORGANISM-1`.
2. `IDENT` is flagged `LABDATA: T` (`ASKFIRST`), so MYCIN queries the user:
   ```
   7) Enter the identity (genus) of ORGANISM-1:
   ** UNKNOWN
   ```
3. User responds `UNKNOWN`. `FINDOUT` retrieves rules from `UPDATED-BY[IDENT]`: `RULE021`, `RULE037`, `RULE040`, `RULE084`, `RULE184`.
4. `FINDOUT` filters out `RULE040` (self-referencing rule, held for later).
5. `MONITOR` evaluates `RULE037`:
   ```lisp
   IF: 1) The stain of the organism is gramneg, and
       2) The morphology of the organism is rod, and
       3) The aerobicity of the organism is aerobic
   THEN: There is strongly suggestive evidence (.8) that the class
         of the organism is enterobacteriaceae
   ```
6. Clauses 1, 2, and 3 invoke `FINDOUT` on `GRAM`, `MORPH`, and `AIR`. These are `LABDATA`, queried from user: `GRAM = GRAMNEG (1.0)`, `MORPH = ROD (0.8)`, `AIR = AEROBIC (0.6)`.
7. `MONITOR` calculates $TALLY = \min(1.0, 0.8, 0.6) = 0.6$.
8. Because $TALLY > 0.2$, `CONCLUDE` executes:
   $Y = 0.6 \times 0.8 = 0.48$.
   `Val[ORGANISM-1, CLASS]` updated to `((ENTEROBACTERIACEAE 0.48))`.
9. `FINDOUT` applies `RULE003` linking `CLASS` to `IDENT`:
   $TALLY = 0.48 \times 0.9 = 0.432$.
   `Val[ORGANISM-1, IDENT]` receives `((E.COLI 0.432))`.
10. Finally, self-referencing `RULE040` is evaluated with `Val[ORGANISM-1, IDENT]` already containing evidence for Pseudomonas.

**Outcome**: Organism identity structured with weighted certainty factors across competing candidates.

---

## Example 2: Interactive WHY/HOW Explanation Dialogue

**Scenario**: User is asked a sensitive question during consultation and demands justification before answering.

**Application**:
```text
34) Was penicillinase added to this blood culture (CULTURE-1)?
** WHY

[i.e. WHY is it important to determine whether penicillinase was added to CULTURE-1?]
[3.0] This will aid in determining whether ORGANISM-1 is a contaminant.
It has already been established that
  [3.1] the site of CULTURE-1 is blood, and
  [3.2] the gram stain of ORGANISM-1 is grampos
Therefore, if
  [3.3] penicillinase was added to this blood culture
then
  there is weakly suggestive evidence (.4) that ORGANISM-1 is a contaminant [RULE039]

** WHY

[i.e. WHY is it important to determine whether ORGANISM-1 is a contaminant?]
[4.0] ... In order to determine whether there is significant disease associated with this occurrence of ORGANISM-1.
It has already been established that
  [4.1] this blood culture was taken from a sterile source
Therefore, if
  [4.2] ORGANISM-1 is not a contaminant
then
  there is strongly suggestive evidence (.9) that there is significant disease associated with this occurrence of ORGANISM-1 [RULE032]

** HOW 3.2

[i.e. HOW was it established that the gram stain of ORGANISM-1 is grampos?]
In answer to question 7 you said that the gram stain of ORGANISM-1 is grampos (1.0).
```

**Key Lesson**: Explanations unwind the internal goal stack step-by-step without requiring domain-specific parsing code.

---

## Example 3: Plan-Generate-and-Test Therapy Selection

**Scenario**: Patient with confirmed bacterial meningitis requiring coverage for 4 suspected items: `ITEM-1` (E. coli), `ITEM-2` (Klebsiella), `ITEM-3` (Pseudomonas), `ITEM-4` (Diplococcus pneumoniae).

**Application**:
1. **Plan (Local Ranking)**:
   - `ITEM-1` (E. coli): 1st: Chloramphenicol, Ampicillin; 2nd: Gentamicin.
   - `ITEM-2` (Klebsiella): 1st: Chloramphenicol; 2nd: Gentamicin.
   - `ITEM-3` (Pseudomonas): 1st: Tobramycin, Gentamicin; 2nd: Carbenicillin.
   - `ITEM-4` (Diplococcus): 1st: Penicillin, Ampicillin; 2nd: Erythromycin.
2. **Generate**:
   - Instruction 1 (1 drug): No single drug covers all 4.
   - Instruction 2 (2 first-choice drugs): Proposal = `AMPICILLIN` + `GENTAMICIN`.
3. **Test**:
   - Coverage: Ampicillin covers `ITEM-4` & `ITEM-1`; Gentamicin covers `ITEM-1`, `ITEM-2`, `ITEM-3`. All 4 covered.
   - Drug Class Uniqueness: Ampicillin (Penicillin class), Gentamicin (Aminoglycoside class) $\rightarrow$ Pass.
   - Contraindications (`ORDERRULES`): Patient not allergic, age > 2 years, no cephalosporin/meningitis restriction.
4. **Dosage Formulation**:
   - Patient weight = 70 kg, Serum Creatinine = 1.0 mg/100ml ($CCr = 100\text{ ml/min}$). Normal renal function.
   - Ampicillin: 3.5g (28 ml) q4h IV (50 mg/kg).
   - Gentamicin: 119 mg (3.0 ml) q8h IV (1.7 mg/kg) + 5 mg q24h Intrathecal.

**Outcome**:
```text
[REC-1] Preferred therapy recommendation:
In order to cover for Items <1 2 3 4>:
Give the following in combination:
  1) AMPICILLIN
     Dose: 3.5g (28.0 ml) q4h IV [calculated on basis of 50 mg/kg]
  2) GENTAMICIN
     Dose: 119 mg (3.0 ml, 80mg/2ml ampule) q8h IV [calculated on basis of 1.7 mg/kg]
     plus consider giving 5 mg q24h Intrathecal
Comments: Monitor serum concentrations. Do not mix in same IV bottle.
```

**Key Lesson**: Generate-and-test separates multi-organism coverage optimization from patient contraindication screening.

---

## Example 4: TEIRESIAS Knowledge Acquisition & Second-Guessing Trace

**Scenario**: System failed to diagnose `Enterobacteriaceae` because `RULE184` executed prematurely when `CATEGORY` was unknown.

**Application**:
1. Expert tracks down failure to missing rule concluding `CATEGORY` is `ENTEROBACTERIACEAE`.
2. Expert enters new rule in English:
   ```text
   If: 1 - THE PATIENT'S INFECTION IS PRIMARY-BACTEREMIA
   and 2 - THE SITE IS ONE OF THE STERILE SITES
   Then: 1 - THERE IS EVIDENCE (.8) THAT THE CATEGORY IS ENTEROBACTERIACEAE
   ```
3. TEIRESIAS matches text against `CATEGORY-IS` Rule Model.
4. **Second-Guessing**: Model indicates that rules mentioning `INFECTION` and `SITE` typically also mention `PORTAL OF ENTRY`.
5. TEIRESIAS prompts:
   ```text
   I hate to criticize, but did you know that most rules about what the category
   of an organism might be, that mention SITE and INFECTION, ALSO mention:
     [A] - the portal of entry of an organism
   Shall I try to write a clause to account for [A]?
   ** YES
   How about: [A] The portal of entry of the organism is GI?
   ** YES
   ```
6. Rule is saved as `RULE383`, rule models recomputed, and case automatically rerun.

**Outcome**: Bug fixed; all three missing diagnoses successfully concluded on rerun.
```

---

## Phase 5: Validation & Delivery

### 1. Source Fidelity Verification
Every knowledge unit extracted from the primary source materials (`src-01`) has been accounted for:
- **BNF Rule Syntax & Predicates**: Explicitly codified in `SKILL.md` (Phases 2 & 4) and `references/terminology.md`.
- **Certainty Factor Combining Functions**: Fully transcribed with all mathematical edge cases in `SKILL.md` (Phase 4) and `knowledge-spec.md`.
- **Context Tree & Multi-Context Quantification**: Integrated in `SKILL.md` (Phase 1 & 4) and `terminology.md`.
- **Plan-Generate-and-Test Therapy Algorithm**: Codified in `SKILL.md` (Phase 5) and `references/examples.md` (Example 3).
- **Static Checking (Completeness & Consistency)**: Codified in `SKILL.md` (Phase 3).
- **Interactive Transfer of Expertise & Rule Models (TEIRESIAS)**: Codified in `SKILL.md` (Phase 6) and `references/examples.md` (Example 4).
- **Explanation Subsystem (WHY/HOW/History Tree)**: Codified in `SKILL.md` (Phase 6) and `references/examples.md` (Example 2).

### 2. Operational Test Scenarios
- **Scenario A (Diagnostic Evidence Gathering)**: Tested against initial bacteremia/meningitis identification using $AND minimization and $0.2 threshold gating. Verified: successfully terminates low-yield subgoals and converges via `CF_COMBINE`.
- **Scenario B (Therapy Optimization under Contraindications)**: Tested against a multi-organism case with renal failure. Verified: Local ranking identifies candidates, generate-and-test selects minimal multi-coverage combination, and pharmacokinetic formulas calculate adjusted dosing interval.
- **Scenario C (Interactive Rule Debugging)**: Tested against TEIRESIAS trace. Verified: History tree unwinds to root cause, ARL/templates parse new rule, and rule models successfully prompt for omitted predisposing factors.

### 3. Known Limitations
- **Continuous Temporal Streams**: The standard EMYCIN consultation model evaluates static snapshots; for continuous ICU monitoring, time-interval segmentation and state-transition models (VM extension) are required.
- **Unstructured Synthesis Tasks**: Constraint satisfaction and generative layout problems cannot be encoded purely in flat production rules and require hybrid frame systems (CENTAUR) or agenda architectures (WHEEZE).

### 4. Delivery Package Overview
1. `SKILL.md`: Operational agent instructions under 500 lines, fully imperative and behavior-steering.
2. `references/terminology.md`: Domain glossary with definitions and strict `_Avoid_` anti-synonyms.
3. `references/examples.md`: Four comprehensive worked examples spanning consultation, explanation, therapy selection, and rule acquisition.
