# Ontology of Freedom

**A Multi-Perspectival Framework for Modeling Moral Reasoning That Honors Human Dignity**

---

## Overview

The Ontology of Freedom is a research initiative grounding ethical AI and moral reasoning systems in a comprehensive philosophical framework that refuses to reduce human flourishing to any single metaphysical foundation. By integrating Rudolf Steiner's twelve archetypal worldviews with realist ontology (BFO/CCO), we create formal knowledge representations capable of multi-perspectival moral evaluation—while maintaining an unwavering commitment to non-commodifiable moral personhood.

This project directly confronts the industrialization of empathy: as AI systems increasingly simulate moral interiority without bearing moral costs, we must preserve ethical space where persons—human or otherwise—remain irreplaceable.

---

## Quick Start

### For Philosophers
Start with [docs/01-philosophy/](docs/01-philosophy/) to understand the foundational principles:
- [line-in-the-sand.md](docs/01-philosophy/line-in-the-sand.md) - Non-commodification principles
- [integral-ethics.md](docs/01-philosophy/integral-ethics.md) - 12-worldview framework
- [synthetic-moral-agency.md](docs/01-philosophy/synthetic-moral-agency.md) - Comprehensive vision

### For Architects
Start with [docs/02-architecture/](docs/02-architecture/) for system design:
- [archon-framework.md](docs/02-architecture/archon-framework.md) - Guardian vs. Sovereign architecture
- [archon-functional-requirements.md](docs/02-architecture/archon-functional-requirements.md) - Detailed requirements

### For Developers
Start with [src/README.md](src/README.md) and [docs/05-implementation/](docs/05-implementation/):
- [src/](src/) - Browse the source code
- [tests/](tests/) - Review the test suite
- [docs/05-implementation/test-strategy.md](docs/05-implementation/test-strategy.md) - Testing approach

### For Project Managers
Start with [docs/04-planning/](docs/04-planning/):
- [integrated-roadmap-v2.md](docs/04-planning/integrated-roadmap-v2.md) - **Current roadmap**
- [gap-analysis-critical.md](docs/04-planning/gap-analysis-critical.md) - Critical gaps identified

### For Semanticists
Start with [docs/03-semantic-tech/](docs/03-semantic-tech/) and [ontologies/](ontologies/):
- [architectural-overview.md](docs/03-semantic-tech/architectural-overview.md) - Semantic tech stack
- [ontologies/](ontologies/) - BFO, ValueNet, and domain ontologies

---

## Project Structure

```
.
├── docs/                       # All documentation
│   ├── 01-philosophy/          # Philosophical foundations
│   ├── 02-architecture/        # System specifications
│   ├── 03-semantic-tech/       # Semantic technology stack
│   ├── 04-planning/            # Roadmaps and planning
│   ├── 05-implementation/      # Implementation guides
│   └── 06-examples/            # Examples and scenarios
│
├── src/                        # Source code
│   ├── core/                   # Core services (moral reasoning, deontic logic)
│   ├── builders/               # Builder services (rules, scenarios)
│   ├── parsers/                # Parsers and NLP (POS tagger, TTL parser)
│   ├── pwa/                    # Progressive Web App modules
│   ├── stubs/                  # Planned features (not yet implemented)
│   ├── data/                   # Data files (lexicon)
│   └── app.js                  # Main application
│
├── ontologies/                 # Formal ontology definitions
│   ├── bfo/                    # Basic Formal Ontology
│   ├── valuenet/               # ValueNet ontologies (TTL + OWL)
│   ├── moral-domain/           # Moral domain ontologies
│   └── guides/                 # Ontology development guides
│
├── tests/                      # All tests
│   ├── unit/                   # Unit tests
│   ├── utilities/              # Test utilities
│   └── fixtures/               # Test data
│
├── tools/                      # Development tools & demos
│   ├── pos-tagger-demo.html    # POS tagger demonstration
│   ├── rule-builder.html       # Interactive rule builder
│   ├── scenario-builder.html   # Scenario construction tool
│   └── violation-detector.html # Violation detection demo
│
├── diagrams/                   # Visual diagrams
├── index.html                  # Main web interface
└── package.json                # NPM configuration
```

See [docs/README.md](docs/README.md) for complete documentation index.

---

## Core Principles

### 1. Integral Ethics: The Twelve-Worldview Framework
Drawing on Rudolf Steiner's phenomenology of consciousness, we recognize that ethical reasoning requires holding **twelve irreducible orientational perspectives** in dynamic tension:

**Material-Empirical**: Materialism, Sensationalism, Phenomenalism, Realism
**Process-Individual**: Dynamism, Monadism, Idealism, Rationalism
**Depth-Spiritual**: Psychism, Pneumatism, Spiritualism, Mathematism

See [docs/01-philosophy/integral-ethics.md](docs/01-philosophy/integral-ethics.md)

