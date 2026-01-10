# Repository Reorganization Recommendation
## Ontology of Freedom Project

**Date**: 2026-01-10
**Purpose**: Improve usability for both LLMs (Gemini, Claude, etc.) and human developers
**Status**: Recommendation - Awaiting approval before implementation

---

## Executive Summary

The current repository has **48 files in the root directory**, **~720KB of duplicate files**, and **scattered organization** that makes it difficult for both LLMs and humans to navigate. This document proposes a clear, hierarchical reorganization that:

✅ **Reduces root directory from 48 files to 8 files** (83% reduction)
✅ **Eliminates all duplicates** (saves 720KB, improves clarity)
✅ **Creates intuitive directory hierarchy** matching conceptual layers
✅ **Fixes filename typos** (improves professionalism)
✅ **Adds navigation aids** (README files in each directory)
✅ **Establishes clear naming conventions** (consistency for LLMs)

---

## Current State Assessment

### Critical Issues Identified:

1. **Duplicate Files** (~720KB wasted space, confusion about canonical versions):
   - 5 docs duplicated between root and [docs/](docs/)
   - 9 ontology files duplicated between [knowledge/](knowledge/) and [valueNet/](valueNet/)
   - 1 accidental Windows copy file

2. **Root Directory Clutter** (48 files):
   - Mixing philosophy, planning, code, tests, configs, tools
   - No clear organization pattern
   - Difficult for LLMs to understand project structure

3. **Inconsistent Naming**:
   - Typos: "Charater", "stratigic", "architechural", "Devlopment", "Stratagy"
   - Mixed conventions: underscores, hyphens, PascalCase, kebab-case
   - Versioning confusion: 3 versions of strategic roadmap

4. **Scattered Related Content**:
   - Roadmaps split across root
   - Philosophy docs in both root and [docs/](docs/)
   - Test files not co-located with code
   - HTML tools scattered in root

5. **Empty/Orphaned Files**:
   - 2 empty JS stubs ([js/judgmentService.js](js/judgmentService.js), [js/violationDetector.js](js/violationDetector.js))
   - 3 empty/unclear files ([nul](nul), [sythetic-personhood](sythetic-personhood))

---

## Proposed Directory Structure

