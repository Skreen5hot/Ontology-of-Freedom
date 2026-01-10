// Assuming the test runner from customTestPlan.md is loaded first.
const { createTask, toggleTaskStatus, taskManager } = require('../concepts/taskManager.js');

describe('taskManager Concept', () => {

  // Test for the pure function `createTask` as per Task 1.1
  it('createTask pure function should create a valid task object', () => {
    const title = '  Buy milk  ';
    const task = createTask(title);

    assert.isDefined(task, 'Task should be defined for a valid title');
    assert.equals(task.title, 'Buy milk', 'Task title should be trimmed');
    assert.equals(task.done, false, 'New task should not be done');
    assert.isDefined(task.id, 'Task should have an ID');
  });

  it('createTask pure function should handle invalid input', () => {
    const task1 = createTask('');
    const task2 = createTask(null);
    assert.equals(task1, null, 'Task should be null for an empty title');
    assert.equals(task2, null, 'Task should be null for a null title');
  });

  it('toggleTaskStatus pure function should toggle a task and return a new array', () => {
    const initialTasks = [
      { id: 1, title: 'Task 1', done: false },
      { id: 2, title: 'Task 2', done: true },
    ];

    const updatedTasks = toggleTaskStatus(initialTasks, 1);

    assert.isDefined(updatedTasks, 'Updated tasks array should be defined');
    assert.notEquals(updatedTasks, initialTasks, 'Should return a new array, not mutate the original');
    assert.equals(updatedTasks[0].done, true, 'The target task should be toggled to true');
    assert.equals(updatedTasks[1].done, true, 'Other tasks should remain unchanged');
  });

  it('toggleTaskStatus pure function should handle non-existent task IDs gracefully', () => {
    const initialTasks = [{ id: 1, title: 'Task 1', done: false }];
    const updatedTasks = toggleTaskStatus(initialTasks, 99); // Non-existent ID
    assert.equals(updatedTasks.length, 1, 'Array length should be unchanged');
    assert.equals(updatedTasks[0].done, false, 'Task status should be unchanged for invalid ID');
  });

  // Test for action event emission as per Task 3.3
  it('addTask action should emit a "taskAdded" event with the correct payload', () => {
    // 1. Reset state and mock the notify function
    taskManager.state.tasks = [];
    const mockNotifier = {
      lastCall: null,
      fn: (event, payload) => {
        mockNotifier.lastCall = { event, payload };
      }
    };
    taskManager.notify = mockNotifier.fn;

    // 2. Call the action
    taskManager.actions.addTask('A new task');

    // 3. Assert the notification
    assert.isDefined(mockNotifier.lastCall, 'Notify should have been called');
    assert.equals(mockNotifier.lastCall.event, 'taskAdded', 'The event name should be "taskAdded"');
    assert.equals(mockNotifier.lastCall.payload.length, 1, 'Payload should contain one task');
    assert.equals(mockNotifier.lastCall.payload[0].title, 'A new task', 'Payload task title should be correct');
  });

  it('toggleTask action should emit a "taskToggled" event with the correct payload', () => {
    // 1. Set initial state and mock the notify function
    taskManager.state.tasks = [{ id: 123, title: 'An existing task', done: false }];
    const mockNotifier = {
      lastCall: null,
      fn: (event, payload) => {
        mockNotifier.lastCall = { event, payload };
      }
    };
    taskManager.notify = mockNotifier.fn;

    // 2. Call the action
    taskManager.actions.toggleTask(123);

    // 3. Assert the notification
    assert.isDefined(mockNotifier.lastCall, 'Notify should have been called');
    assert.equals(mockNotifier.lastCall.event, 'taskToggled', 'The event name should be "taskToggled"');
    assert.equals(mockNotifier.lastCall.payload.length, 1, 'Payload should contain one task');
    assert.equals(mockNotifier.lastCall.payload[0].done, true, 'Payload task should be toggled to done');
  });

});