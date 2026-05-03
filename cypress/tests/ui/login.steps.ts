import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../../pages/LoginPage';
import TestData from '../../testdata/testdata.json';

// Shared steps (I open the login page, I submit the login form without credentials,
// the inventory page should be displayed) live in
// cypress/support/step_definitions/common.steps.ts

Then('the login form should be visible and enabled', () => {
  LoginPage.usernameInput().should('be.visible').and('be.enabled');
  LoginPage.passwordInput().should('be.visible').and('be.enabled');
  LoginPage.loginButton().should('be.visible').and('be.enabled');
});

Then('I should see the login error {string}', (message: string) => {
  LoginPage.errorLabel(message).should('be.visible');
  LoginPage.errorMessage().should('be.visible');
});

When('I close the login error', () => {
  LoginPage.closeErrorButton().click();
});

Then('the login error should be hidden', () => {
  LoginPage.errorMessage().should('not.exist');
});

When('I login as the locked out user', () => {
  LoginPage.usernameInput().type(TestData.user_credentials.locked_out_user);
  LoginPage.passwordInput().type(TestData.user_credentials.password);
  LoginPage.loginButton().click();
});

When('I login with valid credentials', () => {
  LoginPage.usernameInput().type(TestData.user_credentials.valid_username);
  LoginPage.passwordInput().type(TestData.user_credentials.password);
  LoginPage.loginButton().click();
});
