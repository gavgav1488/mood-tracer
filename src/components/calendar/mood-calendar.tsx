'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

// Названия эмоций
const emojiLabels: Record<string, string> = {
  '😊': 'Радость',
  '😐': 'Нейтрально',
  '😢': 'Грусть',
  '🥳': 'Восторг',
  '😤': 'Злость',
  '😴': 'Усталость',
  '😰': 'Тревога',
};

export function MoodCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const { getMoodEntries } = useSupabase();

  // Мемоизированная функция для фильтрации записей по текущему месяцу
  const filterEntriesByMonth = React.useCallback((allEntries: MoodEntry[], month: Date) => {
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
      setError(null);

      try {
        const fetchedEntries = await getMoodEntries();

        // Фильтруем записи по текущему месяцу
        const filteredEntries = filterEntriesByMonth(fetchedEntries, currentMonth);

        setEntries(filteredEntries);
      } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
        setError('Не удалось загрузить записи. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [getMoodEntries, currentMonth, filterEntriesByMonth]);

  // Обработчик выбора даты
  const handleSelect = (day: Date | undefined) => {
    if (!day) return;

    setDate(day);

    // Находим запись для выбранного дня
    const entry = entries.find(e => isSameDay(new Date(e.date), day));
    setSelectedEntry(entry || null);
  };

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

  // Функция для отображения дня в календаре с мемоизацией для оптимизации производительности
  const dayRenderer = React.useCallback((day: Date, selectedDay: Date | undefined, props: React.HTMLAttributes<HTMLDivElement>) => {
    // Находим запись для текущего дня
    const entry = entries.find(e => isSameDay(new Date(e.date), day));

    if (!entry) {
      return <div {...props}>{format(day, 'd')}</div>;
    }

    const colors = emojiColors[entry.emoji] || emojiColors['😐'];

    return (
      <div
        {...props}
        className={cn(
          props.className,
          colors.bg,
          'relative flex items-center justify-center font-medium border border-border/30',
          isSameDay(day, selectedDay) ? 'ring-2 ring-primary' : ''
        )}
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className={cn('text-sm font-medium', colors.text)}>{format(day, 'd')}</span>
          <span className="text-[10px] mt-0.5">{entry.emoji}</span>
        </div>
      </div>
    );
  }, [entries]);

  // Мемоизированное отображение легенды эмодзи
  const EmojiLegend = React.useMemo(() => (
    <div className="flex flex-wrap gap-2 mt-4 justify-center">
      {Object.entries(emojiLabels).map(([emoji, label]) => (
        <div
          key={emoji}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
            emojiColors[emoji]?.bg
          )}
        >
          <span className="text-xs">{emoji}</span>
          <span className={cn("font-medium", emojiColors[emoji]?.text)}>{label}</span>
        </div>
      ))}
    </div>
  ), []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Календарь настроения</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8 rounded-full"
            disabled={loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={handleCurrentMonth}
            className="h-8 rounded-full text-xs"
            disabled={loading}
          >
            <CalendarIcon className="mr-1 h-3.5 w-3.5" />
            Сегодня
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8 rounded-full"
            disabled={loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-center text-lg">
                {format(currentMonth, 'LLLL yyyy', { locale: ru })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    month={currentMonth}
                    className="rounded-md border"
                    components={{
                      Day: dayRenderer
                    }}
                    locale={ru}
                  />
                  {EmojiLegend}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Детали записи</CardTitle>
              <CardDescription>
                {selectedEntry
                  ? format(new Date(selectedEntry.date), 'd MMMM yyyy', { locale: ru })
                  : 'Выберите день для просмотра деталей'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : selectedEntry ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-full",
                      emojiColors[selectedEntry.emoji]?.bg || "bg-gray-100 dark:bg-gray-800"
                    )}>
                      <span className="text-xl">{selectedEntry.emoji}</span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {emojiLabels[selectedEntry.emoji] || 'Настроение'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(selectedEntry.date), 'EEEE', { locale: ru })}
                      </div>
                    </div>
                  </div>

                  {selectedEntry.note && (
                    <div className="pt-2 border-t">
                      <div className="text-sm font-medium mb-1">Заметка:</div>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-60 overflow-y-auto">
                        {selectedEntry.note}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Выберите день с записью для просмотра деталей
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
