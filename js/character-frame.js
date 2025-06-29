// Gestión del marco de personajes My Little Pony
export class CharacterFrameManager {
    constructor() {
        this.frameElement = null;
        this.characters = [];
        this.isVisible = false;
        this.animationTimeouts = [];
        this.mlpCharacters = {
            'rarity': {
                name: 'Rarity',
                description: 'Elegancia y Generosidad',
                quotes: [
                    '¡Darling, eres absolutamente fabulosa! ✨',
                    'La verdadera belleza viene del corazón 💎',
                    'Siempre mereces lo mejor, querida 👑',
                    'Eres una gema preciosa 💍'
                ],
                specialEffect: 'diamonds'
            },
            'twilight': {
                name: 'Twilight Sparkle',
                description: 'Magia y Amistad',
                quotes: [
                    'La amistad es la magia más poderosa ⭐',
                    'Siempre hay algo nuevo que aprender 📚',
                    'Juntas podemos superar cualquier cosa ✨'
                ],
                specialEffect: 'stars'
            },
            'fluttershy': {
                name: 'Fluttershy',
                description: 'Bondad y Naturaleza',
                quotes: [
                    'Eres muy especial... si no te molesta que lo diga 🦋',
                    'La bondad siempre encuentra su camino 🌸',
                    'Cuidar de otros es cuidar de nosotros mismos 🌿'
                ],
                specialEffect: 'butterflies'
            },
            'rainbow': {
                name: 'Rainbow Dash',
                description: 'Lealtad y Velocidad',
                quotes: [
                    '¡Eres 20% más genial! 🌈',
                    'La lealtad nunca pasa de moda ⚡',
                    '¡Vamos a hacer esto increíble! 🏆'
                ],
                specialEffect: 'rainbow'
            },
            'pinkie': {
                name: 'Pinkie Pie',
                description: 'Risa y Diversión',
                quotes: [
                    '¡Una sonrisa puede cambiar el mundo! 🎉',
                    'La vida es una fiesta, ¡celebrémosla! 🎈',
                    '¡Ooh, ooh! ¡Hagamos algo divertido! 🎊'
                ],
                specialEffect: 'confetti'
            },
            'applejack': {
                name: 'Applejack',
                description: 'Honestidad y Trabajo',
                quotes: [
                    'La honestidad es el mejor camino, sugar 🍎',
                    'El trabajo duro siempre da frutos 🌾',
                    'Eres más fuerte de lo que crees 💪'
                ],
                specialEffect: 'apples'
            }
        };
    }

    init() {
        this.frameElement = document.getElementById('characterFrame');
        if (!this.frameElement) {
            console.warn('Character frame element no encontrado');
            return;
        }

        this.characters = this.frameElement.querySelectorAll('[data-character]');
        this.setupInteractions();
        this.startAnimations();
        this.setupRaritySpecialEffects();
    }

    setupInteractions() {
        this.characters.forEach((character, index) => {
            const characterId = character.getAttribute('data-character');
            const characterData = this.mlpCharacters[characterId];

            // Hover effects con información del personaje
            character.addEventListener('mouseenter', () => {
                this.showCharacterInfo(character, characterData, index);
            });

            character.addEventListener('mouseleave', () => {
                this.hideCharacterInfo();
            });

            // Click para efectos especiales
            character.addEventListener('click', () => {
                this.triggerCharacterEffect(character, characterData, index);
            });
        });
    }

    setupRaritySpecialEffects() {
        // Efectos especiales continuos para Rarity
        const rarityElement = document.querySelector('[data-character="rarity"]');
        if (rarityElement) {
            setInterval(() => {
                this.createRaritySparkles(rarityElement);
            }, 3000);
        }
    }

    createRaritySparkles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '💎';
                sparkle.style.position = 'fixed';
                sparkle.style.left = centerX + 'px';
                sparkle.style.top = centerY + 'px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.fontSize = '16px';
                sparkle.style.zIndex = '1000';
                sparkle.style.animation = 'raritySparkle 2s ease-out forwards';
                sparkle.style.textShadow = '0 0 15px rgba(218, 112, 214, 0.8)';

