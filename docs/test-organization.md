# Test Organization

## Feature and Step File Layout

Feature files and their step definitions live under `cypress/tests`:

```text
cypress/tests/
  ui/
    login.feature
    login.steps.ts          ← colocated, login-specific steps only
    inventory.feature
    inventory.steps.ts      ← colocated, inventory-specific steps only
    accessibility.feature
    accessibility.steps.ts  ← colocated, contains only the scan step
  api/
    product.feature
    product.steps.ts
    subscription.feature
    subscription.steps.ts
    ...
```

## Shared Steps and Hooks

Steps reused across multiple features live in a dedicated location:

```text
cypress/support/step_definitions/
  hooks.ts           ← global Before/After hooks (e.g. viewport setup)
  common.steps.ts    ← steps used by 2 or more feature files
```

**Rule:** A step definition must exist in **exactly one file**.
- Start colocated with the feature.
- Move to `common.steps.ts` only when a second feature needs the same step text.
- Never copy-paste a step definition — that creates a duplicate that the preprocessor will reject.

See [`step-definitions.md`](step-definitions.md) for examples and the full decision guide.

## Tags

Use tags consistently:

| Tag | Purpose |
|-----|---------|
| `@ui` | UI browser tests |
| `@api` | API tests |
| `@smoke` | Fast confidence subset — run on every CI push |
| `@a11y` | Accessibility tests |
| `@wip` | Work in progress — excluded from CI |
| `@products` | Domain: product scenarios |
| `@customers` | Domain: customer scenarios |
| `@subscriptions` | Domain: subscription scenarios |

## Running Filtered Suites

```bash
npm run cypress:run:smoke                              # @smoke
npm run cypress:run:ui                                 # @ui
npm run cypress:run:api                                # @api
npm run cypress:run:a11y                               # @a11y
cypress run --env tags="@api and @smoke"               # combined
cypress run --env tags="@ui and not @wip"              # exclude wip
```

## Design Principles

- Step definitions must be thin — they orchestrate page objects and API clients, not contain logic.
- Put selectors in page objects (`cypress/pages`).
- Put API reuse in clients (`cypress/testbase/apiClients`).
- Put shared setup in `cypress/support/step_definitions/common.steps.ts` or `hooks.ts`.
