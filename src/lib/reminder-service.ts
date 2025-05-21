'use client';

import { useEffect } from 'react';
import { useSupabase } from '@/hooks/use-supabase';

interface Reminder {
  id: string;
  userId: string;
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
  const { supabase, user } = useSupabase();
  
  useEffect(() => {
    if (!user) return;
    
    let checkInterval: NodeJS.Timeout;
    let reminders: Reminder[] = [];
    
    // Функция для загрузки напоминаний
    const fetchReminders = async () => {
      try {
        const { data, error } = await supabase
          .from('reminders')
          .select('*')
          .eq('userId', user.id)
          .eq('enabled', true);
          
        if (error) throw error;
        
        if (data) {
          reminders = data;
        }
      } catch (error) {
        console.error('Ошибка при загрузке напоминаний:', error);
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
      await fetchReminders();
      
      // Проверяем напоминания каждую минуту
      checkInterval = setInterval(() => {
        checkReminders();
      }, 60000); // 60000 мс = 1 минута
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
