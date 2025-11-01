document.addEventListener('DOMContentLoaded', () => {
    let currentKnowledge = null;
    let reasoner = null;
    const parser = new TTLParser();

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
        try {
            currentKnowledge = await parser.parse(content);
            reasoner = new MoralReasoner(currentKnowledge);
            
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
        if (ttlContent.value) {
            loadTTL(ttlContent.value);
        }
    });

    // Evaluate button handler
    evaluateBtn.addEventListener('click', () => {
        if (!reasoner) return;

        const instruction = userInstruction.value;
        const matchedAction = reasoner.matchInstruction(instruction);
        const evaluation = reasoner.evaluateAction(matchedAction);

        if (evaluation) {
            // Display moral scores
            moralScores.innerHTML = `
                <h3>Values Promoted:</h3>
                <ul>
                    ${evaluation.values.map(value => `<li>${value}</li>`).join('')}
                </ul>
                <p><strong>Justification:</strong> ${evaluation.justification}</p>
            `;

            // Display reasoning steps
            reasoningSteps.innerHTML = `
                <h3>Reasoning Process:</h3>
                <ol>
                    ${evaluation.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            `;

            // Show action chain if available
            const chain = reasoner.getReasoningChain(matchedAction);
            if (chain.length > 1) {
                reasoningSteps.innerHTML += `
                    <h3>Related Actions:</h3>
                    <ul>
                        ${chain.map(action => `<li>${action.id}</li>`).join('')}
                    </ul>
                `;
            }
        } else {
            moralScores.innerHTML = '<p>No matching action found for the given instruction.</p>';
            reasoningSteps.innerHTML = '';
        }
    });

    // Drag and drop handling
    ttlContent.addEventListener('dragover', (e) => {
        e.preventDefault();
        ttlContent.classList.add('dragover');
    });

    ttlContent.addEventListener('dragleave', () => {
        ttlContent.classList.remove('dragover');
    });

    ttlContent.addEventListener('drop', (e) => {
        e.preventDefault();
        ttlContent.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.ttl')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                ttlContent.value = e.target.result;
            };
            reader.readAsText(file);
        }
    });
});