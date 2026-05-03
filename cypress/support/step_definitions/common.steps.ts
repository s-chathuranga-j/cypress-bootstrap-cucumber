import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import InventoryPage from '../../pages/InventoryPage';
import LoginPage from '../../pages/LoginPage';
import TestData from '../../testdata/testdata.json';

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

Given('I open the login page', () => {
  LoginPage.openPage('/');
});

Given('I am logged in on the inventory page', () => {
  LoginPage.openPage('/');
  LoginPage.usernameInput().type(TestData.user_credentials.valid_username);
  LoginPage.passwordInput().type(TestData.user_credentials.password);
  LoginPage.loginButton().click();
  InventoryPage.checkPageURL(InventoryPage.url);
});

// ---------------------------------------------------------------------------
// Shared assertions
// ---------------------------------------------------------------------------

Then('the inventory page should be displayed', () => {
  InventoryPage.checkPageURL(InventoryPage.url);
  InventoryPage.title().should('be.visible');
});

// ---------------------------------------------------------------------------
// Shared actions
// ---------------------------------------------------------------------------

When('I submit the login form without credentials', () => {
  LoginPage.loginButton().click();
});
