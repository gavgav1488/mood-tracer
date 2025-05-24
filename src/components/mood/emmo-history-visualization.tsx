'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Info, RefreshCw } from 'lucide-react';
import { format, subDays, subMonths, subWeeks, subYears, isAfter, isBefore, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import p5 from 'p5';

// Определение типов эмоций и их координат на карте
interface EmotionPoint {
  x: number;
  y: number;
  emoji: string;
  label: string;
  color: string;
}

// Карта эмоций с координатами (такая же, как в emmo-style-tracker.tsx)
const EMOTION_MAP: EmotionPoint[] = [
  { x: 75, y: 25, emoji: '😊', label: 'Радость', color: '#FFD700' },
  { x: 25, y: 50, emoji: '😐', label: 'Нейтрально', color: '#A9A9A9' },
  { x: 25, y: 75, emoji: '😢', label: 'Грусть', color: '#4682B4' },
  { x: 75, y: 10, emoji: '🥳', label: 'Восторг', color: '#FF69B4' },
  { x: 90, y: 50, emoji: '😤', label: 'Злость', color: '#DC143C' },
  { x: 50, y: 90, emoji: '😴', label: 'Усталость', color: '#9370DB' },
  { x: 10, y: 50, emoji: '😰', label: 'Тревога', color: '#20B2AA' },
];

// Функция для нахождения ближайшей эмоции к заданным координатам
function findClosestEmotion(x: number, y: number): EmotionPoint {
  let closest = EMOTION_MAP[0];
  let minDistance = Number.MAX_VALUE;

  EMOTION_MAP.forEach(emotion => {
    const distance = Math.sqrt(
      Math.pow(emotion.x - x, 2) + Math.pow(emotion.y - y, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closest = emotion;
    }
  });

  return closest;
}

// Типы периодов для фильтрации
type Period = 'day' | 'week' | 'month' | 'year' | 'all';

interface EmmoHistoryVisualizationProps {
  onEntrySelected?: (entry: MoodEntry) => void;
}

export function EmmoHistoryVisualization({ onEntrySelected }: EmmoHistoryVisualizationProps) {
  const [period, setPeriod] = useState<Period>('week');
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [hoveredEntry, setHoveredEntry] = useState<MoodEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getMoodEntries } = useSupabase();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  // Загрузка записей
  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        const allEntries = await getMoodEntries();
        setEntries(allEntries.filter(entry => entry.x_position !== undefined && entry.y_position !== undefined));
      } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
        setError('Не удалось загрузить записи. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [getMoodEntries]);

  // Фильтрация записей по выбранному периоду
  const filteredEntries = useMemo(() => {
    if (!entries.length) return [];
    
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = subDays(now, 1);
        break;
      case 'week':
        startDate = subWeeks(now, 1);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'year':
        startDate = subYears(now, 1);
        break;
      case 'all':
      default:
        return entries;
    }
    
    return entries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return isAfter(entryDate, startDate) && isBefore(entryDate, now);
    });
  }, [entries, period]);

  // Инициализация p5.js для визуализации истории эмоций
  useEffect(() => {
    if (!canvasRef.current || loading) return;

    // Удаляем предыдущий скетч, если он существует
    if (sketchRef.current) {
      sketchRef.current.remove();
    }

    const sketch = (p: p5) => {
      let selectedEntryId: string | null = null;

      p.setup = () => {
        const canvas = p.createCanvas(canvasRef.current!.offsetWidth, 400);
        canvas.parent(canvasRef.current!);
        p.colorMode(p.HSB, 100);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
      };

      p.draw = () => {
        p.background(240, 10, 95); // Светлый фон
        
        // Рисуем градиентный фон
        for (let x = 0; x < p.width; x += 10) {
          for (let y = 0; y < p.height; y += 10) {
            const xPercent = (x / p.width) * 100;
            const yPercent = (y / p.height) * 100;
            const emotion = findClosestEmotion(xPercent, yPercent);
            p.noStroke();
            p.fill(emotion.color + '10'); // Очень прозрачный цвет
            p.rect(x, y, 10, 10);
          }
        }

        // Рисуем точки эмоций
        EMOTION_MAP.forEach(emotion => {
          const x = (emotion.x / 100) * p.width;
          const y = (emotion.y / 100) * p.height;
          
          // Рисуем круг
          p.noStroke();
          p.fill(emotion.color + '40');
          p.ellipse(x, y, 40, 40);
          
          // Рисуем эмодзи
          p.fill(0);
          p.text(emotion.emoji, x, y);
          
          // Рисуем название эмоции
          p.textSize(10);
          p.text(emotion.label, x, y + 25);
          p.textSize(16);
        });

        // Рисуем записи
        if (filteredEntries.length > 0) {
          filteredEntries.forEach((entry, index) => {
            if (entry.x_position === undefined || entry.y_position === undefined) return;
            
            const x = (entry.x_position / 100) * p.width;
            const y = (entry.y_position / 100) * p.height;
            const entryDate = parseISO(entry.date);
            const daysAgo = Math.floor((new Date().getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
            
            // Размер точки зависит от интенсивности и времени (более новые записи крупнее)
            const size = entry.intensity ? (entry.intensity / 3) : 15;
            const alpha = Math.max(0.3, 1 - (daysAgo / 30)); // Прозрачность зависит от давности записи
            
            // Определяем цвет на основе эмодзи
            const emotion = findClosestEmotion(entry.x_position, entry.y_position);
            
            // Проверяем, выбрана ли эта запись
            const isSelected = selectedEntry && selectedEntry.id === entry.id;
            const isHovered = hoveredEntry && hoveredEntry.id === entry.id;
            
            // Рисуем точку записи
            if (isSelected) {
              // Выделенная запись
              p.stroke(0);
              p.strokeWeight(2);
              p.fill(emotion.color + 'CC');
              p.ellipse(x, y, size + 10, size + 10);
            } else if (isHovered) {
              // Запись, на которую наведен курсор
              p.stroke(0);
              p.strokeWeight(1);
              p.fill(emotion.color + 'AA');
              p.ellipse(x, y, size + 5, size + 5);
            } else {
              // Обычная запись
              p.noStroke();
              p.fill(emotion.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
              p.ellipse(x, y, size, size);
            }
            
            // Рисуем эмодзи внутри точки
            p.fill(0);
            p.textSize(Math.min(14, size / 2));
            p.text(entry.emoji, x, y);
            p.textSize(16);
          });
        }
      };

      p.mousePressed = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          // Проверяем, нажал ли пользователь на какую-либо запись
          const clickedEntry = findEntryAtPosition(p.mouseX, p.mouseY);
          if (clickedEntry) {
            setSelectedEntry(clickedEntry);
            if (onEntrySelected) {
              onEntrySelected(clickedEntry);
            }
          }
        }
      };

      p.mouseMoved = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          // Проверяем, навел ли пользователь на какую-либо запись
          const entryAtPosition = findEntryAtPosition(p.mouseX, p.mouseY);
          setHoveredEntry(entryAtPosition);
        } else {
          setHoveredEntry(null);
        }
      };

      p.windowResized = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.offsetWidth, 400);
        }
      };

      // Функция для поиска записи по координатам мыши
      const findEntryAtPosition = (mouseX: number, mouseY: number): MoodEntry | null => {
        for (const entry of filteredEntries) {
          if (entry.x_position === undefined || entry.y_position === undefined) continue;
          
          const entryX = (entry.x_position / 100) * p.width;
          const entryY = (entry.y_position / 100) * p.height;
          const entrySize = entry.intensity ? (entry.intensity / 3) : 15;
          
          // Проверяем, находится ли мышь внутри круга записи
          const distance = p.dist(mouseX, mouseY, entryX, entryY);
          if (distance < entrySize / 2) {
            return entry;
          }
        }
        return null;
      };
    };

    sketchRef.current = new p5(sketch);

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
    };
  }, [filteredEntries, loading, selectedEntry, hoveredEntry, onEntrySelected]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>История эмоций</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Визуализация истории ваших эмоций на карте. Размер точки зависит от интенсивности эмоции, а прозрачность - от давности записи.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Выберите период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">За день</SelectItem>
                  <SelectItem value="week">За неделю</SelectItem>
                  <SelectItem value="month">За месяц</SelectItem>
                  <SelectItem value="year">За год</SelectItem>
                  <SelectItem value="all">За всё время</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'запись' : 
                filteredEntries.length >= 2 && filteredEntries.length <= 4 ? 'записи' : 'записей'}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div ref={canvasRef} className="w-full h-[400px] rounded-lg overflow-hidden mb-4" />
              
              {hoveredEntry && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{hoveredEntry.emoji}</span>
                    <div>
                      <h4 className="font-medium">{findClosestEmotion(hoveredEntry.x_position || 50, hoveredEntry.y_position || 50).label}</h4>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(hoveredEntry.date), 'd MMMM yyyy, HH:mm', { locale: ru })}
                      </p>
                    </div>
                  </div>
                  {hoveredEntry.note && (
                    <p className="text-sm">{hoveredEntry.note}</p>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
