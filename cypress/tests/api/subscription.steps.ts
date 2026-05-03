import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { HttpMethod, StatusCodes } from '../../support/Enums';
import CustomersClient from '../../testbase/apiClients/CustomersClient';
import ProductsClient from '../../testbase/apiClients/ProductsClient';
import ProductTypesClient from '../../testbase/apiClients/ProductTypesClient';
import { apiEndpoints } from '../../testbase/apiEndpoints';
import { CustomerRequests } from '../../testbase/modals/requests/CustomerRequests';
import { ProductRequests } from '../../testbase/modals/requests/ProductRequests';
import { SubscriptionRequests } from '../../testbase/modals/requests/SubscriptionRequests';
import { CustomerResponses } from '../../testbase/modals/responses/CustomerResponses';
import { ProductResponses } from '../../testbase/modals/responses/ProductResponses';
import { ProductTypeResponses } from '../../testbase/modals/responses/ProductTypeResponses';
import { SubscriptionResponses } from '../../testbase/modals/responses/SubscriptionResponses';
import { CUSTOMER_DETAILS } from '../../testdata/dataObjects/Customer';
import { PRODUCT_DETAILS } from '../../testdata/dataObjects/Product';
import { PRODUCT_TYPE_DETAILS } from '../../testdata/dataObjects/ProductTypes';
import { SUBSCRIPTION_DETAILS } from '../../testdata/dataObjects/Subscription';

When('I request all subscriptions', () => {
  cy.sendApiRequestDef(apiEndpoints.subscriptions, HttpMethod.GET, null, StatusCodes.OK).then(
    response => {
      const subscriptions = response as SubscriptionResponses.SubscriptionResponse[];
      Cypress.env('subscriptionsResponse', subscriptions);
      Cypress.env('subscriptionId', subscriptions[0]?.id);
    }
  );
});

Then('the subscriptions response should contain at least one subscription', () => {
  const subscriptions = Cypress.env(
    'subscriptionsResponse'
  ) as SubscriptionResponses.SubscriptionResponse[];
  expect(subscriptions).to.be.an('array');
  expect(subscriptions).to.have.length.greaterThan(0);
});

When('I request the first subscription by id', () => {
  cy.sendApiRequestDef(
    apiEndpoints.subscriptionById(Cypress.env('subscriptionId')),
    HttpMethod.GET,
    null,
    StatusCodes.OK
  ).then(response => {
    Cypress.env('subscriptionResponse', response);
  });
});

Then('the subscription response should match the requested subscription id', () => {
  const responseBody = Cypress.env(
    'subscriptionResponse'
  ) as SubscriptionResponses.SubscriptionResponse;
  expect(responseBody).to.have.property('id');
  expect(responseBody.id).to.eq(Cypress.env('subscriptionId'));
  expect(responseBody).to.have.property('productId');
  expect(responseBody).to.have.property('customerId');
  expect(responseBody).to.have.property('startDate');
  expect(responseBody).to.have.property('status');
  expect(responseBody).to.have.property('createdAt');
});

When('I create a subscription with a new product and customer', () => {
  ProductTypesClient.createProductType(PRODUCT_TYPE_DETAILS).then(productTypeResponse => {
    const productType = productTypeResponse as ProductTypeResponses.ProductTypeResponse;
    const productRequest = new ProductRequests.Request();
    const productBody = productRequest.createProductRequest({
      ...PRODUCT_DETAILS,
      productTypeId: productType.id,
    });

    ProductsClient.createProduct(productBody).then(productResponse => {
      const product = productResponse as ProductResponses.ProductResponse;
      const customerRequest = new CustomerRequests.Request();
      const customerBody = customerRequest.createCustomerRequest(CUSTOMER_DETAILS);

      CustomersClient.createCustomer(customerBody).then(customerResponse => {
        const customer = customerResponse as CustomerResponses.CustomerResponse;
        const subscriptionRequest = new SubscriptionRequests.Request();
        const subscriptionBody = subscriptionRequest.createSubscriptionRequest({
          ...SUBSCRIPTION_DETAILS,
          productId: product.id,
          customerId: customer.id,
        });

        cy.sendApiRequestDef(
          apiEndpoints.subscriptions,
          HttpMethod.POST,
          null,
          StatusCodes.CREATED,
          subscriptionBody
        ).then(createdSubscription => {
          Cypress.env('createdSubscriptionResponse', createdSubscription);
          Cypress.env('createdSubscriptionRequest', subscriptionBody);
        });
      });
    });
  });
});

Then('the created subscription response should contain the subscription details', () => {
  const createdSubscription = Cypress.env(
    'createdSubscriptionResponse'
  ) as SubscriptionResponses.SubscriptionResponse;
  const requestBody = Cypress.env(
    'createdSubscriptionRequest'
  ) as SubscriptionRequests.CreateSubscriptionRequest;
  expect(createdSubscription).to.have.property('id');
  expect(createdSubscription.productId).to.eq(requestBody.productId);
  expect(createdSubscription.customerId).to.eq(requestBody.customerId);
  expect(createdSubscription).to.have.property('startDate');
  expect(createdSubscription).to.have.property('status');
});
