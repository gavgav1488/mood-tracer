'use client';

import { useEffect, useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { TextFormatToolbar } from '@/components/ui/text-format-toolbar';
import { applyFormat, formatTextToHtml } from '@/lib/text-formatter';

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
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Обработка форматирования текста
  const handleFormat = (format: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const { text, selectionStart: newStart, selectionEnd: newEnd } = applyFormat(
      value,
      selectionStart,
      selectionEnd,
      format
    );

    setValue(text);
    onChange(text);

    // Восстанавливаем фокус и выделение после форматирования
    textarea.focus();
    textarea.setSelectionRange(newStart, newEnd);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <TextFormatToolbar onFormat={handleFormat} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs"
        >
          {showPreview ? 'Редактировать' : 'Предпросмотр'}
        </Button>
      </div>

      {showPreview ? (
        <div
          className="min-h-[200px] border rounded-md p-3 prose prose-sm dark:prose-invert max-w-none overflow-auto"
          dangerouslySetInnerHTML={{ __html: formatTextToHtml(value) }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder="Напишите о своих чувствах и мыслях... Используйте панель инструментов для форматирования текста."
          className="min-h-[200px] resize-y font-mono text-sm"
        />
      )}

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
