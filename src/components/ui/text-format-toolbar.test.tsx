import { render, screen, fireEvent } from '@testing-library/react';
import { TextFormatToolbar } from './text-format-toolbar';

describe('TextFormatToolbar', () => {
  const mockOnFormat = jest.fn();

  beforeEach(() => {
    // Сбрасываем мок перед каждым тестом
    mockOnFormat.mockClear();
  });

  it('отображает все кнопки форматирования', () => {
    render(<TextFormatToolbar onFormat={mockOnFormat} />);
    
    // Проверяем, что все кнопки форматирования отображаются
    expect(screen.getByTitle('Полужирный')).toBeInTheDocument();
    expect(screen.getByTitle('Курсив')).toBeInTheDocument();
    expect(screen.getByTitle('Подчеркнутый')).toBeInTheDocument();
    expect(screen.getByTitle('Маркированный список')).toBeInTheDocument();
    expect(screen.getByTitle('Нумерованный список')).toBeInTheDocument();
    expect(screen.getByTitle('Цитата')).toBeInTheDocument();
  });

  it('вызывает функцию onFormat с правильным параметром при нажатии на кнопку полужирного текста', () => {
    render(<TextFormatToolbar onFormat={mockOnFormat} />);
    
    // Нажимаем на кнопку полужирного текста
    fireEvent.click(screen.getByTitle('Полужирный'));
    
    // Проверяем, что функция onFormat была вызвана с правильным параметром
    expect(mockOnFormat).toHaveBeenCalledWith('bold');
  });

  it('вызывает функцию onFormat с правильным параметром при нажатии на кнопку курсива', () => {
    render(<TextFormatToolbar onFormat={mockOnFormat} />);
    
    // Нажимаем на кнопку курсива
    fireEvent.click(screen.getByTitle('Курсив'));
    
    // Проверяем, что функция onFormat была вызвана с правильным параметром
    expect(mockOnFormat).toHaveBeenCalledWith('italic');
  });

  it('вызывает функцию onFormat с правильным параметром при нажатии на кнопку подчеркнутого текста', () => {
    render(<TextFormatToolbar onFormat={mockOnFormat} />);
    
    // Нажимаем на кнопку подчеркнутого текста
    fireEvent.click(screen.getByTitle('Подчеркнутый'));
    
    // Проверяем, что функция onFormat была вызвана с правильным параметром
    expect(mockOnFormat).toHaveBeenCalledWith('underline');
  });

  it('вызывает функцию onFormat с правильным параметром при нажатии на кнопку маркированного списка', () => {
    render(<TextFormatToolbar onFormat={mockOnFormat} />);
    
    // Нажимаем на кнопку маркированного списка
    fireEvent.click(screen.getByTitle('Маркированный список'));
    
    // Проверяем, что функция onFormat была вызвана с правильным параметром
    expect(mockOnFormat).toHaveBeenCalledWith('ul');
  });

  it('вызывает функцию onFormat с правильным параметром при нажатии на кнопку нумерованного списка', () => {
    render(<TextFormatToolbar onFormat={mockOnFormat} />);
    
    // Нажимаем на кнопку нумерованного списка
    fireEvent.click(screen.getByTitle('Нумерованный список'));
    
    // Проверяем, что функция onFormat была вызвана с правильным параметром
    expect(mockOnFormat).toHaveBeenCalledWith('ol');
  });

  it('вызывает функцию onFormat с правильным параметром при нажатии на кнопку цитаты', () => {
    render(<TextFormatToolbar onFormat={mockOnFormat} />);
    
    // Нажимаем на кнопку цитаты
    fireEvent.click(screen.getByTitle('Цитата'));
    
    // Проверяем, что функция onFormat была вызвана с правильным параметром
    expect(mockOnFormat).toHaveBeenCalledWith('quote');
  });

  it('применяет дополнительные классы через props className', () => {
    const { container } = render(<TextFormatToolbar onFormat={mockOnFormat} className="test-class" />);
    
    // Проверяем, что дополнительный класс применен к контейнеру
    expect(container.firstChild).toHaveClass('test-class');
  });
});
