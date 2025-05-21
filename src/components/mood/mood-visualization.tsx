'use client';

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface MoodVisualizationProps {
  emoji: string;
  className?: string;
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

export function MoodVisualization({ emoji, className = '' }: MoodVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Удаляем предыдущий скетч, если он существует
    if (sketchRef.current) {
      sketchRef.current.remove();
    }

    // Создаем новый скетч
    const sketch = (p: p5) => {
      const colors = emojiColors[emoji] || emojiColors['😐'];
      const particles: Particle[] = [];
      const particleCount = 50;

      class Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        color: string;

        constructor() {
          this.x = p.random(p.width);
          this.y = p.random(p.height);
          this.size = p.random(5, 15);
          this.speedX = p.random(-1, 1);
          this.speedY = p.random(-1, 1);
          this.color = p.random() > 0.5 ? colors.primary : colors.secondary;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          // Отражение от границ
          if (this.x < 0 || this.x > p.width) this.speedX *= -1;
          if (this.y < 0 || this.y > p.height) this.speedY *= -1;
        }

        display() {
          p.noStroke();
          p.fill(this.color);
          
          // Разные формы для разных эмодзи
          if (emoji === '😊' || emoji === '🥳') {
            // Звезды для радости и восторга
            this.drawStar(this.x, this.y, this.size, this.size * 2, 5);
          } else if (emoji === '😢' || emoji === '😰') {
            // Капли для грусти и тревоги
            this.drawDrop(this.x, this.y, this.size);
          } else if (emoji === '😤') {
            // Треугольники для злости
            this.drawTriangle(this.x, this.y, this.size);
          } else {
            // Круги для остальных
            p.ellipse(this.x, this.y, this.size);
          }
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
      }

      p.setup = () => {
        const canvas = p.createCanvas(containerRef.current!.offsetWidth, 300);
        canvas.parent(containerRef.current!);
        
        // Создаем частицы
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }
        
        p.background(colors.background);
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
          p.resizeCanvas(containerRef.current.offsetWidth, 300);
        }
      };
    };

    sketchRef.current = new p5(sketch);

    // Очистка при размонтировании
    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove();
      }
    };
  }, [emoji]);

  return <div ref={containerRef} className={`w-full h-[300px] rounded-lg overflow-hidden ${className}`} />;
}
