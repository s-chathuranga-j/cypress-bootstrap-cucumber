# AI Agent Guidelines

This is the shared agent entrypoint for the Cypress Bootstrap Cucumber framework.

## Load Order

1. Read this file.
2. Read `.ai/skills/cypress-bootstrap-cucumber/SKILL.md` for task flow.
3. Read only the needed skill references:
   - `.ai/skills/cypress-bootstrap-cucumber/references/authoring.md`
   - `.ai/skills/cypress-bootstrap-cucumber/references/explaining-and-reviewing.md`
4. Read framework docs only as needed:
   - `docs/conventions.md`
   - `docs/step-definitions.md`
   - `docs/page-object-model.md`
   - `docs/api-testing.md`
   - `docs/accessibility.md`

## Non-Negotiable Rules

- This is a Cypress + Cucumber + TypeScript E2E framework.
- Use `.feature` files and colocated `*.steps.ts` files; do not create `.spec.ts` or `.cy.ts` tests.
- Page objects own all selectors. Do not put raw selectors or `cy.get()` calls in step definitions.
- Page object locators are arrow functions and page objects export singleton instances.
- New steps start colocated. Move a step to `cypress/support/step_definitions/common.steps.ts` only after 2+ features use the same step text.
- Keep tests deterministic: no arbitrary waits, no async/await around `cy.*`, no command results stored in outer variables.
- Prefer API clients, custom commands, intercept aliases, retryable assertions, and page objects over duplicated low-level Cypress code.
- Do not commit secrets, `cypress.env.json`, `browserstack.generated.json`, generated reports, screenshots, or accessibility output.

## Verification Defaults

```bash
npm run typecheck
npm run format:check
npm run cypress:run:smoke
```

Use `npm run api:test`, `npm run cypress:run:ui`, or `npm run cypress:run:a11y` when the touched area calls for it.
