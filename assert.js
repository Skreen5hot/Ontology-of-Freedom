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