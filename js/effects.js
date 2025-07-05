// Gestión de efectos visuales y animaciones
export class EffectsManager {
    constructor() {
        this.heartsContainer = null;
        this.particleIntervals = [];
        this.testingEnabled = true; // Habilitar/deshabilitar teclas de testing
        this.finalRainActive = false; // Estado de la lluvia final
    }

    init() {
        this.heartsContainer = document.getElementById('heartsContainer');
        if (!this.heartsContainer) {
            console.warn('Hearts container no encontrado');
        }
        this.setupEventListeners();
        this.setupTestingKeys();
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

    setupTestingKeys() {
        document.addEventListener('keydown', (e) => {
            if (!this.testingEnabled) return;

            // T o t - Testing de lluvia final
            if (e.key === 't' || e.key === 'T') {
                if (!this.finalRainActive) {
                    console.log('🧪 TESTING: Activando lluvia final...');
                    this.createFinalRain();
                } else {
                    console.log('⚠️ TESTING: Lluvia final ya está activa');
                }
            }

            // Ctrl + T - Desactivar/activar testing
            if (e.ctrlKey && (e.key === 't' || e.key === 'T')) {
                e.preventDefault();
                this.testingEnabled = !this.testingEnabled;
                console.log(`🔧 TESTING: ${this.testingEnabled ? 'Activado' : 'Desactivado'}`);
                
                // Mostrar notificación visual
                this.showTestingNotification(this.testingEnabled);
            }

            // H o h - Testing de corazones individuales
            if (e.key === 'h' || e.key === 'H') {
                console.log('🧪 TESTING: Creando corazones aleatorios...');
                for(let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.createRandomHeart();
                    }, i * 200);
                }
            }

            // E o e - Testing de estrellas
            if (e.key === 'e' || e.key === 'E') {
                console.log('🧪 TESTING: Creando estrellas...');
                for(let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        this.createStarParticle();
                    }, i * 300);
                }
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
        // Posición X aleatoria con un pequeño margen para evitar bordes
        const margin = 50;
        const x = margin + Math.random() * (window.innerWidth - margin * 2);
        
        // Posición Y inicial variable para más naturalidad
        const y = -30 - Math.random() * 20; // Entre -30px y -50px
        
        this.createFallingHeart(x, y);
    }

    createFallingHeart(x, y) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.className = 'falling-heart';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '5';
        heart.style.fontSize = (18 + Math.random() * 8) + 'px'; // Tamaño variable: 18-26px
        heart.style.color = '#ff6b6b';
        
        // Elegir animación aleatoria incluyendo rotaciones inversas
        const animations = [
            'fallAndFloat', 
            'fallAndFloatAlt1', 
            'fallAndFloatAlt2',
            'fallAndFloatReverse',      // Rotación inversa
            'fallAndFloatReverseAlt'    // Rotación inversa alternativa
        ];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        const duration = 4 + Math.random() * 1.5; // Duración similar a estrellas: 4-5.5s
        
        heart.style.animation = `${randomAnimation} ${duration}s linear forwards`;

        // Agregar directamente al body para no estar limitado por contenedores
        document.body.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, Math.ceil(duration * 1000));
    }

    createFinalRain() {
        if (this.finalRainActive) {
            console.log('⚠️ Lluvia final ya está en progreso');
            return;
        }

        this.finalRainActive = true;
        console.log('🌧️ Iniciando lluvia final de corazones y estrellas...');
        
        // Lluvia intensa de corazones por 6 segundos
        const heartRain = setInterval(() => {
            for(let i = 0; i < 10; i++) {
                setTimeout(() => {
                    this.createRandomHeart();
                }, i * 100);
            }
        }, 300);

        // Lluvia de estrellas por 6 segundos
        const starRain = setInterval(() => {
            for(let i = 0; i < 9; i++) {
                setTimeout(() => {
                    this.createStarParticle();
                }, i * 150);
            }
        }, 250);

        // Detener después de 12 segundos
        setTimeout(() => {
            clearInterval(heartRain);
            clearInterval(starRain);
            this.finalRainActive = false;
            console.log('✨ Lluvia final completada');
        }, 12000);
    }

    showTestingNotification(enabled) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${enabled ? '#4caf50' : '#f44336'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            🔧 Testing ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}
            <div style="font-size: 11px; margin-top: 4px; opacity: 0.9;">
                ${enabled ? 'T: Lluvia final | H: Corazones | E: Estrellas' : 'Ctrl+T para reactivar'}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 3000);
    }

    // Métodos públicos para control externo
    enableTesting() {
        this.testingEnabled = true;
        console.log('🔧 Testing habilitado desde código');
    }

    disableTesting() {
        this.testingEnabled = false;
        console.log('🔧 Testing deshabilitado desde código');
    }

    getTestingStatus() {
        return this.testingEnabled;
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