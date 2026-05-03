import { Before } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
  cy.viewport(1920, 1080);
});
