// Gestión de efectos visuales y animaciones
export class EffectsManager {
    constructor() {
        this.heartsContainer = null;
        this.particleIntervals = [];
    }

    init() {
        this.heartsContainer = document.getElementById('heartsContainer');
        if (!this.heartsContainer) {
            console.warn('Hearts container no encontrado');
        }
        this.setupEventListeners();
        this.startBackgroundEffects();
    }

    setupEventListeners() {
        // Corazones al hacer clic
        document.addEventListener('click', (e) => {
            this.createHeart(e.clientX, e.clientY);
        });

        // Corazones al tocar en móvil
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.createHeart(touch.clientX, touch.clientY);
        });

        // Efecto de cursor con sparkles (throttled)
        let lastSparkle = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastSparkle > 100) { // Throttle a 100ms
                this.createSparkle(e.clientX, e.clientY);
                lastSparkle = now;
            }
        });
    }

    createHeart(x, y) {
        if (!this.heartsContainer) return;

        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.className = 'interactive-heart';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.position = 'fixed';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '5';
        heart.style.fontSize = '24px';
        heart.style.color = '#ff6b6b';
        heart.style.animation = 'heartFloat 3s ease-out forwards';

        this.heartsContainer.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 3000);
    }

    createMultipleHearts(count = 5, sourceElement = null) {
        let centerX = window.innerWidth / 2;
        let centerY = window.innerHeight / 2;

        if (sourceElement) {
            const rect = sourceElement.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
        }

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 200;
                const offsetY = (Math.random() - 0.5) * 200;
                this.createHeart(centerX + offsetX, centerY + offsetY);
            }, i * 200);
        }
    }

    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = '12px';
        sparkle.style.color = 'rgba(255, 255, 255, 0.8)';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = 'sparkle 0.6s ease-out forwards';

        document.body.appendChild(sparkle);

        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 600);
    }

    createStarParticle() {
        const star = document.createElement('div');
        star.innerHTML = '✨';
        star.style.position = 'fixed';
        star.style.color = 'rgba(255, 255, 255, 0.8)';
        star.style.fontSize = '16px';
        star.style.left = Math.random() * (window.innerWidth - 20) + 'px';
        star.style.top = '-30px';
        star.style.pointerEvents = 'none';
        star.style.zIndex = '2';
        star.style.animation = 'fall 5s linear forwards';
        star.style.willChange = 'transform, opacity';

        document.body.appendChild(star);

        setTimeout(() => {
            if (star.parentNode) {
                star.remove();
            }
        }, 5000);
    }

    createStarBurst(centerElement) {
        if (!centerElement) return;

        const rect = centerElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const angle = (i * 30) * Math.PI / 180;
                const distance = 100;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;

                const star = document.createElement('div');
                star.innerHTML = '⭐';
                star.style.position = 'fixed';
                star.style.left = centerX + 'px';
                star.style.top = centerY + 'px';
                star.style.pointerEvents = 'none';
                star.style.fontSize = '20px';
                star.style.zIndex = '1000';
                star.style.transition = 'all 1s ease-out';

                document.body.appendChild(star);

                setTimeout(() => {
                    star.style.left = x + 'px';
                    star.style.top = y + 'px';
                    star.style.opacity = '0';
                }, 100);

                setTimeout(() => {
                    if (star.parentNode) {
                        star.remove();
                    }
                }, 1200);
            }, i * 100);
        }
    }

    startBackgroundEffects() {
        // Corazones aleatorios menos frecuentes
        const heartInterval = setInterval(() => {
            this.createRandomHeart();
        }, 5000);

        // Partículas de estrellas menos frecuentes
        const starInterval = setInterval(() => {
            this.createStarParticle();
        }, 6000);

        this.particleIntervals.push(heartInterval, starInterval);
    }

    createRandomHeart() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        this.createHeart(x, y);
    }

    vibrate() {
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    cleanup() {
        this.particleIntervals.forEach(interval => clearInterval(interval));
        this.particleIntervals = [];
    }
}