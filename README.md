# Cypress Bootstrap Cucumber

A Cypress, Cucumber, and TypeScript automation framework that follows the Page Object Model.
It is designed as an installable npm scaffold and includes sample UI, API, accessibility,
and BrowserStack configuration.

The sample UI tests target [Sauce Demo](https://www.saucedemo.com/).
The sample API tests target the bundled `subscription-api` service.

## Features

- Cypress 15 with TypeScript and Cucumber/Gherkin
- Page Object Model with singleton page classes and arrow-function locators
- Colocated `.feature` and `*.steps.ts` files under `cypress/tests`
- Shared steps and hooks centralised in `cypress/support/step_definitions`
- API clients, request models, response models, and shared custom commands
- Mochawesome and JUnit reporting
- Native Cucumber tag filtering with `--env tags=@smoke`
- Local accessibility checks with `wick-a11y`, `cypress-axe`, and `axe-core`
- BrowserStack Accessibility Testing config and GitHub Actions workflow
- AI agent guidance for Claude, Codex, GitHub Copilot, Cursor, and Windsurf

## Requirements

- Node.js `^20.1.0 || ^22.0.0 || >=24.0.0`
- npm `>=10`

## Install As A Scaffold

```bash
npm init -y
npm install cypress-bootstrap-cucumber
npx cypress-bootstrap-cucumber-setup
```

The setup command creates the Cypress folder structure, copies framework files without
overwriting existing files, merges required scripts and dev dependencies into `package.json`,
and runs `npm install`.

## Project Structure

```text
cypress/
  pages/                      Page Object Model classes
  support/
    commands.ts               Custom Cypress commands
    e2e.ts                    Support entry point
    step_definitions/
      hooks.ts                Global Before/After hooks
      common.steps.ts         Steps shared across 2+ features
  testbase/                   Base classes, API commands, API clients, models
  testdata/                   JSON and typed test data
  tests/
    api/                      API feature files and step definitions
    ui/                       UI and accessibility feature files and step definitions
subscription-api/             Local sample API used by API features
docs/                         Framework documentation and AI conventions
browserstack.template.json    BrowserStack Accessibility template
```

## Step Definition Placement

| Location                                           | When to use                             |
| -------------------------------------------------- | --------------------------------------- |
| `cypress/tests/ui/<feature>.steps.ts`              | Steps used only in that one feature     |
| `cypress/tests/api/<feature>.steps.ts`             | Steps used only in that one API feature |
| `cypress/support/step_definitions/common.steps.ts` | Steps reused across 2+ features         |
| `cypress/support/step_definitions/hooks.ts`        | `Before` / `After` hooks                |

See [`docs/step-definitions.md`](docs/step-definitions.md) for details and examples.

## Run Tests

```bash
npm run cypress:open
npm run cypress:run
npm run cypress:run:smoke
npm run cypress:run:ui
npm run cypress:run:a11y
npm run api:test
```

`npm run api:test` starts the bundled subscription API on port `3100` and runs the `@api`
Cucumber suite after the service is available.

## BrowserStack Accessibility

Set credentials first:

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

Then run:

```bash
npm run browserstack:config
npm run browserstack:a11y
```

`browserstack.generated.json` is generated from `browserstack.template.json` and is
intentionally ignored by git.

## Cucumber Conventions

- Feature files live in `cypress/tests/ui` and `cypress/tests/api`.
- Step definitions are colocated with the matching feature as `*.steps.ts`.
- Steps shared across multiple features live in `cypress/support/step_definitions/common.steps.ts`.
- Use tags such as `@ui`, `@api`, `@smoke`, `@a11y`, `@products`, and `@subscriptions`.
- Run tag expressions with `cypress run --env tags="@smoke and not @wip"`.

## Page Object Model Conventions

Keep selectors in page objects, never in step definitions:

```typescript
class LoginPage extends BasePage {
  usernameInput = () => cy.get('[data-test="username"]');
  passwordInput = () => cy.get('[data-test="password"]');
  loginButton = () => cy.get('[data-test="login-button"]');
}

export default new LoginPage();
```

Step definitions call page objects and API clients only.

## AI Agent Support

This framework ships guidance files for all major AI coding agents:

| Agent                 | File                                        |
| --------------------- | ------------------------------------------- |
| Claude (Claude Code)  | `CLAUDE.md`                                 |
| Codex / OpenAI agents | `AGENTS.md`                                 |
| GitHub Copilot        | `.github/copilot-instructions.md`           |
| Cursor                | `.cursor/rules/framework.md`                |
| Windsurf              | `.windsurfRules`                            |
| OpenAI Codex skill    | `.codex/skills/cypress-bootstrap-cucumber/` |

All agent files reference [`docs/conventions.md`](docs/conventions.md) as the single source
of truth for framework conventions.

## Documentation

| File                                                                               | Contents                                                                                                    |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`Cypress-Framework-Development-Guide.md`](Cypress-Framework-Development-Guide.md) | Architecture rationale, folder structure, implementation patterns, scaffold behavior, and AI agent strategy |
| [`docs/conventions.md`](docs/conventions.md)                                       | Full framework conventions — canonical AI reference                                                         |
| [`docs/project-overview.md`](docs/project-overview.md)                             | Architecture overview                                                                                       |
| [`docs/page-object-model.md`](docs/page-object-model.md)                           | Page object standards                                                                                       |
| [`docs/step-definitions.md`](docs/step-definitions.md)                             | Colocated vs shared step placement                                                                          |
| [`docs/test-organization.md`](docs/test-organization.md)                           | Feature and tag organisation                                                                                |
| [`docs/api-testing.md`](docs/api-testing.md)                                       | API client patterns                                                                                         |
| [`docs/accessibility.md`](docs/accessibility.md)                                   | Accessibility testing setup                                                                                 |
| [`docs/configuration.md`](docs/configuration.md)                                   | Cypress, Cucumber, reporting, BrowserStack config                                                           |
