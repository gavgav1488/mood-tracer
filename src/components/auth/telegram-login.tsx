'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@supabase/ssr';

interface TelegramLoginProps {
  redirectUrl?: string;
  onLoginStart?: () => void;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export function TelegramLogin({ redirectUrl = '/diary', onLoginStart }: TelegramLoginProps) {
  const telegramRef = useRef<HTMLDivElement>(null);
  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;

  useEffect(() => {
    // Проверяем, загружен ли уже скрипт Telegram
    if (!document.getElementById('telegram-login-script')) {
      const script = document.createElement('script');
      script.id = 'telegram-login-script';
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      document.body.appendChild(script);
    }

    // Функция для обработки данных аутентификации от Telegram
    window.TelegramLoginWidget = {
      dataOnauth: handleTelegramAuth
    };

    // Создаем виджет после загрузки скрипта
    const interval = setInterval(() => {
      if (telegramRef.current && botName && window.Telegram) {
        clearInterval(interval);
        telegramRef.current.innerHTML = '';
        
        window.Telegram.Login.auth(
          { 
            bot_id: botName,
            request_access: true,
            lang: 'ru'
          },
          'TelegramLoginWidget.dataOnauth'
        );
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [botName]);

  const handleTelegramAuth = async (user: TelegramUser) => {
    if (onLoginStart) {
      onLoginStart();
    }

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Отправляем данные на сервер для проверки и аутентификации
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Ошибка аутентификации через Telegram');
      }

      const { token } = await response.json();

      // Используем полученный токен для входа через Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: `telegram-${user.id}@telegram.auth`,
        password: token,
      });

      if (error) {
        throw error;
      }

      // Перенаправляем пользователя после успешной аутентификации
      window.location.href = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`;
    } catch (error) {
      console.error('Ошибка при входе через Telegram:', error);
    }
  };

  return (
    <div className="w-full">
      {!botName ? (
        <Button
          variant="outline"
          className="w-full"
          disabled={true}
        >
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
          >
            <path
              fill="currentColor"
              d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"
            ></path>
          </svg>
          Войти через Telegram
        </Button>
      ) : (
        <div 
          ref={telegramRef} 
          className="flex justify-center"
          aria-label="Войти через Telegram"
        />
      )}
    </div>
  );
}
