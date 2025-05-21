/**
 * Применяет форматирование к выделенному тексту
 * @param text Исходный текст
 * @param selectionStart Начало выделения
 * @param selectionEnd Конец выделения
 * @param format Тип форматирования
 * @returns Объект с новым текстом и новыми позициями выделения
 */
export function applyFormat(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  format: string
): { text: string; selectionStart: number; selectionEnd: number } {
  const selectedText = text.substring(selectionStart, selectionEnd);
  
  if (!selectedText && (format === 'bold' || format === 'italic' || format === 'underline')) {
    // Если нет выделенного текста, вставляем маркеры форматирования с курсором между ними
    let marker = '';
    switch (format) {
      case 'bold':
        marker = '**';
        break;
      case 'italic':
        marker = '_';
        break;
      case 'underline':
        marker = '__';
        break;
    }
    
    const newText = text.substring(0, selectionStart) + marker + marker + text.substring(selectionEnd);
    return {
      text: newText,
      selectionStart: selectionStart + marker.length,
      selectionEnd: selectionStart + marker.length
    };
  }
  
  let newText = '';
  let newSelectionStart = selectionStart;
  let newSelectionEnd = selectionEnd;
  
  switch (format) {
    case 'bold':
      newText = text.substring(0, selectionStart) + '**' + selectedText + '**' + text.substring(selectionEnd);
      newSelectionEnd = selectionEnd + 4; // Добавляем 4 символа (по 2 звездочки с каждой стороны)
      break;
    case 'italic':
      newText = text.substring(0, selectionStart) + '_' + selectedText + '_' + text.substring(selectionEnd);
      newSelectionEnd = selectionEnd + 2; // Добавляем 2 символа (по 1 подчеркиванию с каждой стороны)
      break;
    case 'underline':
      newText = text.substring(0, selectionStart) + '__' + selectedText + '__' + text.substring(selectionEnd);
      newSelectionEnd = selectionEnd + 4; // Добавляем 4 символа (по 2 подчеркивания с каждой стороны)
      break;
    case 'ul':
      // Добавляем маркированный список
      if (selectedText.includes('\n')) {
        // Если выделено несколько строк, добавляем маркер к каждой строке
        const lines = selectedText.split('\n');
        const formattedLines = lines.map(line => line.trim() ? `- ${line}` : line);
        newText = text.substring(0, selectionStart) + formattedLines.join('\n') + text.substring(selectionEnd);
        newSelectionEnd = selectionStart + formattedLines.join('\n').length;
      } else {
        // Если выделена одна строка
        newText = text.substring(0, selectionStart) + '- ' + selectedText + text.substring(selectionEnd);
        newSelectionEnd = selectionEnd + 2; // Добавляем 2 символа (маркер и пробел)
      }
      break;
    case 'ol':
      // Добавляем нумерованный список
      if (selectedText.includes('\n')) {
        // Если выделено несколько строк, добавляем номера к каждой строке
        const lines = selectedText.split('\n');
        const formattedLines = lines.map((line, index) => 
          line.trim() ? `${index + 1}. ${line}` : line
        );
        newText = text.substring(0, selectionStart) + formattedLines.join('\n') + text.substring(selectionEnd);
        newSelectionEnd = selectionStart + formattedLines.join('\n').length;
      } else {
        // Если выделена одна строка
        newText = text.substring(0, selectionStart) + '1. ' + selectedText + text.substring(selectionEnd);
        newSelectionEnd = selectionEnd + 3; // Добавляем 3 символа (цифра, точка и пробел)
      }
      break;
    case 'quote':
      // Добавляем цитату
      if (selectedText.includes('\n')) {
        // Если выделено несколько строк, добавляем символ цитаты к каждой строке
        const lines = selectedText.split('\n');
        const formattedLines = lines.map(line => line.trim() ? `> ${line}` : line);
        newText = text.substring(0, selectionStart) + formattedLines.join('\n') + text.substring(selectionEnd);
        newSelectionEnd = selectionStart + formattedLines.join('\n').length;
      } else {
        // Если выделена одна строка
        newText = text.substring(0, selectionStart) + '> ' + selectedText + text.substring(selectionEnd);
        newSelectionEnd = selectionEnd + 2; // Добавляем 2 символа (символ цитаты и пробел)
      }
      break;
    default:
      return { text, selectionStart, selectionEnd };
  }
  
  return { text: newText, selectionStart: newSelectionStart, selectionEnd: newSelectionEnd };
}

/**
 * Преобразует текст с маркерами форматирования в HTML
 * @param text Текст с маркерами форматирования
 * @returns HTML-строка с форматированием
 */
export function formatTextToHtml(text: string): string {
  if (!text) return '';
  
  // Заменяем переносы строк на <br>
  let html = text.replace(/\n/g, '<br>');
  
  // Заменяем маркеры форматирования на HTML-теги
  // Полужирный текст
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Курсив
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Подчеркнутый
  html = html.replace(/__(.*?)__/g, '<u>$1</u>');
  
  // Маркированный список
  html = html.replace(/- (.*?)(?:<br>|$)/g, '• $1<br>');
  
  // Нумерованный список (сложнее, так как нужно сохранять нумерацию)
  // Здесь упрощенная версия
  html = html.replace(/(\d+)\. (.*?)(?:<br>|$)/g, '$1. $2<br>');
  
  // Цитаты
  html = html.replace(/> (.*?)(?:<br>|$)/g, '<blockquote>$1</blockquote>');
  
  return html;
}
