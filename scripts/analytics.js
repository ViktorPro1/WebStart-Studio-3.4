// 🔹 Відкладена аналітика з Web Vitals
// Підключає: GTM (GA4), Clarity, Web Vitals

// 🔹 Ініціалізація GTM
function initGTM() {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", "G-PNL84GTKES"); // заміни на свій ID
}

// 🔹 Відправка Web Vitals у GA
function sendToAnalytics({ name, delta, id }) {
    if (typeof gtag !== 'function') {
        console.warn('gtag не знайдено, метрика пропущена:', name);
        return;
    }
    gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(name === 'CLS' ? delta * 1000 : delta),
        non_interaction: true
    });
}

// 🔹 Запуск Web Vitals
function runVitals() {
    if (typeof getCLS === 'function') getCLS(sendToAnalytics);
    if (typeof getFID === 'function') getFID(sendToAnalytics);
    if (typeof getLCP === 'function') getLCP(sendToAnalytics);
    if (typeof getFCP === 'function') getFCP(sendToAnalytics);
    if (typeof getTTFB === 'function') getTTFB(sendToAnalytics);
}

// 🔹 Динамічне завантаження сторонніх скриптів
function loadScripts() {
    // --- GTM (GA4)
    const gtmScript = document.createElement('script');
    gtmScript.src = "https://www.googletagmanager.com/gtag/js?id=G-PNL84GTKES";
    gtmScript.async = true;
    gtmScript.onload = function () {
        initGTM();
        runVitals(); // Web Vitals після GTM
    };
    document.head.appendChild(gtmScript);

    // --- Microsoft Clarity
    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
        t = document.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = document.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "slktbp5ngx");

    // --- Web Vitals (якщо ще не підключено)
    if (!window.webVitalsLoaded) {
        const vitalsScript = document.createElement('script');
        vitalsScript.src = "https://unpkg.com/web-vitals@2.1.4/dist/web-vitals.iife.js";
        vitalsScript.defer = true;
        vitalsScript.onload = runVitals; // запускаємо після завантаження
        document.head.appendChild(vitalsScript);
        window.webVitalsLoaded = true;
    }
}

// 🔹 Відкладене завантаження через 5 секунд
setTimeout(loadScripts, 5000);
