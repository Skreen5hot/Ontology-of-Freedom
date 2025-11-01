class MoralReasoner {
    constructor(knowledge) {
        this.knowledge = knowledge;
    }

    matchInstruction(instruction) {
        console.log('Matching instruction:', instruction);
        instruction = instruction.toLowerCase();

        // Add debugging for available actions and intents
        console.log('Available actions:', this.knowledge.actions);
        console.log('Available intents:', this.knowledge.intents);

        function localName(uri) {
            if (!uri) return '';
            var idx = uri.lastIndexOf('#');
            if (idx >= 0) return uri.substring(idx + 1);
            idx = uri.lastIndexOf('/');
            return idx >= 0 ? uri.substring(idx + 1) : uri;
        }

        // common verbs/keywords
        var verbs = ['return', 'keep', 'pick', 'pickup', 'pick up', 'give back'];

        for (const action of this.knowledge.actions) {
            console.log('Checking action:', action.id);
            const intent = this.knowledge.intents.find(i => i.id === action.realizesIntent);
            console.log('Associated intent:', intent);

            // Gather matchable strings: agent, artifact, intent label, action label, id local names
            var agent = this.knowledge.agents.find(a => a.id === action.performedBy);
            var artifact = this.knowledge.artifacts.find(a => a.id === action.actsOn);

            var agentLabels = [];
            if (agent) {
                if (agent.label) agentLabels.push(agent.label.toLowerCase());
                agentLabels.push(localName(agent.id).toLowerCase());
            }

            var artifactLabels = [];
            if (artifact) {
                if (artifact.label) artifactLabels.push(artifact.label.toLowerCase());
                artifactLabels.push(localName(artifact.id).toLowerCase());
            }

            var intentLabels = [];
            if (intent) {
                if (intent.label) intentLabels.push(intent.label.toLowerCase());
                intentLabels.push(localName(intent.id).toLowerCase());
            }

            var actionLabels = [];
            if (action.label) actionLabels.push(action.label.toLowerCase());
            actionLabels.push(localName(action.id).toLowerCase());

            // check for agent match
            var agentMatched = agentLabels.some(function(s) { return s && instruction.indexOf(s) !== -1; });
            // check for artifact match
            var artifactMatched = artifactLabels.some(function(s) { return s && instruction.indexOf(s) !== -1; });
            // check for intent or verb match
            var intentMatched = intentLabels.some(function(s) { return s && instruction.indexOf(s) !== -1; });
            var verbMatched = verbs.some(function(v) { return instruction.indexOf(v) !== -1; });
            // check action label/id
            var actionMatched = actionLabels.some(function(s) { return s && instruction.indexOf(s) !== -1; });

            console.log('agentMatched:', agentMatched, 'artifactMatched:', artifactMatched, 'intentMatched:', intentMatched, 'verbMatched:', verbMatched, 'actionMatched:', actionMatched);

            // Accept when we see (agent or action) + (artifact or intent or verb)
            if ((agentMatched || actionMatched) && (artifactMatched || intentMatched || verbMatched)) {
                console.log('Instruction matches action:', action.id);
                return action;
            }
        }

        console.log('No matching action found');
        return null;
    }

    evaluateAction(action) {
        console.log('Evaluating action:', action);
        if (!action) return null;

        // Find the corresponding moral evaluation from the TTL
        const evaluation = this.knowledge.evaluations.find(e => e.action === action.id);
        console.log('Found evaluation:', evaluation);

        if (!evaluation) return null;

        // Find related entities
        const artifact = this.knowledge.artifacts.find(a => a.id === action.actsOn);
        const agent = this.knowledge.agents.find(a => a.id === action.performedBy);
        const intent = this.knowledge.intents.find(i => i.id === action.realizesIntent);
        
        // Map assigned value IDs from the evaluation to labels
        var assignedLabels = (evaluation.values || []).map(function(valueId) {
            var v = this.knowledge.moralValues.find(function(m) { return m.id === valueId; }.bind(this));
            return v ? v.label : (valueId ? valueId.split('#')[1] : valueId);
        }.bind(this));

        console.log('Assigned values from evaluation (labels):', assignedLabels);

        // Check for violations (explicit) and promoted values
        var violatedValues = [];
        var promotedValues = [];

        var prefixes = (this.knowledge && this.knowledge.prefixes) ? this.knowledge.prefixes : {};
        var exPrefix = prefixes.ex || 'http://example.org/moral_sandbox#';

        if (this.knowledge.store) {
            console.log('Checking store for explicit violatesValue / hasMoralValue triples');

            // Violations declared on the action
            var violationQuads = this.knowledge.store.getQuads(action.id, exPrefix + 'violatesValue', null) || [];
            violatedValues = violationQuads.map(function(q) {
                var v = this.knowledge.moralValues.find(function(m) { return m.id === q.object.value; }.bind(this));
                return v ? v.label : (q.object.value ? q.object.value.split('#')[1] : q.object.value);
            }.bind(this));

            // Promoted values declared on the action via ex:hasMoralValue
            var promotedQuads = this.knowledge.store.getQuads(action.id, exPrefix + 'hasMoralValue', null) || [];
            promotedValues = promotedQuads.map(function(q) {
                var v = this.knowledge.moralValues.find(function(m) { return m.id === q.object.value; }.bind(this));
                return v ? v.label : (q.object.value ? q.object.value.split('#')[1] : q.object.value);
            }.bind(this));

            // If the evaluation assigned values include items, use them to supplement promotedValues
            // Assigned values may include both promoted and violated ones; compute promoted = assigned - violated
            if (assignedLabels && assignedLabels.length > 0) {
                // Merge assignedLabels into promotedCandidates
                var promotedCandidates = assignedLabels.slice();
                // Remove any that are also in violatedValues
                promotedValues = promotedCandidates.filter(function(lbl) { return violatedValues.indexOf(lbl) === -1; });
            }

            console.log('Violated values (labels):', violatedValues);
            console.log('Promoted values (labels):', promotedValues);
        } else {
            console.log('No store available, using evaluation assigned values as promoted');
            violatedValues = [];
            promotedValues = assignedLabels;
        }

        const result = {
            actionId: action.id,
            moralScore: violatedValues.length > 0 ? 'negative' : 'positive',
            promotedValues: promotedValues,
            violatedValues: violatedValues,
            justification: evaluation.justification,
            steps: [
                `Agent ${agent ? agent.label : action.performedBy} identified`,
                `Artifact ${artifact ? artifact.label : action.actsOn} identified`,
                `Intent: ${intent ? intent.label : action.realizesIntent}`,
                violatedValues.length > 0 ? `Violated values: ${violatedValues.join(', ')}` : null,
                promotedValues.length > 0 ? `Promoted values: ${promotedValues.join(', ')}` : null,
                evaluation.justification
            ].filter(step => step !== null)
        };

        console.log('Evaluation result:', result);
        return result;
    }

    getReasoningChain(action) {
        if (!action) return [];
        
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