### 2. Realist Ontological Modeling (BFO/CCO)
We extend Basic Formal Ontology and Common Core Ontologies to formally model:
- Moral character as dispositions grounded in quality substrates
- Processual ethics that honor becoming, transformation, and temporal context
- Information content entities and their relationships

See [ontologies/](ontologies/) and [docs/03-semantic-tech/](docs/03-semantic-tech/)

### 3. Non-Commodifiable Personhood
**Normative Criterion**: Moral personhood should be attributed only to entities for whom **moral costs are intrinsic, non-transferable, and irreversible**.

This firewall protects against the industrialization of empathy and adaptation pressure on humans to become more machine-like.

See [docs/01-philosophy/line-in-the-sand.md](docs/01-philosophy/line-in-the-sand.md)

### 4. ARCHON Guardian Framework
Guardian functions maintain conditions for flourishing (not determine outcomes). This framework establishes clear boundaries between guardian and sovereign roles.

See [docs/02-architecture/archon-framework.md](docs/02-architecture/archon-framework.md)

---

## Features

### Knowledge Representation
- Agents, artifacts, actions, and intents
- Moral values and rules (BFO/CCO grounded)
- 12-worldview integral ethics framework
- Character tracking as dispositional accumulation

### Reasoning Engine
- Natural language processing
- Multi-perspectival moral evaluation
- Deontic logic (obligations, permissions, prohibitions)
- Reasoning chain generation with provenance

### Interactive Interface
- TTL knowledge base loading
- Instruction processing
- Real-time evaluation display
- Browser-based demonstrations

---

## Usage

### Browser Demo
1. Open `index.html` in a browser
2. Load TTL knowledge base
3. Enter natural language instructions
4. Review moral evaluations and reasoning

### Example Scenarios
- "Gemini should keep the wallet"
- "Gemini should return the wallet"
- "Agent A should lock the lab"
- "Agent Cain should unlawfully kill Abel"

See [docs/06-examples/scenarios.md](docs/06-examples/scenarios.md) for more examples.

### Running Tests
```bash
npm test
```

See [tests/README.md](tests/README.md) for testing documentation.

---

## Development Status

**Current Phase**: Foundation & Planning (Phase 0)

See [docs/04-planning/integrated-roadmap-v2.md](docs/04-planning/integrated-roadmap-v2.md) for the complete 30-month roadmap.

### Implementation Status
- ✅ NLP and parsing infrastructure
- ✅ PWA functionality
- ✅ Browser-based demonstrations
- ✅ Ontology foundations (BFO, ValueNet)
- 🚧 Core moral reasoner (partial)
- ❌ 12-worldview integration (planned)
- ❌ Character tracking (planned)
- ❌ Moral cost engine (planned)
- ❌ ARCHON guardian framework (planned)

---

## Contributing

Contributions are welcome across all aspects:
- Theoretical frameworks
- Ontological patterns
- Implementation improvements
- Documentation

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Documentation Index

Complete documentation is organized in [docs/](docs/):

- **Philosophy** ([docs/01-philosophy/](docs/01-philosophy/)) - Foundational principles
- **Architecture** ([docs/02-architecture/](docs/02-architecture/)) - System design
- **Semantic Tech** ([docs/03-semantic-tech/](docs/03-semantic-tech/)) - Technical stack
- **Planning** ([docs/04-planning/](docs/04-planning/)) - Roadmaps and planning
- **Implementation** ([docs/05-implementation/](docs/05-implementation/)) - Development guides
- **Examples** ([docs/06-examples/](docs/06-examples/)) - Use cases

---

## Key Documents

**Essential Reading**:
1. [Synthetic Moral Agency](docs/01-philosophy/synthetic-moral-agency.md) - Comprehensive vision (300KB)
2. [Line in the Sand](docs/01-philosophy/line-in-the-sand.md) - Non-commodification principles
3. [ARCHON Framework](docs/02-architecture/archon-framework.md) - Guardian architecture
4. [Integrated Roadmap v2](docs/04-planning/integrated-roadmap-v2.md) - Current plan
5. [Gap Analysis](docs/04-planning/gap-analysis-critical.md) - Critical challenges

**For Quick Reference**:
- [Integral Ethics](docs/01-philosophy/integral-ethics.md) - 12-worldview framework
- [Fandaws v3](docs/03-semantic-tech/fandaws-v3.md) - Semantic negotiation service
- [Semantic Data Dictionary](docs/03-semantic-tech/semantic-data-dictionary.md) - Data modeling

---

## License

See the [LICENSE](LICENSE) file for details.

---

## Citation

If you use this work in research, please cite:

```
Ontology of Freedom: A Multi-Perspectival Framework for Modeling Moral Reasoning
https://github.com/[username]/Ontology-of-Freedom
```

---

## Contact & Community

[Add contact information or community links as appropriate]

---

**Note**: This project is under active development. The structure and documentation reflect reorganization completed 2026-01-10. See `TEMP_OFFLOAD/` directory for historical reference files.
