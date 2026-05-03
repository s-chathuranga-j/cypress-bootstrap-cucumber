@api @products
Feature: Product API
  @smoke
  Scenario: Get all products
    When I request all products
    Then the products response should contain at least one product

  @smoke
  Scenario: Get product by id
    When I request all products
    And I request the first product by id
    Then the product response should match the requested product id

  @smoke
  Scenario: Create product
    When I create a product with a new product type
    Then the created product response should contain the product details
