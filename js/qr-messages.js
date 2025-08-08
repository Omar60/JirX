/* ==========================================================================
   QR-MESSAGES.JS - Sistema Modular de Mensajes Exclusivos por Código QR
   ========================================================================== */

/**
 * Módulo principal del sistema de mensajes QR exclusivos
 * Maneja la lógica de acceso, visualización y anti-colisión
 */
class QRExclusiveSystem {
    constructor() {
        // Configuración del módulo
        this.config = {
            urlCleanDelay: 3000,        // Tiempo para limpiar URL (ms)
            collisionCheckDelay: 200,   // Tiempo para verificar colisiones (ms)
            animationDelay: 100,        // Tiempo para iniciar animaciones (ms)
            debugMode: false            // Modo debug (desarrollo)
        };
        
        // Base de datos de mensajes exclusivos
        this.messages = this.initializeMessages();
        
        // Sistema de eventos
        this.eventListeners = new Map();
        
        // Estado del sistema
        this.state = {
            currentMessage: null,
            isVisible: false,
            hasCollision: false,
            originalContent: null   // Para guardar contenido original
        };
        
        this.init();
    }
    
    /* =========================================================================
       INICIALIZACIÓN Y CONFIGURACIÓN
       ========================================================================= */
    
    /**
     * Inicializa la base de datos de mensajes
     * @returns {Object} Colección de mensajes organizados por ID
     */
    initializeMessages() {
        return {
            'message_1': {
                text: "Me encanta la forma en que me haces sentir cuando estamos juntos 🌈",
                type: "romantic",
                subtitle: "Contigo todo es diferente y especial",
                priority: 1
            },
            'message_2': {
                text: "Tienes el poder de cambiar mi día con solo aparecer ✨",
                type: "sweet",
                subtitle: "Eres mucho más que especial para mí",
                priority: 1
            },
            'message_3': {
                text: "Cada momento contigo se siente como una pequeña eternidad perfecta 💫",
                type: "romantic",
                subtitle: "Y quiero construir muchas más contigo",
                priority: 1
            },
            'message_4': {
                text: "Eres mi 'qué pasaría si...'",
                type: "playful",
                subtitle: "Y quiero descubrir contigo todas las respuestas a esa pregunta",
                priority: 1
            },
            'message_5': {
                text: "Me gustas en serio",
                type: "passionate",
                subtitle: "No es solo atracción, es algo más profundo que quiero explorar contigo",
                priority: 1
            },
            'message_6': {
                text: "Eres mi tipo de caos favorito",
                type: "playful",
                subtitle: "El desorden perfecto que mi vida ordenada necesitaba",
                priority: 1
            },
            'message_7': {
                text: "Me encanta cuando estás feliz",
                type: "sweet",
                subtitle: "Porque tu sonrisa es simplemente hermosa y ilumina todo a tu alrededor",
                priority: 1
            },
            'message_8': {
                text: "Me fascina cuando hablas de lo que te apasiona",
                type: "tender",
                subtitle: "Porque tus ojos brillan de una manera que me tiene completamente hipnotizado",
                priority: 1
            },
            'message_9': {
                text: "Siempre que necesites apoyo, estaré ahí",
                type: "sweet",
                subtitle: "Vales mucho, no lo olvides",
                priority: 1
            }
        };
    }
    
    /**
     * Inicializa el sistema completo - SOLO PARA QR
     */
    init() {
        try {
            this.logDebug('🎯 Inicializando sistema QR exclusivo');
            
            // Verificar acceso por URL - SOLO PROCESA SI HAY CÓDIGO QR
            const messageCode = this.extractMessageCodeFromURL();
            
            if (messageCode && this.validateMessageCode(messageCode)) {
                // Hay código QR válido - mostrar mensaje exclusivo
                this.showExclusiveMessage(messageCode);
                this.scheduleURLCleanup();
                this.setupBrowserEvents();
            } else if (messageCode && !this.validateMessageCode(messageCode)) {
                // Código QR inválido - mostrar error
                this.showAccessDenied('Código QR inválido o expirado');
                this.scheduleURLCleanup();
            }
            // IMPORTANTE: Si no hay código QR, NO HACER NADA
            // Dejar que la historia principal funcione normalmente
            
        } catch (error) {
            this.logError('Error en inicialización:', error);
            // Solo mostrar error si había un código QR
            if (this.extractMessageCodeFromURL()) {
                this.showAccessDenied('Error del sistema');
            }
        }
    }
    
