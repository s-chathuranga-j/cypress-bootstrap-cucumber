@ui @a11y
Feature: Accessibility

  @smoke
  Scenario: Scan the login page accessibility states
    Given I open the login page
    When I scan the current page for accessibility issues
    And I submit the login form without credentials
    Then I should see the login error "Epic sadface: Username is required"
    And I scan the current page for accessibility issues

  Scenario: Scan the inventory page accessibility state
    Given I am logged in on the inventory page
    When I scan the current page for accessibility issues
