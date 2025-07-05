// Gestión del marco de personajes adaptativo con sistema de aleatorización completa
export class CharacterFrameManager {
    constructor() {
        this.frameElement = null;
        this.characters = [];
        this.isVisible = false;
        this.animationTimeouts = [];
        this.characterNames = [
            'Personaje 1', 'Personaje 2', 'Personaje 3',
            'Personaje 4', 'Personaje 5', 'Personaje 6',
            'Personaje 7', 'Personaje 8', 'Personaje 9',
            'Personaje 10', 'Personaje 11', 'Personaje 12',
            'Personaje 13', 'Personaje 14', 'Personaje 15',
            'Personaje 16', 'Personaje 17', 'Personaje 18',
            'Personaje 19', 'Personaje 20', 'Personaje 21',
            'Personaje 22', 'Personaje 23', 'Personaje 24',
            'Personaje 25', 'Personaje 26', 'Personaje 27',
        ];
        
        // Lista completa de todas las imágenes disponibles - ACTUALIZADA
        this.allAvailableImages = [
            '1.png', '2.png', '3.png',
            '4.png', '5.png', '6.png',
            '7.png', '8.png', '9.png',
            '10.png', '11.png', '12.png',
            '13.png', '14.png', '15.png',
            '16.png', '17.png', '18.png',
            '19.png', '20.png', '21.png',
            '22.png', '23.png', '24.png',
            '25.png', '26.png', '27.png',
        ];
        this.detectedImages = [];
        this.randomizedImages = [];
        this.frameLayout = null;
        this.currentViewport = this.getViewportSize();
    }

    async init() {
        this.frameElement = document.getElementById('characterFrame');
        if (!this.frameElement) {
            console.warn('Character frame element no encontrado');
            return;
        }

        // Detectar imágenes disponibles
        await this.detectAvailableImages();
        
        // Aleatorizar las imágenes detectadas
        this.randomizeImages();
        
        // Generar layout adaptativo según viewport
        this.generateResponsiveLayout();
        
        // Crear el collage dinámicamente con imágenes aleatorias
        this.createAdaptiveCollage();
        
        this.setupInteractions();
        this.startAnimations();
        this.setupResizeListener();
        
        console.log(`🎭 Collage aleatorio creado con ${this.randomizedImages.length} imágenes para viewport ${this.currentViewport}`);
        console.log(`🎲 Orden aleatorio aplicado:`, this.randomizedImages.slice(0, 10).map(img => img.split('(')[1]?.split(')')[0] || img));
    }

    async detectAvailableImages() {
        console.log('🔍 Detectando todas las imágenes disponibles...');
        this.detectedImages = [];
        
        // Intentar detectar todas las imágenes de la lista
        for (const imageName of this.allAvailableImages) {
            try {
                const response = await fetch(`assets/characters/${imageName}`, { method: 'HEAD' });
                if (response.ok) {
                    this.detectedImages.push(imageName);
                    console.log(`✅ Imagen encontrada: ${imageName}`);
                }
            } catch (error) {
                console.log(`⚠️ Imagen no encontrada: ${imageName}`);
            }
        }              
        console.log(`📊 Total de imágenes detectadas: ${this.detectedImages.length}`);
    }

    // NUEVO: Sistema de aleatorización completa
    randomizeImages() {
        console.log('🎲 Aleatorizando orden de las imágenes...');
        
        // Crear una copia del array para no modificar el original
        this.randomizedImages = [...this.detectedImages];
        
        // Algoritmo Fisher-Yates para aleatorización perfecta
        for (let i = this.randomizedImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.randomizedImages[i], this.randomizedImages[j]] = [this.randomizedImages[j], this.randomizedImages[i]];
        }
        
        console.log(`🔀 Imágenes aleatorizadas: ${this.randomizedImages.length} elementos mezclados`);
        
