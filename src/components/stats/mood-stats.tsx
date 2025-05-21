'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
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
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';

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

// Цвета для разных эмодзи
const emojiColors: Record<string, string> = {
  '😊': '#FFD700', // Радость: желтый
  '😐': '#A9A9A9', // Нейтрально: серый
  '😢': '#4682B4', // Грусть: синий
  '🥳': '#FF69B4', // Восторг: розовый
  '😤': '#DC143C', // Злость: красный
  '😴': '#9370DB', // Усталость: фиолетовый
  '😰': '#20B2AA', // Тревога: бирюзовый
};

// Функция для получения названия эмодзи
const getEmojiName = (emoji: string) => {
  const emojiMap: Record<string, string> = {
    '😊': 'Радость',
    '😐': 'Нейтрально',
    '😢': 'Грусть',
    '🥳': 'Восторг',
    '😤': 'Злость',
    '😴': 'Усталость',
    '😰': 'Тревога',
  };
  
  // Проверяем, есть ли пользовательские эмодзи
  if (typeof window !== 'undefined') {
    try {
      const savedEmojis = localStorage.getItem('custom-emojis');
      if (savedEmojis) {
        const customEmojis = JSON.parse(savedEmojis);
        const customEmojiMap = customEmojis.reduce((acc: Record<string, string>, item: any) => {
          acc[item.emoji] = item.label;
          return acc;
        }, {});
        
        return customEmojiMap[emoji] || emojiMap[emoji] || emoji;
      }
    } catch (error) {
      console.error('Ошибка при загрузке пользовательских эмодзи:', error);
    }
  }
  
  return emojiMap[emoji] || emoji;
};

// Функция для получения цвета эмодзи
const getEmojiColor = (emoji: string) => {
  return emojiColors[emoji] || '#808080'; // Серый цвет по умолчанию
};

export function MoodStats() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const { getMoodEntries } = useSupabase();

  // Загрузка записей при монтировании компонента
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const data = await getMoodEntries();
        setEntries(data);
      } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [getMoodEntries]);

  // Фильтрация записей по выбранному периоду
  const getFilteredEntries = () => {
    const now = new Date();
    
    if (period === 'week') {
      const weekAgo = subDays(now, 7);
      return entries.filter(entry => new Date(entry.date) >= weekAgo);
    } else if (period === 'month') {
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });
    } else {
      // За год
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      return entries.filter(entry => new Date(entry.date) >= yearAgo);
    }
  };

  // Подготовка данных для графика настроения по дням
  const prepareMoodTimelineData = () => {
    const filteredEntries = getFilteredEntries();
    
    // Определяем диапазон дат
    let startDate, endDate;
    const now = new Date();
    
    if (period === 'week') {
      startDate = subDays(now, 7);
      endDate = now;
    } else if (period === 'month') {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    } else {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      endDate = now;
    }
    
    // Создаем массив всех дней в диапазоне
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Подготавливаем данные для графика
    const labels = days.map(day => format(day, 'dd MMM', { locale: ru }));
    
    // Создаем числовое представление эмодзи для графика
    // Например: 😊 = 5, 😐 = 3, 😢 = 1
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
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: days.map(day => {
            const entry = filteredEntries.find(e => isSameDay(new Date(e.date), day));
            return entry ? getEmojiColor(entry.emoji) : 'rgba(0, 0, 0, 0)';
          }),
          pointRadius: days.map(day => {
            const entry = filteredEntries.find(e => isSameDay(new Date(e.date), day));
            return entry ? 6 : 0;
          }),
          spanGaps: true,
        },
      ],
    };
  };

  // Подготовка данных для диаграммы распределения настроений
  const prepareMoodDistributionData = () => {
    const filteredEntries = getFilteredEntries();
    
    // Подсчитываем количество каждого эмодзи
    const emojiCounts: Record<string, number> = {};
    
    filteredEntries.forEach(entry => {
      emojiCounts[entry.emoji] = (emojiCounts[entry.emoji] || 0) + 1;
    });
    
    // Преобразуем в формат для диаграммы
    const labels = Object.keys(emojiCounts);
    const data = Object.values(emojiCounts);
    const backgroundColor = labels.map(emoji => getEmojiColor(emoji));
    
    return {
      labels: labels.map(emoji => `${emoji} ${getEmojiName(emoji)}`),
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: backgroundColor.map(color => color.replace('1)', '1)')),
          borderWidth: 1,
        },
      ],
    };
  };

  // Опции для графиков
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const index = context.dataIndex;
            const day = new Date(subDays(new Date(), 7 - index));
            const entry = entries.find(e => isSameDay(new Date(e.date), day));
            
            if (entry) {
              return `${entry.emoji} ${getEmojiName(entry.emoji)}`;
            }
            return 'Нет данных';
          }
        }
      }
    },
    scales: {
      y: {
        min: -2,
        max: 7,
        ticks: {
          callback: function(value: any) {
            const emojiForValue: Record<number, string> = {
              6: '🥳 Восторг',
              5: '😊 Радость',
              3: '😐 Нейтрально',
              2: '😴 Усталость',
              1: '😢 Грусть',
              0: '😰 Тревога',
              '-1': '😤 Злость',
            };
            return emojiForValue[value] || '';
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Статистика настроения</CardTitle>
          <CardDescription>Загрузка данных...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика настроения</CardTitle>
        <CardDescription>Анализ ваших записей о настроении</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="timeline">Динамика</TabsTrigger>
            <TabsTrigger value="distribution">Распределение</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-center mb-4">
            <TabsList>
              <TabsTrigger 
                value="week" 
                onClick={() => setPeriod('week')}
                className={period === 'week' ? 'bg-primary text-primary-foreground' : ''}
              >
                Неделя
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                onClick={() => setPeriod('month')}
                className={period === 'month' ? 'bg-primary text-primary-foreground' : ''}
              >
                Месяц
              </TabsTrigger>
              <TabsTrigger 
                value="year" 
                onClick={() => setPeriod('year')}
                className={period === 'year' ? 'bg-primary text-primary-foreground' : ''}
              >
                Год
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="timeline" className="h-64">
            {getFilteredEntries().length > 0 ? (
              <Line data={prepareMoodTimelineData()} options={lineOptions} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">Нет данных за выбранный период</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="distribution" className="h-64">
            {getFilteredEntries().length > 0 ? (
              <Pie data={prepareMoodDistributionData()} options={pieOptions} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">Нет данных за выбранный период</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
