// pwa/concepts/uiRenderer.js

/**
 * A pure function to escape HTML special characters, preventing XSS.
 * As per the "Secure Coding Checklist for uiRenderer.js".
 * @param {string} str The string to sanitize.
 * @returns {string} The sanitized string.
 */
export function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(match) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[match];
  });
}

/**
 * A pure function that generates an HTML string for the task list.
 * It uses escapeHTML to ensure all dynamic content is safe.
 * @param {Array<Object>} tasks - The array of task objects.
 * @returns {string} An HTML string representing the task list.
 */
export function renderTasks(tasks) {
  if (!tasks || tasks.length === 0) {
    return '<p>No tasks yet. Add one!</p>';
  }
  return `
    <ul>
      ${tasks.map(task => `
        <li class="${task.done ? 'done' : ''}">
          ${escapeHTML(task.title)}
        </li>
      `).join('')}
    </ul>
  `;
}

export const uiRenderer = {
  state: {
    // This concept might hold references to DOM elements
    tasksContainer: null,
    progressContainer: null,
  },
  subscribers: [],

  actions: {
    /**
     * An impure action that renders the task list to the DOM.
     * It calls the pure `renderTasks` function to get the safe HTML.
     */
    renderTaskList(tasks) {
      if (uiRenderer.state.tasksContainer) {
        const safeHTML = renderTasks(tasks);
        uiRenderer.state.tasksContainer.innerHTML = safeHTML;
      }
    },
  },

  notify(event, payload) {
    this.subscribers.forEach(fn => fn(event, payload));
  },

  subscribe(fn) {
    this.subscribers.push(fn);
  },
};