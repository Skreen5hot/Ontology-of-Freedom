class TTLParser {
    constructor() {
        this.parser = new N3.Parser();
        this.store = new N3.Store();
    }

    async parse(ttlContent) {
        return new Promise((resolve, reject) => {
            this.parser.parse(ttlContent, (error, quad, prefixes) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                if (quad) {
                    this.store.add(quad);
                } else {
                    // Parsing complete, organize knowledge
                    resolve(this.organizeKnowledge(prefixes));
                }
            });
        });
    }

    organizeKnowledge(prefixes) {
        const knowledge = {
            agents: [],
            artifacts: [],
            actions: [],
            intents: [],
            moralValues: []
        };

        // Helper to get label from entity
        const getLabel = (subject) => {
            const labelQuads = this.store.getQuads(subject, 'http://www.w3.org/2000/01/rdf-schema#label', null);
            return labelQuads.length > 0 ? labelQuads[0].object.value : null;
        };

        // Process each quad in the store
        for (const quad of this.store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', null)) {
            const subject = quad.subject.value;
            const type = quad.object.value;

            if (type.endsWith('Agent')) {
                knowledge.agents.push({
                    id: subject,
                    label: getLabel(subject)
                });
            } else if (type.endsWith('Artifact')) {
                const ownedByQuads = this.store.getQuads(subject, prefixes.ex + 'ownedBy', null);
                knowledge.artifacts.push({
                    id: subject,
                    label: getLabel(subject),
                    ownedBy: ownedByQuads.length > 0 ? ownedByQuads[0].object.value : null
                });
            } else if (type.endsWith('Action')) {
                const action = {
                    id: subject,
                    performedBy: null,
                    actsOn: null,
                    realizesIntent: null
                };

                const performedByQuads = this.store.getQuads(subject, prefixes.ex + 'performedBy', null);
                const actsOnQuads = this.store.getQuads(subject, prefixes.ex + 'actsOn', null);
                const intentQuads = this.store.getQuads(subject, prefixes.ex + 'realizesIntent', null);

                if (performedByQuads.length > 0) action.performedBy = performedByQuads[0].object.value;
                if (actsOnQuads.length > 0) action.actsOn = actsOnQuads[0].object.value;
                if (intentQuads.length > 0) action.realizesIntent = intentQuads[0].object.value;

                knowledge.actions.push(action);
            } else if (type.endsWith('Intent')) {
                knowledge.intents.push({
                    id: subject,
                    label: getLabel(subject)
                });
            } else if (type.endsWith('MoralValue')) {
                knowledge.moralValues.push(subject.split('#')[1]);
            }
        }

        return knowledge;
    }
}