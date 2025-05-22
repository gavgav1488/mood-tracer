'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Save, RefreshCw, Sparkles, Tag, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useSupabase } from '@/hooks/use-supabase';
import { useAuth } from '@/context/auth-context';
import { TagSelector } from '@/components/tags/tag-selector';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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

// Карта эмоций с координатами
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

interface EmmoStyleTrackerProps {
  onEntryCreated?: () => void;
}

export function EmmoStyleTracker({ onEntryCreated }: EmmoStyleTrackerProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [currentEmotion, setCurrentEmotion] = useState<EmotionPoint>(
    findClosestEmotion(50, 50)
  );
  const [intensity, setIntensity] = useState(50);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createMoodEntry, clearCache, updateEntryTags } = useSupabase();
  const { user } = useAuth();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  // Обновление текущей эмоции при изменении позиции
  useEffect(() => {
    const emotion = findClosestEmotion(position.x, position.y);
    setCurrentEmotion(emotion);
  }, [position]);

  // Инициализация p5.js для визуализации карты эмоций
  useEffect(() => {
    if (!canvasRef.current) return;

    // Удаляем предыдущий скетч, если он существует
    if (sketchRef.current) {
      sketchRef.current.remove();
    }

    const sketch = (p: p5) => {
      p.setup = () => {
        const canvas = p.createCanvas(canvasRef.current!.offsetWidth, 300);
        canvas.parent(canvasRef.current!);
        p.colorMode(p.HSB, 100);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(24);
      };

      p.draw = () => {
        p.background(currentEmotion.color + '20'); // Полупрозрачный фон текущей эмоции
        
        // Рисуем градиентный фон
        for (let x = 0; x < p.width; x += 10) {
          for (let y = 0; y < p.height; y += 10) {
            const xPercent = (x / p.width) * 100;
            const yPercent = (y / p.height) * 100;
            const emotion = findClosestEmotion(xPercent, yPercent);
            p.noStroke();
            p.fill(emotion.color + '30'); // Полупрозрачный цвет
            p.rect(x, y, 10, 10);
          }
        }

        // Рисуем точки эмоций
        EMOTION_MAP.forEach(emotion => {
          const x = (emotion.x / 100) * p.width;
          const y = (emotion.y / 100) * p.height;
          
          // Рисуем круг
          p.noStroke();
          p.fill(emotion.color + '80');
          p.ellipse(x, y, 60, 60);
          
          // Рисуем эмодзи
          p.fill(0);
          p.text(emotion.emoji, x, y);
          
          // Рисуем название эмоции
          p.textSize(12);
          p.text(emotion.label, x, y + 30);
          p.textSize(24);
        });

        // Рисуем текущую позицию пользователя
        const userX = (position.x / 100) * p.width;
        const userY = (position.y / 100) * p.height;
        
        // Пульсирующий эффект
        const pulseSize = 30 + Math.sin(p.frameCount * 0.1) * 5;
        
        // Внешний круг (пульсирующий)
        p.noFill();
        p.stroke(currentEmotion.color);
        p.strokeWeight(2);
        p.ellipse(userX, userY, pulseSize + 20, pulseSize + 20);
        
        // Внутренний круг
        p.fill(currentEmotion.color);
        p.noStroke();
        p.ellipse(userX, userY, pulseSize, pulseSize);
        
        // Текущая эмоция
        p.fill(255);
        p.text(currentEmotion.emoji, userX, userY);
      };

      p.mousePressed = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          const newX = (p.mouseX / p.width) * 100;
          const newY = (p.mouseY / p.height) * 100;
          setPosition({ x: newX, y: newY });
        }
      };

      p.mouseDragged = () => {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          const newX = (p.mouseX / p.width) * 100;
          const newY = (p.mouseY / p.height) * 100;
          setPosition({ x: newX, y: newY });
        }
      };

      p.windowResized = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.offsetWidth, 300);
        }
      };
    };

    sketchRef.current = new p5(sketch);

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
    };
  }, [currentEmotion, position]);

  // Обработчик сохранения записи
  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setError(null);

      // Создаем запись с текущей эмоцией и интенсивностью
      const entry = await createMoodEntry({
        date: new Date().toISOString(),
        emoji: currentEmotion.emoji,
        note: note || `Я чувствую ${currentEmotion.label.toLowerCase()} (интенсивность: ${intensity}%)`,
        tags,
        intensity, // Добавляем интенсивность
        // Можно добавить координаты для более точного отслеживания
        x_position: position.x,
        y_position: position.y,
      });

      // Если есть теги, сохраняем их
      if (entry && tags.length > 0) {
        await updateEntryTags(entry.id, tags);
      }

      // Очищаем кэш
      clearCache();

      // Вызываем колбэк, если он передан
      if (onEntryCreated) {
        onEntryCreated();
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Ошибка при сохранении записи:', error);
      setError('Не удалось сохранить запись. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>{format(new Date(), 'EEEE, d MMMM', { locale: ru })}</span>
          </div>
          <h2 className="text-2xl font-semibold">Как вы себя чувствуете сегодня?</h2>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Карта эмоций</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Нажмите или перетащите точку на карте, чтобы выбрать эмоцию</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={canvasRef} className="w-full h-[300px] rounded-lg overflow-hidden mb-4" />
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.div
                  key={currentEmotion.emoji}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl"
                >
                  {currentEmotion.emoji}
                </motion.div>
                <div>
                  <h3 className="font-medium">{currentEmotion.label}</h3>
                  <p className="text-sm text-muted-foreground">Интенсивность: {intensity}%</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="intensity" className="text-sm font-medium">
                Интенсивность эмоции
              </label>
              <Slider
                id="intensity"
                min={1}
                max={100}
                step={1}
                value={[intensity]}
                onValueChange={(value) => setIntensity(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Заметка (необязательно)
              </label>
              <textarea
                id="note"
                className="w-full min-h-[100px] p-2 rounded-md border border-input bg-background"
                placeholder="Опишите свои чувства подробнее..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Теги
              </label>
              <TagSelector
                selectedTags={tags}
                onChange={setTags}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
        <div>
          {isSuccess && (
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <Sparkles className="mr-1 h-4 w-4" />
              Запись успешно сохранена!
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setPosition({ x: 50, y: 50 });
              setIntensity(50);
              setNote('');
              setTags([]);
            }}
            disabled={isSaving}
            className="rounded-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Сбросить</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-full"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">
                  <RefreshCw className="h-4 w-4" />
                </span>
                <span className="hidden sm:inline">Сохранение...</span>
                <span className="sm:hidden">Сохр...</span>
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Сохранить запись</span>
                <span className="sm:hidden">Сохранить</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
