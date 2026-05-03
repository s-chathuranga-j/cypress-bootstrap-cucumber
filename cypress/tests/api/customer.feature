@api @customers
Feature: Customer API
  @smoke
  Scenario: Get all customers
    When I request all customers
    Then the customers response should contain at least one customer

  @smoke
  Scenario: Get customer by id
    When I request all customers
    And I request the first customer by id
    Then the customer response should match the requested customer id
