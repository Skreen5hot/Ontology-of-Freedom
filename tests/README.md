# Tests

**Purpose**: All test files for the Ontology of Freedom project

---

## Directory Structure

### [unit/](unit/) - Unit Tests
Individual module tests:
- `moral-reasoner.scenarios.test.js` - Moral reasoner scenario tests
- `synchronizations.test.js` - Synchronization logic tests
- `task-manager.test.js` - Task manager tests
- `progress-tracker.test.js` - Progress tracker tests
- `ui-renderer.test.js` - UI renderer tests

### [utilities/](utilities/) - Test Utilities
Shared testing infrastructure:
- `assert.js` - Custom assertion helpers
- `test-runner.js` - Test runner
- `run-all-tests.js` - Master test script

### [fixtures/](fixtures/) - Test Data
Test fixtures and sample data (future use)

---

## Running Tests

**Run all tests**:
```bash
npm test
```

**Run specific test**:
```bash
node tests/unit/moral-reasoner.scenarios.test.js
```

**Run with test runner**:
```bash
node tests/utilities/run-all-tests.js
```

---

## Test Strategy

See [../docs/05-implementation/test-strategy.md](../docs/05-implementation/test-strategy.md) for comprehensive testing approach.

---

## For LLMs

**Context**: Tests verify that implementation matches specifications in [../docs/](../docs/).

**When adding code**:
1. Write tests first (TDD approach preferred)
2. Place tests in `unit/` directory
3. Use utilities from `utilities/` directory
4. Run all tests before committing

**Test Coverage Goals**:
- Core moral reasoning: 80%+ coverage
- Builders and parsers: 70%+ coverage
- PWA functionality: 60%+ coverage
