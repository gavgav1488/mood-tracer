'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSupabase } from '@/hooks/use-supabase';
import { useAuth } from '@/context/auth-context';

export function FeedbackForm() {
  const { user } = useAuth();
  const { createFeedback } = useSupabase();
  const [rating, setRating] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Пожалуйста, выберите оценку');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await createFeedback({
        user_id: user?.id,
        email: email,
        rating: parseInt(rating),
        comment: comment,
      });
      
      setIsSuccess(true);
      setRating('');
      setComment('');
      
      // Сбрасываем состояние успеха через 5 секунд
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Ошибка при отправке обратной связи:', err);
      setError('Произошла ошибка при отправке обратной связи. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Обратная связь</CardTitle>
        <CardDescription>
          Помогите нам улучшить дневник настроения, поделившись своим мнением
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Как бы вы оценили наше приложение?</Label>
            <RadioGroup
              value={rating}
              onValueChange={setRating}
              className="flex space-x-2"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex flex-col items-center">
                  <RadioGroupItem
                    value={value.toString()}
                    id={`rating-${value}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`rating-${value}`}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 ${
                      rating === value.toString()
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/20 hover:border-primary/50'
                    }`}
                  >
                    {value}
                  </Label>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {value === 1
                      ? 'Плохо'
                      : value === 5
                      ? 'Отлично'
                      : ''}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Ваши комментарии и предложения</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Расскажите, что вам понравилось или что можно улучшить..."
              className="min-h-[100px]"
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="email">Ваш email (необязательно)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
              <p className="text-xs text-muted-foreground">
                Мы используем ваш email только для связи по поводу вашего отзыва
              </p>
            </div>
          )}

          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}

          {isSuccess && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-3">
              <div className="flex">
                <div className="text-sm font-medium text-green-800 dark:text-green-400">
                  Спасибо за ваш отзыв! Мы ценим ваше мнение.
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
