'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

const emojis = [
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

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="text-6xl transition-all duration-300 transform hover:scale-110">
          {selectedEmoji}
        </div>
      </div>
      <div className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {hoverEmoji
            ? emojis.find(e => e.value === hoverEmoji)?.label
            : emojis.find(e => e.value === selectedEmoji)?.label || 'Выберите настроение'}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        {emojis.map((emoji) => (
          <button
            key={emoji.value}
            className={cn(
              "w-12 h-12 text-2xl flex items-center justify-center rounded-full transition-all duration-200",
              selectedEmoji === emoji.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            )}
            onClick={() => onSelect(emoji.value)}
            onMouseEnter={() => setHoverEmoji(emoji.value)}
            onMouseLeave={() => setHoverEmoji(null)}
          >
            {emoji.value}
          </button>
        ))}
      </div>
    </div>
  );
}
