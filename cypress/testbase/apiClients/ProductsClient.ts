import { apiEndpoints } from '../apiEndpoints';
import { HttpMethod, StatusCodes } from '../../support/Enums';
import { ProductRequests } from '../modals/requests/ProductRequests';

class ProductsClient {
  public getProductById(id: string): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.productById(id),
      HttpMethod.GET,
      Cypress.env('bearerToken'),
      StatusCodes.OK
    );
  }

  public getProducts(): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.products,
      HttpMethod.GET,
      Cypress.env('bearerToken'),
      StatusCodes.OK
    );
  }

  public deleteProduct(id: string): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.productById(id),
      HttpMethod.DELETE,
      Cypress.env('bearerToken'),
      StatusCodes.NO_CONTENT
    );
  }

  public createProduct(
    productDetails: ProductRequests.CreateProductRequest
  ): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.products,
      HttpMethod.POST,
      Cypress.env('bearerToken'),
      StatusCodes.CREATED,
      productDetails
    );
  }
}

export default new ProductsClient();
