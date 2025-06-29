// Gestión del personaje y animaciones místicas
export class CharacterManager {
    constructor() {
        this.lottiePlayer = null;
        this.characterSpeech = null;
        this.characterMessage = null;
        this.nameAnimationInterval = null;
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
            bubble.style.right = '-10px';
        }
    }

    cleanup() {
        this.stopMysticNameAnimation();
    }
}