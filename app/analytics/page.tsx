'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { AdvancedMoodStats } from '@/components/stats/advanced-mood-stats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoodStats } from '@/components/stats/mood-stats';
import { MonthlyMoodStats } from '@/components/stats/monthly-mood-stats';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Аналитика настроения
        </h1>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-lg mb-4">
            Привет, {user?.user_metadata?.name || user?.email || 'пользователь'}!
          </p>
          <p className="text-muted-foreground mb-4">
            Здесь вы можете увидеть подробную аналитику вашего настроения, основанную на ваших записях в дневнике.
            Анализируйте тренды, выявляйте закономерности и получайте ценные инсайты о своем эмоциональном состоянии.
          </p>
        </div>

        <Tabs defaultValue="advanced" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="advanced">Расширенная аналитика</TabsTrigger>
            <TabsTrigger value="monthly">По месяцам</TabsTrigger>
            <TabsTrigger value="basic">Базовая</TabsTrigger>
          </TabsList>
          
          <TabsContent value="advanced" className="space-y-4">
            <AdvancedMoodStats />
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-4">
            <MonthlyMoodStats />
          </TabsContent>
          
          <TabsContent value="basic" className="space-y-4">
            <MoodStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
