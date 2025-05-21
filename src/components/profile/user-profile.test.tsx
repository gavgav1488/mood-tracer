import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfile } from './user-profile';
import { useAuth } from '@/context/auth-context';
import { useSupabase } from '@/hooks/use-supabase';

// Мокаем хуки
jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-supabase', () => ({
  useSupabase: jest.fn(),
}));

describe('UserProfile', () => {
  // Настройка моков перед каждым тестом
  beforeEach(() => {
    // Мок для useAuth
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Тестовый Пользователь',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      },
    });

    // Мок для useSupabase
    const updateUserSettingsMock = jest.fn().mockResolvedValue({ id: 'test-settings-id' });
    (useSupabase as jest.Mock).mockReturnValue({
      updateUserSettings: updateUserSettingsMock,
    });
  });

  it('отображает информацию о пользователе', () => {
    render(<UserProfile />);
    
    // Проверяем, что имя пользователя отображается
    expect(screen.getByText('Тестовый Пользователь')).toBeInTheDocument();
    
    // Проверяем, что email пользователя отображается
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    // Проверяем, что аватар пользователя отображается
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('позволяет изменить настройки приватности', async () => {
    render(<UserProfile />);
    
    // Находим переключатель приватности
    const privacySwitch = screen.getByRole('switch', { name: /публичный профиль/i });
    
    // Проверяем, что переключатель изначально выключен
    expect(privacySwitch).not.toBeChecked();
    
    // Включаем переключатель
    fireEvent.click(privacySwitch);
    
    // Проверяем, что переключатель включен
    expect(privacySwitch).toBeChecked();
    
    // Нажимаем на кнопку сохранения
    fireEvent.click(screen.getByRole('button', { name: /сохранить настройки/i }));
    
    // Проверяем, что функция updateUserSettings была вызвана с правильными параметрами
    await waitFor(() => {
      expect(useSupabase().updateUserSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          is_public: true,
        })
      );
    });
    
    // Проверяем, что отображается сообщение об успешном сохранении
    await waitFor(() => {
      expect(screen.getByText(/настройки успешно сохранены/i)).toBeInTheDocument();
    });
  });

  it('не отображается, если пользователь не аутентифицирован', () => {
    // Переопределяем мок для useAuth, чтобы вернуть null для пользователя
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });
    
    const { container } = render(<UserProfile />);
    
    // Проверяем, что компонент не отображается (пустой контейнер)
    expect(container.firstChild).toBeNull();
  });
});