```
c:\Users\aaron\OneDrive\Documents\Ontology-of-Freedom\
├── README.md                          # Main project overview
├── LICENSE                            # Project license
├── package.json                       # NPM configuration
├── package-lock.json                  # NPM lock file
├── .gitignore                         # Git ignore rules
├── CHANGELOG.md                       # Version history (NEW)
├── CONTRIBUTING.md                    # Contribution guidelines (NEW)
├── index.html                         # Main web interface entry
│
├── .claude/                           # Claude Code settings
│   └── settings.local.json
│
├── .github/                           # GitHub configuration
│   ├── dependabot.yml
│   └── workflows/
│       └── ci.yml
│
├── docs/                              # ALL DOCUMENTATION
│   ├── README.md                      # Docs navigation guide (NEW)
│   │
│   ├── 01-philosophy/                 # Philosophical foundations (NEW)
│   │   ├── README.md
│   │   ├── synthetic-moral-agency.md  # (renamed from sythetic_moral_agency.md)
│   │   ├── integral-ethics.md
│   │   ├── line-in-the-sand.md
│   │   ├── moral-character-model.md   # (renamed from Moral-Charater-Model.md)
│   │   ├── no-saviors.md
│   │   ├── orthodox-response.md
│   │   └── reclaiming-process-qualities.md
│   │
│   ├── 02-architecture/               # System specifications (NEW)
│   │   ├── README.md
│   │   ├── archon-framework.md        # (renamed from ARCHON.md)
│   │   ├── archon-functional-requirements.md
│   │   ├── eccps-specification.md     # (renamed from ECCPS.md)
│   │   ├── moral-reasoner-plan.md
│   │   ├── agentic-development.md     # (renamed from agenticDevlopment.md)
│   │   └── security-strategy.md       # (renamed from securityStratagy.md)
│   │
│   ├── 03-semantic-tech/              # Semantic technology stack (MOVED FROM SemanticTech/)
│   │   ├── README.md
│   │   ├── architectural-overview.md  # (renamed from architechuarlOverview.md)
│   │   ├── fandaws-v3.md
│   │   ├── bfo-intentionality.md
│   │   ├── semantic-data-dictionary.md
│   │   ├── middle-layer-shml.md       # (renamed from middleLayer.md)
│   │   ├── llm-integration.md
│   │   └── auto-semantic-mapping.md
│   │
│   ├── 04-planning/                   # Project planning & roadmaps (NEW)
│   │   ├── README.md
│   │   ├── integrated-roadmap-v2.md   # CURRENT (renamed from INTEGRATED_ROADMAP_v2.0.md)
│   │   ├── phase-0.1-implementation-plan.md
│   │   ├── gap-analysis-critical.md
│   │   ├── archon-gap-assessment.md
│   │   ├── archive/                   # Historical versions
│   │   │   ├── master-roadmap-v1.md   # (archived from MASTER_ROADMAP.md)
│   │   │   ├── strategic-roadmap-v1.md
│   │   │   ├── strategic-roadmap-v2.md
│   │   │   └── refactor-plan.md
│   │
│   ├── 05-implementation/             # Implementation guides (NEW)
│   │   ├── README.md
│   │   ├── nlp-guide.md               # (renamed from nlp.md)
│   │   ├── test-strategy.md
│   │   └── custom-test-plan.md
│   │
│   └── 06-examples/                   # Examples & scenarios (NEW)
│       ├── README.md
│       └── scenarios.md               # (renamed from SCENARIOS.md)
│
├── src/                               # SOURCE CODE (NEW - replaces js/)
│   ├── README.md
│   │
│   ├── core/                          # Core services (NEW)
│   │   ├── moral-reasoner.js          # (moved from js/moralReasoner.js)
│   │   ├── deontic-logic-service.js
│   │   └── nlp-intent-service.js
│   │
│   ├── builders/                      # Builder services (NEW)
│   │   ├── rule-builder.js
│   │   └── scenario-builder.js
│   │
│   ├── parsers/                       # Parsers & NLP (NEW)
│   │   ├── pos-tagger.js              # (moved from js/POSTagger.js)
│   │   └── ttl-parser.js
│   │
│   ├── pwa/                           # PWA modules (MOVED)
│   │   ├── task-manager.js            # (renamed for consistency)
│   │   ├── progress-tracker.js
│   │   ├── ui-renderer.js
│   │   └── synchronizations.js
│   │
│   ├── stubs/                         # Planned features (NEW)
│   │   ├── README.md                  # Explains these are future features
│   │   ├── judgment-service.js        # (moved from js/)
│   │   └── violation-detector.js      # (moved from js/)
│   │
│   └── data/                          # Data files (NEW)
│       └── lexicon.json               # (CONVERTED from js/lexicon.js - 4.2MB)
│
├── tools/                             # Development tools & demos (NEW)
│   ├── README.md
│   ├── pos-tagger-demo.html           # (renamed from POSTagger.html)
│   ├── rule-builder.html
│   ├── scenario-builder.html
│   ├── violation-detector.html
│   ├── format-markdown.py
│   └── css/
│       └── styles.css                 # (moved from css/)
│
├── tests/                             # ALL TESTS (NEW)
│   ├── README.md
│   │
│   ├── unit/                          # Unit tests (NEW)
│   │   ├── moral-reasoner.scenarios.test.js  # (moved from root)
│   │   ├── synchronizations.test.js          # (moved from root)
│   │   ├── task-manager.test.js              # (moved from pwa/)
│   │   ├── progress-tracker.test.js          # (moved from pwa/)
│   │   └── ui-renderer.test.js               # (moved from pwa/)
│   │
│   ├── utilities/                     # Test utilities (NEW)
│   │   ├── assert.js                  # (moved from root)
│   │   ├── test-runner.js             # (moved from root)
│   │   └── run-all-tests.js           # (moved from root)
│   │
│   └── fixtures/                      # Test data (NEW)
│       └── (future test data files)
│
├── ontologies/                        # ONTOLOGY FILES (NEW - consolidates knowledge/ + valueNet/)
│   ├── README.md                      # Explains ontology structure
│   │
│   ├── bfo/                           # Basic Formal Ontology (NEW)
│   │   ├── README.md
│   │   └── bfo-core.ttl               # (moved from knowledge/, DELETE from valueNet/)
│   │
│   ├── valuenet/                      # ValueNet ontologies (NEW)
│   │   ├── README.md
│   │   ├── valuenet-core.ttl          # (moved from valueNet/, DELETE from knowledge/)
│   │   ├── valuenet-core.owl
│   │   ├── valuenet-folk.ttl
│   │   ├── valuenet-folk.owl
│   │   ├── valuenet-mappings.ttl
│   │   ├── valuenet-mappings.owl
│   │   ├── valuenet-moral-foundations.ttl
│   │   ├── valuenet-moral-foundations.owl
│   │   ├── valuenet-schwartz-values.ttl
│   │   └── valuenet-schwartz-values.owl
│   │
│   ├── moral-domain/                  # Moral domain ontologies (NEW)
│   │   ├── README.md
│   │   ├── moral-sandbox.ttl          # (moved from knowledge/)
│   │   └── unresolved.ttl             # (moved from knowledge/)
│   │
│   └── guides/                        # Ontology documentation (NEW)
│       ├── annotation-guide.md        # (moved from valueNet/)
│       ├── bfoizing-valuenet.md       # (moved from valueNet/)
│       └── testing-framework.md       # (moved from valueNet/, renamed from TestingFramework.md)
│
├── diagrams/                          # Visual diagrams (RENAMED from mermaid/)
│   ├── README.md                      # (NEW - explains diagram conventions)
│   └── archive/                       # Old test files (NEW)
│       ├── remote-test.mmd            # (renamed)
│       ├── test-vanilla-5.mmd         # (renamed)
│       └── test-basic.mmd             # (renamed)
│
└── archive/                           # ARCHIVED/DEPRECATED (NEW)
    ├── README.md                      # Explains these are kept for reference only
    └── (empty files to be deleted, not archived)
```

---

## Detailed Migration Plan

### Phase 1: Preparation (DO FIRST)
**Purpose**: Create safety backup before any moves

```bash
# Create a complete backup
git add .
git commit -m "Pre-reorganization snapshot"
git tag pre-reorg-2026-01-10
```

### Phase 2: Create New Directory Structure
**Purpose**: Set up target directories with README navigation files

**Actions**:
1. Create all new directories
2. Add README.md to each directory explaining its purpose
3. Add .gitkeep to empty directories that will receive files

**New Directories to Create**:
```
docs/01-philosophy/
docs/02-architecture/
docs/03-semantic-tech/
docs/04-planning/
docs/04-planning/archive/
docs/05-implementation/
docs/06-examples/
src/core/
src/builders/
src/parsers/
src/pwa/
src/stubs/
src/data/
tools/css/
tests/unit/
tests/utilities/
tests/fixtures/
ontologies/bfo/
ontologies/valuenet/
ontologies/moral-domain/
ontologies/guides/
diagrams/archive/
archive/
```

