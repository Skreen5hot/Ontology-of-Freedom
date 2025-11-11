// NLPIntentService (ES5-compatible)
(function(window) {
    'use strict';

    function NLPIntentService(analyzerInstance) {
        if (!analyzerInstance) {
            throw new Error("NLPIntentService requires an instance of the Analyzer.");
        }
        this.analyzer = analyzerInstance;
        console.log('NLPIntentService initialized');
    }

    /**
     * Extracts a structured intent from a natural language sentence.
     * @param {string} sentence The user's instruction.
     * @returns {object|null} A structured intent object or null if parsing fails.
     */
    NLPIntentService.prototype.extractIntent = function(sentence) {
        console.log('[NLP] Extracting intent from:', sentence);
        if (!sentence) return null;

        // Use the full pipeline from your Analyzer
        var taggedWords = this.analyzer.tagger.tagSentence(sentence);
        var chunks = this.analyzer.tagger.chunk(taggedWords);
        var dependencies = this.analyzer.parser.parse(chunks);

        console.log('[NLP] Dependencies found:', dependencies);

        var intent = {
            agent: null,
            verb: null,
            object: null,
            isNegated: false
        };

        // --- Intent Extraction Logic ---

        // Find negation (e.g., "not", "n't")
        if (sentence.toLowerCase().includes(' not') || sentence.toLowerCase().includes("n't")) {
            intent.isNegated = true;
        }

        // Find the main verb, subject (agent), and object from dependencies
        var subjectDep = dependencies.find(function(d) { return d.relation === 'nsubj'; });
        var objectDep = dependencies.find(function(d) { return d.relation === 'dobj'; });

        if (subjectDep) {
            intent.agent = subjectDep.dependent;
            // The head of the subject is often the main verb
            intent.verb = subjectDep.head;
        }

        if (objectDep) {
            intent.object = objectDep.dependent;
            // If the verb wasn't found via the subject, try finding it as the head of the object
            if (!intent.verb) {
                intent.verb = objectDep.head;
            }
        }

        // Fallback for simple verb phrases if no clear dependencies are found
        if (!intent.verb && chunks.some(function(c) { return c.type === 'VP'; })) {
            intent.verb = chunks.find(function(c) { return c.type === 'VP'; }).lemmatizedText;
        }

        console.log('[NLP] Extracted Intent:', intent);
        return (intent.agent || intent.verb) ? intent : null;
    };

    window.NLPIntentService = NLPIntentService;

})(window);