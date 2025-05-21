import { renderHook, act } from '@testing-library/react';
import { useSupabase } from './use-supabase';
import { createBrowserClient } from '@supabase/ssr';

// Мокаем модуль @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}));

describe('useSupabase', () => {
  // Моки для методов Supabase
  const mockSelect = jest.fn();
  const mockFrom = jest.fn();
  const mockOrder = jest.fn();
  const mockEq = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockSingle = jest.fn();
  
  beforeEach(() => {
    // Сбрасываем состояние моков перед каждым тестом
    jest.clearAllMocks();
    
    // Настраиваем цепочку моков для имитации методов Supabase
    mockSelect.mockReturnThis();
    mockFrom.mockReturnThis();
    mockOrder.mockReturnThis();
    mockEq.mockReturnThis();
    mockInsert.mockReturnThis();
    mockUpdate.mockReturnThis();
    mockDelete.mockReturnThis();
    mockSingle.mockReturnThis();
    
    // Настраиваем мок для createBrowserClient
    (createBrowserClient as jest.Mock).mockReturnValue({
      from: mockFrom,
    });
    
    // Настраиваем цепочку вызовов
    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    });
    
    mockSelect.mockReturnValue({
      order: mockOrder,
      eq: mockEq,
      single: mockSingle,
    });
    
    mockOrder.mockReturnValue({
      eq: mockEq,
    });
    
    mockEq.mockReturnValue({
      single: mockSingle,
    });
    
    mockInsert.mockReturnValue({
      select: mockSelect,
    });
    
    mockUpdate.mockReturnValue({
      eq: mockEq,
    });
  });
  
  it('should return all the expected methods', () => {
    const { result } = renderHook(() => useSupabase());
    
    expect(result.current).toHaveProperty('getMoodEntries');
    expect(result.current).toHaveProperty('getMoodEntry');
    expect(result.current).toHaveProperty('createMoodEntry');
    expect(result.current).toHaveProperty('updateMoodEntry');
    expect(result.current).toHaveProperty('deleteMoodEntry');
    expect(result.current).toHaveProperty('clearCache');
  });
  
  it('should call Supabase client with correct parameters when getMoodEntries is called', async () => {
    // Настраиваем мок для возврата данных
    mockOrder.mockReturnValue({
      data: [{ id: '1', emoji: '😊', note: 'Test note' }],
      error: null,
    });
    
    const { result } = renderHook(() => useSupabase());
    
    // Вызываем метод getMoodEntries
    let entries;
    await act(async () => {
      entries = await result.current.getMoodEntries();
    });
    
    // Проверяем, что методы Supabase были вызваны с правильными параметрами
    expect(mockFrom).toHaveBeenCalledWith('mood_entries');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('date', { ascending: false });
    
    // Проверяем, что метод вернул правильные данные
    expect(entries).toEqual([{ id: '1', emoji: '😊', note: 'Test note' }]);
  });
  
  it('should use cache when getMoodEntries is called twice without forceRefresh', async () => {
    // Настраиваем мок для возврата данных
    mockOrder.mockReturnValue({
      data: [{ id: '1', emoji: '😊', note: 'Test note' }],
      error: null,
    });
    
    const { result } = renderHook(() => useSupabase());
    
    // Вызываем метод getMoodEntries дважды
    await act(async () => {
      await result.current.getMoodEntries();
      await result.current.getMoodEntries();
    });
    
    // Проверяем, что метод from был вызван только один раз (второй раз данные берутся из кэша)
    expect(mockFrom).toHaveBeenCalledTimes(1);
  });
  
  it('should not use cache when getMoodEntries is called with forceRefresh=true', async () => {
    // Настраиваем мок для возврата данных
    mockOrder.mockReturnValue({
      data: [{ id: '1', emoji: '😊', note: 'Test note' }],
      error: null,
    });
    
    const { result } = renderHook(() => useSupabase());
    
    // Вызываем метод getMoodEntries дважды, второй раз с forceRefresh=true
    await act(async () => {
      await result.current.getMoodEntries();
      await result.current.getMoodEntries({ forceRefresh: true });
    });
    
    // Проверяем, что метод from был вызван дважды
    expect(mockFrom).toHaveBeenCalledTimes(2);
  });
  
  it('should clear cache when clearCache is called', async () => {
    // Настраиваем мок для возврата данных
    mockOrder.mockReturnValue({
      data: [{ id: '1', emoji: '😊', note: 'Test note' }],
      error: null,
    });
    
    const { result } = renderHook(() => useSupabase());
    
    // Вызываем метод getMoodEntries, затем clearCache, затем снова getMoodEntries
    await act(async () => {
      await result.current.getMoodEntries();
      result.current.clearCache();
      await result.current.getMoodEntries();
    });
    
    // Проверяем, что метод from был вызван дважды (кэш был очищен)
    expect(mockFrom).toHaveBeenCalledTimes(2);
  });
});