    /* =========================================================================
       GESTIÓN DE MENSAJES
       ========================================================================= */
    
    /**
     * Muestra un mensaje exclusivo - MODO CENTRAL (reemplaza historia)
     * @param {string} messageCode - Código del mensaje a mostrar
     */
    showExclusiveMessage(messageCode) {
        try {
            const message = this.messages[messageCode];
            this.logDebug(`📨 Mostrando mensaje QR en modo central: "${message.text}"`);
            
            // Actualizar estado
            this.state.currentMessage = messageCode;
            this.state.isVisible = true;
            
            // OCULTAR ELEMENTOS DE LA HISTORIA ORIGINAL
            this.hideOriginalStory();
            
            // Crear y mostrar contenedor en el centro
            const container = this.createCentralMessageContainer(message, messageCode);
            this.insertIntoCentralPosition(container);
            
            // Mostrar con animación especial
            this.animateCentralMessageEntrance(container);
            
            // Emitir evento personalizado
            this.emitEvent('qr-message-shown', { code: messageCode, message, mode: 'central' });
            
        } catch (error) {
            this.logError('Error al mostrar mensaje central:', error);
            this.showAccessDenied('Error al cargar el mensaje');
        }
    }
    
    /**
     * Muestra mensaje de acceso denegado
     * @param {string} customMessage - Mensaje personalizado opcional
     */
    showAccessDenied(customMessage = null) {
        try {
            this.logDebug('🚫 Mostrando acceso denegado');
            
            const container = this.createAccessDeniedContainer(customMessage);
            this.insertIntoDOM(container);
            this.animateAccessDeniedEntrance(container);
            
            // Emitir evento
            this.emitEvent('qr-access-denied', { reason: customMessage });
            
        } catch (error) {
            this.logError('Error al mostrar acceso denegado:', error);
        }
    }
    
    /* =========================================================================
       CREACIÓN DE ELEMENTOS DOM
       ========================================================================= */
    
    /**
     * Crea el contenedor del mensaje exclusivo - VERSIÓN CENTRAL
     * @param {Object} message - Datos del mensaje
     * @param {string} messageCode - Código del mensaje
     * @returns {HTMLElement} Elemento contenedor central
     */
    createCentralMessageContainer(message, messageCode) {
        const container = document.createElement('div');
        container.className = `qr-central-message type-${message.type}`;
        container.setAttribute('data-message-code', messageCode);
        container.setAttribute('data-priority', message.priority);
        
        container.innerHTML = `
            <div class="romantic-hearts-central"></div>
            <div class="qr-central-content">${message.text}</div>
            <div class="qr-central-subtitle">${message.subtitle}</div>
        `;
        
        return container;
    }
    
    /**
     * Crea el contenedor del mensaje exclusivo - VERSIÓN ORIGINAL (para acceso denegado)
     * @param {Object} message - Datos del mensaje
     * @param {string} messageCode - Código del mensaje
     * @returns {HTMLElement} Elemento contenedor
     */
    createMessageContainer(message, messageCode) {
        const container = document.createElement('div');
        container.className = `qr-exclusive-message type-${message.type} safe-position`;
        container.setAttribute('data-message-code', messageCode);
        container.setAttribute('data-priority', message.priority);
        
        container.innerHTML = `
            <div class="qr-exclusive-indicator">Exclusivo</div>
            <div class="romantic-hearts"></div>
            <div class="qr-message-content">${message.text}</div>
            <div class="qr-message-subtitle">${message.subtitle}</div>
        `;
        
        return container;
    }
    
    /**
     * Crea el contenedor de acceso denegado
     * @param {string} customMessage - Mensaje personalizado
     * @returns {HTMLElement} Elemento contenedor
     */
    createAccessDeniedContainer(customMessage) {
        const container = document.createElement('div');
        container.className = 'qr-access-denied';
        
        const message = customMessage || 'Este contenido especial solo es accesible mediante códigos QR';
        
        container.innerHTML = `
            <div class="lock-icon">🔒</div>
            <h3>Acceso Restringido</h3>
            <p>${message}</p>
            <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 16px;">
                Busca los códigos QR especiales para descubrir mensajes únicos 💝
            </p>
        `;
        
        return container;
    }
    
