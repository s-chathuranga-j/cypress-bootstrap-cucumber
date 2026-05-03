import { apiEndpoints } from '../apiEndpoints';
import { HttpMethod, StatusCodes } from '../../support/Enums';
import { CustomerRequests } from '../modals/requests/CustomerRequests';

class CustomersClient {
  public getCustomerById(id: string): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.customerById(id),
      HttpMethod.GET,
      Cypress.env('bearerToken'),
      StatusCodes.OK
    );
  }

  public getCustomers(): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.customers,
      HttpMethod.GET,
      Cypress.env('bearerToken'),
      StatusCodes.OK
    );
  }

  public deleteCustomer(id: string): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.customerById(id),
      HttpMethod.DELETE,
      Cypress.env('bearerToken'),
      StatusCodes.NO_CONTENT
    );
  }

  public createCustomer(
    customerDetails: CustomerRequests.CreateCustomerRequest
  ): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.customers,
      HttpMethod.POST,
      Cypress.env('bearerToken'),
      StatusCodes.CREATED,
      customerDetails
    );
  }
}
export default new CustomersClient();
