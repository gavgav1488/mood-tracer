'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowLeft, Calendar, Copy, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { EnhancedMoodVisualization } from '@/components/mood/enhanced-mood-visualization';
import { useToast } from '@/components/ui/use-toast';

export default function SharedEntryPage() {
  const searchParams = useSearchParams();
  const entryId = searchParams.get('id');
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { getMoodEntryById } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEntry = async () => {
      if (!entryId) {
        setError('Идентификатор записи не указан');
        setLoading(false);
        return;
      }

      try {
        const fetchedEntry = await getMoodEntryById(entryId);
        if (fetchedEntry) {
          setEntry(fetchedEntry);
        } else {
          setError('Запись не найдена');
        }
      } catch (err) {
        console.error('Ошибка при загрузке записи:', err);
        setError('Не удалось загрузить запись');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryId, getMoodEntryById]);

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

  // Функция для копирования ссылки
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      toast({
        title: 'Ссылка скопирована',
        description: 'Ссылка на запись скопирована в буфер обмена',
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Ошибка</CardTitle>
            <CardDescription>
              {error || 'Произошла неизвестная ошибка'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться на главную
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const entryDate = new Date(entry.date);
  const formattedDate = format(entryDate, 'd MMMM yyyy', { locale: ru });
  const dayOfWeek = format(entryDate, 'EEEE', { locale: ru });

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Link>
        </Button>
        <Button variant="outline" onClick={copyLink}>
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          Копировать ссылку
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {dayOfWeek}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-sm"></div>
                  <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-card border">
                    <span className="text-3xl">{entry.emoji}</span>
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl">{getEmojiName(entry.emoji)}</CardTitle>
                  <CardDescription>
                    Запись из Дневника настроения
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {entry.note ? (
                <div className="whitespace-pre-wrap text-lg">
                  {entry.note}
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  Нет заметки к этой записи
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Поделиться своими эмоциями важно</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Визуализация настроения</CardTitle>
              <CardDescription>
                Интерактивное представление эмоции
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <EnhancedMoodVisualization emoji={entry.emoji} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Создайте свой дневник настроения</CardTitle>
              <CardDescription>
                Отслеживайте свои эмоции и делитесь ими с близкими
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Дневник настроения помогает лучше понимать свои эмоции, отслеживать настроение и находить гармонию.
              </p>
              <Button asChild className="w-full">
                <Link href="/">
                  Создать свой дневник
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
