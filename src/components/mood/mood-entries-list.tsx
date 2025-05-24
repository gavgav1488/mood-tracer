'use client';

import React, { useEffect, useState, useCallback, useImperativeHandle } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, Clock, Sparkles, Share2, Tag } from 'lucide-react';
import { ShareEntry } from '@/components/share/share-entry';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { format, formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';

export const MoodEntriesList = React.forwardRef<
  { fetchEntries: (forceRefresh?: boolean) => Promise<void> },
  {}
>((props, ref) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getMoodEntries } = useSupabase();

  // Функция для получения названия эмоции по эмодзи
  const getEmojiLabel = (emoji: string): string => {
    const emojiMap: Record<string, string> = {
      '😊': 'Радость',
      '😐': 'Нейтрально',
      '😢': 'Грусть',
      '🥳': 'Восторг',
      '😤': 'Злость',
      '😡': 'Злость',
      '😠': 'Раздражение',
      '😴': 'Усталость',
      '😰': 'Тревога',
    };
    return emojiMap[emoji] || emoji;
  };

  const fetchEntries = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getMoodEntries({ forceRefresh });
      setEntries(data);
    } catch (error) {
      console.error('Ошибка при загрузке записей:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getMoodEntries]);

  // Функция для обновления данных
  const handleRefresh = useCallback(() => {
    fetchEntries(true);
  }, [fetchEntries]);

  // Экспортируем метод fetchEntries через ref
  useImperativeHandle(ref, () => ({
    fetchEntries
  }));

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">История записей</h3>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">История записей</h3>
        </div>
        <div className="bg-card rounded-xl border p-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Нет записей</h3>
          <p className="text-muted-foreground">
            Создайте свою первую запись, выбрав эмодзи и написав о своих чувствах
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">История записей</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 rounded-full"
          title="Обновить записи"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {entries.map((entry) => {
          const entryDate = new Date(entry.date);
          const timeAgo = formatDistance(entryDate, new Date(), {
            addSuffix: true,
            locale: ru
          });

          return (
            <AnimatedCard
              key={entry.id}
              variant="hover"
              hoverEffect="glow"
              className="p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {/* Специальные стили для эмоции "Злость" */}
                    {(entry.emoji === '😤' || entry.emoji === '😡' || entry.emoji === '😠') ? (
                      <>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 blur-sm animate-pulse"></div>
                        <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-card border border-red-400/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                          <span className="text-xl">{entry.emoji}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-sm"></div>
                        <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-card border">
                          <span className="text-xl">{entry.emoji}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <div className="font-medium flex items-center">
                      {format(entryDate, 'd MMMM', { locale: ru })}
                      <span className="ml-2 text-xs rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                        {format(entryDate, 'EEEE', { locale: ru })}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                      <Clock className="mr-1 h-3 w-3" />
                      {timeAgo}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      {getEmojiLabel(entry.emoji)}
                    </div>
                    <ShareEntry entry={entry} />
                  </div>
                </div>
              </div>

              {entry.note && (
                <div className="pl-12">
                  <p className="text-sm whitespace-pre-wrap">{entry.note}</p>
                </div>
              )}

              {entry.tags && entry.tags.length > 0 && (
                <div className="pl-12 mt-3 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </AnimatedCard>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
        <div className="flex items-center">
          <Sparkles className="mr-1 h-3 w-3" />
          <span>Всего записей: {entries.length}</span>
        </div>
      </div>
    </div>
  );
});

MoodEntriesList.displayName = 'MoodEntriesList';