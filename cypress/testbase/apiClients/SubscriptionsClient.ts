import { apiEndpoints } from '../apiEndpoints';
import { HttpMethod, StatusCodes } from '../../support/Enums';
import { SubscriptionRequests } from '../modals/requests/SubscriptionRequests';

class SubscriptionsClient {
  public getSubscriptionById(id: string): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.subscriptionById(id),
      HttpMethod.GET,
      Cypress.env('bearerToken'),
      StatusCodes.OK
    );
  }

  public getSubscriptions(): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.subscriptions,
      HttpMethod.GET,
      Cypress.env('bearerToken'),
      StatusCodes.OK
    );
  }

  public createSubscription(
    subscriptionDetails: SubscriptionRequests.CreateSubscriptionRequest
  ): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.subscriptions,
      HttpMethod.POST,
      Cypress.env('bearerToken'),
      StatusCodes.CREATED,
      subscriptionDetails
    );
  }

  public deleteSubscription(id: string): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.subscriptionById(id),
      HttpMethod.DELETE,
      Cypress.env('bearerToken'),
      StatusCodes.NO_CONTENT
    );
  }
}
export default new SubscriptionsClient();
