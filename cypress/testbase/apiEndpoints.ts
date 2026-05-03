/**
 * Since this is just a sample test framework, we have two different base URLs, for UI and API. Hence, I am setting the full URL here.
 */
const apiBase = Cypress.env('apiBaseUrl') || 'http://localhost:3100';

export const apiEndpoints = {
  customers: `${apiBase}/customers`,
  customerById: (id: string) => `${apiBase}/customers/${id}`,

  subscriptions: `${apiBase}/subscriptions`,
  subscriptionById: (id: string) => `${apiBase}/subscriptions/${id}`,

  products: `${apiBase}/products`,
  productById: (id: string) => `${apiBase}/products/${id}`,

  productTypes: `${apiBase}/product-types`,
  productTypeById: (id: string) => `${apiBase}/product-types/${id}`,
} as const;
