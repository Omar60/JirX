// Gestión del marco de personajes
export class CharacterFrameManager {
    constructor() {
        this.frameElement = null;
        this.characters = [];
        this.isVisible = false;
        this.animationTimeouts = [];
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
    }

    setupInteractions() {
        this.characters.forEach((character, index) => {
            // Hover effects con información del personaje
            character.addEventListener('mouseenter', () => {
                this.showCharacterInfo(character, index);
            });

            character.addEventListener('mouseleave', () => {
                this.hideCharacterInfo();
            });

            // Click para efectos especiales
            character.addEventListener('click', () => {
                this.triggerCharacterEffect(character, index);
            });
        });
    }

    showCharacterInfo(character, index) {
        // Crear tooltip con información del personaje
        const tooltip = document.createElement('div');
        tooltip.className = 'character-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <span class="character-name">Personaje ${index + 1}</span>
                <span class="character-description">Un personaje especial</span>
            </div>
        `;

        // Posicionar tooltip
        const rect = character.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 60 + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '1000';
        tooltip.style.background = 'rgba(0,0,0,0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '8px';
        tooltip.style.fontSize = '12px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(tooltip);

        // Mostrar con animación
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });

        // Guardar referencia para limpieza
        character._tooltip = tooltip;
    }

    hideCharacterInfo() {
        // Limpiar todos los tooltips
        document.querySelectorAll('.character-tooltip').forEach(tooltip => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 300);
        });
    }

    triggerCharacterEffect(character, index) {
        // Efecto de pulso
        character.style.transform = 'scale(1.2) rotate(5deg)';
        character.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.6)';
        
        setTimeout(() => {
            character.style.transform = '';
            character.style.boxShadow = '';
        }, 300);

        // Crear corazones desde el personaje
        this.createHeartsFromCharacter(character);

        // Efecto de brillo
        this.addGlowEffect(character);
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

                // Dirección aleatoria
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
        character.style.filter = 'brightness(1.3) saturate(1.2)';
        setTimeout(() => {
            character.style.filter = '';
        }, 500);
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
                if (Math.random() < 0.3) { // 30% de probabilidad
                    const currentTransform = character.style.transform || '';
                    const randomY = (Math.random() - 0.5) * 10;
                    const randomRotate = (Math.random() - 0.5) * 4;
                    
                    character.style.transform = `translateY(${randomY}px) rotate(${randomRotate}deg)`;
                    
                    setTimeout(() => {
                        character.style.transform = currentTransform;
                    }, 2000);
                }
            });
        }, 3000);

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

// Estilos adicionales para efectos
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

    .character-tooltip {
        pointer-events: none;
        font-family: 'Poppins', sans-serif;
    }

    .tooltip-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
    }

    .character-name {
        font-weight: 600;
        font-size: 13px;
    }

    .character-description {
        font-size: 11px;
        opacity: 0.8;
    }

    /* Efectos especiales para personajes */
    .character-corner.special-effect,
    .character-item.special-effect {
        animation: specialGlow 1s ease-in-out;
    }

    @keyframes specialGlow {
        0%, 100% {
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        50% {
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6), 
                        0 0 20px rgba(255, 107, 107, 0.4);
        }
    }
`;

document.head.appendChild(frameStyles);