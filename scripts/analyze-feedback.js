/**
 * Скрипт для анализа данных обратной связи
 * 
 * Использование:
 * 1. Экспортируйте данные из таблицы feedback в Supabase в формате JSON
 * 2. Сохраните файл как feedback-data.json в директории scripts
 * 3. Запустите скрипт: node analyze-feedback.js
 */

const fs = require('fs');
const path = require('path');

// Функция для загрузки данных
function loadFeedbackData() {
  try {
    const dataPath = path.join(__dirname, 'feedback-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error.message);
    console.log('Убедитесь, что файл feedback-data.json существует в директории scripts');
    return [];
  }
}

// Функция для расчета средних оценок
function calculateAverageRatings(data) {
  const ratings = {
    usability: { bad: 0, average: 0, good: 0, excellent: 0, total: 0 },
    design: { bad: 0, average: 0, good: 0, excellent: 0, total: 0 },
    features: { bad: 0, average: 0, good: 0, excellent: 0, total: 0 },
  };

  // Подсчет количества каждой оценки
  data.forEach(item => {
    ratings.usability[item.usability]++;
    ratings.usability.total++;
    
    ratings.design[item.design]++;
    ratings.design.total++;
    
    ratings.features[item.features]++;
    ratings.features.total++;
  });

  // Расчет процентов
  const calculatePercentages = (category) => {
    const total = ratings[category].total;
    if (total === 0) return ratings[category];
    
    return {
      ...ratings[category],
      badPercent: Math.round((ratings[category].bad / total) * 100),
      averagePercent: Math.round((ratings[category].average / total) * 100),
      goodPercent: Math.round((ratings[category].good / total) * 100),
      excellentPercent: Math.round((ratings[category].excellent / total) * 100),
    };
  };

  return {
    usability: calculatePercentages('usability'),
    design: calculatePercentages('design'),
    features: calculatePercentages('features'),
  };
}

// Функция для анализа комментариев
function analyzeComments(data) {
  // Фильтруем записи с комментариями
  const commentsData = data.filter(item => item.comments && item.comments.trim() !== '');
  
  // Ключевые слова для анализа
  const keywords = {
    positive: ['нравится', 'хорошо', 'отлично', 'удобно', 'круто', 'классно', 'здорово', 'приятно'],
    negative: ['не нравится', 'плохо', 'неудобно', 'сложно', 'трудно', 'непонятно', 'раздражает'],
    features: ['функция', 'возможность', 'добавить', 'хотелось бы', 'было бы', 'предлагаю'],
    ui: ['интерфейс', 'дизайн', 'цвет', 'кнопка', 'меню', 'навигация', 'экран'],
  };
  
  // Счетчики для каждой категории
  const counts = {
    positive: 0,
    negative: 0,
    features: 0,
    ui: 0,
  };
  
  // Массивы для хранения комментариев по категориям
  const categorizedComments = {
    positive: [],
    negative: [],
    features: [],
    ui: [],
    other: [],
  };
  
  // Анализ каждого комментария
  commentsData.forEach(item => {
    const comment = item.comments.toLowerCase();
    let categorized = false;
    
    // Проверка на ключевые слова в каждой категории
    for (const category in keywords) {
      const found = keywords[category].some(keyword => comment.includes(keyword));
      if (found) {
        counts[category]++;
        categorizedComments[category].push(item.comments);
        categorized = true;
      }
    }
    
    // Если комментарий не попал ни в одну категорию
    if (!categorized) {
      categorizedComments.other.push(item.comments);
    }
  });
  
  return {
    counts,
    categorizedComments,
    totalComments: commentsData.length,
  };
}

// Функция для генерации отчета
function generateReport(data) {
  if (data.length === 0) {
    console.log('Нет данных для анализа');
    return;
  }
  
  console.log('=== ОТЧЕТ ПО АНАЛИЗУ ОБРАТНОЙ СВЯЗИ ===');
  console.log(`Всего отзывов: ${data.length}`);
  console.log('');
  
  // Анализ оценок
  const ratings = calculateAverageRatings(data);
  console.log('=== ОЦЕНКИ ===');
  
  console.log('Удобство использования:');
  console.log(`  Отлично: ${ratings.usability.excellent} (${ratings.usability.excellentPercent}%)`);
  console.log(`  Хорошо: ${ratings.usability.good} (${ratings.usability.goodPercent}%)`);
  console.log(`  Средне: ${ratings.usability.average} (${ratings.usability.averagePercent}%)`);
  console.log(`  Плохо: ${ratings.usability.bad} (${ratings.usability.badPercent}%)`);
  console.log('');
  
  console.log('Дизайн:');
  console.log(`  Отлично: ${ratings.design.excellent} (${ratings.design.excellentPercent}%)`);
  console.log(`  Хорошо: ${ratings.design.good} (${ratings.design.goodPercent}%)`);
  console.log(`  Средне: ${ratings.design.average} (${ratings.design.averagePercent}%)`);
  console.log(`  Плохо: ${ratings.design.bad} (${ratings.design.badPercent}%)`);
  console.log('');
  
  console.log('Функциональность:');
  console.log(`  Отлично: ${ratings.features.excellent} (${ratings.features.excellentPercent}%)`);
  console.log(`  Хорошо: ${ratings.features.good} (${ratings.features.goodPercent}%)`);
  console.log(`  Средне: ${ratings.features.average} (${ratings.features.averagePercent}%)`);
  console.log(`  Плохо: ${ratings.features.bad} (${ratings.features.badPercent}%)`);
  console.log('');
  
  // Анализ комментариев
  const commentsAnalysis = analyzeComments(data);
  console.log('=== АНАЛИЗ КОММЕНТАРИЕВ ===');
  console.log(`Всего комментариев: ${commentsAnalysis.totalComments}`);
  console.log(`Положительные отзывы: ${commentsAnalysis.counts.positive}`);
  console.log(`Отрицательные отзывы: ${commentsAnalysis.counts.negative}`);
  console.log(`Предложения по функциям: ${commentsAnalysis.counts.features}`);
  console.log(`Комментарии по интерфейсу: ${commentsAnalysis.counts.ui}`);
  console.log(`Другие комментарии: ${commentsAnalysis.categorizedComments.other.length}`);
  console.log('');
  
  // Сохранение отчета в файл
  const reportPath = path.join(__dirname, 'feedback-report.txt');
  const reportContent = `=== ОТЧЕТ ПО АНАЛИЗУ ОБРАТНОЙ СВЯЗИ ===
Всего отзывов: ${data.length}

=== ОЦЕНКИ ===
Удобство использования:
  Отлично: ${ratings.usability.excellent} (${ratings.usability.excellentPercent}%)
  Хорошо: ${ratings.usability.good} (${ratings.usability.goodPercent}%)
  Средне: ${ratings.usability.average} (${ratings.usability.averagePercent}%)
  Плохо: ${ratings.usability.bad} (${ratings.usability.badPercent}%)

Дизайн:
  Отлично: ${ratings.design.excellent} (${ratings.design.excellentPercent}%)
  Хорошо: ${ratings.design.good} (${ratings.design.goodPercent}%)
  Средне: ${ratings.design.average} (${ratings.design.averagePercent}%)
  Плохо: ${ratings.design.bad} (${ratings.design.badPercent}%)

Функциональность:
  Отлично: ${ratings.features.excellent} (${ratings.features.excellentPercent}%)
  Хорошо: ${ratings.features.good} (${ratings.features.goodPercent}%)
  Средне: ${ratings.features.average} (${ratings.features.averagePercent}%)
  Плохо: ${ratings.features.bad} (${ratings.features.badPercent}%)

=== АНАЛИЗ КОММЕНТАРИЕВ ===
Всего комментариев: ${commentsAnalysis.totalComments}
Положительные отзывы: ${commentsAnalysis.counts.positive}
Отрицательные отзывы: ${commentsAnalysis.counts.negative}
Предложения по функциям: ${commentsAnalysis.counts.features}
Комментарии по интерфейсу: ${commentsAnalysis.counts.ui}
Другие комментарии: ${commentsAnalysis.categorizedComments.other.length}

=== ПРИМЕРЫ КОММЕНТАРИЕВ ===
Положительные:
${commentsAnalysis.categorizedComments.positive.slice(0, 5).map(c => `- ${c}`).join('\n')}

Отрицательные:
${commentsAnalysis.categorizedComments.negative.slice(0, 5).map(c => `- ${c}`).join('\n')}

Предложения по функциям:
${commentsAnalysis.categorizedComments.features.slice(0, 5).map(c => `- ${c}`).join('\n')}

Комментарии по интерфейсу:
${commentsAnalysis.categorizedComments.ui.slice(0, 5).map(c => `- ${c}`).join('\n')}
`;

  fs.writeFileSync(reportPath, reportContent);
  console.log(`Отчет сохранен в файл: ${reportPath}`);
}

// Запуск анализа
const data = loadFeedbackData();
generateReport(data);

// Экспорт функций для использования в других скриптах
module.exports = {
  loadFeedbackData,
  calculateAverageRatings,
  analyzeComments,
  generateReport,
};
