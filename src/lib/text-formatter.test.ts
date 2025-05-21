import { applyFormat, formatTextToHtml } from './text-formatter';

describe('applyFormat', () => {
  it('добавляет маркеры полужирного текста', () => {
    const result = applyFormat('Привет, мир!', 0, 6, 'bold');
    expect(result.text).toBe('**Привет**, мир!');
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(10);
  });

  it('добавляет маркеры курсива', () => {
    const result = applyFormat('Привет, мир!', 8, 11, 'italic');
    expect(result.text).toBe('Привет, _мир_!');
    expect(result.selectionStart).toBe(8);
    expect(result.selectionEnd).toBe(13);
  });

  it('добавляет маркеры подчеркнутого текста', () => {
    const result = applyFormat('Привет, мир!', 0, 11, 'underline');
    expect(result.text).toBe('__Привет, мир__!');
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(15);
  });

  it('добавляет маркеры маркированного списка для одной строки', () => {
    const result = applyFormat('Элемент списка', 0, 14, 'ul');
    expect(result.text).toBe('- Элемент списка');
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(16);
  });

  it('добавляет маркеры маркированного списка для нескольких строк', () => {
    const result = applyFormat('Первый элемент\nВторой элемент', 0, 29, 'ul');
    expect(result.text).toBe('- Первый элемент\n- Второй элемент');
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(33);
  });

  it('добавляет маркеры нумерованного списка для одной строки', () => {
    const result = applyFormat('Элемент списка', 0, 14, 'ol');
    expect(result.text).toBe('1. Элемент списка');
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(17);
  });

  it('добавляет маркеры нумерованного списка для нескольких строк', () => {
    const result = applyFormat('Первый элемент\nВторой элемент', 0, 29, 'ol');
    expect(result.text).toBe('1. Первый элемент\n2. Второй элемент');
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(35);
  });

  it('добавляет маркеры цитаты для одной строки', () => {
    const result = applyFormat('Цитата', 0, 6, 'quote');
    expect(result.text).toBe('> Цитата');
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(8);
  });

  it('добавляет маркеры цитаты для нескольких строк', () => {
    const result = applyFormat('Первая строка\nВторая строка', 0, 25, 'quote');
    expect(result.text).toBe('> Первая строка\n> Вторая строка');
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(29);
  });

  it('вставляет пустые маркеры, если нет выделенного текста', () => {
    const result = applyFormat('Привет, мир!', 7, 7, 'bold');
    expect(result.text).toBe('Привет,**** мир!');
    expect(result.selectionStart).toBe(9);
    expect(result.selectionEnd).toBe(9);
  });
});

describe('formatTextToHtml', () => {
  it('преобразует полужирный текст в HTML', () => {
    const result = formatTextToHtml('Это **полужирный** текст');
    expect(result).toContain('<strong>полужирный</strong>');
  });

  it('преобразует курсив в HTML', () => {
    const result = formatTextToHtml('Это _курсив_ текст');
    expect(result).toContain('<em>курсив</em>');
  });

  it('преобразует подчеркнутый текст в HTML', () => {
    const result = formatTextToHtml('Это __подчеркнутый__ текст');
    expect(result).toContain('<u>подчеркнутый</u>');
  });

  it('преобразует маркированный список в HTML', () => {
    const result = formatTextToHtml('- Первый элемент\n- Второй элемент');
    expect(result).toContain('• Первый элемент<br>');
    expect(result).toContain('• Второй элемент<br>');
  });

  it('преобразует нумерованный список в HTML', () => {
    const result = formatTextToHtml('1. Первый элемент\n2. Второй элемент');
    expect(result).toContain('1. Первый элемент<br>');
    expect(result).toContain('2. Второй элемент<br>');
  });

  it('преобразует цитаты в HTML', () => {
    const result = formatTextToHtml('> Это цитата');
    expect(result).toContain('<blockquote>Это цитата</blockquote>');
  });

  it('преобразует переносы строк в HTML', () => {
    const result = formatTextToHtml('Первая строка\nВторая строка');
    expect(result).toContain('Первая строка<br>Вторая строка');
  });

  it('возвращает пустую строку для пустого ввода', () => {
    expect(formatTextToHtml('')).toBe('');
    expect(formatTextToHtml(null as any)).toBe('');
    expect(formatTextToHtml(undefined as any)).toBe('');
  });
});
