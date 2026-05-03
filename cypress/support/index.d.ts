/// <reference types="cypress" />
/// <reference types="cypress-axe" />

declare namespace Cypress {
  interface Chainable {
    sendApiRequest(
      endpoint: string,
      method: string,
      token: string | null,
      expectedStatus: number,
      body?: unknown
    ): Chainable<object>;

    sendApiRequestDef(
      endpoint: string,
      method: string,
      token: string | null,
      expectedStatus: number | number[],
      body?: unknown
    ): Chainable<object>;

    sendApiRequestWithAttachment(
      endpoint: string,
      method: string,
      token: string,
      expectedStatus: number,
      resourceId: string,
      filePath: string
    ): Chainable<object>;

    getAccessToken(): Chainable<string>;
    fetchSwaggerSchema(): Chainable<object>;
    valueIsNotNull(): Chainable<JQuery<HTMLElement>>;
    valueIsNull(): Chainable<JQuery<HTMLElement>>;
    sendApiRequestWithParams(
      endpoint: string,
      method: string,
      token: string | null,
      expectedStatus: number,
      params: Record<string, unknown>,
      body?: unknown
    ): Chainable<object>;
    sendApiRequestDefWithParams(
      endpoint: string,
      method: string,
      token: string | null,
      expectedStatus: number,
      params: Record<string, unknown>,
      body?: unknown
    ): Chainable<object>;
    slowDownType(text: string): Chainable<JQuery<HTMLElement>>;
    recursiveType(text: string): Chainable<JQuery<HTMLElement>>;
    seeOption(options: string[]): Chainable<JQuery<HTMLElement>>;
    getCypressEnvVariable(key: string): Chainable<string>;
    checkAccessibility(
      context?: unknown,
      options?: Record<string, unknown>
    ): Chainable<JQuery<HTMLElement>>;
  }
}
