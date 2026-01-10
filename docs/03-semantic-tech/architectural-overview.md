# The Fandaws Semantic Architecture: A Unified Realist Stack

**Version:** 1.0.0
**Date:** January 2026
**Status:** Architecture Master

---

## 1. Overview

This document outlines the coherent thread connecting the theoretical, engineering, and runtime components of the Fandaws Semantic Ecosystem. The architecture is grounded in **Basic Formal Ontology (BFO)** and implements a **Semantically Honest Middle Layer (SHML)** to bridge the gap between ontological realism and operational logic.

## 2. Component Map

### Layer 1: Theoretical Foundations (The "Why")
These documents define the philosophical and ontological commitments of the system.

*   **[The Semantically Honest Middle Layer](middleLayer.md)**
    *   *Role:* The architectural manifesto. Defines the "Fact-First Fallacy" and the distinction between Reality, Process, and Assertion.
*   **[Grounded Intentionality Theory (GIT)](BFO-Intentionality.md)**
    *   *Role:* The core ontology. Grounds Information Content Entities (ICEs) in intentional acts, providing the basis for accountability.
*   **[Reclaiming Process Qualities](Reclaiming-Process-Qualities.md)**
    *   *Role:* Modeling pattern. Demonstrates how to handle domain-specific classifications (e.g., "Natural" vs "Premature") without violating BFO realism.

### Layer 2: Data Engineering (The "How")
These documents specify how existing data and schemas are mapped into the realist middle layer.

*   **[Semantic Data Dictionary v2.0](SemanticDataDictionary.md)**
    *   *Role:* The contract. Defines how relational tables map to BFO classes, treating rows as assertion events rather than atomic facts.
*   **[Automated Semantic Mapping Pipeline](AutoSemanticMapping.md)**
    *   *Role:* The automation. Describes the Bayesian/Heuristic pipeline for generating SDDs from raw schemas.

### Layer 3: Runtime Services (The "What")
These documents specify the active software systems that operate on the semantic graph.

*   **[Fandaws 3.0: Semantic Negotiation Service](Fandaws-v3.md)**
    *   *Role:* The core engine. A runtime service for negotiating meaning, resolving terms, and validating consistency against the ontology.
*   **[Generative Concretization v2.0 (LLM Integration)](llm_integration.md)**
    *   *Role:* The AI extension. Defines how Large Language Models are integrated as "Generative Concretization Engines," producing Candidate Informational Content (CIC) rather than assertions.

## 3. Unifying Principles

1.  **No Naked Facts:** All assertions are treated as events with provenance (SHML).
2.  **Intentional Grounding:** All information traces back to an agent's intentional act (GIT).
3.  **Process-First:** Classifications are information artifacts derived from process qualities, not distinct process types (Reclaiming Process Qualities).
4.  **Negotiated Meaning:** Ambiguity is resolved through runtime negotiation, not static axioms (Fandaws v3).
5.  **Generative Possibility:** LLM outputs are candidate content until validated (Generative Concretization).

## 4. Implementation Order

1.  **Model:** Apply `BFO-Intentionality` and `Reclaiming-Process-Qualities` to domain.
2.  **Map:** Use `AutoSemanticMapping` to generate `SemanticDataDictionary` for legacy data.
3.  **Deploy:** Instantiate `Fandaws-v3` to serve the graph.
4.  **Extend:** Enable `llm_integration` for generative capabilities.
