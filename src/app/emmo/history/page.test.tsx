import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EmmoHistoryPage from './page';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

// Мокаем хуки
jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Мокаем компонент EmmoHistoryVisualization
jest.mock('@/components/mood/emmo-history-visualization', () => ({
  EmmoHistoryVisualization: jest.fn().mockImplementation(({ onEntrySelected }) => (
    <div data-testid="emmo-history-visualization">
      Компонент визуализации истории эмоций
      <button onClick={() => onEntrySelected({ id: '1', emoji: '😊', date: '2023-06-01T12:00:00Z' })}>
        Выбрать запись
      </button>
    </div>
  )),
}));

describe('EmmoHistoryPage', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    // Настраиваем моки для хуков
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('перенаправляет на страницу входа, если пользователь не авторизован', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(<EmmoHistoryPage />);
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('отображает индикатор загрузки, если идет загрузка', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(<EmmoHistoryPage />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('отображает содержимое страницы, если пользователь авторизован', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user1' },
      isLoading: false,
    });

    render(<EmmoHistoryPage />);
    
    expect(screen.getByText('История эмоций')).toBeInTheDocument();
    expect(screen.getByText('Визуализация истории ваших эмоций на карте EMMO')).toBeInTheDocument();
    expect(screen.getByTestId('emmo-history-visualization')).toBeInTheDocument();
  });

  it('отображает детали записи при выборе записи', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user1' },
      isLoading: false,
    });

    render(<EmmoHistoryPage />);
    
    // Изначально отображается подсказка
    expect(screen.getByText('Выберите запись на карте, чтобы увидеть подробную информацию')).toBeInTheDocument();
    
    // Кликаем на кнопку "Выбрать запись"
    screen.getByText('Выбрать запись').click();
    
    // Проверяем, что отображаются детали записи
    await waitFor(() => {
      expect(screen.getByText('Детали записи')).toBeInTheDocument();
    });
  });

  it('возвращается назад при нажатии на кнопку "Назад"', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user1' },
      isLoading: false,
    });

    render(<EmmoHistoryPage />);
    
    screen.getByText('Назад').click();
    
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });
});
