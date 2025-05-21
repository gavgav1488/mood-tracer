'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { Trophy, Star, Calendar, Clock, Sparkles, Award, Lock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format, differenceInDays, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: (entries: MoodEntry[]) => { completed: boolean; progress: number; total: number };
  unlocked: boolean;
  progress: number;
  total: number;
  date?: string;
}

export function AchievementsList() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { getMoodEntries, supabase, user } = useSupabase();
  const { toast } = useToast();

  // Загрузка записей и достижений при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Загружаем записи
        const fetchedEntries = await getMoodEntries();
        setEntries(fetchedEntries);

        // Загружаем сохраненные достижения
        const { data: savedAchievements } = await supabase
          .from('achievements')
          .select('*')
          .eq('userId', user.id);

        // Инициализируем достижения
        initializeAchievements(fetchedEntries, savedAchievements || []);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getMoodEntries, supabase, user]);

  // Инициализация достижений
  const initializeAchievements = (entries: MoodEntry[], savedAchievements: any[]) => {
    const achievementsList: Achievement[] = [
      {
        id: 'first_entry',
        title: 'Первая запись',
        description: 'Создайте свою первую запись в дневнике',
        icon: <Star className="h-6 w-6 text-yellow-500" />,
        condition: (entries) => ({ 
          completed: entries.length > 0, 
          progress: Math.min(entries.length, 1), 
          total: 1 
        }),
        unlocked: false,
        progress: 0,
        total: 1
      },
      {
        id: 'five_entries',
        title: 'Регулярные записи',
        description: 'Создайте 5 записей в дневнике',
        icon: <Calendar className="h-6 w-6 text-blue-500" />,
        condition: (entries) => ({ 
          completed: entries.length >= 5, 
          progress: Math.min(entries.length, 5), 
          total: 5 
        }),
        unlocked: false,
        progress: 0,
        total: 5
      },
      {
        id: 'streak_3',
        title: 'Трехдневная серия',
        description: 'Создавайте записи 3 дня подряд',
        icon: <Sparkles className="h-6 w-6 text-purple-500" />,
        condition: (entries) => {
          const streak = calculateStreak(entries);
          return { 
            completed: streak >= 3, 
            progress: Math.min(streak, 3), 
            total: 3 
          };
        },
        unlocked: false,
        progress: 0,
        total: 3
      },
      {
        id: 'all_emotions',
        title: 'Эмоциональный спектр',
        description: 'Запишите все типы эмоций хотя бы по одному разу',
        icon: <Award className="h-6 w-6 text-pink-500" />,
        condition: (entries) => {
          const emotions = ['😊', '😐', '😢', '🥳', '😤', '😴', '😰'];
          const recordedEmotions = new Set(entries.map(entry => entry.emoji));
          const count = emotions.filter(emoji => recordedEmotions.has(emoji)).length;
          return { 
            completed: count === emotions.length, 
            progress: count, 
            total: emotions.length 
          };
        },
        unlocked: false,
        progress: 0,
        total: 7
      },
      {
        id: 'month_complete',
        title: 'Месяц самопознания',
        description: 'Создавайте записи каждый день в течение месяца',
        icon: <Trophy className="h-6 w-6 text-amber-500" />,
        condition: (entries) => {
          const daysInMonth = 30;
          const uniqueDays = new Set(entries.map(entry => format(new Date(entry.date), 'yyyy-MM-dd')));
          return { 
            completed: uniqueDays.size >= daysInMonth, 
            progress: Math.min(uniqueDays.size, daysInMonth), 
            total: daysInMonth 
          };
        },
        unlocked: false,
        progress: 0,
        total: 30
      }
    ];

    // Обновляем состояние достижений на основе записей
    const updatedAchievements = achievementsList.map(achievement => {
      const { completed, progress, total } = achievement.condition(entries);
      
      // Проверяем, было ли достижение разблокировано ранее
      const savedAchievement = savedAchievements.find(a => a.achievementId === achievement.id);
      const unlocked = savedAchievement ? true : completed;
      const date = savedAchievement ? savedAchievement.unlockedAt : completed ? new Date().toISOString() : undefined;
      
      return {
        ...achievement,
        unlocked,
        progress,
        total,
        date
      };
    });

    setAchievements(updatedAchievements);

    // Сохраняем новые достижения
    updatedAchievements.forEach(async (achievement) => {
      if (achievement.unlocked && !savedAchievements.find(a => a.achievementId === achievement.id)) {
        await saveAchievement(achievement);
      }
    });
  };

  // Функция для расчета серии последовательных дней
  const calculateStreak = (entries: MoodEntry[]): number => {
    if (entries.length === 0) return 0;

    // Сортируем записи по дате (от новых к старым)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Получаем уникальные даты (по одной записи на день)
    const uniqueDates = Array.from(new Set(
      sortedEntries.map(entry => format(new Date(entry.date), 'yyyy-MM-dd'))
    ));

    // Если нет записи за сегодня, серия прервана
    if (!uniqueDates.includes(format(new Date(), 'yyyy-MM-dd'))) {
      return 0;
    }

    let streak = 1;
    let currentDate = new Date();

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      if (uniqueDates.includes(format(prevDate, 'yyyy-MM-dd'))) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }

    return streak;
  };

  // Сохранение достижения в базу данных
  const saveAchievement = async (achievement: Achievement) => {
    if (!user) return;

    try {
      await supabase.from('achievements').insert({
        userId: user.id,
        achievementId: achievement.id,
        unlockedAt: new Date().toISOString()
      });

      // Показываем уведомление о разблокировке достижения
      toast({
        title: 'Новое достижение!',
        description: `Вы разблокировали "${achievement.title}"`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Ошибка при сохранении достижения:', error);
    }
  };

  // Форматирование даты разблокировки
  const formatUnlockDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy', { locale: ru });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Достижения
        </h2>
        <Badge variant="outline" className="rounded-full">
          {achievements.filter(a => a.unlocked).length} / {achievements.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={achievement.unlocked ? 'border-primary/50' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                    achievement.unlocked ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {achievement.unlocked ? achievement.icon : <Lock className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {achievement.title}
                      {achievement.unlocked && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {achievement.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>{achievement.progress} / {achievement.total}</span>
                  <span>{Math.round((achievement.progress / achievement.total) * 100)}%</span>
                </div>
                <Progress value={(achievement.progress / achievement.total) * 100} />
              </div>
            </CardContent>
            {achievement.unlocked && achievement.date && (
              <CardFooter className="pt-0">
                <p className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Разблокировано: {formatUnlockDate(achievement.date)}
                </p>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
