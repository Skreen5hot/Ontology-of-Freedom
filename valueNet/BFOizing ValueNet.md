# From Description to Reality: A BFO-Aligned Ontology of Human Values

This document outlines the rationale and methodology behind the refactoring of the ValueNet ontology suite into a realist, modular framework aligned with Basic Formal Ontology (BFO). This work transforms ValueNet from a descriptive model of value *concepts* into a realist model of values as *real features of agents*, enabling a new level of rigor for computational reasoning about human behavior, ethics, and motivation.

## What We Did — BFOizing ValueNet

The original ValueNet provided a valuable integration of key psychological value theories (Schwartz, Haidt) using the DOLCE Ultra Lite (DUL) upper ontology. In this model, a value was represented as a `vcvf:Value`, a subclass of `dul:Description`. A `vcvf:ValueSituation` (a subclass of `dul:Situation`) was a scenario that `dul:satisfies` a value description. This approach, while useful for classification, models values as abstract concepts that are satisfied by situations, rather than as real properties of agents that cause them to act.

Our refactoring was a complete conceptual and structural re-engineering, guided by the principles of ontological realism.

**Conceptual Re-Engineering:** The core change was to re-model values not as descriptions but as **realizable entities** that inhere in agents. We replaced the single `vcvf:Value` class with a new hierarchy rooted in BFO:
*   **`vn-core:ValueDisposition`**: A subclass of `bfo:disposition`, this represents internally-grounded, enduring tendencies of an agent to act in certain ways. Core personal and moral values like *Benevolence* or *Fairness* are modeled as dispositions. An agent *has* a benevolence disposition, which is a real property of that agent.
*   **`vn-core:ValueRole`**: A subclass of `bfo:role`, this represents externally-grounded, normative expectations placed on an agent by a social context. Values like being a *Good Citizen* are modeled as roles. An agent *bears* a role, which is realized through normative behavior.

**Structural Re-Engineering:** We replaced the monolithic structure with a modular, OBO Foundry-style architecture. The new suite includes:
*   `valuenet-core.owl`: Imports BFO and defines the top-level classes (`ValueDisposition`, `ValueRole`, `ValueRealizationProcess`).
*   `valuenet-moral-foundations.owl`: Models Haidt's Moral Foundations as specific subclasses of `MoralValueDisposition`.
*   `valuenet-schwartz-values.owl`: Models Schwartz's Basic Human Values as subclasses of `PersonalValueDisposition`.
*   `valuenet-mappings.owl`: Provides `skos:broadMatch` mappings to the original ValueNet IRIs, ensuring backward compatibility and traceability.

**Semantic and Axiomatic Rewrite:** All axioms were rewritten to reflect the realist commitment.
*   The descriptive `dul:satisfies` relation was replaced with BFO's `bfo:realizes`. A `ValueDisposition` is not satisfied by a situation; it is **realized in** a `vn-core:ValueRealizationProcess` (a subclass of `bfo:process`).
*   The vague `vcvf:triggers` property was replaced by explicit relational chains. An agent (`bfo:bearer_of` a `ValueDisposition`) `bfo:participates_in` a process that `bfo:realizes` that disposition. This provides a clear, causal, and queryable pathway from agent to value to action.
*   IRIs, labels, and definitions were cleaned and standardized to follow OBO best practices, enhancing clarity and interoperability.

## Why We Did It — The Ontological Theory

The decision to align with BFO is a commitment to **ontological realism**: the view that an ontology should represent entities in reality in a way that is independent of our language, theories, or cognitive states. For an ontology of values, this is a profound shift.

Values are not merely abstract beliefs or cultural labels; they are real, causally potent features of human agents that shape perception, motivation, and behavior. Psychological theories from Schwartz to Haidt treat values as trans-situational goals and motivational constructs that guide action. A realist ontology must honor this by modeling values as part of the furniture of the world—specifically, as properties of agents.

BFO provides the precise categorical machinery for this task. By classifying values as **realizable entities** (`bfo:realizable_entity`), we capture their potential nature. A disposition or a role exists continuously in its bearer, even when not being actualized. This distinction is critical:
*   **Disposition vs. Process:** My disposition to be fair exists in me even when I am sleeping. It is only *realized* in a process of, for example, dividing a resource. The original ValueNet conflated the value-as-description with the situation that satisfies it. BFO forces a clean separation between the enduring potentiality (`disposition`) and its episodic actualization (`process`).
*   **Disposition vs. Role:** BFO distinguishes internally-grounded dispositions from externally-grounded roles. My disposition to seek novelty is a feature of my constitution. The value of being a "loyal employee," however, is a role conferred upon me by my relationship with an organization. This distinction is crucial for modeling the interplay between personal psychology and social structure.
*   **Disposition vs. Intentional State:** A value disposition is a stable trait that underpins many different mental states. My disposition to value security can give rise to a feeling of anxiety (an occurrent), a belief that the world is dangerous (a generically dependent continuant), or an intention to buy a lock (a plan). The BFO model allows us to represent the value as the stable, underlying ground for these transient mental phenomena.

This realist, BFO-based approach is essential for interoperability within the broader scientific ontology ecosystem, particularly the OBO Foundry. By modeling agents, dispositions, and processes in a way compatible with ontologies for biology (Gene Ontology), medicine (OGMS), and social entities (SO), we create a path for integrating models of human values with models of human health, disease, and social behavior.

## 🐠 ValueNet Ontology Diagram

