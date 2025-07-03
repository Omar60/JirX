// Gestión del contenido dinámico con posicionamiento centrado y mascota adaptativa
export class ContentManager {
    constructor() {
        this.dynamicContainer = null;
        this.mascotPosition = { x: 0, y: 0, width: 150, height: 150 };
        this.viewportSize = { width: 0, height: 0 };
        this.collisionDetection = true;
        this.positionHistory = [];
        this.minDistanceFromMascot = 10; // Distancia mínima en píxeles
        this.collisionCheckInterval = null;
        this.isRepositioning = false; // Flag para evitar reposicionamientos múltiples
    }

    init() {
        this.dynamicContainer = document.getElementById('dynamicContent');
        if (!this.dynamicContainer) {
            throw new Error('Dynamic content container no encontrado');
        }

        this.updateViewportSize();
        this.detectMascotPosition();
        this.setupResizeListener();
        this.setupPositionControls();
        this.startCollisionMonitoring();
        
        console.log('📍 ContentManager inicializado - Texto centrado, mascota adaptativa');
    }

    updateViewportSize() {
        this.viewportSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    detectMascotPosition() {
        const lottieContainer = document.getElementById('lottieContainer');
        if (lottieContainer) {
            const rect = lottieContainer.getBoundingClientRect();
            
            // Obtener el desplazamiento actual del transform
            const currentTransform = lottieContainer.style.transform;
            const currentOffset = currentTransform.match(/translateY\(([^)]+)\)/);
            const translateY = currentOffset ? parseFloat(currentOffset[1]) : 0;
            
            this.mascotPosition = {
                x: rect.left,
                y: rect.top + translateY, // Incluir el desplazamiento
                width: rect.width,
                height: rect.height,
                right: rect.right,
                bottom: rect.bottom + translateY, // Incluir el desplazamiento
                centerX: rect.left + rect.width / 2,
                centerY: rect.top + rect.height / 2 + translateY, // Incluir el desplazamiento
                originalY: rect.top, // Guardar posición original
                currentTranslateY: translateY // Guardar desplazamiento actual
            };
        }
    }

    startCollisionMonitoring() {
        // Monitorear colisiones cada 1000ms (más lento para evitar rebotes)
        this.collisionCheckInterval = setInterval(() => {
            this.checkAndResolveCollisions();
        }, 1000);
    }

    checkAndResolveCollisions() {
        const textElement = this.dynamicContainer.querySelector('.dynamic-text');
        if (!textElement || !textElement.classList.contains('show') || this.isRepositioning) return;

        this.detectMascotPosition();
        const textRect = textElement.getBoundingClientRect();
        
        if (this.hasCollision(textRect)) {
            console.log('🚨 Colisión detectada, reposicionando mascota hacia abajo...');
            this.repositionMascot(textRect);
        }
    }

    hasCollision(textRect) {
        const buffer = this.minDistanceFromMascot;
        
        // Verificar si hay superposición o están muy cerca
        return !(textRect.right + buffer < this.mascotPosition.x ||
                textRect.left - buffer > this.mascotPosition.right ||
                textRect.bottom + buffer < this.mascotPosition.y ||
                textRect.top - buffer > this.mascotPosition.bottom);
    }

    repositionMascot(textRect) {
        const mascotContainer = document.getElementById('lottieContainer') || 
                               document.getElementById('characterFrame') || 
                               document.querySelector('.character-container');
        
        if (!mascotContainer || this.isRepositioning) {
            console.warn('⚠️ Contenedor de mascota no encontrado o ya reposicionando');
            return;
        }

        // Marcar que estamos reposicionando
        this.isRepositioning = true;

        // Calcular nueva posición para la mascota (siempre abajo del texto)
        const buffer = this.minDistanceFromMascot;
        const newMascotY = textRect.bottom + buffer;
        
        // Usar la posición ORIGINAL (sin transform) para calcular el offset correcto
        const originalMascotY = this.mascotPosition.originalY || this.mascotPosition.y;
        const targetOffset = newMascotY - originalMascotY;
        
        // Verificar si ya está en la posición correcta (evitar rebote)
        const currentTransform = mascotContainer.style.transform;
        const currentOffset = currentTransform.match(/translateY\(([^)]+)\)/);
        const currentY = currentOffset ? parseFloat(currentOffset[1]) : 0;
        
