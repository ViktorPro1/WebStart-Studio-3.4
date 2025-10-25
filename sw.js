const CACHE_NAME = "webstart-auto-cache";
const urlsToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/scripts/main.js",
    "/scripts/ui-scroll.js",
    "/scripts/analytics.js",
    "/scripts/init.js",
    "/scripts/pwa-loader.js",
    "/scripts/script.js",
    "/scripts/structured-data.js",
    "/scripts/auto-rotation.js",
    "/icons/icon-192x192.webp",
    "/icons/icon-512x512.webp",

    // Фото для відгуків
    "/foto/olena.webp",
    "/foto/andriy.webp",
    "/foto/mariya.webp",
    "/foto/nadija.webp",
    "/foto/volodumer.webp",
    "/foto/vika.webp",
    "/foto/sergey.webp",
    "/foto/bogdan.webp",
    "/foto/sofia.webp",

    // CSS модулі
    "/other_styles/achievement.css",
    "/other_styles/adaptive-info.css",
    "/other_styles/ai-prompting.css",
    "/other_styles/animations-info.css",
    "/other_styles/blog-info.css",
    "/other_styles/calc.css",
    "/other_styles/contact.css",
    "/other_styles/declaration.css"
];

// Встановлення SW
self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.allSettled(
                urlsToCache.map(url =>
                    cache.add(url).catch(err => {
                        console.warn(`⚠️ Не вдалось кешувати: ${url}`, err.message);
                    })
                )
            )
        )
    );
});

// Активація SW
self.addEventListener("activate", event => {
    clients.claim();
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(
                names.filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log(`🗑️ Видалено старий кеш: ${name}`);
                        return caches.delete(name);
                    })
            )
        )
    );
});

// 🔥 ВИПРАВЛЕНО: Обробка fetch без повторного клонування
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);
    if (url.origin !== location.origin) return;

    // Для фото - пріоритет мережі
    if (url.pathname.includes('/foto/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // ✅ Клонуємо ОДРАЗУ після отримання
                    const responseClone = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone))
                        .catch(err => console.warn('Помилка кешування фото:', err));

                    return response;
                })
                .catch(() =>
                    caches.match(event.request)
                        .then(cached => cached || new Response("📷 Фото недоступне", {
                            status: 503,
                            statusText: "Service Unavailable"
                        }))
                )
        );
        return;
    }

    // Для інших ресурсів - стандартна стратегія
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request)
                .then(response => {
                    // ✅ Перевіряємо чи response валідний
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // ✅ Клонуємо ОДРАЗУ
                    const responseClone = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone))
                        .catch(err => console.warn('Помилка кешування:', err));

                    return response;
                })
                .catch(() =>
                    new Response("⚠️ Немає підключення", {
                        status: 503,
                        statusText: "Service Unavailable"
                    })
                );
        })
    );
});