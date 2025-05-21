'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/context/auth-context';

export default function FeedbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    usability: 'good',
    design: 'good',
    features: 'good',
    comments: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Создаем клиент Supabase напрямую, без использования хука
      const supabaseClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Отправляем данные в таблицу feedback
      const { error } = await supabaseClient
        .from('feedback')
        .insert([
          {
            user_id: user?.id || null,
            usability: formData.usability,
            design: formData.design,
            features: formData.features,
            comments: formData.comments,
            email: formData.email || user?.email || null,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Спасибо за обратную связь!',
        description: 'Ваше мнение очень важно для нас.',
        duration: 5000,
      });

      // Перенаправляем на главную страницу
      router.push('/');
    } catch (error) {
      console.error('Ошибка при отправке обратной связи:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить обратную связь. Пожалуйста, попробуйте позже.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Обратная связь</CardTitle>
          <CardDescription>
            Помогите нам улучшить дневник настроения, поделившись своим мнением
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Удобство использования</h3>
                <RadioGroup
                  defaultValue="good"
                  value={formData.usability}
                  onValueChange={(value) => handleRadioChange('usability', value)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bad" id="usability-bad" />
                    <Label htmlFor="usability-bad">Плохо</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="usability-average" />
                    <Label htmlFor="usability-average">Средне</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="usability-good" />
                    <Label htmlFor="usability-good">Хорошо</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="usability-excellent" />
                    <Label htmlFor="usability-excellent">Отлично</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium">Дизайн</h3>
                <RadioGroup
                  defaultValue="good"
                  value={formData.design}
                  onValueChange={(value) => handleRadioChange('design', value)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bad" id="design-bad" />
                    <Label htmlFor="design-bad">Плохо</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="design-average" />
                    <Label htmlFor="design-average">Средне</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="design-good" />
                    <Label htmlFor="design-good">Хорошо</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="design-excellent" />
                    <Label htmlFor="design-excellent">Отлично</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium">Функциональность</h3>
                <RadioGroup
                  defaultValue="good"
                  value={formData.features}
                  onValueChange={(value) => handleRadioChange('features', value)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bad" id="features-bad" />
                    <Label htmlFor="features-bad">Плохо</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="features-average" />
                    <Label htmlFor="features-average">Средне</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="features-good" />
                    <Label htmlFor="features-good">Хорошо</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="features-excellent" />
                    <Label htmlFor="features-excellent">Отлично</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Комментарии и предложения</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  placeholder="Расскажите, что вам понравилось или не понравилось, и какие функции вы хотели бы видеть в будущем"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              {!user && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email (необязательно)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Оставьте email, если хотите получить ответ"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
