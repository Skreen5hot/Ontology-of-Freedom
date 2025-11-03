class MoralReasoner {
    constructor(knowledge) {
        this.knowledge = knowledge;
    }

    matchInstruction(instruction) {
        console.log('Matching instruction:', instruction);
        instruction = instruction.toLowerCase();
        const instructionWords = instruction.split(/\s+/);
 
        function localName(uri) {
            if (!uri) return '';
            var idx = uri.lastIndexOf('#');
            if (idx >= 0) return uri.substring(idx + 1);
            idx = uri.lastIndexOf('/');
            return idx >= 0 ? uri.substring(idx + 1) : uri;
        }
 
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
            keywords.push(localName(action.id).toLowerCase());
            keywords.push(localName(agent.id).toLowerCase());
            keywords.push(localName(artifact.id).toLowerCase());
            keywords.push(localName(intent.id).toLowerCase());
 
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
 
            console.log(`Action ${action.id} scored ${currentScore} with keywords:`, keywords);
 
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

    evaluateAction(action) {
        console.log('Evaluating action:', action);
        if (!action) return null;

        // --- NEW CLASS-BASED REASONING ---

        // 1. Classify the action instance
        const actionClasses = this._classifyAction(action);
        if (actionClasses.length === 0) {
            return { // Return a neutral result if no classification applies
                evaluations: [{
                    framework: 'General',
                    moralScore: 'neutral',
                    promotedValues: [],
                    violatedValues: [],
                    justification: 'The action does not fit any known moral classification (e.g., Theft).'
                }],
                steps: [`Action ${action.id} did not match any specific moral classification.`]
            };
        }

        // 2. Apply all moral frameworks to the classified action
        const evaluations = [];
        for (const framework of this.knowledge.moralFrameworks) {
            for (const rule of framework.rules) {
                // Check if the rule applies to any of the action's classes
                if (actionClasses.includes(rule.appliesToClass)) {
                    const moralValueLabels = (rule.values || []).map(vId => {
                        const mv = this.knowledge.moralValues.find(v => v.id === vId);
                        return mv ? mv.label : vId;
                    });

                    const evalResult = {
                        framework: framework.label,
                        moralScore: rule.judgment,
                        promotedValues: rule.judgment === 'positive' ? moralValueLabels : [],
                        violatedValues: rule.judgment === 'negative' ? moralValueLabels : [],
                        justification: rule.justification
                    };
                    evaluations.push(evalResult);
                    console.log(`Applied rule from ${framework.label} to action ${action.id}`, evalResult);
                }
            }
        }

        if (evaluations.length === 0) {
             return {
                evaluations: [{
                    framework: 'General',
                    moralScore: 'neutral',
                    promotedValues: [],
                    violatedValues: [],
                    justification: `Action was classified as ${actionClasses.map(c => c.split('#')[1]).join(', ')}, but no moral framework has a rule for it.`
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
                `Action classified as: ${actionClasses.map(c => c.split('#')[1]).join(', ')}`,
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