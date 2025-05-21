'use client';

import { FeedbackForm } from '@/components/feedback/feedback-form';

export default function FeedbackPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Ваше мнение важно для нас
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Помогите нам сделать дневник настроения лучше, поделившись своими впечатлениями и предложениями
        </p>
      </div>
      
      <div className="mx-auto max-w-md">
        <FeedbackForm />
      </div>
    </div>
  );
}
