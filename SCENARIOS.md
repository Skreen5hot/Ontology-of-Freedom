 # How to create scenarios and data (Turtle .ttl) for the Moral Reasoning POC

 This document explains the minimal and recommended Turtle (.ttl) content needed so the browser-based Moral Reasoning POC can parse scenario knowledge, match natural-language instructions to actions, and perform moral evaluations.

 Overview
 --------
 - The POC expects RDF/Turtle input describing agents, artifacts, actions, intents, moral values, and (optionally) moral evaluation results.
 - The parser (N3.js) extracts quad triples and the app builds an in-memory `knowledge` object. The reasoner reads:
   - action definitions (which agent performs what action and on which artifact)
   - intents realized by actions
   - artifact ownership
   - moral values and explicit evaluation triples (if present)

 Key prefixes (examples)
 -----------------------
 Use a short `ex:` prefix for your domain vocabulary. The POC's examples use:

 ```turtle
 @prefix ex: <http://example.org/moral_sandbox#> .
 @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
 @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
 ```

 Minimal required pieces (required triples and shapes)
 ---------------------------------------------------
 The parser looks for `rdf:type` triples whose object IRI ends with these class names: `Agent`, `Artifact`, `Action`, `Intent`, `Value`, `MoralEvaluation`.

 For each concept the following triples are expected (compact form):

 - Agent (one or more)
   - ex:Agent a owl:Class . (ontology-level) — not mandatory per-file but useful
   - ex:RobotA a ex:Agent ; rdfs:label "Robot A" .

 - Artifact (objects acted upon)
   - ex:Wallet1 a ex:Artifact ; ex:ownedBy ex:PersonX ; rdfs:label "Alice's Wallet" .

 - Intent (what the action aims to realize)
   - ex:Intent_Return a ex:Intent ; rdfs:label "Intent: return object to owner" .

 - Action (what an agent can do)
   - ex:PickUpWallet_Return a ex:Action ;
       ex:performedBy ex:RobotA ;
       ex:actsOn ex:Wallet1 ;
       ex:realizesIntent ex:Intent_Return ;
       rdfs:label "Pick up wallet (intent: return)" .

 - Moral Value instances
   - ex:Fairness a ex:Value ; rdfs:label "Fairness" .
   - ex:Trust a ex:Value ; rdfs:label "Trust" .

 Optional: explicit moral evaluation results
 -----------------------------------------
 To pre-attach evaluations (the parser/engine will read these if present):

 - Create a `MoralEvaluation` instance that `ex:evaluatesAction` and `ex:assignsValue`
   - ex:Eval_Return a ex:MoralEvaluation ;
       rdfs:label "Evaluation: returning the wallet" ;
       ex:evaluatesAction ex:PickUpWallet_Return ;
       ex:assignsValue ex:Fairness, ex:Trust ;
       ex:justificationText "Robot picked up an object to return it to the owner; this action promotes fairness and trust." .

 - Optionally link evaluation back to action and declare `ex:hasMoralValue` or `ex:violatesValue` on the action:
   - ex:PickUpWallet_Return ex:hasMoralValue ex:Fairness, ex:Trust .
   - ex:PickUpWallet_Keep ex:violatesValue ex:RespectForProperty .

 What the parser and reasoner expect (implementation notes)
 ---------------------------------------------------------
 - The TTL parser collects triples and builds arrays: `agents`, `artifacts`, `actions`, `intents`, `moralValues`, and `evaluations`.
 - The reasoner searches for an action that matches the user's instruction. The demo uses simple keyword heuristics (for example, matching the words "keep" or "return" against action identifiers like `PickUpWallet_Keep`). To make matching reliable:
   - include meaningful words in `rdfs:label` and in the action IRI (e.g., `PickUpWallet_Return`), and
   - include clear intent labels (`Intent_Return`) containing the verb that people will use in instructions.
 - Evaluations: the reasoner prefers explicit triples in the store for `ex:violatesValue` and `ex:hasMoralValue` on actions. It also reads `ex:MoralEvaluation` instances (via `ex:evaluatesAction` / `ex:assignsValue`) and uses `ex:justificationText` for human-readable justification.

 Minimal working example (positive return scenario)
 --------------------------------------------------
 ```turtle
 @prefix ex: <http://example.org/moral_sandbox#> .
 @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

 ex:RobotA a ex:Agent ; rdfs:label "Robot A" .
 ex:PersonX a ex:Agent ; rdfs:label "Person X" .

 ex:Wallet1 a ex:Artifact ;
     rdfs:label "Wallet (belongs to Person X)" ;
     ex:ownedBy ex:PersonX .

 ex:Intent_Return a ex:Intent ; rdfs:label "Intent: return object to owner" .

 ex:PickUpWallet_Return a ex:Action ;
     rdfs:label "Pick up wallet (intent: return to owner)" ;
     ex:performedBy ex:RobotA ;
     ex:actsOn ex:Wallet1 ;
     ex:realizesIntent ex:Intent_Return ;
     ex:hasMoralValue ex:Fairness, ex:Trust .

 ex:Fairness a ex:Value ; rdfs:label "Fairness" .
 ex:Trust a ex:Value ; rdfs:label "Trust" .

 ex:Eval_Return a ex:MoralEvaluation ;
     rdfs:label "Evaluation: returning the wallet" ;
     ex:evaluatesAction ex:PickUpWallet_Return ;
     ex:assignsValue ex:Fairness, ex:Trust ;
     ex:justificationText "Robot picked up an object to return it to the owner; this action promotes fairness and trust." .
 ```

 Minimal working example (negative keep scenario that also promotes a positive value)
 -------------------------------------------------------------------------------------
 ```turtle
 @prefix ex: <http://example.org/moral_sandbox#> .
 @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

 ex:RobotA a ex:Agent ; rdfs:label "Robot A" .
 ex:PersonX a ex:Agent ; rdfs:label "Person X" .

 ex:Wallet1 a ex:Artifact ;
     rdfs:label "Wallet (belongs to Person X)" ;
     ex:ownedBy ex:PersonX .

 ex:Intent_Keep a ex:Intent ; rdfs:label "Intent: keep object for self" .

 ex:PickUpWallet_Keep a ex:Action ;
     rdfs:label "Pick up wallet (intent: keep)" ;
     ex:performedBy ex:RobotA ;
     ex:actsOn ex:Wallet1 ;
     ex:realizesIntent ex:Intent_Keep ;
     ex:violatesValue ex:RespectForProperty .

 ex:SelfInterest a ex:Value ; rdfs:label "Self-interest" .
 ex:RespectForProperty a ex:Value ; rdfs:label "Respect for Property" .

 ex:Eval_Keep a ex:MoralEvaluation ;
     rdfs:label "Evaluation: keeping the wallet" ;
     ex:evaluatesAction ex:PickUpWallet_Keep ;
     ex:assignsValue ex:SelfInterest, ex:RespectForProperty ;
     ex:justificationText "Robot picked up an object owned by Person X intending to keep it; this promotes self-interest and violates respect for property and fairness." .
 ```

 Notes on naming and matching
 ----------------------------
 - The demo's matching is intentionally simple. To improve matching between natural language instructions and actions:
   - Keep human-friendly verb keywords in `rdfs:label` or action IRIs (e.g., `Return`, `Keep`, `PickUp`).
   - Use clear intent labels (e.g., `Intent_Return` with label containing the verb `return`).
   - Avoid anonymous blank nodes for entities you want the reasoner to find.

 Advanced extensions (ideas)
 ---------------------------
 - Add contextual triples (e.g., `ex:ownerPresent` or `ex:emergencyContext`) and extend the reasoner rules to factor context into evaluations.
 - Add weights or numeric scores per value and compute an aggregate moral score.
 - Chain actions by linking actions with `ex:precedes` or `ex:nextAction` and compute multi-step plans.

 Validation checklist (before loading into app)
 --------------------------------------------
 1. File is valid Turtle (.ttl) — run through a validator or try loading in the app.
 2. Each entity you expect the app to use has an explicit `rdf:type` triple (Agent, Artifact, Action, Intent, Value, MoralEvaluation).
 3. Use `rdfs:label` for human-friendly names (labels are used in matching/display).
 4. If you want the reasoner to show explicit violations or promotions, include `ex:violatesValue` or `ex:hasMoralValue` on the `ex:Action` resource.
 5. If you want justifications shown, add `ex:justificationText` on a `ex:MoralEvaluation` instance that `ex:evaluatesAction`.

 Troubleshooting
 ---------------
 - If the app shows "No matching action found": check that the action IRI or its `rdfs:label` contains expected keywords (e.g., `keep` / `return`) or that your instruction uses those words.
 - If moral values or justifications don't appear: ensure `ex:assignsValue` and `ex:justificationText` are present on a `ex:MoralEvaluation` instance that points to the action via `ex:evaluatesAction`.
 - If prefixes are different from `http://example.org/moral_sandbox#`, include the prefix at the top of your TTL and ensure the parser returns the `prefixes` object (N3 returns prefixes when parsing). The parser has a fallback prefix if none is provided.

 Example quick test instructions
 -------------------------------
 - "Robot A should return the wallet" → should match `PickUpWallet_Return` and show positive values and justification.
 - "Robot A should keep the wallet" → should match `PickUpWallet_Keep` and show violated value(s), any promoted value(s), and a negative final evaluation.

 If you want, I can also:
 - Create a template TTL file with TODO comments for new scenario authors.
 - Add a small `SCENARIO_TEMPLATE.ttl` in the repo and a short `SCENARIOS.md` entry linking to it.

 ---
 End of guide.
