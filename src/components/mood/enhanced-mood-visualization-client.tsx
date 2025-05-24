'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Динамический импорт компонента EnhancedMoodVisualization без SSR
const EnhancedMoodVisualization = dynamic(
  () => import('./enhanced-mood-visualization').then(mod => mod.EnhancedMoodVisualization),
  { ssr: false }
);

interface EnhancedMoodVisualizationClientProps {
  emoji: string;
  className?: string;
  interactive?: boolean;
  visualType?: 'default' | 'sakura';
}

export function EnhancedMoodVisualizationClient({
  emoji,
  className,
  interactive,
  visualType = 'default'
}: EnhancedMoodVisualizationClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Возвращаем заглушку, пока компонент не загрузится на клиенте
    const bgGradient = visualType === 'sakura'
      ? "from-pink-100/50 to-rose-100/50"
      : "from-yellow-100/50 to-amber-100/50";

    return (
      <div className={`${className || ''} flex items-center justify-center h-[300px] bg-card rounded-lg border relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="text-4xl mb-2">{emoji}</div>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <EnhancedMoodVisualization
      emoji={emoji}
      className={className}
      interactive={interactive}
      visualType={visualType}
    />
  );
}