```mermaid
classDiagram
    direction LR
    
    %% Classes
    class Value {
        +String label
        +String comment
        +String uri
    }
    class ValueType {
        +String label
        +String comment
    }
    class GoodValue
    class BadValue
    class FundamentalValue
    class InstrumentalValue
    class ValueMetric
    class ValueTarget
    
    %% Inheritance (is-a relationships)
    GoodValue --|> ValueType : is a
    BadValue --|> ValueType : is a
    FundamentalValue --|> ValueType : is a
    InstrumentalValue --|> ValueType : is a
    
    %% Relationships (Object Properties)
    
    %% Value to ValueType
    Value "1" --> "1" ValueType : hasType
    
    %% Value to Metric and Target
    Value "1" --> "*" ValueMetric : hasMetric
    Value "1" --> "*" ValueTarget : affects
    
    %% ValueTarget to Value
    ValueTarget "1" --> "*" Value : isTargetOf
    
    %% ValueMetric to Value
    ValueMetric "1" --> "1" Value : isMetricFor
    
    %% Value/ValueType to Value
    ValueType "1" --> "*" Value : contributesTo
    Value "1" --> "*" Value : isSubcomponentOf
    
    %% Other relationships (showing flow/direction)
    ValueMetric --|> ValueTarget : isMetricOfTarget
    ValueTarget --|> Value : targetsValue
    
    %% Notes/Annotations
    note for Value "The central entity representing a value or set of values."
    note for ValueType "Defines categories like Good, Bad, Fundamental, Instrumental."
```

## How We Did It — A Systematic Approach to Folk Values

While the BFO-aligned core provided the formal structure, it was incomplete without a comprehensive collection of the "folk values" people use in everyday language. To build this module (`valuenet-folk.owl`), we executed a rigorous, four-phase plan to smartly manage the "messiness" of natural language.

1.  **Phase 1: Planning & Clustering:** We began by consolidating hundreds of candidate value terms from diverse sources. These were then normalized, de-duplicated, and grouped into thematic clusters (e.g., "Community & Social Connection," "Integrity & Principle"). This strategy allowed us to tackle the complexity in a structured, manageable way.

2.  **Phase 2: Iterative Modeling:** We processed each cluster in a series of development sprints. For each term, we performed a careful ontological analysis, modeling it as a `ValueDisposition` or `ValueRole` and establishing a rich hierarchy by linking it to existing classes in the folk and Schwartz modules. This iterative process ensured consistency and quality as the ontology grew.

3.  **Phase 3: Rigorous Testing:** Upon completion of the modeling phase, we executed a comprehensive testing framework. This involved using an OWL reasoner to check for logical consistency and running a suite of SPARQL-based sanity checks to validate structural integrity, metadata completeness, and adherence to our modeling principles.

4.  **Phase 4: Linguistic Grounding:** Finally, to make the ontology usable for data analysis, we developed a formal annotation strategy. We defined the `vn-core:isEvidenceFor` property to link linguistic data to the ontological entities it describes. This was accompanied by a detailed `AnnotationGuide.md` to provide a clear, step-by-step workflow for annotators, completing the bridge from abstract theory to practical application.

This systematic process ensured the final `valuenet-folk.owl` module is not only comprehensive in its coverage but also logically sound, well-documented, and ready for real-world use.

## Why This Matters — The Value Proposition

A BFO-aligned ValueNet is more than an academic exercise; it is a powerful tool for building the next generation of intelligent systems. By grounding values in a realist framework, we unlock unique capabilities for reasoning, modeling, and explanation.

**1. Rigorous Agent and Intent Modeling:**
The BFO architecture allows us to model an agent as the **bearer** of specific value dispositions. This provides a stable, causally-grounded foundation for modeling that agent's intentions, plans, and goals, which depend on and are motivated by their value profile. This is a prerequisite for any robust theory of computational agency.

**2. Explainable and Ethical AI (XAI):**
An AI system that can reason over this ontology can produce truly explainable outputs. Instead of a black-box recommendation, it can generate a causal trace: "This action is recommended because it is a realization of the *BenevolenceDisposition* that is a core value of the user." This provides a powerful framework for building AI systems that are not only aligned with human values but can explain *how* and *why*.

**3. Deep Annotation of Data:**
The ontology provides a schema for annotating text, video, and other behavioral data with unprecedented semantic depth. A statement like "She spoke up for her colleague" is not just an instance of "speaking"; it can be annotated as a `ValueRealizationProcess` that realizes a `FairnessDisposition` or `LoyaltyDisposition`. This enables large-scale computational social science, psychological analysis, and the training of more nuanced NLP models.

**4. Knowledge Graph Integration:**
By using a top-level ontology shared by thousands of other domains, the BFO-aligned ValueNet can be seamlessly integrated into enterprise and public knowledge graphs. An agent in a CRM can be linked to their value dispositions, enabling more personalized and ethical engagement. Characters in a narrative knowledge graph can be modeled with explicit value profiles, driving plot and character analysis.

**5. A Foundation for Computational Ethics:**
Modeling values as real, causally-active properties of agents is the first step toward a computational science of ethics. It allows us to move beyond simple deontological rules and build systems that can reason about the complex trade-offs between competing values as they are realized in concrete processes—the very essence of ethical deliberation.

In summary, the BFOization of ValueNet transforms it from a vocabulary for describing values into a formal theory about what values *are* and how they function in the world. This realist foundation is essential for building systems that can understand, reason about, and interact with the most fundamental drivers of human action.
