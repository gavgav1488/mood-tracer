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
  const { supabase, user } = useSupabase();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Загрузка тегов при монтировании компонента
  useEffect(() => {
    const fetchTags = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('name')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          setAvailableTags(data.map(tag => tag.name));
        }
      } catch (error) {
        console.error('Ошибка при загрузке тегов:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить теги',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [supabase, user, toast]);

  // Функция для добавления нового тега
  const addNewTag = async () => {
    if (!user) return;
    
    const tagName = inputValue.trim();
    
    // Проверяем, что тег не пустой и не существует уже
    if (!tagName) return;
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
      // Добавляем тег в базу данных
      const { error } = await supabase
        .from('tags')
        .insert([{ name: tagName, user_id: user.id }]);
      
      if (error) throw error;
      
      // Обновляем список доступных тегов
      setAvailableTags(prev => [...prev, tagName]);
      
      // Добавляем тег в выбранные
      const newSelectedTags = [...selectedTags, tagName];
      onChange(newSelectedTags);
      
      // Очищаем поле ввода
      setInputValue('');
      
      toast({
        title: 'Тег создан',
        description: `Тег "${tagName}" успешно создан`,
      });
    } catch (error) {
      console.error('Ошибка при создании тега:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать тег',
        variant: 'destructive',
      });
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
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
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
          <PopoverContent className="p-0" align="start">
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
        
        <Button
          variant="outline"
          size="icon"
          onClick={addNewTag}
          disabled={!inputValue.trim()}
          title="Добавить новый тег"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