        // Mostrar las primeras 5 para debug
        const preview = this.randomizedImages.slice(0, 5).map(img => {
            const match = img.match(/\((\d+)\)/);
            return match ? `#${match[1]}` : img;
        });
        console.log(`🎯 Primeras 5 imágenes aleatorias: ${preview.join(', ')}`);
    }

    // NUEVO: Método para re-aleatorizar sin recargar
    reshuffleImages() {
        console.log('🔄 Re-aleatorizando imágenes...');
        this.randomizeImages();
        this.createAdaptiveCollage();
        this.setupInteractions();
        this.startAnimations();
        
        // Mostrar notificación
        this.showShuffleNotification();
    }

    showShuffleNotification() {
        const notification = document.createElement('div');
        notification.textContent = '🎲 ¡Imágenes mezcladas aleatoriamente!';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = 'rgba(102, 126, 234, 0.95)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '25px';
        notification.style.fontSize = '14px';
        notification.style.fontWeight = '600';
        notification.style.zIndex = '2000';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(10px)';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    getViewportSize() {
        const width = window.innerWidth;
        if (width <= 480) return 'mobile';
        if (width <= 768) return 'tablet';
        if (width <= 1024) return 'laptop';
        return 'desktop';
    }

    generateResponsiveLayout() {
        const viewport = this.getViewportSize();
        const imageCount = this.randomizedImages.length; // Usar imágenes aleatorizadas
        
        console.log(`🎨 Generando layout para ${imageCount} imágenes aleatorias en viewport ${viewport}`);
        
        // Layouts adaptativos según dispositivo y cantidad de imágenes
        const responsiveLayouts = {
            mobile: {
                maxImages: Math.min(imageCount, 12),
                distribution: this.calculateMobileLayout(Math.min(imageCount, 12))
            },
            tablet: {
                maxImages: Math.min(imageCount, 16),
                distribution: this.calculateTabletLayout(Math.min(imageCount, 16))
            },
            laptop: {
                maxImages: Math.min(imageCount, 20),
                distribution: this.calculateLaptopLayout(Math.min(imageCount, 20))
            },
            desktop: {
                maxImages: imageCount,
                distribution: this.calculateDesktopLayout(imageCount)
            }
        };

        this.frameLayout = responsiveLayouts[viewport];
        this.currentViewport = viewport;
        
        console.log('📐 Layout responsivo calculado:', this.frameLayout);
    }

    calculateMobileLayout(count) {
        // En móvil: priorizar esquinas y pocos laterales
        if (count <= 4) return { corners: count, sides: 0, topBottom: 0 };
        if (count <= 8) return { corners: 4, sides: count - 4, topBottom: 0 };
        return { corners: 4, sides: 4, topBottom: count - 8 };
    }

    calculateTabletLayout(count) {
        // En tablet: distribución equilibrada
        if (count <= 4) return { corners: count, sides: 0, topBottom: 0 };
        if (count <= 10) return { corners: 4, sides: count - 4, topBottom: 0 };
        return { corners: 4, sides: 6, topBottom: count - 10 };
    }

    calculateLaptopLayout(count) {
        // En laptop: más densidad
        if (count <= 4) return { corners: 4, sides: 0, topBottom: 0 };
        if (count <= 12) return { corners: 4, sides: count - 4, topBottom: 0 };
        return { corners: 4, sides: 8, topBottom: count - 12 };
    }

    calculateDesktopLayout(count) {
        // En desktop: usar todas las imágenes disponibles
        if (count <= 4) return { corners: count, sides: 0, topBottom: 0 };
        if (count <= 12) return { corners: 4, sides: count - 4, topBottom: 0 };
        
        const remaining = count - 4;
        const sidesCount = Math.min(remaining, Math.ceil(remaining * 0.6));
        const topBottomCount = remaining - sidesCount;
        
        return { corners: 4, sides: sidesCount, topBottom: topBottomCount };
    }

    createAdaptiveCollage() {
        // Limpiar collage existente
        this.frameElement.innerHTML = '';
        
        let imageIndex = 0;
        const layout = this.frameLayout.distribution;
        const maxImages = this.frameLayout.maxImages;
        
        // Crear esquinas
        if (layout.corners > 0) {
            imageIndex = this.createCorners(imageIndex, Math.min(layout.corners, 4));
        }
        
        // Crear lados
        if (layout.sides > 0 && imageIndex < maxImages) {
            imageIndex = this.createSides(imageIndex, layout.sides, maxImages);
        }
        
        // Crear superior e inferior
        if (layout.topBottom > 0 && imageIndex < maxImages) {
            this.createTopBottom(imageIndex, layout.topBottom, maxImages);
        }
        
        // Aplicar clase de densidad según viewport
        this.frameElement.setAttribute('data-viewport', this.currentViewport);
        this.frameElement.setAttribute('data-image-count', maxImages);
        
        // Actualizar referencias
        this.characters = this.frameElement.querySelectorAll('[data-character]');
        console.log(`🎭 Collage aleatorio creado con ${this.characters.length} elementos para ${this.currentViewport}`);
    }

    createCorners(startIndex, cornerCount) {
        const positions = [
            { class: 'character-corner top-left', position: 'top-left' },
            { class: 'character-corner top-right', position: 'top-right' },
            { class: 'character-corner bottom-left', position: 'bottom-left' },
            { class: 'character-corner bottom-right', position: 'bottom-right' }
        ];

        for (let i = 0; i < cornerCount && i < positions.length; i++) {
            if (startIndex + i < this.randomizedImages.length) {
                const element = this.createImageElement(
                    positions[i].class,
                    startIndex + i + 1,
                    this.getRandomImageSrc(startIndex + i), // Usar imagen aleatoria
                    positions[i].position
                );
                this.frameElement.appendChild(element);
            }
        }
        
        return startIndex + cornerCount;
    }

    createSides(startIndex, sideCount, maxImages) {
        const leftCount = Math.ceil(sideCount / 2);
        const rightCount = sideCount - leftCount;
        let currentIndex = startIndex;
        
        // Lado izquierdo
        if (leftCount > 0) {
            const leftSide = document.createElement('div');
            leftSide.className = `character-side left-side ${this.currentViewport}-layout`;
            
            for (let i = 0; i < leftCount && currentIndex < maxImages && currentIndex < this.randomizedImages.length; i++) {
                const item = this.createImageElement(
                    'character-item',
                    currentIndex + 1,
                    this.getRandomImageSrc(currentIndex), // Usar imagen aleatoria
                    'left-side'
                );
                leftSide.appendChild(item);
                currentIndex++;
            }
            this.frameElement.appendChild(leftSide);
        }
        
        // Lado derecho
        if (rightCount > 0) {
            const rightSide = document.createElement('div');
            rightSide.className = `character-side right-side ${this.currentViewport}-layout`;
            
            for (let i = 0; i < rightCount && currentIndex < maxImages && currentIndex < this.randomizedImages.length; i++) {
                const item = this.createImageElement(
                    'character-item',
                    currentIndex + 1,
                    this.getRandomImageSrc(currentIndex), // Usar imagen aleatoria
                    'right-side'
                );
                rightSide.appendChild(item);
                currentIndex++;
            }
            this.frameElement.appendChild(rightSide);
        }
        
        return currentIndex;
    }

    createTopBottom(startIndex, topBottomCount, maxImages) {
        const topCount = Math.ceil(topBottomCount / 2);
        const bottomCount = topBottomCount - topCount;
        let currentIndex = startIndex;
        
        // Parte superior
        if (topCount > 0) {
            const topSide = document.createElement('div');
            topSide.className = `character-side top-side ${this.currentViewport}-layout`;
            
            for (let i = 0; i < topCount && currentIndex < maxImages && currentIndex < this.randomizedImages.length; i++) {
                const item = this.createImageElement(
                    'character-item',
                    currentIndex + 1,
                    this.getRandomImageSrc(currentIndex), // Usar imagen aleatoria
                    'top-side'
                );
                topSide.appendChild(item);
                currentIndex++;
            }
            this.frameElement.appendChild(topSide);
        }
        
        // Parte inferior
        if (bottomCount > 0) {
            const bottomSide = document.createElement('div');
            bottomSide.className = `character-side bottom-side ${this.currentViewport}-layout`;
            
            for (let i = 0; i < bottomCount && currentIndex < maxImages && currentIndex < this.randomizedImages.length; i++) {
                const item = this.createImageElement(
                    'character-item',
                    currentIndex + 1,
                    this.getRandomImageSrc(currentIndex), // Usar imagen aleatoria
                    'bottom-side'
                );
                bottomSide.appendChild(item);
                currentIndex++;
            }
            this.frameElement.appendChild(bottomSide);
        }
    }

    createImageElement(className, characterNumber, imageSrc, position) {
        const element = document.createElement('div');
        element.className = className;
        element.setAttribute('data-character', characterNumber);
        element.setAttribute('data-position', position);
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = this.characterNames[characterNumber - 1] || `Personaje ${characterNumber}`;
        img.loading = 'lazy';
        
        // Fallback para imágenes locales
        if (imageSrc.startsWith('assets/')) {
            img.onerror = () => {
                const fallbackIndex = (characterNumber - 1) % 24;
                const pexelsIds = [1040881, 1239291, 1181686, 1181690, 1040880, 1239288, 
                                  1181681, 1181687, 1040882, 1239289, 1181683, 1181688,
                                  1040883, 1239290, 1181684, 1181689, 1040884, 1239292,
                                  1040885, 1239293, 1181685, 1181691, 1040886, 1239294];
                const id = pexelsIds[fallbackIndex];
                img.src = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`;
            };
        }
        
        element.appendChild(img);
        return element;
    }

    // NUEVO: Obtener imagen aleatoria por índice
    getRandomImageSrc(index) {
        if (index < this.randomizedImages.length) {
            const imageName = this.randomizedImages[index];
            return imageName.startsWith('http') ? imageName : `assets/characters/${imageName}`;
        }
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newViewport = this.getViewportSize();
                if (newViewport !== this.currentViewport) {
                    console.log(`📱 Viewport cambió de ${this.currentViewport} a ${newViewport}`);
                    this.generateResponsiveLayout();
                    this.createAdaptiveCollage();
                    this.setupInteractions();
                    this.startAnimations();
                }
            }, 300);
        });
    }

    setupInteractions() {
        this.characters.forEach((character, index) => {
            character.addEventListener('mouseenter', () => {
                this.showCharacterInfo(character, index);
            });

            character.addEventListener('mouseleave', () => {
                this.hideCharacterInfo();
            });

            character.addEventListener('click', () => {
                this.triggerCharacterEffect(character, index);
            });
        });
    }

    showCharacterInfo(character, index) {
        const tooltip = document.createElement('div');
        tooltip.className = 'character-tooltip';
        
        // Obtener número de imagen actual
        const currentImageSrc = character.querySelector('img').src;
        const imageNumber = this.getImageNumberFromSrc(currentImageSrc);
        
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <span class="character-name">${this.characterNames[index]}</span>
                <span class="character-description">Imagen ${imageNumber} • Posición ${index + 1} de ${this.frameLayout.maxImages} • ${this.currentViewport} ✨</span>
            </div>
        `;

        const rect = character.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 70 + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '1000';
        tooltip.style.background = 'rgba(0,0,0,0.85)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '10px 14px';
        tooltip.style.borderRadius = '12px';
        tooltip.style.fontSize = '12px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s ease';
        tooltip.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';

        document.body.appendChild(tooltip);

        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });

        character._tooltip = tooltip;
    }

    getImageNumberFromSrc(src) {
        const match = src.match(/pngwing\.com \((\d+)\)\.png/);
        return match ? `#${match[1]}` : 'N/A';
    }

    hideCharacterInfo() {
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
        character.style.transform = 'scale(1.15) rotate(3deg)';
        character.style.filter = 'brightness(1.2) saturate(1.3)';
        
        setTimeout(() => {
            character.style.transform = '';
            character.style.filter = '';
        }, 300);

        this.createHeartsFromCharacter(character);
        this.showCharacterMessage(index);
    }

    showCharacterMessage(index) {
        const currentImageSrc = this.characters[index]?.querySelector('img')?.src;
        const imageNumber = this.getImageNumberFromSrc(currentImageSrc);
        
        const messages = [
            `¡${this.characterNames[index]} (${imageNumber}) te envía amor! 💕`,
            `${this.characterNames[index]} está aquí contigo ✨`,
            `¡Un abrazo virtual de ${this.characterNames[index]}! 🤗`,
            `${this.characterNames[index]} te desea lo mejor 🌟`,
            `¡${this.characterNames[index]} cree en ti! 💪`,
            `🎲 ¡Imagen aleatoria ${imageNumber} activada! ✨`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const messageDiv = document.createElement('div');
        messageDiv.textContent = randomMessage;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.background = 'rgba(255, 255, 255, 0.95)';
        messageDiv.style.padding = '12px 20px';
        messageDiv.style.borderRadius = '25px';
        messageDiv.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        messageDiv.style.zIndex = '1001';
        messageDiv.style.fontSize = '14px';
        messageDiv.style.color = '#667eea';
        messageDiv.style.fontWeight = '600';
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'all 0.3s ease';

        document.body.appendChild(messageDiv);

        requestAnimationFrame(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateX(-50%) translateY(10px)';
        });

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }, 3000);
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
                heart.style.fontSize = '18px';
                heart.style.zIndex = '1000';
                heart.style.animation = 'heartBurst 2s ease-out forwards';

                const angle = (Math.random() * 360) * Math.PI / 180;
                const distance = 40 + Math.random() * 40;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;

                document.body.appendChild(heart);

                setTimeout(() => {
                    heart.style.left = endX + 'px';
                    heart.style.top = endY + 'px';
                    heart.style.opacity = '0';
                    heart.style.transform = 'scale(1.3)';
                }, 100);

                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                }, 2000);
            }, i * 100);
        }
    }

    startAnimations() {
        this.characters.forEach((character, index) => {
            const timeout = setTimeout(() => {
                character.style.opacity = '1';
                character.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
            
            this.animationTimeouts.push(timeout);
        });

        this.startFloatingAnimation();
    }

    startFloatingAnimation() {
        const floatInterval = setInterval(() => {
            this.characters.forEach((character, index) => {
                if (Math.random() < 0.25) {
                    const currentTransform = character.style.transform || '';
                    const randomY = (Math.random() - 0.5) * 8;
                    const randomRotate = (Math.random() - 0.5) * 3;
                    
                    character.style.transform = `translateY(${randomY}px) rotate(${randomRotate}deg)`;
                    
                    setTimeout(() => {
                        character.style.transform = currentTransform;
                    }, 1500);
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
        this.detectedImages = imageUrls;
        this.randomizeImages(); // Re-aleatorizar con nuevas imágenes
        this.generateResponsiveLayout();
        this.createAdaptiveCollage();
        this.setupInteractions();
        console.log('✅ Imágenes actualizadas y aleatorizadas');
    }

    setCharacterNames(names) {
        if (!Array.isArray(names)) return;
        this.characterNames = names;
        console.log('✅ Nombres de personajes actualizados:', names);
    }

    async reloadImages() {
        console.log('🔄 Recargando y aleatorizando collage...');
        await this.detectAvailableImages();
        this.randomizeImages(); // Re-aleatorizar después de detectar
        this.generateResponsiveLayout();
        this.createAdaptiveCollage();
        this.setupInteractions();
        this.startAnimations();
        console.log('✅ Collage recargado con nuevo orden aleatorio');
    }

    updateAvailableImages(imageList) {
        this.allAvailableImages = imageList;
        this.reloadImages();
        console.log('✅ Lista de imágenes actualizada y aleatorizada:', imageList);
    }

    // NUEVO: Método público para re-aleatorizar
    shuffleImages() {
        this.reshuffleImages();
    }

    // NUEVO: Obtener estadísticas de aleatorización
    getRandomizationStats() {
        return {
            totalImages: this.detectedImages.length,
            randomizedOrder: this.randomizedImages.slice(0, 10).map(img => {
                const match = img.match(/\((\d+)\)/);
                return match ? `#${match[1]}` : img;
            }),
            currentViewport: this.currentViewport,
            layoutUsed: this.frameLayout
        };
    }

    cleanup() {
        this.animationTimeouts.forEach(timeout => {
            clearTimeout(timeout);
            clearInterval(timeout);
        });
        this.animationTimeouts = [];
        this.hideCharacterInfo();
        
        this.characters.forEach(character => {
            character.replaceWith(character.cloneNode(true));
        });
    }
}

// Estilos adicionales para sistema aleatorio
const randomCollageStyles = document.createElement('style');
randomCollageStyles.textContent = `
    @keyframes heartBurst {
        0% {
            opacity: 1;
            transform: scale(0.5);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
        }
        100% {
            opacity: 0;
            transform: scale(1.4);
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
        gap: 4px;
    }

    .character-name {
        font-weight: 600;
        font-size: 13px;
        color: #fff;
    }

    .character-description {
        font-size: 10px;
        opacity: 0.8;
        color: #ffc0cb;
    }

    /* Efectos especiales para imágenes aleatorias */
    .character-corner.random-highlight,
    .character-item.random-highlight {
        animation: randomGlow 1.5s ease-in-out;
    }

    @keyframes randomGlow {
        0%, 100% {
            filter: brightness(1) saturate(1);
        }
        50% {
            filter: brightness(1.3) saturate(1.4) hue-rotate(30deg);
        }
    }

    /* Indicador de aleatorización */
    .randomization-indicator {
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(102, 126, 234, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 11px;
        z-index: 1000;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }

    .randomization-indicator:hover {
        opacity: 1;
    }
`;

document.head.appendChild(randomCollageStyles);