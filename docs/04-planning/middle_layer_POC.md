# Functional Specification: The Honest Resident (PoC)

## 1. Scope and Objective

The objective of this Proof of Concept (PoC) is to eliminate the use of "static property lies" in the database. Instead of storing `Person residesAt House`, the system will store the **Act of Residence** and project the relationship only when the process is active.

## 2. The Data Architecture

### 2.1 Layer 1: The Expressive Realist Layer (Graph A)

**Purpose:** Record the physical/legal reality using BFO-compliant primitives.
**Implementation:** RDF/Turtle.

| Entity | BFO Class | Relation | Target |
| --- | --- | --- | --- |
| `p:Aaron` | `IndependentContinuant` | `bears` | `r:ResidentRole` |
| `r:ResidentRole` | `Role` | `inhered_in` | `p:Aaron` |
| `proc:Residency_01` | `Process` | `realizes` | `r:ResidentRole` |
| `proc:Residency_01` | `Process` | `occurs_at` | `site:House_123` |

### 2.2 Layer 2: The Middle Layer / SHML (Graph B)

**Purpose:** Ground the record in an agent's intentional act (Provenance & Accountability).
**Implementation:** Labeled Property Graph (LPG) or RDF.

**The Assertion Object:**

* **ID:** `assert:Residency_Assertion_44`
* **Type:** `git:IntentionalAct`
* **Agent:** `agent:PropertyManager_User`
* **Object:** `proc:Residency_01` (Links to the Realist Layer)
* **Evidence:** `doc:Lease_Agreement_2024.pdf`
* **Metadata:** `Status: Validated`, `Timestamp: 2026-01-10`

### 2.3 Layer 3: The Logic Projection (The Interface)

**Purpose:** High-speed, simplified consumption for UI and external APIs.
**Implementation:** Virtualized RDF View.

**The Projected Predicate:**

* `p:Aaron logic:residesAt site:House_123`

---

## 3. The Implementation "Handshake" (Inference Engine)

The system does not allow manual entry of `logic:residesAt`. It must be calculated via a **Materialization Rule**.

### 3.1 Inference Rule (SPARQL CONSTRUCT)

To generate the Logic Layer from the Realist and Middle Layers, the engine executes the following logic:

```sparql
CONSTRUCT {
  ?person <http://example.org/logic/residesAt> ?site .
}
WHERE {
  # 1. Check Realist Layer for the process
  ?person <http://purl.obolibrary.org/obo/RO_0000053> ?role . # bears
  ?role a <http://purl.obolibrary.org/obo/BFO_0000023> .      # Role
  ?proc <http://purl.obolibrary.org/obo/RO_0000059> ?role ;  # realizes
        <http://purl.obolibrary.org/obo/BFO_0000066> ?site . # occurs_at

  # 2. Check Middle Layer for intentional grounding
  ?assertion a <http://purl.obolibrary.org/obo/GIT_IntentionalAct> ;
             <http://purl.obolibrary.org/obo/GIT_directed_toward> ?proc ;
             <http://example.org/shml/status> "Validated" .
}

```

---

## 4. Technical Constraints & Validation

To ensure the system remains "Honest," we implement the following **SHACL Constraints**:

1. **Existence Constraint:** A `logic:residesAt` triple is invalid if the underlying `proc:Residency_01` has a `has_end_date` in the past.
2. **Provenance Constraint:** Every `logic:residesAt` must be traceable to a `git:IntentionalAct` performed by a registered `git:Agent`.
3. **Cardinality:** While a person can bear multiple `ResidentRoles`, the Logic Layer must flag a warning if a person `residesAt` more than 3 locations simultaneously (to detect data entry errors).

---

## 5. Execution Steps for PoC

1. **Instantiate Reality:** Create the Person, House, and Resident Role.
2. **Initialize Process:** Create the Act of Residence with a start date.
3. **Record Intent:** Add the Assertion event to the SHML, linking it to the Lease PDF.
4. **Trigger Projection:** Run the Inference Rule to "materialize" the `residesAt` predicate.
5. **Test Honesty:** Delete the Act of Residence. Confirm the `residesAt` predicate is automatically removed from the Logic Layer.

---

### Would you like me to generate the specific SHACL shapes file to enforce the Provenance Constraint mentioned in Section 4? Or shall we move to the Python/Logic code that handles the "Auto-Projection"?
