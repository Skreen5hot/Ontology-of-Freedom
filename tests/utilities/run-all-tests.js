// This file is the main entry point for running all tests.

// 1. Load the TestRunner object and its globals ('describe', 'it', 'assert').
const { TestRunner } = require('./test-runner.js');

// 2. Load all test scenario files. This will call `describe` and populate the suites.
require('./moralReasoner.scenarios.test.js');
// Add future test files here, e.g., require('./nlp.scenarios.test.js');

// 3. Now that all tests are defined, explicitly start the runner.
TestRunner.run();