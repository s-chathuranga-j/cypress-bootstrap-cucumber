@ui @inventory-page
Feature: Inventory page
  Background:
    Given I am logged in on the inventory page

  @smoke
  Scenario: Display products in the inventory page
    Then the inventory page should be displayed
    And the inventory should contain products

  @smoke
  Scenario: Display hamburger menu and side menu buttons
    When I open the side menu
    Then the side menu buttons should be visible
    When I close the side menu
    Then the side menu should be hidden

  @smoke
  Scenario: Display and apply filter options
    Then the inventory filter options should be available
    When I sort the inventory by price from low to high
    And I sort the inventory by price from high to low
    Then the first inventory item should change

  Scenario: Display social media links in the footer
    Then the footer social media links should be visible
