import { When } from '@badeball/cypress-cucumber-preprocessor';

// Navigation steps (I open the login page, I am logged in on the inventory page)
// and action steps (I submit the login form without credentials) are shared steps
// defined in cypress/support/step_definitions/common.steps.ts

const a11yOptions = {
  runOnly: ['wcag2a', 'wcag2aa'],
  includedImpacts: [],
};

When('I scan the current page for accessibility issues', () => {
  cy.injectAxe();
  cy.checkAccessibility(undefined, a11yOptions);
});
