/**
 * Скрипт для визуализации данных обратной связи
 * 
 * Использование:
 * 1. Установите зависимости: npm install chart.js canvas
 * 2. Экспортируйте данные из таблицы feedback в Supabase в формате JSON
 * 3. Сохраните файл как feedback-data.json в директории scripts
 * 4. Запустите скрипт: node visualize-feedback.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { Chart } = require('chart.js/auto');
const { loadFeedbackData, calculateAverageRatings, analyzeComments } = require('./analyze-feedback');

// Функция для создания диаграммы оценок
function createRatingsChart(ratings, category) {
  // Создаем canvas
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');
  
  // Создаем диаграмму
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Отлично', 'Хорошо', 'Средне', 'Плохо'],
      datasets: [{
        label: `Оценки: ${category}`,
        data: [
          ratings[category].excellent,
          ratings[category].good,
          ratings[category].average,
          ratings[category].bad
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
  
  // Сохраняем диаграмму в файл
  const out = fs.createWriteStream(path.join(__dirname, `${category}-ratings.png`));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`Диаграмма для ${category} сохранена`);
      resolve();
    });
    out.on('error', reject);
  });
}

// Функция для создания диаграммы комментариев
function createCommentsChart(commentsAnalysis) {
  // Создаем canvas
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');
  
  // Создаем диаграмму
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Положительные', 'Отрицательные', 'Предложения', 'Интерфейс', 'Другие'],
      datasets: [{
        data: [
          commentsAnalysis.counts.positive,
          commentsAnalysis.counts.negative,
          commentsAnalysis.counts.features,
          commentsAnalysis.counts.ui,
          commentsAnalysis.categorizedComments.other.length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Распределение комментариев по категориям'
        }
      }
    }
  });
  
  // Сохраняем диаграмму в файл
  const out = fs.createWriteStream(path.join(__dirname, 'comments-distribution.png'));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  
  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log('Диаграмма комментариев сохранена');
      resolve();
    });
    out.on('error', reject);
  });
}

// Функция для создания HTML-отчета с диаграммами
function createHtmlReport(data, ratings, commentsAnalysis) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Отчет по обратной связи</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    h1, h2 { color: #333; }
    .container { max-width: 1200px; margin: 0 auto; }
    .chart-container { margin-bottom: 30px; }
    .stats { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .stat-box { background: #f5f5f5; padding: 15px; border-radius: 5px; width: 23%; text-align: center; }
    .stat-box h3 { margin-top: 0; }
    .stat-box .number { font-size: 24px; font-weight: bold; color: #4a90e2; }
    .comments-section { margin-top: 30px; }
    .comment { background: #f9f9f9; padding: 10px; margin-bottom: 10px; border-left: 3px solid #4a90e2; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Отчет по анализу обратной связи</h1>
    <p>Всего отзывов: ${data.length}</p>
    
    <div class="stats">
      <div class="stat-box">
        <h3>Удобство</h3>
        <div class="number">${ratings.usability.excellentPercent + ratings.usability.goodPercent}%</div>
        <p>положительных оценок</p>
      </div>
      <div class="stat-box">
        <h3>Дизайн</h3>
        <div class="number">${ratings.design.excellentPercent + ratings.design.goodPercent}%</div>
        <p>положительных оценок</p>
      </div>
      <div class="stat-box">
        <h3>Функциональность</h3>
        <div class="number">${ratings.features.excellentPercent + ratings.features.goodPercent}%</div>
        <p>положительных оценок</p>
      </div>
      <div class="stat-box">
        <h3>Комментарии</h3>
        <div class="number">${commentsAnalysis.totalComments}</div>
        <p>всего комментариев</p>
      </div>
    </div>
    
    <h2>Диаграммы оценок</h2>
    <div class="chart-container">
      <img src="usability-ratings.png" alt="Оценки удобства использования">
    </div>
    <div class="chart-container">
      <img src="design-ratings.png" alt="Оценки дизайна">
    </div>
    <div class="chart-container">
      <img src="features-ratings.png" alt="Оценки функциональности">
    </div>
    
    <h2>Распределение комментариев</h2>
    <div class="chart-container">
      <img src="comments-distribution.png" alt="Распределение комментариев">
    </div>
    
    <div class="comments-section">
      <h2>Примеры комментариев</h2>
      
      <h3>Положительные отзывы</h3>
      ${commentsAnalysis.categorizedComments.positive.slice(0, 5).map(comment => 
        `<div class="comment">${comment}</div>`
      ).join('')}
      
      <h3>Отрицательные отзывы</h3>
      ${commentsAnalysis.categorizedComments.negative.slice(0, 5).map(comment => 
        `<div class="comment">${comment}</div>`
      ).join('')}
      
      <h3>Предложения по функциям</h3>
      ${commentsAnalysis.categorizedComments.features.slice(0, 5).map(comment => 
        `<div class="comment">${comment}</div>`
      ).join('')}
      
      <h3>Комментарии по интерфейсу</h3>
      ${commentsAnalysis.categorizedComments.ui.slice(0, 5).map(comment => 
        `<div class="comment">${comment}</div>`
      ).join('')}
    </div>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(__dirname, 'feedback-report.html'), htmlContent);
  console.log('HTML-отчет сохранен в файл: feedback-report.html');
}

// Основная функция
async function main() {
  try {
    // Загружаем данные
    const data = loadFeedbackData();
    
    if (data.length === 0) {
      console.log('Нет данных для анализа');
      return;
    }
    
    // Анализируем данные
    const ratings = calculateAverageRatings(data);
    const commentsAnalysis = analyzeComments(data);
    
    // Создаем диаграммы
    await createRatingsChart(ratings, 'usability');
    await createRatingsChart(ratings, 'design');
    await createRatingsChart(ratings, 'features');
    await createCommentsChart(commentsAnalysis);
    
    // Создаем HTML-отчет
    createHtmlReport(data, ratings, commentsAnalysis);
    
    console.log('Визуализация завершена успешно');
  } catch (error) {
    console.error('Ошибка при визуализации данных:', error);
  }
}

// Запускаем скрипт
main();
