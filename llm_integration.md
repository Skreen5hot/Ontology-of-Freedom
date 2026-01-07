# Generative Concretization v2.0

**Integrating Large Language Models into the Semantically Honest Middle Layer**

**Author:** Aaron Damiano

**Organization:** Fandaws Ontology Service

**Date:** January 7, 2026

**Status:** Final Version (White Paper)

---

## Executive Summary

Large Language Models (LLMs) create enormous practical value while remaining notoriously difficult to integrate into ontologically rigorous systems. This tension arises not from model error, but from architectural confusion: LLM outputs are routinely treated as assertions rather than as generated informational artifacts.

This paper extends the **Semantically Honest Middle Layer (SHML)** by introducing LLMs as **Generative Concretization Engines**—material systems that perform physical processes resulting in token-level concretizations that realize candidate informational content. Grounded in **Basic Formal Ontology (BFO)**, this framework enables direct integration of LLMs into a single semantic graph, preserving provenance and accountability while exploiting generative power. The SHML functions as a semantic risk management layer, explicitly representing uncertainty, provenance, and candidate meaning prior to logical commitment.

---

## 1. Why Ontologies Are Hard—and LLMs Are Not

Ontologies are hard because they require **commitment**. Ontology engineering demands explicit category boundaries, stable identity conditions, and global coherence.

LLMs are powerful because they **avoid it**. They sample from high-dimensional statistical space and optimize for plausibility, not truth. The current failure mode is architectural: we ask LLMs to behave like ontologies, and ontologies to behave like LLMs. The SHML resolves this by assigning each system the role it is ontologically capable of playing.

---

## 2. The Core Category Error: Treating Generation as Assertion

### 2.1 The Agent Fallacy

LLMs are often described as “knowing” or “believing.” This causes structural errors. An LLM is a material artifact; its execution is a physical process. At no point does an LLM bear beliefs or intend meanings.

Treating generated text as an assertion collapses the distinction between:

* **Bearer vs. Content:** The system producing the string vs. the meaning of the string.
* **Possibility vs. Commitment:** A statistically likely sequence vs. a claimed fact.

---

## 3. Tokens Are Not Meanings: A Grounded Theory

### 3.1 Token Sequences as Concretizations (SDCs)

In BFO terms, an LLM output is a **Specifically Dependent Continuant (SDC)**. It depends on a particular inference run, a specific model version, and a specific hardware substrate at a specific time.

### 3.2 Informational Content as Generically Dependent Continuants

What users care about is the informational content, which is a **Generically Dependent Continuant (GDC)**. GDCs are shareable across humans and models. Crucially: **LLMs do not generate GDCs directly.** They generate concretizations (SDCs) that *realize* candidate GDCs.

### 3.3 Introducing: Candidate Informational Content (CIC)

Version 2.0 introduces the **Candidate Informational Content (CIC)**, a subclass of GDC representing meaning-like content that has not yet been stabilized as a claim.

* **Examples:** Hypotheses, paraphrases, summaries, or diagnoses.
* **Function:** Allows the system to model creativity without corrupting the logic layer.

Unlike propositions, CICs are not truth-apt; they become truth-apt only through promotion.

---

## 4. LLMs as Generative Concretization Engines

### 4.1 Inference Runs as Occurrents

An LLM invocation is a **Process (Occurrent)**. It has temporal extent, consumes inputs, and produces outputs. This process does not "reason"; it samples.

### 4.2 Probability as a Process Property

Logits and temperatures are properties of the **generation process**, not measures of "epistemic confidence." SHML records these as process metadata, ensuring that statistical noise is never mistaken for semantic certainty.

---

## 5. SHML as the Native Integration Layer

Unlike Retrieval-Augmented Generation (RAG), which augments inputs while leaving the generative act ontologically opaque, SHML models the generative act itself as a first-class semantic event.

### 5.1 Canonical SHML Pattern

```cypher
// 1. The Generative Process (Occurrent)
CREATE (run:Occurrent:InferenceRun {
  id: "evt_001",
  model: "GPT-4_Turbo",
  temperature: 0.7,
  timestamp: "2026-01-07T10:00:00Z"
})

// 2. The Token Artifact (SDC)
CREATE (output:SDC:Concretization {
  raw_text: "Pump failure imminent"
})

// 3. Candidate Informational Content (GDC)
CREATE (cic:GDC:CandidateContent {
  normalized_form: "pump_status_critical"
})

// 4. Provenance
CREATE (run)-[:GENERATED]->(output)
CREATE (output)-[:REALIZES]->(cic)

```

---

## 6. From Candidate Content to Commitment

### 6.1 Evaluation as a Distinct Occurrent

Semantic commitment is never automatic. An **Evaluation Process** consumes Candidate Content and applies criteria (rules, evidence, or human judgment).

### 6.2 Promotion to Assertable Proposition

Only after evaluation is a CIC promoted to an **Assertable GDC**.

1. **Rejection:** CIC remains in the graph as a "generated possibility" but never influences logic.
2. **Promotion:** CIC is linked to a formal assertion.
3. **Projection:** The assertion is materialized in the Logic Layer (e.g., as an RDF triple).

---

## 7. Conclusion

LLMs do not threaten ontological realism; they expose where realism was never fully implemented. By distinguishing **Generation from Assertion**, **Tokens from Content**, and **Content from Commitment**, the Semantically Honest Middle Layer enables a unified architecture.

The result is a system that is:

* **Creative** without being careless.
* **Powerful** without being mystical.
* **Probabilistic** without abandoning truth.

In this architecture, axioms are outcomes—not assumptions.
