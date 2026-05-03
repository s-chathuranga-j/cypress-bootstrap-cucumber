import { BasePage } from '../testbase/BasePage';
import TestData from '../testdata/testdata.json';

class LoginPage extends BasePage {
  usernameInput = () => cy.get('[data-test="username"]');
  passwordInput = () => cy.get('[data-test="password"]');
  loginButton = () => cy.get('[data-test="login-button"]');
  errorMessage = () => cy.get('[data-test="error"]');
  closeErrorButton = () => cy.get('[data-test="error-button"]');
  errorLabel = (message: string) => cy.contains('h3', message);

  public createSession() {
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
    cy.session('SwagLabsSession', () => {
      cy.visit('/');
      this.usernameInput().type(TestData.user_credentials.valid_username);
      this.passwordInput().type(TestData.user_credentials.password);
      this.loginButton().click();
      cy.url().should('include', '/inventory.html');
    });
  }
}

export default new LoginPage();
