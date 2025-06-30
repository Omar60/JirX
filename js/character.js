// Gestión del personaje y animaciones místicas con posicionamiento inteligente
export class CharacterManager {
    constructor() {
        this.lottiePlayer = null;
        this.characterSpeech = null;
        this.characterMessage = null;
        this.nameAnimationInterval = null;
        this.speechPositionMode = 'auto'; // auto, smart, left, right, top, bottom
        this.enchantmentChars = [
            'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ',
            'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ', '☆', '✦', '✧', '※', '◊', '◈', '⬟', '⬢',
            '⟐', '⟑', '⌬', '⌭', '⌮', '⟡', '⟢', '⟣', '⬡', '◉', '⬢', '⬣', '⟐', '◈'
        ];
        this.randomMessages = [
            "¡Ronroneo! 😸",
            "¿Necesitas un abrazo virtual? 🤗",
            "Estoy aquí para ti 💕",
            "¡Miau de apoyo! 🐾",
            "Eres especial ✨",
            "El amor es hermoso 💖",
            () => `¡Soy ${this.generateMysticName(4)}! ✨`,
            () => `Mi verdadero nombre es ${this.generateMysticName(6)} 🔮`,
            () => `${this.generateMysticName(5)} significa 'amigo' en idioma místico 🌟`
        ];
    }

    init() {
        this.lottiePlayer = document.getElementById('lottiePlayer');
        this.characterSpeech = document.getElementById('characterSpeech');
        this.characterMessage = document.getElementById('characterMessage');

        if (!this.lottiePlayer || !this.characterSpeech || !this.characterMessage) {
            throw new Error('Elementos del personaje no encontrados en el DOM');
        }

        this.setupInteractions();
        this.setupSpeechPositioning();
        console.log('🐱 CharacterManager inicializado con posicionamiento inteligente de globo');
    }

    setupInteractions() {
        // Click principal
        this.lottiePlayer.addEventListener('click', () => {
            this.playClickAnimation();
        });

        // Hover effects
        this.lottiePlayer.addEventListener('mouseenter', () => {
            this.handleHover();
        });

        this.lottiePlayer.addEventListener('mouseleave', () => {
            this.resetScale();
        });
    }

