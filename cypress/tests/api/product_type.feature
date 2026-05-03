@api @product-types
Feature: Product type API
  @smoke
  Scenario: Get all product types
    When I request all product types
    Then the product types response should contain at least one product type

  @smoke
  Scenario: Get product type by id
    When I request all product types
    And I request the first product type by id
    Then the product type response should match the requested product type id
