'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoodEntry } from '@/lib/supabase';
import { Share2, Copy, Check, Twitter, Facebook, Mail, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ShareEntryProps {
  entry: MoodEntry;
  className?: string;
}

export function ShareEntry({ entry, className = '' }: ShareEntryProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link');
  const { toast } = useToast();

  // Функция для получения эмодзи в виде текста
  const getEmojiName = (emoji: string) => {
    const emojiMap: Record<string, string> = {
      '😊': 'Радость',
      '😐': 'Нейтрально',
      '😢': 'Грусть',
      '🥳': 'Восторг',
      '😤': 'Злость',
      '😴': 'Усталость',
      '😰': 'Тревога',
    };
    return emojiMap[emoji] || emoji;
  };

  // Форматирование даты
  const formattedDate = format(new Date(entry.date), 'd MMMM yyyy', { locale: ru });

  // Создание текста для шаринга
  const shareText = `${entry.emoji} ${getEmojiName(entry.emoji)} - ${formattedDate}\n\n${entry.note || 'Без заметки'}\n\nОтправлено из приложения "Дневник настроения"`;

  // Создание ссылки для шаринга
  const shareUrl = `${window.location.origin}/shared?id=${entry.id}`;

  // Функция для копирования текста в буфер обмена
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({
        title: 'Скопировано!',
        description: 'Текст скопирован в буфер обмена',
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Функция для шаринга в Twitter
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  // Функция для шаринга в Facebook
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };

  // Функция для шаринга по email
  const shareByEmail = () => {
    const emailUrl = `mailto:?subject=Запись из Дневника настроения&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
    window.open(emailUrl, '_blank');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 rounded-full ${className}`}
          title="Поделиться записью"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Поделиться записью</DialogTitle>
          <DialogDescription>
            Поделитесь своей записью с друзьями или сохраните для себя
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
            <span className="text-xl">{entry.emoji}</span>
          </div>
          <div>
            <div className="font-medium">{getEmojiName(entry.emoji)}</div>
            <div className="text-xs text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Ссылка</TabsTrigger>
            <TabsTrigger value="social">Соцсети</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => copyToClipboard(shareUrl)}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Текст записи</div>
              <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                {shareText}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(shareText)}
                className="w-full mt-2"
              >
                <Copy className="mr-2 h-4 w-4" />
                Копировать текст
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={shareToTwitter} variant="outline" className="flex flex-col items-center py-6">
                <Twitter className="h-6 w-6 mb-2" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button onClick={shareToFacebook} variant="outline" className="flex flex-col items-center py-6">
                <Facebook className="h-6 w-6 mb-2" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button onClick={shareByEmail} variant="outline" className="flex flex-col items-center py-6">
                <Mail className="h-6 w-6 mb-2" />
                <span className="text-xs">Email</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Закрыть
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