    /* =========================================================================
       GESTIÓN DE ELEMENTOS DE LA PÁGINA
       ========================================================================= */
    
    /**
     * Oculta elementos de la historia original para dar protagonismo al QR
     */
    hideOriginalStory() {
        // Ocultar contenido principal de la historia SOLAMENTE
        const dynamicContent = document.querySelector('.dynamic-content');
        if (dynamicContent) {
            dynamicContent.style.display = 'none';
            dynamicContent.setAttribute('data-qr-hidden', 'true');
        }
        
        // Ocultar texto dinámico de la historia
        const dynamicText = document.querySelector('.dynamic-text');
        if (dynamicText) {
            dynamicText.style.display = 'none';
            dynamicText.setAttribute('data-qr-hidden', 'true');
        }
        
        // Ocultar gatito narrador
        const lottieContainer = document.querySelector('.lottie-container');
        if (lottieContainer) {
            lottieContainer.style.display = 'none';
            lottieContainer.setAttribute('data-qr-hidden', 'true');
        }
        
        // Ocultar controles de navegación de la historia
        const navigationControls = document.querySelector('.navigation-controls');
        if (navigationControls) {
            navigationControls.style.display = 'none';
            navigationControls.setAttribute('data-qr-hidden', 'true');
        }
        
        // Ocultar bubble de speech del personaje
        const characterSpeech = document.querySelector('.character-speech-bubble');
        if (characterSpeech) {
            characterSpeech.style.display = 'none';
            characterSpeech.setAttribute('data-qr-hidden', 'true');
        }
        
        // MANTENER VISIBLES: Marco del personaje y efectos de corazón
        // NO tocamos: .character-frame, .heart-effects, efectos de partículas
        
        // Marcar que estamos en modo QR
        document.body.classList.add('qr-central-mode');
        
        this.logDebug('🎭 Historia principal ocultada, elementos decorativos mantenidos');
    }
    
    /**
     * Restaura elementos de la historia original
     */
    restoreOriginalStory() {
        // Restaurar todos los elementos marcados como ocultos
        const hiddenElements = document.querySelectorAll('[data-qr-hidden="true"]');
        hiddenElements.forEach(element => {
            element.style.display = '';
            element.removeAttribute('data-qr-hidden');
        });
        
        // Restaurar contenido dinámico original si existe
        const dynamicContent = document.querySelector('#dynamicContent') || 
                              document.querySelector('.dynamic-content');
        
        if (dynamicContent && this.state.originalContent) {
            dynamicContent.innerHTML = this.state.originalContent;
            dynamicContent.style.display = '';
            dynamicContent.classList.remove('qr-central-mode');
            this.state.originalContent = null;
        }
        
        // Quitar modo QR del body
        document.body.classList.remove('qr-central-mode');
        
        // Limpiar contenedores QR
        const qrContainers = document.querySelectorAll('.qr-central-container, .qr-messages-container');
        qrContainers.forEach(container => container.remove());
        
        this.logDebug('🎭 Historia original restaurada');
    }
    
    /* =========================================================================
       SISTEMA ANTI-COLISIÓN
       ========================================================================= */
    
    /**
     * Configura el sistema anti-colisión para un contenedor
     * @param {HTMLElement} container - Contenedor a proteger
     */
    setupAntiCollisionSystem(container) {
        setTimeout(() => {
            try {
                const collisionDetected = this.detectCollisions(container);
                
                if (collisionDetected) {
                    this.resolveCollision(container);
                }
                
                // Configurar observador para cambios dinámicos
                this.setupCollisionObserver(container);
                
            } catch (error) {
                this.logError('Error en sistema anti-colisión:', error);
            }
        }, this.config.collisionCheckDelay);
    }
    
    /**
     * Detecta colisiones con otros elementos - MEJORADO PARA NO INTERFERIR
     * @param {HTMLElement} container - Elemento a verificar
     * @returns {boolean} True si hay colisión
     */
    detectCollisions(container) {
        // Solo verificar colisiones con elementos específicos de la mascota
        // NO tocar el contenido principal (.dynamic-text)
        const mascot = document.querySelector('.lottie-container');
        
        if (!mascot) return false;
        
        const containerRect = container.getBoundingClientRect();
        const mascotRect = mascot.getBoundingClientRect();
        
        return this.checkRectangleCollision(containerRect, mascotRect);
    }
    
