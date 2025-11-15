// pwa/concepts/taskManager.js

/**
 * Pure function to create a new task object.
 * This function is deterministic and has no side effects.
 * As per "Pure Function Principles" in agenticDevlopment.md.
 * @param {string} title - The title of the task.
 * @returns {{id: number, title: string, done: boolean}} A new task object.
 */
export function createTask(title) {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    // Returning null or throwing an error are valid ways for a pure function to handle invalid input.
    return null;
  }
  return {
    id: Date.now(), // Using Date.now() for simplicity, a UUID library would be better for production.
    title: title.trim(),
    done: false,
  };
}

export const taskManager = {
  state: {
    tasks: [],
  },
  subscribers: [],

  actions: {
    /**
     * Impure action to add a task to the state.
     * It calls the pure `createTask` function and then performs the side effect of state mutation.
     */
    addTask(title) {
      const newTask = createTask(title);
      if (newTask) {
        taskManager.state.tasks.push(newTask);
        // The notification is a side effect.
        // As per Task 2.1, emit the full task list as the payload.
        taskManager.notify('taskAdded', taskManager.state.tasks);
      }
    },

    /**
     * Impure action to toggle a task's status in the state.
     * It calls the pure `toggleTaskStatus` function and then performs the side effect of state mutation.
     */
    toggleTask(taskId) {
      const newTasks = toggleTaskStatus(taskManager.state.tasks, taskId);
      taskManager.state.tasks = newTasks;
      // As per Task 2.2, emit the full updated task list as the payload.
      taskManager.notify('taskToggled', newTasks);
    }
  },

  notify(event, payload) {
    this.subscribers.forEach(fn => fn(event, payload));
  },

  subscribe(fn) {
    this.subscribers.push(fn);
  },
};