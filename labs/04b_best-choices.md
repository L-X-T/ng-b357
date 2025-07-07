# 04b Best Choices in Angular

<!-- TOC -->
- [Group 1: Content Projection](#group-1-content-projection)
  - [Bonus questions](#group-1-bonus-questions)
- [Group 2: Reactivity: Subjects vs Signals](#group-2-reactivity-subjects-vs-signals)
  - [Bonus questions](#group-2-bonus-questions)
- [Group 3: API Requests: Resource API vs HttpClient](#group-3-api-requests-resource-api-vs-httpclient)
  - [Bonus questions](#group-3-bonus-questions)
- [Group 4: State Management](#group-4-state-management)
  - [Bonus questions](#group-4-bonus-questions)
<!-- /TOC -->

In this extended lab, we'll experiment with the best choices in Angular.

**Lab time:** 60–90 minutes

**Group lab:** If your workshop is onsite, please form 2–4 groups (depending on participants and interests) for this special group lab. Your trainer should assign topics before you start.

## Group 1: Content Projection

The first group's task is to identify **dumb components** in your Angular application(s).

1. Select at least one potential dumb component and refactor it to use Angular's _content projection_. Ideally, replace existing input properties (via `@Input` decorator or `input()` signal) with content projection to increase reusability and flexibility. You can also consolidate two similar components into one using content projection.
2. Implement the content projection collaboratively within your group.
3. Prepare to share your findings with the rest of the team.

### Group 1 Bonus Questions

- What are the trade-offs of using content projection? When is it better to use input properties instead?

## Group 2: Reactivity: Subjects vs Signals

The second group's task is to evaluate the reactivity approach used in your Angular application(s).

1. Which method is being used: Observables/Subjects or Signals?
   - If Observables/Subjects, how are values read/subscribed? Is there subscription management?
   - If Signals, are computed values and effects used?
2. Attempt to switch from the current solution to the other (Observables/Subjects ⇄ Signals).
3. Prepare to share your findings with the rest of the team.

### Group 2 Bonus Questions

- Which approach is better? When should you choose one over the other? What are the trade-offs?

## Group 3: API Requests: Resource API vs HttpClient

The third group's task is to examine the approach for GET requests to the backend.

1. Which method is being used: _Promises_, `HttpClient`, or `HttpResource`?
2. Try refactoring a component or service to use the modern `HttpResource` solution.
3. Prepare to share your findings with the rest of the team.

### Group 3 Bonus Questions

- Do interceptors still work with `HttpResource`? If yes, how? If no, why not?

## Group 4: State Management

The fourth group's task is to analyze the state management solution in your Angular application(s). Choose one feature to inspect and refactor to an alternative solution.

1. Which state management solution is being used: Subjects/Signals, a service holding state, NgRx Store, SignalStore, or another package?
2. Attempt to switch from the current solution to a different one.
3. Prepare to share your findings with the rest of the team.

### Group 4 Bonus Questions

- Which state management solution is primarily used in your application(s)? Is it still the best choice? What are the trade-offs?
