// Deontic Logic Service (ES5-compatible)
(function(window) {
    'use strict';

    function DeonticLogicService(knowledge) {
        this.knowledge = knowledge;
        console.log('DeonticLogicService initialized');
    }

    DeonticLogicService.prototype._localName = function(uri) {
        if (!uri) return '';
        var idx = uri.lastIndexOf('#');
        if (idx >= 0) return uri.substring(idx + 1);
        idx = uri.lastIndexOf('/');
        return idx >= 0 ? uri.substring(idx + 1) : uri;
    };

    /**
     * Takes a list of direct evaluations and returns a new list containing both
     * the direct evaluations and any new evaluations inferred from them.
     * @param {Array<Object>} directEvaluations - The list of evaluations found by direct rule application.
     * @returns {Array<Object>} A new, comprehensive list of evaluations.
     */
    DeonticLogicService.prototype.performInference = function(directEvaluations) {
        var allEvaluations = [].concat(directEvaluations); // Start with the direct evaluations
        var inferredEvaluations = [];

        for (var i = 0; i < directEvaluations.length; i++) {
            var evaluation = directEvaluations[i];
            var action = this.knowledge.actions.find(function(a) { return a.id === evaluation.actionId; });
            if (!action) continue;

            var negatedAction = this.knowledge.actions.find(function(a) {
                return a.id === action.negationOf;
            });

            if (!negatedAction) continue;

            var inferredStatus = null;
            // Deontic Square of Opposition: Obligatory(A) <-> Prohibited(¬A)
            if (evaluation.deonticStatus === 'Obligatory') {
                inferredStatus = 'Prohibited';
            } else if (evaluation.deonticStatus === 'Prohibited') {
                inferredStatus = 'Obligatory';
            }

            if (inferredStatus) {
                var newInference = {
                    framework: evaluation.framework,
                    actionId: negatedAction.id,
                    actionLabel: negatedAction.label || this._localName(negatedAction.id),
                    deonticStatus: inferredStatus,
                    justification: 'Inferred by deontic logic: ' + evaluation.deonticStatus + '(' + this._localName(action.id) + ') \u2194 ' + inferredStatus + '(' + this._localName(negatedAction.id) + ')'
                };
                inferredEvaluations.push(newInference);
            }
        }

        return allEvaluations.concat(inferredEvaluations);
    };

    // Expose to the global window object
    window.DeonticLogicService = DeonticLogicService;

})(window);