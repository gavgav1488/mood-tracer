'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { Loader2, Calendar, BarChart3, PieChart, LineChart, TrendingUp, Download } from 'lucide-react';
import { 
  format, 
  subDays, 
  subMonths, 
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth, 
  endOfMonth, 
  startOfYear,
  endOfYear,
  eachDayOfInterval, 
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameDay,
  isSameWeek,
  isSameMonth,
  differenceInDays,
  addDays,
  getDay
} from 'date-fns';
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
import { Line, Bar, Pie, Radar, Doughnut } from 'react-chartjs-2';
import { Badge } from '@/components/ui/badge';

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

export function AdvancedMoodStats() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year', 'all'
  const [chartType, setChartType] = useState('line'); // 'line', 'bar', 'pie', 'radar'
  const { getMoodEntries } = useSupabase();

  // Загрузка записей при монтировании компонента
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

  // Функция для получения эмодзи в виде текста
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
    return emojiMap[emoji] || emoji;
  };

  // Функция для получения цвета эмодзи
  const getEmojiColor = (emoji: string) => {
    const colorMap: Record<string, string> = {
      '😊': 'rgba(255, 193, 7, 0.7)', // Радость - желтый
      '😐': 'rgba(158, 158, 158, 0.7)', // Нейтрально - серый
      '😢': 'rgba(33, 150, 243, 0.7)', // Грусть - синий
      '🥳': 'rgba(233, 30, 99, 0.7)', // Восторг - розовый
      '😤': 'rgba(244, 67, 54, 0.7)', // Злость - красный
      '😴': 'rgba(103, 58, 183, 0.7)', // Усталость - фиолетовый
      '😰': 'rgba(0, 150, 136, 0.7)', // Тревога - бирюзовый
    };
    return colorMap[emoji] || 'rgba(158, 158, 158, 0.7)';
  };

  // Функция для получения числового значения эмодзи
  const getEmojiValue = (emoji: string) => {
    const valueMap: Record<string, number> = {
      '🥳': 6, // Восторг
      '😊': 5, // Радость
      '😐': 3, // Нейтрально
      '😴': 2, // Усталость
      '😢': 1, // Грусть
      '😰': 0, // Тревога
      '😤': -1, // Злость
    };
    return valueMap[emoji] ?? 3;
  };

  // Получение отфильтрованных записей в зависимости от выбранного временного диапазона
  const getFilteredEntries = () => {
    if (entries.length === 0) return [];

    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = startOfWeek(now, { locale: ru });
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        break;
      case 'all':
      default:
        return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return entries
      .filter(entry => new Date(entry.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Подготовка данных для графика динамики настроения
  const prepareMoodTimelineData = () => {
    const filteredEntries = getFilteredEntries();
    if (filteredEntries.length === 0) return null;

    // Определяем начальную и конечную даты
    const startDate = new Date(filteredEntries[0].date);
    const endDate = new Date(filteredEntries[filteredEntries.length - 1].date);
    
    // Если записей мало или они все за один день, добавляем дополнительный день
    if (isSameDay(startDate, endDate)) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    // Создаем массив всех дней в диапазоне
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Подготавливаем данные для графика
    const labels = days.map(day => format(day, 'dd MMM', { locale: ru }));
    
    // Создаем числовое представление эмодзи для графика
    const data = days.map(day => {
      // Находим запись для текущего дня
      const entry = filteredEntries.find(e => isSameDay(new Date(e.date), day));
      
      // Если запись найдена, возвращаем числовое значение эмодзи, иначе null
      return entry ? getEmojiValue(entry.emoji) : null;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Настроение',
          data,
          borderColor: 'rgba(147, 51, 234, 1)',
          backgroundColor: 'rgba(147, 51, 234, 0.2)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: 'rgba(147, 51, 234, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 4,
          pointHoverRadius: 6,
          spanGaps: true,
        },
      ],
    };
  };

  // Подготовка данных для диаграммы распределения настроений
  const prepareMoodDistributionData = () => {
    const filteredEntries = getFilteredEntries();
    if (filteredEntries.length === 0) return null;
    
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
          borderColor: backgroundColor.map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  // Подготовка данных для диаграммы настроения по дням недели
  const prepareMoodByWeekdayData = () => {
    const filteredEntries = getFilteredEntries();
    if (filteredEntries.length === 0) return null;
    
    // Названия дней недели
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    // Инициализируем массивы для подсчета и суммирования настроений по дням недели
    const counts = Array(7).fill(0);
    const sums = Array(7).fill(0);
    
    // Подсчитываем сумму и количество настроений для каждого дня недели
    filteredEntries.forEach(entry => {
      const date = new Date(entry.date);
      // Преобразуем день недели из формата JS (0 = воскресенье) в наш формат (0 = понедельник)
      const dayIndex = (getDay(date) + 6) % 7;
      counts[dayIndex]++;
      sums[dayIndex] += getEmojiValue(entry.emoji);
    });
    
    // Вычисляем среднее настроение для каждого дня недели
    const averages = counts.map((count, index) => count > 0 ? sums[index] / count : 0);
    
    return {
      labels: weekdays,
      datasets: [
        {
          label: 'Среднее настроение',
          data: averages,
          backgroundColor: 'rgba(147, 51, 234, 0.7)',
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Опции для линейного графика
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            if (value === null) return 'Нет данных';
            
            // Находим эмодзи по числовому значению
            const emoji = Object.keys(getEmojiValue).find(key => getEmojiValue(key) === value);
            return emoji ? `${emoji} ${getEmojiName(emoji)}` : `Значение: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: -1,
        max: 6,
        ticks: {
          stepSize: 1,
          callback: function(value: number) {
            const emojiValues = {
              '-1': '😤',
              '0': '😰',
              '1': '😢',
              '2': '😴',
              '3': '😐',
              '5': '😊',
              '6': '🥳',
            };
            return emojiValues[value.toString() as keyof typeof emojiValues] || '';
          }
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
      }
    }
  };

  // Опции для столбчатой диаграммы
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Получаем отфильтрованные записи
  const filteredEntries = useMemo(() => getFilteredEntries(), [entries, timeRange]);
  
  // Проверяем, есть ли данные
  const hasData = filteredEntries.length > 0;

  // Получаем данные для графиков
  const timelineData = useMemo(() => prepareMoodTimelineData(), [filteredEntries]);
  const distributionData = useMemo(() => prepareMoodDistributionData(), [filteredEntries]);
  const weekdayData = useMemo(() => prepareMoodByWeekdayData(), [filteredEntries]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Аналитика настроения</h2>
          <p className="text-muted-foreground">
            Детальный анализ ваших эмоций и настроения
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="year">Год</SelectItem>
              <SelectItem value="all">Все время</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!hasData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Нет данных для анализа</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Для отображения статистики необходимо добавить записи о настроении. 
              Чем больше записей вы сделаете, тем точнее будет анализ.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Всего записей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{filteredEntries.length}</div>
                  <Badge variant="outline" className="text-xs">
                    {timeRange === 'week' ? 'За неделю' : 
                     timeRange === 'month' ? 'За месяц' : 
                     timeRange === 'year' ? 'За год' : 'За все время'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Преобладающее настроение</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Находим самое частое настроение
                  const emojiCounts: Record<string, number> = {};
                  filteredEntries.forEach(entry => {
                    emojiCounts[entry.emoji] = (emojiCounts[entry.emoji] || 0) + 1;
                  });
                  
                  const mostFrequentEmoji = Object.entries(emojiCounts)
                    .sort((a, b) => b[1] - a[1])[0][0];
                  
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-3xl mr-2">{mostFrequentEmoji}</span>
                        <span className="text-lg font-medium">{getEmojiName(mostFrequentEmoji)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((emojiCounts[mostFrequentEmoji] / filteredEntries.length) * 100)}%
                      </Badge>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Среднее настроение</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Вычисляем среднее настроение
                  const sum = filteredEntries.reduce((acc, entry) => acc + getEmojiValue(entry.emoji), 0);
                  const avg = sum / filteredEntries.length;
                  
                  // Находим ближайшее эмодзи к среднему значению
                  const emojiValues = Object.entries(getEmojiValue);
                  const closestEmoji = emojiValues.reduce((prev, curr) => {
                    return Math.abs(curr[1] - avg) < Math.abs(prev[1] - avg) ? curr : prev;
                  });
                  
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-3xl mr-2">{closestEmoji[0]}</span>
                        <span className="text-lg font-medium">{getEmojiName(closestEmoji[0])}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {avg.toFixed(1)} из 6
                      </Badge>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList>
              <TabsTrigger value="timeline" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span>Динамика</span>
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                <span>Распределение</span>
              </TabsTrigger>
              <TabsTrigger value="weekday" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>По дням недели</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Динамика настроения</CardTitle>
                  <CardDescription>
                    Изменение вашего настроения с течением времени
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {timelineData ? (
                    <Line data={timelineData} options={lineOptions} />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-muted-foreground">Недостаточно данных для построения графика</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="distribution">
              <Card>
                <CardHeader>
                  <CardTitle>Распределение настроений</CardTitle>
                  <CardDescription>
                    Частота различных типов настроения
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {distributionData ? (
                    <Doughnut data={distributionData} options={pieOptions} />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-muted-foreground">Недостаточно данных для построения диаграммы</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weekday">
              <Card>
                <CardHeader>
                  <CardTitle>Настроение по дням недели</CardTitle>
                  <CardDescription>
                    Среднее настроение для каждого дня недели
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {weekdayData ? (
                    <Bar data={weekdayData} options={barOptions} />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-muted-foreground">Недостаточно данных для построения диаграммы</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
