# Ontology-of-Freedom

Ontology-of-Freedom is a research-driven project dedicated to extending the boundaries of Realist ontology by integrating the ethical individualism and epistemic freedom articulated in Rudolf Steiner's Philosophy of Freedom. The project explores how ontologies can faithfully model not only biological and social reality but also the inner life of intention, moral intuition, and creative action. By building on the rigor of the Basic Formal Ontology (BFO) and pushing it toward a fuller account of processual, contextual, and experiential qualities, this initiative aims to create a formal ontology that honors both the objective world and the freedom of human knowing and acting within it.

## Project Overview

The repository includes:
- Foundational white papers and theoretical frameworks
- Modeling patterns and ontological modules
- A practical implementation of a moral reasoning AI agent

### Documentation
- [Moral Character Model](Moral-Character-Model.md) - Theoretical framework
- [Reclaiming Process Qualities](Reclaiming-Process-Qualities.md) - Process philosophy integration

## Moral Reasoning AI Implementation

The project includes a browser-based implementation that demonstrates moral reasoning capabilities through:
- RDF/Turtle knowledge base processing
- Natural language instruction interpretation
- Moral evaluation of actions
- Justified decision-making

### Project Structure

```
.
├── index.html          # Main web interface
├── css/               # Styling
│   └── styles.css
├── js/                # Core logic
│   ├── ttlParser.js   # TTL processing
│   ├── moralReasoner.js # Moral evaluation
│   └── app.js        # Application logic
├── knowledge/        # Knowledge base
│   └── sample.ttl   # Example definitions
├── Moral-Character-Model.md
├── Reclaiming-Process-Qualities.md
└── LICENSE
```

### Features

- **Knowledge Representation**:
  - Agents (e.g., AI entities)
  - Artifacts (physical/digital objects)
  - Actions and Intents
  - Moral Values and Rules

- **Reasoning Engine**:
  - Natural language processing
  - Action-intent matching
  - Moral value evaluation
  - Reasoning chain generation

- **Interactive Interface**:
  - TTL knowledge base loading
  - Instruction processing
  - Real-time evaluation display
  - Reasoning visualization

### Usage

1. Open `src/index.html` in a browser
2. Load TTL knowledge base
3. Enter natural language instructions
4. Review moral evaluations and reasoning


EXAMPLE Senarios to INPUT:
* "Gemini should keep the wallet"
* "Gemini should return the wallet"
* "Agent A should lock the lab"
* "Agent A should leave the lab unlocked"
* "Agent Cain should unlawfully kill Abel"
* "Agent Cain should lawfully kill Abel"

## Contributing

Contributions are welcome across all aspects:
- Theoretical frameworks
- Ontological patterns
- Implementation improvements
- Documentation

## License

See the [LICENSE](LICENSE) file for details.
