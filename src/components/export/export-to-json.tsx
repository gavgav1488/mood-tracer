'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { FileDown, Loader2 } from 'lucide-react';

interface ExportToJsonProps {
  className?: string;
}

export function ExportToJson({ className = '' }: ExportToJsonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { getMoodEntries } = useSupabase();

  // Функция для экспорта в JSON
  const exportToJson = async () => {
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
      
      // Создаем объект с метаданными и записями
      const exportData = {
        exportDate: new Date().toISOString(),
        exportType: 'mood-diary',
        entries: sortedEntries
      };
      
      // Преобразуем объект в JSON-строку
      const jsonContent = JSON.stringify(exportData, null, 2);
      
      // Создаем Blob с JSON-контентом
      const blob = new Blob([jsonContent], { type: 'application/json' });
      
      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', 'mood-diary.json');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Ошибка при экспорте в JSON:', error);
      alert('Произошла ошибка при экспорте. Пожалуйста, попробуйте позже.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToJson}
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
          Экспорт в JSON
        </>
      )}
    </Button>
  );
}
