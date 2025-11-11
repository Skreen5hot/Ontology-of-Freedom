class MoralReasoner {
    constructor(knowledge, nlpService) {
        this.knowledge = knowledge;
        this.deonticService = new DeonticLogicService(knowledge);
        this.nlpService = nlpService; // The new NLPIntentService
        if (!this.nlpService) throw new Error("MoralReasoner requires an NLP Service.");
    }

    _localName(uri) {
        if (!uri) return '';
        var idx = uri.lastIndexOf('#');
        if (idx >= 0) return uri.substring(idx + 1);
        idx = uri.lastIndexOf('/');
        return idx >= 0 ? uri.substring(idx + 1) : uri;
    }

    findActionFromInstruction(instruction) {
        const intent = this.nlpService.extractIntent(instruction);
        if (!intent) {
            console.log('NLP Service could not extract a valid intent.');
            return null;
        }

        let bestMatch = { action: null, score: 0 };

        for (const action of this.knowledge.actions) {
            let currentScore = 0;
            const actionIntent = this.knowledge.intents.find(i => i.id === action.realizesIntent);
            const agent = this.knowledge.agents.find(a => a.id === action.performedBy);
            const artifact = this.knowledge.artifacts.find(a => a.id === action.actsOn);

            // Match Agent
            if (intent.agent && agent && agent.label.toLowerCase().includes(intent.agent)) {
                currentScore += 5;
            }

            // Match Object/Artifact
            if (intent.object && artifact && artifact.label.toLowerCase().includes(intent.object)) {
                currentScore += 5;
            }

            // Match Verb/Intent
            if (intent.verb) {
                const verbWords = intent.verb.split(' ');
                if (action.label && verbWords.some(v => action.label.toLowerCase().includes(v))) {
                    currentScore += 3;
                }
                if (actionIntent && actionIntent.label && verbWords.some(v => actionIntent.label.toLowerCase().includes(v))) {
                    currentScore += 3;
                }
            }

            if (currentScore > bestMatch.score) {
                bestMatch = { action: action, score: currentScore };
            }
        }

        if (bestMatch.score > 5) { // Require a reasonably confident score
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

    /**
     * Finds all direct moral rule applications for a given action.
     * Does NOT perform inference.
     * @param {Object} action - The action to evaluate.
     * @param {Array<string>} actionClasses - The classes the action belongs to.
     * @returns {Array<Object>} A list of direct evaluation results.
     */
    _findDirectEvaluations(action, actionClasses) {
        const directEvaluations = [];
        for (const framework of this.knowledge.moralFrameworks) {
            for (const rule of framework.rules) {
                const ruleApplies = actionClasses.some(actionClass =>
                    this._isSubClassOf(actionClass, rule.appliesToClass)
                );

                if (ruleApplies) {
                    console.log(` -> Direct rule matched for ${this._localName(action.id)} in framework ${framework.label}`);
                    const evalResult = {
                        framework: framework.label,
                        actionId: action.id,
                        actionLabel: action.label || this._localName(action.id),
                        deonticStatus: rule.deontic || 'Permissible',
                        justification: rule.justification
                    };
                    directEvaluations.push(evalResult);
                }
            }
        }
        return directEvaluations;
    }


    evaluateAction(action, allActions) {
        console.log('Evaluating action:', action);
        if (!action) return null;

        // --- NEW CLASS-BASED REASONING ---

        // 1. Classify the action instance
        let directEvaluations = [];
        const actionClasses = this._classifyAction(action);
        directEvaluations = directEvaluations.concat(this._findDirectEvaluations(action, actionClasses));

        // 2. Also find direct evaluations for the negated action, if it exists.
        const negatedAction = allActions.find(a => a.id === action.negationOf);
        if (negatedAction) {
            const negatedActionClasses = this._classifyAction(negatedAction);
            directEvaluations = directEvaluations.concat(this._findDirectEvaluations(negatedAction, negatedActionClasses));
        }

        // 3. Pass all direct findings to the DeonticLogicService for inference.
        console.log('Passing direct evaluations to DeonticLogicService:', directEvaluations);
        const evaluations = this.deonticService.performInference(directEvaluations);

        if (evaluations.length === 0) {
             return {
                evaluations: [{
                    framework: 'General',
                    actionId: action.id,
                    actionLabel: action.label || this._localName(action.id),
                    deonticStatus: 'Permissible', // Default status
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