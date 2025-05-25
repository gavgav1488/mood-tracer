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
  visualType?: 'default' | 'sakura';
}

// Цветовые схемы для разных эмодзи
const emojiColors: Record<string, { primary: string; secondary: string; background: string }> = {
  '😊': { primary: '#FFD700', secondary: '#FFA500', background: '#FFFACD' }, // Радость: желтый/оранжевый
  '😐': { primary: '#A9A9A9', secondary: '#D3D3D3', background: '#F5F5F5' }, // Нейтрально: серый
  '😢': { primary: '#4682B4', secondary: '#1E90FF', background: '#F0F8FF' }, // Грусть: синий
  '🥳': { primary: '#FF69B4', secondary: '#FF1493', background: '#FFF0F5' }, // Восторг: розовый
  '😤': { primary: '#DC143C', secondary: '#B22222', background: '#FFF0F0' }, // Злость: красный
  '😡': { primary: '#FF0000', secondary: '#FF4500', background: '#FFF0F0' }, // Злость (сильная): ярко-красный
  '😠': { primary: '#FF6347', secondary: '#FF7F50', background: '#FFF5EE' }, // Раздражение: томатный
  '😴': { primary: '#9370DB', secondary: '#8A2BE2', background: '#F8F4FF' }, // Усталость: фиолетовый
  '😰': { primary: '#20B2AA', secondary: '#48D1CC', background: '#F0FFFF' }, // Тревога: бирюзовый
};

// Цвета для сакуры
const sakuraColors = {
  primary: '#FFB7C5',    // Светло-розовый
  secondary: '#FF758C',  // Розовый
  background: '#FFF8DC', // Кремовый фон
  branch: '#8B4513',     // Коричневый для веток
};

