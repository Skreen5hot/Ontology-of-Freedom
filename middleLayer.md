# A Semantically Honest Middle Layer Between Reality and Logic

## Bridging Realism, Computation, Human Understanding, and Belief-Scoped Reasoning

**Aaron Damiano**
*Fandaws Ontology Service*

---

## Executive Summary

Semantic systems today are caught between two incompatible demands: **ontological realism** (fidelity to what exists and occurs) and **logical formalism** (computable, interoperable representations). Existing semantic web technologies resolve this tension by collapsing meaning into static predicates, treating logical assertions as if they were direct mirrors of reality. The result is systems that are logically precise but explanatorily opaque, brittle under change, and incapable of representing disagreement, uncertainty, or belief.

This paper proposes a **Semantically Honest Middle Layer (SHML)**. The SHML treats logical assertions not as primitive facts, but as **materialized projections of semantic processes**—acts of observation, interpretation, and assertion carried out by agents in contexts. By explicitly modeling these processes, the SHML preserves realism while preventing the logic layer from being overloaded with axioms, reification, and false certainty.

Version 3.0 extends this architecture to explicitly support **belief-scoped and counterfactual reasoning**, enabling systems to represent multiple competing fact sets, reason conditionally over them, and compare their plausibility—without abandoning realism or computability.

---

## 1. The Problem: The Predicate Shortcut and the Fact-First Fallacy

### 1.1 The Predicate Shortcut

In most semantic systems, we take a shortcut directly from observation to assertion.

* **Reality:** A factory sensor records a temperature spike; an algorithm interprets this as abnormal.
* **The Shortcut:**
  `(Machine_A) (hasStatus) (Malfunctioning)`

This shortcut collapses critical context:

* which sensor produced the reading
* which algorithm and threshold were used
* when the interpretation occurred
* who is responsible for the conclusion

To recover this lost meaning, systems resort to RDF reification, named graphs, or dense OWL axioms—approaches that degrade performance, readability, and trust.

---

### 1.2 The Fact-First Fallacy

Underlying this shortcut is a deeper architectural error:

> **The Fact-First Fallacy:**
> the assumption that semantic systems must begin with facts, rather than with the processes that produce them.

In reality, facts are *outputs* of interpretive activity. Treating them as primitives introduces semantic dishonesty at the foundation of the stack.

---

## 2. Design Principle: Semantic Honesty

**Semantic Honesty** is the commitment to never represent a state as a static, global truth if it is in fact the output of a process.

The SHML enforces this principle by:

* treating every assertion as an **Information Artifact**
* modeling its generating process explicitly
* preserving provenance, scope, and temporal validity

This mirrors the realist distinction in BFO between:

* **Continuants** (e.g., machines, people)
* **Occurrents** (e.g., diagnosing, asserting, interpreting)

Assertions belong to the latter.

---

## 3. The Three-Layer Architecture

### 3.1 The Reality Layer (The “What”)

* **Domain:** Entities, events, causal powers
* **Standard:** Realist ontologies (e.g., BFO)
* **Role:** Defines the furniture of the world and the constraints under which it operates

This layer makes no claims about belief, interpretation, or certainty—only about what exists and can occur.

---

### 3.2 The Middle Layer: SHML (The “How”)

* **Domain:** Semantic processes, situations, perspectives, belief scopes
* **Ontological Status:** Information-bearing occurrents (not domain entities)
* **Substrate:** Labeled Property Graphs (LPGs)
* **Role:** Models how assertions come to be—who asserted what, when, why, and under which assumptions

**Key Distinction:**
RDF reification attempts to encode process inside a fact language.
SHML models processes *in their native form* and exposes only their stabilized outputs to the logic layer.

Because LPGs allow properties on relationships, SHML can represent acts of assertion, participation, and interpretation without distorting them into artificial nodes or axioms.

---

### 3.3 The Logic Layer (The “Commitment”)

