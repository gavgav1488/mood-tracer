'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { AchievementsList } from '@/components/achievements/achievements-list';

export default function AchievementsPage() {
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
          <Trophy className="h-6 w-6 text-primary" />
          Достижения
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-lg mb-4">
            Привет, {user?.user_metadata?.name || user?.email || 'пользователь'}!
          </p>
          <p className="text-muted-foreground mb-4">
            Отслеживайте свой прогресс и разблокируйте достижения, регулярно записывая свои эмоции.
            Достижения помогают поддерживать мотивацию и отмечать важные вехи в вашем пути самопознания.
          </p>
        </div>

        <div className="space-y-8">
          <AchievementsList />
        </div>
      </div>
    </div>
  );
}
