'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { CaretDownOutlined, PlusOutlined } from '../icons/ant-icons';

// Эмодзи в стиле EMMO (12 штук для сетки 4×3)
const DEFAULT_EMOJIS = [
  { value: '😊', label: 'Радость' },
  { value: '😌', label: 'Спокойствие' },
  { value: '🥰', label: 'Любовь' },
  { value: '😴', label: 'Усталость' },
  { value: '😢', label: 'Грусть' },
  { value: '😰', label: 'Тревога' },
  { value: '😤', label: 'Злость' },
  { value: '🤗', label: 'Объятия' },
  { value: '✨', label: 'Вдохновение' },
  { value: '💝', label: 'Благодарность' },
  { value: '🌸', label: 'Нежность' },
  { value: '🙃', label: 'Игривость' },
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
      {/* Заголовок с улучшенным дизайном */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-3 text-gradient-primary font-handwritten">
          Как твоё настроение? ✨
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Выбери эмодзи, которое отражает твои чувства прямо сейчас
        </p>
      </div>

      {/* Сетка эмодзи с улучшенным дизайном */}
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {emojis.map((emoji, index) => (
          <button
            key={emoji.value}
            className={cn(
              "aspect-square rounded-3xl text-4xl transition-all duration-300",
              "hover:scale-110 hover:shadow-xl active:scale-95",
              "flex items-center justify-center relative overflow-hidden",
              "glass-card animate-scale-in",
              selectedEmoji === emoji.value && "animate-glow"
            )}
            style={{
              animationDelay: `${index * 0.1}s`,
              backgroundColor: selectedEmoji === emoji.value ? 'hsl(var(--primary))' : undefined,
              color: selectedEmoji === emoji.value ? 'hsl(var(--primary-foreground))' : undefined,
              transform: selectedEmoji === emoji.value ? 'scale(1.1)' : 'scale(1)',
              boxShadow: selectedEmoji === emoji.value
                ? '0 12px 40px hsl(var(--primary) / 0.4)'
                : undefined
            }}
            onClick={() => onSelect(emoji.value)}
            onMouseEnter={() => setHoverEmoji(emoji.value)}
            onMouseLeave={() => setHoverEmoji(null)}
            title={emoji.label}
          >
            {/* Gradient overlay for selected state */}
            {selectedEmoji === emoji.value && (
              <div className="absolute inset-0 bg-gradient-primary opacity-90 rounded-3xl"></div>
            )}

            {/* Emoji */}
            <span className="relative z-10 animate-float" style={{animationDelay: `${index * 0.2}s`}}>
              {emoji.value}
            </span>

            {/* Hover effect */}
            {hoverEmoji === emoji.value && selectedEmoji !== emoji.value && (
              <div className="absolute inset-0 bg-primary/10 rounded-3xl"></div>
            )}
          </button>
        ))}
      </div>

      {/* Кнопка "Показать больше" */}
      <div className="text-center mt-6">
        <button className="glass-button rounded-2xl px-6 py-3 font-medium text-sm hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
          <PlusOutlined className="h-4 w-4" />
          <span>Больше эмодзи</span>
          <CaretDownOutlined className="h-4 w-4 animate-bounce" />
        </button>
      </div>

      {/* Отображение выбранного эмодзи с анимацией */}
      {selectedEmoji && (
        <div className="text-center mt-8 animate-slide-up">
          <div className="glass-card rounded-3xl p-6 max-w-xs mx-auto">
            <div className="text-6xl mb-4 animate-float">{selectedEmoji}</div>
            <p className="text-lg font-semibold text-gradient-primary font-handwritten">
              {emojis.find(e => e.value === selectedEmoji)?.label}
            </p>
            <div className="w-16 h-1 bg-gradient-primary rounded-full mx-auto mt-3"></div>
          </div>
        </div>
      )}
    </div>
  );
}