    /**
     * Verifica colisión entre dos rectángulos
     * @param {DOMRect} rect1 - Primer rectángulo
     * @param {DOMRect} rect2 - Segundo rectángulo
     * @returns {boolean} True si hay colisión
     */
    checkRectangleCollision(rect1, rect2) {
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }
    
    /**
     * Resuelve colisión reposicionando el elemento
     * @param {HTMLElement} container - Elemento a reposicionar
     */
    resolveCollision(container) {
        this.logDebug('🚨 Colisión detectada - Reposicionando');
        
        this.state.hasCollision = true;
        
        // Aplicar estilos de reposicionamiento
        container.style.marginBottom = '200px';
        container.classList.add('collision-detected');
        
        // Remover clase después de animación
        setTimeout(() => {
            container.classList.remove('collision-detected');
        }, 1500);
        
        // Emitir evento
        this.emitEvent('qr-collision-resolved', { container });
    }
    
    /* =========================================================================
       ANIMACIONES Y TRANSICIONES
       ========================================================================= */
    
    /**
     * Anima la entrada del mensaje
     * @param {HTMLElement} container - Contenedor a animar
     */
    animateMessageEntrance(container) {
        setTimeout(() => {
            container.classList.add('show', 'magical-entrance');
        }, this.config.animationDelay);
    }
    
    /**
     * Anima la entrada del mensaje central con efecto especial
     * @param {HTMLElement} container - Contenedor central a animar
     */
    animateCentralMessageEntrance(container) {
        setTimeout(() => {
            container.classList.add('show', 'central-magical-entrance');
        }, this.config.animationDelay);
    }
    
    /**
     * Anima la entrada del acceso denegado
     * @param {HTMLElement} container - Contenedor a animar
     */
    animateAccessDeniedEntrance(container) {
        setTimeout(() => {
            container.classList.add('show');
        }, this.config.animationDelay);
    }
    
    /* =========================================================================
       UTILIDADES Y HELPERS
       ========================================================================= */
    
