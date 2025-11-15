// pwa/concepts/progressTracker.js

/**
 * Pure function to calculate the completion percentage of tasks.
 * This function is deterministic and has no side effects.
 * As per "Pure Function Principles" in agenticDevlopment.md.
 * @param {Array<Object>} tasks - An array of task objects, each with a 'done' boolean property.
 * @returns {number} The percentage of tasks that are done (0-100).
 */
export function calculateProgress(tasks) {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return 0;
  }
  const doneTasks = tasks.filter(task => task.done).length;
  return (doneTasks / tasks.length) * 100;
}

export const progressTracker = {
  state: {
    percent: 0,
  },
  subscribers: [],

  actions: {
    /**
     * Impure action to update the progress percentage in the state.
     * It calls the pure `calculateProgress` function and then performs the side effect of state mutation.
     */
    updateProgress(tasks) {
      const newPercent = calculateProgress(tasks);
      progressTracker.state.percent = newPercent;
      progressTracker.notify('progressUpdated', { percent: newPercent });
    },
  },

  notify(event, payload) {
    this.subscribers.forEach(fn => fn(event, payload));
  },

  subscribe(fn) {
    this.subscribers.push(fn);
  },
};