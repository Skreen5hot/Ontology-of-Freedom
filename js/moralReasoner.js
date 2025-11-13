// moralReasoner.js
(function(window) {
    'use strict';

    function MoralReasoner(knowledge, nlpService) {
        this.knowledge = knowledge;
        this.store = knowledge.store;
        this.nlpService = nlpService;
        this.ONTOLOGY_PREFIX = 'http://example.org/moral_sandbox#';
        if (!this.nlpService) throw new Error("MoralReasoner requires an NLP Service.");
        console.log('MoralReasoner initialized with knowledge.');
    }

    MoralReasoner.prototype.evaluateAction = function(instruction) {
        console.log('Evaluating action for instruction:', instruction);
        const action = this.findActionFromInstruction(instruction);

        if (!action) { // If NLP fails to find an action
            return {
                actionId: null,
                evaluation: 'negative',
                justification: 'Could not identify a specific action from the instruction.',
                values: []
            };
        }

        // New logic: Find pre-existing judgments or derive new ones.
        const judgments = this.findOrDeriveJudgments(action.id);

        const finalEvaluations = [];

        if (judgments.length > 0) {
            for (const judgment of judgments) {
                // We only want to display rule-based judgments in this format for now.
                if (judgment.type !== 'RuleJudgment') continue;

                // Find the rule and its parent framework
                let rule = null;
                let framework = null;
                for (const fw of this.knowledge.moralFrameworks) {
                    const foundRule = fw.rules.find(r => r.id === judgment.appliesRule);
                    if (foundRule) {
                        rule = foundRule;
                        framework = fw;
                        break;
                    }
                }

                if (rule && framework) {
                    finalEvaluations.push({
                        framework: framework.label,
                        actionLabel: action.label,
                        deonticStatus: rule.deontic || 'Unknown',
                        justification: rule.justification || 'No justification provided.'
                    });
                }
            }
        }

        if (finalEvaluations.length === 0) {
            // If after all that, no rule judgments were made, return a neutral result.
            return {
                evaluations: [{
                    framework: 'General',
                    actionLabel: action.label,
                    deonticStatus: 'Permissible',
                    justification: 'This action does not appear to violate any known rules.'
                }]
            };
        }

        return { evaluations: finalEvaluations, actionId: action.id };
    };

    MoralReasoner.prototype.findActionFromInstruction = function(instruction) {
        const intent = this.nlpService.extractIntent(instruction);
        // A more robust system would use the extracted intent to find the best match.
        // For now, we will use a simple label-based fallback.
        if (!intent) {
            console.warn('NLP Service could not extract a valid intent. Falling back to label matching.');
        }

        // Fallback/Primary Logic: Find an action whose label is in the instruction.
        const instructionWords = instruction.toLowerCase().split(/\s+/);

        // Find the best match by scoring actions based on keyword overlap.
        let bestMatch = { action: null, score: 0 };
        this.knowledge.actions.forEach(action => {
            if (action.label) {
                const labelWords = action.label.toLowerCase().split(/\s+/);
                const score = instructionWords.filter(word => labelWords.includes(word)).length;
                if (score > bestMatch.score) {
                    bestMatch = { action: action, score: score };
                }
            }
        });

        const matchedAction = bestMatch.score > 0 ? bestMatch.action : null;

        if (matchedAction) {
            console.log(`Matched action by label: ${matchedAction.id}`);
            return matchedAction;
        }

        console.log('No matching action found via NLP label matching.');
        return null;
    };

    MoralReasoner.prototype.findOrDeriveJudgments = function(actionId) {
        const existingJudgments = this.store.getQuads(null, this.ONTOLOGY_PREFIX + 'judgesAction', actionId);

        if (existingJudgments.length > 0) {
            console.log(`Found ${existingJudgments.length} pre-existing judgment(s) for action ${actionId}.`);
            return existingJudgments.map(q => {
                const judgmentId = q.subject.id;
                const judgment = {
                    id: judgmentId,
                    judgesAction: actionId,
                    appliesRule: this.store.getObjects(judgmentId, this.ONTOLOGY_PREFIX + 'appliesRule', null)[0]?.id,
                    conclusion: this.store.getObjects(judgmentId, this.ONTOLOGY_PREFIX + 'hasConclusion', null)[0]?.value
                };
                return judgment;
            });
        }

        console.log(`No pre-existing judgments found for ${actionId}. Deriving new judgments...`);
        const derivedJudgments = [];
        const allRules = this.knowledge.moralFrameworks.flatMap(f => f.rules);
        const allValues = this.knowledge.moralValues;

        for (const rule of allRules) {
            const ruleMatch = this.checkForRuleMatch(this.store, actionId, rule.id);
            if (ruleMatch.detected) {
                let conclusion = "Judgment Derived"; // Default
                if (ruleMatch.deonticStatus === "Prohibited") {
                    conclusion = "Rule Violation Detected";
                } else if (ruleMatch.deonticStatus === "Obligatory") {
                    conclusion = "Obligation Fulfilled";
                } else if (ruleMatch.deonticStatus === "Permissible") {
                    conclusion = "Permissible Action Confirmed";
                }

                const judgment = {
                    id: `${this.ONTOLOGY_PREFIX}Judgment_${Date.now()}`,
                    type: 'RuleJudgment',
                    judgesAction: actionId,
                    appliesRule: rule.id,
                    conclusion: conclusion,
                    proof: ruleMatch.chain
                };
                derivedJudgments.push(judgment);
            }
        }

        // NEW: Check for value violations
        for (const value of allValues) {
            const valueViolationProof = this.checkForValueViolation(this.store, actionId, value.id);
            if (valueViolationProof.detected) {
                derivedJudgments.push({
                    id: `${this.ONTOLOGY_PREFIX}Judgment_${Date.now()}`,
                    type: 'ValueJudgment',
                    judgesAction: actionId,
                    appliesRule: valueViolationProof.violatingRule, // The rule that caused the value violation
                    conclusion: `Value Violation Detected: ${value.label}`,
                    proof: valueViolationProof.chain
                });
            }
        }

        if (derivedJudgments.length > 0) {
            console.log(`Derived ${derivedJudgments.length} new judgment(s) for action ${actionId}.`);
        }

        return derivedJudgments;
    };

    MoralReasoner.prototype.checkForRuleMatch = function(n3Store, actionId, moralRuleId) {
        const _localName = (uri) => uri.substring(uri.lastIndexOf('#') + 1);
        const actionName = _localName(actionId);
        const moralRuleName = _localName(moralRuleId);

        console.log(`%c[Check] Does "${actionName}" violate rule "${moralRuleName}"?`, 'color: navy; font-weight: bold;');

        const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

        const classificationRules = n3Store.getSubjects(RDF_TYPE, this.ONTOLOGY_PREFIX + 'ClassificationRule', null);
        const actionClasses = [];
        const proofChain = new Set();

        n3Store.getQuads(actionId, null, null, null).forEach(q => proofChain.add(q));

        for (const rule of classificationRules) {
            let conditionsMet = true;
            const ruleQuads = n3Store.getQuads(rule.id, null, null, null);

            console.log(`  %c- Testing ClassificationRule: "${_localName(rule.id)}"`, 'color: #777');

            const requiredIntent = n3Store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'requiresIntent', null)[0];
            if (requiredIntent) {
                const actionIntent = n3Store.getObjects(actionId, this.ONTOLOGY_PREFIX + 'realizesIntent', null)[0];
                if (!actionIntent || actionIntent.id !== requiredIntent.id) {
                    conditionsMet = false;
                }
            }

            const requiredArtifact = n3Store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'requiresArtifact', null)[0];
            if (conditionsMet && requiredArtifact) {
                const actionArtifact = n3Store.getObjects(actionId, this.ONTOLOGY_PREFIX + 'actsOn', null)[0];
                if (!actionArtifact || actionArtifact.id !== requiredArtifact.id) {
                    conditionsMet = false;
                }
            }

            const requiresNotOwner = n3Store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'requiresPerformerIsNotOwner', null)[0];
            if (conditionsMet && requiresNotOwner && requiresNotOwner.value === 'true') {
                const performer = n3Store.getObjects(actionId, this.ONTOLOGY_PREFIX + 'performedBy', null)[0];
                const artifact = n3Store.getObjects(actionId, this.ONTOLOGY_PREFIX + 'actsOn', null)[0];
                if (performer && artifact) {
                    const owner = n3Store.getObjects(artifact.id, this.ONTOLOGY_PREFIX + 'ownedBy', null)[0];
                    if (!owner || performer.id === owner.id) {
                        conditionsMet = false;
                    }
                }
            }

            const requiredAction = n3Store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'requiresAction', null)[0];
            if (conditionsMet && requiredAction) {
                if (actionId !== requiredAction.id) {
                    conditionsMet = false;
                }
            }

            if (conditionsMet) {
                const classToAssign = n3Store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'classToAssign', null)[0];
                if (classToAssign) {
                    // Store both the class and the rule that assigned it.
                    console.log(`    %c✔️ Classified "${actionName}" as "${_localName(classToAssign.id)}"`, 'color: green');
                    actionClasses.push({
                        classId: classToAssign.id,
                        classificationRuleQuads: ruleQuads
                    });
                }
            }
        }

        if (actionClasses.length === 0) {
            console.log(`  %c- No classification found for "${actionName}". Rule does not apply.`, 'color: orange');
            return { detected: false, chain: [] };
        }

        const ruleAppliesTo = n3Store.getObjects(moralRuleId, this.ONTOLOGY_PREFIX + 'appliesToClass', null)[0];
        if (!ruleAppliesTo) {
            console.log(`  %c- Rule "${moralRuleName}" has no 'appliesToClass' property. Skipping.`, 'color: orange');
            return { detected: false, chain: [] };
        }

        console.log(`  %c- Moral rule "${moralRuleName}" applies to class "${_localName(ruleAppliesTo.id)}". Checking against action's classes...`, 'color: #777');

        for (const actionClass of actionClasses) {
            if (this.isSubClassOf(actionClass.classId, ruleAppliesTo.id, n3Store)) {
                // Now that we have a confirmed match, add the specific classification rule to the proof.
                actionClass.classificationRuleQuads.forEach(q => proofChain.add(q));
                n3Store.getQuads(moralRuleId, null, null, null).forEach(q => proofChain.add(q));
                const deonticStatus = n3Store.getObjects(moralRuleId, this.ONTOLOGY_PREFIX + 'hasDeonticStatus', null)[0] ?.value;
                console.log(`    %c✔️ RULE MATCH! Rule "${moralRuleName}" (${deonticStatus}) applies to class "${_localName(actionClass.classId)}"`, 'color: green; font-weight: bold;');
                return { detected: true, chain: Array.from(proofChain), deonticStatus: deonticStatus };
            }
        }

        console.log(`  %c- No matching class found. Rule "${moralRuleName}" does not apply.`, 'color: orange');
        return { detected: false, chain: [] };
    };

    /**
     * Checks if an action violates a moral value by breaking a rule that is linked to that value.
     */
    MoralReasoner.prototype.checkForValueViolation = function(n3Store, actionId, valueId) {
        // Step 1: Find all rules that are defined to violate the specified value.
        const violatingRuleQuads = n3Store.getQuads(null, this.ONTOLOGY_PREFIX + 'violatesValue', valueId);
        if (violatingRuleQuads.length === 0) {
            return { detected: false, chain: [] }; // No rule is known to violate this value.
        }

        const violatingRules = violatingRuleQuads.map(q => q.subject.id);

        // Step 2: For each of those rules, check if it applies to the action.
        for (const ruleId of violatingRules) {
            // We only care about rules that are "Prohibited". Fulfilling an "Obligatory" rule that "violatesValue" is a contradiction we ignore for now.
            const deonticStatus = n3Store.getObjects(ruleId, this.ONTOLOGY_PREFIX + 'hasDeonticStatus', null)[0] ?.value;
            if (deonticStatus !== 'Prohibited') continue;

            const ruleMatch = this.checkForRuleMatch(n3Store, actionId, ruleId);
            if (ruleMatch.detected) {
                // We found a path! The action breaks a rule, and that rule violates the value.
                const proofChain = new Set(ruleMatch.chain);
                n3Store.getQuads(ruleId, this.ONTOLOGY_PREFIX + 'violatesValue', valueId).forEach(q => proofChain.add(q));
                return { detected: true, chain: Array.from(proofChain), violatingRule: ruleId };
            }
        }

        return { detected: false, chain: [] };
    };

    MoralReasoner.prototype.isSubClassOf = function(classA, classB, store, visited = new Set()) {
        if (classA === classB) return true;
        if (visited.has(classA)) {
            return false;
        }
        visited.add(classA);

        const parentQuads = store.getQuads(classA, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', null);
        for (const quad of parentQuads) {
            if (this.isSubClassOf(quad.object.id, classB, store, visited)) {
                return true;
            }
        }
        return false;
    };

    MoralReasoner.prototype.getHierarchy = function(classA, classB, store) {
        const chain = [];
        let current = classA;
        while (current && current !== classB) {
            const parentQuad = store.getQuads(current, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', null)[0];
            if (!parentQuad) {
                break;
            }
            chain.push(parentQuad);
            current = parentQuad.object.id;
        }
        return chain;
    };

    window.MoralReasoner = MoralReasoner;

})(window);