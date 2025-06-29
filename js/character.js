// Gestión del personaje y animaciones místicas con tema My Little Pony
export class CharacterManager {
    constructor() {
        this.lottiePlayer = null;
        this.characterSpeech = null;
        this.characterMessage = null;
        this.nameAnimationInterval = null;
        this.enchantmentChars = [
            // Runas místicas
            'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ',
            'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ',
            // Símbolos mágicos MLP
            '✨', '⭐', '🌟', '💫', '🔮', '💎', '👑', '🦄', '🌈', '☆', '✦', '✧', '※', '◊', '◈'
        ];
        this.randomMessages = [
            "¡Ronroneo mágico! 😸✨",
            "¿Necesitas un abrazo de la amistad? 🤗💕",
            "Estoy aquí para ti, como una verdadera amiga 💖",
            "¡Miau de apoyo mágico! 🐾⭐",
            "Eres especial, como Rarity siempre dice ✨👑",
            "El amor y la amistad son hermosos 💖🌈",
            "La magia de la amistad te protege 🔮💕",
            () => `¡Soy ${this.generateMysticName(4)}! ✨🦄`,
            () => `Mi verdadero nombre es ${this.generateMysticName(6)} 🔮⭐`,
            () => `${this.generateMysticName(5)} significa 'amigo mágico' en idioma de Equestria 🌟💎`,
            () => `Como dice Twilight: "${this.generateMysticName(4)} es magia pura" ✨📚`,
            () => `Rarity me llamaría ${this.generateMysticName(5)}, ¡qué elegante! 💎👑`
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
        this.lottiePlayer.style.filter = 'brightness(1.2) saturate(1.3)';
        setTimeout(() => {
            this.lottiePlayer.style.transform = 'scale(1)';
            this.lottiePlayer.style.filter = '';
        }, 200);
    }

    handleHover() {
        this.lottiePlayer.style.transform = 'scale(1.05)';
        this.lottiePlayer.style.filter = 'brightness(1.1) saturate(1.2)';
    }

    resetScale() {
        this.lottiePlayer.style.transform = 'scale(1)';
        this.lottiePlayer.style.filter = '';
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
        const baseMessage = "¡Hola! Mi nombre es ᚦᚱᚨᚾᚲ 🐱✨ Haz clic en mí para comenzar esta historia especial llena de magia y amistad...";
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
                const afterName = currentText.split('🐱')[1] || ' 🐱✨ Haz clic en mí para comenzar esta historia especial llena de magia y amistad...';
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