'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Bell, BellOff, Clock, Calendar, Save, Trash2 } from 'lucide-react';
import { useSupabase } from '@/hooks/use-supabase';

interface Reminder {
  id?: string;
  userId: string;
  time: string;
  days: string[];
  enabled: boolean;
  message: string;
}

export function ReminderSettings() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { supabase, user } = useSupabase();
  const { toast } = useToast();

  // Загрузка напоминаний при монтировании компонента
  useEffect(() => {
    const fetchReminders = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reminders')
          .select('*')
          .eq('userId', user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          setReminders(data);
        } else {
          // Если напоминаний нет, создаем одно по умолчанию
          setReminders([
            {
              userId: user.id,
              time: '20:00',
              days: ['1', '2', '3', '4', '5', '6', '7'],
              enabled: false,
              message: 'Время записать свои эмоции в дневник!'
            }
          ]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке напоминаний:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить напоминания',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, [supabase, user, toast]);

  // Добавление нового напоминания
  const addReminder = () => {
    if (!user) return;

    setReminders([
      ...reminders,
      {
        userId: user.id,
        time: '12:00',
        days: ['1', '2', '3', '4', '5'],
        enabled: false,
        message: 'Запишите свои эмоции'
      }
    ]);
  };

  // Удаление напоминания
  const removeReminder = async (index: number) => {
    const reminderToRemove = reminders[index];
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    setReminders(newReminders);

    // Если у напоминания есть id, удаляем его из базы данных
    if (reminderToRemove.id) {
      try {
        const { error } = await supabase
          .from('reminders')
          .delete()
          .eq('id', reminderToRemove.id);

        if (error) throw error;

        toast({
          title: 'Напоминание удалено',
          description: 'Напоминание успешно удалено',
        });
      } catch (error) {
        console.error('Ошибка при удалении напоминания:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить напоминание',
          variant: 'destructive',
        });
      }
    }
  };

  // Обновление напоминания
  const updateReminder = (index: number, field: keyof Reminder, value: any) => {
    const newReminders = [...reminders];
    newReminders[index] = { ...newReminders[index], [field]: value };
    setReminders(newReminders);
  };

  // Обновление дней недели
  const updateDay = (index: number, day: string) => {
    const newReminders = [...reminders];
    const currentDays = newReminders[index].days;
    
    if (currentDays.includes(day)) {
      newReminders[index].days = currentDays.filter(d => d !== day);
    } else {
      newReminders[index].days = [...currentDays, day];
    }
    
    setReminders(newReminders);
  };

  // Сохранение напоминаний
  const saveReminders = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Для каждого напоминания выполняем upsert
      for (const reminder of reminders) {
        if (reminder.id) {
          // Обновляем существующее напоминание
          const { error } = await supabase
            .from('reminders')
            .update({
              time: reminder.time,
              days: reminder.days,
              enabled: reminder.enabled,
              message: reminder.message
            })
            .eq('id', reminder.id);

          if (error) throw error;
        } else {
          // Создаем новое напоминание
          const { data, error } = await supabase
            .from('reminders')
            .insert({
              userId: user.id,
              time: reminder.time,
              days: reminder.days,
              enabled: reminder.enabled,
              message: reminder.message
            })
            .select();

          if (error) throw error;

          // Обновляем id напоминания
          if (data && data.length > 0) {
            const index = reminders.findIndex(r => 
              r.time === reminder.time && 
              r.message === reminder.message && 
              !r.id
            );
            
            if (index !== -1) {
              const newReminders = [...reminders];
              newReminders[index].id = data[0].id;
              setReminders(newReminders);
            }
          }
        }
      }

      // Запрашиваем разрешение на отправку уведомлений
      if (reminders.some(r => r.enabled) && 'Notification' in window) {
        if (Notification.permission !== 'granted') {
          await Notification.requestPermission();
        }
      }

      toast({
        title: 'Напоминания сохранены',
        description: 'Ваши настройки напоминаний успешно сохранены',
      });
    } catch (error) {
      console.error('Ошибка при сохранении напоминаний:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить напоминания',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Получение названия дня недели
  const getDayName = (day: string) => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return days[parseInt(day) - 1];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Напоминания
        </h2>
        <Button onClick={addReminder} variant="outline" className="rounded-full">
          Добавить напоминание
        </Button>
      </div>

      {reminders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">У вас нет настроенных напоминаний</p>
            <Button onClick={addReminder} variant="outline" className="mt-4">
              Добавить напоминание
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={reminder.enabled}
                      onCheckedChange={(checked) => updateReminder(index, 'enabled', checked)}
                    />
                    <Label htmlFor={`reminder-${index}`} className="font-medium">
                      {reminder.enabled ? 'Включено' : 'Отключено'}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeReminder(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`time-${index}`} className="text-sm">
                      <Clock className="h-3.5 w-3.5 inline mr-1" />
                      Время
                    </Label>
                    <Input
                      id={`time-${index}`}
                      type="time"
                      value={reminder.time}
                      onChange={(e) => updateReminder(index, 'time', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`message-${index}`} className="text-sm">
                      Сообщение
                    </Label>
                    <Input
                      id={`message-${index}`}
                      value={reminder.message}
                      onChange={(e) => updateReminder(index, 'message', e.target.value)}
                      placeholder="Текст напоминания"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Дни недели
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4', '5', '6', '7'].map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={reminder.days.includes(day) ? "default" : "outline"}
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => updateDay(index, day)}
                      >
                        {getDayName(day)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button 
            onClick={saveReminders} 
            disabled={isSaving} 
            className="w-full"
          >
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Сохранение...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Сохранить напоминания
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
