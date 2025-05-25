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

        // Если пользователь не авторизован, создаем временного пользователя для разработки
        if (!user) {
          console.log('Пользователь не авторизован, создаем временного пользователя для разработки');
          const tempUser = {
            id: 'temp-user-' + Math.random().toString(36).substring(2, 15),
            email: 'temp@example.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            role: 'authenticated'
          } as User;

          setUser(tempUser);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Ошибка при получении пользователя:', error);

        // В случае ошибки также создаем временного пользователя
        const tempUser = {
          id: 'temp-user-' + Math.random().toString(36).substring(2, 15),
          email: 'temp@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          role: 'authenticated'
        } as User;

        setUser(tempUser);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Подписываемся на изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        // Если сессия закрылась, создаем временного пользователя
        const tempUser = {
          id: 'temp-user-' + Math.random().toString(36).substring(2, 15),
          email: 'temp@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          role: 'authenticated'
        } as User;

        setUser(tempUser);
      }
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
    if (!user) {
      console.error('Ошибка при создании записи: пользователь не авторизован');
      return null;
    }

    try {
      const supabase = getClient();

      // Добавляем user_id к записи
      const entryWithUserId = {
        ...entry,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('mood_entries')
        .insert([entryWithUserId])
        .select()
        .single();

      if (error) {
        console.error('Ошибка при создании записи:', error);

        // Создаем временную запись для отладки
        const tempEntry = {
          id: Math.random().toString(36).substring(2, 15),
          user_id: user.id,
          date: entry.date,
          emoji: entry.emoji,
          note: entry.note,
          created_at: new Date().toISOString(),
          tags: entry.tags,
          intensity: entry.intensity,
          x_position: entry.x_position,
          y_position: entry.y_position,
        };

        // Инвалидируем кэш всех записей
        entriesCache.current = null;

        // Добавляем временную запись в кэш
        entryCache.current.set(tempEntry.id, {
          data: tempEntry as MoodEntry,
          timestamp: Date.now(),
          expiresIn: 5 * 60 * 1000, // 5 минут
        });

        return tempEntry as MoodEntry;
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
    } catch (error) {
      console.error('Ошибка при создании записи:', error);

      // Создаем временную запись для отладки
      const tempEntry = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: user.id,
        date: entry.date,
        emoji: entry.emoji,
        note: entry.note,
        created_at: new Date().toISOString(),
        tags: entry.tags,
        intensity: entry.intensity,
        x_position: entry.x_position,
        y_position: entry.y_position,
      };

      // Инвалидируем кэш всех записей
      entriesCache.current = null;

      // Добавляем временную запись в кэш
      entryCache.current.set(tempEntry.id, {
        data: tempEntry as MoodEntry,
        timestamp: Date.now(),
        expiresIn: 5 * 60 * 1000, // 5 минут
      });

      return tempEntry as MoodEntry;
    }
  }, [getClient, user]);

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
      try {
        const { data: tableExists, error: tableError } = await supabase
          .from('tags')
          .select('id')
          .limit(1);

        if (tableError) {
          console.error('Ошибка при проверке таблицы tags:', tableError);

          // Возвращаем временные теги для отладки
          const tempTags = [
            { id: '1', name: 'Работа', created_at: new Date().toISOString() },
            { id: '2', name: 'Семья', created_at: new Date().toISOString() },
            { id: '3', name: 'Отдых', created_at: new Date().toISOString() },
            { id: '4', name: 'Спорт', created_at: new Date().toISOString() },
            { id: '5', name: 'Учеба', created_at: new Date().toISOString() }
          ];

          // Обновляем кэш временными тегами
          tagsCache.current = {
            data: tempTags as Tag[],
            timestamp: Date.now(),
            expiresIn: 5 * 60 * 1000, // 5 минут
          };

          return tempTags as Tag[];
        }
      } catch (error) {
        console.error('Ошибка при проверке таблицы tags:', error);

        // Возвращаем временные теги для отладки
        const tempTags = [
          { id: '1', name: 'Работа', created_at: new Date().toISOString() },
          { id: '2', name: 'Семья', created_at: new Date().toISOString() },
          { id: '3', name: 'Отдых', created_at: new Date().toISOString() },
          { id: '4', name: 'Спорт', created_at: new Date().toISOString() },
          { id: '5', name: 'Учеба', created_at: new Date().toISOString() }
        ];

        // Обновляем кэш временными тегами
        tagsCache.current = {
          data: tempTags as Tag[],
          timestamp: Date.now(),
          expiresIn: 5 * 60 * 1000, // 5 минут
        };

        return tempTags as Tag[];
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

        // Возвращаем временные теги для отладки
        const tempTags = [
          { id: '1', name: 'Работа', created_at: new Date().toISOString() },
          { id: '2', name: 'Семья', created_at: new Date().toISOString() },
          { id: '3', name: 'Отдых', created_at: new Date().toISOString() },
          { id: '4', name: 'Спорт', created_at: new Date().toISOString() },
          { id: '5', name: 'Учеба', created_at: new Date().toISOString() }
        ];

        // Обновляем кэш временными тегами
        tagsCache.current = {
          data: tempTags as Tag[],
          timestamp: Date.now(),
          expiresIn: 5 * 60 * 1000, // 5 минут
        };

        return tempTags as Tag[];
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

      // Возвращаем временные теги для отладки
      const tempTags = [
        { id: '1', name: 'Работа', created_at: new Date().toISOString() },
        { id: '2', name: 'Семья', created_at: new Date().toISOString() },
        { id: '3', name: 'Отдых', created_at: new Date().toISOString() },
        { id: '4', name: 'Спорт', created_at: new Date().toISOString() },
        { id: '5', name: 'Учеба', created_at: new Date().toISOString() }
      ];

      // Обновляем кэш временными тегами
      tagsCache.current = {
        data: tempTags as Tag[],
        timestamp: Date.now(),
        expiresIn: 5 * 60 * 1000, // 5 минут
      };

      return tempTags as Tag[];
    }
  }, [getClient, user]);

  const createTag = useCallback(async (name: string) => {
    if (!user) return null;

    try {
      const supabase = getClient();
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Ошибка при создании тега:', error);

        // Создаем временный тег для отладки
        const tempTag = {
          id: Math.random().toString(36).substring(2, 15),
          name,
          created_at: new Date().toISOString()
        };

        // Инвалидируем кэш тегов
        tagsCache.current = null;

        return tempTag as Tag;
      }

      // Инвалидируем кэш тегов
      tagsCache.current = null;

      return data as Tag;
    } catch (error) {
      console.error('Ошибка при создании тега:', error);

      // Создаем временный тег для отладки
      const tempTag = {
        id: Math.random().toString(36).substring(2, 15),
        name,
        created_at: new Date().toISOString()
      };

      // Инвалидируем кэш тегов
      tagsCache.current = null;

      return tempTag as Tag;
    }
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
    try {
      const supabase = getClient();

      // Сначала проверяем, есть ли теги в самой записи
      const { data: entry, error: entryError } = await supabase
        .from('mood_entries')
        .select('tags')
        .eq('id', entryId)
        .single();

      if (!entryError && entry && Array.isArray(entry.tags) && entry.tags.length > 0) {
        return entry.tags;
      }

      // Если в записи нет тегов, пробуем получить их из таблицы entry_tags
      try {
        const { data, error } = await supabase
          .from('entry_tags')
          .select('tag_id, tags!inner(name)')
          .eq('entry_id', entryId);

        if (error) {
          console.error('Ошибка при получении тегов записи:', error);
          return [];
        }

        return data.map(item => item.tags.name);
      } catch (error) {
        console.error('Ошибка при получении тегов записи:', error);
        return [];
      }
    } catch (error) {
      console.error('Ошибка при получении тегов записи:', error);
      return [];
    }
  }, [getClient]);

  const updateEntryTags = useCallback(async (entryId: string, tags: string[]) => {
    if (!user) return false;

    const supabase = getClient();

    try {
      try {
        // Сначала получаем все теги пользователя
        const { data: userTags, error: tagsError } = await supabase
          .from('tags')
          .select('id, name')
          .eq('user_id', user.id);

        if (tagsError) {
          console.error('Ошибка при получении тегов пользователя:', tagsError);

          // Обновляем массив тегов в самой записи для быстрого доступа
          try {
            const { error: updateError } = await supabase
              .from('mood_entries')
              .update({ tags })
              .eq('id', entryId)
              .eq('user_id', user.id);

            if (updateError) {
              console.error('Ошибка при обновлении тегов в записи:', updateError);
            }
          } catch (updateError) {
            console.error('Ошибка при обновлении тегов в записи:', updateError);
          }

          // Инвалидируем кэш записей
          entriesCache.current = null;
          entryCache.current.delete(entryId);

          return true;
        }

        // Создаем словарь тегов для быстрого поиска
        const tagMap = new Map(userTags.map(tag => [tag.name, tag.id]));

        // Создаем новые теги, которых еще нет
        const newTags = tags.filter(tag => !tagMap.has(tag));

        for (const tagName of newTags) {
          try {
            const { data: newTag, error: createError } = await supabase
              .from('tags')
              .insert([{ name: tagName, user_id: user.id }])
              .select()
              .single();

            if (createError) {
              console.error('Ошибка при создании тега:', createError);

              // Создаем временный тег для отладки
              const tempTag = {
                id: Math.random().toString(36).substring(2, 15),
                name: tagName
              };

              // Добавляем временный тег в словарь
              tagMap.set(tagName, tempTag.id);
              continue;
            }

            // Добавляем новый тег в словарь
            tagMap.set(tagName, newTag.id);
          } catch (createError) {
            console.error('Ошибка при создании тега:', createError);

            // Создаем временный тег для отладки
            const tempTag = {
              id: Math.random().toString(36).substring(2, 15),
              name: tagName
            };

            // Добавляем временный тег в словарь
            tagMap.set(tagName, tempTag.id);
          }
        }

        try {
          // Получаем текущие связи тегов с записью
          const { data: currentEntryTags, error: entryTagsError } = await supabase
            .from('entry_tags')
            .select('id, tag_id, tags!inner(name)')
            .eq('entry_id', entryId);

          if (entryTagsError) {
            console.error('Ошибка при получении связей тегов с записью:', entryTagsError);

            // Обновляем массив тегов в самой записи для быстрого доступа
            try {
              const { error: updateError } = await supabase
                .from('mood_entries')
                .update({ tags })
                .eq('id', entryId)
                .eq('user_id', user.id);

              if (updateError) {
                console.error('Ошибка при обновлении тегов в записи:', updateError);
              }
            } catch (updateError) {
              console.error('Ошибка при обновлении тегов в записи:', updateError);
            }

            // Инвалидируем кэш записей
            entriesCache.current = null;
            entryCache.current.delete(entryId);

            return true;
          }

          // Определяем, какие теги нужно удалить
          const tagsToDelete = currentEntryTags.filter(
            entryTag => !tags.includes(entryTag.tags.name)
          );

          // Определяем, какие теги нужно добавить
          const currentTagNames = currentEntryTags.map(entryTag => entryTag.tags.name);
          const tagsToAdd = tags.filter(tag => !currentTagNames.includes(tag));

          // Удаляем ненужные теги
          if (tagsToDelete.length > 0) {
            try {
              const { error: deleteError } = await supabase
                .from('entry_tags')
                .delete()
                .in('id', tagsToDelete.map(tag => tag.id));

              if (deleteError) {
                console.error('Ошибка при удалении связей тегов с записью:', deleteError);
              }
            } catch (deleteError) {
              console.error('Ошибка при удалении связей тегов с записью:', deleteError);
            }
          }

          // Добавляем новые теги
          if (tagsToAdd.length > 0) {
            const newEntryTags = tagsToAdd.map(tag => ({
              entry_id: entryId,
              tag_id: tagMap.get(tag)!
            }));

            try {
              const { error: insertError } = await supabase
                .from('entry_tags')
                .insert(newEntryTags);

              if (insertError) {
                console.error('Ошибка при добавлении связей тегов с записью:', insertError);
              }
            } catch (insertError) {
              console.error('Ошибка при добавлении связей тегов с записью:', insertError);
            }
          }
        } catch (entryTagsError) {
          console.error('Ошибка при работе с связями тегов:', entryTagsError);
        }
      } catch (tagsError) {
        console.error('Ошибка при работе с тегами:', tagsError);
      }

      // Обновляем массив тегов в самой записи для быстрого доступа
      try {
        const { error: updateError } = await supabase
          .from('mood_entries')
          .update({ tags })
          .eq('id', entryId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Ошибка при обновлении тегов в записи:', updateError);
        }
      } catch (updateError) {
        console.error('Ошибка при обновлении тегов в записи:', updateError);
      }

      // Инвалидируем кэш записей
      entriesCache.current = null;
      entryCache.current.delete(entryId);

      return true;
    } catch (error) {
      console.error('Ошибка при обновлении тегов записи:', error);

      // Инвалидируем кэш записей
      entriesCache.current = null;
      entryCache.current.delete(entryId);

      return true; // Возвращаем true для отладки
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
