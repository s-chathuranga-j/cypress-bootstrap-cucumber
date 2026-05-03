# Installing Cypress Bootstrap Cucumber

## New Project

```bash
npm init -y
npm install cypress-bootstrap-cucumber
npx cypress-bootstrap-cucumber-setup
```

## Existing Project

Run the same setup command from the project root. The setup script creates missing files only, merges scripts and dev dependencies into `package.json`, and leaves existing project files untouched.

## Useful Scripts

```bash
npm run cypress:open
npm run cypress:run
npm run cypress:run:smoke
npm run cypress:run:ui
npm run cypress:run:api
npm run cypress:run:a11y
npm run api:test
npm run typecheck
npm run format:check
```

## BrowserStack

```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
npm run browserstack:config
npm run browserstack:a11y
```

The generated BrowserStack config is `browserstack.generated.json`; do not commit it.
