@api @subscriptions
Feature: Subscription API
  @smoke
  Scenario: Get all subscriptions
    When I request all subscriptions
    Then the subscriptions response should contain at least one subscription

  @smoke
  Scenario: Get subscription by id
    When I request all subscriptions
    And I request the first subscription by id
    Then the subscription response should match the requested subscription id

  @smoke
  Scenario: Create subscription
    When I create a subscription with a new product and customer
    Then the created subscription response should contain the subscription details
