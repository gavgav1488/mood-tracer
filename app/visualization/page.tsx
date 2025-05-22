'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EnhancedMoodVisualizationClient } from '@/components/mood/enhanced-mood-visualization-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VisualizationPage() {
  const searchParams = useSearchParams();
  const [emoji, setEmoji] = useState<string>('😊');

  useEffect(() => {
    // Получаем эмодзи из URL-параметров
    const emojiParam = searchParams.get('emoji');
    if (emojiParam) {
      setEmoji(decodeURIComponent(emojiParam));
    }
  }, [searchParams]);

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 left-4 z-10">
        <Button asChild variant="outline">
          <Link href="/diary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться в дневник
          </Link>
        </Button>
      </div>

      <div className="h-screen w-full">
        <EnhancedMoodVisualizationClient
          emoji={emoji}
          className="h-full"
          interactive={true}
        />
      </div>
    </div>
  );
}
