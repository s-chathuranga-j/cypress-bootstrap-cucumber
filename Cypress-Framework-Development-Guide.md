# Cypress Bootstrap Cucumber Framework Development Guide

## Purpose

This document explains the architecture, folder structure, implementation patterns, and
engineering decisions behind the Cypress Bootstrap Cucumber framework.

The project is not only a Cypress test suite. It is an installable npm scaffold that creates a
complete Cypress, Cucumber, TypeScript, Page Object Model, API testing, accessibility testing,
BrowserStack, reporting, and AI-agent-ready automation framework.

The original framework guide was written for a Cypress-only architecture. This version reflects
the current Cucumber-based project and the additional agent guidance files that help Codex,
Claude, GitHub Copilot, Cursor, Windsurf, and future AI agents work consistently inside the
framework.

## Framework Goals

The framework is designed around these goals:

- Provide a reusable npm package named `cypress-bootstrap-cucumber`.
- Scaffold a complete automation project into a consumer repository.
- Use Cucumber/Gherkin for readable behavior specifications.
- Keep implementation details in TypeScript step definitions, page objects, API clients, and
  helpers.
- Follow the Page Object Model for UI test maintainability.
- Use singleton page object exports so tests share one consistent page abstraction.
- Use arrow-function locators so Cypress commands are executed lazily at runtime.
- Keep selectors out of feature files and step definitions.
- Support UI, API, accessibility, and BrowserStack execution paths.
- Provide clear conventions for both human engineers and AI coding agents.

## Technology Stack

The framework uses:

| Area                | Technology                                                         |
| ------------------- | ------------------------------------------------------------------ |
| Test runner         | Cypress                                                            |
| BDD layer           | `@badeball/cypress-cucumber-preprocessor`                          |
| Bundling            | Esbuild through `@bahmutov/cypress-esbuild-preprocessor`           |
| Language            | TypeScript                                                         |
| UI architecture     | Page Object Model                                                  |
| API testing         | Cypress custom commands, `ApiBase`, typed API clients              |
| Reporting           | `cypress-multi-reporters`, Mochawesome, JUnit                      |
| Accessibility       | `axe-core`, `cypress-axe`, `wick-a11y`                             |
| Cloud accessibility | BrowserStack Cypress CLI accessibility automation                  |
| Scaffold delivery   | npm package, CLI, postinstall setup script                         |
| Agent guidance      | `.ai`, `.codex`, `.claude`, `.github`, `.cursor`, `.windsurfRules` |

## High-Level Architecture

At a high level, the framework separates behavior, orchestration, and implementation:

```text
Gherkin feature files
  -> TypeScript step definitions
      -> Page objects for UI behavior
      -> API clients for service behavior
      -> Custom Cypress commands and shared helpers
          -> Cypress runtime, reports, BrowserStack, accessibility plugins
```

This separation keeps tests readable while preventing feature files and step definitions from
becoming fragile implementation scripts.

## Project Structure

```text
cypress-bootstrap-cucumber/
  .ai/                         Central AI agent source of truth
  .claude/                     Claude skill adapter
  .codex/                      Codex skill adapter and OpenAI agent metadata
  .cursor/                     Cursor rules adapter
  .github/
    copilot-instructions.md    GitHub Copilot repository instructions
    prompts/                   Copilot reusable prompt files
    workflows/                 BrowserStack accessibility workflow
  .windsurfRules               Windsurf adapter
  AGENTS.md                    Generic agent entrypoint
  CLAUDE.md                    Claude entrypoint
  bin/                         CLI executable
  cypress/
    pages/                     Page Object Model classes
    support/
      commands.ts              Custom Cypress commands
      e2e.ts                   Cypress support entrypoint
      Enums.ts                 Shared enums and constants
      step_definitions/
        common.steps.ts        Steps shared by 2 or more features
        hooks.ts               Global Cucumber hooks
    testbase/
      BasePage.ts              Base class for page objects
      ApiBase.ts               API request helper
      apiClients/              Typed clients per API resource
      apiEndpoints.ts          Endpoint constants
      modals/
        requests/              Request model types
        responses/             Response model types
    testdata/                  JSON and typed data objects
    tests/
      api/                     API `.feature` and `*.steps.ts` files
      ui/                      UI and accessibility `.feature` and `*.steps.ts` files
  docs/                        Focused framework documentation
  scripts/                     Setup and BrowserStack config generation scripts
  subscription-api/            Local sample API used by API tests
```

