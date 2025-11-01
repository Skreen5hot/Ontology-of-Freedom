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
        
        for (const action of this.knowledge.actions) {
            console.log('Checking action:', action.id);
            const intent = this.knowledge.intents.find(i => i.id === action.realizesIntent);
            console.log('Associated intent:', intent);
            
            // Check for "keep" or "return" keywords
            if (instruction.includes('keep') && action.id.includes('Keep')) {
                console.log('Matched keep action');
                return action;
            }
            if (instruction.includes('return') && action.id.includes('Return')) {
                console.log('Matched return action');
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
        
        // Map value IDs to their labels
        const values = evaluation.values.map(valueId => {
            const value = this.knowledge.moralValues.find(v => v.id === valueId);
            return value ? value.label : valueId.split('#')[1];
        });

        console.log('Mapped values:', values);

        // Check for violations and promoted values
        let violatedValues = [];
        let promotedValues = [];

        if (this.knowledge.store) {
            console.log('Checking for violations and promoted values...');
            const prefix = this.knowledge.prefixes.ex;

            // Check for violations
            const violationQuads = this.knowledge.store.getQuads(
                action.id, 
                prefix + 'violatesValue', 
                null
            );
            violatedValues = violationQuads.map(quad => {
                const value = this.knowledge.moralValues.find(v => v.id === quad.object.value);
                return value ? value.label : quad.object.value.split('#')[1];
            });

            // Check for promoted values
            const promotedQuads = this.knowledge.store.getQuads(
                action.id, 
                prefix + 'hasMoralValue', 
                null
            );
            promotedValues = promotedQuads.map(quad => {
                const value = this.knowledge.moralValues.find(v => v.id === quad.object.value);
                return value ? value.label : quad.object.value.split('#')[1];
            });

            console.log('Violated values:', violatedValues);
            console.log('Promoted values:', promotedValues);
        } else {
            console.log('No store available, using evaluation values');
            // Fallback to using evaluation values
            violatedValues = [];
            promotedValues = evaluation.values;
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