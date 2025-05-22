'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  getDaysInMonth,
  getDate,
  isToday
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Цветовые схемы для разных эмодзи
const emojiColors: Record<string, { bg: string; text: string }> = {
  '😊': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' }, // Радость
  '😐': { bg: 'bg-gray-100 dark:bg-gray-800/50', text: 'text-gray-600 dark:text-gray-400' }, // Нейтрально
  '😢': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' }, // Грусть
  '🥳': { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' }, // Восторг
  '😤': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' }, // Злость
  '😴': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' }, // Усталость
  '😰': { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400' }, // Тревога
};

// Дни недели
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function MiniMoodCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { getMoodEntries } = useSupabase();

  // Мемоизированная функция для фильтрации записей по текущему месяцу
  const filterEntriesByMonth = useCallback((allEntries: MoodEntry[], month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);

    return allEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });
  }, []);

  // Загрузка записей при монтировании компонента и при изменении месяца
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);

      try {
        const fetchedEntries = await getMoodEntries();
        // Фильтруем записи по текущему месяцу
        const filteredEntries = filterEntriesByMonth(fetchedEntries, currentMonth);
        setEntries(filteredEntries);
      } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [getMoodEntries, currentMonth, filterEntriesByMonth]);

  // Переход к предыдущему месяцу
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  // Переход к следующему месяцу
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  // Переход к текущему месяцу
  const handleCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  // Обработчик клика по дню
  const handleDayClick = (day: Date) => {
    // Находим запись для выбранного дня
    const entry = entries.find(e => isSameDay(new Date(e.date), day));

    // Если запись найдена, перенаправляем на страницу календаря
    if (entry) {
      router.push('/diary?tab=calendar');
    }
  };

  // Функция для создания календарной сетки
  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = startOfMonth(currentMonth);
    const dayOfWeek = getDay(firstDayOfMonth) || 7; // Преобразуем 0 (воскресенье) в 7

    const days = [];

    // Добавляем пустые ячейки для дней до начала месяца
    for (let i = 1; i < dayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-7 w-7 text-center text-xs p-0" />
      );
    }

    // Добавляем дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const entry = entries.find(e => isSameDay(new Date(e.date), day));

      const colors = entry ? (emojiColors[entry.emoji] || emojiColors['😐']) : { bg: '', text: '' };

      days.push(
        <div
          key={`day-${i}`}
          className={cn(
            "h-7 w-7 text-center text-xs p-0 relative flex items-center justify-center cursor-pointer rounded-md",
            colors.bg,
            isToday(day) ? "ring-1 ring-primary" : "",
            entry ? "font-medium" : ""
          )}
          onClick={() => handleDayClick(day)}
        >
          <div className="flex flex-col items-center justify-center">
            <span className={cn('text-xs', colors.text)}>{i}</span>
            {entry && <span className="text-[8px]">{entry.emoji}</span>}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-6 w-6 rounded-full"
              disabled={loading}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCurrentMonth}
              className="h-6 w-6 rounded-full"
              disabled={loading}
            >
              <CalendarIcon className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-6 w-6 rounded-full"
              disabled={loading}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="rounded-md border p-1">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center text-xs text-muted-foreground font-normal">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderCalendarGrid()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