export function EnhancedMoodVisualization({
  emoji,
  className = '',
  interactive = true,
  visualType = 'default'
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
      // Выбираем цвета и фон в зависимости от типа визуализации
      const colors = visualType === 'sakura'
        ? sakuraColors
        : (emojiColors[emoji] || emojiColors['😐']);

      const particles: any[] = []; // Может содержать Particle или SakuraPetal
      let branches: any[] = []; // Ветки для сакуры
      let mouseInteraction = false;
      let mouseForce = 0.1;

      // Класс для веток сакуры
      class Branch {
        x: number;
        y: number;
        length: number;
        angle: number;
        thickness: number;

        constructor(x: number, y: number, length: number, angle: number, thickness: number) {
          this.x = x;
          this.y = y;
          this.length = length;
          this.angle = angle;
          this.thickness = thickness;
        }

        display() {
          p.push();

          // Создаем градиент для ветки
          const endX = this.x + Math.cos(this.angle) * this.length;
          const endY = this.y + Math.sin(this.angle) * this.length;

          // Рисуем ветку с градиентом толщины
          const segments = 10;
          for (let i = 0; i < segments; i++) {
            const t = i / segments;
            const nextT = (i + 1) / segments;

            const currentX = p.lerp(this.x, endX, t);
            const currentY = p.lerp(this.y, endY, t);
            const nextX = p.lerp(this.x, endX, nextT);
            const nextY = p.lerp(this.y, endY, nextT);

            // Толщина уменьшается к концу ветки
            const currentThickness = p.lerp(this.thickness, this.thickness * 0.3, t);

            // Цвет ветки с небольшими вариациями
            const branchColor = p.color(sakuraColors.branch);
            if (this.thickness < 3) {
              // Тонкие ветки более светлые
              branchColor.setRed(p.red(branchColor) + 30);
              branchColor.setGreen(p.green(branchColor) + 20);
              branchColor.setBlue(p.blue(branchColor) + 10);
            }

            p.stroke(branchColor);
            p.strokeWeight(currentThickness);
            p.line(currentX, currentY, nextX, nextY);
          }

          p.pop();
        }

        getEndPoint() {
          return {
            x: this.x + Math.cos(this.angle) * this.length,
            y: this.y + Math.sin(this.angle) * this.length
          };
        }
      }

      // Класс для цветов сакуры на ветках (статичные)
      class SakuraFlower {
        x: number;
        y: number;
        size: number;
        color: string;
        rotation: number;
        petals: number;
        bloomProgress: number;
        maxBloom: number;

        constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
          this.size = p.random(8, 16) * particleSize;
          this.color = p.random() > 0.4 ? sakuraColors.primary : sakuraColors.secondary;
          this.rotation = p.random(p.TWO_PI);
          this.petals = 5; // У сакуры 5 лепестков
          this.bloomProgress = 0;
          this.maxBloom = p.random(0.8, 1.2);
        }

        update() {
          // Постепенное распускание цветка
          if (this.bloomProgress < this.maxBloom) {
            this.bloomProgress += 0.01;
          }

          // Легкое покачивание на ветру
          this.rotation += 0.002;
        }

        display() {
          p.push();
          p.translate(this.x, this.y);
          p.rotate(this.rotation);

          // Рисуем цветок сакуры
          this.drawSakuraFlower(0, 0, this.size * this.bloomProgress);

          p.pop();
        }

        drawSakuraFlower(x: number, y: number, size: number) {
          p.noStroke();

          // Рисуем 5 лепестков
          for (let i = 0; i < this.petals; i++) {
            p.push();
            p.rotate((p.TWO_PI / this.petals) * i);

            // Градиент для лепестка
            const petalColor = p.color(this.color);
            petalColor.setAlpha(200);
            p.fill(petalColor);

            // Форма лепестка сакуры
            p.beginShape();
            p.vertex(0, 0);
            p.bezierVertex(size * 0.3, -size * 0.2, size * 0.6, -size * 0.4, size * 0.8, -size * 0.1);
            p.bezierVertex(size * 0.6, size * 0.1, size * 0.3, size * 0.2, 0, 0);
            p.endShape(p.CLOSE);

            p.pop();
          }

          // Центр цветка
          const centerColor = p.color('#FFE4E1');
          p.fill(centerColor);
          p.ellipse(x, y, size * 0.3);

          // Тычинки
          const stamenColor = p.color('#FFB6C1');
          p.fill(stamenColor);
          for (let i = 0; i < 8; i++) {
            const angle = (p.TWO_PI / 8) * i;
            const stamenX = x + Math.cos(angle) * size * 0.1;
            const stamenY = y + Math.sin(angle) * size * 0.1;
            p.ellipse(stamenX, stamenY, size * 0.05);
          }
        }
      }

      // Класс для падающих лепестков сакуры
      class SakuraPetal {
        x: number;
        y: number;
        size: number;
        color: string;
        speed: number;
        direction: number;
        rotation: number;
        rotationSpeed: number;
        swayFactor: number;
        swayOffset: number;

        constructor(x?: number, y?: number) {
          this.x = x !== undefined ? x : p.random(-50, p.width + 50);
          this.y = y !== undefined ? y : p.random(-100, -10); // Начинаем выше экрана
          this.size = p.random(20, 40) * particleSize; // Еще больше увеличили размер лепестков

          // Больше разнообразия в цветах
          const colorChoice = p.random();
          if (colorChoice < 0.4) {
            this.color = sakuraColors.primary;
          } else if (colorChoice < 0.7) {
            this.color = sakuraColors.secondary;
          } else {
            this.color = '#FFC0CB'; // Светло-розовый
          }

          this.speed = p.random(3, 6) * particleSpeed; // Значительно увеличили скорость падения
          this.direction = p.PI / 2 + p.random(-0.3, 0.3); // Падение вниз с отклонением
          this.rotation = p.random(p.TWO_PI);
          this.rotationSpeed = p.random(-0.12, 0.12); // Еще больше увеличили скорость вращения
          this.swayFactor = p.random(2, 5); // Увеличили амплитуду колебаний
          this.swayOffset = p.random(p.TWO_PI);
        }

        update() {
          // Более сложное движение лепестка
          const time = p.frameCount * 0.04; // Еще больше увеличили скорость анимации

          // Основное колебание из стороны в сторону
          const sway = Math.sin(time + this.swayOffset) * this.swayFactor;

          // Дополнительное вертикальное колебание для более реалистичного падения
          const verticalSway = Math.sin(time * 3 + this.swayOffset) * 1.2; // Увеличили амплитуду и частоту

          // Движение по X с колебанием
          this.x += Math.cos(this.direction + sway * 0.5) * this.speed + sway * 0.6;

          // Движение по Y с небольшими колебаниями - основная скорость падения
          this.y += Math.sin(this.direction) * this.speed + verticalSway;

          // Вращение лепестка
          this.rotation += this.rotationSpeed;

          // Если лепесток вышел за пределы экрана снизу, возвращаем его наверх
          if (this.y > p.height + this.size * 2) {
            this.y = p.random(-100, -10);
            this.x = p.random(-50, p.width + 50);
            // Немного варьируем параметры при возрождении
            this.speed = p.random(3, 6) * particleSpeed; // Обновили диапазон скорости
            this.swayFactor = p.random(2, 5); // Обновили диапазон колебаний
          }

          // Если лепесток вышел за боковые границы, плавно возвращаем его
          if (this.x < -this.size * 2) {
            this.x = p.width + this.size;
          } else if (this.x > p.width + this.size * 2) {
            this.x = -this.size;
          }
        }

        display() {
          p.push();
          p.translate(this.x, this.y);
          p.rotate(this.rotation);

          p.noStroke();
          p.fill(this.color);

          // Рисуем лепесток сакуры
          this.drawPetal(0, 0, this.size);

          p.pop();
        }

        drawPetal(x: number, y: number, size: number) {
          // Рисуем красивый лепесток сакуры в форме сердца
          p.noStroke();

          // Добавляем мягкую тень
          const shadowColor = p.color(this.color);
          shadowColor.setAlpha(30);
          p.fill(shadowColor);

          // Тень лепестка
          p.push();
          p.translate(1.5, 1.5);
          this.drawPetalShape(x, y, size);
          p.pop();

          // Основной лепесток с градиентом
          const mainColor = p.color(this.color);
          mainColor.setAlpha(200);
          p.fill(mainColor);
          this.drawPetalShape(x, y, size);

          // Добавляем светлый центр для объема
          const highlightColor = p.color(this.color);
          highlightColor.setRed(Math.min(255, p.red(highlightColor) + 40));
          highlightColor.setGreen(Math.min(255, p.green(highlightColor) + 40));
          highlightColor.setBlue(Math.min(255, p.blue(highlightColor) + 40));
          highlightColor.setAlpha(120);
          p.fill(highlightColor);
          this.drawPetalShape(x, y, size * 0.6);

          // Добавляем тонкие прожилки
          const veinColor = p.color(this.color);
          veinColor.setAlpha(80);
          p.stroke(veinColor);
          p.strokeWeight(0.3);

          // Центральная прожилка
          p.line(x, y, x + size * 0.5, y - size * 0.15);

          // Боковые прожилки
          p.line(x + size * 0.1, y + size * 0.05, x + size * 0.4, y - size * 0.1);
          p.line(x + size * 0.1, y - size * 0.05, x + size * 0.4, y - size * 0.2);

          p.noStroke();
        }

        drawPetalShape(x: number, y: number, size: number) {
          // Форма лепестка сакуры - более реалистичная
          p.beginShape();
          p.vertex(x, y); // Основание лепестка

          // Левая сторона лепестка
          p.bezierVertex(
            x + size * 0.1, y - size * 0.3,
            x + size * 0.3, y - size * 0.5,
            x + size * 0.5, y - size * 0.4
          );

          // Верхняя часть (с небольшим вырезом)
          p.bezierVertex(
            x + size * 0.6, y - size * 0.35,
            x + size * 0.7, y - size * 0.2,
            x + size * 0.6, y - size * 0.1
          );

          // Правая сторона лепестка
          p.bezierVertex(
            x + size * 0.5, y,
            x + size * 0.3, y + size * 0.1,
            x, y
          );

          p.endShape(p.CLOSE);
        }
      }

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
            } else if (emoji === '😤' || emoji === '😡' || emoji === '😠') {
              // Треугольники для злости и раздражения
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
          // Добавляем свечение для звезд
          p.push();

          // Рисуем свечение
          p.noStroke();
          const glowColor = p.color(this.color);
          glowColor.setAlpha(50);
          p.fill(glowColor);

          // Увеличенная звезда для свечения
          let angle = p.TWO_PI / npoints;
          let halfAngle = angle / 2.0;
          p.beginShape();
          for (let a = 0; a < p.TWO_PI; a += angle) {
            let sx = x + p.cos(a) * (radius2 * 1.3);
            let sy = y + p.sin(a) * (radius2 * 1.3);
            p.vertex(sx, sy);
            sx = x + p.cos(a + halfAngle) * (radius1 * 1.3);
            sy = y + p.sin(a + halfAngle) * (radius1 * 1.3);
            p.vertex(sx, sy);
          }
          p.endShape(p.CLOSE);

          // Рисуем основную звезду
          p.fill(this.color);
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

          p.pop();
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
          // Добавляем свечение для треугольников (злость)
          p.push();

          // Рисуем свечение
          p.noStroke();
          const glowColor = p.color(this.color);
          glowColor.setAlpha(30);
          p.fill(glowColor);

          // Увеличенный треугольник для свечения
          p.triangle(
            x, y - size * 1.3,
            x - size * 1.3, y + size * 1.3,
            x + size * 1.3, y + size * 1.3
          );

          // Рисуем основной треугольник
          p.fill(this.color);
          p.triangle(
            x, y - size,
            x - size, y + size,
            x + size, y + size
          );

          // Добавляем эффект "пульсации" для злости
          if (emoji === '😡') {
            const pulseColor = p.color('#FF0000');
            pulseColor.setAlpha(20 + 10 * Math.sin(p.frameCount * 0.1));
            p.fill(pulseColor);
            p.triangle(
              x, y - size * 0.8,
              x - size * 0.8, y + size * 0.8,
              x + size * 0.8, y + size * 0.8
            );
          }

          p.pop();
        }

        drawMoon(x: number, y: number, size: number) {
          p.arc(x, y, size * 2, size * 2, p.PI / 6, p.PI * 11 / 6);
          p.arc(x + size * 0.6, y, size * 1.5, size * 1.5, p.PI * 3 / 2, p.PI / 2, p.OPEN);
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(containerRef.current!.offsetWidth, containerRef.current!.offsetHeight || 300);
        canvas.parent(containerRef.current!);

        // Устанавливаем фон
        p.background(colors.background);

        if (visualType === 'sakura') {
          // Создаем много падающих лепестков сакуры для впечатляющего эффекта
          for (let i = 0; i < particleCount * 2; i++) {
            particles.push(new SakuraPetal());
          }
        } else {
          // Создаем обычные частицы
          for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
          }
        }

        // Включаем взаимодействие с мышью, если интерактивный режим включен
        mouseInteraction = interactive;
      };

      // Функция для создания веток сакуры
      const createSakuraBranches = () => {
        // Создаем основной ствол
        const trunkX = p.width / 2;
        const trunkY = p.height;
        const trunkLength = p.height * 0.3;
        const trunkAngle = -p.PI / 2; // Вверх

        // Добавляем основной ствол
        const trunk = new Branch(trunkX, trunkY, trunkLength, trunkAngle, 12);
        branches.push(trunk);

        // Создаем основные ветки от ствола
        const trunkEnd = trunk.getEndPoint();

        // Левая основная ветка
        const leftMainBranch = new Branch(
          trunkEnd.x,
          trunkEnd.y,
          trunkLength * 0.8,
          -p.PI / 2 - p.PI / 4,
          8
        );
        branches.push(leftMainBranch);

        // Правая основная ветка
        const rightMainBranch = new Branch(
          trunkEnd.x,
          trunkEnd.y,
          trunkLength * 0.8,
          -p.PI / 2 + p.PI / 4,
          8
        );
        branches.push(rightMainBranch);

        // Центральная ветка
        const centerBranch = new Branch(
          trunkEnd.x,
          trunkEnd.y,
          trunkLength * 0.6,
          -p.PI / 2,
          6
        );
        branches.push(centerBranch);

        // Рекурсивно добавляем ветки
        addBranches(leftMainBranch, 3);
        addBranches(rightMainBranch, 3);
        addBranches(centerBranch, 2);
      };

      // Рекурсивная функция для добавления веток
      const addBranches = (parentBranch: Branch, depth: number) => {
        if (depth <= 0) return;

        const endpoint = parentBranch.getEndPoint();

        // Создаем 2-4 ветки от родительской в зависимости от глубины
        const numBranches = depth > 1 ? p.floor(p.random(2, 4)) : p.floor(p.random(3, 6));

        for (let i = 0; i < numBranches; i++) {
          // Угол ветки относительно родительской - более естественное распределение
          let angleOffset;
          if (numBranches === 2) {
            angleOffset = i === 0 ? -p.PI / 6 : p.PI / 6;
          } else {
            angleOffset = p.map(i, 0, numBranches - 1, -p.PI / 3, p.PI / 3);
          }

          const angle = parentBranch.angle + angleOffset + p.random(-p.PI / 8, p.PI / 8);

          // Длина ветки (меньше родительской)
          const lengthMultiplier = depth > 1 ? p.random(0.6, 0.8) : p.random(0.3, 0.6);
          const length = parentBranch.length * lengthMultiplier;

          // Толщина ветки (меньше родительской)
          const thickness = Math.max(1, parentBranch.thickness * 0.7);

          // Создаем новую ветку
          const newBranch = new Branch(endpoint.x, endpoint.y, length, angle, thickness);
          branches.push(newBranch);

          // Рекурсивно добавляем ветки к этой ветке
          addBranches(newBranch, depth - 1);

          // Добавляем цветы на концах тонких веток
          if (depth <= 2 && thickness <= 3) {
            const branchEnd = newBranch.getEndPoint();

            // Создаем группу цветов на ветке
            for (let j = 0; j < p.random(2, 5); j++) {
              const flowerX = p.lerp(endpoint.x, branchEnd.x, p.random(0.7, 1));
              const flowerY = p.lerp(endpoint.y, branchEnd.y, p.random(0.7, 1));

              // Добавляем цветок (статичный лепесток на ветке)
              particles.push(new SakuraFlower(
                flowerX + p.random(-5, 5),
                flowerY + p.random(-5, 5)
              ));
            }
          }
        }
      };

      p.draw = () => {
        if (visualType === 'sakura') {
          // Используем простой фон для сакуры
          p.background(sakuraColors.background);
        } else {
          p.background(colors.background);
        }

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
        className={`w-full ${isFullscreen ? 'h-screen' : 'h-[300px]'} rounded-lg overflow-hidden shadow-inner border border-amber-200/50`}
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