                // Dirección aleatoria
                const angle = (Math.random() * 360) * Math.PI / 180;
                const distance = 30 + Math.random() * 40;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;

                document.body.appendChild(sparkle);

                setTimeout(() => {
                    sparkle.style.left = endX + 'px';
                    sparkle.style.top = endY + 'px';
                    sparkle.style.opacity = '0';
                    sparkle.style.transform = 'scale(1.5) rotate(360deg)';
                }, 100);

                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.remove();
                    }
                }, 2000);
            }, i * 200);
        }
    }

    showCharacterInfo(character, characterData, index) {
        if (!characterData) return;

        // Crear tooltip con información del personaje MLP
        const tooltip = document.createElement('div');
        tooltip.className = 'character-tooltip mlp-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <span class="character-name">${characterData.name}</span>
                <span class="character-description">${characterData.description}</span>
                <span class="character-hint">¡Haz clic para una sorpresa!</span>
            </div>
        `;

        // Posicionar tooltip
        const rect = character.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 80 + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '1000';
        tooltip.style.background = 'linear-gradient(45deg, #9370DB, #DA70D6)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '12px 16px';
        tooltip.style.borderRadius = '15px';
        tooltip.style.fontSize = '12px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        tooltip.style.boxShadow = '0 8px 25px rgba(147, 112, 219, 0.4)';
        tooltip.style.border = '2px solid rgba(255, 255, 255, 0.8)';

        document.body.appendChild(tooltip);

        // Mostrar con animación
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
        });

        // Guardar referencia para limpieza
        character._tooltip = tooltip;
    }

    hideCharacterInfo() {
        // Limpiar todos los tooltips
        document.querySelectorAll('.character-tooltip').forEach(tooltip => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateX(-50%) translateY(5px)';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 300);
        });
    }

    triggerCharacterEffect(character, characterData, index) {
        if (!characterData) return;

        // Efecto de pulso específico del personaje
        character.style.transform = 'scale(1.3) rotate(10deg)';
        character.style.boxShadow = '0 20px 50px rgba(147, 112, 219, 0.8)';
        
        setTimeout(() => {
            character.style.transform = '';
            character.style.boxShadow = '';
        }, 400);

        // Mostrar quote del personaje
        this.showCharacterQuote(characterData);

        // Crear efectos especiales según el personaje
        this.createSpecialEffect(character, characterData.specialEffect);

        // Efecto de brillo
        this.addGlowEffect(character);
    }

    showCharacterQuote(characterData) {
        const quote = characterData.quotes[Math.floor(Math.random() * characterData.quotes.length)];
        
        // Crear elemento de quote
        const quoteElement = document.createElement('div');
        quoteElement.className = 'character-quote';
        quoteElement.innerHTML = `
            <div class="quote-content">
                <p>"${quote}"</p>
                <span class="quote-author">- ${characterData.name}</span>
            </div>
        `;

        // Estilos del quote
        quoteElement.style.position = 'fixed';
        quoteElement.style.top = '50%';
        quoteElement.style.left = '50%';
        quoteElement.style.transform = 'translate(-50%, -50%)';
        quoteElement.style.background = 'rgba(255, 255, 255, 0.95)';
        quoteElement.style.padding = '20px 30px';
        quoteElement.style.borderRadius = '20px';
        quoteElement.style.boxShadow = '0 15px 40px rgba(147, 112, 219, 0.3)';
        quoteElement.style.border = '3px solid #DA70D6';
        quoteElement.style.zIndex = '2000';
        quoteElement.style.textAlign = 'center';
        quoteElement.style.maxWidth = '400px';
        quoteElement.style.opacity = '0';
        quoteElement.style.animation = 'quoteAppear 3s ease-out forwards';

        document.body.appendChild(quoteElement);

        setTimeout(() => {
            if (quoteElement.parentNode) {
                quoteElement.remove();
            }
        }, 3000);
    }

    createSpecialEffect(character, effectType) {
        const rect = character.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        switch (effectType) {
            case 'diamonds':
                this.createDiamondEffect(centerX, centerY);
                break;
            case 'stars':
                this.createStarEffect(centerX, centerY);
                break;
            case 'butterflies':
                this.createButterflyEffect(centerX, centerY);
                break;
            case 'rainbow':
                this.createRainbowEffect(centerX, centerY);
                break;
            case 'confetti':
                this.createConfettiEffect(centerX, centerY);
                break;
            case 'apples':
                this.createAppleEffect(centerX, centerY);
                break;
            default:
                this.createHeartsFromCharacter(character);
        }
    }

    createDiamondEffect(centerX, centerY) {
        const diamonds = ['💎', '💍', '✨', '⭐'];
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const diamond = document.createElement('div');
                diamond.innerHTML = diamonds[Math.floor(Math.random() * diamonds.length)];
                diamond.style.position = 'fixed';
                diamond.style.left = centerX + 'px';
                diamond.style.top = centerY + 'px';
                diamond.style.pointerEvents = 'none';
                diamond.style.fontSize = '24px';
                diamond.style.zIndex = '1000';
                diamond.style.animation = 'diamondBurst 2.5s ease-out forwards';
                diamond.style.textShadow = '0 0 15px rgba(218, 112, 214, 0.8)';

                const angle = (i * 45) * Math.PI / 180;
                const distance = 60 + Math.random() * 40;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;

                document.body.appendChild(diamond);

                setTimeout(() => {
                    diamond.style.left = endX + 'px';
                    diamond.style.top = endY + 'px';
                    diamond.style.opacity = '0';
                    diamond.style.transform = 'scale(2) rotate(720deg)';
                }, 100);

                setTimeout(() => {
                    if (diamond.parentNode) {
                        diamond.remove();
                    }
                }, 2500);
            }, i * 100);
        }
    }

    createStarEffect(centerX, centerY) {
        const stars = ['⭐', '✨', '🌟', '💫'];
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.innerHTML = stars[Math.floor(Math.random() * stars.length)];
                star.style.position = 'fixed';
                star.style.left = centerX + 'px';
                star.style.top = centerY + 'px';
                star.style.pointerEvents = 'none';
                star.style.fontSize = '20px';
                star.style.zIndex = '1000';
                star.style.animation = 'starBurst 2s ease-out forwards';

                const angle = (Math.random() * 360) * Math.PI / 180;
                const distance = 50 + Math.random() * 50;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;

                document.body.appendChild(star);

                setTimeout(() => {
                    star.style.left = endX + 'px';
                    star.style.top = endY + 'px';
                    star.style.opacity = '0';
                    star.style.transform = 'scale(1.5)';
                }, 100);

                setTimeout(() => {
                    if (star.parentNode) {
                        star.remove();
                    }
                }, 2000);
            }, i * 150);
        }
    }

    createButterflyEffect(centerX, centerY) {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const butterfly = document.createElement('div');
                butterfly.innerHTML = '🦋';
                butterfly.style.position = 'fixed';
                butterfly.style.left = centerX + 'px';
                butterfly.style.top = centerY + 'px';
                butterfly.style.pointerEvents = 'none';
                butterfly.style.fontSize = '18px';
                butterfly.style.zIndex = '1000';
                butterfly.style.animation = 'butterflyFly 3s ease-out forwards';

                document.body.appendChild(butterfly);

                setTimeout(() => {
                    if (butterfly.parentNode) {
                        butterfly.remove();
                    }
                }, 3000);
            }, i * 200);
        }
    }

    createRainbowEffect(centerX, centerY) {
        const rainbow = document.createElement('div');
        rainbow.innerHTML = '🌈';
        rainbow.style.position = 'fixed';
        rainbow.style.left = centerX + 'px';
        rainbow.style.top = centerY + 'px';
        rainbow.style.pointerEvents = 'none';
        rainbow.style.fontSize = '40px';
        rainbow.style.zIndex = '1000';
        rainbow.style.animation = 'rainbowGlow 2s ease-out forwards';
        rainbow.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(rainbow);

        setTimeout(() => {
            if (rainbow.parentNode) {
                rainbow.remove();
            }
        }, 2000);
    }

    createConfettiEffect(centerX, centerY) {
        const confetti = ['🎉', '🎊', '🎈', '🎁'];
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const piece = document.createElement('div');
                piece.innerHTML = confetti[Math.floor(Math.random() * confetti.length)];
                piece.style.position = 'fixed';
                piece.style.left = centerX + 'px';
                piece.style.top = centerY + 'px';
                piece.style.pointerEvents = 'none';
                piece.style.fontSize = '16px';
                piece.style.zIndex = '1000';
                piece.style.animation = 'confettiFall 2s ease-out forwards';

                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = Math.random() * 100 + 50;

                document.body.appendChild(piece);

                setTimeout(() => {
                    piece.style.left = (centerX + offsetX) + 'px';
                    piece.style.top = (centerY + offsetY) + 'px';
                    piece.style.opacity = '0';
                    piece.style.transform = 'rotate(360deg)';
                }, 100);

                setTimeout(() => {
                    if (piece.parentNode) {
                        piece.remove();
                    }
                }, 2000);
            }, i * 50);
        }
    }

    createAppleEffect(centerX, centerY) {
        const apples = ['🍎', '🍏', '🌾'];
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const apple = document.createElement('div');
                apple.innerHTML = apples[Math.floor(Math.random() * apples.length)];
                apple.style.position = 'fixed';
                apple.style.left = centerX + 'px';
                apple.style.top = centerY + 'px';
                apple.style.pointerEvents = 'none';
                apple.style.fontSize = '20px';
                apple.style.zIndex = '1000';
                apple.style.animation = 'appleBounce 2s ease-out forwards';

                const angle = (Math.random() * 360) * Math.PI / 180;
                const distance = 40 + Math.random() * 30;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;

                document.body.appendChild(apple);

                setTimeout(() => {
                    apple.style.left = endX + 'px';
                    apple.style.top = endY + 'px';
                    apple.style.opacity = '0';
                }, 100);

                setTimeout(() => {
                    if (apple.parentNode) {
                        apple.remove();
                    }
                }, 2000);
            }, i * 150);
        }
    }

    createHeartsFromCharacter(character) {
        const rect = character.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💕';
                heart.style.position = 'fixed';
                heart.style.left = centerX + 'px';
                heart.style.top = centerY + 'px';
                heart.style.pointerEvents = 'none';
                heart.style.fontSize = '20px';
                heart.style.zIndex = '1000';
                heart.style.animation = 'heartBurst 2s ease-out forwards';

                const angle = (Math.random() * 360) * Math.PI / 180;
                const distance = 50 + Math.random() * 50;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;

                document.body.appendChild(heart);

                setTimeout(() => {
                    heart.style.left = endX + 'px';
                    heart.style.top = endY + 'px';
                    heart.style.opacity = '0';
                    heart.style.transform = 'scale(1.5)';
                }, 100);

                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                }, 2000);
            }, i * 100);
        }
    }

    addGlowEffect(character) {
        character.style.filter = 'brightness(1.4) saturate(1.5)';
        setTimeout(() => {
            character.style.filter = '';
        }, 600);
    }

    startAnimations() {
        // Animación de entrada escalonada
        this.characters.forEach((character, index) => {
            const timeout = setTimeout(() => {
                character.style.opacity = '1';
                character.style.transform = 'translateY(0) scale(1)';
            }, index * 200);
            
            this.animationTimeouts.push(timeout);
        });

        // Animación de flotación continua
        this.startFloatingAnimation();
    }

    startFloatingAnimation() {
        const floatInterval = setInterval(() => {
            this.characters.forEach((character, index) => {
                if (Math.random() < 0.3) {
                    const currentTransform = character.style.transform || '';
                    const randomY = (Math.random() - 0.5) * 12;
                    const randomRotate = (Math.random() - 0.5) * 6;
                    
                    character.style.transform = `translateY(${randomY}px) rotate(${randomRotate}deg)`;
                    
                    setTimeout(() => {
                        character.style.transform = currentTransform;
                    }, 2000);
                }
            });
        }, 4000);

        this.animationTimeouts.push(floatInterval);
    }

    show() {
        if (this.frameElement && !this.isVisible) {
            this.frameElement.style.opacity = '1';
            this.isVisible = true;
        }
    }

    hide() {
        if (this.frameElement && this.isVisible) {
            this.frameElement.style.opacity = '0';
            this.isVisible = false;
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    updateCharacterImages(imageUrls) {
        if (!Array.isArray(imageUrls)) return;

        this.characters.forEach((character, index) => {
            if (imageUrls[index]) {
                const img = character.querySelector('img');
                if (img) {
                    img.src = imageUrls[index];
                    img.alt = `Personaje ${index + 1}`;
                }
            }
        });
    }

    setCharacterNames(names) {
        if (!Array.isArray(names)) return;

        this.characters.forEach((character, index) => {
            if (names[index]) {
                character.setAttribute('data-name', names[index]);
            }
        });
    }

    cleanup() {
        // Limpiar timeouts y intervals
        this.animationTimeouts.forEach(timeout => {
            clearTimeout(timeout);
            clearInterval(timeout);
        });
        this.animationTimeouts = [];

        // Limpiar tooltips
        this.hideCharacterInfo();

        // Remover event listeners
        this.characters.forEach(character => {
            character.replaceWith(character.cloneNode(true));
        });
    }
}

// Estilos adicionales para efectos MLP
const frameStyles = document.createElement('style');
frameStyles.textContent = `
    @keyframes heartBurst {
        0% {
            opacity: 1;
            transform: scale(0.5);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
        100% {
            opacity: 0;
            transform: scale(1.5);
        }
    }

    @keyframes raritySparkle {
        0% {
            opacity: 1;
            transform: scale(0.5) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(1.5) rotate(360deg);
        }
    }

    @keyframes diamondBurst {
        0% {
            opacity: 1;
            transform: scale(0.3) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.5) rotate(360deg);
        }
        100% {
            opacity: 0;
            transform: scale(2) rotate(720deg);
        }
    }

    @keyframes starBurst {
        0% {
            opacity: 1;
            transform: scale(0.5);
        }
        100% {
            opacity: 0;
            transform: scale(1.5);
        }
    }

    @keyframes butterflyFly {
        0% {
            opacity: 1;
            transform: translate(0, 0);
        }
        25% {
            transform: translate(20px, -30px);
        }
        50% {
            transform: translate(-15px, -60px);
        }
        75% {
            transform: translate(25px, -90px);
        }
        100% {
            opacity: 0;
            transform: translate(-10px, -120px);
        }
    }

    @keyframes rainbowGlow {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
        }
    }

    @keyframes confettiFall {
        0% {
            opacity: 1;
            transform: rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: rotate(360deg);
        }
    }

    @keyframes appleBounce {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            opacity: 0;
            transform: scale(1);
        }
    }

    @keyframes quoteAppear {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
        }
        80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }

    .character-tooltip.mlp-tooltip {
        pointer-events: none;
        font-family: 'Poppins', sans-serif;
    }

    .tooltip-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .character-name {
        font-weight: 700;
        font-size: 14px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    }

    .character-description {
        font-size: 11px;
        opacity: 0.9;
        font-style: italic;
    }

    .character-hint {
        font-size: 10px;
        opacity: 0.8;
        margin-top: 2px;
        color: rgba(255,255,255,0.9);
    }

    .character-quote {
        font-family: 'Poppins', sans-serif;
    }

    .quote-content p {
        font-size: 16px;
        color: #9370DB;
        margin-bottom: 10px;
        font-style: italic;
        line-height: 1.4;
    }

    .quote-author {
        font-size: 12px;
        color: #DA70D6;
        font-weight: 600;
    }

    /* Efectos especiales para personajes */
    .character-corner.special-effect,
    .character-item.special-effect {
        animation: specialGlow 1s ease-in-out;
    }

    @keyframes specialGlow {
        0%, 100% {
            box-shadow: 0 8px 25px rgba(147, 112, 219, 0.4);
        }
        50% {
            box-shadow: 0 15px 40px rgba(147, 112, 219, 0.8), 
                        0 0 30px rgba(218, 112, 214, 0.6);
        }
    }
`;

document.head.appendChild(frameStyles);