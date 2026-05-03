---
name: cypress-bootstrap-cucumber
description: >
  Use when authoring, updating, fixing, explaining, or reviewing tests in this Cypress
  Bootstrap Cucumber framework, including Gherkin features, TypeScript step definitions,
  Page Object Model classes, API clients, accessibility checks, BrowserStack setup, and
  scaffold/package conventions.
---

# Cypress Bootstrap Cucumber

This skill adapts Cypress AI Toolkit guidance to this framework. Do not copy Cypress's
upstream skills directly into the project; apply the useful Cypress testing practices through
this framework's Cucumber, Page Object Model, API-client, and accessibility conventions.

## Reference Order

Always start with this file. Load only what is needed:

- **Author/update/fix tests:** read [`references/authoring.md`](references/authoring.md).
- **Explain/review/debug tests:** read [`references/explaining-and-reviewing.md`](references/explaining-and-reviewing.md).
- **Shared agent guidance:** read [`../../agent-guidelines.md`](../../agent-guidelines.md).
- **Full framework conventions:** read [`../../../docs/conventions.md`](../../../docs/conventions.md).
- **Step placement rules:** read [`../../../docs/step-definitions.md`](../../../docs/step-definitions.md).

## Mandatory First Pass

Before changing any Cypress test code:

1. Classify the task as `CREATE`, `UPDATE`, `FIX`, `EXPLAIN`, or `REVIEW`.
2. Identify the target feature, scenario, step file, page object, API client, or config.
3. Read targeted context:
   - `package.json`
   - `cypress.config.ts`
   - `cypress/support/e2e.ts`
   - related `.feature` and `*.steps.ts` files
   - related page objects, `common.steps.ts`, custom commands, API clients, and test data
4. Prefer `rg`/targeted reads over loading large files wholesale.
5. If the request is ambiguous and cannot be inferred from local context, ask for the missing target or behavior.

## Framework Rules

- This is an E2E Cypress + Cucumber framework. Do not create `.cy.ts` or `.spec.ts` tests.
- Add behavior in `.feature` files first, then implement thin `*.steps.ts` definitions.
- New steps are colocated by default. Move a step to `common.steps.ts` only when it is used by 2+ features.
- Never define the same step text in more than one file.
- Page objects own all selectors. Do not put `cy.get()`, `cy.contains()`, CSS selectors, or raw data attributes in step definitions.
- Page objects extend `BasePage`, use arrow-function locators, and export a singleton instance.
- API steps use typed clients or `cy.sendApiRequestDef`; avoid raw `cy.request()` in step definitions.
- Tag consistently with `@ui`, `@api`, `@smoke`, `@a11y`, `@wip`, and documented domain tags.
- Keep tests independent, deterministic, and runnable in isolation.
- Do not commit `cypress.env.json`, `browserstack.generated.json`, credentials, or generated reports.

## Cypress-Specific Practices

- Respect the Cypress command queue. Do not mix `async`/`await`, manual Promises, or `setTimeout` with `cy.*` commands unless the lifecycle is explicitly handled.
- Do not assign Cypress command results to outer variables. Use `.then()`, aliases, or Cypress environment/task helpers.
- Do not use arbitrary waits. Prefer automatic retries, explicit assertions, `cy.intercept()` aliases, or deterministic state setup.
- Prefer programmatic setup with API clients, `cy.request()`, `cy.task()`, or existing helpers. Use UI login only when the login behavior itself is under test or the framework page object/session helper owns it.
- Prefer stable selectors in page objects: `data-cy`, `data-test`, `data-testid`, `data-test-id`, `data-qa`, then stable IDs/names. If only brittle selectors exist, note that the app should add a stable test attribute.
- Use Cypress documentation or `npx cypress --help` before making claims about Cypress API availability.
- Avoid `cy.prompt` unless the user explicitly asks for AI/natural-language testing and the project is configured for Cypress Cloud/prompt support.

## Verification

Run the smallest meaningful checks after edits:

```bash
npm run typecheck
npm run format:check
npm run cypress:run:smoke
npm run api:test
```

Use `npm run cypress:run:ui`, `npm run cypress:run:api`, or `npm run cypress:run:a11y` when the affected area is narrower.
