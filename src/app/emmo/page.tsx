'use client';

import { EmmoStyleTracker } from '@/components/mood/emmo-style-tracker';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';

export default function EmmoPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Перенаправление неавторизованных пользователей
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Если загрузка не завершена, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Если пользователь не авторизован, не показываем содержимое
  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">EMMO-стиль трекер настроения</h1>
        <p className="text-muted-foreground mt-2">
          Интерактивный способ отслеживать ваши эмоции с помощью визуальной карты
        </p>
      </div>

      <EmmoStyleTracker
        onEntryCreated={() => {
          // Можно добавить дополнительные действия после создания записи
          // Например, показать уведомление или перенаправить на другую страницу
        }}
      />
    </div>
  );
}
