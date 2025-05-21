import { z } from 'zod';

// Схема валидации для записи настроения
export const moodEntrySchema = z.object({
  emoji: z.string().min(1, 'Выберите эмодзи'),
  note: z.string().min(1, 'Запись не может быть пустой').max(10000, 'Запись слишком длинная'),
  date: z.string().datetime({ message: 'Неверный формат даты' }),
});

export type MoodEntryFormData = z.infer<typeof moodEntrySchema>;

// Схема валидации для настроек пользователя
export const userSettingsSchema = z.object({
  is_public: z.boolean(),
  theme_preference: z.enum(['light', 'dark', 'system']).optional(),
  notification_enabled: z.boolean().optional(),
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;

// Функция для валидации данных
export function validateData<T>(schema: z.ZodType<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Функция для форматирования ошибок валидации
export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  errors.errors.forEach((error) => {
    if (error.path.length > 0) {
      const path = error.path.join('.');
      formattedErrors[path] = error.message;
    }
  });
  
  return formattedErrors;
}
