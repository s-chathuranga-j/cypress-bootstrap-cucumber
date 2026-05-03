import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import InventoryPage from '../../pages/InventoryPage';

// Shared steps (I am logged in on the inventory page, the inventory page should be
// displayed) live in cypress/support/step_definitions/common.steps.ts

const filterOptions = [
  'Name (A to Z)',
  'Name (Z to A)',
  'Price (low to high)',
  'Price (high to low)',
];

Then('the inventory should contain products', () => {
  InventoryPage.inventoryItems().should('have.length.greaterThan', 0);
});

When('I open the side menu', () => {
  InventoryPage.hamburgerMenuButton().should('be.visible').click();
});

Then('the side menu buttons should be visible', () => {
  InventoryPage.sideMenu.overlay().should('be.visible');
  InventoryPage.sideMenu.aboutButton().should('be.visible');
  InventoryPage.sideMenu.allItemsButton().should('be.visible');
  InventoryPage.sideMenu.logOutButton().should('be.visible');
  InventoryPage.sideMenu.resetAppStateButton().should('be.visible');
});

When('I close the side menu', () => {
  InventoryPage.sideMenu.closeButton().should('be.visible').click();
});

Then('the side menu should be hidden', () => {
  InventoryPage.sideMenu.overlay().should('not.be.visible');
});

Then('the inventory filter options should be available', () => {
  InventoryPage.filterButton().should('be.visible').click();
  InventoryPage.filterSelector().seeOption(filterOptions);
});

When('I sort the inventory by price from low to high', () => {
  InventoryPage.filterSelector().select('Price (low to high)');
  InventoryPage.activeFilterOption().should('have.text', 'Price (low to high)');
  InventoryPage.inventoryItems()
    .first()
    .within(() => {
      InventoryPage.inventoryItemNameLabel()
        .invoke('text')
        .then(lowPriceItemName => {
          Cypress.env('lowPriceItemName', lowPriceItemName);
        });
    });
});

When('I sort the inventory by price from high to low', () => {
  InventoryPage.filterSelector().select('Price (high to low)');
  InventoryPage.activeFilterOption().should('have.text', 'Price (high to low)');
});

Then('the first inventory item should change', () => {
  InventoryPage.inventoryItems()
    .first()
    .within(() => {
      InventoryPage.inventoryItemNameLabel()
        .invoke('text')
        .then(highPriceItemName => {
          expect(highPriceItemName).not.to.equal(Cypress.env('lowPriceItemName'));
        });
    });
});

Then('the footer social media links should be visible', () => {
  InventoryPage.footer.section().should('be.visible');
  InventoryPage.footer.twitterLink().should('be.visible');
  InventoryPage.footer.facebookLink().should('be.visible');
  InventoryPage.footer.linkedinLink().should('be.visible');
});
