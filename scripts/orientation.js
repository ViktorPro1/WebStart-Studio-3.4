const sections = document.querySelectorAll('section');

function updateLayoutForOrientation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const body = document.body;

    if (width > height) {
        body.classList.add('landscape');
        body.classList.remove('portrait');
    } else {
        body.classList.add('portrait');
        body.classList.remove('landscape');
    }

    sections.forEach(section => {
        section.style.transition = 'all 0.3s ease';
        section.style.padding = (width > height) ? '20px 40px' : '20px 20px';
    });

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.fontSize = (width > height) ? '18px' : '16px';
    }
}

// Викликаємо одразу
updateLayoutForOrientation();

// Слухаємо зміну розміру та орієнтації
window.addEventListener('resize', updateLayoutForOrientation);
window.addEventListener('orientationchange', updateLayoutForOrientation);
