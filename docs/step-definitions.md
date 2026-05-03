# Step Definitions

## Colocated vs Shared

This framework uses a hybrid approach:

| Location | When to use |
|----------|-------------|
| `cypress/tests/ui/<feature>.steps.ts` | Steps that belong to exactly one feature |
| `cypress/tests/api/<feature>.steps.ts` | Steps that belong to exactly one API feature |
| `cypress/support/step_definitions/common.steps.ts` | Steps reused across 2 or more features |
| `cypress/support/step_definitions/hooks.ts` | `Before` / `After` hooks |

This is the pattern recommended by `@badeball/cypress-cucumber-preprocessor` and configured in
`.cypress-cucumber-preprocessorrc.json`:

```json
"stepDefinitions": [
  "cypress/tests/[filepath].steps.ts",
  "cypress/tests/[filepath]/steps.ts",
  "cypress/support/step_definitions/**/*.ts"
]
```

## The Rule

Start a new step **colocated** with its feature. When the same step text is needed in a second
feature, move it to `common.steps.ts`. Do not duplicate step definitions — the preprocessor
will throw a duplicate error at runtime.

## What Lives in common.steps.ts

Current shared steps:

- `Given('I open the login page')` — navigation reused across login and accessibility features
- `Given('I am logged in on the inventory page')` — reused across inventory and accessibility
- `Then('the inventory page should be displayed')` — reused by login and inventory features
- `When('I submit the login form without credentials')` — reused by login and accessibility

## Accessibility Steps

Accessibility step definitions only contain the scan step:

```typescript
When('I scan the current page for accessibility issues', () => {
  cy.injectAxe();
  cy.checkAccessibility(undefined, a11yOptions);
});
```

`cy.injectAxe()` is called inside this step so callers do not need to inject axe manually.
Accessibility features reuse the exact same navigation step text from `common.steps.ts` rather
than defining separate "for accessibility testing" variants.

## Example: Adding a Shared Step

If `cart.steps.ts` and `checkout.steps.ts` both need `When('I view the cart')`:

1. Remove it from both colocated files.
2. Add it once in `cypress/support/step_definitions/common.steps.ts`.
3. Both features pick it up automatically — no import needed.
