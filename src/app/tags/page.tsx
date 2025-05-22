'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tag, Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TagsPage() {
  const { user, getTags, createTag, updateTag, deleteTag } = useSupabase();
  const { toast } = useToast();
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Загрузка тегов при монтировании компонента
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        if (!user) {
          setTags([]);
          setLoading(false);
          return;
        }

        const fetchedTags = await getTags();
        if (Array.isArray(fetchedTags)) {
          setTags(fetchedTags);
        } else {
          setTags([]);
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
  }, [user, getTags, toast]);

  // Функция для создания нового тега
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    // Проверяем, существует ли уже такой тег
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())) {
      toast({
        title: 'Ошибка',
        description: 'Тег с таким именем уже существует',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const newTag = await createTag(newTagName.trim());
      if (newTag) {
        setTags(prev => [...prev, newTag]);
        setNewTagName('');
        toast({
          title: 'Успех',
          description: `Тег "${newTag.name}" успешно создан`,
        });
      } else {
        throw new Error('Не удалось создать тег');
      }
    } catch (error) {
      console.error('Ошибка при создании тега:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать тег',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Функция для удаления тега
  const handleDeleteTag = async (id: string) => {
    setIsDeleting(id);
    try {
      const success = await deleteTag(id);
      if (success) {
        setTags(prev => prev.filter(tag => tag.id !== id));
        toast({
          title: 'Успех',
          description: 'Тег успешно удален',
        });
      } else {
        throw new Error('Не удалось удалить тег');
      }
    } catch (error) {
      console.error('Ошибка при удалении тега:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить тег',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Функция для начала редактирования тега
  const startEditing = (tag: { id: string; name: string }) => {
    setEditingTag(tag);
    setEditedName(tag.name);
  };

  // Функция для отмены редактирования
  const cancelEditing = () => {
    setEditingTag(null);
    setEditedName('');
  };

  // Функция для сохранения отредактированного тега
  const saveEditedTag = async () => {
    if (!editingTag || !editedName.trim()) return;

    // Проверяем, существует ли уже такой тег
    if (tags.some(tag =>
      tag.id !== editingTag.id &&
      tag.name.toLowerCase() === editedName.trim().toLowerCase()
    )) {
      toast({
        title: 'Ошибка',
        description: 'Тег с таким именем уже существует',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedTag = await updateTag(editingTag.id, editedName.trim());

      if (updatedTag) {
        setTags(prev => prev.map(tag =>
          tag.id === editingTag.id ? updatedTag : tag
        ));

        toast({
          title: 'Успех',
          description: `Тег успешно обновлен на "${updatedTag.name}"`,
        });
      } else {
        throw new Error('Не удалось обновить тег');
      }

      setEditingTag(null);
      setEditedName('');
    } catch (error) {
      console.error('Ошибка при обновлении тега:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить тег',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка доступа</AlertTitle>
          <AlertDescription>
            Для управления тегами необходимо авторизоваться
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Управление тегами</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Все теги</TabsTrigger>
          <TabsTrigger value="create">Создать тег</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Все теги</CardTitle>
              <CardDescription>Просмотр, редактирование и удаление тегов</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-8 w-32" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : tags.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">У вас пока нет тегов</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center justify-between border p-2 rounded-md">
                      {editingTag?.id === tag.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editedName}
                            onChange={e => setEditedName(e.target.value)}
                            className="flex-1"
                            placeholder="Введите новое имя тега"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={saveEditedTag}
                            disabled={isSaving}
                          >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelEditing}
                            disabled={isSaving}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag.name}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditing(tag)}
                              disabled={!!isDeleting}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTag(tag.id)}
                              disabled={isDeleting === tag.id}
                            >
                              {isDeleting === tag.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Создать новый тег</CardTitle>
              <CardDescription>Добавьте новый тег для организации записей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={newTagName}
                  onChange={e => setNewTagName(e.target.value)}
                  placeholder="Введите имя тега"
                  className="flex-1"
                />
                <Button
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Создать
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
