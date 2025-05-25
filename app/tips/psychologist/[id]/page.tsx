'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { psychologistTips, PsychologistTip } from '@/components/tips/psychologist-tips';

export default function PsychologistTipPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tip, setTip] = useState<PsychologistTip | null>(null);

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  useEffect(() => {
    if (params.id) {
      const foundTip = psychologistTips.find(t => t.id === params.id);
      if (foundTip) {
        setTip(foundTip);
      } else {
        // Если совет не найден, перенаправляем на страницу советов
        router.push('/tips');
      }
    }
  }, [params.id, router]);

  if (!tip) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">Загрузка...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">Совет психолога</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{tip.title}</CardTitle>
          <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{tip.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{tip.author}</span>
            </div>
            <div>
              <a
                href={tip.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{tip.source}</span>
              </a>
            </div>
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-4">
            {tip.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: tip.content }} />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => router.push('/tips')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к советам
          </Button>
          <Button variant="default" asChild>
            <a href={tip.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Перейти к источнику
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
