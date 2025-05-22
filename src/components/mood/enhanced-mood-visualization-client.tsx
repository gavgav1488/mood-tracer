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
}

export function EnhancedMoodVisualizationClient({
  emoji,
  className,
  interactive
}: EnhancedMoodVisualizationClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Возвращаем заглушку, пока компонент не загрузится на клиенте
    return (
      <div className={`${className || ''} flex items-center justify-center h-[300px] bg-card rounded-lg border`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <EnhancedMoodVisualization
      emoji={emoji}
      className={className}
      interactive={interactive}
    />
  );
}
