'use client';

// Простая утилита для отправки аналитических событий
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  // Проверяем, что мы в браузере
  if (typeof window === 'undefined') {
    return;
  }

  // Проверяем, что мы в production окружении
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics] ${eventName}`, eventData);
    return;
  }

  // Здесь можно интегрировать любой сервис аналитики
  // Например, Google Analytics, Yandex Metrika, Amplitude и т.д.
  
  // Пример для Google Analytics
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData);
  }
}

// Отслеживание просмотра страницы
export function trackPageView(url: string) {
  trackEvent('page_view', { page_path: url });
}

// Отслеживание ошибок
export function trackError(error: Error, componentStack?: string) {
  trackEvent('error', {
    error_message: error.message,
    error_stack: error.stack,
    component_stack: componentStack,
  });
  
  // Здесь можно интегрировать сервис для отслеживания ошибок
  // Например, Sentry, LogRocket и т.д.
}

// Типы для глобального объекта window
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
  }
}