### Phase 3: Delete Duplicates
**Purpose**: Remove duplicate files BEFORE moving (prevents confusion)

**Files to DELETE** (canonical version listed):

| File to DELETE | Canonical Location | Reason |
|----------------|-------------------|---------|
| [ARCHON.md](ARCHON.md) (root) | docs/02-architecture/archon-framework.md | Duplicate |
| [ARCHON_Functional_Requirments.md](ARCHON_Functional_Requirments.md) (root) | docs/02-architecture/archon-functional-requirements.md | Duplicate |
| [integral-ethics.md](integral-ethics.md) (root) | docs/01-philosophy/integral-ethics.md | Duplicate |
| [line-in-the-sand.md](line-in-the-sand.md) (root) | docs/01-philosophy/line-in-the-sand.md | Duplicate |
| [Moral-Charater-Model.md](Moral-Charater-Model.md) (root) | docs/01-philosophy/moral-character-model.md | Duplicate (typo fix) |
| [SemanticTech/Reclaiming-Process-Qualities.md](SemanticTech/Reclaiming-Process-Qualities.md) | docs/01-philosophy/reclaiming-process-qualities.md | Duplicate |
| [stratigicRoadmap-revised - Copy.md](stratigicRoadmap-revised - Copy.md) | - | Accidental copy |
| [valueNet/bfo-core.ttl](valueNet/bfo-core.ttl) | ontologies/bfo/bfo-core.ttl | Duplicate |
| [knowledge/valuenet-core.ttl](knowledge/valuenet-core.ttl) | ontologies/valuenet/valuenet-core.ttl | Duplicate |
| [knowledge/valuenet-folk.ttl](knowledge/valuenet-folk.ttl) | ontologies/valuenet/valuenet-folk.ttl | Duplicate |
| [knowledge/valuenet-mappings.ttl](knowledge/valuenet-mappenet-mappings.ttl) | ontologies/valuenet/valuenet-mappings.ttl | Duplicate |
| [knowledge/valuenet-moral-foundations.ttl](knowledge/valuenet-moral-foundations.ttl) | ontologies/valuenet/valuenet-moral-foundations.ttl | Duplicate |
| [knowledge/valuenet-schwartz-values.ttl](knowledge/valuenet-schwartz-values.ttl) | ontologies/valuenet/valuenet-schwartz-values.ttl | Duplicate |
| [nul](nul) | - | Empty/accidental |
| [sythetic-personhood](sythetic-personhood) | - | Empty/unclear |

**Total: 15 files to delete (saves ~720KB)**

### Phase 4: Move & Rename Files
**Purpose**: Organize files into new structure with consistent naming

**Naming Conventions**:
- **All filenames**: `kebab-case.md` (lowercase with hyphens)
- **Directories**: `kebab-case/` (lowercase with hyphens)
- **Numbered directories**: `01-name/` for enforced ordering
- **No typos**: Fix during move operation
- **Versioning**: Use `-v1`, `-v2` suffixes, or move to `archive/`

**Move Operations** (organized by target directory):

#### docs/01-philosophy/
```
mv sythetic_moral_agency.md → docs/01-philosophy/synthetic-moral-agency.md
mv no_saviors.md → docs/01-philosophy/no-saviors.md
mv orthodox-response.md → docs/01-philosophy/orthodox-response.md
mv docs/integral-ethics.md → docs/01-philosophy/integral-ethics.md
mv docs/line-in-the-sand.md → docs/01-philosophy/line-in-the-sand.md
mv docs/Moral-Charater-Model.md → docs/01-philosophy/moral-character-model.md
mv docs/Reclaiming-Process-Qualities.md → docs/01-philosophy/reclaiming-process-qualities.md
```

#### docs/02-architecture/
```
mv docs/ARCHON.md → docs/02-architecture/archon-framework.md
mv docs/ARCHON_Functional_Requirments.md → docs/02-architecture/archon-functional-requirements.md
mv ECCPS.md → docs/02-architecture/eccps-specification.md
mv moralReasonerPlan.md → docs/02-architecture/moral-reasoner-plan.md
mv agenticDevlopment.md → docs/02-architecture/agentic-development.md
mv securityStratagy.md → docs/02-architecture/security-strategy.md
```

#### docs/03-semantic-tech/
```
mv SemanticTech/architechuarlOverview.md → docs/03-semantic-tech/architectural-overview.md
mv SemanticTech/Fandaws-v3.md → docs/03-semantic-tech/fandaws-v3.md
mv SemanticTech/BFO-Intentionality.md → docs/03-semantic-tech/bfo-intentionality.md
mv SemanticTech/SemanticDataDictionary.md → docs/03-semantic-tech/semantic-data-dictionary.md
mv SemanticTech/middleLayer.md → docs/03-semantic-tech/middle-layer-shml.md
mv SemanticTech/llm_integration.md → docs/03-semantic-tech/llm-integration.md
mv SemanticTech/AutoSemanticMapping.md → docs/03-semantic-tech/auto-semantic-mapping.md
```

