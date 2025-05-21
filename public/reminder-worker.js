// Сервис-воркер для напоминаний

self.addEventListener('install', (event) => {
  console.log('Сервис-воркер для напоминаний установлен');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Сервис-воркер для напоминаний активирован');
  event.waitUntil(self.clients.claim());
  
  // Запускаем проверку напоминаний
  checkReminders();
});

// Функция для проверки напоминаний
function checkReminders() {
  console.log('Проверка напоминаний...');
  
  // Получаем информацию о напоминании из localStorage
  self.clients.matchAll().then(clients => {
    if (clients.length > 0) {
      clients[0].postMessage({ type: 'GET_REMINDER_INFO' });
    }
  });
  
  // Запускаем проверку каждую минуту
  setTimeout(checkReminders, 60000);
}

// Обработчик сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data.type === 'REMINDER_INFO') {
    const reminderInfo = event.data.data;
    
    if (reminderInfo && reminderInfo.time) {
      const shouldSendNotification = shouldSendReminderNow(reminderInfo);
      
      if (shouldSendNotification) {
        sendNotification();
        
        // Обновляем время последнего уведомления
        self.clients.matchAll().then(clients => {
          if (clients.length > 0) {
            clients[0].postMessage({ 
              type: 'UPDATE_LAST_NOTIFICATION',
              data: new Date().toISOString()
            });
          }
        });
      }
    }
  }
});

// Функция для определения, нужно ли отправить напоминание сейчас
function shouldSendReminderNow(reminderInfo) {
  const now = new Date();
  const [hours, minutes] = reminderInfo.time.split(':').map(Number);
  
  // Проверяем, совпадает ли текущее время с временем напоминания (с точностью до минуты)
  const isTimeMatch = now.getHours() === hours && now.getMinutes() === minutes;
  
  // Если время не совпадает, не отправляем уведомление
  if (!isTimeMatch) {
    return false;
  }
  
  // Проверяем частоту напоминаний
  if (reminderInfo.frequency === 'daily') {
    // Для ежедневных напоминаний проверяем, не отправляли ли мы уже сегодня
    if (reminderInfo.lastNotification) {
      const lastNotificationDate = new Date(reminderInfo.lastNotification);
      return !isSameDay(lastNotificationDate, now);
    }
    return true;
  } else if (reminderInfo.frequency === 'weekly') {
    // Для еженедельных напоминаний проверяем, прошла ли неделя с последнего уведомления
    if (reminderInfo.lastNotification) {
      const lastNotificationDate = new Date(reminderInfo.lastNotification);
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return lastNotificationDate <= oneWeekAgo;
    }
    return true;
  }
  
  return false;
}

// Функция для проверки, является ли дата тем же днем
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Функция для отправки уведомления
function sendNotification() {
  self.registration.showNotification('Дневник настроения', {
    body: 'Не забудьте записать свое настроение сегодня!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: self.location.origin + '/diary'
    },
    requireInteraction: true
  });
}

// Обработчик клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Открываем страницу дневника при клике на уведомление
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clientList => {
      // Если есть открытое окно, фокусируемся на нем
      for (const client of clientList) {
        if (client.url.includes('/diary') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Если нет открытого окна, открываем новое
      if (self.clients.openWindow) {
        return self.clients.openWindow('/diary');
      }
    })
  );
});
