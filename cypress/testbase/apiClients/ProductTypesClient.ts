import { apiEndpoints } from '../apiEndpoints';
import { HttpMethod, StatusCodes } from '../../support/Enums';
import { ProductTypeRequests } from '../modals/requests/ProductTypeRequests';

class ProductTypesClient {
  public getProductTypeById(id: string): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.productTypeById(id),
      HttpMethod.GET,
      Cypress.env('bearerToken'),
      StatusCodes.OK
    );
  }

  public getProductTypes(): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.productTypes,
      HttpMethod.GET,
      Cypress.env('bearerToken'),
      StatusCodes.OK
    );
  }

  public deleteProductType(id: string): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.productTypeById(id),
      HttpMethod.DELETE,
      Cypress.env('bearerToken'),
      StatusCodes.NO_CONTENT
    );
  }

  /**
   * Create a new product type
   * @returns {Cypress.Chainable<object>}
   * @example
   * const productTypeDetails = {
   *   name: 'Test Product Type',
   *   description: 'This is a test product type'
   * };
   * const response = createProductType(productTypeDetails);
   * expect(response).to.have.property('id');
   * expect(response).to.have.property('name', 'Test Product Type');
   * expect(response).to.have.property('description', 'This is a test product type');
   * @param productTypeDetails
   */
  public createProductType(
    productTypeDetails: ProductTypeRequests.CreateProductTypeRequest
  ): Cypress.Chainable<object> {
    return cy.sendApiRequestDef(
      apiEndpoints.productTypes,
      HttpMethod.POST,
      Cypress.env('bearerToken'),
      StatusCodes.CREATED,
      productTypeDetails
    );
  }
}
export default new ProductTypesClient();
