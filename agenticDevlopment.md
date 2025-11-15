## 🧱 **Final Template: Concepts + Synchronizations Architecture Context**

````markdown
# 🤖 AI Coding Context – Concepts + Synchronizations Architecture

## Purpose
This project follows the **MIT CSAIL “Concepts and Synchronizations”** pattern (Jackson & Meng, 2025).  
All AI code suggestions must preserve this modular, legible, declarative structure and emphasize **functional purity** and **testability**.

---

## 🧩 Concepts
- Each **Concept** is an independent JS/TS module in `/concepts`.
- A Concept:
  - Owns its own **state** and **actions**.
  - Emits events via a simple `notify(event, payload)` mechanism.
  - **Never directly imports or manipulates another Concept.**
- Each Concept module exports a single object:

  ```js
  export const taskManager = {
    state: { tasks: [] },
    actions: {
      addTask(title) { … },
      toggleTask(i) { … }
    },
    notify(event, payload) { … },
    subscribe(fn) { … }
  };
````

---

## 🔗 Synchronizations

* Cross-concept interactions live **only** in `/synchronizations.js`.
* A Synchronization is a **declarative rule** describing how one Concept’s event triggers another’s action.

  ```js
  import { taskManager } from './concepts/taskManager.js';
  import { progressTracker } from './concepts/progressTracker.js';

  export const synchronizations = [
    {
      when: 'taskAdded',
      from: taskManager,
      do: () =>
        progressTracker.actions.updateProgress(taskManager.state.tasks)
    }
  ];

  // Initialization
  synchronizations.forEach(sync => {
    sync.from.subscribe((event, payload) => {
      if (event === sync.when) sync.do(payload);
    });
  });
  ```

---

## 🧠 Development Principles

1. **Encapsulation** – Each feature = one Concept.
2. **Declarative Integration** – Connections are explicit and readable.
3. **No Hidden Side-Effects** – Synchronizations show all dependencies.
4. **Legibility First** – Code reads like a story of interactions.
5. **AI-Friendliness** – Structures are simple, analyzable, and LLM-generable.
6. **Functional Purity Where Possible** – See below.
7. **Testability and Verification** – Each Concept and Synchronization is unit-tested in isolation.

---

## 🧮 Pure Function Principles

Within each Concept:

* Prefer **pure functions** for all deterministic logic.

  * A *pure function* depends only on its inputs and produces no side effects.
  * It does not read or mutate shared/global state or perform I/O.
* Encapsulate side effects (DOM updates, fetch calls, storage writes) in **thin wrapper actions** that:

  1. Call a pure computation function, then
  2. Perform the effect in a single, visible place.
* Example:

  ```js
  // Pure computation
  function calculateProgress(tasks) {
    const done = tasks.filter(t => t.done).length;
    return tasks.length ? (done / tasks.length) * 100 : 0;
  }

  // Action wrapper
  actions: {
    updateProgress(tasks) {
      this.state.percent = calculateProgress(tasks);
      this.notify('progressUpdated', { percent: this.state.percent });
    }
  }
  ```

Benefits:

* Easier unit testing.
* Predictable synchronization outcomes.
* Better AI reasoning and refactoring safety.

---

## 🧪 Unit Testing Guidelines

### Structure

* Tests live in `/tests/<conceptName>.test.js` and `/tests/synchronizations.test.js`.
* Each Concept’s logic is tested independently:

  * Verify **pure functions** with simple input/output assertions.
  * Verify **actions** by mocking `notify` and confirming emitted events.

### Example (Vitest/Jest)

```js
import { taskManager } from '../concepts/taskManager.js';

test('addTask adds a new task', () => {
  const initial = taskManager.state.tasks.length;
  taskManager.actions.addTask('Buy milk');
  expect(taskManager.state.tasks.length).toBe(initial + 1);
});

import { calculateProgress } from '../concepts/progressTracker.js';

test('calculateProgress computes percentage correctly', () => {
  const tasks = [{done:true},{done:false}];
  expect(calculateProgress(tasks)).toBe(50);
});
```

### Synchronization Tests

Mock concepts and confirm that declarative rules fire as expected:

```js
test('taskAdded triggers progress update', () => {
  const mockProgress = { actions: { updateProgress: vi.fn() } };
  const sync = { when: 'taskAdded', from: taskManager, do: mockProgress.actions.updateProgress };
  taskManager.subscribe((e,p) => { if (e===sync.when) sync.do(p); });
  taskManager.notify('taskAdded', { title: 'Test' });
  expect(mockProgress.actions.updateProgress).toHaveBeenCalled();
});
```

### Principles

* **One behavior per test**; no integration cascades.
* **Mock synchronization targets** instead of invoking real modules.
* Ensure every Concept’s public contract (state + events) is verified.

---

## ⚙️ Folder Structure

```
/pwa
 ├── index.html
 ├── /concepts
 │    ├── taskManager.js
 │    ├── progressTracker.js
 │    └── storageSync.js
 ├── synchronizations.js
 ├── /ui
 │    └── components.js
 ├── /tests
 │    ├── taskManager.test.js
 │    ├── progressTracker.test.js
 │    └── synchronizations.test.js
 ├── manifest.json
 └── service-worker.js
```

---

## 💬 AI Instruction (for Gemini or Copilot)

> You are assisting on a project built with the **Concepts + Synchronizations** model.
> Each Concept is a self-contained module exposing state, actions, and events.
> Cross-module logic exists only in `/synchronizations.js`.
> When generating or refactoring code:
>
> * Keep Concepts independent; no direct imports.
> * Implement deterministic logic as **pure functions**.
> * Isolate side effects in minimal wrappers.
> * Always include or update related **unit tests**.
> * Prefer declarative synchronizations to imperative glue.
> * Maintain clear event names and explicit data flow.
> * Code must remain legible, testable, and analyzable by LLMs.

---

## 🧩 Example Prompt Patterns

| Task        | Prompt                                                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| New Feature | “Create a new Concept module `favoritesManager` with pure-function logic for computing favorites. Add state/actions/notify as per the pattern.” |
| Integration | “Add a synchronization so when `taskManager.taskAdded` fires, `progressTracker.updateProgress()` runs. Include a test verifying this link.”     |
| Refactor    | “Move any impure logic from `progressTracker` into wrapper actions and extract the pure parts into utility functions with tests.”               |
| Analyze     | “List all events emitted by each Concept and the synchronizations that consume them.”                                                           |

---

## 🧭 Summary

> Treat this project as a system of modular **Concepts** connected by declarative **Synchronizations**.
> Implement deterministic logic with **pure functions** and verify behavior through **unit tests**.
> Your goal, as the AI assistant, is to produce code that is **legible, verifiable, modular, and safe to evolve**.

```

