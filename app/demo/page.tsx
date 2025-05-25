'use client';

import { useState } from 'react';
import { DropdownFilter } from '../../src/components/ui/dropdown-filter';
import { Button } from '@/components/ui/button';
import { ChevronDown, Heart, Smile, Brain } from 'lucide-react';
import {
  CaretDownOutlined,
  HeartFilled,
  SmileOutlined as AntSmileOutlined,
  FireOutlined,
  CalendarOutlined,
  BellOutlined
} from '../../src/components/icons/ant-icons';

const moodOptions = [
  { value: 'happy', label: 'Радостное', emoji: '😊' },
  { value: 'calm', label: 'Спокойное', emoji: '😌' },
  { value: 'excited', label: 'Взволнованное', emoji: '🤩' },
  { value: 'sad', label: 'Грустное', emoji: '😢' },
  { value: 'angry', label: 'Злое', emoji: '😤' },
  { value: 'inspired', label: 'Вдохновленное', emoji: '✨' },
];

const timeOptions = [
  { value: 'today', label: 'Сегодня', emoji: '📅' },
  { value: 'week', label: 'Эта неделя', emoji: '📊' },
  { value: 'month', label: 'Этот месяц', emoji: '📈' },
  { value: 'year', label: 'Этот год', emoji: '🗓️' },
];

export default function DemoPage() {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTime, setSelectedTime] = useState('today');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rounded-full glass-card px-4 py-2 text-sm font-medium text-primary mb-6">
            <CaretDownOutlined className="h-4 w-4 animate-bounce" />
            <span className="font-handwritten text-base">Демо Ant Design ✨</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            <span className="text-gradient-cosmic">Выпадающие</span>
            <br />
            <span className="font-handwritten text-gradient-primary">меню</span>
          </h1>

          <p className="max-w-[600px] mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Демонстрация использования иконки ChevronDown в различных компонентах интерфейса 🎯
          </p>
        </div>

        {/* Demo Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {/* Mood Filter */}
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <HeartFilled className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Фильтр настроения</h3>
              </div>
              <DropdownFilter
                options={moodOptions}
                value={selectedMood}
                onChange={setSelectedMood}
                placeholder="Выберите настроение"
              />
              {selectedMood && (
                <div className="mt-4 p-3 glass-card rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    Выбрано: <span className="font-medium text-primary">
                      {moodOptions.find(m => m.value === selectedMood)?.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Time Filter */}
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarOutlined className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Период времени</h3>
              </div>
              <DropdownFilter
                options={timeOptions}
                value={selectedTime}
                onChange={setSelectedTime}
                placeholder="Выберите период"
              />
              <div className="mt-4 p-3 glass-card rounded-2xl">
                <p className="text-sm text-muted-foreground">
                  Период: <span className="font-medium text-primary">
                    {timeOptions.find(t => t.value === selectedTime)?.label}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FireOutlined className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Действие</h3>
              </div>
              <Button className="w-full glass-button rounded-2xl font-medium px-4 py-3 bg-gradient-primary border-0 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <span>Показать результаты</span>
                <CaretDownOutlined className="h-4 w-4 animate-bounce" />
              </Button>
              <div className="mt-4 p-3 glass-card rounded-2xl">
                <p className="text-xs text-muted-foreground text-center">
                  Ant Design CaretDown с анимацией ⬇️
                </p>
              </div>
            </div>

          </div>

          {/* Results Section */}
          {(selectedMood || selectedTime) && (
            <div className="mt-12 glass-card rounded-3xl p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-gradient-primary mb-6 text-center">
                Результаты фильтрации ✨
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-primary/5 rounded-2xl">
                  <h4 className="font-semibold mb-2">Настроение:</h4>
                  <p className="text-muted-foreground">
                    {selectedMood
                      ? `${moodOptions.find(m => m.value === selectedMood)?.emoji} ${moodOptions.find(m => m.value === selectedMood)?.label}`
                      : 'Не выбрано'
                    }
                  </p>
                </div>
                <div className="p-4 bg-accent/5 rounded-2xl">
                  <h4 className="font-semibold mb-2">Период:</h4>
                  <p className="text-muted-foreground">
                    {timeOptions.find(t => t.value === selectedTime)?.emoji} {timeOptions.find(t => t.value === selectedTime)?.label}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
