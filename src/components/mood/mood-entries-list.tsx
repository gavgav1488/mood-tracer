'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { formatTextToHtml } from '@/lib/text-formatter';

export function MoodEntriesList() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { getMoodEntries } = useSupabase();

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ваши записи</CardTitle>
          <CardDescription>Загрузка записей...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ваши записи</CardTitle>
          <CardDescription>У вас пока нет записей</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Создайте свою первую запись, выбрав эмодзи и написав о своих чувствах
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ваши записи</CardTitle>
        <CardDescription>История ваших настроений</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{entry.emoji}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(entry.date)}
                  </span>
                </div>
              </div>
              <div
                className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-blockquote:my-1 prose-blockquote:pl-2 prose-blockquote:border-l-2 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600"
                dangerouslySetInnerHTML={{ __html: formatTextToHtml(entry.note) }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
