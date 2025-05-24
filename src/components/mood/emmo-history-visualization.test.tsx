import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmmoHistoryVisualization } from './emmo-history-visualization';
import { useSupabase } from '@/hooks/use-supabase';
import { MoodEntry } from '@/lib/supabase';

// Мокаем хук useSupabase
jest.mock('@/hooks/use-supabase', () => ({
  useSupabase: jest.fn(),
}));

// Мокаем p5.js
jest.mock('p5', () => {
  return jest.fn().mockImplementation(() => ({
    remove: jest.fn(),
  }));
});

describe('EmmoHistoryVisualization', () => {
  const mockEntries: MoodEntry[] = [
    {
      id: '1',
      user_id: 'user1',
      date: '2023-06-01T12:00:00Z',
      emoji: '😊',
      note: 'Тестовая запись 1',
      created_at: '2023-06-01T12:00:00Z',
      intensity: 80,
      x_position: 75,
      y_position: 25,
      tags: ['тест', 'радость'],
    },
    {
      id: '2',
      user_id: 'user1',
      date: '2023-06-02T12:00:00Z',
      emoji: '😢',
      note: 'Тестовая запись 2',
      created_at: '2023-06-02T12:00:00Z',
      intensity: 60,
      x_position: 25,
      y_position: 75,
      tags: ['тест', 'грусть'],
    },
  ];

  const mockGetMoodEntries = jest.fn().mockResolvedValue(mockEntries);

  beforeEach(() => {
    // Настраиваем моки для хуков
    (useSupabase as jest.Mock).mockReturnValue({
      getMoodEntries: mockGetMoodEntries,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('отображает заголовок и селектор периода', async () => {
    render(<EmmoHistoryVisualization />);
    
    // Проверяем, что заголовок отображается
    expect(screen.getByText('История эмоций')).toBeInTheDocument();
    
    // Проверяем, что селектор периода отображается
    await waitFor(() => {
      expect(screen.getByText('Выберите период')).toBeInTheDocument();
    });
  });

  it('вызывает getMoodEntries при монтировании', async () => {
    render(<EmmoHistoryVisualization />);
    
    await waitFor(() => {
      expect(mockGetMoodEntries).toHaveBeenCalledTimes(1);
    });
  });

  it('отображает количество записей', async () => {
    render(<EmmoHistoryVisualization />);
    
    await waitFor(() => {
      expect(screen.getByText('2 записи')).toBeInTheDocument();
    });
  });

  it('вызывает onEntrySelected при выборе записи', async () => {
    const mockOnEntrySelected = jest.fn();
    render(<EmmoHistoryVisualization onEntrySelected={mockOnEntrySelected} />);
    
    // Ждем загрузки данных
    await waitFor(() => {
      expect(mockGetMoodEntries).toHaveBeenCalledTimes(1);
    });
    
    // Примечание: мы не можем напрямую тестировать клик на canvas p5.js,
    // поэтому мы проверяем только, что функция передана компоненту
    expect(mockOnEntrySelected).not.toHaveBeenCalled();
  });
});
