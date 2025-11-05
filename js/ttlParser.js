// TTL parser (ES5-compatible)
// Exposes `TTLParser` on the global window object
(function(window) {
    'use strict';

    function TTLParser() {
        if (typeof N3 === 'undefined') {
            console.error('N3 library not loaded');
            throw new Error('N3 library not loaded');
        }
        this.parser = new N3.Parser();
        this.store = new N3.Store();
        console.log('TTLParser initialized (ES5)');
    }

    TTLParser.prototype.parse = function(ttlContent) {
        var self = this;
        console.log('TTLParser.parse called');
        if (!ttlContent) {
            return Promise.reject(new Error('No TTL content provided'));
        }

        return new Promise(function(resolve, reject) {
            try {
                self.parser.parse(ttlContent, function(error, quad, prefixes) {
                    if (error) {
                        console.error('Error while parsing TTL:', error);
                        reject(error);
                        return;
                    }

                    if (quad) {
                        self.store.add(quad);
                    } else {
                        try {
                            var knowledge = self.organizeKnowledge(prefixes);
                            resolve(knowledge);
                        } catch (err) {
                            reject(err);
                        }
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    TTLParser.prototype.organizeKnowledge = function(prefixes) {
        var self = this;
        console.log('Organizing knowledge from parsed TTL');

        var knowledge = {
            agents: [],
            artifacts: [],
            actions: [],
            intents: [],
            moralValues: [],
            evaluations: [],
            actionClasses: [],
            moralFrameworks: [],
            classificationRules: [],
            // moralRules will be nested under frameworks
            store: this.store,
            prefixes: prefixes || {}
        };

        function getLabel(subject) {
            var labelQuads = self.store.getQuads(subject, 'http://www.w3.org/2000/01/rdf-schema#label', null);
            return labelQuads && labelQuads.length > 0 ? labelQuads[0].object.value : null;
        }

        function getJustification(subject) {
            var exPrefix = (prefixes && prefixes.ex) ? prefixes.ex : 'http://example.org/moral_sandbox#';
            var justQuads = self.store.getQuads(subject, exPrefix + 'justificationText', null);
            return justQuads && justQuads.length > 0 ? justQuads[0].object.value : null;
        }

        function getValues(subject, property) {
            var quads = self.store.getQuads(subject, property, null) || [];
            return quads.map(function(q) { return q.object.value; });
        }

        function getSingleValue(subject, property) {
            var quads = self.store.getQuads(subject, property, null) || [];
            return quads.length > 0 ? quads[0].object.value : null;
        }

        var exPrefix = (prefixes && prefixes.ex) ? prefixes.ex : 'http://example.org/moral_sandbox#';

        var typeQuads = this.store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', null) || [];
        for (var i = 0; i < typeQuads.length; i++) {
            var quad = typeQuads[i];
            var subject = quad.subject.value;
            var type = quad.object.value;

            if (type.indexOf('Agent', type.length - 'Agent'.length) !== -1) {
                knowledge.agents.push({ id: subject, label: getLabel(subject) });
            } else if (type.indexOf('Artifact', type.length - 'Artifact'.length) !== -1) {
                var ownedBy = getSingleValue(subject, exPrefix + 'ownedBy');
                knowledge.artifacts.push({ id: subject, label: getLabel(subject), ownedBy: ownedBy });
            } else if (type.indexOf('Action', type.length - 'Action'.length) !== -1) {
                // This handles action *instances*
                var action = { id: subject, label: getLabel(subject), performedBy: null, actsOn: null, realizesIntent: null, negationOf: null };
                action.performedBy = getSingleValue(subject, exPrefix + 'performedBy');
                action.actsOn = getSingleValue(subject, exPrefix + 'actsOn');
                action.realizesIntent = getSingleValue(subject, exPrefix + 'realizesIntent');
                action.negationOf = getSingleValue(subject, exPrefix + 'negationOf');
                knowledge.actions.push(action);
            } else if (type.indexOf('Intent', type.length - 'Intent'.length) !== -1) {
                knowledge.intents.push({ id: subject, label: getLabel(subject) });
            } else if (type.indexOf('Value', type.length - 'Value'.length) !== -1) {
                knowledge.moralValues.push({ id: subject, label: getLabel(subject) });
            } else if (type.indexOf('MoralEvaluation', type.length - 'MoralEvaluation'.length) !== -1) {
                var evalObj = { id: subject, label: getLabel(subject), justification: getJustification(subject), values: [], action: null };
                evalObj.action = getSingleValue(subject, exPrefix + 'evaluatesAction');
                evalObj.values = getValues(subject, exPrefix + 'assignsValue');
                knowledge.evaluations.push(evalObj);
            } else if (type.indexOf('MoralFramework', type.length - 'MoralFramework'.length) !== -1) {
                knowledge.moralFrameworks.push({ id: subject, label: getLabel(subject), rules: [] });
            } else if (type.indexOf('ClassificationRule', type.length - 'ClassificationRule'.length) !== -1) {
                var rule = {
                    id: subject,
                    label: getLabel(subject),
                    classToAssign: getSingleValue(subject, exPrefix + 'classToAssign'),
                    requiresIntent: getSingleValue(subject, exPrefix + 'requiresIntent'),
                    requiresPerformerIsNotOwner: getSingleValue(subject, exPrefix + 'requiresPerformerIsNotOwner') === 'true',
                    requiresAction: getSingleValue(subject, exPrefix + 'requiresAction'),
                    requiresArtifact: getSingleValue(subject, exPrefix + 'requiresArtifact')
                };
                knowledge.classificationRules.push(rule);
            }
        }

        // New, hierarchy-aware pass to find all action classes
        function findAllSubclasses(classUri, store) {
            const directSubclasses = store.getQuads(null, 'http://www.w3.org/2000/01/rdf-schema#subClassOf', classUri).map(q => q.subject.value);
            let allSubclasses = [...directSubclasses];
            for (const sub of directSubclasses) {
                allSubclasses = allSubclasses.concat(findAllSubclasses(sub, store));
            }
            return allSubclasses;
        }

        const allActionSubclassUris = findAllSubclasses(exPrefix + 'Action', self.store);
        const uniqueActionClasses = [...new Set(allActionSubclassUris)];

        // Also find any classes that are just defined as owl:Class and have a rule applying to them
        var owlClassQuads = this.store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/2002/07/owl#Class');
        for(const quad of owlClassQuads) {
            if(!uniqueActionClasses.includes(quad.subject.value)) {
                 uniqueActionClasses.push(quad.subject.value);
            }
        }

        for (const classUri of uniqueActionClasses) {
            if (!knowledge.actionClasses.some(ac => ac.id === classUri)) {
                knowledge.actionClasses.push({ id: classUri, label: getLabel(classUri) });
            }
        }

        // Second pass to connect rules to frameworks
        var ruleQuads = this.store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', exPrefix + 'MoralRule') || [];
        for (var k = 0; k < ruleQuads.length; k++) {
            var ruleSubject = ruleQuads[k].subject.value;
            var frameworkQuad = this.store.getQuads(null, exPrefix + 'hasRule', ruleSubject) || [];
            if (frameworkQuad.length > 0) {
                var frameworkId = frameworkQuad[0].subject.value;
                var framework = knowledge.moralFrameworks.find(f => f.id === frameworkId);
                if (framework) {
                    var rule = {
                        id: ruleSubject,
                        appliesToClass: getSingleValue(ruleSubject, exPrefix + 'appliesToClass'),
                        judgment: getSingleValue(ruleSubject, exPrefix + 'hasMoralJudgment'),
                        deontic: getSingleValue(ruleSubject, exPrefix + 'hasDeonticStatus'),
                        values: getValues(ruleSubject, exPrefix + 'violatesValue').concat(getValues(ruleSubject, exPrefix + 'hasMoralValue')),
                        justification: getJustification(ruleSubject)
                    };
                    framework.rules.push(rule);
                }
            }
        }

        // already attached store & prefixes above
        return knowledge;
    };

    // expose
    window.TTLParser = TTLParser;

})(window);