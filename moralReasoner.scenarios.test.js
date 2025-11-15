const fs = require('fs');
const path = require('path');

// Load your application scripts.
// Note: You will need to apply the CommonJS export pattern to pos-analyzer.js for this to work.
// For now, we will create a mock Analyzer.

const { TTLParser } = require('./js/ttlParser');
const { MoralReasoner } = require('./js/moralReasoner');
const { NLPIntentService } = require('./js/nlpIntentService');
// Assuming pos-analyzer.js is also in the js/ directory
const { Analyzer } = require('./js/POSTagger.js');

// Helper function to load TTL content from your knowledge directory
function loadKnowledgeFile(fileName) {
    // All knowledge files are expected to be in the 'knowledge' directory.
    return fs.readFileSync(path.join(__dirname, 'knowledge', fileName), 'utf-8');
}

describe('Moral Reasoner Scenarios', () => {
    let reasoner; // This will hold our initialized reasoner
    let isSetup = false; // Flag to ensure setup runs only once

    // This async function replaces Jest's `beforeAll` for one-time setup.
    async function setup() {
        if (isSetup) return;

        // Mock the Analyzer since it's complex and not the focus of these tests.
        const parser = new TTLParser();
        const analyzer = new Analyzer({}, { debug: false });

        // Load all necessary TTL files into a single string
        const ttlContent = [
            loadKnowledgeFile('moral-sandbox.ttl'),
            loadKnowledgeFile('valuenet-folk.ttl'),
            loadKnowledgeFile('valuenet-moral-foundations.ttl'),
            loadKnowledgeFile('valuenet-schwartz-values.ttl')
        ].join('\n');

        const knowledge = await parser.parse(ttlContent);
        reasoner = new MoralReasoner(knowledge, new NLPIntentService(analyzer)); // Pass the real NLP service
        isSetup = true;
    }

    // --- Test for Phase 1: Foundational Integration & Value Violation ---
    it('Phase 1: Should prohibit bicycle theft and identify violated values', async () => {
        await setup();
        const instruction = "Bob takes Dave's bicycle to keep";
        const result = reasoner.evaluateAction(instruction);

        // Find the evaluation from the U.S. Law framework
        const usLawEval = result.evaluations.find(e => e.framework === 'U.S. Law');
        assert.isDefined(usLawEval, 'U.S. Law evaluation should be defined');
        assert.equals(usLawEval.deonticStatus, 'Prohibited', 'Theft should be prohibited by U.S. Law');
        assert.contains(usLawEval.violatedValues, 'SecurityDisposition', 'Should violate Security');
        assert.contains(usLawEval.violatedValues, 'FairnessDisposition', 'Should violate Fairness');

        // Find the evaluation from the Christian Values framework
        const christianEval = result.evaluations.find(e => e.framework === 'Christian Values');
        assert.isDefined(christianEval, 'Christian Values evaluation should be defined');
        assert.equals(christianEval.deonticStatus, 'Prohibited', 'Theft should be prohibited by Christian Values');
        assert.contains(christianEval.violatedValues, 'HonestyDisposition', 'Should violate Honesty');
    });

    // --- Test for Phase 2: Testing Moral Nuance & Conflict ---
    it('Phase 2: Should show conflict in the "Robin Hood" scenario', async () => {
        await setup();
        const instruction = "Jean Valjean steals bread to feed a starving family";
        const result = reasoner.evaluateAction(instruction);

        // The action should be classified as both Theft and an Act of Care
        assert.contains(result.actionClasses, '"Theft"', 'Action should be classified as Theft');
        assert.contains(result.actionClasses, '"CareDisposition"', 'Action should be classified as Care');

        // U.S. Law should prohibit the action based on the "Theft" classification
        const usLawEval = result.evaluations.find(e => e.framework === 'U.S. Law');
        assert.isDefined(usLawEval, 'U.S. Law evaluation should be defined');
        assert.equals(usLawEval.deonticStatus, 'Prohibited', 'Theft part should be prohibited');

        // Common Decency should permit the action based on the "Care" classification
        const commonDecencyEval = result.evaluations.find(e => e.framework === 'Common Decency');
        assert.isDefined(commonDecencyEval, 'Common Decency evaluation should be defined');
        assert.equals(commonDecencyEval.deonticStatus, 'Permissible', 'Care part should be permissible');
    });

    // --- Test for Phase 3: Testing Hierarchical Value Inference ---
    it('Phase 3: Should apply a general rule for Benevolence to a specific act of Kindness', async () => {
        await setup();
        const instruction = "A person helps an elderly neighbor cross the street";
        const result = reasoner.evaluateAction(instruction);

        // The action should be classified as Kindness
        assert.contains(result.actionClasses, '"KindnessDisposition"', 'Action should be classified as Kindness');

        // The Humanitarian Values framework should find the action Obligatory
        // because Kindness is a sub-class of Benevolence.
        const humanitarianEval = result.evaluations.find(e => e.framework === 'Humanitarian Values');
        assert.isDefined(humanitarianEval, 'Humanitarian Values evaluation should be defined');
        assert.equals(humanitarianEval.deonticStatus, 'Obligatory', 'Kindness should be seen as an obligatory act of Benevolence');
        assert.contains(humanitarianEval.justification, 'BenevolenceDisposition', 'Justification should mention the parent class Benevolence');
    });
});