'use client';

import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';

interface NoteEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

export function NoteEditor({
  initialValue = '',
  onChange,
  onSave,
  autoSave = true,
  autoSaveDelay = 1000,
}: NoteEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const debouncedValue = useDebounce(value, autoSaveDelay);

  // Обработка изменений в текстовом поле
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  // Ручное сохранение
  const handleSave = () => {
    setIsSaving(true);
    if (onSave) {
      onSave();
    }
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 500);
  };

  // Автосохранение при изменении дебаунсированного значения
  useEffect(() => {
    if (autoSave && debouncedValue !== initialValue) {
      handleSave();
    }
  }, [debouncedValue, autoSave, initialValue]);

  return (
    <div className="space-y-4">
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder="Напишите о своих чувствах и мыслях..."
        className="min-h-[200px] resize-y"
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {lastSaved && (
            <span>
              Последнее сохранение: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving || value === initialValue}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );
}
