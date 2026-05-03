# Accessibility Testing

## Libraries

| Library | Role |
|---------|------|
| `axe-core` | Rule engine |
| `cypress-axe` | `cy.injectAxe()` and `cy.checkAccessibility()` commands |
| `wick-a11y` | Additional accessibility task helpers registered in `cypress.config.ts` |

## How It Works

1. Navigate to a page (using shared steps from `common.steps.ts`).
2. Call `When('I scan the current page for accessibility issues')` — defined in
   `cypress/tests/ui/accessibility.steps.ts`.
3. The scan step calls `cy.injectAxe()` then `cy.checkAccessibility()` internally.

Callers do not call `cy.injectAxe()` directly. It is always called right before each scan,
which makes scans safe to run multiple times in one scenario (e.g. before and after a form
submission).

## Default axe Configuration

```typescript
const a11yOptions = {
  runOnly: ['wcag2a', 'wcag2aa'],
  includedImpacts: [],
};
```

Adjust `runOnly` or `includedImpacts` in `accessibility.steps.ts` to tighten or loosen the rules.

## Tags

Tag accessibility scenarios with both `@ui` and `@a11y`:

```gherkin
@ui @a11y
Feature: Accessibility
  @smoke
  Scenario: Scan the login page
    Given I open the login page
    When I scan the current page for accessibility issues
```

Run the accessibility suite:

```bash
npm run cypress:run:a11y
```

## BrowserStack Accessibility

For cross-browser accessibility runs via BrowserStack:

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
npm run browserstack:a11y
```

The GitHub Actions workflow `.github/workflows/browserstack-accessibility.yml` runs this
automatically when credentials are available.

## Adding a New Accessibility Scenario

1. Add a scenario to `cypress/tests/ui/accessibility.feature` with `@a11y`.
2. Use shared navigation steps from `common.steps.ts` (e.g. `Given I open the login page`).
3. Insert `When I scan the current page for accessibility issues` at each point you want to scan.
4. No new step definitions needed unless the scenario has unique interactions.
