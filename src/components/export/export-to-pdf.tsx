'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { FileDown, Loader2, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

// Расширяем типы для jsPDF-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportToPdfProps {
  className?: string;
}

export function ExportToPdf({ className = '' }: ExportToPdfProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { getMoodEntries } = useSupabase();
  const { toast } = useToast();

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

  // Функция для экспорта данных в PDF
  const exportToPdf = async () => {
    setIsExporting(true);

    try {
      // Получаем записи из базы данных
      const entries = await getMoodEntries();

      if (entries.length === 0) {
        toast({
          title: 'Нет данных',
          description: 'Нет записей для экспорта в PDF',
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }

      // Сортируем записи по дате (от новых к старым)
      entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Создаем новый PDF документ
      const doc = new jsPDF();

      // Добавляем заголовок
      doc.setFontSize(20);
      doc.text('Дневник настроения', 105, 15, { align: 'center' });

      // Добавляем подзаголовок с датой экспорта
      doc.setFontSize(12);
      doc.text(`Экспорт от ${format(new Date(), 'dd.MM.yyyy', { locale: ru })}`, 105, 22, { align: 'center' });

      // Добавляем информацию о количестве записей
      doc.setFontSize(10);
      doc.text(`Всего записей: ${entries.length}`, 105, 30, { align: 'center' });

      // Подготавливаем данные для таблицы
      const tableData = entries.map(entry => [
        formatDate(entry.date),
        getEmojiName(entry.emoji),
        entry.note || '-'
      ]);

      // Добавляем таблицу с записями
      doc.autoTable({
        startY: 35,
        head: [['Дата', 'Настроение', 'Заметка']],
        body: tableData,
        headStyles: {
          fillColor: [147, 51, 234], // Цвет primary в RGB
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 'auto' }
        },
        margin: { top: 35 },
        didDrawPage: (data) => {
          // Добавляем номер страницы
          doc.setFontSize(8);
          doc.text(
            `Страница ${data.pageNumber} из ${doc.getNumberOfPages()}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        }
      });

      // Добавляем информацию о приложении в нижний колонтитул
      doc.setFontSize(8);
      doc.text(
        'Создано с помощью приложения "Дневник настроения"',
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );

      // Сохраняем PDF
      doc.save(`diary_export_${format(new Date(), 'yyyy-MM-dd')}.pdf`);

      // Показываем уведомление об успешном экспорте
      toast({
        title: 'Экспорт завершен',
        description: `Экспортировано ${entries.length} записей в PDF`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Ошибка при экспорте в PDF:', error);

      // Показываем уведомление об ошибке
      toast({
        title: 'Ошибка экспорта',
        description: 'Не удалось экспортировать данные в PDF',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={exportToPdf}
      disabled={isExporting}
      className={`rounded-full ${className}`}
      title="Экспорт в PDF"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Экспорт...</span>
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">PDF</span>
        </>
      )}
    </Button>
  );
}
