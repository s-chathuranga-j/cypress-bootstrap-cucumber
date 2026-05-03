import Chainable = Cypress.Chainable;
import { LengthUnits } from '../support/Enums';

class BasePage {
  loadingSpinner = () => cy.get('[role="progressbar"]');
  modalDialog = () => cy.get('div[role="dialog"]');
  successNotification = () => cy.contains('div', 'success', { matchCase: false }).first();
  errorNotification = () => cy.contains('div', 'error');
  notificationToast = (timeoutValue: number = 30000) =>
    cy.get('.notification-toast', { timeout: timeoutValue });
  footer = {
    section: () => cy.get('[data-test="footer"]'),
    twitterLink: () => cy.get('[data-test="social-twitter"]'),
    facebookLink: () => cy.get('[data-test="social-facebook"]'),
    linkedinLink: () => cy.get('[data-test="social-linkedin"]'),
  };

  public waitForSpinners() {
    this.loadingSpinner().should('not.exist');
  }

  public getDataSliceFromTable(
    tableBodyElement: Chainable<JQuery<HTMLElement>>,
    flattenData: boolean,
    x: number,
    y: number,
    column: number,
    row?: number
  ) {
    return tableBodyElement.table(x, y, column, row).then(data => {
      if (flattenData) {
        return data.flat();
      }
      return data;
    });
  }

  public checkPageURL(url: string) {
    cy.url().should('include', url);
  }

  public checkModalDialogIsVisible() {
    this.modalDialog().should('be.visible');
  }

  public successNotificationPopped(successMessage?: string, waitForPopOut: boolean = false) {
    this.successNotification().should('be.visible');
    if (successMessage) {
      this.successNotification()
        .parent()
        .siblings(`div:contains("${successMessage}")`)
        .should('be.visible');
    }
    if (waitForPopOut) {
      this.successNotification().should('not.exist');
    }
  }

  public errorNotificationPopped(errorMessage?: string, waitForPopOut: boolean = false) {
    this.errorNotification().should('be.visible');
    if (errorMessage) {
      this.errorNotification()
        .parent()
        .siblings(`div:contains("${errorMessage}")`)
        .should('be.visible');
    }
    if (waitForPopOut) {
      this.errorNotification().should('not.exist');
    }
  }

  public errorNotified(errorMessage: string) {
    this.errorNotification().should('be.visible');
    cy.contains('div', errorMessage).should('be.visible');
  }

  public refreshPage() {
    cy.reload();
  }

  public openPage(url: string) {
    cy.visit(url);
  }

  public staticWait(waitTime: number) {
    cy.wait(waitTime);
  }

  public elementWithTextVisible(text: string) {
    cy.contains(text).should('be.visible');
  }
}
export { BasePage };
