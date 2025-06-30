// Gestión del contenido dinámico con posicionamiento inteligente
export class ContentManager {
    constructor() {
        this.dynamicContainer = null;
        this.currentPositionMode = 'adaptive'; // adaptive, smart, side, top, modal
        this.mascotPosition = { x: 0, y: 0, width: 150, height: 150 };
        this.viewportSize = { width: 0, height: 0 };
        this.collisionDetection = true;
        this.positionHistory = [];
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
        
        console.log('📍 ContentManager inicializado con posicionamiento inteligente');
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
                bottom: rect.bottom
            };
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
        `);
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
            adaptive: 'Adaptativo',
            smart: 'Inteligente',
            side: 'Lateral',
            top: 'Superior',
            modal: 'Modal'
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
        mascotIndicator.style.left = (this.mascotPosition.x + this.mascotPosition.width / 2) + 'px';
        mascotIndicator.style.top = (this.mascotPosition.y + this.mascotPosition.height / 2) + 'px';
        document.body.appendChild(mascotIndicator);

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
        document.querySelectorAll('.position-indicator').forEach(indicator => {
            indicator.remove();
        });
    }

    calculateSafeZones() {
        const margin = 20;
        const minWidth = 300;
        const minHeight = 200;
        
        const zones = [];
        
        // Zona izquierda
        if (this.mascotPosition.x > minWidth + margin * 2) {
            zones.push({
                x: margin,
                y: margin,
                width: this.mascotPosition.x - margin * 2,
                height: this.viewportSize.height - margin * 2,
                type: 'left'
            });
        }
        
        // Zona superior
        if (this.mascotPosition.y > minHeight + margin * 2) {
            zones.push({
                x: margin,
                y: margin,
                width: this.viewportSize.width - margin * 2,
                height: this.mascotPosition.y - margin * 2,
                type: 'top'
            });
        }
        
        // Zona central (si hay espacio)
        const centerX = this.viewportSize.width / 2;
        const centerY = this.viewportSize.height / 2;
        
        if (!this.checkCollision(centerX - minWidth/2, centerY - minHeight/2, minWidth, minHeight)) {
            zones.push({
                x: centerX - minWidth/2,
                y: centerY - minHeight/2,
                width: minWidth,
                height: minHeight,
                type: 'center'
            });
        }
        
        return zones;
    }

    checkCollision(x, y, width, height) {
        const buffer = 20;
        return !(x + width + buffer < this.mascotPosition.x ||
                x - buffer > this.mascotPosition.right ||
                y + height + buffer < this.mascotPosition.y ||
                y - buffer > this.mascotPosition.bottom);
    }

    getBestPosition(contentWidth = 500, contentHeight = 300) {
        this.detectMascotPosition();
        const safeZones = this.calculateSafeZones();
        
        // Priorizar zonas según el modo actual
        const priorities = {
            smart: ['center', 'left', 'top'],
            side: ['left', 'center', 'top'],
            top: ['top', 'center', 'left'],
            adaptive: ['center', 'left', 'top'],
            modal: ['center']
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
        
        // Fallback: centro de pantalla
        return {
            x: (this.viewportSize.width - contentWidth) / 2,
            y: (this.viewportSize.height - contentHeight) / 2,
            zone: 'fallback'
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
        });

        // Guardar en historial
        this.positionHistory.push({
            mode: this.currentPositionMode,
            content: content,
            timestamp: Date.now()
        });

        console.log(`📍 Contenido mostrado con posicionamiento: ${this.currentPositionMode}`);
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

        // Detectar colisiones y ajustar si es necesario
        if (this.collisionDetection && this.currentPositionMode !== 'adaptive') {
            setTimeout(() => {
                this.checkAndResolveCollisions(element);
            }, 100);
        }
    }

    applySmartPositioning(element) {
        const rect = element.getBoundingClientRect();
        const bestPosition = this.getBestPosition(rect.width || 500, rect.height || 300);
        
        element.style.left = bestPosition.x + 'px';
        element.style.top = bestPosition.y + 'px';
        
        console.log(`🎯 Posición inteligente aplicada: zona ${bestPosition.zone}`);
    }

    checkAndResolveCollisions(element) {
        const rect = element.getBoundingClientRect();
        const hasCollision = this.checkCollision(rect.left, rect.top, rect.width, rect.height);
        
        if (hasCollision) {
            console.log('⚠️ Colisión detectada, reposicionando...');
            element.parentElement.classList.add('collision-detected');
            
            // Intentar reposicionar
            const bestPosition = this.getBestPosition(rect.width, rect.height);
            element.style.left = bestPosition.x + 'px';
            element.style.top = bestPosition.y + 'px';
            
            setTimeout(() => {
                element.parentElement.classList.remove('collision-detected');
            }, 2000);
        }
    }

    repositionCurrentContent() {
        const currentText = this.dynamicContainer.querySelector('.dynamic-text');
        if (currentText) {
            this.applyPositioning(currentText);
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
}