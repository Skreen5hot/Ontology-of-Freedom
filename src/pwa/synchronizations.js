// pwa/synchronizations.js

import { taskManager } from './concepts/taskManager.js';
import { progressTracker } from './concepts/progressTracker.js';
import { uiRenderer } from './concepts/uiRenderer.js';

/**
 * This array defines all cross-concept interactions in the application.
 * Each object is a declarative rule that links an event from one concept
 * to an action in another.
 * As per "Declarative Integration" in agenticDevlopment.md.
 */
export const synchronizations = [
  {
    when: 'taskAdded',
    from: taskManager,
    do: (tasksPayload) => progressTracker.actions.updateProgress(tasksPayload)
  },
  {
    when: 'taskToggled',
    from: taskManager,
    do: (tasksPayload) => progressTracker.actions.updateProgress(tasksPayload)
  },
  {
    when: 'taskAdded',
    from: taskManager,
    do: (tasksPayload) => uiRenderer.actions.renderTaskList(tasksPayload)
  },
  {
    when: 'taskToggled',
    from: taskManager,
    do: (tasksPayload) => uiRenderer.actions.renderTaskList(tasksPayload)
  }
];

// Initialization logic to activate the synchronizations.
synchronizations.forEach(sync => {
  sync.from.subscribe((event, payload) => {
    if (event === sync.when) sync.do(payload);
  });
});