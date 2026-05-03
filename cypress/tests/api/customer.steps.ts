import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { HttpMethod, StatusCodes } from '../../support/Enums';
import { apiEndpoints } from '../../testbase/apiEndpoints';
import { CustomerResponses } from '../../testbase/modals/responses/CustomerResponses';

When('I request all customers', () => {
  cy.sendApiRequestDef(apiEndpoints.customers, HttpMethod.GET, null, StatusCodes.OK).then(
    response => {
      const customers = response as CustomerResponses.CustomerResponse[];
      Cypress.env('customersResponse', customers);
      Cypress.env('customerId', customers[0]?.id);
    }
  );
});

Then('the customers response should contain at least one customer', () => {
  const customers = Cypress.env('customersResponse') as CustomerResponses.CustomerResponse[];
  expect(customers).to.be.an('array');
  expect(customers).to.have.length.greaterThan(0);
});

When('I request the first customer by id', () => {
  cy.sendApiRequestDef(
    apiEndpoints.customerById(Cypress.env('customerId')),
    HttpMethod.GET,
    null,
    StatusCodes.OK
  ).then(response => {
    Cypress.env('customerResponse', response);
  });
});

Then('the customer response should match the requested customer id', () => {
  const responseBody = Cypress.env('customerResponse') as CustomerResponses.CustomerResponse;
  expect(responseBody).to.have.property('id');
  expect(responseBody.id).to.eq(Cypress.env('customerId'));
  expect(responseBody).to.have.property('name');
  expect(responseBody).to.have.property('email');
});
