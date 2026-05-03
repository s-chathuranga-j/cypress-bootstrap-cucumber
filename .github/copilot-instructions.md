# GitHub Copilot Instructions

Central guidance lives in `.ai/`.

Read or follow:

- `.ai/agent-guidelines.md`
- `.ai/skills/cypress-bootstrap-cucumber/SKILL.md`
- `.ai/skills/cypress-bootstrap-cucumber/references/authoring.md`
- `.ai/skills/cypress-bootstrap-cucumber/references/explaining-and-reviewing.md`

Important shorthand:

- This project uses `.feature` + colocated `*.steps.ts`, not `.spec.ts` or `.cy.ts`.
- Page objects own selectors.
- Step definitions stay thin and call page objects, API clients, and custom commands.
- Do not commit secrets or generated files.
