'use client';

import { useEffect, useState } from 'react';

/**
 * Компонент для пропуска навигации и перехода к основному содержимому
 * Полезно для пользователей скринридеров и клавиатурной навигации
 */
export function SkipLink() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      setIsVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleClick = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
    setIsVisible(false);
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-md transition-all ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'
      } focus:opacity-100 focus:translate-y-0 text-sm font-medium`}
    >
      Перейти к содержимому
    </a>
  );
}
