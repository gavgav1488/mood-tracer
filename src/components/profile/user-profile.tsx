'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSupabase } from '@/hooks/use-supabase';
import Image from 'next/image';

export function UserProfile() {
  const { user } = useAuth();
  const { updateUserSettings } = useSupabase();
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!user) {
    return null;
  }

  const handlePrivacyChange = async (checked: boolean) => {
    setIsPublic(checked);
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);

      // Валидация данных перед сохранением
      const { validateData, userSettingsSchema } = await import('@/lib/validations');
      const validationResult = validateData(userSettingsSchema, {
        is_public: isPublic,
      });

      if (!validationResult.success) {
        console.error('Ошибка валидации:', validationResult.errors);
        return;
      }

      // Обновляем настройки пользователя в Supabase
      await updateUserSettings(validationResult.data);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Получаем инициалы пользователя для аватара
  const getInitials = () => {
    const name = user.user_metadata?.name || user.email || '';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Профиль пользователя</CardTitle>
        <CardDescription>
          Управляйте своим профилем и настройками приватности
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || 'Пользователь'} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{user.user_metadata?.name || 'Пользователь'}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-base font-medium mb-4">Настройки приватности</h4>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="public-profile">Публичный профиль</Label>
              <p className="text-sm text-muted-foreground">
                Если включено, другие пользователи смогут видеть ваш профиль
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={isPublic}
              onCheckedChange={handlePrivacyChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {isSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Настройки успешно сохранены!
            </p>
          )}
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
        </Button>
      </CardFooter>
    </Card>
  );
}
