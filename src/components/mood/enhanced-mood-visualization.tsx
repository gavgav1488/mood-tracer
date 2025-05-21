'use client';

import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Maximize2, 
  Minimize2, 
  Save, 
  RefreshCw,
  Pause,
  Play
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EnhancedMoodVisualizationProps {
  emoji: string;
  className?: string;
  interactive?: boolean;
}

// Цветовые схемы для разных эмодзи
const emojiColors: Record<string, { primary: string; secondary: string; background: string }> = {
  '😊': { primary: '#FFD700', secondary: '#FFA500', background: '#FFFACD' }, // Радость: желтый/оранжевый
  '😐': { primary: '#A9A9A9', secondary: '#D3D3D3', background: '#F5F5F5' }, // Нейтрально: серый
  '😢': { primary: '#4682B4', secondary: '#1E90FF', background: '#F0F8FF' }, // Грусть: синий
  '🥳': { primary: '#FF69B4', secondary: '#FF1493', background: '#FFF0F5' }, // Восторг: розовый
  '😤': { primary: '#DC143C', secondary: '#B22222', background: '#FFF0F0' }, // Злость: красный
  '😴': { primary: '#9370DB', secondary: '#8A2BE2', background: '#F8F4FF' }, // Усталость: фиолетовый
  '😰': { primary: '#20B2AA', secondary: '#48D1CC', background: '#F0FFFF' }, // Тревога: бирюзовый
};