## Why Cucumber

Cucumber adds a behavior specification layer on top of Cypress. The purpose is not to make
tests verbose. The purpose is to make the intent of important user and API behavior readable
before a person looks at implementation code.

Good feature files answer:

- What behavior is being tested?
- What user or API state matters?
- What action occurs?
- What outcome should be true?

They should not expose selectors, routes, low-level Cypress commands, API payload construction,
or implementation shortcuts.

Example:

```gherkin
@ui @smoke
Feature: Login

  Scenario: Standard user can log in
    Given I open the login page
    When I log in as a standard user
    Then the inventory page should be displayed
```

This reads like behavior. The step definition handles orchestration. The page object handles UI
mechanics.

## Cucumber Configuration

Cucumber is configured through:

- `cypress.config.ts`
- `.cypress-cucumber-preprocessorrc.json`

The Cypress spec pattern is:

```typescript
specPattern: 'cypress/tests/**/*.feature';
```

Step definitions are resolved from:

```json
[
  "cypress/tests/[filepath].steps.ts",
  "cypress/tests/[filepath]/steps.ts",
  "cypress/support/step_definitions/**/*.ts"
]
```

This supports the framework's colocated step definition model while still allowing shared
steps and hooks under `cypress/support/step_definitions`.

## Feature and Step Definition Placement

Feature files live under:

```text
cypress/tests/ui/
cypress/tests/api/
```

Each feature normally has a colocated step file:

```text
cypress/tests/ui/login.feature
cypress/tests/ui/login.steps.ts

cypress/tests/api/subscription.feature
cypress/tests/api/subscription.steps.ts
```

Shared steps live in:

```text
cypress/support/step_definitions/common.steps.ts
```

Global hooks live in:

```text
cypress/support/step_definitions/hooks.ts
```

The rule is simple:

1. Start every new step in the colocated `*.steps.ts` file.
2. Move the step to `common.steps.ts` only when 2 or more features reuse the same step text.
3. Never define the same step text in more than one file.

This avoids a common Cucumber failure mode: duplicate step definitions spread across the suite.

## Tag Strategy

Tags are the framework's primary suite selection mechanism. The framework uses native Cucumber
tag filtering through `--env tags=...`.

Common tags:

| Tag              | Purpose                       |
| ---------------- | ----------------------------- |
| `@ui`            | Browser-based UI behavior     |
| `@api`           | API behavior                  |
| `@smoke`         | Fast confidence scenarios     |
| `@a11y`          | Accessibility scenarios       |
| `@wip`           | Work in progress              |
| `@products`      | Product domain scenarios      |
| `@customers`     | Customer domain scenarios     |
| `@subscriptions` | Subscription domain scenarios |

Examples:

```bash
npm run cypress:run:smoke
cypress run --env tags="@api and @smoke"
cypress run --env tags="@ui and not @wip"
```

The framework deliberately does not use `@cypress/grep` because the maintained Cucumber
preprocessor already provides native tag expression support.

## Page Object Model

The Page Object Model is the framework's main UI maintainability pattern.

Page objects live in:

```text
cypress/pages/
```

Shared page behavior lives in:

```text
cypress/testbase/BasePage.ts
```

Every page object should:

- Extend `BasePage`.
- Keep every selector inside the page object.
- Define locators as arrow functions.
- Expose behavior through methods.
- Export a singleton instance.

Example:

```typescript
import BasePage from '../testbase/BasePage';

class LoginPage extends BasePage {
  usernameInput = () => cy.get('[data-test="username"]');
  passwordInput = () => cy.get('[data-test="password"]');
  loginButton = () => cy.get('[data-test="login-button"]');

  visit() {
    cy.visit('/');
  }

  login(username: string, password: string) {
    this.usernameInput().clear().type(username);
    this.passwordInput().clear().type(password);
    this.loginButton().click();
  }
}

export default new LoginPage();
```

## Why Arrow-Function Locators

Cypress commands are queued and executed later. A locator should not run when a class is
constructed or when a module is imported. It should run only when the test step needs it.

This is why locators use arrow functions:

```typescript
usernameInput = () => cy.get('[data-test="username"]');
```

