'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { FileDown, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ExportToCsvProps {
  className?: string;
}

export function ExportToCsv({ className = '' }: ExportToCsvProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { getMoodEntries } = useSupabase();

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy', { locale: ru });
    } catch (error) {
      return dateString;
    }
  };

  // Функция для получения эмодзи в виде текста
  const getEmojiName = (emoji: string) => {
    const emojiMap: Record<string, string> = {
      '😊': 'Радость',
      '😐': 'Нейтрально',
      '😢': 'Грусть',
      '🥳': 'Восторг',
      '😤': 'Злость',
      '😴': 'Усталость',
      '😰': 'Тревога',
    };
    return emojiMap[emoji] || emoji;
  };

  // Функция для экранирования текста в CSV
  const escapeCsvValue = (value: string) => {
    if (value === null || value === undefined) return '';
    
    // Если значение содержит запятую, двойную кавычку или перенос строки,
    // заключаем его в двойные кавычки и экранируем внутренние двойные кавычки
    const needsQuotes = /[",\n\r]/.test(value);
    
    if (needsQuotes) {
      // Заменяем двойные кавычки на две двойные кавычки
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    
    return value;
  };

  // Функция для создания CSV-контента
  const createCsvContent = (entries: MoodEntry[]) => {
    // Заголовки столбцов
    const headers = ['Дата', 'Настроение', 'Запись'];
    
    // Строки данных
    const rows = entries.map(entry => [
      formatDate(entry.date),
      `${entry.emoji} ${getEmojiName(entry.emoji)}`,
      entry.note || ''
    ]);
    
    // Объединяем заголовки и строки
    const csvContent = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');
    
    return csvContent;
  };

  // Функция для экспорта в CSV
  const exportToCsv = async () => {
    try {
      setIsExporting(true);
      
      // Получаем записи из базы данных
      const entries = await getMoodEntries();
      
      if (entries.length === 0) {
        alert('Нет записей для экспорта');
        setIsExporting(false);
        return;
      }
      
      // Сортируем записи по дате (от новых к старым)
      const sortedEntries = [...entries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Создаем CSV-контент
      const csvContent = createCsvContent(sortedEntries);
      
      // Создаем Blob с CSV-контентом
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'mood-diary.csv');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Ошибка при экспорте в CSV:', error);
      alert('Произошла ошибка при экспорте. Пожалуйста, попробуйте позже.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToCsv}
      disabled={isExporting}
      variant="outline"
      className={className}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Экспорт...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Экспорт в CSV
        </>
      )}
    </Button>
  );
}
