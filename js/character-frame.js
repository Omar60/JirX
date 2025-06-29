// Gestión del marco de personajes adaptativo sin bordes
export class CharacterFrameManager {
    constructor() {
        this.frameElement = null;
        this.characters = [];
        this.isVisible = false;
        this.animationTimeouts = [];
        this.characterNames = [
            'Personaje Especial 1', 'Personaje Especial 2', 'Personaje Especial 3',
            'Personaje Especial 4', 'Personaje Especial 5', 'Personaje Especial 6',
            'Personaje Especial 7', 'Personaje Especial 8', 'Personaje Especial 9',
            'Personaje Especial 10', 'Personaje Especial 11', 'Personaje Especial 12',
            'Personaje Especial 13', 'Personaje Especial 14', 'Personaje Especial 15',
            'Personaje Especial 16', 'Personaje Especial 17', 'Personaje Especial 18',
            'Personaje Especial 19', 'Personaje Especial 20', 'Personaje Especial 21',
            'Personaje Especial 22', 'Personaje Especial 23', 'Personaje Especial 24'
        ];
        
        // Detectar imágenes disponibles automáticamente
        this.availableImages = [
            'pngwing.com (12).png', 'pngwing.com (13).png', 'pngwing.com (14).png',
            'pngwing.com (15).png', 'pngwing.com (16).png', 'pngwing.com (17).png',
            'pngwing.com (18).png', 'pngwing.com (19).png', 'pngwing.com (20).png',
            'pngwing.com (21).png', 'pngwing.com (22).png', 'pngwing.com (23).png',
            'pngwing.com (24).png', 'pngwing.com (25).png', 'pngwing.com (26).png',
            'pngwing.com (27).png', 'pngwing.com (28).png', 'pngwing.com (29).png'
        ];
        
        this.detectedImages = [];
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
        
        // Generar layout adaptativo según viewport
        this.generateResponsiveLayout();
        
        // Crear el collage dinámicamente
        this.createAdaptiveCollage();
        
        this.setupInteractions();
        this.startAnimations();
        this.setupResizeListener();
        
        console.log(`🎭 Collage adaptativo creado con ${this.detectedImages.length} imágenes para viewport ${this.currentViewport}`);
    }

