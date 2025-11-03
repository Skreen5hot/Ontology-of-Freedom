document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    let currentKnowledge = null;
    let reasoner = null;
    const parser = new TTLParser();
    
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
        console.log('Processing instruction:', instruction);
        
        // The core logic remains the same
        const matchedAction = reasoner.matchInstruction(instruction);
        console.log('Matched action:', matchedAction);
        
        if (matchedAction) {
            const evaluation = reasoner.evaluateAction(matchedAction);

            if (evaluation) {
                // Display moral evaluation
                moralScores.innerHTML = `
                    <div class="moral-score ${evaluation.moralScore || (evaluation.violatedValues && evaluation.violatedValues.length > 0 ? 'negative' : 'positive')}">
                        <strong>Moral Evaluation: ${evaluation.violatedValues && evaluation.violatedValues.length > 0 ? 'NEGATIVE' : 'POSITIVE'}</strong>
                    </div>
                    
                    <div class="moral-values">
                        ${evaluation.promotedValues && evaluation.promotedValues.length > 0 ? `
                            <h3>Values Promoted:</h3>
                            <div>
                                ${evaluation.promotedValues.map(value => 
                                    `<span class="moral-value promoted">${value}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                        
                        ${evaluation.violatedValues && evaluation.violatedValues.length > 0 ? `
                            <h3>Values Violated:</h3>
                            <div>
                                ${evaluation.violatedValues.map(value => 
                                    `<span class="moral-value violated">${value}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>

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
                // Action was found, but no evaluation for it
                moralScores.innerHTML = `
                    <p>An action matching "<em>${instruction}</em>" was found (<code>${matchedAction.id}</code>), but no moral evaluation for it exists in the knowledge base.</p>
                    <p class="suggestion">Ensure that a <code>ex:MoralEvaluation</code> instance points to this action via <code>ex:evaluatesAction</code>.</p>
                `;
                reasoningSteps.innerHTML = '';
            }
        } else {
            // Display moral evaluation
            moralScores.innerHTML = `
                <p>No matching action found for the instruction: "<em>${instruction}</em>"</p>
                <p class="suggestion">Try using keywords found in the action labels, such as "keep" or "return".</p>
            `;
            reasoningSteps.innerHTML = '';
        }
        
        evaluateBtn.disabled = false; // Re-enable button
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