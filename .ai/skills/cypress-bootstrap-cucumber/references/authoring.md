# Authoring, Updating, And Fixing Tests

Use this reference when creating, updating, or fixing Cypress behavior in this framework.

## Identify The Work

Settle these before editing:

- `task`: `CREATE`, `UPDATE`, or `FIX`
- `target`: feature/scenario/step/page/API client/config path
- `behavior`: the user-facing behavior or API contract to validate
- `type`: E2E Cucumber only unless the framework is intentionally extended
- `constraints`: tags, BrowserStack/accessibility needs, API setup, or scaffold/package impact

If the target is not named, infer it from `cypress/tests`, `cypress/pages`, Gherkin text, and config. Ask only when multiple plausible targets remain.

## Gather Project Context

Read targeted files before changing code:

- `package.json` for scripts, Cypress version, and installed libraries
- `cypress.config.ts` for `baseUrl`, `specPattern`, env, preprocessors, reporters, and plugin hooks
- `cypress/support/e2e.ts`, `commands.ts`, `ApiBase.ts`, and `index.d.ts` for custom command behavior
- `cypress/support/step_definitions/common.steps.ts` to avoid duplicate step text
- related `.feature` / `*.steps.ts` pairs
- related page objects in `cypress/pages`
- related API clients, models, and test data under `cypress/testbase` and `cypress/testdata`

Prefer updating a related feature/step file over creating a new one unless the behavior is genuinely new.

## Write Gherkin First

- Keep scenarios readable and user-behavior oriented.
- Prefer titles in the shape: `Action → expected result` when adding new scenarios.
- Use `Background` only for truly common setup inside one feature.
- Keep tags stable and useful: `@ui`, `@api`, `@smoke`, `@a11y`, `@wip`, and domain tags.
- Avoid overly tiny scenarios that only assert one implementation detail; prefer one coherent behavior with explicit assertions.

## Implement Thin Steps

- Import Cucumber bindings from `@badeball/cypress-cucumber-preprocessor`.
- Step definitions orchestrate page objects, API clients, custom commands, and assertions.
- Do not put raw selectors in steps. Add or update page-object locators instead.
- Do not duplicate step text. Start colocated; move to `common.steps.ts` only after a second feature needs the same wording.
- Keep reusable browser setup in hooks or shared steps, not copied through feature-specific step files.

## Page Object Rules

- Extend `BasePage`.
- Locators are arrow functions returning Cypress chainables.
- Export a singleton: `export default new PageName()`.
- Prefer stable selectors: `data-cy`, `data-test`, `data-testid`, `data-test-id`, `data-qa`, then stable IDs/names.
- Use `cy.contains()` in page objects when visible text is the stable identifier.
- Avoid class names, DOM-depth selectors, generated IDs, and nth-child style locators. If unavoidable, call out the app improvement needed.

## State And Data

- Tests must be independent and runnable in isolation.
- Reset or establish state before the scenario, not after.
- Prefer API clients, `cy.task()`, or existing custom commands for setup over repeated UI flows.
- Use UI login only for login behavior or through a framework-owned helper/page object.
- Use fixtures/testdata/data objects that match existing conventions.
- Do not assign Cypress command results to outer variables. Use `.then()`, `.as()`, or Cypress env/task helpers.

## Async And Waiting

- Cypress commands are queued; they are not Promise-based in the normal JavaScript sense.
- Avoid `async`/`await`, manual Promises, and `setTimeout` around `cy.*` commands.
- Never use arbitrary waits like `cy.wait(5000)`.
- Prefer retryable assertions, `cy.intercept()` + `cy.wait('@alias')`, or explicit timeouts on assertions.
- If external async code is absolutely necessary, keep it outside Cypress chains or return it correctly without mixing `cy.*` calls.

## Network And API

- For API feature steps, use typed clients or `cy.sendApiRequestDef`.
- Use `cy.intercept()` to wait for UI-triggered network calls, assert payloads, or stub responses when that makes tests deterministic.
- Define intercepts before the action that triggers the request.
- Keep endpoint constants in `apiEndpoints.ts` and payload/response shapes under `modals`.

## Accessibility And BrowserStack

- Use `cy.injectAxe()` and `cy.checkAccessibility()` through the framework accessibility steps.
- Tag accessibility scenarios with `@a11y`.
- BrowserStack credentials come only from `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`.
- Do not commit generated accessibility reports or `browserstack.generated.json`.

## `cy.prompt`

Only consider `cy.prompt` when all are true:

- The user explicitly asks for AI/natural-language test behavior.
- Cypress is new enough for the command.
- The project is configured for Cypress Cloud/prompt support.
- Offline/deterministic execution is not a requirement.

Otherwise, author deterministic Gherkin, page objects, custom commands, intercepts, and API setup.
