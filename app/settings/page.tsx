'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { EmojiSettings } from '@/components/settings/emoji-settings';
import { ReminderSettings } from '@/components/settings/reminder-settings';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Обработчик сохранения настроек
  const handleSettingsSaved = () => {
    // Можно добавить дополнительную логику при сохранении настроек
  };

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
        <h1 className="text-3xl font-bold">Настройки</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-lg mb-4">
            Привет, {user?.user_metadata?.name || user?.email || 'пользователь'}!
          </p>
          <p className="text-muted-foreground mb-4">
            Здесь вы можете настроить параметры дневника настроения под себя.
          </p>
        </div>

        <div className="space-y-8">
          <EmojiSettings onSave={handleSettingsSaved} />
          <ReminderSettings onSave={handleSettingsSaved} />
        </div>
      </div>
    </div>
  );
}