    async detectAvailableImages() {
        console.log('🔍 Detectando imágenes disponibles...');
        this.detectedImages = [];
        
        for (const imageName of this.availableImages) {
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
        
        // Si no hay imágenes locales, usar placeholders
        if (this.detectedImages.length === 0) {
            console.log('📸 Usando imágenes placeholder de Pexels');
            this.detectedImages = this.generatePlaceholderImages(18);
        }
        
        console.log(`📊 Total de imágenes detectadas: ${this.detectedImages.length}`);
    }

    generatePlaceholderImages(count) {
        const placeholders = [];
        const pexelsIds = [1040881, 1239291, 1181686, 1181690, 1040880, 1239288, 
                          1181681, 1181687, 1040882, 1239289, 1181683, 1181688,
                          1040883, 1239290, 1181684, 1181689, 1040884, 1239292];
        
        for (let i = 0; i < count; i++) {
            const id = pexelsIds[i % pexelsIds.length];
            placeholders.push(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`);
        }
        return placeholders;
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
        const imageCount = this.detectedImages.length;
        
        console.log(`🎨 Generando layout para ${imageCount} imágenes en viewport ${viewport}`);
        
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
        console.log(`🎭 Collage creado con ${this.characters.length} elementos para ${this.currentViewport}`);
    }

    createCorners(startIndex, cornerCount) {
        const positions = [
            { class: 'character-corner top-left', position: 'top-left' },
            { class: 'character-corner top-right', position: 'top-right' },
            { class: 'character-corner bottom-left', position: 'bottom-left' },
            { class: 'character-corner bottom-right', position: 'bottom-right' }
        ];

        for (let i = 0; i < cornerCount && i < positions.length; i++) {
            if (startIndex + i < this.detectedImages.length) {
                const element = this.createImageElement(
                    positions[i].class,
                    startIndex + i + 1,
                    this.getImageSrc(startIndex + i),
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
            
            for (let i = 0; i < leftCount && currentIndex < maxImages && currentIndex < this.detectedImages.length; i++) {
                const item = this.createImageElement(
                    'character-item',
                    currentIndex + 1,
                    this.getImageSrc(currentIndex),
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
            
            for (let i = 0; i < rightCount && currentIndex < maxImages && currentIndex < this.detectedImages.length; i++) {
                const item = this.createImageElement(
                    'character-item',
                    currentIndex + 1,
                    this.getImageSrc(currentIndex),
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
            
            for (let i = 0; i < topCount && currentIndex < maxImages && currentIndex < this.detectedImages.length; i++) {
                const item = this.createImageElement(
                    'character-item',
                    currentIndex + 1,
                    this.getImageSrc(currentIndex),
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
            
            for (let i = 0; i < bottomCount && currentIndex < maxImages && currentIndex < this.detectedImages.length; i++) {
                const item = this.createImageElement(
                    'character-item',
                    currentIndex + 1,
                    this.getImageSrc(currentIndex),
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
                const fallbackIndex = (characterNumber - 1) % 18;
                const pexelsIds = [1040881, 1239291, 1181686, 1181690, 1040880, 1239288, 
                                  1181681, 1181687, 1040882, 1239289, 1181683, 1181688,
                                  1040883, 1239290, 1181684, 1181689, 1040884, 1239292];
                const id = pexelsIds[fallbackIndex];
                img.src = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`;
            };
        }
        
        element.appendChild(img);
        return element;
    }

    getImageSrc(index) {
        if (index < this.detectedImages.length) {
            const imageName = this.detectedImages[index];
            return imageName.startsWith('http') ? imageName : `assets/characters/${imageName}`;
        }
        return this.generatePlaceholderImages(1)[0];
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
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <span class="character-name">${this.characterNames[index]}</span>
                <span class="character-description">Imagen ${index + 1} de ${this.frameLayout.maxImages} • ${this.currentViewport} ✨</span>
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
        const messages = [
            `¡${this.characterNames[index]} te envía amor! 💕`,
            `${this.characterNames[index]} está aquí contigo ✨`,
            `¡Un abrazo virtual de ${this.characterNames[index]}! 🤗`,
            `${this.characterNames[index]} te desea lo mejor 🌟`,
            `¡${this.characterNames[index]} cree en ti! 💪`
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
        this.generateResponsiveLayout();
        this.createAdaptiveCollage();
        this.setupInteractions();
        console.log('✅ Imágenes actualizadas y collage regenerado');
    }

    setCharacterNames(names) {
        if (!Array.isArray(names)) return;
        this.characterNames = names;
        console.log('✅ Nombres de personajes actualizados:', names);
    }

    async reloadImages() {
        console.log('🔄 Recargando collage adaptativo...');
        await this.detectAvailableImages();
        this.generateResponsiveLayout();
        this.createAdaptiveCollage();
        this.setupInteractions();
        this.startAnimations();
        console.log('✅ Collage recargado con layout responsivo');
    }

    updateAvailableImages(imageList) {
        this.availableImages = imageList;
        this.reloadImages();
        console.log('✅ Lista de imágenes actualizada:', imageList);
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

// Estilos adicionales para collage sin bordes
const borderlessCollageStyles = document.createElement('style');
borderlessCollageStyles.textContent = `
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

    /* Layouts específicos por viewport */
    .mobile-layout {
        gap: -15px;
    }

    .tablet-layout {
        gap: -20px;
    }

    .laptop-layout {
        gap: -25px;
    }

    .desktop-layout {
        gap: -30px;
    }

    /* Ajustes por cantidad de imágenes */
    .character-frame[data-image-count="12"] .character-corner {
        width: 120px !important;
        height: 150px !important;
    }

    .character-frame[data-image-count="16"] .character-corner {
        width: 110px !important;
        height: 140px !important;
    }

    .character-frame[data-image-count="20"] .character-corner {
        width: 100px !important;
        height: 130px !important;
    }

    /* Efectos hover mejorados sin bordes */
    .character-corner:hover,
    .character-item:hover {
        transform: scale(1.08) rotate(2deg);
        filter: brightness(1.15) saturate(1.2);
        z-index: 50;
    }
`;

document.head.appendChild(borderlessCollageStyles);