'use client';

import { useEffect } from 'react';
import { useSupabase } from '@/hooks/use-supabase';

interface Reminder {
  id: string;
  user_id: string;
  time: string;
  days: string[];
  enabled: boolean;
  message: string;
}

// Функция для проверки, должно ли напоминание быть показано сегодня
const shouldShowToday = (days: string[]): boolean => {
  // Получаем текущий день недели (1-7, где 1 - понедельник)
  const today = new Date().getDay();
  // Преобразуем воскресенье (0) в 7 для соответствия нашему формату
  const dayOfWeek = today === 0 ? '7' : today.toString();
  return days.includes(dayOfWeek);
};

// Функция для проверки, должно ли напоминание быть показано сейчас
const shouldShowNow = (time: string): boolean => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  // Проверяем, совпадает ли текущее время с временем напоминания
  return currentHours === hours && currentMinutes === minutes;
};

// Функция для отображения уведомления
const showNotification = (message: string) => {
  if (!('Notification' in window)) {
    console.log('Браузер не поддерживает уведомления');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification('Дневник настроения', {
      body: message,
      icon: '/icons/icon-192x192.png'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Дневник настроения', {
          body: message,
          icon: '/icons/icon-192x192.png'
        });
      }
    });
  }
};

// Хук для инициализации сервиса напоминаний
export function useReminderService() {
  console.log('useReminderService: Инициализация хука');
  const { supabase, user, loading } = useSupabase();
  console.log('useReminderService: Получены данные из useSupabase', {
    supabaseInitialized: !!supabase,
    userInitialized: !!user,
    loading
  });

  useEffect(() => {
    // Проверяем, что пользователь загружен и авторизован
    if (loading) {
      console.log('Загрузка данных пользователя...');
      return;
    }

    if (!user) {
      console.log('Пользователь не авторизован, напоминания не будут загружены');
      return;
    }

    // Проверяем, что клиент Supabase инициализирован
    if (!supabase) {
      console.error('Клиент Supabase не инициализирован');
      return;
    }

    console.log('Инициализация сервиса напоминаний для пользователя:', user.id);
    console.log('Клиент Supabase инициализирован:', !!supabase);

    let checkInterval: NodeJS.Timeout;
    let reminders: Reminder[] = [];

    // Функция для загрузки напоминаний
    const fetchReminders = async () => {
      try {
        console.log('Загрузка напоминаний для пользователя:', user.id);

        // Проверяем, существует ли таблица reminders
        try {
          const { data: tableData, error: tableError } = await supabase
            .from('reminders')
            .select('count(*)')
            .limit(1);

          if (tableError) {
            console.log('Примечание: Таблица reminders может не существовать или недоступна:', tableError.message);
          } else {
            console.log('Таблица reminders существует, результат проверки:', tableData);
          }
        } catch (checkError) {
          console.log('Ошибка при проверке таблицы reminders (некритично):', checkError);
        }

        try {
          const { data, error } = await supabase
            .from('reminders')
            .select('*')
            .eq('user_id', user.id)
            .eq('enabled', true);

          if (error) {
            console.log('Примечание: Не удалось загрузить напоминания:', error.message);
          } else {
            console.log('Загруженные напоминания:', data);

            if (data) {
              reminders = data;
            }
          }
        } catch (loadError) {
          console.log('Ошибка при загрузке напоминаний (некритично):', loadError);
        }
      } catch (error) {
        console.error('Ошибка при загрузке напоминаний:', error);
        // Выводим дополнительную информацию об ошибке
        if (error instanceof Error) {
          console.error('Сообщение ошибки:', error.message);
          console.error('Стек вызовов:', error.stack);
        } else {
          console.error('Неизвестная ошибка:', error);
        }
      }
    };

    // Функция для проверки напоминаний
    const checkReminders = () => {
      const now = new Date();

      reminders.forEach(reminder => {
        if (shouldShowToday(reminder.days) && shouldShowNow(reminder.time)) {
          showNotification(reminder.message);
        }
      });
    };

    // Инициализация сервиса
    const initReminderService = async () => {
      console.log('Инициализация сервиса напоминаний...');

      // Загружаем напоминания (функция fetchReminders уже обрабатывает ошибки внутри)
      await fetchReminders();

      // Проверяем напоминания каждую минуту
      try {
        checkInterval = setInterval(() => {
          try {
            checkReminders();
          } catch (checkError) {
            console.log('Ошибка при проверке напоминаний (некритично):', checkError);
          }
        }, 60000); // 60000 мс = 1 минута

        console.log('Сервис напоминаний успешно инициализирован');
      } catch (intervalError) {
        console.log('Ошибка при настройке интервала проверки напоминаний:', intervalError);
      }
    };

    initReminderService();

    // Очистка при размонтировании
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [supabase, user]);

  return null;
}
