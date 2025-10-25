// Автоматичний поворот платформи при зміні орієнтації телефону

(function () {
    'use strict';

    // Створюємо індикатор орієнтації
    function createOrientationIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'orientation-indicator';
        indicator.id = 'orientationIndicator';
        document.body.appendChild(indicator);

        // Автоматично приховуємо через 3 секунди
        setTimeout(() => {
            indicator.classList.add('hidden');
        }, 3000);

        return indicator;
    }

    // Функція для оновлення орієнтації
    function updateOrientation() {
        const indicator = document.getElementById('orientationIndicator') || createOrientationIndicator();

        // Показуємо індикатор при зміні
        indicator.classList.remove('hidden');

        // Визначаємо орієнтацію
        let isLandscape = false;

        // Спосіб 1: Screen Orientation API (найсучасніший)
        if (screen.orientation) {
            isLandscape = screen.orientation.type.includes('landscape');
            console.log('📱 Орієнтація (Screen API):', screen.orientation.type);
        }
        // Спосіб 2: window.orientation (старіший спосіб)
        else if (typeof window.orientation !== 'undefined') {
            isLandscape = (window.orientation === 90 || window.orientation === -90);
            console.log('📱 Орієнтація (window.orientation):', window.orientation);
        }
        // Спосіб 3: matchMedia (запасний варіант)
        else {
            isLandscape = window.matchMedia('(orientation: landscape)').matches;
            console.log('📱 Орієнтація (matchMedia):', isLandscape ? 'landscape' : 'portrait');
        }

        // Додаємо класи до body
        if (isLandscape) {
            document.body.classList.add('landscape-mode');
            document.body.classList.remove('portrait-mode');
        } else {
            document.body.classList.add('portrait-mode');
            document.body.classList.remove('landscape-mode');
        }

        // Приховуємо індикатор через 3 секунди
        setTimeout(() => {
            indicator.classList.add('hidden');
        }, 3000);
    }

    // Ініціалізація при завантаженні сторінки
    function init() {
        console.log('🔄 Ініціалізація системи автоповороту...');

        // Створюємо індикатор
        createOrientationIndicator();

        // Оновлюємо орієнтацію при завантаженні
        updateOrientation();

        // Спосіб 1: Screen Orientation API
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => {
                console.log('🔄 Зміна орієнтації (Screen API)');
                updateOrientation();
            });
        }

        // Спосіб 2: orientationchange (для старіших браузерів)
        window.addEventListener('orientationchange', () => {
            console.log('🔄 Зміна орієнтації (orientationchange)');
            updateOrientation();
        });

        // Спосіб 3: resize (запасний варіант)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                console.log('🔄 Зміна розміру екрану');
                updateOrientation();
            }, 100);
        });

        console.log('✅ Система автоповороту активована!');
    }

    // Запускаємо ініціалізацію
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();