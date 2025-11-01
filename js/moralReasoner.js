class MoralReasoner {
    constructor(knowledge) {
        this.knowledge = knowledge;
    }

    matchInstruction(instruction) {
        // Simple pattern matching for demo purposes
        // Could be enhanced with NLP libraries like compromise.js
        instruction = instruction.toLowerCase();
        
        for (const action of this.knowledge.actions) {
            const intent = this.knowledge.intents.find(i => i.id === action.realizesIntent);
            if (intent && instruction.includes(intent.label.toLowerCase())) {
                return action;
            }
        }
        
        return null;
    }

    evaluateAction(action) {
        if (!action) return null;

        const evaluation = {
            actionId: action.id,
            values: [],
            justification: ''
        };

        // Find the artifact and its owner
        const artifact = this.knowledge.artifacts.find(a => a.id === action.actsOn);
        const agent = this.knowledge.agents.find(a => a.id === action.performedBy);
        const intent = this.knowledge.intents.find(i => i.id === action.realizesIntent);

        if (!artifact || !agent || !intent) return null;

        // Simple rule engine
        if (artifact.ownedBy !== agent.id && intent.label.includes('Return')) {
            evaluation.values = ['Fairness', 'Trust', 'Compassion'];
            evaluation.justification = 'Action promotes fairness by returning property, builds trust through honest behavior, and shows compassion for the owner\'s situation.';
        }

        // Add reasoning steps
        evaluation.steps = [
            `Agent ${agent.label} identified`,
            `Artifact ${artifact.label} belongs to ${artifact.ownedBy}`,
            `Intent: ${intent.label}`,
            `Moral values identified: ${evaluation.values.join(', ')}`,
            evaluation.justification
        ];

        return evaluation;
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