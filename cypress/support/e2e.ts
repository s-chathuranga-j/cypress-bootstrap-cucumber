// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import '../testbase/ApiBase';
import 'cypress-plugin-api';
import 'cypress-real-events';
import 'cypress-mochawesome-reporter/register';
import 'cypress-map';
import 'cypress-wait-until';
import 'cypress-axe';
import 'wick-a11y';
import 'browserstack-cypress-cli/bin/accessibility-automation/cypress';

Cypress.on('uncaught:exception', () => {
  return false;
});
