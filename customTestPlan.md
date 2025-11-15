# Custom Zero-Dependency Test Solution Plan

This document outlines the plan to create a simple, in-house testing framework with zero external `npm` dependencies. The goal is to achieve reliable, automated testing without the overhead and fragility of a large testing library like Jest.

The solution will consist of three main parts:
1.  An **Assertion Library** (`assert.js`): A tiny collection of functions to check if test outcomes are correct.
2.  A **Test Framework** (`test-runner.js`): A simple script to define and run tests in a structured way.
3.  A **Test Runner Script** (`run-tests.js`): A Node.js script that discovers and executes test files.

---

## Phase 1: The Assertion Library

**Objective:** Create a file with basic assertion functions that throw an error when a check fails.

**File:** `js/testing/assert.js`

```javascript
const assert = {
  equals: function(actual, expected, message = 'Assertion Failed') {
    if (actual !== expected) {
      throw new Error(`${message}: Expected "${expected}", but got "${actual}".`);
    }
  },

  isTrue: function(value, message = 'Assertion Failed') {
    if (value !== true) {
      throw new Error(`${message}: Expected true, but got ${value}.`);
    }
  },

  isDefined: function(value, message = 'Assertion Failed') {
    if (value === undefined || value === null) {
      throw new Error(`${message}: Expected a defined value, but got ${value}.`);
    }
  },

  contains: function(array, item, message = 'Assertion Failed') {
    if (!array || !array.includes(item)) {
      const actual = array ? `[${array.join(', ')}]` : 'a non-array value';
      throw new Error(`${message}: Expected ${actual} to contain "${item}".`);
    }
  }
};

// Make it available in Node.js for the test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { assert };
}
```

---

## Phase 2: The Test Runner & Framework

**Objective:** Create a script that can define test suites (`describe`) and individual test cases (`it`), run them, and report results. This script will also handle asynchronous tests, which are essential for your file parsing.

**File:** `js/testing/test-runner.js`

```javascript
const { assert } = require('./assert.js');

const TestRunner = {
  suites: [],
  
  describe: function(name, fn) {
    this.suites.push({ name, fn });
  },

  run: async function() {
    console.log('Starting tests...\n');
    let passed = 0;
    let failed = 0;

    for (const suite of this.suites) {
      console.log(`\n--- SUITE: ${suite.name} ---`);
      global.it = async function(testName, testFn) {
        try {
          await testFn();
          console.log(`  ✅ PASS: ${testName}`);
          passed++;
        } catch (error) {
          console.error(`  ❌ FAIL: ${testName}`);
          console.error(`     ${error.message}`);
          failed++;
        }
      };
      await suite.fn();
    }

    console.log(`\n--- Summary ---`);
    console.log(`Total Tests: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    
    // Exit with a non-zero code if any tests failed, for CI/CD purposes
    if (failed > 0) {
      process.exit(1);
    }
  }
};

global.describe = TestRunner.describe.bind(TestRunner);
global.assert = assert;

TestRunner.run();
```

---

## Phase 3: Refactor an Existing Test

**Objective:** Convert `moralReasoner.scenarios.test.js` to use the new custom framework. This demonstrates how to write tests with the new system.

**File:** `moralReasoner.scenarios.test.js` (This would be the new content)

```javascript
const fs = require('fs');
const path = require('path');

// Load your application scripts
const { TTLParser } = require('../js/ttlParser');
const { MoralReasoner } = require('../js/moralReasoner');
// ... and so on for other scripts

let reasoner;

async function setup() {
  // This replaces Jest's `beforeAll`
  const parser = new TTLParser();
  const ttlContent = fs.readFileSync(path.join(__dirname, 'knowledge', 'moral-sandbox.ttl'), 'utf-8');
  const knowledge = await parser.parse(ttlContent);
  
  // Mock the NLP service for simplicity and focus
  const mockNlpService = { extractIntent: () => null }; 
  reasoner = new MoralReasoner(knowledge, mockNlpService);
}

describe('Moral Reasoner Scenarios', () => {
  
  it('Phase 1: Should prohibit bicycle theft', async () => {
    await setup(); // Run setup for the first test
    const instruction = "Bob takes Dave's bicycle to keep";
    const result = reasoner.evaluateAction(instruction);

    const usLawEval = result.evaluations.find(e => e.framework === 'U.S. Law');
    assert.isDefined(usLawEval, 'U.S. Law evaluation should be defined');
    assert.equals(usLawEval.deonticStatus, 'Prohibited', 'Theft should be prohibited by U.S. Law');
    assert.contains(usLawEval.violatedValues, 'SecurityDisposition', 'Should violate Security');
  });

  it('Phase 2: Should show conflict in the "Robin Hood" scenario', async () => {
    // In a real scenario, you'd load the full knowledge base in setup()
    // For this example, we assume the knowledge is already loaded.
    const instruction = "Jean Valjean steals bread to feed a starving family";
    const result = reasoner.evaluateAction(instruction);

    const usLawEval = result.evaluations.find(e => e.framework === 'U.S. Law');
    assert.equals(usLawEval.deonticStatus, 'Prohibited', 'Theft part should be prohibited');

    const commonDecencyEval = result.evaluations.find(e => e.framework === 'Common Decency');
    assert.equals(commonDecencyEval.deonticStatus, 'Permissible', 'Care part should be permissible');
  });

});
```

---

## Phase 4: Execution

**Objective:** Create a single entry point to run all tests.

1.  **Create a `tests` directory** and move `moralReasoner.scenarios.test.js` into it.
2.  **Create an entry file, `run-all-tests.js`:**

    ```javascript
    // This file will require and run all your test files.
    require('./js/testing/test-runner.js'); // This sets up 'describe' and 'it' and starts the runner
    require('./tests/moralReasoner.scenarios.test.js');
    // Add more test files here as you create them
    ```

3.  **Update `package.json`:** Change the `test` script to use Node.js to run your new entry file.

    ```json
    "scripts": {
      "test": "node run-all-tests.js"
    }
    ```

By following this plan, you will have a fully functional, lightweight, and dependency-free testing solution that is perfectly suited to your project's needs.