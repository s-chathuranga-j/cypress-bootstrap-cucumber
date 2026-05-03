@ui @login-page
Feature: Login page
  Background:
    Given I open the login page

  @smoke
  Scenario: Display the login form and validation messages
    Then the login form should be visible and enabled
    When I submit the login form without credentials
    Then I should see the login error "Epic sadface: Username is required"
    When I close the login error
    Then the login error should be hidden

  @smoke
  Scenario: Display an error message for a locked out user
    When I login as the locked out user
    Then I should see the login error "Epic sadface: Sorry, this user has been locked out."

  @smoke
  Scenario: Login successfully with valid credentials
    When I login with valid credentials
    Then the inventory page should be displayed
