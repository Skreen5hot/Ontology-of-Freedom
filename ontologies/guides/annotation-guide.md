# ValueNet Annotation Guide

This guide provides a step-by-step process for annotating text for human values using the BFO-aligned ValueNet ontology. The goal is to create rich, structured data that captures not just *what* values are present, but *how* they are demonstrated.

## 1. Core Concepts

Our model uses a few key concepts to describe how values work in the real world.

*   **Agent:** The person or group who holds the value and performs the action.
*   **Value Disposition:** An *internal, personal tendency* to act in a certain way. Think of this as a core part of someone's character.
    *   *Example:* A person's general disposition towards `folk:Kindness`.
*   **Value Role:** An *external, social expectation* placed on an agent. This is tied to a job, position, or social context.
    *   *Example:* The duties of a `folk:LeaderRole` or `folk:ProfessionalismRole`.
*   **Value Realization Process:** The specific *action or event* where a value is made real or demonstrated.
    *   *Example:* The *process of helping* someone, which makes the `KindnessDisposition` real.

## 2. The Annotation Workflow

For a given piece of text, follow these five steps to create a complete annotation.

### Step 1: Identify the Action (The Process)

Read the text and find the core action or event that demonstrates a value. This action is your **`ValueRealizationProcess`**.

> **Text:** "The volunteer spent her weekend cleaning the park."
> **Action:** The process of "cleaning the park".

### Step 2: Identify the Agent

Who is performing this action? This person or group is your **`Agent`**.

> **Text:** "The volunteer spent her weekend cleaning the park."
> **Agent:** "The volunteer".

### Step 3: Identify the Value(s)

What value is the agent demonstrating through their action? Look through the `valuenet-folk.owl` ontology to find the best fit. An action can demonstrate multiple values. These are your **`ValueDisposition`** or **`ValueRole`** classes.

> **Text:** "The volunteer spent her weekend cleaning the park."
> **Values:** This action demonstrates a `folk:ContributionDisposition` (making an impact on the community) and a `folk:DiligenceDisposition` (applying persistent work).

### Step 4: Connect the Pieces

Using the formal BFO relations, you now connect the instances you've identified.

1.  The `Agent` **has** the `ValueDisposition` (`bfo:has_disposition`).
2.  The `Agent` **participates in** the `ValueRealizationProcess` (`bfo:has_participant`).
3.  The `ValueRealizationProcess` **realizes** the `ValueDisposition` (`bfo:realizes`).

### Step 5: Link to the Text

Finally, use our special annotation property, `vn-core:isEvidenceFor`, to link the specific text span that describes the action to the `ValueRealizationProcess` you identified.

## 3. Worked Examples

### Example 1: Courage and Honesty

*   **Text:** "Despite the risk, the journalist published the story to expose the corruption."
*   **Text Span:** "published the story to expose the corruption"
*   **Agent:** `:theJournalist`
*   **Process:** `:publishingProcess`
*   **Values Realized:** `folk:CourageDisposition`, `folk:HonestyDisposition`

**Annotation Triples:**
```turtle
:textSpan1 vn-core:isEvidenceFor :publishingProcess .
:publishingProcess rdf:type vn-core:ValueRealizationProcess .
:publishingProcess bfo:0000057 :theJournalist .      # has_participant
:publishingProcess bfo:0000133 folk:CourageDisposition . # realizes
:publishingProcess bfo:0000133 folk:HonestyDisposition . # realizes
```

### Example 2: Role-Based Accountability

*   **Text:** "As the team captain, she took full responsibility for the loss."
*   **Text Span:** "took full responsibility for the loss"
*   **Agent:** `:theCaptain`
*   **Process:** `:takingResponsibilityProcess`
*   **Values Realized:** `folk:ResponsibilityDisposition` (a personal trait), `folk:LeaderRole` (an external role)

**Annotation Triples:**
```turtle
:textSpan2 vn-core:isEvidenceFor :takingResponsibilityProcess .
:takingResponsibilityProcess rdf:type vn-core:ValueRealizationProcess .
:takingResponsibilityProcess bfo:0000057 :theCaptain .
:takingResponsibilityProcess bfo:0000133 folk:ResponsibilityDisposition .
:takingResponsibilityProcess bfo:0000133 folk:LeaderRole .
```

## 4. Best Practices

*   **Be Specific:** Always try to use the most specific value from the `valuenet-folk.owl` hierarchy. Prefer `folk:KindnessDisposition` over the more general `vn-schwartz:BenevolenceDisposition`.
*   **Multiple Values are Good:** Human actions are complex. Don't hesitate to annotate a single process as realizing multiple values.
*   **Disposition vs. Role:** Remember the difference. Is the value coming from *within* the person (a disposition) or from the *expectations of their position* (a role)? Sometimes, it's both, as in the captain example above.
*   **Focus on the Action:** The central point of the annotation is always the `ValueRealizationProcess`. Start by finding the verb or action phrase in the text.
