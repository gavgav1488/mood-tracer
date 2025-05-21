describe('Authentication', () => {
  it('should show login page', () => {
    // Посещаем страницу входа
    cy.visit('/login');
    
    // Проверяем, что страница входа отображается корректно
    cy.findByText('Вход в дневник настроения').should('be.visible');
    cy.findByText('Выберите способ входа для доступа к вашему дневнику').should('be.visible');
  });
  
  it('should redirect to diary page after login', () => {
    // Выполняем вход
    cy.login();
    
    // Посещаем главную страницу
    cy.visit('/');
    
    // Проверяем, что мы были перенаправлены на страницу дневника
    cy.url().should('include', '/diary');
    
    // Проверяем, что страница дневника отображается корректно
    cy.findByText('Мой дневник настроения').should('be.visible');
  });
  
  it('should redirect to login page after logout', () => {
    // Выполняем вход
    cy.login();
    
    // Посещаем страницу дневника
    cy.visit('/diary');
    
    // Нажимаем кнопку выхода
    cy.findByText('Выйти').click();
    
    // Проверяем, что мы были перенаправлены на страницу входа
    cy.url().should('include', '/login');
  });
});
