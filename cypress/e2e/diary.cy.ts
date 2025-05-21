describe('Diary Page', () => {
  beforeEach(() => {
    // Выполняем вход перед каждым тестом
    cy.login();
    
    // Посещаем страницу дневника
    cy.visit('/diary');
  });
  
  it('should display diary page when authenticated', () => {
    // Проверяем, что страница дневника отображается корректно
    cy.findByText('Мой дневник настроения').should('be.visible');
    cy.findByText('Как вы себя чувствуете сегодня?').should('be.visible');
    cy.findByText('Ваши записи').should('be.visible');
    
    // Проверяем наличие кнопки выхода
    cy.findByText('Выйти').should('be.visible');
  });
  
  it('should allow creating a new mood entry', () => {
    // Вводим текст в поле заметки
    cy.findByTestId('note-textarea').type('Тестовая заметка для проверки создания записи');
    
    // Нажимаем кнопку сохранения
    cy.findByText('Сохранить запись').click();
    
    // Проверяем, что появилось сообщение об успешном сохранении
    cy.findByText('Запись успешно сохранена!').should('be.visible');
  });
});
