# Framework Conventions

This is the single canonical reference for all AI coding agents working in this repository.
`CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`, `.cursor/rules/framework.md`,
`.windsurfRules`, and the Codex skill all link here for the full ruleset.

---

## Directory Map

```
cypress/
  pages/                       Page Object Model classes (singletons)
  support/
    commands.ts                Custom Cypress commands
    e2e.ts                     Support entry point
    Enums.ts                   Shared enumerations
    step_definitions/
      hooks.ts                 Global Before/After hooks
      common.steps.ts          Steps shared across 2+ features
  testbase/
    BasePage.ts                Base class for all page objects
    ApiBase.ts                 Base helper for API requests
    apiClients/                Per-resource typed API clients
    apiEndpoints.ts            Endpoint URL constants
    modals/
      requests/                Request payload type shapes
      responses/               Response payload type shapes
  testdata/
    testdata.json              Shared test data
    dataObjects/               Typed data object classes
  tests/
    api/                       API .feature + .steps.ts pairs
    ui/                        UI + accessibility .feature + .steps.ts pairs
docs/                          Framework documentation (this folder)
scripts/                       Setup and BrowserStack config scripts
subscription-api/              Bundled local API used by API tests
```

---

## Page Object Model

- All page objects **extend `BasePage`** from `cypress/testbase/BasePage.ts`.
- Every locator is an **arrow function** returning a Cypress chainable:
  ```typescript
  submitButton = () => cy.get('[data-test="submit"]');
  ```
- Grouped locators use a **nested object** of arrow functions:
  ```typescript
  sideMenu = {
    overlay:     () => cy.get('.bm-menu'),
    closeButton: () => cy.get('#react-burger-cross-btn'),
  };
  ```
- Each page class **exports a singleton**:
  ```typescript
  export default new LoginPage();
  ```
- **Never** put `cy.get(...)`, `cy.contains(...)`, or any raw selector in a step definition.
  Always delegate to a page object method.

---

## Cucumber Conventions

- Use `@badeball/cypress-cucumber-preprocessor` for `Given`, `When`, `Then`, `Before`,
  `After`, and `DataTable`.
- Feature files live in `cypress/tests/ui/` or `cypress/tests/api/`.
- Step definitions for a single feature are **colocated** — same folder, same base name:
  ```
  cypress/tests/ui/login.feature
  cypress/tests/ui/login.steps.ts
  ```
- Steps **used in 2 or more features** live in
  `cypress/support/step_definitions/common.steps.ts`.
- Global hooks (`Before`, `After`) live in
  `cypress/support/step_definitions/hooks.ts`.
- Gherkin should read naturally in plain English.
  Steps must be thin — they orchestrate page objects and API clients, not contain logic.

---

## Tags

| Tag | Purpose |
|-----|---------|
| `@ui` | UI browser tests |
| `@api` | API tests |
| `@smoke` | Fast confidence subset — runs in CI on every push |
| `@a11y` | Accessibility tests |
| `@wip` | Work in progress — excluded from CI |
| `@products` | Domain tag for product scenarios |
| `@customers` | Domain tag for customer scenarios |
| `@subscriptions` | Domain tag for subscription scenarios |

Run filtered suites with native Cucumber tag expressions:

```bash
cypress run --env tags=@smoke
cypress run --env tags="@api and @smoke"
cypress run --env tags="@ui and not @wip"
```

---

## Adding a New UI Feature

1. Create `cypress/tests/ui/<feature-name>.feature` — add `@ui` (and `@smoke` if applicable).
2. Create `cypress/tests/ui/<feature-name>.steps.ts` importing from
   `@badeball/cypress-cucumber-preprocessor`.
3. Create or update a page object in `cypress/pages/<PageName>.ts`.
4. If a step is reused by another feature, move it to
   `cypress/support/step_definitions/common.steps.ts`.
5. Run `npm run typecheck`.

## Adding a New API Feature

1. Create `cypress/tests/api/<resource>.feature` — add `@api`.
2. Create `cypress/tests/api/<resource>.steps.ts`.
3. Add a typed client to `cypress/testbase/apiClients/<Resource>Client.ts`.
4. Add request/response models to `cypress/testbase/modals/`.
5. Use `cy.sendApiRequestDef` or the typed client — never raw `cy.request(...)` in steps.
6. Run `npm run api:test`.

---

## Accessibility Testing

- `cypress-axe` (`cy.injectAxe` + `cy.checkAccessibility`) and `wick-a11y` are both wired.
- `cy.injectAxe()` is called **inside** the shared scan step in `accessibility.steps.ts`.
  Callers do not inject manually.
- Tag accessibility scenarios `@a11y`.
- Run locally: `npm run cypress:run:a11y`.
- Run on BrowserStack: `npm run browserstack:a11y` (requires credentials in env).

---

## BrowserStack

- Template: `browserstack.template.json` — committed, uses `${BROWSERSTACK_USERNAME}` and
  `${BROWSERSTACK_ACCESS_KEY}` as placeholders.
- Generated: `browserstack.generated.json` — gitignored, produced at runtime.
- **Never** commit real credentials.

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
npm run browserstack:config   # writes browserstack.generated.json
npm run browserstack:a11y     # runs accessibility suite on BrowserStack
```

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `CYPRESS_BASE_URL` | Base URL for UI tests |
| `CYPRESS_AUTH_URL` | Auth endpoint |
| `API_BASE_URL` | Base URL for API tests |
| `SWAGGER_SCHEMA_URL` | Swagger schema URL for response validation |
| `BROWSERSTACK_USERNAME` | BrowserStack username |
| `BROWSERSTACK_ACCESS_KEY` | BrowserStack access key |

Copy `cypress.env.example.json` → `cypress.env.json` locally and fill in values.
**Never commit `cypress.env.json` or `browserstack.generated.json`.**

---

## Verification Commands

```bash
npm run typecheck           # TypeScript check — run after every .ts change
npm run format:check        # Prettier formatting check
npm run cypress:open        # Open Cypress interactive runner
npm run cypress:run         # Full run (UI + API smoke)
npm run cypress:run:smoke   # @smoke suite only
npm run cypress:run:ui      # @ui suite
npm run cypress:run:api     # @api suite (starts subscription-api on port 3100)
npm run cypress:run:a11y    # @a11y suite
npm run api:test            # Alias for cypress:run:api
npm run browserstack:a11y   # Accessibility run on BrowserStack
```
