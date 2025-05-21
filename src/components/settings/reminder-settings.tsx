'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { ReminderSettings as ReminderSettingsComponent } from '@/components/reminders/reminder-settings';

interface ReminderSettingsProps {
  onSave?: () => void;
}

export function ReminderSettings({ onSave }: ReminderSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Напоминания
        </CardTitle>
        <CardDescription>
          Настройте напоминания, чтобы не забывать записывать свои эмоции
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReminderSettingsComponent />
      </CardContent>
    </Card>
  );
}