    setupSpeechPositioning() {
        // Detectar posición óptima del globo según viewport
        this.updateSpeechPosition();
        
        // Actualizar posición en resize
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.updateSpeechPosition();
            }, 300);
        });

        // Controles de teclado para cambiar posición del globo
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.setSpeechPosition('left');
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.setSpeechPosition('right');
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.setSpeechPosition('top');
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.setSpeechPosition('bottom');
                        break;
                    case 's':
                        e.preventDefault();
                        this.setSpeechPosition('smart');
                        break;
                    case 'a':
                        e.preventDefault();
                        this.setSpeechPosition('auto');
                        break;
                }
            }
        });

        console.log(`
🗨️ CONTROLES DE GLOBO DE DIÁLOGO:
================================
Alt + ←: Posición izquierda
Alt + →: Posición derecha  
Alt + ↑: Posición superior
Alt + ↓: Posición inferior
Alt + S: Posicionamiento inteligente
Alt + A: Posicionamiento automático
        `);
    }

    setSpeechPosition(mode) {
        this.speechPositionMode = mode;
        this.updateSpeechPosition();
        console.log(`🗨️ Posición del globo cambiada a: ${mode}`);
    }

    updateSpeechPosition() {
        if (!this.characterSpeech) return;

        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        const lottieRect = this.lottiePlayer.getBoundingClientRect();
        
        // Limpiar clases de posición previas
        this.characterSpeech.classList.remove('smart-bubble');
        
        let position = this.speechPositionMode;
        
        // Auto-detectar mejor posición si está en modo auto
        if (position === 'auto') {
            position = this.detectBestSpeechPosition(lottieRect, viewport);
        }
        
        // Aplicar posicionamiento según modo
        switch (position) {
            case 'smart':
            case 'left':
                this.applySpeechPositionLeft();
                break;
            case 'right':
                this.applySpeechPositionRight();
                break;
            case 'top':
                this.applySpeechPositionTop();
                break;
            case 'bottom':
                this.applySpeechPositionBottom();
                break;
            default:
                this.applySpeechPositionDefault();
                break;
        }
    }

    detectBestSpeechPosition(lottieRect, viewport) {
        const margin = 20;
        const bubbleWidth = 250;
        const bubbleHeight = 80;
        
        // Calcular espacio disponible en cada dirección
        const spaces = {
            left: lottieRect.left - margin,
            right: viewport.width - lottieRect.right - margin,
            top: lottieRect.top - margin,
            bottom: viewport.height - lottieRect.bottom - margin
        };
        
        // Priorizar según espacio disponible y posición de la mascota
        if (spaces.left >= bubbleWidth && lottieRect.left > viewport.width * 0.5) {
            return 'left';
        } else if (spaces.right >= bubbleWidth && lottieRect.right < viewport.width * 0.5) {
            return 'right';
        } else if (spaces.top >= bubbleHeight) {
            return 'top';
        } else if (spaces.bottom >= bubbleHeight) {
            return 'bottom';
        }
        
        // Fallback a posición por defecto
        return 'default';
    }

    applySpeechPositionLeft() {
        this.characterSpeech.classList.add('smart-bubble');
        this.characterSpeech.style.bottom = 'auto';
        this.characterSpeech.style.right = 'auto';
        this.characterSpeech.style.left = '-280px';
        this.characterSpeech.style.top = '50%';
        this.characterSpeech.style.transform = 'translateY(-50%)';
        this.characterSpeech.style.maxWidth = '300px';
    }

    applySpeechPositionRight() {
        this.characterSpeech.style.bottom = '50%';
        this.characterSpeech.style.right = '-280px';
        this.characterSpeech.style.left = 'auto';
        this.characterSpeech.style.top = 'auto';
        this.characterSpeech.style.transform = 'translateY(50%)';
        this.characterSpeech.style.maxWidth = '300px';
    }

    applySpeechPositionTop() {
        this.characterSpeech.style.bottom = '160px';
        this.characterSpeech.style.right = '-20px';
        this.characterSpeech.style.left = 'auto';
        this.characterSpeech.style.top = 'auto';
        this.characterSpeech.style.transform = 'none';
        this.characterSpeech.style.maxWidth = '250px';
    }

    applySpeechPositionBottom() {
        this.characterSpeech.style.bottom = '-100px';
        this.characterSpeech.style.right = '-20px';
        this.characterSpeech.style.left = 'auto';
        this.characterSpeech.style.top = 'auto';
        this.characterSpeech.style.transform = 'none';
        this.characterSpeech.style.maxWidth = '250px';
    }

    applySpeechPositionDefault() {
        this.characterSpeech.style.bottom = '140px';
        this.characterSpeech.style.right = '-20px';
        this.characterSpeech.style.left = 'auto';
        this.characterSpeech.style.top = 'auto';
        this.characterSpeech.style.transform = 'none';
        this.characterSpeech.style.maxWidth = '250px';
    }

    playClickAnimation() {
        this.lottiePlayer.stop();
        this.lottiePlayer.play();
        this.lottiePlayer.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.lottiePlayer.style.transform = 'scale(1)';
        }, 200);
    }

    handleHover() {
        this.lottiePlayer.style.transform = 'scale(1.05)';
    }

    resetScale() {
        this.lottiePlayer.style.transform = 'scale(1)';
    }

    showMessage(message, autoHide = true, duration = 3000) {
        if (!this.characterMessage || !this.characterSpeech) return;

        this.characterMessage.textContent = message;
        this.adjustSpeechBubble();
        this.updateSpeechPosition(); // Actualizar posición antes de mostrar
        this.characterSpeech.classList.add('show');

        if (autoHide) {
            setTimeout(() => {
                this.hideMessage();
            }, duration);
        }
    }

    hideMessage() {
        if (this.characterSpeech) {
            this.characterSpeech.classList.remove('show');
        }
    }

    showMysticMessage(finalMessage) {
        if (!this.characterSpeech || !this.characterMessage) return;

        this.characterSpeech.classList.add('show');
        const baseMessage = "¡Hola! Mi nombre es ᚦᚱᚨᚾᚲ 🐱 Haz clic en mí para comenzar esta historia especial...";
        this.characterMessage.textContent = baseMessage;
        this.adjustSpeechBubble();
        this.updateSpeechPosition();
        this.startMysticNameAnimation();
    }

    startMysticNameAnimation() {
        this.stopMysticNameAnimation();

        this.nameAnimationInterval = setInterval(() => {
            const mysticName = this.generateMysticName(6);
            const currentText = this.characterMessage.textContent;

            if (currentText.includes('Mi nombre es')) {
                const beforeName = currentText.split('Mi nombre es')[0];
                const afterName = currentText.split('🐱')[1] || ' 🐱 Haz clic en mí para comenzar esta historia especial...';
                const newText = `${beforeName}Mi nombre es ${mysticName} 🐱${afterName}`;
                this.characterMessage.textContent = newText;
                this.adjustSpeechBubble();
            }
        }, 150);
    }

    stopMysticNameAnimation() {
        if (this.nameAnimationInterval) {
            clearInterval(this.nameAnimationInterval);
            this.nameAnimationInterval = null;
        }
    }

    generateMysticName(length = 8) {
        let name = '';
        for (let i = 0; i < length; i++) {
            name += this.enchantmentChars[Math.floor(Math.random() * this.enchantmentChars.length)];
        }
        return name;
    }

    showRandomMessage() {
        const randomItem = this.randomMessages[Math.floor(Math.random() * this.randomMessages.length)];
        const randomMsg = typeof randomItem === 'function' ? randomItem() : randomItem;
        this.showMessage(randomMsg);
    }

    adjustSpeechBubble() {
        const bubble = this.characterSpeech;
        const message = this.characterMessage.textContent;

        bubble.style.width = 'auto';

        if (message.length > 80) {
            bubble.style.maxWidth = '300px';
        } else if (message.length > 50) {
            bubble.style.maxWidth = '250px';
        } else {
            bubble.style.maxWidth = '200px';
        }

        bubble.style.whiteSpace = 'normal';

        if (window.innerWidth < 768) {
            bubble.style.maxWidth = '200px';
            // En móvil, forzar posición por defecto
            this.applySpeechPositionDefault();
        }
    }

    // Método para obtener información de posicionamiento
    getSpeechPositionInfo() {
        const lottieRect = this.lottiePlayer.getBoundingClientRect();
        const speechRect = this.characterSpeech.getBoundingClientRect();
        
        return {
            mode: this.speechPositionMode,
            lottiePosition: lottieRect,
            speechPosition: speechRect,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    // Método para optimizar posición automáticamente
    optimizeSpeechPosition() {
        const oldMode = this.speechPositionMode;
        this.speechPositionMode = 'auto';
        this.updateSpeechPosition();
        
        console.log(`🗨️ Posición optimizada automáticamente de ${oldMode} a auto`);
    }

    cleanup() {
        this.stopMysticNameAnimation();
    }
}