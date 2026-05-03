/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import 'cypress-ajv-schema-validator';
import Ajv from 'ajv';
import { recurse } from 'cypress-recurse';

const ajv = new Ajv({ allErrors: true });
ajv.addFormat('date-time', dateString => {
  return !isNaN(Date.parse(dateString));
});

/**
 * Check if the value of the input field is not null
 */
Cypress.Commands.add('valueIsNotNull', { prevSubject: 'element' }, subject => {
  cy.wrap(subject).invoke('val').should('not.be.empty');
});

/**
 * Check if the value of the input field is null
 */
Cypress.Commands.add('valueIsNull', { prevSubject: 'element' }, subject => {
  cy.wrap(subject).invoke('val').should('be.empty');
});

/**
 * Types a string into an input field with a delay for the last 3 characters
 */
Cypress.Commands.add('slowDownType', { prevSubject: 'element' }, (subject, text: string) => {
  cy.wrap(subject).type(text.slice(0, -3)).type(text.slice(-3), { delay: 900 });
});

/**
 * Recursively type a text into an input field until the value matches the text
 */
Cypress.Commands.add('recursiveType', { prevSubject: 'element' }, (subject, text: string) => {
  recurse(
    () => cy.wrap(subject).clear().type(text),
    ($input: any) => $input.val() === text,
    { delay: 1000 }
  );
});

/**
 * Verify if the option is present in the select element
 */
Cypress.Commands.add('seeOption', { prevSubject: 'element' }, (subject, options: string[]) => {
  options.forEach(option => {
    cy.wrap(subject).find('option').contains(option).should('be.visible');
  });
});

/**
 * Wait for env variable to be set and return its value
 */
Cypress.Commands.add('getCypressEnvVariable', (key: string) => {
  return cy.wrap(null).then(() => {
    const value = Cypress.env(key);
    cy.log(`Retrieved ${key} from Cypress.env(): ${value}`);
    return value.toString();
  });
});
