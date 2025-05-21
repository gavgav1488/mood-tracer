/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Cypress Testing Library adds many custom commands
// See: https://testing-library.com/docs/cypress-testing-library/intro/

// -- This is a parent command --
Cypress.Commands.add('login', () => {
  // Мок для входа в систему, так как мы не можем использовать реальную аутентификацию в тестах
  // Устанавливаем localStorage для имитации входа пользователя
  window.localStorage.setItem('supabase.auth.token', JSON.stringify({
    currentSession: {
      access_token: 'fake-token',
      expires_at: new Date().getTime() + 3600000,
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User'
        }
      }
    }
  }));
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
