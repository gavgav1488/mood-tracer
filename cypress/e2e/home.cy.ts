describe('Home Page', () => {
  it('should redirect to login page when not authenticated', () => {
    // Посещаем главную страницу
    cy.visit('/');
    
    // Проверяем, что мы были перенаправлены на страницу входа
    cy.url().should('include', '/login');
    
    // Проверяем, что страница входа отображается корректно
    cy.findByText('Вход в дневник настроения').should('be.visible');
    cy.findByText('Выберите способ входа для доступа к вашему дневнику').should('be.visible');
    
    // Проверяем наличие кнопок входа
    cy.findByText('Войти через Google').should('be.visible');
    cy.findByText('Войти через VK').should('be.visible');
    cy.findByText('Войти через Telegram').should('be.visible');
  });
});