This pattern gives each test a fresh Cypress chainable and avoids stale element references.

Avoid this:

```typescript
usernameInput = cy.get('[data-test="username"]');
```

That executes too early and fights Cypress's command queue model.

## Why Singleton Page Objects

Page objects are exported as singletons:

```typescript
export default new InventoryPage();
```

This keeps usage simple and consistent:

```typescript
import inventoryPage from '../../pages/InventoryPage';
```

The singleton should not store mutable test state. Cypress state should stay in Cypress
commands, aliases, tasks, environment values, or API responses. The singleton is a behavior
surface, not a test data container.

## Step Definitions Must Stay Thin

Step definitions should orchestrate. They should not become mini test frameworks.

Good step definitions:

- Import `Given`, `When`, `Then`, `Before`, `After`, or `DataTable` from
  `@badeball/cypress-cucumber-preprocessor`.
- Call page object methods for UI behavior.
- Call API clients or custom commands for API behavior.
- Make assertions at a business-readable level.
- Avoid raw selectors.
- Avoid large loops, payload construction, and duplicated low-level Cypress commands.

Avoid this in step definitions:

```typescript
cy.get('[data-test="username"]').type('standard_user');
cy.get('[data-test="password"]').type('secret_sauce');
cy.get('[data-test="login-button"]').click();
```

Prefer this:

```typescript
loginPage.login('standard_user', 'secret_sauce');
```

The selector details belong in `LoginPage`.

## Cypress Command Queue Rules

Cypress commands are not normal promises. The framework follows these rules:

- Do not wrap `cy.*` commands in `async`/`await`.
- Do not store Cypress command results in outer variables.
- Do not use `setTimeout` or arbitrary sleeps as synchronization.
- Use Cypress retryability, assertions, aliases, intercepts, and deterministic setup.
- Use `.then()` only when a Cypress chain needs to yield a value.

These rules reduce flaky tests and make failures easier to debug.

## Test Data Design

Shared test data lives in:

```text
cypress/testdata/testdata.json
cypress/testdata/dataObjects/
```

The framework uses data object classes for typed test data shapes and a JSON file for shared
sample data. This keeps feature files readable while avoiding magic strings scattered through
step definitions.

Feature files should describe behavior, not detailed payload fields. Step definitions and API
clients can translate readable intent into concrete request bodies.

## API Testing Architecture

API tests live under:

```text
cypress/tests/api/
```

API clients live under:

```text
cypress/testbase/apiClients/
```

Request and response models live under:

```text
cypress/testbase/modals/requests/
cypress/testbase/modals/responses/
```

The framework includes clients for:

- Customers
- Products
- Product types
- Subscriptions

The local sample API lives in:

```text
subscription-api/
```

API tests use `start-server-and-test` so the local API starts before the Cucumber API suite
runs:

```bash
npm run cypress:run:api
npm run api:test
```

This matters because API scenarios should be repeatable from a clean checkout without requiring
an external service.

## Why Typed API Clients

Typed clients give API tests a stable abstraction similar to page objects in UI tests.

Instead of putting raw `cy.request()` calls in step definitions, the framework uses clients such
as:

```text
cypress/testbase/apiClients/SubscriptionsClient.ts
```

This gives the framework:

- One place to manage endpoints.
- One place to update headers or request conventions.
- Reusable request methods.
- Better TypeScript support.
- Step definitions that describe behavior rather than HTTP plumbing.

## Accessibility Testing

Accessibility support is part of the framework, not an afterthought.

Local accessibility testing uses:

- `axe-core`
- `cypress-axe`
- `wick-a11y`

Accessibility scenarios are tagged with:

```text
@a11y
```

Run locally:

```bash
npm run cypress:run:a11y
```

The accessibility step injects axe and performs the scan from one shared implementation. Feature
files should reuse normal navigation steps and then call the accessibility scan step.

This pattern avoids creating separate "accessibility only" navigation flows that drift away from
the real user behavior.

## BrowserStack Accessibility

BrowserStack support is included for cloud accessibility execution.

Committed template:

```text
browserstack.template.json
```

Generated local file:

```text
browserstack.generated.json
```

The generated file is ignored by git because it contains resolved credential values.

Required environment variables:

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

Commands:

```bash
npm run browserstack:config
npm run browserstack:a11y
```

The GitHub Actions workflow lives in:

