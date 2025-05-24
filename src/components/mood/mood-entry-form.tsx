'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EmojiPicker } from './emoji-picker';
import { NoteEditor } from './note-editor';
import { EnhancedMoodVisualizationClient } from './enhanced-mood-visualization-client';
import { useSupabase } from '@/hooks/use-supabase';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Maximize2, Save, RefreshCw, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TagSelector } from '@/components/tags/tag-selector';

interface MoodEntryFormProps {
  onEntryCreated?: () => void;
}

export function MoodEntryForm({ onEntryCreated }: MoodEntryFormProps) {
  const [emoji, setEmoji] = useState('😊');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createMoodEntry, clearCache, updateEntryTags } = useSupabase();
  const { user } = useAuth();

  const resetForm = useCallback(() => {
    setEmoji('😊');
    setNote('');
    setTags([]);
  }, []);

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setError(null);

      // Создаем запись
      const entry = await createMoodEntry({
        date: new Date().toISOString(),
        emoji,
        note,
        tags,
      });

      // Если есть теги, сохраняем их
      if (entry && tags.length > 0) {
        await updateEntryTags(entry.id, tags);
      }

      // Очищаем кэш, чтобы при следующем запросе получить актуальные данные
      clearCache();

      // Вызываем колбэк, если он передан
      if (onEntryCreated) {
        onEntryCreated();
      }

      setIsSuccess(true);
      resetForm();
      // Увеличиваем время отображения сакуры до 10 секунд
      setTimeout(() => setIsSuccess(false), 10000);
    } catch (error) {
      console.error('Ошибка при сохранении записи:', error);
      setError('Не удалось сохранить запись. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>{format(new Date(), 'EEEE, d MMMM', { locale: ru })}</span>
          </div>
          <h2 className="text-2xl font-semibold">Как вы себя чувствуете сегодня?</h2>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border p-4">
            <EmojiPicker selectedEmoji={emoji} onSelect={setEmoji} />
          </div>

          {isSuccess ? (
            <div className="bg-card rounded-xl border p-4 relative">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Ваша запись сохранена!</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="rounded-full"
                  title="Открыть в полноэкранном режиме"
                >
                  <Link href={`/visualization?emoji=${encodeURIComponent(emoji)}`}>
                    <Maximize2 className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <EnhancedMoodVisualizationClient emoji={emoji} visualType="sakura" />
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Заметка</h3>
            </div>
            <NoteEditor
              initialValue={note}
              onChange={setNote}
              autoSave={false}
            />
          </div>

          <div className="bg-card rounded-xl border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Теги
              </h3>
            </div>
            <TagSelector
              selectedTags={tags}
              onChange={setTags}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
        <div>
          {isSuccess && (
            <div className="flex items-center text-sm text-rose-600 dark:text-rose-400">
              <Sparkles className="mr-1 h-4 w-4" />
              Запись успешно сохранена! Полюбуйтесь цветущей сакурой!
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={isSaving || (!note.trim() && emoji === '😊')}
            className="rounded-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Очистить</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !note.trim()}
            className="rounded-full"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">
                  <RefreshCw className="h-4 w-4" />
                </span>
                <span className="hidden sm:inline">Сохранение...</span>
                <span className="sm:hidden">Сохр...</span>
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Сохранить запись</span>
                <span className="sm:hidden">Сохранить</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
