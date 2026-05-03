# API Testing

API features live under `cypress/tests/api`. Step definitions should call the shared request commands and clients from `cypress/testbase`.

Important folders:

- `cypress/testbase/apiEndpoints.ts`
- `cypress/testbase/ApiBase.ts`
- `cypress/testbase/apiClients`
- `cypress/testbase/modals/requests`
- `cypress/testbase/modals/responses`
- `cypress/testdata/dataObjects`

Run API tests with the bundled local service:

```bash
npm run api:test
```

This starts `subscription-api` on port `3100`, waits for it to respond, and runs the `@api` Cucumber suite.
