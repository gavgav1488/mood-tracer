'use client';

import { MoodEntry, Reminder, Achievement, Tag, EntryTag } from '@/lib/supabase';
import { createBrowserClient } from '@supabase/ssr';
import { useCallback, useRef, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

// Тип для кэша
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresIn: number; // время жизни кэша в миллисекундах
};

// Функция для проверки актуальности кэша
function isCacheValid<T>(cache: CacheEntry<T> | null): boolean {
  if (!cache) return false;
  return Date.now() - cache.timestamp < cache.expiresIn;
}

export function useSupabase() {
  // Состояние пользователя
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Кэш для записей дневника
  const entriesCache = useRef<CacheEntry<MoodEntry[]> | null>(null);
  // Кэш для отдельных записей
  const entryCache = useRef<Map<string, CacheEntry<MoodEntry>>>(new Map());
  // Кэш для напоминаний
  const remindersCache = useRef<CacheEntry<Reminder[]> | null>(null);
  // Кэш для достижений
  const achievementsCache = useRef<CacheEntry<Achievement[]> | null>(null);
  // Кэш для тегов
  const tagsCache = useRef<CacheEntry<Tag[]> | null>(null);

  const getClient = useCallback(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  // Получение текущего пользователя
  useEffect(() => {
    const supabase = getClient();

    // Получаем текущего пользователя
    const getUser = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Подписываемся на изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getClient]);

  const getMoodEntries = useCallback(async (options?: { forceRefresh?: boolean }) => {
    // Если кэш актуален и не требуется принудительное обновление, возвращаем данные из кэша
    if (!options?.forceRefresh && isCacheValid(entriesCache.current)) {
      return entriesCache.current.data;
    }

    const supabase = getClient();
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Ошибка при получении записей:', error);
      return [];
    }

    // Обновляем кэш
    entriesCache.current = {
      data: data as MoodEntry[],
      timestamp: Date.now(),
      expiresIn: 5 * 60 * 1000, // 5 минут
    };

    return data as MoodEntry[];
  }, [getClient]);

  const getMoodEntry = useCallback(async (id: string, options?: { forceRefresh?: boolean }) => {
    // Проверяем кэш для конкретной записи
    const cachedEntry = entryCache.current.get(id);
    if (!options?.forceRefresh && cachedEntry && isCacheValid(cachedEntry)) {
      return cachedEntry.data;
    }

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

    // Обновляем кэш для конкретной записи
    entryCache.current.set(id, {
      data: data as MoodEntry,
      timestamp: Date.now(),
      expiresIn: 5 * 60 * 1000, // 5 минут
    });

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

    // Инвалидируем кэш всех записей, так как добавлена новая запись
    entriesCache.current = null;

    // Добавляем новую запись в кэш
    if (data) {
      entryCache.current.set(data.id, {
        data: data as MoodEntry,
        timestamp: Date.now(),
        expiresIn: 5 * 60 * 1000, // 5 минут
      });
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

    // Инвалидируем кэш всех записей
    entriesCache.current = null;

    // Обновляем кэш для конкретной записи
    if (data) {
      entryCache.current.set(id, {
        data: data as MoodEntry,
        timestamp: Date.now(),
        expiresIn: 5 * 60 * 1000, // 5 минут
      });
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

    // Инвалидируем кэш всех записей
    entriesCache.current = null;

    // Удаляем запись из кэша
    entryCache.current.delete(id);

    return true;
  }, [getClient]);

  // Методы для работы с напоминаниями
  const getReminders = useCallback(async (options?: { forceRefresh?: boolean }) => {
    if (!user) return [];

    // Если кэш актуален и не требуется принудительное обновление, возвращаем данные из кэша
    if (!options?.forceRefresh && isCacheValid(remindersCache.current)) {
      return remindersCache.current.data;
    }

    const supabase = getClient();
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ошибка при получении напоминаний:', error);
      return [];
    }

    // Обновляем кэш
    remindersCache.current = {
      data: data as Reminder[],
      timestamp: Date.now(),
      expiresIn: 5 * 60 * 1000, // 5 минут
    };

    return data as Reminder[];
  }, [getClient, user]);

  const createReminder = useCallback(async (reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    const supabase = getClient();
    const { data, error } = await supabase
      .from('reminders')
      .insert([{ ...reminder, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании напоминания:', error);
      return null;
    }

    // Инвалидируем кэш напоминаний
    remindersCache.current = null;

    return data as Reminder;
  }, [getClient, user]);

  const updateReminder = useCallback(async (id: string, reminder: Partial<Reminder>) => {
    if (!user) return null;

    const supabase = getClient();
    const { data, error } = await supabase
      .from('reminders')
      .update(reminder)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Ошибка при обновлении напоминания:', error);
      return null;
    }

    // Инвалидируем кэш напоминаний
    remindersCache.current = null;

    return data as Reminder;
  }, [getClient, user]);

  const deleteReminder = useCallback(async (id: string) => {
    if (!user) return false;

    const supabase = getClient();
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Ошибка при удалении напоминания:', error);
      return false;
    }

    // Инвалидируем кэш напоминаний
    remindersCache.current = null;

    return true;
  }, [getClient, user]);

  // Методы для работы с достижениями
  const getAchievements = useCallback(async (options?: { forceRefresh?: boolean }) => {
    if (!user) return [];

    // Если кэш актуален и не требуется принудительное обновление, возвращаем данные из кэша
    if (!options?.forceRefresh && isCacheValid(achievementsCache.current)) {
      return achievementsCache.current.data;
    }

    const supabase = getClient();
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false });

    if (error) {
      console.error('Ошибка при получении достижений:', error);
      return [];
    }

    // Обновляем кэш
    achievementsCache.current = {
      data: data as Achievement[],
      timestamp: Date.now(),
      expiresIn: 5 * 60 * 1000, // 5 минут
    };

    return data as Achievement[];
  }, [getClient, user]);

  const saveAchievement = useCallback(async (achievementId: string) => {
    if (!user) return null;

    const supabase = getClient();
    const { data, error } = await supabase
      .from('achievements')
      .insert([{
        user_id: user.id,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      // Если достижение уже существует, это не ошибка
      if (error.code === '23505') { // Unique violation
        return { success: true, message: 'Достижение уже разблокировано' };
      }
      console.error('Ошибка при сохранении достижения:', error);
      return null;
    }

    // Инвалидируем кэш достижений
    achievementsCache.current = null;

    return data as Achievement;
  }, [getClient, user]);

  // Метод для получения записи по ID для страницы шаринга
  const getMoodEntryById = useCallback(async (id: string) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Ошибка при получении записи по ID:', error);
      return null;
    }

    return data as MoodEntry;
  }, [getClient]);

  // Метод для очистки кэша
  const clearCache = useCallback(() => {
    entriesCache.current = null;
    entryCache.current.clear();
    remindersCache.current = null;
    achievementsCache.current = null;
  }, []);

  // Методы для работы с тегами
  const getTags = useCallback(async (options?: { forceRefresh?: boolean }) => {
    // Проверяем, что пользователь авторизован
    if (!user) {
      console.log('getTags: пользователь не авторизован');
      return [];
    }

    // Если кэш актуален и не требуется принудительное обновление, возвращаем данные из кэша
    if (!options?.forceRefresh && isCacheValid(tagsCache.current)) {
      console.log('getTags: возвращаем данные из кэша');
      return tagsCache.current.data;
    }

    console.log('getTags: запрашиваем данные из базы данных');

    try {
      const supabase = getClient();
      console.log('getTags: клиент Supabase получен', !!supabase);

      // Проверяем, существует ли таблица tags
      const { data: tableExists, error: tableError } = await supabase
        .from('tags')
        .select('id')
        .limit(1);

      if (tableError) {
        console.error('Ошибка при проверке таблицы tags:', tableError);
        return [];
      }

      console.log('getTags: таблица tags существует, продолжаем запрос');

      // Получаем теги пользователя
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, created_at')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Ошибка при получении тегов:', error);
        return [];
      }

      console.log('getTags: получены данные из базы данных', data);

      // Обновляем кэш
      tagsCache.current = {
        data: data as Tag[],
        timestamp: Date.now(),
        expiresIn: 5 * 60 * 1000, // 5 минут
      };

      return data as Tag[];
    } catch (error) {
      console.error('Ошибка при получении тегов:', error);
      return [];
    }
  }, [getClient, user]);

  const createTag = useCallback(async (name: string) => {
    if (!user) return null;

    const supabase = getClient();
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании тега:', error);
      return null;
    }

    // Инвалидируем кэш тегов
    tagsCache.current = null;

    return data as Tag;
  }, [getClient, user]);

  const updateTag = useCallback(async (id: string, name: string) => {
    if (!user) return null;

    const supabase = getClient();
    const { data, error } = await supabase
      .from('tags')
      .update({ name })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Ошибка при обновлении тега:', error);
      return null;
    }

    // Инвалидируем кэш тегов
    tagsCache.current = null;

    return data as Tag;
  }, [getClient, user]);

  const deleteTag = useCallback(async (id: string) => {
    if (!user) return false;

    const supabase = getClient();
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Ошибка при удалении тега:', error);
      return false;
    }

    // Инвалидируем кэш тегов
    tagsCache.current = null;

    return true;
  }, [getClient, user]);

  const getEntryTags = useCallback(async (entryId: string) => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('entry_tags')
      .select('tag_id, tags!inner(name)')
      .eq('entry_id', entryId);

    if (error) {
      console.error('Ошибка при получении тегов записи:', error);
      return [];
    }

    return data.map(item => item.tags.name);
  }, [getClient]);

  const updateEntryTags = useCallback(async (entryId: string, tags: string[]) => {
    if (!user) return false;

    const supabase = getClient();

    try {
      // Сначала получаем все теги пользователя
      const { data: userTags, error: tagsError } = await supabase
        .from('tags')
        .select('id, name')
        .eq('user_id', user.id);

      if (tagsError) throw tagsError;

      // Создаем словарь тегов для быстрого поиска
      const tagMap = new Map(userTags.map(tag => [tag.name, tag.id]));

      // Создаем новые теги, которых еще нет
      const newTags = tags.filter(tag => !tagMap.has(tag));

      for (const tagName of newTags) {
        const { data: newTag, error: createError } = await supabase
          .from('tags')
          .insert([{ name: tagName, user_id: user.id }])
          .select()
          .single();

        if (createError) throw createError;

        // Добавляем новый тег в словарь
        tagMap.set(tagName, newTag.id);
      }

      // Получаем текущие связи тегов с записью
      const { data: currentEntryTags, error: entryTagsError } = await supabase
        .from('entry_tags')
        .select('id, tag_id, tags!inner(name)')
        .eq('entry_id', entryId);

      if (entryTagsError) throw entryTagsError;

      // Определяем, какие теги нужно удалить
      const tagsToDelete = currentEntryTags.filter(
        entryTag => !tags.includes(entryTag.tags.name)
      );

      // Определяем, какие теги нужно добавить
      const currentTagNames = currentEntryTags.map(entryTag => entryTag.tags.name);
      const tagsToAdd = tags.filter(tag => !currentTagNames.includes(tag));

      // Удаляем ненужные теги
      if (tagsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('entry_tags')
          .delete()
          .in('id', tagsToDelete.map(tag => tag.id));

        if (deleteError) throw deleteError;
      }

      // Добавляем новые теги
      if (tagsToAdd.length > 0) {
        const newEntryTags = tagsToAdd.map(tag => ({
          entry_id: entryId,
          tag_id: tagMap.get(tag)!
        }));

        const { error: insertError } = await supabase
          .from('entry_tags')
          .insert(newEntryTags);

        if (insertError) throw insertError;
      }

      // Обновляем массив тегов в самой записи для быстрого доступа
      const { error: updateError } = await supabase
        .from('mood_entries')
        .update({ tags })
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Инвалидируем кэш записей
      entriesCache.current = null;
      entryCache.current.delete(entryId);

      return true;
    } catch (error) {
      console.error('Ошибка при обновлении тегов записи:', error);
      return false;
    }
  }, [getClient, user]);

  return {
    supabase: getClient(),
    user,
    loading,
    getClient,
    getMoodEntries,
    getMoodEntry,
    getMoodEntryById,
    createMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    getReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    getAchievements,
    saveAchievement,
    getTags,
    createTag,
    updateTag,
    deleteTag,
    getEntryTags,
    updateEntryTags,
    clearCache,
  };
}
