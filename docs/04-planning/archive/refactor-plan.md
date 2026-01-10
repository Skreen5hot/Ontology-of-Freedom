Plan for Architecturally Aligning the Project to Concepts + Synchronizations
1. Objective
The primary objective of this refactor is to bring the project into 100% compliance with the Concepts + Synchronizations architectural pattern as defined in agenticDevlopment.md. This initiative will enforce strict modularity, functional purity, declarative integration, and comprehensive testability, resulting in a codebase that is more legible, verifiable, and maintainable.

2. Core Strategy: Thematic Iteration
The refactoring will proceed through a series of safe, incremental phases. This thematic approach mitigates risk by avoiding a single, large-scale change. We will address violations in a logical sequence: first, by purifying the internal logic of each Concept; second, by enforcing strict encapsulation between Concepts; and finally, by ensuring all new and existing logic is verified with unit tests.

3. Execution Plan & Progress Tracker
The following tasks represent the concrete steps required to achieve full architectural compliance. Each task is mapped to a specific principle from agenticDevlopment.md.

Phase 1: Pure Function Extraction & Isolation

This phase focuses on refactoring internal Concept logic to separate pure, deterministic calculations from impure side effects, as per the "Pure Function Principles".

[x] Task 1.1: In taskManager.js, extract the logic for creating a new task object from actions.addTask into a new pure function createTask(title). The addTask action will then call this function and handle the side effect of updating state.tasks.
[x] Task 1.2: In taskManager.js, extract the logic for toggling a task's status from actions.toggleTask into a new pure function toggleTaskStatus(tasks, index). This function should return a new tasks array. The toggleTask action will call this function and handle the state update.
[x] Task 1.3: Write dedicated unit tests for the new pure functions createTask and toggleTaskStatus to verify their input/output behavior, as per the "Unit Testing Guidelines".
Phase 2: Encapsulation and Synchronization Enforcement

This phase focuses on eliminating direct dependencies and ensuring all cross-concept interactions are managed declaratively, as per the "Declarative Integration" and "Encapsulation" principles.

[x] Task 2.1: In synchronizations.js, refactor the taskAdded synchronization rule. The do function currently reads directly from taskManager.state.tasks. Modify this so that the taskAdded event from taskManager emits the full, updated task list as its payload, making the synchronization self-contained.
[x] Task 2.2: Create a new taskToggled event to be emitted by the taskManager's toggleTask action. This event should include the updated task list in its payload.
[x] Task 2.3: Add a new synchronization rule to synchronizations.js for the taskToggled event. This rule will trigger progressTracker.actions.updateProgress when a task is toggled, ensuring the progress percentage is always current.
Phase 3: Unit Test Coverage Expansion

This phase focuses on creating robust tests for the system's integration points and public contracts, as per the "Synchronization Tests" and "Unit Testing Guidelines".

[x] Task 3.1: In tests/synchronizations.test.js, update the test for the taskAdded synchronization. The test must now verify that the updateProgress action is called with the payload provided by the taskAdded event, not by accessing state directly.
[x] Task 3.2: In tests/synchronizations.test.js, create a new test for the taskToggled synchronization rule. This test will mock the taskManager and progressTracker concepts and verify that the progressTracker.actions.updateProgress mock is called correctly when taskManager notifies a taskToggled event.
[x] Task 3.3: In tests/taskManager.test.js, update the tests for the addTask and toggleTask actions. Instead of only checking the final state, mock the notify function and assert that the correct events (taskAdded, taskToggled) are emitted with the expected payloads.