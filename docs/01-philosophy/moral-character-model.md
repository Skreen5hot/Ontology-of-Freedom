# A Realist Ontological Model of Sincerity: A Prototype for Modeling Moral Character


## Abstract

This whitepaper presents an ontological model of **Sincerity** grounded in the Basic Formal Ontology (BFO) and Common Core Ontologies (CCO). It serves as a prototype for representing moral character within realist ontology frameworks. Sincerity, as a disposition realized in expressive acts and evaluable via information processing, is explored in detail. The model is then generalized into a blueprint for modeling other moral character traits, offering a philosophically grounded, interoperable structure for ethical discourse across belief systems. Illustrative examples and a mermaid diagram are included.

---

## 1. Introduction

Character is foundational to ethical reasoning, yet ontological representations of character remain underdeveloped, especially in systems that prioritize realism and formal rigor. This paper proposes an ontological model of **Sincerity** as a test case for modeling character traits within the Basic Formal Ontology (BFO) framework. Drawing on CCO patterns and rooted in realist philosophy, we demonstrate how sincerity can be modeled in a way that is both operationalizable and respectful of diverse philosophical traditions.

---

## 2. Philosophical Background

The concept of *sincerity* has been central in moral philosophy, particularly in virtue ethics (Aristotle), deontology (Kant), and existentialism (Sartre). Though defined differently across traditions, sincerity is generally understood as the congruence between internal belief and external expression.

A realist ontological model seeks to avoid encoding normative claims directly. Instead, it models the **structures of reality** that underlie ethical evaluations, providing a common representational framework without asserting universal moral truths. In this way, ontologies can mediate between diverse value systems.

---

## 3. The Sincerity Model

### 3.1 Overview

The Sincerity model leverages BFO and CCO to capture the following pattern:

* A **single disposition** (`sincerity`) that is dependent upon a **quality** (`sinceritySubstrate`)
* Both inhere in a **person**
* The disposition is **realized in** an **expressive act**
* The act **concretizes** an **assertion** (an **information content entity**)
* A separate **belief** (another **information content entity**) is held by the person
* An **information processing** activity compares belief and assertion
* The result is a **sincerity expression** that reflects **a spectrum of values** (e.g., "sincere", "somewhat sincere", "insincere")

Importantly, we do not model `insincerity` as a separate disposition. To do so would be ontologically wasteful and logically inconsistent with how BFO handles dispositions and their variable realizations. A disposition may fail to be realized, or may be realized to varying degrees, but the disposition itself remains singular.

### 3.2 BFO-Aligned Definitions

| Term                         | Definition                                                                                                                          | BFO Class                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **Sincerity**                | A disposition to express beliefs congruently through expressive acts.                                                               | Disposition                |
| **Sincerity Substrate**      | A moral quality inhering in a person which serves as the basis for the sincerity disposition.                                       | Quality                    |
| **Sincerity Ratio**          | A generically dependent continuant representing a scalar degree of sincerity derived from a measurement process.                    | GDC                        |
| **Sincerity Identification** | An information processing activity that evaluates congruence between belief and assertion.                                          | Process                    |
| **Assertion**                | An information content entity representing a truth-claim.                                                                           | Information Content Entity |
| **Belief**                   | An information content entity held by a person, representing their internal position on a subject.                                  | Information Content Entity |
| **Expressive Act**           | A process in which a person externalizes an assertion, verbally or nonverbally.                                                     | Process                    |
| **Communicator**             | A material object (typically a person) bearing the role of expressing symbolic content.                                             | Material Object            |
| **Communication Role**       | A role borne by a communicator during expressive acts.                                                                              | Role                       |
| **Sincerity Expression**     | A symbolic representation or judgment of how a disposition was realized. Values include “sincere”, “somewhat sincere”, “insincere”. | GDC                        |

### 3.3 Key Relations

* `sinceritySubstrate` **inhere\_in** `person`
* `sincerity` **dependent\_on** `sinceritySubstrate`
* `sincerity` **realized\_in** `expressive act`
* `expressive act` **concretizes** `assertion`
* `assertion` **is\_about** `thing`
* `belief` **is\_about** `thing`
* `sincerityIdentification` **has\_input** `assertion`, `belief`
* `sincerityIdentification` **has\_output** `sincerityExpression`
* `communicator` **participates\_in** `expressive act`
* `communicator` **bearer\_of** `communicationRole`
* `sinceritySubstrate` **has\_specified\_value** `sincerityRatio`

### 3.4 Mermaid Diagram

