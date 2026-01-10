# Ontologies

**Purpose**: Formal ontology definitions for the Ontology of Freedom project

**Formats**: TTL (Turtle) and OWL files

---

## Directory Structure

### [bfo/](bfo/) - Basic Formal Ontology
Foundation ontology for all modeling:
- `bfo-core.ttl` - BFO core definitions

### [valuenet/](valuenet/) - ValueNet Ontologies
Value-based ontologies for moral reasoning:
- `valuenet-core.ttl` / `.owl` - Core value concepts
- `valuenet-folk.ttl` / `.owl` - Folk psychology values
- `valuenet-mappings.ttl` / `.owl` - Cross-ontology mappings
- `valuenet-moral-foundations.ttl` / `.owl` - Moral foundations theory
- `valuenet-schwartz-values.ttl` / `.owl` - Schwartz values framework

### [moral-domain/](moral-domain/) - Moral Domain Ontologies
Project-specific moral modeling:
- `moral-sandbox.ttl` - Experimental moral concepts
- `unresolved.ttl` - Unresolved ontological issues

### [guides/](guides/) - Ontology Documentation
Documentation for working with ontologies:
- `annotation-guide.md` - How to annotate ontology files
- `bfoizing-valuenet.md` - Integrating ValueNet with BFO
- `testing-framework.md` - Testing ontologies
- `test-plan.md` - Test plan for ontology validation

---

## File Formats

**TTL (Turtle)**: Human-readable RDF serialization
- Used for: Primary development, version control, human review
- Recommended for: All new ontology work

**OWL**: Web Ontology Language (XML serialization)
- Used for: Tool interoperability, reasoners, Protégé
- Generated from: TTL files (where applicable)

---

## Relationship to Code

Ontology files are loaded by:
- `src/parsers/ttl-parser.js` - Parses TTL files
- See [../src/README.md](../src/README.md) for implementation details

Ontology modeling guides implementation:
- See [../docs/03-semantic-tech/semantic-data-dictionary.md](../docs/03-semantic-tech/semantic-data-dictionary.md) for how ontologies map to data

---

## For LLMs

**Context**: These ontologies provide formal definitions for concepts used throughout the project. All data and reasoning should ground in BFO-based ontological commitments.

**Key Relationships**:
- **BFO** is the foundation - all other ontologies extend or align with BFO
- **ValueNet** provides value-based reasoning structures
- **Moral domain** ontologies are project-specific extensions

**Reading Order**:
1. [bfo/README.md](bfo/README.md) - Understand BFO foundations
2. [guides/bfoizing-valuenet.md](guides/bfoizing-valuenet.md) - Understand integration approach
3. [valuenet/README.md](valuenet/README.md) - Understand value ontologies
4. [moral-domain/README.md](moral-domain/README.md) - Project-specific extensions

**Common Tasks**:
- "Find a concept definition" → Search `.ttl` files in appropriate directory
- "Understand value structure" → See [valuenet/](valuenet/)
- "Understand BFO grounding" → See [guides/bfoizing-valuenet.md](guides/bfoizing-valuenet.md)
