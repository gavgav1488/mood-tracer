'use client';

import { useState } from 'react';
import { EmmoHistoryVisualization } from '@/components/mood/emmo-history-visualization';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { MoodEntry } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EmmoHistoryPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  // Перенаправление неавторизованных пользователей
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Если загрузка не завершена, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Если пользователь не авторизован, не показываем содержимое
  if (!user) {
    return null;
  }

  // Обработчик выбора записи
  const handleEntrySelected = (entry: MoodEntry) => {
    setSelectedEntry(entry);
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">История эмоций</h1>
        <p className="text-muted-foreground mt-2">
          Визуализация истории ваших эмоций на карте EMMO
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <EmmoHistoryVisualization onEntrySelected={handleEntrySelected} />
        </div>
        <div>
          {selectedEntry ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Детали записи</span>
                  <span className="text-2xl">{selectedEntry.emoji}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Дата и время</h3>
                    <p className="flex items-center mt-1">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {format(parseISO(selectedEntry.date), 'd MMMM yyyy, HH:mm', { locale: ru })}
                    </p>
                  </div>
                  
                  {selectedEntry.intensity !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Интенсивность</h3>
                      <div className="mt-1 w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${selectedEntry.intensity}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-right mt-1">{selectedEntry.intensity}%</p>
                    </div>
                  )}
                  
                  {selectedEntry.note && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Заметка</h3>
                      <p className="mt-1 p-3 bg-muted rounded-lg text-sm">
                        <FileText className="inline-block mr-2 h-4 w-4 text-muted-foreground" />
                        {selectedEntry.note}
                      </p>
                    </div>
                  )}
                  
                  {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Теги</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedEntry.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground space-y-2">
                  <p>Выберите запись на карте, чтобы увидеть подробную информацию</p>
                  <div className="flex justify-center">
                    <ArrowLeft className="h-5 w-5 transform -rotate-45" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/emmo')}
            >
              Создать новую запись
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
