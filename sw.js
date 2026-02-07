const CACHE_NAME = 'bad-wifi-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Установка
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэш открыт');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Активация
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - оффлайн режим
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).catch(() => {
          // Оффлайн страница
          if (event.request.destination === 'document') {
            return new Response(
              `<!DOCTYPE html>
              <html>
              <head>
                <title>Нет соединения</title>
                <style>
                  body {
                    font-family: 'MS Sans Serif', sans-serif;
                    background: #008080;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                  }
                  .error-box {
                    background: #c0c0c0;
                    border: 2px solid;
                    border-color: #fff #000 #000 #fff;
                    padding: 30px;
                    text-align: center;
                  }
                  h1 { color: #000080; }
                </style>
              </head>
              <body>
                <div class="error-box">
                  <h1>❌ Нет подключения к Интернету</h1>
                  <p>Проверьте подключение и повторите попытку.</p>
                  <p><em>(Ирония судьбы: даже симулятор плохого Wi-Fi требует Wi-Fi)</em></p>
                </div>
              </body>
              </html>`,
              {
                headers: { 'Content-Type': 'text/html' }
              }
            );
          }
        });
      })
  );
});
```

---

## 🎨 Создание иконок

Для иконок вам нужно создать PNG изображения с пиксельным роутером или значком Wi-Fi с восклицательным знаком. Можете использовать любой графический редактор или онлайн-сервис вроде:

- **Pixilart.com** (пиксель-арт редактор)
- **Piskel** (бесплатный sprite editor)
- **GIMP** / **Photoshop**

**Рекомендуемый дизайн иконки:**
```
192×192 и 512×512
- Фон: #c0c0c0 (серый Windows)
- Роутер: пиксельный стиль, черные контуры
- Красный крестик или восклицательный знак
- 3D-эффект как в Windows XP