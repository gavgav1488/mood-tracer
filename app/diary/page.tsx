'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { LazyLoad } from '@/components/lazy-load';
import dynamic from 'next/dynamic';

// Ленивая загрузка компонентов
const MoodEntryForm = dynamic(() => import('@/components/mood/mood-entry-form').then(mod => ({ default: mod.MoodEntryForm })), {
  loading: () => <div className="animate-pulse bg-card h-[400px] rounded-lg"></div>,
  ssr: false
});

const MoodEntriesList = dynamic(() => import('@/components/mood/mood-entries-list').then(mod => ({ default: mod.MoodEntriesList })), {
  loading: () => <div className="animate-pulse bg-card h-[400px] rounded-lg"></div>,
  ssr: false
});

export default function DiaryPage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мой дневник настроения</h1>
        <Button variant="outline" onClick={signOut}>
          Выйти
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <p className="text-lg mb-4">
              Привет, {user?.user_metadata?.name || user?.email || 'пользователь'}!
            </p>
            <p className="text-muted-foreground mb-4">
              Здесь вы можете записывать свои эмоции и мысли. Выберите эмодзи, который отражает ваше настроение, и запишите свои мысли.
            </p>
          </div>
        </div>

        <div>
          <MoodEntryForm />
        </div>

        <div>
          <MoodEntriesList />
        </div>
      </div>
    </div>
  );
}
