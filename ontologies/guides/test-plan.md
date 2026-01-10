# Ontology-of-Freedom Test Plan

This document outlines a multi-phase test plan to build a robust knowledge base for the moral reasoning application. The goal is to move from simple rule-checking to evaluating complex scenarios involving conflicting values and frameworks, leveraging the ValueNet ontologies.

## Phase 1: Foundational Integration & Value Violation

**Objective:** Integrate the ValueNet ontologies and test the system's ability to connect a rule violation to a specific moral value violation.

### Step 1.1: Update TTL with New Namespaces

Modify your primary TTL file to include prefixes for the ValueNet ontologies. This makes referencing them easier.

```turtle
@prefix vn-schwartz: <https://fandaws.com/ontology/bfo/valuenet-schwartz-values#> .
@prefix vn-mft: <https://fandaws.com/ontology/bfo/valuenet-moral-foundations#> .
@prefix vn-folk: <https://fandaws.com/ontology/bfo/valuenet-folk#> .
```

### Step 1.2: Link an Existing Rule to a Value

Explicitly state that breaking a rule also violates a moral value. For example, connect the existing theft rule to the values of Security and Fairness.

```turtle
# In your existing rule definitions
ex:USLaw_Rule_Theft
  ex:violatesValue vn-folk:SecurityDisposition , vn-mft:FairnessDisposition .

ex:ChristianValues_Rule_Theft
  ex:violatesValue vn-folk:HonestyDisposition .
```

### Step 1.3: Enable Value Violation Checking

The `moralReasoner.js` file contains a `checkForValueViolation` method, but it is not currently called within the main `evaluateAction` flow. You will need to integrate it to see the results of this test.

**Action:** In `moralReasoner.js`, modify the `evaluateAction` function to call `checkForValueViolation` for each framework evaluation that finds a rule match. The results should be added to the `finalEvaluations` object and displayed in the UI.

### Step 1.4: Define Test Case & Expected Outcome

*   **Test Case:** Run the existing "Bob takes Dave's bicycle" scenario.
*   **Expected Outcome (Console & UI):**
    *   The system correctly identifies the action as `Prohibited` under U.S. Law and Christian Values.
    *   The system *also* reports that this action violates the values of **Security, Fairness, and Honesty**.

---

## Phase 2: Testing Moral Nuance & Conflict

**Objective:** Create a scenario where an action is not clearly right or wrong, forcing the system to reason about conflicting rules and values.

### Step 2.1: Define the "Robin Hood" Scenario

Create a new action for stealing bread to feed a starving family. This action has both negative (theft) and positive (care) aspects.

```turtle
# --- Individuals ---
ex:JeanValjean rdf:type ex:Person .
ex:RichBaker rdf:type ex:Person .
ex:StarvingFamily rdf:type ex:Group .

# --- Artifacts ---
ex:LoafOfBread rdf:type ex:Artifact ;
  rdfs:label "a loaf of bread" ;
  ex:ownedBy ex:RichBaker .

# --- Intents ---
ex:Intent_FeedFamily rdf:type ex:Intent ; rdfs:label "feed a family" .

# --- Action ---
ex:Action_StealBread_ToFeedFamily rdf:type ex:Action ;
  rdfs:label "Jean Valjean steals bread to feed a starving family" ;
  ex:performedBy ex:JeanValjean ;
  ex:actsOn ex:LoafOfBread ;
  ex:realizesIntent ex:Intent_FeedFamily .
```

### Step 2.2: Create Conflicting Classifications

The action must be classified in two different ways. The existing `TheftClassificationRule` will classify it as `Theft`. Add a new rule to classify it as an `ActOfCare`.

```turtle
ex:CareClassificationRule rdf:type ex:ClassificationRule ;
  rdfs:label "Care Classification Rule" ;
  ex:requiresIntent ex:Intent_FeedFamily ;
  ex:classToAssign vn-folk:CareDisposition .
```

### Step 2.3: Create a Rule that Promotes Care

Add a rule to a framework like "Common Decency" that encourages acts of care.

```turtle
ex:CommonDecency_Rule_Care rdf:type ex:MoralRule ;
  rdfs:label "Common Decency Rule for Care" ;
  ex:partOfFramework ex:CommonDecency ;
  ex:hasDeonticStatus "Permissible" ; # Or "Obligatory" for a stronger test
  ex:appliesToClass vn-folk:CareDisposition ;
  ex:justification "Providing care to those in need is a fundamental aspect of common decency." .
```

### Step 2.4: Define Test Case & Expected Outcome

*   **Test Case:** Run the instruction "Jean Valjean steals bread to feed a starving family".
*   **Expected Outcome (UI & Console):**
    *   The system's output should show a clear conflict.
    *   **U.S. Law Framework:** Judges the action as **PROHIBITED** because it is `Theft`.
    *   **Common Decency Framework:** Judges the action as **PERMISSIBLE** because it is an `ActOfCare`.
    *   The final summary should reflect this conflict, showing judgments from multiple frameworks with different deontic statuses. This is the key to stimulating moral imagination.

---

## Phase 3: Testing Hierarchical Value Inference

**Objective:** Test the system's ability to use `rdfs:subClassOf` relationships to apply a general rule to a more specific action.

### Step 3.1: Define a High-Level Rule

Create a rule that applies to a high-level Schwartz value, like `Benevolence`.

```turtle
ex:HumanitarianValues_Rule_Benevolence rdf:type ex:MoralRule ;
  rdfs:label "Humanitarian Rule for Benevolence" ;
  ex:partOfFramework ex:HumanitarianValues ;
  ex:hasDeonticStatus "Obligatory" ;
  ex:appliesToClass vn-schwartz:BenevolenceDisposition .
```

### Step 3.2: Define a Specific Action

Create an action that is classified as a *sub-class* of `BenevolenceDisposition`, such as `KindnessDisposition`.

*   **Action:** `ex:Action_HelpElderly_CrossStreet`
*   **Classification:** Create a `ClassificationRule` that assigns the class `vn-folk:KindnessDisposition` to this action.
*   **Ontology Fact:** The `valuenet-folk.ttl` file already contains the triple: `vn-folk:KindnessDisposition rdfs:subClassOf vn-schwartz:BenevolenceDisposition`.

### Step 3.3: Define Test Case & Expected Outcome

*   **Test Case:** Run the instruction "A person helps an elderly neighbor cross the street".
*   **Expected Outcome:**
    *   The system classifies the action as `KindnessDisposition`.
    *   The `isSubClassOf` check in `moralReasoner.js` should succeed, determining that `KindnessDisposition` is a type of `BenevolenceDisposition`.
    *   The **Humanitarian Values** framework should judge the action as **OBLIGATORY**, even though the rule was for the parent class. This confirms that hierarchical reasoning is working correctly.