```text
.github/workflows/browserstack-accessibility.yml
```

It expects repository secrets:

```text
BROWSERSTACK_USERNAME
BROWSERSTACK_ACCESS_KEY
```

## Reporting

Reporting is configured through:

- `reporter-config.ts`
- `cypress.config.ts`
- `.cypress-cucumber-preprocessorrc.json`

The framework produces:

- Mochawesome HTML/JSON reports.
- JUnit XML reports.
- Cucumber JSON reports.
- Cucumber HTML reports.
- Cucumber messages output.
- Screenshots and videos when failures occur.

Generated reports and media are ignored by git.

## npm Scaffold Architecture

This project is published as the npm package:

```text
cypress-bootstrap-cucumber
```

The package exposes binaries:

```text
cypress-bootstrap-cucumber
cypress-bootstrap-cucumber-setup
```

Install into a new project:

```bash
npm init -y
npm install cypress-bootstrap-cucumber
npx cypress-bootstrap-cucumber-setup
```

The setup script:

- Creates the framework folder structure.
- Copies files only when they do not already exist.
- Copies agent guidance folders recursively.
- Copies `.gitignore` from the package `gitignore` template.
- Creates `cypress.env.json` from `cypress.env.example.json` if missing.
- Merges framework scripts into the consumer `package.json`.
- Merges framework dependencies into consumer `devDependencies`.
- Avoids a nested `npm install` during npm `postinstall`.

This makes the scaffold idempotent. Running setup again should not overwrite user files.

## Published Package Contents

The package `files` list intentionally includes the framework code, docs, BrowserStack assets,
and agent folders:

```text
cypress/
docs/
scripts/
subscription-api/
.ai/
.codex/
.claude/
.github/
.cursor/
.windsurfRules
AGENTS.md
CLAUDE.md
```

This matters because consumer projects should receive not just tests, but also the rules that
keep future test development consistent.

## AI Agent Enablement

The framework includes a centralized agent guidance architecture.

Central source of truth:

```text
.ai/
  README.md
  agent-guidelines.md
  skills/cypress-bootstrap-cucumber/SKILL.md
  skills/cypress-bootstrap-cucumber/references/
```

Agent-specific adapters:

| Agent                  | Adapter                                                       |
| ---------------------- | ------------------------------------------------------------- |
| Generic agents         | `AGENTS.md`                                                   |
| Claude                 | `CLAUDE.md`                                                   |
| Claude skills          | `.claude/skills/cypress-bootstrap-cucumber/SKILL.md`          |
| Codex skills           | `.codex/skills/cypress-bootstrap-cucumber/SKILL.md`           |
| OpenAI agent metadata  | `.codex/skills/cypress-bootstrap-cucumber/agents/openai.yaml` |
| GitHub Copilot         | `.github/copilot-instructions.md`                             |
| GitHub Copilot prompts | `.github/prompts/cypress-bootstrap-cucumber.prompt.md`        |
| Cursor                 | `.cursor/rules/framework.md`                                  |
| Windsurf               | `.windsurfRules`                                              |

The adapters stay intentionally thin. They point back to `.ai` so each agent receives the same
framework rules instead of drifting into separate conventions.

## Why Agent Guidance Belongs In The Framework

AI agents are now part of the development workflow. Without framework-specific guidance, an
agent may generate tests that technically run but violate project standards:

- Creating `.cy.ts` specs instead of `.feature` files.
- Putting selectors directly in step definitions.
- Duplicating step text across files.
- Using arbitrary waits.
- Mixing `async`/`await` with Cypress commands.
- Writing raw API requests in step definitions.
- Ignoring BrowserStack or accessibility conventions.

The agent guidance files prevent this by making the framework rules discoverable at the exact
locations different tools already read.

## Relationship Between Docs And Skills

The documentation and skills serve different purposes:

| Asset                                                   | Purpose                                  |
| ------------------------------------------------------- | ---------------------------------------- |
| `Cypress-Framework-Development-Guide.md`                | Architectural explanation and rationale  |
| `docs/conventions.md`                                   | Canonical rules for daily implementation |
| `docs/step-definitions.md`                              | Step placement details                   |
| `.ai/agent-guidelines.md`                               | Shared entrypoint for AI agents          |
| `.ai/skills/.../SKILL.md`                               | Task workflow for agents                 |
| `.ai/skills/.../references/authoring.md`                | Detailed author/update/fix guidance      |
| `.ai/skills/.../references/explaining-and-reviewing.md` | Review and explanation guidance          |

