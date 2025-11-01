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

        var typeQuads = this.store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', null) || [];
        for (var i = 0; i < typeQuads.length; i++) {
            var quad = typeQuads[i];
            var subject = quad.subject.value;
            var type = quad.object.value;

            if (type.indexOf('Agent', type.length - 'Agent'.length) !== -1) {
                knowledge.agents.push({ id: subject, label: getLabel(subject) });
            } else if (type.indexOf('Artifact', type.length - 'Artifact'.length) !== -1) {
                var ownedBy = self.store.getQuads(subject, (prefixes && prefixes.ex ? prefixes.ex : 'http://example.org/moral_sandbox#') + 'ownedBy', null) || [];
                knowledge.artifacts.push({ id: subject, label: getLabel(subject), ownedBy: ownedBy.length > 0 ? ownedBy[0].object.value : null });
            } else if (type.indexOf('Action', type.length - 'Action'.length) !== -1) {
                var action = { id: subject, performedBy: null, actsOn: null, realizesIntent: null };
                var pb = self.store.getQuads(subject, (prefixes && prefixes.ex ? prefixes.ex : 'http://example.org/moral_sandbox#') + 'performedBy', null) || [];
                var ao = self.store.getQuads(subject, (prefixes && prefixes.ex ? prefixes.ex : 'http://example.org/moral_sandbox#') + 'actsOn', null) || [];
                var ri = self.store.getQuads(subject, (prefixes && prefixes.ex ? prefixes.ex : 'http://example.org/moral_sandbox#') + 'realizesIntent', null) || [];
                if (pb.length > 0) action.performedBy = pb[0].object.value;
                if (ao.length > 0) action.actsOn = ao[0].object.value;
                if (ri.length > 0) action.realizesIntent = ri[0].object.value;
                knowledge.actions.push(action);
            } else if (type.indexOf('Intent', type.length - 'Intent'.length) !== -1) {
                knowledge.intents.push({ id: subject, label: getLabel(subject) });
            } else if (type.indexOf('Value', type.length - 'Value'.length) !== -1) {
                knowledge.moralValues.push({ id: subject, label: getLabel(subject) });
            } else if (type.indexOf('MoralEvaluation', type.length - 'MoralEvaluation'.length) !== -1) {
                var evalObj = { id: subject, label: getLabel(subject), justification: getJustification(subject), values: [], action: null };
                var actQ = self.store.getQuads(subject, (prefixes && prefixes.ex ? prefixes.ex : 'http://example.org/moral_sandbox#') + 'evaluatesAction', null) || [];
                if (actQ.length > 0) evalObj.action = actQ[0].object.value;
                var valQ = self.store.getQuads(subject, (prefixes && prefixes.ex ? prefixes.ex : 'http://example.org/moral_sandbox#') + 'assignsValue', null) || [];
                for (var j = 0; j < valQ.length; j++) { evalObj.values.push(valQ[j].object.value); }
                knowledge.evaluations.push(evalObj);
            }
        }

        // already attached store & prefixes above
        return knowledge;
    };

    // expose
    window.TTLParser = TTLParser;

})(window);