document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    let currentKnowledge = null;
    let reasoner = null;
    const parser = new TTLParser();
    const analyzer = new Analyzer(window.POSTAGGER_LEXICON, { debug: false }); // Create the full analyzer
    
    // Debug: Check if N3 library is loaded
    if (typeof N3 === 'undefined') {
        console.error('N3 library not loaded!');
        document.getElementById('state-display').textContent = 'Error: N3 library not loaded';
        return;
    }
    console.log('N3 library loaded successfully');

    // DOM elements
    const ttlContent = document.getElementById('ttl-content');
    const ttlFile = document.getElementById('ttl-file');
    const loadTTLBtn = document.getElementById('load-ttl');
    const userInstruction = document.getElementById('user-instruction');
    const evaluateBtn = document.getElementById('evaluate');
    const stateDisplay = document.getElementById('state-display');
    const moralScores = document.getElementById('moral-scores');
    const reasoningSteps = document.getElementById('reasoning-steps');

    // Load TTL content
    async function loadTTL(content) {
        console.log('Loading TTL content...');
        document.getElementById('state-display').textContent = 'Loading TTL content...';
        try {
            currentKnowledge = await parser.parse(content);
            console.log('TTL parsed:', currentKnowledge);
            reasoner = new MoralReasoner(currentKnowledge, new NLPIntentService(analyzer)); // Pass a new NLP service to the reasoner
            
            // Display internal state
            stateDisplay.textContent = JSON.stringify(currentKnowledge, null, 2);
            
            // Clear previous outputs
            moralScores.innerHTML = '';
            reasoningSteps.innerHTML = '';
            
            // Enable evaluation
            evaluateBtn.disabled = false;
            userInstruction.disabled = false;
        } catch (error) {
            console.error('Error parsing TTL:', error);
            stateDisplay.textContent = 'Error parsing TTL content: ' + error.message;
        }
    }

    // File input handler
    ttlFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                ttlContent.value = e.target.result;
            };
            reader.readAsText(file);
        }
    });

    // Load TTL button handler
    loadTTLBtn.addEventListener('click', () => {
        console.log('Load TTL button clicked');
        document.getElementById('state-display').textContent = 'Button clicked!';
        if (ttlContent.value) {
            console.log('TTL content found:', ttlContent.value.substring(0, 100) + '...');
            loadTTL(ttlContent.value);
        } else {
            console.log('No TTL content found');
            document.getElementById('state-display').textContent = 'Error: No TTL content provided';
        }
    });

    // Evaluate button handler
    evaluateBtn.addEventListener('click', async () => {
        console.log('Evaluate button clicked');
        if (!reasoner) {
            console.error('Reasoner not initialized');
            return;
        }

        // Provide immediate feedback
        moralScores.innerHTML = '<p>Evaluating...</p>';
        reasoningSteps.innerHTML = '';
        evaluateBtn.disabled = true;

        const instruction = userInstruction.value;
        const result = reasoner.evaluateAction(instruction);

        if (result) {
            // NEW: Display multiple evaluation blocks
            moralScores.innerHTML = result.evaluations.map(evalResult => `
                <div class="evaluation-block">
                    <h4>Framework: ${evalResult.framework}</h4>
                    <p><strong>Action:</strong> ${evalResult.actionLabel}</p>
                    <div class="moral-score ${evalResult.deonticStatus.toLowerCase()}">
                        <strong>Deontic Status: ${evalResult.deonticStatus.toUpperCase()}</strong>
                    </div>
                    <p><strong>Justification:</strong> ${evalResult.justification}</p>
                </div>
            `).join('');

            if (result.actionId) {
                reasoningSteps.innerHTML = `<p>Successfully evaluated action: <strong>${result.actionId.split('#').pop()}</strong></p>`;
            }
        } else {
            moralScores.innerHTML = `
                <p>No matching action or evaluation found for the instruction: "<em>${instruction}</em>"</p>
                <p class="suggestion">Try using keywords found in the action labels, such as "keep" or "return", or check the console for reasoning details.</p>
            `;
            reasoningSteps.innerHTML = '';
        }
        evaluateBtn.disabled = false; // Re-enable button
    });

});