export function EnhancedMoodVisualization({ 
  emoji, 
  className = '',
  interactive = true
}: EnhancedMoodVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [particleCount, setParticleCount] = useState(50);
  const [particleSpeed, setParticleSpeed] = useState(1);
  const [particleSize, setParticleSize] = useState(1);
  const [showEmoji, setShowEmoji] = useState(false);

  // Функция для переключения полноэкранного режима
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Обработчик изменения состояния полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Функция для сохранения визуализации как изображения
  const saveVisualization = () => {
    if (sketchRef.current) {
      sketchRef.current.saveCanvas('mood-visualization', 'png');
    }
  };

  // Функция для перезапуска визуализации
  const resetVisualization = () => {
    if (sketchRef.current) {
      sketchRef.current.remove();
      initializeSketch();
    }
  };

  // Функция для инициализации скетча p5.js
  const initializeSketch = () => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const colors = emojiColors[emoji] || emojiColors['😐'];
      const particles: Particle[] = [];
      let mouseInteraction = false;
      let mouseForce = 0.1;

      class Particle {
        x: number;
        y: number;
        size: number;
        baseSize: number;
        speedX: number;
        speedY: number;
        color: string;
        rotation: number;
        rotationSpeed: number;
        emoji: string;

        constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.baseSize = p.random(5, 15) * particleSize;
          this.size = this.baseSize;
          this.speedX = p.random(-1, 1) * particleSpeed;
          this.speedY = p.random(-1, 1) * particleSpeed;
          this.color = p.random() > 0.5 ? colors.primary : colors.secondary;
          this.rotation = p.random(p.TWO_PI);
          this.rotationSpeed = p.random(-0.05, 0.05);
          this.emoji = emoji;
        }

        update() {
          if (isPaused) return;

          this.rotation += this.rotationSpeed;
          
          // Обновление позиции
          this.x += this.speedX;
          this.y += this.speedY;

          // Отражение от границ
          if (this.x < 0 || this.x > p.width) this.speedX *= -1;
          if (this.y < 0 || this.y > p.height) this.speedY *= -1;

          // Взаимодействие с мышью
          if (mouseInteraction && p.mouseIsPressed) {
            const dx = p.mouseX - this.x;
            const dy = p.mouseY - this.y;
            const distance = p.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              const angle = p.atan2(dy, dx);
              const force = (100 - distance) * mouseForce;
              this.speedX += p.cos(angle) * force;
              this.speedY += p.sin(angle) * force;
              
              // Ограничение скорости
              const speed = p.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
              if (speed > 5 * particleSpeed) {
                this.speedX = (this.speedX / speed) * 5 * particleSpeed;
                this.speedY = (this.speedY / speed) * 5 * particleSpeed;
              }
            }
          }
        }

        display() {
          p.push();
          p.translate(this.x, this.y);
          p.rotate(this.rotation);
          
          p.noStroke();
          p.fill(this.color);
          
          if (showEmoji) {
            p.textSize(this.size * 1.5);
            p.text(this.emoji, 0, 0);
          } else {
            // Разные формы для разных эмодзи
            if (emoji === '😊' || emoji === '🥳') {
              // Звезды для радости и восторга
              this.drawStar(0, 0, this.size / 2, this.size, 5);
            } else if (emoji === '😢' || emoji === '😰') {
              // Капли для грусти и тревоги
              this.drawDrop(0, 0, this.size);
            } else if (emoji === '😤') {
              // Треугольники для злости
              this.drawTriangle(0, 0, this.size);
            } else if (emoji === '😴') {
              // Полумесяцы для усталости
              this.drawMoon(0, 0, this.size);
            } else {
              // Круги для остальных
              p.ellipse(0, 0, this.size);
            }
          }
          
          p.pop();
        }

        drawStar(x: number, y: number, radius1: number, radius2: number, npoints: number) {
          let angle = p.TWO_PI / npoints;
          let halfAngle = angle / 2.0;
          p.beginShape();
          for (let a = 0; a < p.TWO_PI; a += angle) {
            let sx = x + p.cos(a) * radius2;
            let sy = y + p.sin(a) * radius2;
            p.vertex(sx, sy);
            sx = x + p.cos(a + halfAngle) * radius1;
            sy = y + p.sin(a + halfAngle) * radius1;
            p.vertex(sx, sy);
          }
          p.endShape(p.CLOSE);
        }

        drawDrop(x: number, y: number, size: number) {
          p.beginShape();
          for (let i = 0; i < p.TWO_PI; i += 0.1) {
            let r = size * (1 + p.sin(i) * 0.3);
            let sx = x + p.cos(i) * r;
            let sy = y + p.sin(i) * r;
            p.vertex(sx, sy);
          }
          p.endShape(p.CLOSE);
        }

        drawTriangle(x: number, y: number, size: number) {
          p.triangle(
            x, y - size,
            x - size, y + size,
            x + size, y + size
          );
        }

        drawMoon(x: number, y: number, size: number) {
          p.arc(x, y, size * 2, size * 2, p.PI / 6, p.PI * 11 / 6);
          p.arc(x + size * 0.6, y, size * 1.5, size * 1.5, p.PI * 3 / 2, p.PI / 2, p.OPEN);
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(containerRef.current!.offsetWidth, containerRef.current!.offsetHeight || 300);
        canvas.parent(containerRef.current!);
        
        // Создаем частицы
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }
        
        p.background(colors.background);
        
        // Включаем взаимодействие с мышью, если интерактивный режим включен
        mouseInteraction = interactive;
      };

      p.draw = () => {
        p.background(colors.background);
        
        // Обновляем и отображаем частицы
        for (let particle of particles) {
          particle.update();
          particle.display();
        }
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight || 300);
        }
      };

      // Экспортируем функцию сохранения
      (p as any).saveVisualization = () => {
        p.saveCanvas('mood-visualization', 'png');
      };
    };

    sketchRef.current = new p5(sketch);
  };

  useEffect(() => {
    // Удаляем предыдущий скетч, если он существует
    if (sketchRef.current) {
      sketchRef.current.remove();
    }

    initializeSketch();

    // Очистка при размонтировании
    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
    };
  }, [emoji, particleCount, particleSpeed, particleSize, isPaused, showEmoji]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className={`w-full ${isFullscreen ? 'h-screen' : 'h-[300px]'} rounded-lg overflow-hidden`}
      />
      
      {interactive && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Продолжить" : "Пауза"}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={saveVisualization}
            title="Сохранить как изображение"
          >
            <Save className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={resetVisualization}
            title="Обновить визуализацию"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                title="Настройки"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Настройки визуализации</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="particle-count" className="text-sm">Количество частиц: {particleCount}</label>
                  </div>
                  <Slider
                    id="particle-count"
                    min={10}
                    max={200}
                    step={10}
                    value={[particleCount]}
                    onValueChange={(value) => setParticleCount(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="particle-speed" className="text-sm">Скорость: {particleSpeed.toFixed(1)}x</label>
                  </div>
                  <Slider
                    id="particle-speed"
                    min={0.1}
                    max={3}
                    step={0.1}
                    value={[particleSpeed]}
                    onValueChange={(value) => setParticleSpeed(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="particle-size" className="text-sm">Размер: {particleSize.toFixed(1)}x</label>
                  </div>
                  <Slider
                    id="particle-size"
                    min={0.5}
                    max={3}
                    step={0.1}
                    value={[particleSize]}
                    onValueChange={(value) => setParticleSize(value[0])}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-emoji"
                    checked={showEmoji}
                    onChange={(e) => setShowEmoji(e.target.checked)}
                  />
                  <label htmlFor="show-emoji" className="text-sm">Показывать эмодзи вместо фигур</label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