This guide explains why the framework works this way. The convention docs and skills tell
contributors exactly how to work inside it.

## Implementation Rules For New UI Tests

When adding a new UI behavior:

1. Add or update a `.feature` file under `cypress/tests/ui`.
2. Add or update the colocated `*.steps.ts` file.
3. Add or update a page object under `cypress/pages`.
4. Keep selectors inside the page object.
5. Use arrow-function locators.
6. Export the page object as a singleton.
7. Move reused steps to `common.steps.ts` only after a second feature needs them.
8. Tag the scenario with `@ui` and any relevant domain tags.
9. Add `@smoke` only when the scenario is fast and valuable as a confidence check.
10. Run `npm run typecheck` and the smallest useful Cypress suite.

## Implementation Rules For New API Tests

When adding a new API behavior:

1. Add or update a `.feature` file under `cypress/tests/api`.
2. Add or update the colocated `*.steps.ts` file.
3. Add or update an API client under `cypress/testbase/apiClients`.
4. Add request and response model types under `cypress/testbase/modals`.
5. Use endpoint constants from `apiEndpoints.ts`.
6. Avoid raw `cy.request()` calls in step definitions.
7. Keep API setup deterministic and repeatable.
8. Tag the scenario with `@api` and any relevant domain tags.
9. Run `npm run api:test`.

## Implementation Rules For Accessibility Tests

When adding accessibility coverage:

1. Reuse normal UI navigation steps.
2. Add scenarios under `cypress/tests/ui`.
3. Tag scenarios with `@a11y`.
4. Call the shared accessibility scan step.
5. Avoid duplicating navigation just for accessibility.
6. Run `npm run cypress:run:a11y`.
7. Use BrowserStack for cloud validation when credentials are available.

## Sensitive Files

Never commit:

```text
cypress.env.json
browserstack.generated.json
.env
generated reports
screenshots
videos
accessibility output
package tarballs
```

The committed examples and templates are safe:

```text
cypress.env.example.json
browserstack.template.json
gitignore
```

## Verification Strategy

Use the smallest check that proves the change.

General checks:

```bash
npm run typecheck
npm run format:check
```

Smoke:

```bash
npm run cypress:run:smoke
```

UI:

```bash
npm run cypress:run:ui
```

API:

```bash
npm run cypress:run:api
npm run api:test
```

Accessibility:

```bash
npm run cypress:run:a11y
npm run browserstack:a11y
```

Package validation:

```bash
npm pack --dry-run --ignore-scripts
```

## Common Anti-Patterns

Avoid these:

- Creating `.spec.ts` or `.cy.ts` tests in this framework.
- Putting raw selectors in step definitions.
- Duplicating step definitions with the same text.
- Making feature files describe implementation details.
- Using arbitrary waits.
- Storing Cypress chainable results in outer variables.
- Hiding assertions inside overly broad helper methods.
- Storing mutable test state in singleton page objects.
- Committing generated reports or credential files.
- Copying upstream AI toolkit skills directly without adapting them to this architecture.

## What Good Looks Like

A good contribution to this framework has these traits:

- The feature file reads like behavior.
- The step definition is thin and readable.
- UI details live in page objects.
- API details live in typed clients.
- Shared logic is extracted only when it is genuinely reused.
- Tags make suite selection predictable.
- Accessibility coverage reuses user flows.
- BrowserStack configuration remains credential-safe.
- AI agent guidance remains centralized in `.ai`.
- Verification commands are run and documented.

## Conclusion

Cypress Bootstrap Cucumber is designed to be more than a sample test suite. It is a reusable
automation framework that encodes architectural standards into its folder structure, TypeScript
patterns, Cucumber conventions, package setup, BrowserStack workflow, and AI agent guidance.

The most important principle is separation of responsibility:

- Feature files describe behavior.
- Step definitions orchestrate behavior.
- Page objects implement UI interactions.
- API clients implement service interactions.
- Test data and models describe data.
- Config files wire execution, reporting, and cloud integrations.
- Agent files preserve the framework rules for future contributors.

When those boundaries stay intact, the framework remains readable, scalable, and safe to evolve.
