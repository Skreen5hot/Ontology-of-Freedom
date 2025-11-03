# How Instruction Matching Works

This document explains how the application links natural language instructions to specific actions defined in the loaded Turtle (`.ttl`) knowledge graph.

The system uses a **keyword-based matching** approach, not a full Natural Language Processing (NLP) model. This method is fast, predictable, and well-suited for this proof-of-concept.

## The Matching Logic

When you enter an instruction and click "Evaluate," the `MoralReasoner` performs the following steps:

1.  **It gathers keywords for every action.** For each `ex:Action` in the knowledge graph, the reasoner creates a collection of searchable keywords from the `rdfs:label` and the final part of the ID (the "local name") of the following entities:
    - The **Action** itself (e.g., from `ex:PickUpWallet_Return`, it gets `pickupwallet_return`).
    - The **Agent** performing the action (e.g., `ex:RobotA`, "Robot A").
    - The **Artifact** being acted upon (e.g., `ex:Wallet1`, "Alice's Wallet").
    - The **Intent** the action realizes (e.g., `ex:Intent_Return`, "Intent: return object to owner").

2.  **It checks against a predefined list of verbs.** The reasoner has a small, hardcoded list of verbs it recognizes, such as `return`, `keep`, `pick up`, and `give back`.

3.  **It applies the matching rule.** An instruction is successfully matched to an action if it satisfies the following condition:

    > The instruction text contains a keyword for the **(Agent OR Action)**
    >
    > **AND**
    >
    > The instruction text also contains a keyword for the **(Artifact OR Intent OR a known Verb)**.

4.  **The first match wins.** The reasoner iterates through the actions in the order they were parsed. The very first action that satisfies the rule is chosen for evaluation. This means the order of actions in your `.ttl` file can matter if an instruction is ambiguous.

## How to Write Good Instructions

To ensure your instructions are matched correctly, follow these tips:

-   **Be direct.** The system is not conversational. State the command clearly.
-   **Use keywords from your TTL file.** The most reliable way to match an action is to use words found in the `rdfs:label` of the agents, artifacts, and intents.
-   **Structure your command around the rule.** A good pattern is `[Agent] should [verb] the [artifact]`.

### Example

Given this data in your `.ttl` file:

```turtle
ex:RobotA rdfs:label "Robot A" .
ex:Wallet1 rdfs:label "Alice's Wallet" .
ex:PickUpWallet_Return rdfs:label "Pick up wallet (intent: return)" .
```

A good instruction would be: **"Robot A should return the wallet"**.

- `"Robot A"` matches the **Agent**.
- `"return"` matches a known **Verb**.
- `"wallet"` matches the **Artifact**.