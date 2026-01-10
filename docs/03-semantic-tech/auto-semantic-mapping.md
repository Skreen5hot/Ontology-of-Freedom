## Automated Semantic Mapping Pipeline: Version 2.0

**An Intelligent Bridge from Relational Schemas to Realist Ontological Models**

This version incorporates the feedback from the v1.9 review, specifically addressing **Bayesian sensitivity**, **temporal reasoning**, and **inverse relation ambiguity**. The goal is to move from simple "labeling" to a "rigorous inference" of reality.

---

### 1. Enhanced Architecture: The Multi-Signal Pipeline

To mitigate dependence on naming conventions and improve prior accuracy, the pipeline now utilizes a **Weighted Evidence Fusion** model.

#### 2.1 Refined Evidence Layers

* **Structural Evidence:** Beyond PK/FK, the system analyzes **Join Density**. A table with high incoming FKs from "Fact" tables is statistically weighted as an `IndependentContinuant` (e.g., Person), while tables with high outgoing FKs to temporal dimensions are weighted as `bfo:Process`.
* **Lexical Evidence (Domain-Augmented):** Lexical analysis is now cross-referenced with **UMLS (Unified Medical Language System)** and **OBO Foundry** glossaries to distinguish between clinical findings and administrative artifacts.
* **Instance Evidence (Distributional Analysis):** The system calculates **Column Entropy** and **Cardinality**. Low-entropy columns (limited set of strings) are prioritized as `cco:Designation` or `cco:Code`, while high-entropy timestamps are analyzed for **Interval Density** (gaps between start/end dates).

---

### 2. Bayesian Inference with Dynamic Priors

To address **Prior Sensitivity**, the system introduces **Schema-Type Calibration**. Before mapping, the system classifies the *overall database type* (e.g., EHR, Claims, or IoT) to shift priors accordingly.

*  **(Domain Context):** If the schema is identified as "Clinical Records," the prior  for tables containing "Visit" or "Admit" increases significantly.
* **Weighted Confidence Score:** The system outputs a tripartite score: **Lexical Confidence**, **Structural Alignment**, and **Distributional Match**. HITL review is triggered if these signals conflict.

---

### 3. Realist Pattern Logic & Constraint Satisfaction

The system now uses a **Template-Based Constraint Engine** to enforce ontological rigor before the SDD is finalized.

| Template | Logic Guard (Constraint) | Realist Output |
| --- | --- | --- |
| **The Designation Sandwich** | MUST have a 1:1 or N:1 link to an `IC`. Cannot exist in isolation. | `ICE`  `IBE`  `Literal` |
| **Process-Temporal Anchor** | A `bfo:Process` MUST have at least one `bfo:occupies_temporal_region`. | Assigns `bfo:start_instant` and `bfo:end_instant`. |
| **Assertion Provenance** | A `Fact` table must be linked to an `Agent` or `Timestamp`. | Sets `rows_are_assertions: true`. |

---

### 4. Advanced Temporal & Relation Inversion

To solve **Inverse Relation Ambiguity** and **Temporal Gaps**:

* **Conditional Inversion:** Instead of static lookups, the system uses **Relationship Triangulation**. If Table A relates to Table B through a "Role" (e.g., `ResidentRole`), the inverse is automatically constrained to the lifecycle of that role, preventing global inverse errors.
* **Interval Inference (Allen’s Algebra):** The system reviews the `start_date` and `end_date` distributions. If 90% of `end_dates` are NULL, the SDD is automatically configured with `null_semantics: open_world_assertion`, meaning the process is interpreted as "ongoing or status unknown" rather than "ended at null."

---

### 5. Validation & Feedback Loop

The pipeline concludes with a **Projection Simulation**:

1. **Mock RDF Generation:** The system generates a sample graph from the generated SDD.
2. **Path Validation:** It verifies that a query can traverse from a `House` back to a `Person` via the `ActOfOccupancy` (testing Invertibility).
3. **Ontological Consistency Check:** If the projection results in an `IndependentContinuant` (Person) having a `has_text_value` property directly (violating SDD v2.0 realism), the mapping is rejected and sent to HITL.