    /**
     * Extrae el código de mensaje de la URL
     * @returns {string|null} Código del mensaje o null
     */
    extractMessageCodeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('msg');
    }
    
    /**
     * Valida un código de mensaje
     * @param {string} code - Código a validar
     * @returns {boolean} True si es válido
     */
    validateMessageCode(code) {
        return code && this.messages.hasOwnProperty(code);
    }
    
    /**
     * Inserta elemento en el DOM - SIN INTERFERIR CON CONTENIDO PRINCIPAL
     */
    insertIntoDOM(container) {
        // Buscar contenedor específico o crear uno si es necesario
        let qrContainer = document.querySelector('.qr-messages-container');
        
        if (!qrContainer) {
            // Crear contenedor específico para mensajes QR
            qrContainer = document.createElement('div');
            qrContainer.className = 'qr-messages-container';
            qrContainer.style.cssText = `
                position: relative;
                z-index: var(--z-content);
                margin-top: 2rem;
            `;
            
            // Insertar al final del body para no interferir
            document.body.appendChild(qrContainer);
        }
        
        // Insertar el mensaje QR en su contenedor específico
        qrContainer.appendChild(container);
    }
    
    /**
     * Inserta mensaje QR en posición central (reemplaza historia)
     * @param {HTMLElement} container - Contenedor del mensaje central
     */
    insertIntoCentralPosition(container) {
        // Priorizar usar el contenedor central para centrado perfecto
        const centralContainer = document.createElement('div');
        centralContainer.className = 'qr-central-container';
        centralContainer.appendChild(container);
        document.body.appendChild(centralContainer);
        
        // También ocultar el contenido dinámico si existe
        const dynamicContent = document.querySelector('#dynamicContent') || 
                              document.querySelector('.dynamic-content') ||
                              document.querySelector('.content');
        
        if (dynamicContent) {
            // Guardar y ocultar contenido original
            this.state.originalContent = dynamicContent.innerHTML;
            dynamicContent.style.display = 'none';
            dynamicContent.setAttribute('data-qr-hidden', 'true');
        }
    }
    
    /**
     * Programa la limpieza de la URL
     */
    scheduleURLCleanup() {
        setTimeout(() => {
            if (window.history && window.history.replaceState) {
                const cleanURL = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, cleanURL);
                this.logDebug('🧹 URL limpiada por privacidad');
            }
        }, this.config.urlCleanDelay);
    }
    
    /**
     * Configura eventos del navegador - INCLUYE RESTAURACIÓN
     */
    setupBrowserEvents() {
        window.addEventListener('popstate', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const messageCode = urlParams.get('msg');
            
            // Solo actuar si había un código QR y ahora no hay
            if (this.state.currentMessage && !messageCode) {
                // Restaurar historia original
                this.restoreOriginalStory();
                
                // Limpiar estado
                this.state.currentMessage = null;
                this.state.isVisible = false;
                this.state.hasCollision = false;
            }
        });
        
        // Evento para restaurar al usar botón atrás del navegador
        window.addEventListener('beforeunload', () => {
            if (this.state.currentMessage) {
                this.restoreOriginalStory();
            }
        });
    }
    
    /**
     * Configura observador de colisiones
     * @param {HTMLElement} container - Elemento a observar
     */
    setupCollisionObserver(container) {
        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(() => {
                if (this.detectCollisions(container)) {
                    this.resolveCollision(container);
                }
            });
            
            observer.observe(document.body);
        }
    }
    
    /* =========================================================================
       SISTEMA DE EVENTOS
       ========================================================================= */
    
    /**
     * Emite un evento personalizado
     * @param {string} eventName - Nombre del evento
     * @param {Object} detail - Datos del evento
     */
    emitEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
        this.logDebug(`📡 Evento emitido: ${eventName}`, detail);
    }
    
    /* =========================================================================
       LOGGING Y DEBUG
       ========================================================================= */
    
    /**
     * Log de debug (solo en modo desarrollo)
     * @param {string} message - Mensaje a loggear
     * @param {*} data - Datos adicionales
     */
    logDebug(message, data = null) {
        if (this.config.debugMode || window.location.hostname === 'localhost') {
            console.log(`[QR-System] ${message}`, data || '');
        }
    }
    
    /**
     * Log de errores
     * @param {string} message - Mensaje de error
     * @param {Error} error - Objeto de error
     */
    logError(message, error) {
        console.error(`[QR-System] ${message}`, error);
    }
    
    /* =========================================================================
       API PÚBLICA
       ========================================================================= */
    
    /**
     * Genera URLs para códigos QR
     * @param {string} baseUrl - URL base opcional
     * @returns {Object} Objeto con URLs por código
     */
    generateQRUrls(baseUrl = window.location.origin + window.location.pathname) {
        const urls = {};
        
        Object.keys(this.messages).forEach(code => {
            urls[code] = {
                url: `${baseUrl}?msg=${code}`,
                message: this.messages[code].text,
                type: this.messages[code].type,
                priority: this.messages[code].priority
            };
        });
        
        return urls;
    }
    
    /**
     * Obtiene estadísticas del sistema
     * @returns {Object} Estadísticas actuales
     */
    getStats() {
        return {
            totalMessages: Object.keys(this.messages).length,
            currentMessage: this.state.currentMessage,
            isVisible: this.state.isVisible,
            hasCollision: this.state.hasCollision,
            config: { ...this.config }
        };
    }
    
    /**
     * Habilita/deshabilita modo debug
     * @param {boolean} enabled - Estado del modo debug
     */
    setDebugMode(enabled) {
        this.config.debugMode = enabled;
        this.logDebug(`🐛 Modo debug ${enabled ? 'habilitado' : 'deshabilitado'}`);
    }
}

/* ==========================================================================
   INICIALIZACIÓN AUTOMÁTICA
   ========================================================================== */

// Auto-inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Crear instancia global
        window.qrExclusiveSystem = new QRExclusiveSystem();
        
        // Configurar acceso a API para desarrolladores
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🎯 Sistema QR Exclusivo inicializado');
            console.log('📋 Obtener URLs de QR:', 'window.qrExclusiveSystem.generateQRUrls()');
            console.log('📊 Ver estadísticas:', 'window.qrExclusiveSystem.getStats()');
            console.log('🐛 Modo debug:', 'window.qrExclusiveSystem.setDebugMode(true)');
        }
        
    } catch (error) {
        console.error('[QR-System] Error en inicialización:', error);
    }
});

/* ==========================================================================
   EXPORTACIÓN PARA MÓDULOS
   ========================================================================== */

// Exportar para uso como módulo ES6 si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QRExclusiveSystem;
}
