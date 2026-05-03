import { BasePage } from '../testbase/BasePage';

class InventoryPage extends BasePage {
  url = '/inventory.html';
  title = () => cy.get('[data-test="title"]');
  hamburgerMenuButton = () => cy.get('#react-burger-menu-btn');
  filterButton = () => cy.get('.select_container');
  filterSelector = () => cy.get('[data-test="product-sort-container"]');
  activeFilterOption = () => cy.get('[data-test="active-option"]');
  shoppingCartButton = () => cy.get('[data-test="shopping-cart-link"]');
  inventoryItems = () => cy.get('[data-test="inventory-item"]');
  inventoryItem = (name: string) => cy.get('[data-test="inventory-item-name"]').contains(name);
  inventoryItemNameLabel = () => cy.get('[data-test="inventory-item-name"]');
  inventoryItemDescription = (itemName: string) =>
    cy
      .get('[data-test="inventory-item-name"]')
      .contains(itemName)
      .closest('div[data-test="inventory-item-desc"]');
  inventoryItemPrice = (itemName: string) =>
    cy
      .get('[data-test="inventory-item-name"]')
      .contains(itemName)
      .closest('div[data-test="inventory-item-price"]');
  addToCartButton = (itemName: string) =>
    cy
      .get('[data-test="inventory-item-name"]')
      .contains(itemName)
      .closest('div[data-test*="add-to-cart-sauce-labs-"]');
  sideMenu = {
    overlay: () => cy.get('.bm-menu'),
    closeButton: () => cy.get('#react-burger-cross-btn'),
    allItemsButton: () => cy.get('[data-test="inventory-sidebar-link"]'),
    aboutButton: () => cy.get('[data-test="about-sidebar-link"]'),
    logOutButton: () => cy.get('[data-test="logout-sidebar-link"]'),
    resetAppStateButton: () => cy.get('[data-test="reset-sidebar-link"]'),
  };
}

export default new InventoryPage();
