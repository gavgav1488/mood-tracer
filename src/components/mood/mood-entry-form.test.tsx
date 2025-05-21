import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MoodEntryForm } from './mood-entry-form';
import { useAuth } from '@/context/auth-context';
import { useSupabase } from '@/hooks/use-supabase';

// Мокаем хуки
jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-supabase', () => ({
  useSupabase: jest.fn(),
}));

describe('MoodEntryForm', () => {
  // Настройка моков перед каждым тестом
  beforeEach(() => {
    // Мок для useAuth
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'test-user-id' },
    });

    // Мок для useSupabase
    const createMoodEntryMock = jest.fn().mockResolvedValue({ id: 'test-entry-id' });
    (useSupabase as jest.Mock).mockReturnValue({
      createMoodEntry: createMoodEntryMock,
    });
  });

  it('отображает форму с эмодзи и текстовым полем', () => {
    render(<MoodEntryForm />);
    
    // Проверяем, что заголовок формы отображается
    expect(screen.getByText('Как вы себя чувствуете сегодня?')).toBeInTheDocument();
    
    // Проверяем, что эмодзи отображаются
    expect(screen.getByText('😊')).toBeInTheDocument();
    expect(screen.getByText('😔')).toBeInTheDocument();
    
    // Проверяем, что текстовое поле отображается
    expect(screen.getByPlaceholderText(/напишите о своих чувствах/i)).toBeInTheDocument();
    
    // Проверяем, что кнопка сохранения отображается
    expect(screen.getByRole('button', { name: /сохранить/i })).toBeInTheDocument();
  });

  it('позволяет выбрать эмодзи', () => {
    render(<MoodEntryForm />);
    
    // Выбираем эмодзи
    fireEvent.click(screen.getByText('😊'));
    
    // Проверяем, что эмодзи выбрано (имеет класс активного элемента)
    expect(screen.getByText('😊').closest('button')).toHaveClass('ring-2');
  });

  it('позволяет ввести текст в поле заметки', () => {
    render(<MoodEntryForm />);
    
    // Вводим текст в поле заметки
    const noteInput = screen.getByPlaceholderText(/напишите о своих чувствах/i);
    fireEvent.change(noteInput, { target: { value: 'Тестовая заметка' } });
    
    // Проверяем, что текст введен
    expect(noteInput).toHaveValue('Тестовая заметка');
  });

  it('сохраняет запись при нажатии на кнопку', async () => {
    render(<MoodEntryForm />);
    
    // Выбираем эмодзи
    fireEvent.click(screen.getByText('😊'));
    
    // Вводим текст в поле заметки
    const noteInput = screen.getByPlaceholderText(/напишите о своих чувствах/i);
    fireEvent.change(noteInput, { target: { value: 'Тестовая заметка' } });
    
    // Нажимаем на кнопку сохранения
    fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));
    
    // Проверяем, что функция createMoodEntry была вызвана с правильными параметрами
    await waitFor(() => {
      expect(useSupabase().createMoodEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          emoji: '😊',
          note: 'Тестовая заметка',
        })
      );
    });
    
    // Проверяем, что отображается сообщение об успешном сохранении
    await waitFor(() => {
      expect(screen.getByText(/запись сохранена/i)).toBeInTheDocument();
    });
  });
});
