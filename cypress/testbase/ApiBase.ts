import qs from 'qs';
import { StatusCodes } from '../support/Enums';

/**
 * Custom command to send an API request using cy-api plugin
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param token - JWT token
 * @param expectedStatus - expected status code
 * @param body - request body
 * @returns {Chainable<object>}
 * @example
 * cy.sendApiRequest(apiEndpoints.accountMe, HttpMethod.GET, token, 200);
 * @example
 * cy.sendApiRequest(apiEndpoints.accountMe, HttpMethod.POST, token, 200, {body object});
 */
Cypress.Commands.add(
  'sendApiRequest',
  (
    endpoint: string,
    method: string,
    token: string | null,
    expectedStatus: number,
    body: any = undefined
  ) => {
    cy.api({
      method: method,
      url: endpoint,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: body,
    }).then(response => {
      expect(response.status).to.eq(expectedStatus);
      cy.wrap(response.body, { log: false }).as('responseBody');
    });
  }
);

/**
 * Custom command to send an API request using default cypress request
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param token - JWT token
 * @param expectedStatus - expected status code
 * @param body - request body
 * @returns {Chainable<object>}
 * @example
 * cy.sendApiRequest(apiEndpoints.accountMe, HttpMethod.GET, token, 200);
 * @example
 * cy.sendApiRequest(apiEndpoints.accountMe, HttpMethod.POST, token, 200, {body object});
 */
Cypress.Commands.add(
  'sendApiRequestDef',
  (
    endpoint: string,
    method: string,
    token: string | null,
    expectedStatus: number | number[],
    body: any = undefined
  ) => {
    cy.request({
      method: method,
      url: endpoint,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: body,
    }).then(response => {
      if (Array.isArray(expectedStatus)) {
        expect(response.status).to.be.oneOf(expectedStatus);
      } else {
        expect(response.status).to.eq(expectedStatus);
      }
      cy.wrap(response.body, { log: false }).as('responseBody');
    });
  }
);

Cypress.Commands.add(
  'sendApiRequestWithAttachment',
  (
    endpoint: string,
    method: string,
    token: string | null,
    expectedStatus: number,
    resourceId: string,
    filePath: string
  ) => {
    cy.fixture(filePath, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then(blob => {
        const formData = new FormData();
        formData.append('CourseId', resourceId);
        formData.append('File', blob, filePath);

        cy.request({
          method: method,
          url: endpoint,
          failOnStatusCode: false,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }).then(response => {
          expect(response.status).to.eq(expectedStatus);
          cy.wrap(response.body, { log: false }).as('responseBody');
        });
      });
  }
);

/**
 * Custom command to get a bearer token
 * @returns {Chainable<string>}
 * @example
 * cy.getBearerToken();
 */
Cypress.Commands.add('getAccessToken', () => {
  const clientId = Cypress.env('clientId');
  const clientSecret = Cypress.env('clientSecret');

  if (!clientId || !clientSecret) {
    throw new Error('❌ Missing `clientId` or `clientSecret` in Cypress environment variables');
  }

  const body = qs.stringify({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  return cy
    .request({
      method: 'POST',
      url: Cypress.env('authUrl'),
      form: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
      failOnStatusCode: false,
    })
    .then(res => {
      expect(res.status).to.eq(StatusCodes.OK, `Expected status 200, got ${res.status}`);
      const token = res.body.access_token;
      Cypress.env('bearerToken', token);
      cy.log('🔑 Token Retrieved: ' + token);
      return cy.wrap(token, { log: false }).then(t => t as unknown as string);
    });
});

/**
 * Custom command to fetch a schema from Swagger
 * @param schemaName - name of the schema to fetch
 * @returns {Chainable<object>}
 * @example
 * cy.fetchSwaggerSchema('ContextualDataServices.Dtos.ForeignIdPriorityDto');
 */
Cypress.Commands.add('fetchSwaggerSchema', () => {
  return cy.request('GET', `${Cypress.env('swaggerSchemaUrl')}`).then(response => {
    expect(response.status).to.eq(200);

    const swaggerSchema = response.body;

    if (!swaggerSchema) {
      throw new Error(`Schema not found in Swagger response`);
    }
    return swaggerSchema;
  });
});

/**
 * Custom command to send an API request with query parameters
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param token - JWT token
 * @param expectedStatus - expected status code
 * @param params - query parameters
 * @param body - request body
 * @returns {Chainable<object>}
 * @example
 * cy.sendApiRequestWithParams(apiEndpoints.getCountryByName('USA'), HttpMethod.GET, token, 200, { fullText: 'true' });
 */
Cypress.Commands.add(
  'sendApiRequestWithParams',
  (
    endpoint: string,
    method: string,
    token: string | null,
    expectedStatus: number,
    params: Record<string, any> = {},
    body: any = undefined
  ) => {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    cy.api({
      method: method,
      url: url,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: body,
    }).then(response => {
      expect(response.status).to.eq(expectedStatus);
      cy.wrap(response.body, { log: false }).as('responseBody');
    });
  }
);

/**
 * Custom command to send an API request with query parameters using default cypress request
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param token - JWT token
 * @param expectedStatus - expected status code
 * @param params - query parameters
 * @param body - request body
 * @returns {Chainable<object>}
 * @example
 * cy.sendApiRequestWithParams(apiEndpoints.getCountryByName('USA'), HttpMethod.GET, token, 200, { fullText: 'true' });
 */
Cypress.Commands.add(
  'sendApiRequestDefWithParams',
  (
    endpoint: string,
    method: string,
    token: string | null,
    expectedStatus: number,
    params: Record<string, any> = {},
    body: any = undefined
  ) => {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    cy.request({
      method: method,
      url: url,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: body,
    }).then(response => {
      expect(response.status).to.eq(expectedStatus);
      cy.wrap(response.body, { log: false }).as('responseBody');
    });
  }
);
