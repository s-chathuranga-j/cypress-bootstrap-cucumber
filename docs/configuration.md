# Configuration

## Cypress

`cypress.config.ts` sets:

- `specPattern: 'cypress/tests/**/*.feature'`
- TypeScript feature bundling through Esbuild
- Cucumber preprocessing through `@badeball/cypress-cucumber-preprocessor`
- Mochawesome and JUnit reporters
- `wick-a11y` and BrowserStack accessibility plugin hooks

## Cucumber

`.cypress-cucumber-preprocessorrc.json` defines step resolution:

```json
[
  "cypress/tests/[filepath].steps.ts",
  "cypress/tests/[filepath]/steps.ts",
  "cypress/support/step_definitions/**/*.ts"
]
```

It also enables JSON, HTML, and message output under `cypress/reports/cucumber`.

## Environment

Use `cypress.env.example.json` as a template for local `cypress.env.json`.

Common environment variables:

- `CYPRESS_BASE_URL`
- `API_BASE_URL`
- `SWAGGER_SCHEMA_URL`
- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`

## BrowserStack

Generate `browserstack.generated.json` from `browserstack.template.json`:

```bash
npm run browserstack:config
```

The template intentionally omits a `cypress_version` pin so BrowserStack can infer the version from the package.
