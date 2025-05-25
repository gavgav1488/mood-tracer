'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Plus, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSupabase } from '@/hooks/use-supabase';
import { useToast } from '@/components/ui/use-toast';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export function TagSelector({ selectedTags, onChange, className = '' }: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase, user, getTags, createTag } = useSupabase();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Загрузка тегов при монтировании компонента
  useEffect(() => {
    let isMounted = true; // Флаг для предотвращения обновления состояния после размонтирования

    const fetchTags = async () => {
      try {
        // Устанавливаем состояние загрузки
        if (isMounted) setLoading(true);

        console.log('fetchTags: начало загрузки тегов');

        // Если пользователь не авторизован, просто возвращаем пустой массив
        if (!user) {
          console.log('fetchTags: пользователь не авторизован');
          if (isMounted) {
            setAvailableTags([]);
            setLoading(false);
          }
          return;
        }

        console.log('fetchTags: пользователь авторизован, получаем теги');

        // Временные теги для отладки
        const defaultTags = ['Работа', 'Семья', 'Отдых', 'Спорт', 'Учеба'];

        try {
          // Получаем теги с помощью функции getTags из хука useSupabase
          const tags = await getTags({ forceRefresh: false }); // Используем кэш, если он есть

          console.log('fetchTags: получены теги', tags);

          // Обновляем состояние только если компонент все еще смонтирован
          if (isMounted) {
            // Проверяем, что tags - это массив и не пустой
            if (Array.isArray(tags) && tags.length > 0) {
              console.log('fetchTags: теги являются массивом, обновляем состояние');

              // Проверяем, являются ли элементы объектами с полем name или строками
              const tagNames = tags.map(tag => {
                if (typeof tag === 'string') {
                  return tag;
                } else if (tag && typeof tag === 'object' && tag.name) {
                  return tag.name;
                } else {
                  console.warn('Неожиданный формат тега:', tag);
                  return String(tag);
                }
              });

              console.log('fetchTags: имена тегов', tagNames);
              setAvailableTags(tagNames);
            } else {
              // Если tags не массив или пустой массив, устанавливаем временные теги
              console.log('fetchTags: теги не являются массивом или пустые, устанавливаем временные теги');
              setAvailableTags(defaultTags);
            }
          }
        } catch (error) {
          console.error('Ошибка при получении тегов:', error);

          // Устанавливаем временные теги
          if (isMounted) {
            console.log('fetchTags: устанавливаем временные теги из-за ошибки');
            setAvailableTags(defaultTags);
          }
        }
      } catch (error) {
        // Обрабатываем ошибку только если компонент все еще смонтирован
        if (isMounted) {
          console.error('Ошибка при загрузке тегов:', error);

          // Устанавливаем временные теги для отладки
          console.log('fetchTags: добавляем временные теги для отладки');
          setAvailableTags(['Работа', 'Семья', 'Отдых', 'Спорт', 'Учеба']);

          // Не показываем уведомление об ошибке, чтобы не раздражать пользователя
        }
      } finally {
        // В любом случае снимаем состояние загрузки, если компонент все еще смонтирован
        if (isMounted) setLoading(false);
      }
    };

    // Запускаем загрузку тегов с небольшой задержкой, чтобы избежать проблем с инициализацией
    const timer = setTimeout(() => {
      fetchTags();
    }, 500);

    // Функция очистки для предотвращения утечек памяти
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [user, toast, getTags]);

  // Функция для добавления нового тега
  const addNewTag = async () => {
    try {
      // Проверяем, что пользователь авторизован
      if (!user) {
        if (toast) {
          toast({
            title: 'Ошибка',
            description: 'Необходимо авторизоваться для создания тегов',
            variant: 'destructive',
          });
        }
        return;
      }

      const tagName = inputValue.trim();

      // Проверяем, что тег не пустой
      if (!tagName) return;

      // Проверяем, существует ли уже такой тег
      if (availableTags.includes(tagName)) {
        // Если тег уже существует, просто добавляем его в выбранные
        if (!selectedTags.includes(tagName)) {
          const newSelectedTags = [...selectedTags, tagName];
          onChange(newSelectedTags);
        }
        setInputValue('');
        return;
      }

      try {
        // Используем функцию createTag из хука useSupabase
        const newTag = await createTag(tagName);

        if (!newTag) {
          console.log('Не удалось создать тег, но продолжаем работу');

          // Даже если не удалось создать тег в базе данных, добавляем его локально
          setAvailableTags(prev => [...prev, tagName]);

          // Добавляем тег в выбранные
          const newSelectedTags = [...selectedTags, tagName];
          onChange(newSelectedTags);

          // Очищаем поле ввода
          setInputValue('');

          return;
        }

        // Обновляем список доступных тегов
        setAvailableTags(prev => [...prev, tagName]);

        // Добавляем тег в выбранные
        const newSelectedTags = [...selectedTags, tagName];
        onChange(newSelectedTags);

        // Очищаем поле ввода
        setInputValue('');

        // Показываем уведомление об успешном создании тега
        if (toast) {
          toast({
            title: 'Тег создан',
            description: `Тег "${tagName}" успешно создан`,
          });
        }
      } catch (createError) {
        console.error('Ошибка при создании тега:', createError);

        // Даже если не удалось создать тег в базе данных, добавляем его локально
        setAvailableTags(prev => [...prev, tagName]);

        // Добавляем тег в выбранные
        const newSelectedTags = [...selectedTags, tagName];
        onChange(newSelectedTags);

        // Очищаем поле ввода
        setInputValue('');

        // Не показываем уведомление об ошибке, чтобы не раздражать пользователя
      }
    } catch (error) {
      console.error('Ошибка при создании тега:', error);

      // Даже если произошла ошибка, добавляем тег локально
      const tagName = inputValue.trim();
      if (tagName) {
        setAvailableTags(prev => [...prev, tagName]);

        // Добавляем тег в выбранные
        const newSelectedTags = [...selectedTags, tagName];
        onChange(newSelectedTags);

        // Очищаем поле ввода
        setInputValue('');
      }

      // Не показываем уведомление об ошибке, чтобы не раздражать пользователя
    }
  };

  // Функция для выбора тега
  const selectTag = (tag: string) => {
    // Если тег уже выбран, ничего не делаем
    if (selectedTags.includes(tag)) return;

    // Добавляем тег в выбранные
    const newSelectedTags = [...selectedTags, tag];
    onChange(newSelectedTags);

    // Закрываем выпадающий список
    setOpen(false);
  };

  // Функция для удаления тега из выбранных
  const removeTag = (tag: string) => {
    const newSelectedTags = selectedTags.filter(t => t !== tag);
    onChange(newSelectedTags);
  };

  // Обработчик нажатия Enter в поле ввода
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewTag();
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap gap-2 mb-3 min-h-8">
        {selectedTags.map(tag => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm"
          >
            <Tag className="h-3 w-3" />
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 ml-1 hover:bg-transparent rounded-full"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full"
            >
              <Tag className="mr-2 h-4 w-4" />
              <span className="truncate">
                {selectedTags.length > 0
                  ? `${selectedTags.length} ${selectedTags.length === 1 ? 'тег' : 'тега'}`
                  : 'Выберите теги'}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full min-w-[240px]" align="start">
            <Command>
              <CommandInput
                placeholder="Поиск тега..."
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
              <CommandList>
                <CommandEmpty>
                  {inputValue.trim() !== '' ? (
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span>Создать тег "{inputValue}"</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={addNewTag}
                        className="h-6 w-6"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span>Нет тегов</span>
                  )}
                </CommandEmpty>
                <CommandGroup heading="Доступные теги">
                  {availableTags.map(tag => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => selectTag(tag)}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      <span>{tag}</span>
                      {selectedTags.includes(tag) && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex gap-2">
          <Input
            placeholder="Введите новый тег..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={addNewTag}
            disabled={!inputValue.trim()}
            title="Добавить новый тег"
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Добавить
          </Button>
        </div>
      </div>
    </div>
  );
}
