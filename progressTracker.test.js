// Assuming the test runner from customTestPlan.md is loaded first.
const { calculateProgress } = require('../concepts/progressTracker.js');

describe('progressTracker Concept', () => {

  // Test for the pure function `calculateProgress`
  it('calculateProgress pure function should return 0 for no tasks', () => {
    assert.equals(calculateProgress([]), 0, 'Should be 0 for an empty array');
    assert.equals(calculateProgress(null), 0, 'Should be 0 for null input');
    assert.equals(calculateProgress(undefined), 0, 'Should be 0 for undefined input');
  });

  it('calculateProgress pure function should return 0 if no tasks are done', () => {
    const tasks = [{ done: false }, { done: false }];
    assert.equals(calculateProgress(tasks), 0, 'Should be 0 if no tasks are done');
  });

  it('calculateProgress pure function should return 100 if all tasks are done', () => {
    const tasks = [{ done: true }, { done: true }];
    assert.equals(calculateProgress(tasks), 100, 'Should be 100 if all tasks are done');
  });

  it('calculateProgress pure function should calculate partial progress correctly', () => {
    const tasks = [
      { done: true }, { done: false }, { done: true }, { done: false }
    ];
    assert.equals(calculateProgress(tasks), 50, 'Should correctly calculate 50%');
  });

});