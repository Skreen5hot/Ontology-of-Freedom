// Assuming the test runner from customTestPlan.md is loaded first.
const { taskManager } = require('../concepts/taskManager.js');
const { synchronizations } = require('../synchronizations.js');

describe('Synchronizations', () => {

  // Test for the 'taskAdded' synchronization rule as per Task 3.1
  it('should trigger progress update when a task is added', () => {
    // 1. Create a mock for the target concept
    const mockProgressTracker = {
      actions: {
        updateProgress: (payload) => {
          mockProgressTracker.actions.updateProgress.calls.push(payload);
        }
      }
    };
    mockProgressTracker.actions.updateProgress.calls = []; // Initialize call log

    // 2. Find the specific synchronization rule and replace its action with the mock
    const syncRule = synchronizations.find(s => s.when === 'taskAdded');
    syncRule.do = mockProgressTracker.actions.updateProgress;

    // 3. Trigger the source event
    const testPayload = [{ id: 1, title: 'Test Task', done: false }];
    taskManager.notify('taskAdded', testPayload);

    // 4. Assert that the mock was called correctly
    assert.equals(mockProgressTracker.actions.updateProgress.calls.length, 1, 'updateProgress should have been called once');
    assert.equals(mockProgressTracker.actions.updateProgress.calls[0], testPayload, 'updateProgress should be called with the event payload');
  });

  // Test for the 'taskToggled' synchronization rule as per Task 3.2
  it('should trigger progress update when a task is toggled', () => {
    // 1. Create a mock for the target concept
    const mockProgressTracker = {
      actions: {
        updateProgress: (payload) => {
          mockProgressTracker.actions.updateProgress.calls.push(payload);
        }
      }
    };
    mockProgressTracker.actions.updateProgress.calls = []; // Initialize call log

    // 2. Find and replace the action with the mock
    const syncRule = synchronizations.find(s => s.when === 'taskToggled');
    syncRule.do = mockProgressTracker.actions.updateProgress;

    // 3. Trigger the source event
    const testPayload = [{ id: 1, title: 'Test Task', done: true }];
    taskManager.notify('taskToggled', testPayload);

    // 4. Assert that the mock was called correctly
    assert.equals(mockProgressTracker.actions.updateProgress.calls.length, 1, 'updateProgress should have been called once on toggle');
    assert.equals(mockProgressTracker.actions.updateProgress.calls[0], testPayload, 'updateProgress should be called with the toggled payload');
  });

});