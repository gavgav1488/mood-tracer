'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Стандартные эмодзи
const DEFAULT_EMOJIS = [
  { emoji: '😊', label: 'Радость' },
  { emoji: '😐', label: 'Нейтрально' },
  { emoji: '😢', label: 'Грусть' },
  { emoji: '🥳', label: 'Восторг' },
  { emoji: '😤', label: 'Злость' },
  { emoji: '😴', label: 'Усталость' },
  { emoji: '😰', label: 'Тревога' },
];

interface EmojiSettingsProps {
  onSave?: () => void;
}

export function EmojiSettings({ onSave }: EmojiSettingsProps) {
  const [emojis, setEmojis] = useState<Array<{ emoji: string; label: string }>>(DEFAULT_EMOJIS);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Загрузка сохраненных эмодзи при монтировании компонента
  useEffect(() => {
    const savedEmojis = localStorage.getItem('custom-emojis');
    if (savedEmojis) {
      try {
        const parsedEmojis = JSON.parse(savedEmojis);
        if (Array.isArray(parsedEmojis) && parsedEmojis.length > 0) {
          setEmojis(parsedEmojis);
        }
      } catch (error) {
        console.error('Ошибка при загрузке эмодзи:', error);
      }
    }
  }, []);

  // Функция для обновления эмодзи
  const updateEmoji = (index: number, field: 'emoji' | 'label', value: string) => {
    const updatedEmojis = [...emojis];
    updatedEmojis[index] = { ...updatedEmojis[index], [field]: value };
    setEmojis(updatedEmojis);
  };

  // Функция для добавления нового эмодзи
  const addEmoji = () => {
    setEmojis([...emojis, { emoji: '😀', label: 'Новое настроение' }]);
  };

  // Функция для удаления эмодзи
  const removeEmoji = (index: number) => {
    if (emojis.length <= 1) {
      toast({
        title: 'Невозможно удалить',
        description: 'Должен быть хотя бы один эмодзи',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedEmojis = [...emojis];
    updatedEmojis.splice(index, 1);
    setEmojis(updatedEmojis);
  };

  // Функция для сохранения настроек
  const saveSettings = () => {
    setIsSaving(true);
    
    try {
      // Проверка на дубликаты эмодзи
      const uniqueEmojis = new Set(emojis.map(e => e.emoji));
      if (uniqueEmojis.size !== emojis.length) {
        toast({
          title: 'Ошибка сохранения',
          description: 'Эмодзи не должны повторяться',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }
      
      // Проверка на пустые поля
      const hasEmptyFields = emojis.some(e => !e.emoji || !e.label);
      if (hasEmptyFields) {
        toast({
          title: 'Ошибка сохранения',
          description: 'Все поля должны быть заполнены',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }
      
      // Сохранение в localStorage
      localStorage.setItem('custom-emojis', JSON.stringify(emojis));
      
      toast({
        title: 'Настройки сохранены',
        description: 'Ваши настройки эмодзи успешно сохранены',
      });
      
      // Вызов колбэка, если он предоставлен
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      toast({
        title: 'Ошибка сохранения',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Функция для сброса настроек к значениям по умолчанию
  const resetToDefaults = () => {
    setEmojis(DEFAULT_EMOJIS);
    localStorage.removeItem('custom-emojis');
    
    toast({
      title: 'Настройки сброшены',
      description: 'Настройки эмодзи сброшены к значениям по умолчанию',
    });
    
    if (onSave) {
      onSave();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройка эмодзи</CardTitle>
        <CardDescription>
          Настройте эмодзи, которые будут использоваться для записи настроения
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emojis.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-1/4">
                <Label htmlFor={`emoji-${index}`} className="mb-1 block">
                  Эмодзи
                </Label>
                <Input
                  id={`emoji-${index}`}
                  value={item.emoji}
                  onChange={(e) => updateEmoji(index, 'emoji', e.target.value)}
                  className="text-center text-2xl"
                  maxLength={2}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`label-${index}`} className="mb-1 block">
                  Название
                </Label>
                <Input
                  id={`label-${index}`}
                  value={item.label}
                  onChange={(e) => updateEmoji(index, 'label', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="mt-6"
                onClick={() => removeEmoji(index)}
                title="Удалить"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addEmoji}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить эмодзи
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetToDefaults}
          disabled={isSaving}
        >
          Сбросить к стандартным
        </Button>
        <Button
          onClick={saveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
