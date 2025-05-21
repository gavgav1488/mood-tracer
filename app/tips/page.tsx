'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, Brain, Smile, Frown, Zap, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

// Типы эмоций и советы по управлению ими
const emotionTips = [
  {
    id: 'joy',
    emoji: '😊',
    name: 'Радость',
    description: 'Радость - это положительная эмоция, связанная с чувством удовлетворения, счастья и благополучия.',
    tips: [
      'Ведите дневник благодарности, записывая каждый день 3 вещи, за которые вы благодарны',
      'Делитесь своей радостью с близкими людьми, это усиливает положительные эмоции',
      'Создавайте "банк радости" - коллекцию фотографий, записок или предметов, напоминающих о счастливых моментах',
      'Практикуйте осознанность, чтобы полностью присутствовать в радостных моментах',
      'Занимайтесь деятельностью, которая приносит вам удовольствие, регулярно'
    ],
    practices: [
      {
        title: 'Медитация благодарности',
        description: 'Сядьте в удобное положение, закройте глаза и сосредоточьтесь на дыхании. Вспомните 3-5 вещей, за которые вы благодарны сегодня. Представьте, как чувство благодарности наполняет ваше тело теплом и светом.',
        duration: '5-10 минут'
      },
      {
        title: 'Визуализация радости',
        description: 'Закройте глаза и вспомните самый счастливый момент в вашей жизни. Постарайтесь воссоздать все детали: что вы видели, слышали, чувствовали. Позвольте этим ощущениям наполнить вас.',
        duration: '3-5 минут'
      }
    ],
    icon: <Smile className="h-6 w-6" />
  },
  {
    id: 'sadness',
    emoji: '😢',
    name: 'Грусть',
    description: 'Грусть - это естественная эмоция, которая помогает нам обрабатывать потери и разочарования.',
    tips: [
      'Позвольте себе почувствовать грусть, не подавляйте эту эмоцию',
      'Выражайте свои чувства через творчество: рисование, письмо, музыку',
      'Обратитесь за поддержкой к близким людям или специалисту',
      'Заботьтесь о своем физическом состоянии: высыпайтесь, правильно питайтесь, двигайтесь',
      'Практикуйте самосострадание и не корите себя за негативные эмоции'
    ],
    practices: [
      {
        title: 'Техника "Письмо себе"',
        description: 'Напишите письмо самому себе от лица мудрого, понимающего друга. Что бы этот друг сказал вам о вашей ситуации? Какие слова поддержки он бы предложил?',
        duration: '10-15 минут'
      },
      {
        title: 'Дыхательная практика для успокоения',
        description: 'Сделайте глубокий вдох на 4 счета, задержите дыхание на 2 счета, выдохните на 6 счетов. Повторите 10 раз, концентрируясь на ощущениях в теле.',
        duration: '5 минут'
      }
    ],
    icon: <Frown className="h-6 w-6" />
  },
  {
    id: 'anger',
    emoji: '😤',
    name: 'Злость',
    description: 'Злость - это сильная эмоция, которая сигнализирует о том, что наши границы нарушены или потребности не удовлетворены.',
    tips: [
      'Распознавайте ранние признаки злости в своем теле (напряжение, учащенное сердцебиение)',
      'Используйте техники глубокого дыхания для снижения физического напряжения',
      'Временно отстранитесь от ситуации, чтобы успокоиться, прежде чем реагировать',
      'Выражайте свои чувства и потребности конструктивно, используя "Я-сообщения"',
      'Регулярно занимайтесь физической активностью для снятия накопленного напряжения'
    ],
    practices: [
      {
        title: 'Техника "Стоп"',
        description: 'Когда чувствуете нарастающую злость, мысленно скажите себе "СТОП". Сделайте глубокий вдох и выдох. Спросите себя: "Что я сейчас чувствую? Что мне нужно? Как я могу конструктивно выразить свои потребности?"',
        duration: '1-2 минуты'
      },
      {
        title: 'Физическая разрядка',
        description: 'Найдите безопасный способ выпустить физическое напряжение: быстрая ходьба, бег на месте, отжимания, или даже просто сжимание и разжимание кулаков в течение 30 секунд.',
        duration: '5-10 минут'
      }
    ],
    icon: <Zap className="h-6 w-6" />
  },
  {
    id: 'anxiety',
    emoji: '😰',
    name: 'Тревога',
    description: 'Тревога - это эмоция, связанная с беспокойством о будущем и ощущением опасности.',
    tips: [
      'Практикуйте осознанность, чтобы вернуться в настоящий момент',
      'Используйте техники глубокого дыхания для активации парасимпатической нервной системы',
      'Разделяйте то, что вы можете контролировать, и то, что вне вашего контроля',
      'Ограничьте потребление новостей и социальных сетей, если они усиливают тревогу',
      'Регулярно занимайтесь физическими упражнениями для снижения уровня стресса'
    ],
    practices: [
      {
        title: 'Техника 5-4-3-2-1',
        description: 'Назовите 5 вещей, которые вы видите, 4 вещи, которые вы можете потрогать, 3 вещи, которые вы слышите, 2 вещи, которые вы чувствуете запахом, и 1 вещь, которую вы чувствуете на вкус. Это помогает вернуться в настоящий момент.',
        duration: '3-5 минут'
      },
      {
        title: 'Прогрессивная мышечная релаксация',
        description: 'Последовательно напрягайте и расслабляйте группы мышц, начиная с ног и двигаясь вверх к голове. Задерживайте напряжение на 5 секунд, затем расслабляйтесь на 10 секунд.',
        duration: '10-15 минут'
      }
    ],
    icon: <Brain className="h-6 w-6" />
  },
  {
    id: 'general',
    emoji: '🧠',
    name: 'Общие практики',
    description: 'Эти практики помогают улучшить эмоциональное благополучие в целом, независимо от конкретных эмоций.',
    tips: [
      'Регулярно практикуйте медитацию осознанности для улучшения эмоциональной регуляции',
      'Ведите дневник эмоций, отслеживая свои чувства и триггеры',
      'Обеспечьте себе достаточный сон, здоровое питание и физическую активность',
      'Развивайте навыки эмоционального интеллекта через чтение и обучение',
      'Поддерживайте здоровые социальные связи и не стесняйтесь просить о поддержке'
    ],
    practices: [
      {
        title: 'Утренняя практика осознанности',
        description: 'Начните день с 5-минутной медитации. Сядьте в удобное положение, закройте глаза и сосредоточьтесь на своем дыхании. Когда ум блуждает, мягко возвращайте внимание к дыханию.',
        duration: '5 минут'
      },
      {
        title: 'Вечерняя рефлексия',
        description: 'Перед сном уделите время размышлениям о прошедшем дне. Запишите 3 положительных момента, 1 вызов, с которым вы столкнулись, и как вы с ним справились, и 1 вещь, которую вы узнали.',
        duration: '5-10 минут'
      }
    ],
    icon: <Heart className="h-6 w-6" />
  }
];

