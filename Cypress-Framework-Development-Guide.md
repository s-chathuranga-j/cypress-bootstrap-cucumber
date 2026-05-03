# Cypress Bootstrap Cucumber Framework Development Guide

Strategic patterns and implementation techniques for enterprise-grade Cypress, Cucumber, and
AI-agent-ready test automation.

## Table of Contents

1. [Introduction](#introduction)
2. [Framework Architecture Philosophy](#framework-architecture-philosophy)
3. [Cucumber Specification Strategy](#cucumber-specification-strategy)
4. [Project Structure Strategy](#project-structure-strategy)
5. [Page Object Model Implementation Pattern](#page-object-model-implementation-pattern)
6. [API Testing Architecture](#api-testing-architecture)
7. [Configuration and Environment Management](#configuration-and-environment-management)
8. [Session Management and Authentication Strategies](#session-management-and-authentication-strategies)
9. [Test Data Management Approaches](#test-data-management-approaches)
10. [Reporting, Accessibility, and Quality Assurance](#reporting-accessibility-and-quality-assurance)
11. [Code Quality and Development Standards](#code-quality-and-development-standards)
12. [CI/CD and BrowserStack Integration Strategies](#cicd-and-browserstack-integration-strategies)
13. [npm Scaffold and Package Publishing Strategy](#npm-scaffold-and-package-publishing-strategy)
14. [AI-Driven Test Generation and Agent Architecture](#ai-driven-test-generation-and-agent-architecture)
15. [Framework Scalability and Maintenance](#framework-scalability-and-maintenance)
16. [Conclusion](#conclusion)

---

## Introduction

This guide presents the architectural patterns and implementation strategies behind the
`cypress-bootstrap-cucumber` framework. It is based on the same enterprise automation ideas as
the earlier Cypress framework guide, but it is rewritten for the current project: an installable
npm scaffold built with Cypress, Cucumber/Gherkin, TypeScript, Page Object Model conventions,
API clients, accessibility testing, BrowserStack support, reporting, and centralized AI agent
guidance.

The framework is designed for teams that need more than isolated Cypress examples. It provides
a complete project structure, execution model, coding conventions, setup automation, and agent
instructions so human engineers and AI coding agents can extend the framework without drifting
from its standards.

### Strategic Framework Benefits

**Architectural scalability**: A layered design supports growth from a small starter suite to a
larger UI, API, accessibility, and cloud execution framework.

**Readable behavior**: Cucumber feature files describe user and API behavior in business terms
while TypeScript step definitions keep implementation details controlled.

**Maintainability**: Page objects centralize UI selectors, API clients centralize service
interactions, and shared steps prevent duplicate Cucumber definitions.

**Quality**: TypeScript, Prettier, Husky, lint-staged, Cucumber reports, Mochawesome, JUnit,
and accessibility checks create multiple feedback loops.

**Professional delivery**: npm scaffolding, BrowserStack configuration, GitHub Actions, and
agent-ready guidance make the framework usable as a reusable package rather than a one-off test
repository.

---

## Framework Architecture Philosophy

### Layered Architecture Strategy

The framework uses a layered architecture with explicit responsibility boundaries:

```text
+---------------------------------------------------+
| Behavior Specification Layer                      |
| Gherkin .feature files with tags and scenarios    |
+---------------------------------------------------+
| Step Definition Layer                             |
| Thin TypeScript orchestration and assertions      |
+---------------------------------------------------+
| Page Object and API Client Layer                  |
| UI selectors, page behavior, typed service calls  |
+---------------------------------------------------+
| Base Classes, Commands, Models, and Test Data     |
| Shared Cypress commands, BasePage, ApiBase, data  |
+---------------------------------------------------+
| Configuration, Reporting, BrowserStack, Agents    |
| Runtime wiring, CI, package setup, AI guidance    |
+---------------------------------------------------+
```

The most important design decision is that behavior and implementation remain separate.
Features describe what matters. Step definitions translate that language into test actions.
Page objects and API clients own the mechanics.

### Architectural Principles

**Separation of concerns**: Feature files contain behavior, step definitions orchestrate, page
objects contain selectors and UI behavior, API clients contain service interactions, and
configuration files wire execution. This creates predictable patterns for both engineers and AI
agents.

**Cucumber-first test organization**: This framework does not use `.cy.ts` or `.spec.ts` tests.
All executable tests are `.feature` files under `cypress/tests`, backed by TypeScript
`*.steps.ts` files.

**Page Object Model discipline**: Selectors live in `cypress/pages`, not in feature files or
step definitions. Page objects extend `BasePage`, use arrow-function locators, and export
singletons.

**Type safety first**: TypeScript is used across step definitions, page objects, API clients,
request models, response models, custom commands, and configuration.

**Deterministic execution**: Tests should rely on Cypress retryability, assertions, API setup,
custom commands, aliases, and session helpers instead of arbitrary waits or shared mutable
state.

**Agent-aware design**: The project ships centralized AI guidance and thin adapters for Codex,
Claude, GitHub Copilot, Cursor, Windsurf, and generic agents. The architecture is explicit so
generated code has a smaller chance of violating framework standards.

---

## Cucumber Specification Strategy

### Why Cucumber Is Used

Cucumber adds a behavior specification layer to Cypress. The goal is not to add ceremony. The
goal is to make important workflows readable before someone opens a TypeScript file.

A good feature file should answer:

- What behavior is being validated?
- What state does the user or API need?
- What action happens?
- What result should be true?

A feature file should not expose:

- CSS selectors
- Cypress commands
- API payload construction
- Authentication token mechanics
- BrowserStack details
- Low-level setup and cleanup logic

### Feature File Pattern

```gherkin
@ui @smoke
Feature: Login

  Scenario: Standard user can log in
    Given I open the login page
    When I login with valid credentials
    Then the inventory page should be displayed
```

The scenario is readable. The implementation lives in TypeScript. The selectors live in page
objects.

### Step Definition Placement Strategy

The framework uses colocated step definitions by default:

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

Global Cucumber hooks live in:

```text
cypress/support/step_definitions/hooks.ts
```

The rule is:

1. Start a new step in the colocated `*.steps.ts` file.
2. Move it to `common.steps.ts` only when two or more features need the same step text.
3. Never define the same step text more than once.

This pattern preserves discoverability without creating a global step library full of vague
definitions.

### Tag-Based Execution

Tags are the framework's suite selection mechanism:

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

Native Cucumber tag expressions are passed through Cypress environment values:

```bash
cypress run --env tags=@smoke
cypress run --env tags="@api and @smoke"
cypress run --env tags="@ui and not @wip"
```

The framework intentionally uses the maintained Cucumber preprocessor's native tag filtering
instead of adding a separate grep plugin.

---

## Project Structure Strategy

### Organizational Philosophy

The folder structure optimizes for discoverability, maintainability, and repeatable scaffolding.
Every major concern has a clear home so developers and AI agents can find the correct file
before making changes.

### Core Structure Patterns

```text
cypress/
  pages/                       Page Object Model classes
  support/
    commands.ts                Custom Cypress commands
    e2e.ts                     Cypress support entrypoint
    Enums.ts                   Shared enums and constants
    step_definitions/
      common.steps.ts          Shared Cucumber steps
      hooks.ts                 Global Cucumber hooks
  testbase/
    BasePage.ts                Base class for page objects
    ApiBase.ts                 API command definitions
    apiClients/                Typed API clients
    apiEndpoints.ts            Endpoint constants
    modals/
      requests/                Request model types
      responses/               Response model types
  testdata/
    testdata.json              Shared static data
    dataObjects/               Typed sample data objects
  tests/
    api/                       API feature files and step definitions
    ui/                        UI and accessibility feature files and steps
```

The root also contains the package and enablement layers:

```text
bin/                           CLI executable
scripts/                       Setup and BrowserStack config scripts
subscription-api/              Local sample API
docs/                          Framework documentation
.ai/                           Central AI agent guidance
.codex/                        Codex skill adapter
.claude/                       Claude skill adapter
.github/                       Copilot guidance and GitHub Actions
.cursor/                       Cursor rule adapter
.windsurfRules                 Windsurf rule adapter
AGENTS.md                      Generic agent entrypoint
CLAUDE.md                      Claude entrypoint
```

### Strategic Organizational Benefits

**Discoverability**: A developer can infer where to add a feature, a step definition, a page
object, an API client, or an agent instruction.

**Maintainability**: Changing a selector should affect a page object. Changing an endpoint
should affect an API client or endpoint constant. Changing shared behavior should affect common
steps or support utilities.

**Scalability**: The same structure supports additional UI domains, API resources, accessibility
coverage, BrowserStack suites, and AI guidance without changing the framework's mental model.

**Scaffoldability**: The npm setup script can copy this structure into a consumer project
idempotently because the project has stable boundaries.

---

## Page Object Model Implementation Pattern

### Strategic Page Object Philosophy

The framework uses a disciplined Page Object Model. Page objects provide a stable UI contract
for step definitions. They own selectors and page-level behavior, while Cucumber steps keep the
business flow readable.

### Core Implementation Principles

**Element-centric design**: Selectors are defined as arrow-function locators on page classes.

**Selective method creation**: Complex multi-action operations can become page methods. Simple
actions can be expressed in step definitions by calling page object locators and methods. Raw
selectors still stay inside page objects.

**Base page inheritance**: Common cross-page behavior belongs in `BasePage`.

**Singleton exports**: Page objects export one shared instance.

### Base Page Foundation

```typescript
class BasePage {
  loadingSpinner = () => cy.get('[role="progressbar"]');
  modalDialog = () => cy.get('div[role="dialog"]');

  public waitForSpinners() {
    this.loadingSpinner().should('not.exist');
  }

  public checkPageURL(url: string) {
    cy.url().should('include', url);
  }
}
```

### Page Object Structure

```typescript
import { BasePage } from '../testbase/BasePage';
import TestData from '../testdata/testdata.json';

class LoginPage extends BasePage {
  usernameInput = () => cy.get('[data-test="username"]');
  passwordInput = () => cy.get('[data-test="password"]');
  loginButton = () => cy.get('[data-test="login-button"]');
  errorMessage = () => cy.get('[data-test="error"]');

  public createSession() {
    cy.session('SwagLabsSession', () => {
      cy.visit('/');
      this.usernameInput().type(TestData.user_credentials.valid_username);
      this.passwordInput().type(TestData.user_credentials.password);
      this.loginButton().click();
      cy.url().should('include', '/inventory.html');
    });
  }
}

export default new LoginPage();
```

### Critical Implementation Patterns

**Arrow-function locators**: Cypress commands are queued and executed later. An arrow-function
locator returns a fresh Cypress chainable at the time the step uses it. This avoids stale
element references and prevents commands from running during class construction or module import.

**Singleton exports**: `export default new LoginPage()` gives the framework one stable page
object instance. The singleton should not store mutable test data. Cypress state should stay in
Cypress commands, aliases, environment values, or tasks.

**Selector isolation**: Step definitions must not use `cy.get('[selector]')` or raw CSS
selectors. If a selector changes, the page object is the single update point.

**AI generation benefits**: Page objects with consistent arrow-function locators and singleton
exports create a predictable grammar. AI agents can identify the correct place for selectors and
are less likely to mix UI implementation details into step definitions.

### Step Definition Usage Pattern

```typescript
When('I login with valid credentials', () => {
  LoginPage.usernameInput().type(TestData.user_credentials.valid_username);
  LoginPage.passwordInput().type(TestData.user_credentials.password);
  LoginPage.loginButton().click();
});
```

The step contains orchestration. The selectors remain inside `LoginPage`.

---

## API Testing Architecture

### Strategic API Testing Approach

The framework implements a layered API testing strategy that keeps Gherkin behavior readable
while preserving type safety and reusable service abstractions.

### Architecture Layers

**Feature layer**: API behavior is described in `.feature` files under `cypress/tests/api`.

**Step definition layer**: TypeScript steps orchestrate API clients, request models, response
models, and assertions.

**Custom command layer**: `ApiBase.ts` defines reusable Cypress commands such as
`cy.sendApiRequestDef`.

**API client layer**: Resource-specific clients encapsulate common endpoint operations.

**Model layer**: Request and response types document API contracts and improve TypeScript
support.

**Endpoint layer**: `apiEndpoints.ts` centralizes service paths and parameterized endpoints.

### Custom Command Pattern

```typescript
Cypress.Commands.add(
  'sendApiRequestDef',
  (
    endpoint: string,
    method: string,
    token: string | null,
    expectedStatus: number | number[],
    body: any = undefined
  ) => {
    cy.request({
      method,
      url: endpoint,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    }).then(response => {
      if (Array.isArray(expectedStatus)) {
        expect(response.status).to.be.oneOf(expectedStatus);
      } else {
        expect(response.status).to.eq(expectedStatus);
      }
      cy.wrap(response.body, { log: false }).as('responseBody');
    });
  }
);
```

### Typed Client Pattern

```typescript
class ProductTypesClient {
  public getAllProductTypes() {
    return cy.sendApiRequestDef(apiEndpoints.productTypes, HttpMethod.GET, null, StatusCodes.OK);
  }
}

export default new ProductTypesClient();
```

### Request and Response Modeling

```typescript
export namespace SubscriptionRequests {
  export interface CreateSubscriptionRequest {
    productId: string;
    customerId: string;
    startDate: string;
    status: string;
  }
}
```

### Strategic Advantages

**Maintainability**: Endpoint and request changes are handled in one place.

**Reliability**: Expected status validation and response typing reduce accidental false
positives.

**Readability**: Step definitions describe API behavior instead of raw HTTP plumbing.

**Scalability**: Adding a new API resource follows the same client, model, endpoint, feature,
and step pattern.

---

## Configuration and Environment Management

### Multi-Environment Strategy

The framework uses layered configuration so one codebase can run locally, in CI, and on
BrowserStack without hardcoding environment-specific values.

### Configuration Architecture

**Base configuration**: `cypress.config.ts` defines timeouts, viewport, report settings,
Cucumber preprocessing, support folders, and default URLs.

**Cucumber configuration**: `.cypress-cucumber-preprocessorrc.json` defines step definition
resolution, filtered spec behavior, Cucumber JSON, Cucumber HTML, messages, screenshots, and
video attachment settings.

**Reporter configuration**: `reporter-config.ts` configures Mochawesome and JUnit outputs.

**BrowserStack configuration**: `browserstack.template.json` is committed and
`browserstack.generated.json` is generated at runtime.

### Environment Variable Pattern

```typescript
baseUrl: process.env.CYPRESS_BASE_URL || 'https://www.saucedemo.com/';
env: {
  authUrl: process.env.CYPRESS_AUTH_URL || 'https://saucedemo.com/connect/token',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3100',
  swaggerSchemaUrl:
    process.env.SWAGGER_SCHEMA_URL ||
    `${process.env.API_BASE_URL || 'http://localhost:3100'}/swagger.json`,
}
```

### Security-First Configuration

Committed examples:

```text
cypress.env.example.json
browserstack.template.json
```

Ignored generated or sensitive files:

```text
cypress.env.json
browserstack.generated.json
.env
cypress/reports/
cypress/screenshots/
cypress/videos/
cypress/accessibility/
```

### Custom Runtime Tasks

`cypress.config.ts` defines tasks for cross-command runtime values:

```typescript
fixedOn('task', {
  setToken: (newToken: string) => {
    token = newToken;
    return null;
  },
  getToken: () => token,
  setTempData: (newTempData: unknown) => {
    tempData = newTempData;
    return null;
  },
  getTempData: () => tempData,
});
```

These tasks are useful for runtime coordination, but they should not become a replacement for
deterministic setup or well-scoped test data.

---

## Session Management and Authentication Strategies

### Strategic Session Management Approach

The framework supports efficient authentication through Cypress session caching and token
helpers while keeping tests isolated and repeatable.

### UI Session Pattern

`LoginPage.createSession()` uses `cy.session` to cache the Sauce Demo login flow:

```typescript
public createSession() {
  cy.clearAllSessionStorage();
  cy.clearAllLocalStorage();
  cy.clearAllCookies();

  cy.session('SwagLabsSession', () => {
    cy.visit('/');
    this.usernameInput().type(TestData.user_credentials.valid_username);
    this.passwordInput().type(TestData.user_credentials.password);
    this.loginButton().click();
    cy.url().should('include', '/inventory.html');
  });
}
```

This avoids repeating expensive login flows for every scenario that simply needs an authenticated
state. Login scenarios still exercise the UI login behavior directly.

### API Token Strategy

The framework includes `cy.getAccessToken()` for client credential flows. Credentials are read
from Cypress environment variables:

```typescript
const clientId = Cypress.env('clientId');
const clientSecret = Cypress.env('clientSecret');
```

The command stores the token in `Cypress.env('bearerToken')` after validating the auth response.

### Strategic Advantages

**Performance**: Session caching reduces repeated UI setup.

**Reliability**: Authentication setup is centralized and validated.

**Security**: Credentials come from environment configuration, not source code.

**Cucumber compatibility**: Shared authenticated preconditions can be implemented as common
steps, while actual login behavior remains covered by login features.

---

## Test Data Management Approaches

### Strategic Data Management Philosophy

The framework uses a hybrid data strategy: static reference data for stable scenarios and typed
data objects or utility generation for API create/update flows.

### Data Architecture Patterns

**Static reference data**:

```text
cypress/testdata/testdata.json
```

This contains stable values such as Sauce Demo users and shared UI data.

**Typed data objects**:

```text
cypress/testdata/dataObjects/Customer.ts
cypress/testdata/dataObjects/Product.ts
cypress/testdata/dataObjects/ProductTypes.ts
cypress/testdata/dataObjects/Subscription.ts
```

These provide reusable sample payload fragments for API scenarios.

**Utility generation**:

```text
cypress/testbase/Utils.ts
src/index.js
```

Utilities can generate unique strings, numbers, emails, GUIDs, and dates when a scenario needs
fresh data.

### Strategic Benefits

**Test independence**: API tests can create the product, customer, and subscription data they
need instead of depending on pre-existing records.

**Readability**: Feature files remain behavior-focused and avoid payload noise.

**Maintainability**: Shared data changes happen in one location.

**Parallel readiness**: Unique data generation reduces cross-test collisions.

---

## Reporting, Accessibility, and Quality Assurance

### Multi-Format Reporting Strategy

The framework produces reports for different audiences:

| Output          | Purpose                                |
| --------------- | -------------------------------------- |
| Mochawesome     | Human-readable HTML/JSON reports       |
| JUnit XML       | CI/CD test result ingestion            |
| Cucumber JSON   | BDD report processing and integrations |
| Cucumber HTML   | Gherkin-oriented execution visibility  |
| Messages NDJSON | Cucumber message stream output         |
| Screenshots     | Failure evidence                       |
| Videos          | Execution debugging                    |

Reporting is wired through:

```text
reporter-config.ts
cypress.config.ts
.cypress-cucumber-preprocessorrc.json
```

### Accessibility Strategy

Accessibility testing is integrated into the framework through:

- `axe-core`
- `cypress-axe`
- `wick-a11y`
- BrowserStack accessibility automation

Local accessibility scenarios use the `@a11y` tag:

```bash
npm run cypress:run:a11y
```

The shared scan step injects axe and performs the accessibility check. Navigation should reuse
normal UI steps so accessibility coverage stays aligned with real user behavior.

### BrowserStack Accessibility Strategy

BrowserStack execution uses:

```text
browserstack.template.json
scripts/generate-browserstack-config.js
browserstack.generated.json
.github/workflows/browserstack-accessibility.yml
```

Required secrets or environment variables:

```text
BROWSERSTACK_USERNAME
BROWSERSTACK_ACCESS_KEY
```

The generated config is intentionally ignored because it contains resolved credential values.

### Strategic Reporting Benefits

**Stakeholder alignment**: Human-readable reports help QA, engineering, and management consume
results.

**Pipeline integration**: JUnit XML supports CI test reporting.

**Compliance support**: Accessibility reports and BrowserStack runs support proactive quality
checks.

**Debuggability**: Screenshots, videos, and Cucumber output make failures easier to inspect.

---

## Code Quality and Development Standards

### Automated Quality Enforcement Strategy

The framework uses TypeScript, Prettier, Husky, and lint-staged to keep code consistent before
it reaches CI.

### Quality Architecture

**TypeScript**: `npm run typecheck` validates framework TypeScript without emitting files.

**Prettier**: `npm run format` and `npm run format:check` maintain consistent formatting.

**Husky and lint-staged**: Pre-commit hooks format staged files automatically.

**Package validation**: `npm pack --dry-run --ignore-scripts` verifies the publishable scaffold
contents without leaving package tarballs behind.

### Development Standards

Framework contributors should:

- Keep feature files readable and business-focused.
- Keep step definitions thin.
- Keep raw selectors inside page objects.
- Keep API request details inside clients and custom commands.
- Use TypeScript request and response types.
- Avoid arbitrary waits.
- Avoid `async`/`await` around Cypress commands.
- Avoid storing Cypress chainable results in outer variables.
- Run the smallest meaningful verification command after changes.

### Strategic Quality Benefits

**Consistency**: Automated formatting reduces style drift.

**Reliability**: Type checking catches many failures before runtime.

**Reviewability**: Thin steps, typed clients, and page objects make changes easier to evaluate.

**Agent safety**: The same rules guide AI-generated changes through `.ai` and adapter files.

---

## CI/CD and BrowserStack Integration Strategies

### Pipeline-Ready Architecture

The framework is designed for CI execution through environment variables, tag filtering, report
artifacts, and BrowserStack configuration generation.

### GitHub Actions Accessibility Workflow

The repository includes:

```text
.github/workflows/browserstack-accessibility.yml
```

The workflow:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs dependencies with `npm ci`.
4. Runs `npm run typecheck`.
5. Generates BrowserStack config.
6. Runs the BrowserStack accessibility suite.

### Suite Selection Strategy

Pipeline jobs can choose suites by npm script:

```bash
npm run cypress:run:smoke
npm run cypress:run:ui
npm run cypress:run:api
npm run cypress:run:a11y
```

or by Cucumber tag expression:

```bash
cypress run --env tags="@api and @smoke"
```

### Strategic CI/CD Advantages

**Speed**: Smoke and tag-filtered suites provide targeted confidence.

**Reliability**: API suites start the local `subscription-api` before running.

**Security**: BrowserStack credentials are injected through secrets.

**Traceability**: Reports and artifacts support debugging and compliance needs.

---

## npm Scaffold and Package Publishing Strategy

### Scaffold Delivery Model

The framework is packaged as:

```text
cypress-bootstrap-cucumber
```

It exposes:

```text
npx cypress-bootstrap-cucumber setup
npx cypress-bootstrap-cucumber-setup
```

### Setup Script Strategy

`scripts/setup.js` is responsible for copying the framework into a consumer project.

It:

- Uses `INIT_CWD` during npm install so files go to the consumer project root.
- Creates expected directories.
- Copies missing files without overwriting user files.
- Copies `.ai`, `.codex`, `.claude`, `.cursor`, and `.github` recursively.
- Copies `gitignore` to `.gitignore`.
- Creates `cypress.env.json` from `cypress.env.example.json` if missing.
- Merges framework scripts into consumer `package.json`.
- Merges framework dependencies into consumer `devDependencies`.
- Skips nested dependency installation during npm `postinstall`.

### Published Package Contents

`package.json` intentionally publishes the framework code and agent guidance:

```text
cypress/
docs/
scripts/
subscription-api/
bin/
src/
.ai/
.codex/
.claude/
.cursor/
.github/
.windsurfRules
AGENTS.md
CLAUDE.md
Cypress-Framework-Development-Guide.md
```

This ensures the installed package carries both implementation files and the conventions needed
to maintain them.

### Publishing Readiness

Before publishing a new package version:

```bash
npm run typecheck
npm pack --dry-run --ignore-scripts
npm publish --access public
```

If npm two-factor authentication is enabled, publishing requires an OTP:

```bash
npm publish --access public --otp=<code>
```

---

## AI-Driven Test Generation and Agent Architecture

### Framework Design for AI Agent Compatibility

The framework is intentionally structured to reduce AI hallucination. It gives agents a clear
map of where each kind of code belongs.

### Centralized Agent Guidance

The source of truth is:

```text
.ai/
  README.md
  agent-guidelines.md
  skills/cypress-bootstrap-cucumber/SKILL.md
  skills/cypress-bootstrap-cucumber/references/
    authoring.md
    explaining-and-reviewing.md
```

Agent-specific files are adapters:

| Agent                 | Adapter                                                       |
| --------------------- | ------------------------------------------------------------- |
| Generic agents        | `AGENTS.md`                                                   |
| Claude                | `CLAUDE.md`                                                   |
| Claude skills         | `.claude/skills/cypress-bootstrap-cucumber/SKILL.md`          |
| Codex skills          | `.codex/skills/cypress-bootstrap-cucumber/SKILL.md`           |
| OpenAI agent metadata | `.codex/skills/cypress-bootstrap-cucumber/agents/openai.yaml` |
| GitHub Copilot        | `.github/copilot-instructions.md`                             |
| Copilot prompts       | `.github/prompts/cypress-bootstrap-cucumber.prompt.md`        |
| Cursor                | `.cursor/rules/framework.md`                                  |
| Windsurf              | `.windsurfRules`                                              |

The adapters point back to `.ai` so the rules stay centralized.

### Why This Reduces AI Hallucination

**Clear context boundaries**:

- Features contain behavior.
- Steps orchestrate behavior.
- Page objects contain selectors and UI behavior.
- API clients contain service behavior.
- Models contain request and response shapes.
- Configuration files wire execution.
- Agent files explain how future tools should work in the repository.

**Predictable patterns**:

- `.feature` plus colocated `*.steps.ts`
- Singleton page object exports
- Arrow-function locators
- Shared steps only after reuse
- Typed API clients
- Native Cucumber tag expressions

**Reviewable generated code**: If an agent violates a boundary, reviewers can identify the
problem quickly: selectors in steps, duplicate step definitions, raw API requests in steps, or
new `.cy.ts` files are immediate red flags.

### Implementation Strategy for AI Tools

When an AI agent changes this repository, it should:

1. Read `.ai/agent-guidelines.md`.
2. Read `.ai/skills/cypress-bootstrap-cucumber/SKILL.md`.
3. Load only the relevant reference file.
4. Inspect nearby features, steps, page objects, API clients, and docs.
5. Make the smallest change that follows the framework pattern.
6. Run the smallest meaningful verification command.

---

## Framework Scalability and Maintenance

### Scalability Architecture Principles

The framework scales by adding new domains without changing the core architecture:

- New UI behavior adds `.feature`, `*.steps.ts`, and page object updates.
- New API resources add feature files, step files, clients, endpoints, models, and data objects.
- New accessibility coverage reuses existing UI steps and adds `@a11y` scenarios.
- New agent support adds a thin adapter pointing to `.ai`.
- New cloud execution paths add templates, generation scripts, and workflow jobs.

### Long-Term Maintenance Strategies

**Modular component design**: Page objects, API clients, commands, models, docs, and agent files
can evolve independently.

**Centralized conventions**: `docs/conventions.md`, `docs/step-definitions.md`, and `.ai`
prevent different teams or tools from inventing competing standards.

**Version management**: Package versions should change intentionally when scaffold behavior,
published files, or dependency expectations change.

**Idempotent setup**: Consumer projects can rerun setup without losing local changes because
files are copied only when missing.

### Strategic Framework Benefits

**Team productivity**: Predictable patterns reduce onboarding time.

**Code quality**: TypeScript, formatting, and framework boundaries reduce technical debt.

**Maintenance efficiency**: Centralized selectors, endpoints, and guidance reduce update scope.

**Enterprise readiness**: Reporting, BrowserStack, CI, and package delivery support professional
test automation workflows.

---

## Conclusion

This framework applies proven Cypress automation architecture to a Cucumber-based, npm
scaffolded, AI-agent-ready project.

### Strategic Implementation Approach

**Foundation first**: The project starts with TypeScript, Cucumber configuration, Page Object
Model conventions, API clients, reports, and setup automation.

**Pattern adoption**: Contributors add behavior through feature files, step definitions, page
objects, API clients, and models instead of inventing new layouts.

**Quality integration**: Formatting, type checking, reports, accessibility scans, and CI
workflow support are part of the framework rather than optional extras.

**Agent readiness**: Centralized AI guidance allows future agents to extend the framework with
the same conventions as human contributors.

### Long-Term Success Considerations

The value of this framework is not only that it can run tests. Its value is that it encodes a
repeatable engineering model:

- Feature files describe behavior.
- Step definitions orchestrate behavior.
- Page objects implement UI interactions.
- API clients implement service interactions.
- Models and test data define contracts and inputs.
- Configuration files wire runtime behavior.
- npm setup scripts make the architecture reusable.
- Agent files preserve the conventions for future contributors.

When these boundaries stay intact, the framework remains readable, scalable, and safe to evolve
as the application, team, and automation strategy grow.
