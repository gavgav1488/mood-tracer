/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to simulate user login
     * @example cy.login()
     */
    login(): Chainable<void>
  }
}
