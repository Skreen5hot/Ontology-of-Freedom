# ValueNet Ontology Testing Framework

This document outlines a rigorous framework for testing, validating, and refining the ValueNet ontology suite, particularly the `valuenet-folk.owl` module. The goal is to ensure the ontology is logically consistent, structurally sound, and adheres to high-quality development standards.

## Part 1: Automated Reasoner Validation

The most fundamental test is to check for logical consistency using an OWL reasoner (e.g., HermiT, Pellet, ELK). This should be done regularly during development, typically within an ontology editor like Protégé.

**Procedure:**
1.  Load the `valuenet-folk.owl` ontology (which imports the core and Schwartz modules).
2.  Start the reasoner (e.g., `Reasoner -> Start Reasoner`).
3.  Check for unsatisfiable classes. An unsatisfiable class (one that is equivalent to `owl:Nothing`) indicates a logical contradiction in the axioms. Any such classes must be investigated and fixed immediately.

## Part 2: SPARQL-based Sanity Checks

These SPARQL queries help identify potential modeling errors, inconsistencies, or violations of best practices that a reasoner might not flag as a logical contradiction.

---

### Query 1: Disjoint Parentage Check

**Purpose:** To find any folk value that has been incorrectly classified under two different high-level Schwartz values. Since the Schwartz values are intended to be distinct motivational types, a direct subclass relationship to two of them is a likely modeling error.

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX folk: <https://w3id.org/valuenet/folk#>
PREFIX vn-schwartz: <https://w3id.org/valuenet/schwartz-values#>

SELECT ?folk_value ?parent1 ?parent2
WHERE {
  ?folk_value rdfs:subClassOf folk: .
  
  ?folk_value rdfs:subClassOf ?parent1 .
  ?parent1 rdfs:subClassOf vn-schwartz:PersonalValueDisposition .
  
  ?folk_value rdfs:subClassOf ?parent2 .
  ?parent2 rdfs:subClassOf vn-schwartz:PersonalValueDisposition .
  
  FILTER(?parent1 != ?parent2)
}
```

---

### Query 2: Missing Metadata Check

**Purpose:** To ensure every class in the folk ontology has a human-readable label and a definition, which is essential for usability and maintenance.

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX folk: <https://w3id.org/valuenet/folk#>

SELECT ?class
WHERE {
  ?class a owl:Class .
  FILTER(STRSTARTS(STR(?class), "https://w3id.org/valuenet/folk#"))
  
  FILTER NOT EXISTS { ?class rdfs:label ?label . }
  # Or use the query below for definitions
  # FILTER NOT EXISTS { ?class folk:definition ?def . }
}
```

---

### Query 3: Redundant `skos:broadMatch` Check

**Purpose:** To find classes where a `skos:broadMatch` is used for the same parent as a formal `rdfs:subClassOf` axiom. The `subClassOf` relationship is stronger and makes the `broadMatch` redundant and potentially confusing.

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?class ?redundant_parent
WHERE {
    ?class rdfs:subClassOf ?redundant_parent .
    ?class skos:broadMatch ?redundant_parent .
}
```

## Part 3: Manual Review and Coverage Analysis

1.  **Definition Review (Task 3.2):** Manually review the definitions for all classes within each cluster to ensure they are sufficiently distinct and avoid ambiguity. For example, check that the definitions for `EqualityDisposition` and `EquityDisposition` clearly articulate the difference.
2.  **Axiom Review (Task 3.3):** Manually review the use of `rdfs:subClassOf` versus `skos:broadMatch`. As the ontology has grown, some initial decisions might need refinement. For example, is `folk:KindnessDisposition` truly a *subclass* of `vn-schwartz:BenevolenceDisposition`, or is it so close in meaning that a simple `skos:exactMatch` would be better?
3.  **Coverage Analysis:** Compare the set of all modeled classes in `valuenet-folk.owl` against the `Primary Value Concepts` list in `Phase1_NormalizedTerms.md`. Identify any high-priority concepts that were missed during the modeling sprints and schedule them for a future iteration.