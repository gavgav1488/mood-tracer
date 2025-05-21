'use client';

import { MoodEntry, UserSettings, Feedback } from '@/lib/supabase';
import { createBrowserClient } from '@supabase/ssr';
import { useCallback } from 'react';

export function useSupabase() {
  const getClient = useCallback(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  const getMoodEntries = useCallback(async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Ошибка при получении записей:', error);
      return [];
    }

    return data as MoodEntry[];
  }, [getClient]);

  const getMoodEntry = useCallback(async (id: string) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Ошибка при получении записи:', error);
      return null;
    }

    return data as MoodEntry;
  }, [getClient]);

  const createMoodEntry = useCallback(async (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('mood_entries')
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании записи:', error);
      return null;
    }

    return data as MoodEntry;
  }, [getClient]);

  const updateMoodEntry = useCallback(async (id: string, entry: Partial<MoodEntry>) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('mood_entries')
      .update(entry)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Ошибка при обновлении записи:', error);
      return null;
    }

    return data as MoodEntry;
  }, [getClient]);

  const deleteMoodEntry = useCallback(async (id: string) => {
    const supabase = getClient();
    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Ошибка при удалении записи:', error);
      return false;
    }

    return true;
  }, [getClient]);

  const getUserSettings = useCallback(async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Ошибка при получении настроек пользователя:', error);
      return null;
    }

    return data as UserSettings;
  }, [getClient]);

  const updateUserSettings = useCallback(async (settings: Partial<UserSettings>) => {
    const supabase = getClient();

    // Сначала проверяем, существуют ли настройки пользователя
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('*')
      .single();

    let result;

    if (existingSettings) {
      // Если настройки существуют, обновляем их
      const { data, error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', existingSettings.user_id)
        .select()
        .single();

      if (error) {
        console.error('Ошибка при обновлении настроек пользователя:', error);
        return null;
      }

      result = data;
    } else {
      // Если настроек нет, создаем новые
      const { data, error } = await supabase
        .from('user_settings')
        .insert([settings])
        .select()
        .single();

      if (error) {
        console.error('Ошибка при создании настроек пользователя:', error);
        return null;
      }

      result = data;
    }

    return result as UserSettings;
  }, [getClient]);

  const createFeedback = useCallback(async (feedback: Omit<Feedback, 'id' | 'created_at'>) => {
    const supabase = getClient();

    const { data, error } = await supabase
      .from('feedback')
      .insert([feedback])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании обратной связи:', error);
      throw error;
    }

    return data as Feedback;
  }, [getClient]);

  return {
    getMoodEntries,
    getMoodEntry,
    createMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    getUserSettings,
    updateUserSettings,
    createFeedback,
  };
}
