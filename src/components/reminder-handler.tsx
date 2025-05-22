'use client';

import { useEffect } from 'react';
import { useReminderService } from '@/lib/reminder-service';

export function ReminderHandler() {
  // Инициализируем сервис напоминаний
  try {
    useReminderService();
  } catch (error) {
    console.error('Ошибка при инициализации сервиса напоминаний:', error);
  }

  useEffect(() => {
    // Запрашиваем разрешение на уведомления при загрузке страницы
    const requestNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };

    requestNotificationPermission();

    // Обработчик сообщений от сервис-воркера
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GET_REMINDER_INFO') {
        // Получаем информацию о напоминании из localStorage
        const reminderInfo = localStorage.getItem('reminder-info');

        if (reminderInfo) {
          // Отправляем информацию сервис-воркеру
          navigator.serviceWorker.controller?.postMessage({
            type: 'REMINDER_INFO',
            data: JSON.parse(reminderInfo)
          });
        }
      } else if (event.data.type === 'UPDATE_LAST_NOTIFICATION') {
        // Обновляем время последнего уведомления
        const reminderInfo = localStorage.getItem('reminder-info');

        if (reminderInfo) {
          const parsedInfo = JSON.parse(reminderInfo);
          parsedInfo.lastNotification = event.data.data;

          localStorage.setItem('reminder-info', JSON.stringify(parsedInfo));
        }
      }
    };

    // Регистрируем обработчик сообщений
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    return () => {
      // Удаляем обработчик при размонтировании компонента
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  // Компонент не рендерит ничего видимого
  return null;
}