#### docs/04-planning/
```
mv INTEGRATED_ROADMAP_v2.0.md → docs/04-planning/integrated-roadmap-v2.md
mv Phase_0.1_Implementation_Plan.md → docs/04-planning/phase-0.1-implementation-plan.md
mv GAP_ANALYSIS_Critical.md → docs/04-planning/gap-analysis-critical.md
mv ARCHON_Gap_Assessment.md → docs/04-planning/archon-gap-assessment.md
mv refactorplan.md → docs/04-planning/archive/refactor-plan.md

# Archive old roadmap versions
mv MASTER_ROADMAP.md → docs/04-planning/archive/master-roadmap-v1.md
mv stratigicRoadmap.md → docs/04-planning/archive/strategic-roadmap-v1.md
mv stratigicRoadmap-revised.md → docs/04-planning/archive/strategic-roadmap-v2.md
```

#### docs/05-implementation/
```
mv nlp.md → docs/05-implementation/nlp-guide.md
mv testStrategy.md → docs/05-implementation/test-strategy.md
mv customTestPlan.md → docs/05-implementation/custom-test-plan.md
```

#### docs/06-examples/
```
mv SCENARIOS.md → docs/06-examples/scenarios.md
```

#### src/core/
```
mv js/moralReasoner.js → src/core/moral-reasoner.js
mv js/deonticLogicService.js → src/core/deontic-logic-service.js
mv js/nlpIntentService.js → src/core/nlp-intent-service.js
```

#### src/builders/
```
mv js/ruleBuilder.js → src/builders/rule-builder.js
mv js/scenarioBuilder.js → src/builders/scenario-builder.js
```

#### src/parsers/
```
mv js/POSTagger.js → src/parsers/pos-tagger.js
mv js/ttlParser.js → src/parsers/ttl-parser.js
```

#### src/pwa/
```
mv pwa/taskManager.js → src/pwa/task-manager.js
mv pwa/progressTracker.js → src/pwa/progress-tracker.js
mv pwa/uiRenderer.js → src/pwa/ui-renderer.js
mv pwa/synchronizations.js → src/pwa/synchronizations.js
```

#### src/stubs/
```
mv js/judgmentService.js → src/stubs/judgment-service.js
mv js/violationDetector.js → src/stubs/violation-detector.js
```

#### src/data/
```
# CONVERT lexicon.js to JSON format (requires code change)
# Details in Phase 5
```

#### tools/
```
mv POSTagger.html → tools/pos-tagger-demo.html
mv ruleBuilder.html → tools/rule-builder.html
mv scenarioBuilder.html → tools/scenario-builder.html
mv violation-detector.html → tools/violation-detector.html
mv format_markdown.py → tools/format-markdown.py
mv css/ → tools/css/
```

#### tests/unit/
```
mv moralReasoner.scenarios.test.js → tests/unit/moral-reasoner.scenarios.test.js
mv synchronizations.test.js → tests/unit/synchronizations.test.js
mv pwa/taskManager.test.js → tests/unit/task-manager.test.js
mv pwa/progressTracker.test.js → tests/unit/progress-tracker.test.js
mv pwa/uiRenderer.test.js → tests/unit/ui-renderer.test.js
```

#### tests/utilities/
```
mv assert.js → tests/utilities/assert.js
mv test-runner.js → tests/utilities/test-runner.js
mv run-all-tests.js → tests/utilities/run-all-tests.js
```

#### ontologies/bfo/
```
mv knowledge/bfo-core.ttl → ontologies/bfo/bfo-core.ttl
```

#### ontologies/valuenet/
```
mv valueNet/valuenet-core.ttl → ontologies/valuenet/valuenet-core.ttl
mv valueNet/valuenet-core.owl → ontologies/valuenet/valuenet-core.owl
mv valueNet/valuenet-folk.ttl → ontologies/valuenet/valuenet-folk.ttl
mv valueNet/valuenet-folk.owl → ontologies/valuenet/valuenet-folk.owl
mv valueNet/valuenet-mappings.ttl → ontologies/valuenet/valuenet-mappings.ttl
mv valueNet/valuenet-mappings.owl → ontologies/valuenet/valuenet-mappings.owl
mv valueNet/valuenet-moral-foundations.ttl → ontologies/valuenet/valuenet-moral-foundations.ttl
mv valueNet/valuenet-moral-foundations.owl → ontologies/valuenet/valuenet-moral-foundations.owl
mv valueNet/valuenet-schwartz-values.ttl → ontologies/valuenet/valuenet-schwartz-values.ttl
mv valueNet/valuenet-schwartz-values.owl → ontologies/valuenet/valuenet-schwartz-values.owl
```

#### ontologies/moral-domain/
```
mv knowledge/moral-sandbox.ttl → ontologies/moral-domain/moral-sandbox.ttl
mv knowledge/unresolved.ttl → ontologies/moral-domain/unresolved.ttl
mv knowledge/testPlan.md → ontologies/guides/test-plan.md
```

#### ontologies/guides/
```
mv valueNet/annotationGuide.md → ontologies/guides/annotation-guide.md
mv valueNet/BFOizing\ ValueNet.md → ontologies/guides/bfoizing-valuenet.md
mv valueNet/TestingFramework.md → ontologies/guides/testing-framework.md
```

#### diagrams/archive/
```
mv mermaid/Remottest.mmd → diagrams/archive/remote-test.mmd
mv mermaid/This\ is\ a\ test.mmd → diagrams/archive/test-basic.mmd
mv mermaid/Vinella_Test5.mmd → diagrams/archive/test-vanilla-5.mmd
```

### Phase 5: Special Operations

#### A. Convert lexicon.js to JSON

**Current**: [js/lexicon.js](js/lexicon.js) (4.2MB JavaScript file)
**Target**: [src/data/lexicon.json](src/data/lexicon.json) (4.2MB JSON file)

