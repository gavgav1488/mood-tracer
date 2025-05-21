import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodEntryForm } from './mood-entry-form';
import { useSupabase } from '@/hooks/use-supabase';
import { useAuth } from '@/context/auth-context';

// Мокаем хуки
jest.mock('@/hooks/use-supabase', () => ({
  useSupabase: jest.fn(),
}));

jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

// Мокаем компоненты
jest.mock('./emoji-picker', () => ({
  EmojiPicker: ({ selectedEmoji, onSelect }: { selectedEmoji: string; onSelect: (emoji: string) => void }) => (
    <div data-testid="emoji-picker">
      <span>{selectedEmoji}</span>
      <button onClick={() => onSelect('😊')}>Выбрать эмодзи</button>
    </div>
  ),
}));

jest.mock('./note-editor', () => ({
  NoteEditor: ({ initialValue, onChange }: { initialValue: string; onChange: (note: string) => void }) => (
    <div data-testid="note-editor">
      <textarea
        value={initialValue}
        onChange={(e) => onChange(e.target.value)}
        data-testid="note-textarea"
      />
    </div>
  ),
}));

jest.mock('./mood-visualization', () => ({
  MoodVisualization: ({ emoji }: { emoji: string }) => (
    <div data-testid="mood-visualization">
      <span>{emoji}</span>
    </div>
  ),
}));

describe('MoodEntryForm', () => {
  const mockCreateMoodEntry = jest.fn();
  const mockClearCache = jest.fn();
  const mockOnEntryCreated = jest.fn();

  beforeEach(() => {
    // Настраиваем моки для хуков
    (useSupabase as jest.Mock).mockReturnValue({
      createMoodEntry: mockCreateMoodEntry,
      clearCache: mockClearCache,
    });

    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'test-user-id' },
    });

    // Сбрасываем состояние моков перед каждым тестом
    mockCreateMoodEntry.mockReset();
    mockClearCache.mockReset();
    mockOnEntryCreated.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<MoodEntryForm />);

    // Проверяем, что заголовок отображается
    expect(screen.getByText('Как вы себя чувствуете сегодня?')).toBeInTheDocument();

    // Проверяем, что компоненты отображаются
    expect(screen.getByTestId('emoji-picker')).toBeInTheDocument();
    expect(screen.getByTestId('mood-visualization')).toBeInTheDocument();
    expect(screen.getByTestId('note-editor')).toBeInTheDocument();

    // Проверяем, что кнопка сохранения отображается и отключена (так как поле заметки пустое)
    const saveButton = screen.getByText('Сохранить запись');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('enables save button when note is not empty', () => {
    render(<MoodEntryForm />);

    // Находим текстовое поле и вводим текст
    const noteTextarea = screen.getByTestId('note-textarea');
    fireEvent.change(noteTextarea, { target: { value: 'Тестовая заметка' } });

    // Проверяем, что кнопка сохранения активна
    const saveButton = screen.getByText('Сохранить запись');
    expect(saveButton).not.toBeDisabled();
  });
});
