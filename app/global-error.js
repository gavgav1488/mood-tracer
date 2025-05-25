'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}) {
  useEffect(() => {
    // Временно отключаем Sentry для устранения ошибки
    // TODO: Настроить Sentry правильно
    // Sentry.captureException(error);

    // Отладочная информация
    console.error('Global Error:', error);
    console.log('Reset function type:', typeof reset);
  }, [error, reset]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Что-то пошло не так!</h1>
          <p className="mb-6">Произошла непредвиденная ошибка. Наша команда уже работает над её устранением.</p>
          <button
            onClick={() => {
              if (typeof reset === 'function') {
                reset();
              } else {
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}
