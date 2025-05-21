'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

// Стандартные эмодзи
const DEFAULT_EMOJIS = [
  { value: '😊', label: 'Радость' },
  { value: '😐', label: 'Нейтрально' },
  { value: '😢', label: 'Грусть' },
  { value: '🥳', label: 'Восторг' },
  { value: '😤', label: 'Злость' },
  { value: '😴', label: 'Усталость' },
  { value: '😰', label: 'Тревога' },
];

interface EmojiPickerProps {
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ selectedEmoji, onSelect }: EmojiPickerProps) {
  const [hoverEmoji, setHoverEmoji] = useState<string | null>(null);
  const [emojis, setEmojis] = useState<Array<{ value: string; label: string }>>(
    DEFAULT_EMOJIS.map(e => ({ value: e.value, label: e.label }))
  );

  // Загрузка пользовательских эмодзи при монтировании компонента
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmojis = localStorage.getItem('custom-emojis');
      if (savedEmojis) {
        try {
          const parsedEmojis = JSON.parse(savedEmojis);
          if (Array.isArray(parsedEmojis) && parsedEmojis.length > 0) {
            // Преобразуем формат из { emoji, label } в { value, label }
            setEmojis(parsedEmojis.map(e => ({ value: e.emoji, label: e.label })));
          }
        } catch (error) {
          console.error('Ошибка при загрузке эмодзи:', error);
        }
      }
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Сегодня</h3>
        <div className="text-sm text-muted-foreground hidden sm:block">
          {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
        </div>
        <div className="text-sm text-muted-foreground sm:hidden">
          {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="p-4 border-b">
          <div className="flex justify-center">
            <div className="text-5xl transition-all duration-300 transform hover:scale-110">
              {selectedEmoji}
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-sm font-medium">
              {emojis.find(e => e.value === selectedEmoji)?.label || 'Выберите настроение'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-0">
          {emojis.map((emoji, index) => (
            <button
              key={emoji.value}
              className={cn(
                "flex flex-col items-center py-3 px-2 transition-all duration-200 border-t",
                // Добавляем правую границу для всех элементов, кроме каждого третьего
                index % 3 !== 2 ? "border-r" : "",
                selectedEmoji === emoji.value
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary/50"
              )}
              onClick={() => onSelect(emoji.value)}
              onMouseEnter={() => setHoverEmoji(emoji.value)}
              onMouseLeave={() => setHoverEmoji(null)}
            >
              <span className="text-2xl mb-1">{emoji.value}</span>
              <span className="text-xs font-medium">{emoji.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