        if (Math.abs(currentY - targetOffset) < 5) { // Reducir umbral para mayor precisión
            console.log('🎯 Mascota ya está en posición correcta, evitando rebote');
            this.isRepositioning = false;
            return;
        }
        
        // EXPANDIR LA PÁGINA si es necesario para dar espacio a la mascota
        const requiredPageHeight = newMascotY + this.mascotPosition.height + 100; // 100px de margen extra
        
        if (requiredPageHeight > this.viewportSize.height) {
            this.expandPageHeight(requiredPageHeight);
            console.log(`📏 Página expandida a ${requiredPageHeight}px para dar espacio a la mascota`);
        }
        
        // Aplicar nueva posición con animación suave
        mascotContainer.style.transition = 'transform 0.5s ease-out, opacity 0.3s ease-out';
        mascotContainer.style.opacity = '1';
        mascotContainer.style.transform = `translateY(${targetOffset}px)`;
        
        console.log(`🎭 Mascota reposicionada: Y=${newMascotY}px (offset: ${targetOffset}px, original: ${originalMascotY}px)`);
        
        // Desmarcar después de la animación
        setTimeout(() => {
            this.isRepositioning = false;
        }, 600); // Un poco más que la duración de la animación
    }

    // Método para expandir la altura de la página
    expandPageHeight(requiredHeight) {
        // Crear o actualizar un div invisible que expanda la página
        let spacer = document.getElementById('page-height-spacer');
        
        if (!spacer) {
            spacer = document.createElement('div');
            spacer.id = 'page-height-spacer';
            spacer.style.position = 'absolute';
            spacer.style.top = '0';
            spacer.style.left = '0';
            spacer.style.width = '1px';
            spacer.style.pointerEvents = 'none';
            spacer.style.zIndex = '-1';
            spacer.style.opacity = '0';
            document.body.appendChild(spacer);
        }
        
        // Establecer la altura mínima necesaria
        spacer.style.height = `${requiredHeight}px`;
        
        console.log(`📐 Espaciador de página ajustado a ${requiredHeight}px`);
    }

    // Método para resetear la posición de la mascota
    resetMascotPosition() {
        const mascotContainer = document.getElementById('lottieContainer') || 
                               document.getElementById('characterFrame') || 
                               document.querySelector('.character-container');
        
        if (mascotContainer) {
            this.isRepositioning = true; // Evitar colisiones durante reset
            
            mascotContainer.style.transition = 'transform 0.5s ease-out, opacity 0.3s ease-out';
            mascotContainer.style.transform = 'translateY(0)';
            mascotContainer.style.opacity = '1';
            console.log('🔄 Posición de mascota restablecida');
            
            setTimeout(() => {
                this.isRepositioning = false;
            }, 600);
        }
        
        // También resetear la altura de la página
        this.resetPageHeight();
    }

    // Método para resetear la altura de la página a su estado normal
    resetPageHeight() {
        const spacer = document.getElementById('page-height-spacer');
        if (spacer) {
            spacer.style.height = '100vh'; // Altura mínima normal
            console.log('📐 Altura de página restablecida');
        }
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateViewportSize();
                this.detectMascotPosition();
                this.repositionCurrentContent();
            }, 300);
        });
    }

    setupPositionControls() {
        // Controles de teclado simplificados
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'd':
                        e.preventDefault();
                        this.toggleDebugMode();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.toggleCollisionDetection();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.resetMascotPosition();
                        break;
                }
            }
        });

        console.log(`
🎯 CONTROLES SIMPLIFICADOS DISPONIBLES:
====================================
Ctrl/Cmd + D: Activar/desactivar modo debug
Ctrl/Cmd + C: Activar/desactivar detección de colisiones
Ctrl/Cmd + R: Resetear posición de mascota
Texto SIEMPRE centrado - Solo la mascota se mueve
        `);
    }

    toggleCollisionDetection() {
        this.collisionDetection = !this.collisionDetection;
        
        if (this.collisionDetection) {
            this.startCollisionMonitoring();
            console.log('🔍 Detección de colisiones ACTIVADA');
        } else {
            if (this.collisionCheckInterval) {
                clearInterval(this.collisionCheckInterval);
                this.collisionCheckInterval = null;
            }
            console.log('🔍 Detección de colisiones DESACTIVADA');
        }
        
        this.showCollisionNotification(this.collisionDetection);
    }

    showCollisionNotification(enabled) {
        const notification = document.createElement('div');
        notification.textContent = `Anti-colisión: ${enabled ? 'ACTIVADA - Mascota se mueve abajo' : 'DESACTIVADA'}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = enabled ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '8px 16px';
        notification.style.borderRadius = '20px';
        notification.style.fontSize = '14px';
        notification.style.zIndex = '2000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Método eliminado - ya no necesitamos diferentes modos
    // El texto siempre estará centrado

    // Método eliminado - ya no necesitamos notificaciones de posición
    // El texto siempre estará centrado

    toggleDebugMode() {
        document.body.classList.toggle('debug-positioning');
        const isDebug = document.body.classList.contains('debug-positioning');
        console.log(`🔧 Modo debug ${isDebug ? 'activado' : 'desactivado'}`);
        
        if (isDebug) {
            this.showPositionIndicators();
        } else {
            this.hidePositionIndicators();
        }
    }

    showPositionIndicators() {
        // Indicador de posición de mascota
        const mascotIndicator = document.createElement('div');
        mascotIndicator.className = 'position-indicator mascot-indicator';
        mascotIndicator.style.left = (this.mascotPosition.centerX) + 'px';
        mascotIndicator.style.top = (this.mascotPosition.centerY) + 'px';
        mascotIndicator.style.background = 'rgba(255, 107, 107, 0.8)';
        mascotIndicator.style.width = '16px';
        mascotIndicator.style.height = '16px';
        document.body.appendChild(mascotIndicator);

        // Zona de colisión de la mascota
        const collisionZone = document.createElement('div');
        collisionZone.className = 'collision-zone-indicator';
        collisionZone.style.position = 'fixed';
        collisionZone.style.left = (this.mascotPosition.x - this.minDistanceFromMascot) + 'px';
        collisionZone.style.top = (this.mascotPosition.y - this.minDistanceFromMascot) + 'px';
        collisionZone.style.width = (this.mascotPosition.width + this.minDistanceFromMascot * 2) + 'px';
        collisionZone.style.height = (this.mascotPosition.height + this.minDistanceFromMascot * 2) + 'px';
        collisionZone.style.border = '2px dashed rgba(255, 107, 107, 0.6)';
        collisionZone.style.background = 'rgba(255, 107, 107, 0.1)';
        collisionZone.style.pointerEvents = 'none';
        collisionZone.style.zIndex = '999';
        document.body.appendChild(collisionZone);

        // Indicadores de zonas seguras
        const safeZones = this.calculateSafeZones();
        safeZones.forEach((zone, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'position-indicator safe-zone-indicator';
            indicator.style.left = (zone.x + zone.width / 2) + 'px';
            indicator.style.top = (zone.y + zone.height / 2) + 'px';
            indicator.style.background = 'rgba(34, 197, 94, 0.6)';
            document.body.appendChild(indicator);
        });
    }

    hidePositionIndicators() {
        document.querySelectorAll('.position-indicator, .collision-zone-indicator').forEach(indicator => {
            indicator.remove();
        });
    }

    // Método eliminado - ya no necesitamos calcular zonas seguras
    // El texto siempre estará centrado, solo movemos la mascota

    // Método eliminado - ya no necesitamos calcular mejores posiciones
    // El texto siempre estará centrado

    showContent(content) {
        if (!content || !this.dynamicContainer) return;

        const textElement = document.createElement('div');
        textElement.className = 'dynamic-text';

        let htmlContent = '';
        if (content.title) {
            htmlContent += `<h2>${this.escapeHtml(content.title)}</h2>`;
        }
        if (content.text) {
            htmlContent += `<p>${this.escapeHtml(content.text)}</p>`;
        }
        if (content.signature) {
            htmlContent += `<p class="signature">${this.escapeHtml(content.signature)}</p>`;
        }

        textElement.innerHTML = htmlContent;

        // SIEMPRE mantener el texto centrado
        this.applyCenteredPositioning(textElement);

        this.clearContent();
        this.dynamicContainer.appendChild(textElement);

        // Mostrar con animación
        requestAnimationFrame(() => {
            textElement.classList.add('show');
            
            // Manejar cambio de contenido (restaurar mascota y verificar colisiones)
            this.onContentChange();
        });

        // Guardar en historial
        this.positionHistory.push({
            mode: 'centered', // Siempre centrado
            content: content,
            timestamp: Date.now()
        });

        console.log(`📍 Contenido mostrado centrado - mascota se adaptará si hay colisión`);
    }

    applyCenteredPositioning(element) {
        // Mantener el estilo romántico original del texto
        element.style.position = 'fixed';
        element.style.left = '50%';
        element.style.top = '50%';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.zIndex = '1000';
        element.style.maxWidth = 'min(90vw, 600px)';
        element.style.maxHeight = '70vh';
        element.style.overflowY = 'auto';
        element.style.textAlign = 'center';
        element.style.color = 'white';
        element.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        
        console.log('🎯 Texto posicionado en el centro con estilo romántico original');
    }

    // Método eliminado - ya no necesitamos posicionamiento inteligente
    // El texto siempre estará centrado

    repositionCurrentContent() {
        const currentText = this.dynamicContainer.querySelector('.dynamic-text');
        if (currentText) {
            // Siempre mantener centrado
            this.applyCenteredPositioning(currentText);
            
            // Verificar colisiones después del reposicionamiento
            setTimeout(() => {
                if (this.collisionDetection) {
                    this.checkAndResolveCollisions();
                }
            }, 100);
        }
    }

    clearContent() {
        if (!this.dynamicContainer) return;

        const existingContent = this.dynamicContainer.querySelector('.dynamic-text');
        if (existingContent) {
            existingContent.style.opacity = '0';
            existingContent.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                this.dynamicContainer.innerHTML = '';
            }, 300);
        } else {
            this.dynamicContainer.innerHTML = '';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    typeWriter(element, text, speed = 50) {
        return new Promise((resolve) => {
            let i = 0;
            element.innerHTML = '';

            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }

            type();
        });
    }

    // Métodos públicos para control externo
    setCollisionDetection(enabled) {
        this.collisionDetection = enabled;
        console.log(`🔍 Detección de colisiones ${enabled ? 'activada' : 'desactivada'}`);
    }

    setMinDistance(distance) {
        this.minDistanceFromMascot = distance;
        console.log(`📏 Distancia mínima de mascota establecida en: ${distance}px`);
    }

    getPositionHistory() {
        return this.positionHistory;
    }

    resetPositionHistory() {
        this.positionHistory = [];
        console.log('📝 Historial de posiciones reiniciado');
    }

    // Método para obtener estadísticas de posicionamiento
    getPositionStats() {
        const stats = this.positionHistory.reduce((acc, entry) => {
            acc[entry.mode] = (acc[entry.mode] || 0) + 1;
            return acc;
        }, {});
        
        console.log('📊 Estadísticas de posicionamiento:', stats);
        return stats;
    }

    cleanup() {
        if (this.collisionCheckInterval) {
            clearInterval(this.collisionCheckInterval);
            this.collisionCheckInterval = null;
        }
        this.hidePositionIndicators();
        
        // Limpiar el espaciador de altura
        const spacer = document.getElementById('page-height-spacer');
        if (spacer) {
            spacer.remove();
        }
    }

    // Método para detectar cambios de contenido y restaurar mascota
    onContentChange() {
        // Restaurar mascota y altura de página cuando cambia el contenido
        this.resetMascotPosition();
        
        // Esperar un poco antes de verificar colisiones
        setTimeout(() => {
            if (this.collisionDetection) {
                this.checkAndResolveCollisions();
            }
        }, 200);
    }
}