import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from './auth-form';
import { createBrowserClient } from '@supabase/ssr';

// Мокаем модуль @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

describe('AuthForm', () => {
  let mockSignInWithOAuth: jest.Mock;
  
  beforeEach(() => {
    // Создаем мок для метода signInWithOAuth
    mockSignInWithOAuth = jest.fn();
    
    // Настраиваем мок для createBrowserClient
    (createBrowserClient as jest.Mock).mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
      },
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly', () => {
    render(<AuthForm />);
    
    // Проверяем, что заголовок отображается
    expect(screen.getByText('Вход в дневник настроения')).toBeInTheDocument();
    
    // Проверяем, что кнопки входа отображаются
    expect(screen.getByText('Войти через Google')).toBeInTheDocument();
    expect(screen.getByText('Войти через VK')).toBeInTheDocument();
    expect(screen.getByText('Войти через Telegram')).toBeInTheDocument();
  });
  
  it('calls signInWithOAuth with Google provider when Google button is clicked', async () => {
    render(<AuthForm />);
    
    // Находим кнопку входа через Google и кликаем по ней
    const googleButton = screen.getByText('Войти через Google');
    fireEvent.click(googleButton);
    
    // Проверяем, что метод signInWithOAuth был вызван с правильными параметрами
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.any(String),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
    });
  });
  
  it('calls signInWithOAuth with VK provider when VK button is clicked', async () => {
    render(<AuthForm />);
    
    // Находим кнопку входа через VK и кликаем по ней
    const vkButton = screen.getByText('Войти через VK');
    fireEvent.click(vkButton);
    
    // Проверяем, что метод signInWithOAuth был вызван с правильными параметрами
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'vk',
        options: {
          redirectTo: expect.any(String),
        },
      });
    });
  });
  
  it('calls signInWithOAuth with Telegram provider when Telegram button is clicked', async () => {
    render(<AuthForm />);
    
    // Находим кнопку входа через Telegram и кликаем по ней
    const telegramButton = screen.getByText('Войти через Telegram');
    fireEvent.click(telegramButton);
    
    // Проверяем, что метод signInWithOAuth был вызван с правильными параметрами
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'telegram',
        options: {
          redirectTo: expect.any(String),
        },
      });
    });
  });
});
