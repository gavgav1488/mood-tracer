'use client';

import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useAuth } from '@/context/auth-context';
import { MoodEntryForm } from '@/components/mood/mood-entry-form';
import { MoodEntriesList } from '@/components/mood/mood-entries-list';
import { MoodStats } from '@/components/stats/mood-stats';
import { MonthlyMoodStats } from '@/components/stats/monthly-mood-stats';
import { MoodCalendar } from '@/components/calendar/mood-calendar';
import { ExportData } from '@/components/export/export-data';
import { useRef, useCallback, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Calendar, BarChart3, BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import { AnimatedCard, AnimatedCardContent } from '@/components/ui/animated-card';
import Link from 'next/link';

export default function DiaryPage() {
  const { user, loading, signOut } = useAuth();
  const entriesListRef = useRef<{ fetchEntries: (forceRefresh?: boolean) => Promise<void> }>(null);
  const [activeTab, setActiveTab] = useState<string>("diary");

  // Функция для обновления списка записей после создания новой записи
  const handleEntryCreated = useCallback(() => {
    // Вызываем метод fetchEntries с параметром forceRefresh=true
    if (entriesListRef.current) {
      entriesListRef.current.fetchEntries(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Дневник настроения</span>
          </div>
          <h1 className="text-3xl font-bold">Привет, {user?.user_metadata?.name || user?.email || 'пользователь'}!</h1>
        </div>
        <div className="flex gap-2">
          <ExportData />
          <AnimatedButton variant="outline" className="rounded-full" asChild animationType="scale">
            <Link href="/analytics">
              <TrendingUp className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Аналитика</span>
            </Link>
          </AnimatedButton>
          <AnimatedButton variant="outline" className="rounded-full" asChild animationType="scale">
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Настройки</span>
            </Link>
          </AnimatedButton>
          <AnimatedButton variant="outline" className="rounded-full" onClick={signOut} animationType="scale">
            <span className="hidden sm:inline">Выйти</span>
          </AnimatedButton>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="diary" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Дневник</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Статистика</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Календарь</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diary" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedCard variant="gradient" gradientFrom="from-primary/20" gradientTo="to-purple-600/20" className="overflow-hidden">
              <AnimatedCardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Новая запись</h2>
                <MoodEntryForm onEntryCreated={handleEntryCreated} />
              </AnimatedCardContent>
            </AnimatedCard>

            <AnimatedCard variant="gradient" gradientFrom="from-purple-600/20" gradientTo="to-primary/20" className="overflow-hidden">
              <AnimatedCardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Последние записи</h2>
                <MoodEntriesList ref={entriesListRef} />
              </AnimatedCardContent>
            </AnimatedCard>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-8">
          <AnimatedCard variant="gradient" gradientFrom="from-primary/20" gradientTo="to-purple-600/20" className="overflow-hidden">
            <AnimatedCardContent className="p-6">
              <MoodStats />
            </AnimatedCardContent>
          </AnimatedCard>

          <AnimatedCard variant="gradient" gradientFrom="from-purple-600/20" gradientTo="to-primary/20" className="overflow-hidden">
            <AnimatedCardContent className="p-6">
              <MonthlyMoodStats />
            </AnimatedCardContent>
          </AnimatedCard>

          <div className="flex justify-center">
            <AnimatedButton asChild className="rounded-full" variant="gradient" animationType="pulse">
              <Link href="/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                Расширенная аналитика
              </Link>
            </AnimatedButton>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-8">
          <AnimatedCard variant="gradient" gradientFrom="from-primary/20" gradientTo="to-purple-600/20" className="overflow-hidden">
            <AnimatedCardContent className="p-6">
              <MoodCalendar />
            </AnimatedCardContent>
          </AnimatedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
