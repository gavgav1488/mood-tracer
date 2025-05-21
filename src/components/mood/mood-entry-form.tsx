'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EmojiPicker } from './emoji-picker';
import { NoteEditor } from './note-editor';
import { MoodVisualization } from './mood-visualization';
import { useSupabase } from '@/hooks/use-supabase';
import { useAuth } from '@/context/auth-context';

export function MoodEntryForm() {
  const [emoji, setEmoji] = useState('😊');
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { createMoodEntry } = useSupabase();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      // Валидация данных перед сохранением
      const { validateData, moodEntrySchema } = await import('@/lib/validations');
      const validationResult = validateData(moodEntrySchema, {
        date: new Date().toISOString(),
        emoji,
        note,
      });

      if (!validationResult.success) {
        console.error('Ошибка валидации:', validationResult.errors);
        return;
      }

      await createMoodEntry(validationResult.data);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Ошибка при сохранении записи:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Как вы себя чувствуете сегодня?</CardTitle>
        <CardDescription>
          Выберите эмодзи, который лучше всего отражает ваше настроение, и запишите свои мысли
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EmojiPicker selectedEmoji={emoji} onSelect={setEmoji} />

        <div className="mt-6">
          <MoodVisualization emoji={emoji} />
        </div>

        <div className="mt-6">
          <NoteEditor
            initialValue={note}
            onChange={setNote}
            autoSave={false}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {isSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Запись успешно сохранена!
            </p>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !note.trim()}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить запись'}
        </Button>
      </CardFooter>
    </Card>
  );
}
