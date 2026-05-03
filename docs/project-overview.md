# Project Overview

The framework is an npm scaffold for Cypress + Cucumber automation. It keeps test intent in
Gherkin feature files and implementation in TypeScript step definitions.

## Directory Map

```text
cypress/
  pages/                      Page Object Model classes
  support/
    commands.ts               Custom Cypress commands
    e2e.ts                    Support entry point
    Enums.ts                  Shared enumerations
    step_definitions/
      hooks.ts                Global Before/After hooks
      common.steps.ts         Steps shared across 2+ features
  testbase/
    BasePage.ts               Base class for all page objects
    ApiBase.ts                Base API request helper
    apiClients/               Per-resource typed API clients
    apiEndpoints.ts           Endpoint URL constants
    modals/
      requests/               Request payload type shapes
      responses/              Response payload type shapes
  testdata/
    testdata.json             Shared test data
    dataObjects/              Typed data object classes
  tests/
    api/                      API .feature + .steps.ts pairs
    ui/                       UI + accessibility .feature + .steps.ts pairs
docs/                         Framework documentation
scripts/                      Setup and BrowserStack config scripts
subscription-api/             Bundled local API used by API tests
```

## Core Standards

- Page objects extend `BasePage`.
- Locators are arrow functions returning Cypress chainables.
- Page objects are exported as singleton instances.
- Step definitions are colocated with their feature file.
- Steps shared across 2+ features live in `cypress/support/step_definitions/common.steps.ts`.
- Step definitions call page objects and API clients — never raw selectors or endpoints.
- Cucumber tags drive suite selection.

## AI Agent Files

All AI agent configuration files reference [`docs/conventions.md`](conventions.md) as the
single source of truth:

| Agent | File |
|-------|------|
| Claude | `CLAUDE.md` |
| Codex / OpenAI | `AGENTS.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Cursor | `.cursor/rules/framework.md` |
| Windsurf | `.windsurfRules` |
| Codex skill | `.codex/skills/cypress-bootstrap-cucumber/` |
