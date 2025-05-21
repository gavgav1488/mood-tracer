'use client';

import { useEffect } from 'react';

/**
 * Компонент для улучшения доступности с клавиатуры
 * Добавляет класс 'keyboard-focus' к body при использовании клавиатуры для навигации
 * и удаляет его при использовании мыши
 */
export function KeyboardFocusManager() {
  useEffect(() => {
    // Функция для определения использования клавиатуры
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-focus');
      }
    };

    // Функция для определения использования мыши
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-focus');
    };

    // Добавляем слушатели событий
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Добавляем стили для фокуса с клавиатуры
    const style = document.createElement('style');
    style.innerHTML = `
      .keyboard-focus :focus {
        outline: 2px solid var(--focus-ring, #0070f3) !important;
        outline-offset: 2px !important;
      }
      .keyboard-focus :focus:not(:focus-visible) {
        outline: none !important;
      }
      .keyboard-focus :focus-visible {
        outline: 2px solid var(--focus-ring, #0070f3) !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);

    // Очистка при размонтировании
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