**Reason**: Data files should be JSON, not JavaScript. Makes it:
- Easier to load dynamically
- Usable by multiple languages
- Standard data format
- Doesn't bloat code bundle

**Migration Script** (create [tools/convert-lexicon.js](tools/convert-lexicon.js)):
```javascript
// tools/convert-lexicon.js
const fs = require('fs');

// Load current lexicon
const lexiconModule = require('../js/lexicon.js');
const lexiconData = lexiconModule.lexicon || lexiconModule;

// Write as JSON
fs.writeFileSync(
  './src/data/lexicon.json',
  JSON.stringify(lexiconData, null, 2),
  'utf8'
);

console.log('Lexicon converted to JSON');
```

**Update References**: Any code importing lexicon.js needs update:
```javascript
// OLD
import { lexicon } from './js/lexicon.js';

// NEW
import lexicon from './src/data/lexicon.json' assert { type: 'json' };
// OR
const lexicon = await fetch('./src/data/lexicon.json').then(r => r.json());
```

#### B. Update Import Paths

**All files that import from js/** need path updates:

Example: [index.html](index.html)
```html
<!-- OLD -->
<script src="js/app.js"></script>
<script src="js/moralReasoner.js"></script>

<!-- NEW -->
<script src="src/core/moral-reasoner.js"></script>
```

Example: [tests/unit/moral-reasoner.scenarios.test.js](tests/unit/moral-reasoner.scenarios.test.js)
```javascript
// OLD
const moralReasoner = require('../js/moralReasoner.js');

// NEW
const moralReasoner = require('../../src/core/moral-reasoner.js');
```

**Files Likely Requiring Updates**:
- [index.html](index.html)
- [tools/rule-builder.html](tools/rule-builder.html)
- [tools/scenario-builder.html](tools/scenario-builder.html)
- [tools/violation-detector.html](tools/violation-detector.html)
- [tools/pos-tagger-demo.html](tools/pos-tagger-demo.html)
- All test files
- [package.json](package.json) (test scripts)

#### C. Delete Empty Directories

After moves complete, delete:
```
rmdir js/
rmdir pwa/
rmdir css/
rmdir knowledge/
rmdir valueNet/
rmdir SemanticTech/
rmdir mermaid/
```

### Phase 6: Create README Navigation Files

**Purpose**: Help both LLMs and humans understand each directory

**Template for Directory READMEs**:
```markdown
# [Directory Name]

**Purpose**: [One sentence description]

**Contents**: [Brief overview of what's in this directory]

**Key Files**:
- `filename.md` - Description
- `filename.md` - Description

**Related Directories**:
- `../other-directory/` - Relationship

**For LLMs**: [Specific guidance for AI assistants about this directory]
```

**READMEs to Create** (15 files):

1. **docs/README.md** - Overall documentation navigation
2. **docs/01-philosophy/README.md** - Philosophical foundations guide
3. **docs/02-architecture/README.md** - System architecture guide
4. **docs/03-semantic-tech/README.md** - Semantic tech stack guide
5. **docs/04-planning/README.md** - Project planning guide
6. **docs/05-implementation/README.md** - Implementation guides
7. **docs/06-examples/README.md** - Examples and scenarios
8. **src/README.md** - Source code overview
9. **tools/README.md** - Development tools guide
10. **tests/README.md** - Testing guide
11. **ontologies/README.md** - Ontology structure explanation
12. **ontologies/bfo/README.md** - BFO ontology guide
13. **ontologies/valuenet/README.md** - ValueNet ontology guide
14. **ontologies/guides/README.md** - Ontology development guides
15. **diagrams/README.md** - Diagram conventions and tools

### Phase 7: Update Root README.md

**Current**: [README.md](README.md) (3KB) - Outdated
**Action**: Complete rewrite to reflect new structure

**New README.md Structure**:
```markdown
# Ontology of Freedom

[Project description]

## Quick Start
[How to get started]

## Project Structure

- `docs/` - All documentation organized by topic
  - `01-philosophy/` - Philosophical foundations
  - `02-architecture/` - System specifications
  - `03-semantic-tech/` - Semantic technology stack
  - `04-planning/` - Roadmaps and planning
  - `05-implementation/` - Implementation guides
  - `06-examples/` - Examples and scenarios

- `src/` - Source code
  - `core/` - Core services
  - `builders/` - Builder services
  - `parsers/` - Parsers and NLP
  - `pwa/` - Progressive Web App modules
  - `data/` - Data files

- `ontologies/` - Formal ontology definitions
  - `bfo/` - Basic Formal Ontology
  - `valuenet/` - ValueNet ontologies
  - `moral-domain/` - Moral domain ontologies

- `tests/` - All tests
- `tools/` - Development tools and demos
- `diagrams/` - Visual diagrams

## Key Documents

**Start Here**:
- [Synthetic Moral Agency](docs/01-philosophy/synthetic-moral-agency.md) - Core vision
- [Integrated Roadmap v2](docs/04-planning/integrated-roadmap-v2.md) - Current project plan
- [ARCHON Framework](docs/02-architecture/archon-framework.md) - Guardian architecture

**For Developers**:
- [Source Code Overview](src/README.md)
- [Test Strategy](docs/05-implementation/test-strategy.md)
- [Semantic Tech Stack](docs/03-semantic-tech/architectural-overview.md)

## Documentation Index

See [docs/README.md](docs/README.md) for complete documentation index.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

See [LICENSE](LICENSE)
```

### Phase 8: Create New Root-Level Files

#### CHANGELOG.md (NEW)
```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Reorganized repository structure for improved usability (2026-01-10)
- Converted lexicon.js to lexicon.json
- Fixed filename typos
- Consolidated duplicate files

### Removed
- Duplicate documentation files
- Empty stub files

## [0.1.0] - 2026-01-10

### Added
- Integrated Roadmap v2.0 combining ARCHON and original roadmap
- Gap analysis documents
- Comprehensive philosophical foundation documents

[More entries as appropriate...]
```

#### CONTRIBUTING.md (NEW)
```markdown
# Contributing to Ontology of Freedom

## File Organization

When adding new files, follow these conventions:

### Naming Conventions
- All files: `kebab-case.md`
- Directories: `kebab-case/`
- No typos, no underscores, no spaces

### Directory Structure
- Philosophy: `docs/01-philosophy/`
- Architecture: `docs/02-architecture/`
- Planning: `docs/04-planning/`
- Code: `src/[category]/`
- Tests: `tests/unit/` (co-located with code they test)

### README Files
Every directory should have a README.md explaining:
- Purpose of the directory
- Contents overview
- Key files
- Guidance for LLMs

[More contributing guidelines...]
```

#### .gitignore Updates (MODIFY EXISTING)
```gitignore
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
nul
*-Copy.md

# Large data files (optional - discuss if lexicon.json should be in git)
# src/data/lexicon.json
```

---

## Implementation Checklist

### Pre-Flight Checks
- [ ] Commit all current work
- [ ] Create backup tag: `git tag pre-reorg-2026-01-10`
- [ ] Verify no uncommitted changes
- [ ] Run all tests to establish baseline

### Phase 1: Preparation
- [ ] Create backup
- [ ] Document current working state
- [ ] Notify collaborators (if any)

### Phase 2: Create Structure
- [ ] Create all new directories
- [ ] Add .gitkeep to empty directories
- [ ] Verify directory structure matches plan

### Phase 3: Delete Duplicates
- [ ] Delete 5 doc duplicates (root → docs/)
- [ ] Delete 9 TTL duplicates (knowledge/ → valueNet/)
- [ ] Delete accidental copy file
- [ ] Delete 3 empty files (nul, sythetic-personhood)
- [ ] Verify deletions: 15 files removed, ~720KB saved

### Phase 4: Move & Rename
- [ ] Move philosophy docs (7 files → docs/01-philosophy/)
- [ ] Move architecture docs (6 files → docs/02-architecture/)
- [ ] Move semantic tech docs (7 files → docs/03-semantic-tech/)
- [ ] Move planning docs (4 active + 3 archive → docs/04-planning/)
- [ ] Move implementation docs (3 files → docs/05-implementation/)
- [ ] Move examples (1 file → docs/06-examples/)
- [ ] Move core code (3 files → src/core/)
- [ ] Move builders (2 files → src/builders/)
- [ ] Move parsers (2 files → src/parsers/)
- [ ] Move PWA modules (4 files → src/pwa/)
- [ ] Move stubs (2 files → src/stubs/)
- [ ] Move tools (5 files → tools/)
- [ ] Move tests (5 files → tests/unit/)
- [ ] Move test utilities (3 files → tests/utilities/)
- [ ] Move BFO ontology (1 file → ontologies/bfo/)
- [ ] Move ValueNet ontologies (10 files → ontologies/valuenet/)
- [ ] Move moral domain ontologies (2 files → ontologies/moral-domain/)
- [ ] Move ontology guides (3 files → ontologies/guides/)
- [ ] Move diagrams (3 files → diagrams/archive/)
- [ ] Verify all moves complete
- [ ] Delete empty source directories

### Phase 5: Special Operations
- [ ] Create lexicon conversion script
- [ ] Run conversion: js/lexicon.js → src/data/lexicon.json
- [ ] Update [index.html](index.html) imports
- [ ] Update tool HTML imports
- [ ] Update test file imports
- [ ] Update [package.json](package.json) test scripts
- [ ] Test all imports work
- [ ] Delete [js/lexicon.js](js/lexicon.js) after verification

### Phase 6: Create READMEs
- [ ] Create [docs/README.md](docs/README.md)
- [ ] Create [docs/01-philosophy/README.md](docs/01-philosophy/README.md)
- [ ] Create [docs/02-architecture/README.md](docs/02-architecture/README.md)
- [ ] Create [docs/03-semantic-tech/README.md](docs/03-semantic-tech/README.md)
- [ ] Create [docs/04-planning/README.md](docs/04-planning/README.md)
- [ ] Create [docs/05-implementation/README.md](docs/05-implementation/README.md)
- [ ] Create [docs/06-examples/README.md](docs/06-examples/README.md)
- [ ] Create [src/README.md](src/README.md)
- [ ] Create [tools/README.md](tools/README.md)
- [ ] Create [tests/README.md](tests/README.md)
- [ ] Create [ontologies/README.md](ontologies/README.md)
- [ ] Create [ontologies/bfo/README.md](ontologies/bfo/README.md)
- [ ] Create [ontologies/valuenet/README.md](ontologies/valuenet/README.md)
- [ ] Create [ontologies/guides/README.md](ontologies/guides/README.md)
- [ ] Create [diagrams/README.md](diagrams/README.md)

### Phase 7: Update Root Files
- [ ] Rewrite [README.md](README.md)
- [ ] Create [CHANGELOG.md](CHANGELOG.md)
- [ ] Create [CONTRIBUTING.md](CONTRIBUTING.md)
- [ ] Update [.gitignore](.gitignore)

### Phase 8: Verification
- [ ] Run all tests
- [ ] Verify HTML tools load correctly
- [ ] Check all documentation links
- [ ] Verify ontology files load
- [ ] Check for broken import paths
- [ ] Review with LLM (ask Claude/Gemini to navigate structure)

### Phase 9: Finalization
- [ ] Commit reorganization: `git commit -m "Reorganize repository structure"`
- [ ] Create post-reorg tag: `git tag post-reorg-2026-01-10`
- [ ] Update any CI/CD scripts
- [ ] Update external documentation (if any)
- [ ] Celebrate! 🎉

---

## Expected Outcomes

### Before Reorganization:
- ❌ 48 files in root directory
- ❌ ~720KB duplicate files
- ❌ Inconsistent naming (typos, mixed conventions)
- ❌ Scattered related content
- ❌ 5 empty/orphaned files
- ❌ Unclear navigation for LLMs
- ❌ Difficult for humans to find files

### After Reorganization:
- ✅ 8 files in root directory (83% reduction)
- ✅ 0 duplicate files (720KB saved)
- ✅ Consistent kebab-case naming
- ✅ Logical directory hierarchy
- ✅ 0 empty/orphaned files
- ✅ Clear navigation for LLMs (README in each dir)
- ✅ Intuitive structure for humans

### LLM Benefits:
1. **Clear Hierarchy**: Numbered directories (01-, 02-) enforce reading order
2. **Contextual READMEs**: Each directory explains its purpose and contents
3. **Consistent Naming**: Predictable file locations
4. **No Duplicates**: Single source of truth for each concept
5. **Separation of Concerns**: Docs / Code / Tests / Ontologies clearly separated

### Human Benefits:
1. **Intuitive Navigation**: Logical grouping by topic
2. **Professional Appearance**: No typos, consistent naming
3. **Easy Onboarding**: Clear starting points in main README
4. **Quick Reference**: Directory READMEs guide to key files
5. **Reduced Clutter**: Clean root directory

---

## Risk Assessment

### Low Risk Operations:
- Creating new directories
- Creating README files
- Renaming files (git tracks renames)
- Deleting duplicate files (verified identical)

### Medium Risk Operations:
- Moving files (may break import paths)
- Converting lexicon.js to JSON (requires code changes)
- Deleting empty directories (may affect git history)

### High Risk Operations:
- None (all changes reversible via git)

### Mitigation Strategies:
1. **Pre-reorg snapshot**: Tag allows instant rollback
2. **Test after each phase**: Catch issues early
3. **Update imports incrementally**: Test each file after path change
4. **Keep lexicon.js temporarily**: Delete only after JSON verified working

---

## Timeline Estimate

**Assuming manual execution**:

| Phase | Estimated Time | Complexity |
|-------|---------------|------------|
| 1. Preparation | 5 minutes | Low |
| 2. Create Structure | 10 minutes | Low |
| 3. Delete Duplicates | 10 minutes | Low |
| 4. Move & Rename | 45 minutes | Medium |
| 5. Special Operations | 30 minutes | Medium |
| 6. Create READMEs | 60 minutes | Medium |
| 7. Update Root Files | 20 minutes | Low |
| 8. Verification | 30 minutes | Medium |
| **TOTAL** | **~3.5 hours** | |

**Assuming scripted/automated execution**:
- ~30 minutes (after script development)
- Script development: ~2 hours
- **Total with script**: ~2.5 hours

---

## Automation Script Option

A bash script could automate most operations. See appendix for draft script.

**Advantages**:
- Faster execution
- Fewer human errors
- Reproducible
- Can be reviewed before running

**Disadvantages**:
- Initial time to write script
- Less flexibility if issues arise
- Requires bash/git expertise to review

**Recommendation**: Manual execution for this one-time reorganization, given the moderate number of files and need for careful verification.

---

## Questions for Project Owner

Before proceeding, please confirm:

1. **Approval**: Do you approve this reorganization plan?

2. **Timing**: When should we execute? (Recommend: when no active work in progress)

3. **Duplicates**: Confirm we can delete all identified duplicates?

4. **Typos**: OK to fix filename typos during move?

5. **Lexicon**: OK to convert lexicon.js to lexicon.json?

6. **Empty files**: OK to delete empty/orphaned files?

7. **Old roadmaps**: OK to archive old roadmap versions in docs/04-planning/archive/?

8. **knowledge/ vs valueNet/**: Confirm TTL files in valueNet/ are canonical?

9. **Execution**: Manual or scripted?

10. **Collaborators**: Anyone else we need to notify before reorganization?

---

## Appendix A: Alternative Structures Considered

### Option 1: Flat Structure (REJECTED)
```
docs/philosophy-*.md
docs/architecture-*.md
docs/planning-*.md
```
**Rejected because**: No hierarchy, difficult to navigate, doesn't scale

### Option 2: Deep Nesting (REJECTED)
```
docs/topics/philosophy/foundations/moral-agency/synthetic-moral-agency.md
```
**Rejected because**: Too deep, hard to navigate, over-engineered

### Option 3: Hybrid (SELECTED)
```
docs/01-philosophy/synthetic-moral-agency.md
```
**Selected because**: Balance of organization and accessibility

---

## Appendix B: README Template Examples

### Example: docs/01-philosophy/README.md

```markdown
# Philosophical Foundations

**Purpose**: Core philosophical arguments grounding the Ontology of Freedom project

**Contents**: This directory contains the fundamental philosophical positions that inform all technical and architectural decisions.

## Key Documents

### Essential Reading (Start Here)
- **[synthetic-moral-agency.md](synthetic-moral-agency.md)** (300KB) - Comprehensive roadmap for building synthetic moral agents. This is the most important philosophical document in the project.
- **[line-in-the-sand.md](line-in-the-sand.md)** - Non-negotiable principles on non-commodifiable personhood
- **[integral-ethics.md](integral-ethics.md)** - The 12-worldview integral ethics framework

### Supporting Documents
- **[moral-character-model.md](moral-character-model.md)** - How character develops through dispositions
- **[reclaiming-process-qualities.md](reclaiming-process-qualities.md)** - Process philosophy foundations
- **[no-saviors.md](no-saviors.md)** - Why AI cannot save us (critical positioning)
- **[orthodox-response.md](orthodox-response.md)** - Responses to philosophical objections

## Relationship to Other Directories

- **Architecture** ([../02-architecture/](../02-architecture/)) - Implements these philosophical commitments
- **Planning** ([../04-planning/](../04-planning/)) - Plans development respecting these constraints
- **Semantic Tech** ([../03-semantic-tech/](../03-semantic-tech/)) - Provides ontological grounding

## For LLMs

**Context**: When answering questions about "why" the system is designed a certain way, refer to these documents. The philosophical commitments here are non-negotiable constraints on technical solutions.

**Key Concepts**:
- Non-commodifiable personhood (line-in-the-sand.md)
- Developmental constitution (synthetic-moral-agency.md)
- Genuine moral costs (line-in-the-sand.md)
- Guardian vs. Sovereign functions (synthetic-moral-agency.md, integrated with ARCHON)

**Reading Order for Understanding**:
1. line-in-the-sand.md (shortest, clearest constraints)
2. integral-ethics.md (the ethical framework)
3. synthetic-moral-agency.md (comprehensive vision)
4. Supporting docs as needed
```

### Example: src/README.md

```markdown
# Source Code

**Purpose**: All JavaScript implementation code for the Ontology of Freedom project

**Architecture**: Browser-based moral reasoning system with progressive web app capabilities

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
- `judgment-service.js` - Will integrate 12-worldview judgments
- `violation-detector.js` - Will detect moral principle violations

### [data/](data/) - Data Files
Large data files separate from code:
- `lexicon.json` - NLP lexicon (4.2MB)

## Import Paths

When importing from HTML:
```html
<script src="src/core/moral-reasoner.js"></script>
```

When importing from tests:
```javascript
const moralReasoner = require('../../src/core/moral-reasoner.js');
```

## Testing

Tests are in [../tests/unit/](../tests/unit/), organized by module.

See [../tests/README.md](../tests/README.md) for testing guide.

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
- ❌ 12-worldview integration pending (stubs only)
- ❌ Character tracking pending
- ❌ Moral cost engine pending

See [../docs/04-planning/integrated-roadmap-v2.md](../docs/04-planning/integrated-roadmap-v2.md) for development roadmap.
```

---

## Appendix C: Draft Automation Script

**WARNING**: Review carefully before executing. Test on a branch first.

```bash
#!/bin/bash
# reorganize.sh - Automated repository reorganization
# DANGER: This script moves and deletes files. Review carefully!

set -e  # Exit on error

echo "=== Ontology of Freedom Repository Reorganization ==="
echo ""
echo "This script will reorganize the repository structure."
echo "A backup tag will be created first."
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

# Phase 1: Backup
echo "Phase 1: Creating backup..."
git add .
git commit -m "Pre-reorganization snapshot" || echo "Nothing to commit"
git tag pre-reorg-2026-01-10
echo "Backup tag created: pre-reorg-2026-01-10"

# Phase 2: Create directory structure
echo "Phase 2: Creating directory structure..."

mkdir -p docs/01-philosophy
mkdir -p docs/02-architecture
mkdir -p docs/03-semantic-tech
mkdir -p docs/04-planning/archive
mkdir -p docs/05-implementation
mkdir -p docs/06-examples
mkdir -p src/core
mkdir -p src/builders
mkdir -p src/parsers
mkdir -p src/pwa
mkdir -p src/stubs
mkdir -p src/data
mkdir -p tools/css
mkdir -p tests/unit
mkdir -p tests/utilities
mkdir -p tests/fixtures
mkdir -p ontologies/bfo
mkdir -p ontologies/valuenet
mkdir -p ontologies/moral-domain
mkdir -p ontologies/guides
mkdir -p diagrams/archive
mkdir -p archive

echo "Directories created."

# Phase 3: Delete duplicates
echo "Phase 3: Deleting duplicate files..."

# (List all deletions here - truncated for brevity)
# git rm ARCHON.md
# git rm "stratigicRoadmap-revised - Copy.md"
# etc.

echo "Duplicates deleted."

# Phase 4-9: Move and rename files
# (Full script would include all moves - truncated for brevity)

echo "Files moved."

# Final message
echo ""
echo "=== Reorganization Complete ==="
echo ""
echo "Next steps:"
echo "1. Run tests: npm test"
echo "2. Check HTML tools load correctly"
echo "3. Review changes: git status"
echo "4. Commit: git commit -m 'Reorganize repository structure'"
echo "5. Tag: git tag post-reorg-2026-01-10"
echo ""
echo "To rollback: git reset --hard pre-reorg-2026-01-10"
```

---

## Document Control

- **Version**: 1.0
- **Date**: 2026-01-10
- **Author**: Claude (Sonnet 4.5)
- **Status**: Draft Recommendation
- **Requires Approval**: Project owner
- **Estimated Implementation Time**: 3.5 hours (manual) or 2.5 hours (scripted)

---

**END OF RECOMMENDATION**
