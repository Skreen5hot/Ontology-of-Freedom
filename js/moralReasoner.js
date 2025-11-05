class MoralReasoner {
    constructor(knowledge) {
        this.knowledge = knowledge;
    }

    _localName(uri) {
        if (!uri) return '';
        var idx = uri.lastIndexOf('#');
        if (idx >= 0) return uri.substring(idx + 1);
        idx = uri.lastIndexOf('/');
        return idx >= 0 ? uri.substring(idx + 1) : uri;
    }

    matchInstruction(instruction) {
        console.log('Matching instruction:', instruction);
        instruction = instruction.toLowerCase();
        const instructionWords = instruction.split(/\s+/);
 
        let bestMatch = { action: null, score: 0 };
 
        for (const action of this.knowledge.actions) {
            const intent = this.knowledge.intents.find(i => i.id === action.realizesIntent);
            const agent = this.knowledge.agents.find(a => a.id === action.performedBy);
            const artifact = this.knowledge.artifacts.find(a => a.id === action.actsOn);
 
            let keywords = [];
            if (agent && agent.label) keywords = keywords.concat(agent.label.toLowerCase().split(/\s+/));
            if (artifact && artifact.label) keywords = keywords.concat(artifact.label.toLowerCase().split(/\s+/));
            if (intent && intent.label) keywords = keywords.concat(intent.label.toLowerCase().split(/\s+/));
            if (action.label) keywords = keywords.concat(action.label.toLowerCase().split(/\s+/));
            
            // Add local names from IDs
            keywords.push(this._localName(action.id).toLowerCase());
            if (agent) keywords.push(this._localName(agent.id).toLowerCase());
            if (artifact) keywords.push(this._localName(artifact.id).toLowerCase());
            if (intent) keywords.push(this._localName(intent.id).toLowerCase());
 
            // Clean up keywords (remove punctuation, etc.)
            keywords = keywords.map(k => k.replace(/[(),:]/g, '')).filter(Boolean);
 
            let currentScore = 0;
            const matchedWords = new Set();
 
            // Calculate score based on keyword matches
            instructionWords.forEach(word => {
                if (keywords.includes(word) && !matchedWords.has(word)) {
                    currentScore++;
                    matchedWords.add(word);
                }
            });
 
            // console.log(`Action ${action.id} scored ${currentScore} with keywords:`, keywords);
 
            if (currentScore > bestMatch.score) {
                bestMatch = { action: action, score: currentScore };
            }
        }
 
        if (bestMatch.score > 0) {
            console.log(`Best match is ${bestMatch.action.id} with a score of ${bestMatch.score}`);
            return bestMatch.action;
        } else {
            console.log('No matching action found');
            return null;
        }
    }

    /**
     * Classifies an action instance into a moral category (e.g., Theft).
     * This is a generic rule interpreter that uses ClassificationRules from the knowledge graph.
     */
    _classifyAction(action) {
        const classifiedAs = [];
        const classificationRules = this.knowledge.classificationRules || [];

        for (const rule of classificationRules) {
            let conditionsMet = true;

            // Condition: requiresIntent
            if (rule.requiresIntent && action.realizesIntent !== rule.requiresIntent) {
                conditionsMet = false;
            }

            // Condition: requiresAction (simple match for this scenario)
            if (conditionsMet && rule.requiresAction && action.id !== rule.requiresAction) {
                conditionsMet = false;
            }

            // Condition: requiresArtifact
            if (conditionsMet && rule.requiresArtifact && action.actsOn !== rule.requiresArtifact) {
                conditionsMet = false;
            }

            // Condition: requiresPerformerIsNotOwner
            if (conditionsMet && rule.requiresPerformerIsNotOwner) {
                const agent = this.knowledge.agents.find(a => a.id === action.performedBy);
                const artifact = this.knowledge.artifacts.find(a => a.id === action.actsOn);
                if (!agent || !artifact || !artifact.ownedBy || agent.id === artifact.ownedBy) {
                    conditionsMet = false;
                }
            }

            // --- Add other condition checks here as the system grows ---

            if (conditionsMet) {
                if (rule.classToAssign) {
                    classifiedAs.push(rule.classToAssign);
                }
            }
        }

        console.log(`Action ${action.id} classified as:`, classifiedAs);
        return classifiedAs;
    }

    /**
     * Checks if classA is a subclass of classB, traversing the hierarchy.
     * @param {string} classA - The potential subclass.
     * @param {string} classB - The potential superclass.
     * @param {Set<string>} visited - To prevent infinite loops in cyclic graphs.
     * @returns {boolean}
     */
    _isSubClassOf(classA, classB, visited = new Set()) {
        // console.log(`%c   [SubClass Check] Is ${this._localName(classA)} a subclass of ${this._localName(classB)}?`, 'color: gray');
        if (classA === classB) {
            return true;
        }
        if (visited.has(classA)) {
            return false; // Cycle detected
        }
        visited.add(classA);

        const exPrefix = this.knowledge.prefixes.ex || 'http://example.org/moral_sandbox#';
        const parentQuads = this.knowledge.store.getQuads(classA, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', null);

        for (const quad of parentQuads) {
            // console.log(`%c     ...recursively checking parent ${this._localName(quad.object.value)}`, 'color: lightgray');
            if (this._isSubClassOf(quad.object.value, classB, visited)) {
                return true;
            }
        }
        return false;
    }

    evaluateAction(action, allActions) {
        console.log('Evaluating action:', action);
        if (!action) return null;

        // --- NEW CLASS-BASED REASONING ---

        // 1. Classify the action instance
        const actionClasses = this._classifyAction(action);
        if (actionClasses.length === 0) {
            return { // Return a default result if no classification applies
                evaluations: [{
                    framework: 'General',
                    actionId: action.id,
                    actionLabel: action.label || this._localName(action.id),
                    deonticStatus: 'Permissible', // Default status
                    justification: 'The action does not fit any known moral classification (e.g., Theft).'
                }],
                steps: [`Action ${action.id} did not match any specific moral classification.`]
            };
        }

        // 2. Find the direct deontic status of the action by applying moral frameworks
        const evaluations = [];
        for (const framework of this.knowledge.moralFrameworks) {
            // console.log(`-> Evaluating against framework: ${framework.label}`);
            for (const rule of framework.rules) {
                // console.log(`  - Checking rule: ${rule.id ? this._localName(rule.id) : 'Unnamed Rule'} which applies to class: ${this._localName(rule.appliesToClass)}`);
                // Check if any of the action's classes are a subclass of the rule's target class.
                const ruleApplies = actionClasses.some(actionClass => 
                    this._isSubClassOf(actionClass, rule.appliesToClass)
                );

                // console.log(`  - Rule applies? ${ruleApplies}`);

                if (ruleApplies) {
                    const evalResult = {
                        framework: framework.label,
                        actionId: action.id,
                        actionLabel: action.label || this._localName(action.id),
                        deonticStatus: rule.deontic || 'Permissible', // Use deontic status
                        justification: rule.justification
                    };
                    evaluations.push(evalResult);
                    // console.log(`Applied direct rule from ${framework.label} to action ${action.id}`, evalResult);
                }
            }
        }

        // --- Deontic Inference Step ---

        // 3. Infer the deontic status of the negated action
        const negatedAction = allActions.find(a => a.negationOf === action.id || action.negationOf === a.id);

        // If we found direct evaluations, infer the status of the negation.
        if (evaluations.length > 0 && negatedAction) {
            this._inferFromDirect(evaluations, action, negatedAction);
        } 
        // If NO direct evaluations were found, try to infer from the negation.
        else if (evaluations.length === 0 && negatedAction) {
            console.log(`No direct rules for ${this._localName(action.id)}. Attempting inference from its negation: ${this._localName(negatedAction.id)}`);
            // Temporarily evaluate the negated action to see its status
            const tempEval = this.evaluateAction(negatedAction, allActions);
            this._inferFromNegation(evaluations, action, tempEval.evaluations);
        }

        if (evaluations.length === 0) {
             return {
                evaluations: [{
                    framework: 'General',
                    actionId: action.id,
                    actionLabel: action.label || this._localName(action.id),
                    deonticStatus: 'Permissible',
                    justification: `Action was classified as ${actionClasses.map(c => this._localName(c)).join(', ')}, but no moral framework has a rule for it.`
                }],
                steps: [`Action classified, but no rules found.`]
            };
        }

        // --- Construct final result object ---
        const artifact = this.knowledge.artifacts.find(a => a.id === action.actsOn);
        const agent = this.knowledge.agents.find(a => a.id === action.performedBy);
        const intent = this.knowledge.intents.find(i => i.id === action.realizesIntent);

        const result = {
            evaluations: evaluations,
            steps: [
                `Agent ${agent ? agent.label : action.performedBy} identified`,
                `Artifact ${artifact ? artifact.label : action.actsOn} identified`,
                `Intent: ${intent ? intent.label : action.realizesIntent}`,
                `Action classified as: ${actionClasses.map(c => this._localName(c)).join(', ')}`,
                `Applied ${this.knowledge.moralFrameworks.length} moral framework(s).`
            ].filter(step => step !== null)
        };

        console.log('Evaluation result:', result);
        return result;
    }

    /** Helper to infer status of ¬A from A's direct evaluation. */
    _inferFromDirect(evaluations, directAction, negatedAction) {
        const inferredEvaluations = [];
        for (const evaluation of evaluations) {
            let inferredStatus = null;
            if (evaluation.deonticStatus === 'Obligatory') inferredStatus = 'Prohibited';
            else if (evaluation.deonticStatus === 'Prohibited') inferredStatus = 'Permissible';

            if (inferredStatus) {
                inferredEvaluations.push({
                    framework: evaluation.framework,
                    actionId: negatedAction.id,
                    actionLabel: negatedAction.label || this._localName(negatedAction.id),
                    deonticStatus: inferredStatus,
                    justification: `Inferred by deontic logic: ${evaluation.deonticStatus}(${this._localName(directAction.id)}) \u2194 ${inferredStatus}(${this._localName(negatedAction.id)})`
                });
            }
        }
        evaluations.push(...inferredEvaluations);
    }

    /** Helper to infer status of A from ¬A's evaluation. */
    _inferFromNegation(evaluations, directAction, tempEvals) {
        for (const tempEval of tempEvals) {
            // We are looking for the direct evaluation of the negated action.
            // The `directAction` is what we started with (e.g., LeaveLabUnlocked).
            // Its negation is `directAction.negationOf` (e.g., LockLab).
            if (tempEval.actionId !== directAction.negationOf) continue; // Skip inferences from the recursive call.

            let inferredStatus = null;
            if (tempEval.deonticStatus === 'Obligatory') inferredStatus = 'Prohibited';
            else if (tempEval.deonticStatus === 'Prohibited') inferredStatus = 'Obligatory';

            if (inferredStatus) {
                evaluations.push({
                    framework: tempEval.framework,
                    actionId: directAction.id,
                    actionLabel: directAction.label || this._localName(directAction.id),
                    deonticStatus: inferredStatus,
                    justification: `Inferred by deontic logic: ${tempEval.deonticStatus}(${this._localName(tempEval.actionId)}) \u2194 ${inferredStatus}(${this._localName(directAction.id)})`
                });
            }
        }
    }

    getReasoningChain(action) {
        // Build a chain of related actions if they exist
        const chain = [action];
        const relatedActions = this.knowledge.actions.filter(a => 
            a.actsOn === action.actsOn && a.id !== action.id
        );

        // Sort related actions by logical sequence
        // This could be enhanced with more sophisticated sequencing logic
        chain.push(...relatedActions);

        return chain;
    }
}