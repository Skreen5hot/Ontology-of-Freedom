# Source Code

**Purpose**: All JavaScript implementation code for the Ontology of Freedom project

**Architecture**: Browser-based moral reasoning system with progressive web app capabilities

---

## Directory Structure

### [core/](core/) - Core Services
Essential moral reasoning and logic services:
- `moral-reasoner.js` - Main moral reasoning engine
- `deontic-logic-service.js` - Deontic logic (obligations, permissions, prohibitions)
- `nlp-intent-service.js` - Natural language intent parsing

### [builders/](builders/) - Builder Services
Tools for constructing moral scenarios and rules:
- `rule-builder.js` - Build moral rules
- `scenario-builder.js` - Build moral scenarios for evaluation

### [parsers/](parsers/) - Parsers & NLP
Text processing and ontology parsing:
- `pos-tagger.js` - Part-of-speech tagger for natural language
- `ttl-parser.js` - Turtle (TTL) ontology file parser

### [pwa/](pwa/) - Progressive Web App
PWA-specific functionality:
- `task-manager.js` - Task management for offline capability
- `progress-tracker.js` - Track progress across sessions
- `ui-renderer.js` - Render UI components
- `synchronizations.js` - Sync logic for online/offline

### [stubs/](stubs/) - Planned Features
Future features (currently unimplemented):
- `README.md` - Explains future features
- (Will contain planned but not yet implemented modules)

### [data/](data/) - Data Files
Large data files separate from code:
- `lexicon.json` - NLP lexicon (will be converted from js/lexicon.js)

---

## Import Paths

When importing from HTML:
```html
<script src="src/core/moral-reasoner.js"></script>
```

When importing from tests:
```javascript
const moralReasoner = require('../../src/core/moral-reasoner.js');
```

---

## Testing

Tests are in [../tests/unit/](../tests/unit/), organized by module.

See [../tests/README.md](../tests/README.md) for testing guide.

---

## For LLMs

**Context**: This is the implementation layer. Code here should implement the philosophical commitments in [../docs/01-philosophy/](../docs/01-philosophy/) and follow the architecture in [../docs/02-architecture/](../docs/02-architecture/).

**Key Constraints**:
- Guardian boundaries must be enforced (see [../docs/02-architecture/archon-framework.md](../docs/02-architecture/archon-framework.md))
- Non-commodification protections required (see [../docs/01-philosophy/line-in-the-sand.md](../docs/01-philosophy/line-in-the-sand.md))
- All moral evaluations should use integral ethics (see [../docs/01-philosophy/integral-ethics.md](../docs/01-philosophy/integral-ethics.md))

**Implementation Status**:
- ✅ NLP and parsing infrastructure complete
- ✅ PWA functionality complete
- 🚧 Core moral reasoner partial (basic framework)
- ❌ 12-worldview integration pending
- ❌ Character tracking pending
- ❌ Moral cost engine pending

See [../docs/04-planning/integrated-roadmap-v2.md](../docs/04-planning/integrated-roadmap-v2.md) for development roadmap.
