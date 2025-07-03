// Gestión del contenido dinámico con posicionamiento inteligente y detección de colisiones
export class ContentManager {
    constructor() {
        this.dynamicContainer = null;
        this.currentPositionMode = 'adaptive'; // adaptive, smart, side, top, modal
        this.mascotPosition = { x: 0, y: 0, width: 150, height: 150 };
        this.viewportSize = { width: 0, height: 0 };
        this.collisionDetection = true;
        this.positionHistory = [];
        this.minDistanceFromMascot = 80; // Distancia mínima en píxeles
        this.collisionCheckInterval = null;
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
        
        console.log('📍 ContentManager inicializado con detección de colisiones dinámicas');
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
            this.mascotPosition = {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                right: rect.right,
                bottom: rect.bottom,
                centerX: rect.left + rect.width / 2,
                centerY: rect.top + rect.height / 2
            };
        }
    }

    startCollisionMonitoring() {
        // Monitorear colisiones cada 500ms
        this.collisionCheckInterval = setInterval(() => {
            this.checkAndResolveCollisions();
        }, 500);
    }

    checkAndResolveCollisions() {
        const textElement = this.dynamicContainer.querySelector('.dynamic-text');
        if (!textElement || !textElement.classList.contains('show')) return;

        this.detectMascotPosition();
        const textRect = textElement.getBoundingClientRect();
        
        if (this.hasCollision(textRect)) {
            console.log('🚨 Colisión detectada, reposicionando contenido...');
            this.resolveCollision(textElement, textRect);
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

    resolveCollision(textElement, textRect) {
        const viewport = this.viewportSize;
        const isMobile = viewport.width <= 768;
        
        if (isMobile) {
            this.resolveMobileCollision(textElement, textRect);
        } else {
            this.resolveDesktopCollision(textElement, textRect);
        }
    }

    resolveMobileCollision(textElement, textRect) {
        // En móvil: mover el texto hacia arriba y añadir margen inferior
        const safeTopPosition = Math.max(20, this.viewportSize.height * 0.1);
        const safeBottomMargin = this.mascotPosition.height + this.minDistanceFromMascot + 20;
        
        textElement.style.position = 'relative';
        textElement.style.marginTop = '0';
        textElement.style.marginBottom = `${safeBottomMargin}px`;
        textElement.style.transform = 'none';
        
        // Añadir padding al contenedor para evitar scroll problemático
        const container = textElement.closest('.dynamic-content') || textElement.closest('.content');
        if (container) {
            container.style.paddingBottom = `${safeBottomMargin + 40}px`;
        }
        
        console.log(`📱 Colisión móvil resuelta: margen inferior ${safeBottomMargin}px`);
    }

    resolveDesktopCollision(textElement, textRect) {
        // En escritorio: buscar la mejor posición disponible
        const bestPosition = this.findBestDesktopPosition(textRect.width, textRect.height);
        
        if (bestPosition) {
            textElement.style.position = 'fixed';
            textElement.style.left = `${bestPosition.x}px`;
            textElement.style.top = `${bestPosition.y}px`;
            textElement.style.transform = 'none';
            textElement.style.zIndex = '1000';
            
            console.log(`🖥️ Colisión escritorio resuelta: posición (${bestPosition.x}, ${bestPosition.y})`);
        } else {
            // Fallback: posición superior centrada
            this.moveToSafeTopPosition(textElement);
        }
    }

    findBestDesktopPosition(contentWidth, contentHeight) {
        const margin = 20;
        const positions = [
            // Posición superior centrada
            {
                x: (this.viewportSize.width - contentWidth) / 2,
                y: margin,
                priority: 1
            },
            // Posición izquierda centrada
            {
                x: margin,
                y: (this.viewportSize.height - contentHeight) / 2,
                priority: 2
            },
            // Posición superior izquierda
            {
                x: margin,
                y: margin,
                priority: 3
            },
            // Posición superior derecha (si hay espacio)
            {
                x: this.viewportSize.width - contentWidth - margin,
                y: margin,
                priority: 4
            }
        ];

        // Ordenar por prioridad y verificar colisiones
        positions.sort((a, b) => a.priority - b.priority);
        
        for (const pos of positions) {
            const testRect = {
                left: pos.x,
                top: pos.y,
                right: pos.x + contentWidth,
                bottom: pos.y + contentHeight
            };
            
            if (!this.hasCollision(testRect)) {
                return pos;
            }
        }
        
        return null;
    }

    moveToSafeTopPosition(textElement) {
        const safeY = Math.max(20, this.viewportSize.height * 0.05);
        
        textElement.style.position = 'fixed';
        textElement.style.left = '50%';
        textElement.style.top = `${safeY}px`;
        textElement.style.transform = 'translateX(-50%)';
        textElement.style.zIndex = '1000';
        textElement.style.maxWidth = 'min(90vw, 600px)';
        
        console.log(`⬆️ Movido a posición superior segura: ${safeY}px`);
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
        // Controles de teclado para cambiar posicionamiento
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.setPositionMode('adaptive');
                        break;
                    case '2':
                        e.preventDefault();
                        this.setPositionMode('smart');
                        break;
                    case '3':
                        e.preventDefault();
                        this.setPositionMode('side');
                        break;
                    case '4':
                        e.preventDefault();
                        this.setPositionMode('top');
                        break;
                    case '5':
                        e.preventDefault();
                        this.setPositionMode('modal');
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleDebugMode();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.toggleCollisionDetection();
                        break;
                }
            }
        });

        console.log(`
🎯 CONTROLES DE POSICIONAMIENTO DISPONIBLES:
=====================================
Ctrl/Cmd + 1: Modo Adaptativo (por defecto)
Ctrl/Cmd + 2: Posicionamiento Inteligente
Ctrl/Cmd + 3: Posicionamiento Lateral
Ctrl/Cmd + 4: Posicionamiento Superior
Ctrl/Cmd + 5: Modo Modal/Overlay
Ctrl/Cmd + D: Activar/desactivar modo debug
Ctrl/Cmd + C: Activar/desactivar detección de colisiones
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
        notification.textContent = `Detección de colisiones: ${enabled ? 'ACTIVADA' : 'DESACTIVADA'}`;
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

    setPositionMode(mode) {
        this.currentPositionMode = mode;
        this.repositionCurrentContent();
        console.log(`📍 Modo de posicionamiento cambiado a: ${mode}`);
        
        // Mostrar notificación temporal
        this.showPositionNotification(mode);
    }

    showPositionNotification(mode) {
        const modeNames = {
            adaptive: 'Adaptativo con Anti-Colisión',
            smart: 'Inteligente con Anti-Colisión',
            side: 'Lateral con Anti-Colisión',
            top: 'Superior con Anti-Colisión',
            modal: 'Modal con Anti-Colisión'
        };

        const notification = document.createElement('div');
        notification.textContent = `Posicionamiento: ${modeNames[mode]}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = 'rgba(102, 126, 234, 0.9)';
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
        }, 2000);
    }

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

    calculateSafeZones() {
        const margin = 20;
        const minWidth = 300;
        const minHeight = 200;
        
        const zones = [];
        
        // Zona superior - SIEMPRE SEGURA
        zones.push({
            x: margin,
            y: margin,
            width: this.viewportSize.width - margin * 2,
            height: Math.min(this.viewportSize.height * 0.4, 300),
            type: 'top'
        });
        
        // Zona izquierda (si hay espacio)
        if (this.mascotPosition.x > minWidth + margin * 2) {
            zones.push({
                x: margin,
                y: margin,
                width: this.mascotPosition.x - margin * 2 - this.minDistanceFromMascot,
                height: this.viewportSize.height - margin * 2,
                type: 'left'
            });
        }
        
        // Zona central superior (evitando mascota)
        const centerX = this.viewportSize.width / 2;
        const centerY = this.viewportSize.height * 0.25;
        
        if (!this.hasCollision({
            left: centerX - minWidth/2,
            top: centerY - minHeight/2,
            right: centerX + minWidth/2,
            bottom: centerY + minHeight/2
        })) {
            zones.push({
                x: centerX - minWidth/2,
                y: centerY - minHeight/2,
                width: minWidth,
                height: minHeight,
                type: 'center-upper'
            });
        }
        
        return zones;
    }

    getBestPosition(contentWidth = 500, contentHeight = 300) {
        this.detectMascotPosition();
        const safeZones = this.calculateSafeZones();
        
        // Priorizar zonas según el modo actual
        const priorities = {
            smart: ['center-upper', 'top', 'left'],
            side: ['left', 'center-upper', 'top'],
            top: ['top', 'center-upper', 'left'],
            adaptive: ['center-upper', 'top', 'left'],
            modal: ['center-upper', 'top']
        };
        
        const preferredTypes = priorities[this.currentPositionMode] || priorities.adaptive;
        
        for (const type of preferredTypes) {
            const zone = safeZones.find(z => z.type === type && 
                                      z.width >= contentWidth && 
                                      z.height >= contentHeight);
            if (zone) {
                return {
                    x: zone.x + (zone.width - contentWidth) / 2,
                    y: zone.y + (zone.height - contentHeight) / 2,
                    zone: type
                };
            }
        }
        
        // Fallback: parte superior de la pantalla
        return {
            x: (this.viewportSize.width - contentWidth) / 2,
            y: Math.min(80, this.viewportSize.height * 0.1),
            zone: 'fallback-top'
        };
    }

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

        // Añadir botón de cierre para modo modal
        if (this.currentPositionMode === 'modal') {
            htmlContent += `<button class="close-button" onclick="this.parentElement.style.display='none'">×</button>`;
        }

        textElement.innerHTML = htmlContent;

        // Aplicar clase de posicionamiento
        this.applyPositioning(textElement);

        this.clearContent();
        this.dynamicContainer.appendChild(textElement);

        // Mostrar con animación
        requestAnimationFrame(() => {
            textElement.classList.add('show');
            
            // Verificar colisiones después de que aparezca
            setTimeout(() => {
                if (this.collisionDetection) {
                    this.checkAndResolveCollisions();
                }
            }, 100);
        });

        // Guardar en historial
        this.positionHistory.push({
            mode: this.currentPositionMode,
            content: content,
            timestamp: Date.now()
        });

        console.log(`📍 Contenido mostrado con posicionamiento anti-colisión: ${this.currentPositionMode}`);
    }

    applyPositioning(element) {
        // Limpiar clases de posicionamiento previas
        element.classList.remove('smart-position', 'side-position', 'top-position', 'modal-position', 'adaptive-position');
        
        // Aplicar clase según modo actual
        switch (this.currentPositionMode) {
            case 'smart':
                element.classList.add('smart-position');
                this.applySmartPositioning(element);
                break;
            case 'side':
                element.classList.add('side-position');
                break;
            case 'top':
                element.classList.add('top-position');
                break;
            case 'modal':
                element.classList.add('modal-position');
                break;
            case 'adaptive':
            default:
                element.classList.add('adaptive-position');
                break;
        }
    }

    applySmartPositioning(element) {
        const rect = element.getBoundingClientRect();
        const bestPosition = this.getBestPosition(rect.width || 500, rect.height || 300);
        
        element.style.left = bestPosition.x + 'px';
        element.style.top = bestPosition.y + 'px';
        
        console.log(`🎯 Posición inteligente aplicada: zona ${bestPosition.zone}`);
    }

    repositionCurrentContent() {
        const currentText = this.dynamicContainer.querySelector('.dynamic-text');
        if (currentText) {
            this.applyPositioning(currentText);
            
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
    }
}