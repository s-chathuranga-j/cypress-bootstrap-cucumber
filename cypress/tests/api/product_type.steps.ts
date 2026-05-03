import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { HttpMethod, StatusCodes } from '../../support/Enums';
import { apiEndpoints } from '../../testbase/apiEndpoints';
import { ProductTypeResponses } from '../../testbase/modals/responses/ProductTypeResponses';

When('I request all product types', () => {
  cy.sendApiRequestDef(apiEndpoints.productTypes, HttpMethod.GET, null, StatusCodes.OK).then(
    response => {
      const productTypes = response as ProductTypeResponses.ProductTypeResponse[];
      Cypress.env('productTypesResponse', productTypes);
      Cypress.env('productTypeId', productTypes[0]?.id);
    }
  );
});

Then('the product types response should contain at least one product type', () => {
  const productTypes = Cypress.env(
    'productTypesResponse'
  ) as ProductTypeResponses.ProductTypeResponse[];
  expect(productTypes).to.be.an('array');
  expect(productTypes).to.have.length.greaterThan(0);
});

When('I request the first product type by id', () => {
  cy.sendApiRequestDef(
    apiEndpoints.productTypeById(Cypress.env('productTypeId')),
    HttpMethod.GET,
    null,
    StatusCodes.OK
  ).then(response => {
    Cypress.env('productTypeResponse', response);
  });
});

Then('the product type response should match the requested product type id', () => {
  const responseBody = Cypress.env(
    'productTypeResponse'
  ) as ProductTypeResponses.ProductTypeResponse;
  expect(responseBody).to.have.property('id');
  expect(responseBody.id).to.eq(Cypress.env('productTypeId'));
  expect(responseBody).to.have.property('name');
  expect(responseBody).to.have.property('description');
  expect(responseBody).to.have.property('createdAt');
});
