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
        console.log(`\n==================================================`);
        console.log(`EVALUATING ACTION: "${instruction}"`);
        console.log(`==================================================`);

        const action = this.findActionFromInstruction(instruction);

        if (!action) {
            console.error("Could not identify a specific action from the instruction.");
            return {
                evaluations: [{
                    framework: 'System',
                    actionLabel: 'Unknown',
                    deonticStatus: 'Indeterminate',
                    justification: 'Could not identify a specific action from the instruction provided.'
                }]
            };
        }

        // --- 1. Understanding the Action's Nature ---
        console.log("\n--- 1. Understanding the Action ---");
        const classificationResult = this._classifyAction(action.id);
        const actionClasses = classificationResult.classes;
        const classLabelsForLog = Array.from(actionClasses).map(c => `"${this._localName(c)}"`).join(', ');
        const classLabelsForTest = Array.from(actionClasses).map(c => `"${this._localName(c)}"`);
        console.log(`   - The system interpreted this action as involving: ${classLabelsForLog || 'no specific categories'}.`);

        // --- 2. Evaluating Against Moral Frameworks ---
        console.log("\n--- 2. Evaluating Against Moral Frameworks ---");
        const finalEvaluations = [];
        let hasApplicableRule = false;

        for (const framework of this.knowledge.moralFrameworks) {
            console.log(`\n   - Framework: ${framework.label}`);
            let frameworkHasMatch = false;

            for (const rule of framework.rules) {
                const ruleAppliesToClass = this.store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'appliesToClass', null)[0];
                // Get the rule's label from the store, as it might be missing on the object.
                const ruleLabel = this.store.getObjects(rule.id, 'http://www.w3.org/2000/01/rdf-schema#label', null)[0]?.value || this._localName(rule.id);

                if (!ruleAppliesToClass) continue;

                // The core check: Does the rule's target class match any of the action's classes?
                if (actionClasses.has(ruleAppliesToClass.id) || Array.from(actionClasses).some(ac => this.isSubClassOf(ac, ruleAppliesToClass.id, this.store))) {
                    frameworkHasMatch = true;
                    hasApplicableRule = true;

                    const justification = `The action was classified as a form of "${this._localName(ruleAppliesToClass.id)}", and the rule "${ruleLabel}" applies to this class.`;
                    console.log(`     - Rule Applied: "${ruleLabel}"`);
                    console.log(`     - Justification: ${justification}`);
                    console.log(`     - Framework Conclusion: The action is considered ${rule.deontic}.`);

                    // Phase 1: Check for violated values when a rule is broken.
                    const violatedValues = this.store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'violatesValue', null);
                    const violatedValueLabels = violatedValues.map(v => this._localName(v.id));

                    if (violatedValueLabels.length > 0) {
                        console.log(`     - Violated Values: ${violatedValueLabels.join(', ')}`);
                    }

                    finalEvaluations.push({
                        framework: framework.label,
                        actionLabel: action.label,
                        deonticStatus: rule.deontic,
                        justification: justification,
                        // Add violated values to the result object for the UI.
                        violatedValues: violatedValueLabels
                    });
                }
            }

            if (!frameworkHasMatch) {
                console.log(`     - No specific rules from this framework applied to the action.`);
            }
        }

        // --- 3. Overall Judgment Summary ---
        console.log("\n--- 3. Overall Judgment Summary ---");
        if (!hasApplicableRule) {
            console.log("   - No frameworks made a definitive judgment on this action.");
            return {
                evaluations: [{
                    framework: 'General',
                    actionLabel: action.label,
                    deonticStatus: 'Permissible',
                    justification: 'This action does not violate any known rules in the loaded ontologies.'
                }]
            };
        }

        const summary = { Prohibited: [], Permitted: [], Obligatory: [] };
        finalEvaluations.forEach(ev => {
            if (summary[ev.deonticStatus]) {
                summary[ev.deonticStatus].push(ev.framework);
            }
        });
        for (const modality in summary) {
            if (summary[modality].length > 0) {
                console.log(`   - The action is judged as ${modality} by: ${summary[modality].join(', ')}.`);
            }
        }
        console.log(`--- End of Narrative ---\n`);

        return { evaluations: finalEvaluations, actionId: action.id, actionClasses: classLabelsForTest };
    };

    MoralReasoner.prototype.findActionFromInstruction = function(instruction) {
        console.log('[NLP] Attempting to match instruction to a known action...');
        const intent = this.nlpService.extractIntent(instruction);
        if (!intent) {
            console.warn('NLP Service could not extract a valid intent. Falling back to label matching.');
        }

        const instructionWords = instruction.toLowerCase().split(/\s+/);
        let bestMatch = { action: null, score: 0 };
        this.knowledge.actions.forEach(action => {
            if (action.label) {
                const labelWords = action.label.toLowerCase().split(/\s+/);
                const score = instructionWords.filter(word => labelWords.includes(word)).length;
                if (score > bestMatch.score) {
                    bestMatch = { action, score };
                }
            }
        });

        const matchedAction = bestMatch.score > 0 ? bestMatch.action : null;
        if (matchedAction) {
            console.log(`[NLP] Matched to action: ${this._localName(matchedAction.id)}`);
            return matchedAction;
        }

        console.log('No matching action found via NLP label matching.');
        return null;
    };

    /**
     * Classifies an action by running it against all ClassificationRules.
     * This is now called only ONCE per evaluation.
     * @param {string} actionId - The URI of the action to classify.
     * @returns {object} An object containing a Set of class URIs and a proof chain.
     */
    MoralReasoner.prototype._classifyAction = function(actionId) {
        const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
        const classificationRules = this.store.getSubjects(RDF_TYPE, this.ONTOLOGY_PREFIX + 'ClassificationRule', null);
        const resultingClasses = new Set();
        const proofChain = new Set();

        this.store.getQuads(actionId, null, null, null).forEach(q => proofChain.add(q));

        for (const rule of classificationRules) {
            let conditionsMet = true;
            const ruleQuads = this.store.getQuads(rule.id, null, null, null);

            const requiredIntent = this.store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'requiresIntent', null)[0];
            if (requiredIntent) {
                const actionIntent = this.store.getObjects(actionId, this.ONTOLOGY_PREFIX + 'realizesIntent', null)[0];
                if (!actionIntent || actionIntent.id !== requiredIntent.id) {
                    conditionsMet = false;
                }
            }

            const requiredArtifact = this.store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'requiresArtifact', null)[0];
            if (conditionsMet && requiredArtifact) {
                const actionArtifact = this.store.getObjects(actionId, this.ONTOLOGY_PREFIX + 'actsOn', null)[0];
                if (!actionArtifact || actionArtifact.id !== requiredArtifact.id) {
                    conditionsMet = false;
                }
            }

            const requiresNotOwner = this.store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'requiresPerformerIsNotOwner', null)[0];
            if (conditionsMet && requiresNotOwner && requiresNotOwner.value === 'true') {
                const performer = this.store.getObjects(actionId, this.ONTOLOGY_PREFIX + 'performedBy', null)[0];
                const artifact = this.store.getObjects(actionId, this.ONTOLOGY_PREFIX + 'actsOn', null)[0];
                if (performer && artifact) {
                    const owner = this.store.getObjects(artifact.id, this.ONTOLOGY_PREFIX + 'ownedBy', null)[0];
                    if (!owner || performer.id === owner.id) {
                        conditionsMet = false;
                    }
                }
            }

            const requiredAction = this.store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'requiresAction', null)[0];
            if (conditionsMet && requiredAction) {
                if (actionId !== requiredAction.id) {
                    conditionsMet = false;
                }
            }

            if (conditionsMet) {
                const classToAssign = this.store.getObjects(rule.id, this.ONTOLOGY_PREFIX + 'classToAssign', null)[0];
                if (classToAssign) {
                    console.log(`     ✔️ Classified as "${this._localName(classToAssign.id)}" via rule "${this._localName(rule.id)}"`);
                    resultingClasses.add(classToAssign.id);
                    ruleQuads.forEach(q => proofChain.add(q));
                }
            }
        }
        return { classes: resultingClasses, proof: proofChain };
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
        // Normalize URIs by getting the part after '#' to handle different base URIs.
        const localA = this._localName(classA);
        const localB = this._localName(classB);

        if (localA === localB) return true;

        if (visited.has(classA)) {
            return false;
        }
        visited.add(classA);

        // Use the full URI for classA to query the store
        const parentQuads = store.getQuads(classA, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', null);
        for (const quad of parentQuads) {
            if (this.isSubClassOf(quad.object.id, classB, store, visited)) {
                return true;
            }
        }
        return false;
    };

    MoralReasoner.prototype._localName = function(uri) {
        return uri.substring(uri.lastIndexOf('#') + 1);
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

    // Export for Node.js/Jest environment, or attach to window for browsers
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { MoralReasoner };
    } else {
        window.MoralReasoner = MoralReasoner;
    }

})(typeof window !== 'undefined' ? window : {});