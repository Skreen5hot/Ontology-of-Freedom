const { assert } = require('./assert.js');

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m"
};

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
      console.log(`\n--- SUITE: ${colors.cyan}${suite.name}${colors.reset} ---`);
      global.it = async function(testName, testFn) {
        try {
          await testFn();
          console.log(`  ${colors.green}✅ PASS:${colors.reset} ${testName}`);
          passed++;
        } catch (error) {
          console.error(`  ${colors.red}❌ FAIL:${colors.reset} ${testName}`);
          console.error(`     ${colors.yellow}${error.message}${colors.reset}`);
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
 
// Export the runner so it can be controlled externally
module.exports = { TestRunner };