* **Domain:** Computable facts and public interfaces
* **Substrate:** RDF / OWL / SHACL
* **Role:** Provides simplified, performant, and interoperable views of the middle layer

The logic layer is explicitly **downstream**. It does not define truth; it records commitments.

---

## 4. Projections, Not Mappings

### 4.1 Materialized Projections

To avoid a translation or performance tax, the logic layer is treated as a **materialized projection** of the SHML.

* The SHML is the authoritative event log
* RDF triples are high-performance indexes
* When semantic processes change, projections are regenerated

This enables:

* de-axiomatization of the logic layer
* multiple projections for different stakeholders
* consistent performance characteristics

---

### 4.2 Projection Semantics and Consistency

Projections are **contextual commitments**, not global truths.

* Multiple projections may coexist
* Each projection is internally consistent within its scope
* Accountability is preserved through traceability to the SHML

This bounds the consistency problem without pretending it does not exist.

---

## 5. Assertions as Occurrents

In SHML, assertions are events.

**Traditional:**

```
(Person) -[worksAt]-> (Company)
```

**SHML:**

```
(Person)
  -[participatesIn {role: "Employee", source: "HR_System_01"}]->
(Employment_Assertion_Event)
  <-[participatesIn {role: "Employer"}]-
(Company)
```

This natively supports:

* temporal validity
* provenance
* revision
* disagreement

---

## 6. Belief-Scoped and Counterfactual Reasoning

### 6.1 Beliefs as Semantic Processes

Beliefs are not facts; they are **interpretive processes** that generate assertions.

In SHML:

* different agents may hold different belief scopes
* each belief scope corresponds to a coherent set of assertions
* disagreement does not imply contradiction

Reality remains singular. Beliefs vary.

---

### 6.2 Situations as World Models

What users commonly call “sets of facts” are modeled as:

* situations
* hypotheses
* belief-scoped projections

Each situation can be reasoned over independently.

---

### 6.3 Conditional Reasoning

The system can reason counterfactually:

* *If Situation A were true → Conclusion X*
* *If Situation B were true → Conclusion Y*

Reasoning never crosses scopes unless explicitly compared.

---

### 6.4 Probability and Plausibility

Probability is attached to **belief processes**, not to reality.

SHML allows confidence to be derived from:

* source reliability
* corroboration
* recency
* method of inference

This enables the system to say:

> “If the sensor-based interpretation is correct, shutdown is recommended.
> If the technician’s assessment is correct, continued operation is safe.
> Based on confidence metrics, the technician’s assessment is currently more plausible.”

This form of reasoning is impossible to model honestly in predicate-centric logic alone.

---

## 7. Architectural Benefits

### 7.1 De-Axiomatization Without Meaning Loss

Meaning removed from the logic layer is not lost; it is relocated into explicit processes.

Results:

* simpler ontologies
* faster reasoning
* clearer governance

---

### 7.2 Human-Readable Explanations

Because processes are preserved, the system can generate explanations rather than just answers.

---

### 7.3 Event-Sourced Semantics

The SHML naturally supports replay, audit, and temporal reconstruction—essential for regulated domains.

---

## 8. Relationship to Existing Work

* **BFO:** SHML respects the continuant/occurrent distinction and avoids reifying assertions as entities.
* **RDF & LPG:** RDF expresses commitments; LPGs express causality and process.
* **De-Axiomatization:** SHML is where displaced meaning goes—made explicit and inspectable.

---

## 9. What This Architecture Refuses

SHML explicitly refuses:

* to treat logical artifacts as ontological primitives
* to collapse belief into truth
* to encode uncertainty as weakened facts
* to pretend that disagreement is an edge case

---

## 10. Conclusion

The hardest problem in semantic systems is not scale, expressivity, or performance. It is honesty.

A Semantically Honest Middle Layer allows systems to:

* remain realist
* remain computable
* reason under uncertainty
* explain conclusions to humans

This architecture does not add complexity; it acknowledges complexity that has always existed—and stops hiding it behind predicates.
