import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { HttpMethod, StatusCodes } from '../../support/Enums';
import ProductTypesClient from '../../testbase/apiClients/ProductTypesClient';
import { apiEndpoints } from '../../testbase/apiEndpoints';
import { ProductRequests } from '../../testbase/modals/requests/ProductRequests';
import { ProductResponses } from '../../testbase/modals/responses/ProductResponses';
import { ProductTypeResponses } from '../../testbase/modals/responses/ProductTypeResponses';
import { PRODUCT_DETAILS } from '../../testdata/dataObjects/Product';
import { PRODUCT_TYPE_DETAILS } from '../../testdata/dataObjects/ProductTypes';

When('I request all products', () => {
  cy.sendApiRequestDef(apiEndpoints.products, HttpMethod.GET, null, StatusCodes.OK).then(
    response => {
      const products = response as ProductResponses.ProductResponse[];
      Cypress.env('productsResponse', products);
      Cypress.env('productId', products[0]?.id);
    }
  );
});

Then('the products response should contain at least one product', () => {
  const products = Cypress.env('productsResponse') as ProductResponses.ProductResponse[];
  expect(products).to.be.an('array');
  expect(products).to.have.length.greaterThan(0);
});

When('I request the first product by id', () => {
  cy.sendApiRequestDef(
    apiEndpoints.productById(Cypress.env('productId')),
    HttpMethod.GET,
    null,
    StatusCodes.OK
  ).then(response => {
    Cypress.env('productResponse', response);
  });
});

Then('the product response should match the requested product id', () => {
  const responseBody = Cypress.env('productResponse') as ProductResponses.ProductResponse;
  expect(responseBody).to.have.property('id');
  expect(responseBody.id).to.eq(Cypress.env('productId'));
  expect(responseBody).to.have.property('name');
  expect(responseBody).to.have.property('productTypeId');
  expect(responseBody).to.have.property('price');
});

When('I create a product with a new product type', () => {
  ProductTypesClient.createProductType(PRODUCT_TYPE_DETAILS).then(response => {
    const productTypeResponse = response as ProductTypeResponses.ProductTypeResponse;
    const productRequest = new ProductRequests.Request();
    const productRequestBody = productRequest.createProductRequest({
      ...PRODUCT_DETAILS,
      productTypeId: productTypeResponse.id,
    });

    cy.sendApiRequestDef(
      apiEndpoints.products,
      HttpMethod.POST,
      null,
      StatusCodes.CREATED,
      productRequestBody
    ).then(createdProduct => {
      Cypress.env('createdProductResponse', createdProduct);
      Cypress.env('createdProductRequest', productRequestBody);
    });
  });
});

Then('the created product response should contain the product details', () => {
  const createdProduct = Cypress.env('createdProductResponse') as ProductResponses.ProductResponse;
  const requestBody = Cypress.env('createdProductRequest') as ProductRequests.CreateProductRequest;
  expect(createdProduct).to.have.property('id');
  expect(createdProduct.name).to.eq(requestBody.name);
  expect(createdProduct.productTypeId).to.eq(requestBody.productTypeId);
  expect(createdProduct.price).to.eq(requestBody.price);
});
