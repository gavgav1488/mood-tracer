'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  addMonths,
  subMonths,
  getMonth,
  getYear
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

// Цветовые схемы для разных эмодзи
const emojiColors: Record<string, { bg: string; border: string }> = {
  '😊': { bg: 'rgba(255, 215, 0, 0.2)', border: 'rgba(255, 215, 0, 1)' }, // Радость: желтый
  '😐': { bg: 'rgba(169, 169, 169, 0.2)', border: 'rgba(169, 169, 169, 1)' }, // Нейтрально: серый
  '😢': { bg: 'rgba(70, 130, 180, 0.2)', border: 'rgba(70, 130, 180, 1)' }, // Грусть: синий
  '🥳': { bg: 'rgba(255, 105, 180, 0.2)', border: 'rgba(255, 105, 180, 1)' }, // Восторг: розовый
  '😤': { bg: 'rgba(220, 20, 60, 0.2)', border: 'rgba(220, 20, 60, 1)' }, // Злость: красный
  '😴': { bg: 'rgba(147, 112, 219, 0.2)', border: 'rgba(147, 112, 219, 1)' }, // Усталость: фиолетовый
  '😰': { bg: 'rgba(32, 178, 170, 0.2)', border: 'rgba(32, 178, 170, 1)' }, // Тревога: бирюзовый
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

export function MonthlyMoodStats() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { getMoodEntries } = useSupabase();

  // Загрузка записей при монтировании компонента и при изменении месяца
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const fetchedEntries = await getMoodEntries();
        setEntries(fetchedEntries);
      } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [getMoodEntries]);

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

  // Фильтрация записей по текущему месяцу
  const getFilteredEntries = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });
  };

  // Подготовка данных для графика распределения настроений
  const prepareMoodDistributionData = () => {
    const filteredEntries = getFilteredEntries();
    
    // Подсчитываем количество каждого эмодзи
    const emojiCounts: Record<string, number> = {};
    
    filteredEntries.forEach(entry => {
      emojiCounts[entry.emoji] = (emojiCounts[entry.emoji] || 0) + 1;
    });
    
    // Преобразуем в формат для графика
    const labels = Object.keys(emojiCounts).map(emoji => emojiLabels[emoji] || emoji);
    const data = Object.keys(emojiCounts).map(emoji => emojiCounts[emoji]);
    const backgroundColor = Object.keys(emojiCounts).map(emoji => emojiColors[emoji]?.bg || 'rgba(169, 169, 169, 0.2)');
    const borderColor = Object.keys(emojiCounts).map(emoji => emojiColors[emoji]?.border || 'rgba(169, 169, 169, 1)');
    
    return {
      labels,
      datasets: [
        {
          label: 'Распределение настроений',
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    };
  };

  // Подготовка данных для графика настроений по дням
  const prepareDailyMoodData = () => {
    const filteredEntries = getFilteredEntries();
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    // Создаем массив всех дней в месяце
    const days = eachDayOfInterval({ start, end });
    
    // Подготавливаем данные для графика
    const labels = days.map(day => format(day, 'd', { locale: ru }));
    
    // Создаем числовое представление эмодзи для графика
    const emojiValues: Record<string, number> = {
      '🥳': 6, // Восторг
      '😊': 5, // Радость
      '😐': 3, // Нейтрально
      '😴': 2, // Усталость
      '😢': 1, // Грусть
      '😰': 0, // Тревога
      '😤': -1, // Злость
    };
    
    const data = days.map(day => {
      // Находим запись для текущего дня
      const entry = filteredEntries.find(e => isSameDay(new Date(e.date), day));
      
      // Если запись найдена, возвращаем числовое значение эмодзи, иначе null
      return entry ? (emojiValues[entry.emoji] ?? 3) : null;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Настроение',
          data,
          backgroundColor: 'rgba(147, 51, 234, 0.2)',
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  // Опции для графика
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw} записей`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // Опции для круговой диаграммы
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredEntries = getFilteredEntries();
  const hasData = filteredEntries.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Статистика по месяцам</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium min-w-[120px] text-center">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Распределение настроений</CardTitle>
            <CardDescription>
              {hasData 
                ? `Всего записей: ${filteredEntries.length}` 
                : 'Нет данных за выбранный период'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {hasData ? (
              <Pie data={prepareMoodDistributionData()} options={pieOptions} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">Нет данных за выбранный период</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Настроение по дням</CardTitle>
            <CardDescription>
              {hasData 
                ? `${format(currentMonth, 'LLLL yyyy', { locale: ru })}` 
                : 'Нет данных за выбранный период'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {hasData ? (
              <Bar data={prepareDailyMoodData()} options={barOptions} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">Нет данных за выбранный период</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