```mermaid
graph TD

%% Core BFO and CCO Types
BFO_001["Quality"]
BFO_002["Disposition"]
BFO_003["Generically Dependent Continuant"]
BFO_004["Process"]
BFO_005["Material Object"]
BFO_006["Role"]

%% Domain Classes
character["Character"]
moralCharacter["Moral Character"]
sinceritySubstrate["Sincerity Substrate"]
cco_ratio["CCO Ratio"]
sincerity["Sincerity"]
sincerityExpression["Sincerity Expression"]
sincerityIdentification["Sincerity Identification"]
cco_person["Person"]
expressiveAct["Expressive Act"]
assertion["Assertion"]
belief["Belief"]
communicator["Communicator"]
communicationRole["Communication Role"]
thing["Thing"]

%% Typing
character -- is_a --> BFO_001
moralCharacter -- is_a --> character
sinceritySubstrate -- is_a --> moralCharacter
sincerityExpression -- is_a --> BFO_003
sincerity -- is_a --> BFO_002
sincerityIdentification -- is_a --> BFO_004
expressiveAct -- is_a --> BFO_004
communicator -- is_a --> cco_person
cco_person -- is_a --> BFO_005
assertion -- is_a --> BFO_003
belief -- is_a --> BFO_003
communicationRole -- is_a --> BFO_006

%% Relations
communicator -- bearer_of --> communicationRole
communicator -- participates_in --> expressiveAct
expressiveAct -- concretizes --> assertion
sincerity -- realized_in --> expressiveAct
sincerityIdentification -- has_input --> assertion
sincerityIdentification -- has_input --> belief
sincerityIdentification -- has_output --> sincerityExpression
sincerityIdentification -- has_participant --> communicator
sincerityExpression -- generically_depends_on --> expressiveAct
sinceritySubstrate -- inheres_in --> cco_person
sinceritySubstrate -- has_specified_value --> cco_ratio
assertion -- is_about --> thing
belief -- is_about --> thing
sincerity -- dependent_on --> sinceritySubstrate
```

### 3.5 Illustrative Example

**Example:** Alice is asked if she enjoyed a dinner her friend cooked. Internally, she believes the food was not of her liking, meatloaf which she has stated her dislike in the past (belief). However, she smiles and says "It was great!" (assertion in expressive act). An observer or system compares her assertion to her belief (sincerity identification). The result is an **insincere** judgment (sincerity expression) — this does not imply that Alice possesses a separate `insincerity` disposition.

---

## 4. Modeling Opposites and Spectra

Rather than modeling opposite dispositions (e.g., `sincerity` vs. `insincerity`), we adopt the BFO-aligned pattern of modeling a single disposition with **variable realizations**. A person may bear the disposition of sincerity and yet express it imperfectly, or not at all, in a given instance.

This avoids an ontological explosion of mirroring classes such as `happy`, `unhappy`, `somewhat happy`, etc. Instead, the **disposition remains singular**, while the **expression or evaluative output** varies along a spectrum.

This model aligns with physical science analogies: a thermometer always measures temperature—even if that temperature is low. Similarly, sincerity can be low or high, but it is still the same disposition being evaluated.

---
## 4. Generalizing the Model to Moral Character
Moral character traits like honesty, courage, humility, and empathy can be modeled similarly:
* Each trait is a **disposition** that may depend on a supporting **quality**
* Manifesting in certain **expressive or behavioral processes**
* Measurable via **information processing** activities
* Resulting in **representations** of character expression
This structure supports formalization of character traits without encoding subjective value systems, enabling ethical AI, interfaith dialogue, and character-driven knowledge representation.

---

## 6. Applications and Implications

### 6.1 Ethical AI

Machine agents can use sincerity evaluations to determine trustworthiness, manage dialogue states, and adjust behavior.

### 6.2 Interoperability Across Worldviews

By modeling *how* character manifests (not *whether it is good*), the model provides a shared representational framework for religious, philosophical, and secular ethical systems.

### 6.3 Cognitive and Psychological Research

The model aligns with dual-process theories of cognition and moral psychology by separating dispositional structures from contextual realization.

---

## 7. Conclusion

The Sincerity model provides a formally grounded, realist ontology for character modeling. By representing character traits as dispositions realized in expressive acts and evaluated via comparison to internal states, this approach supports ethical discourse, semantic interoperability, and principled AI development. As a general prototype, it offers a scaffold for modeling the broader domain of moral character.

---

## 8. References

* Arp, R., Smith, B., & Spear, A. D. (2015). *Building Ontologies with Basic Formal Ontology.* MIT Press.
* Kant, I. (1785). *Groundwork of the Metaphysics of Morals.*
* Aristotle. *Nicomachean Ethics.*
* Common Core Ontologies: [https://www.commoncoreontology.org](https://www.commoncoreontology.org)
* BFO 2020 Specification: [https://basic-formal-ontology.org](https://basic-formal-ontology.org)