export default function TipsPage() {
  const [activeTab, setActiveTab] = useState('joy');
  const router = useRouter();
  const { user, loading } = useAuth();

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">Управление эмоциями</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Советы и практики
            </CardTitle>
            <CardDescription>
              Изучите практические советы и упражнения для управления различными эмоциями
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full">
                {emotionTips.map((emotion) => (
                  <TabsTrigger key={emotion.id} value={emotion.id} className="flex items-center gap-2">
                    <span className="hidden sm:inline">{emotion.icon}</span>
                    <span className="sm:hidden text-lg">{emotion.emoji}</span>
                    <span className="hidden sm:inline">{emotion.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {emotionTips.map((emotion) => (
                <TabsContent key={emotion.id} value={emotion.id} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                      <span className="text-2xl">{emotion.emoji}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{emotion.name}</h2>
                      <p className="text-sm text-muted-foreground">{emotion.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          Советы
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {emotion.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Практики
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {emotion.practices.map((practice, index) => (
                          <div key={index} className="space-y-2 pb-3 border-b last:border-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">{practice.title}</h3>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {practice.duration}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{practice.description}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
            <p>
              Эти советы и практики предназначены для общего информирования и не заменяют профессиональную помощь. 
              Если вы испытываете сильные или продолжительные негативные эмоции, рекомендуем обратиться к специалисту.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
