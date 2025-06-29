// Aplicación principal - Punto de entrada
import { StoryManager } from './story.js';
import { CharacterManager } from './character.js';
import { EffectsManager } from './effects.js';
import { ContentManager } from './content.js';
import { NavigationManager } from './navigation.js';
import { CharacterFrameManager } from './character-frame.js';
import { DigitalPhotoFrame } from './digital-frame.js';

class App {
    constructor() {
        this.storyManager = new StoryManager();
        this.characterManager = new CharacterManager();
        this.effectsManager = new EffectsManager();
        this.contentManager = new ContentManager();
        this.characterFrameManager = new CharacterFrameManager();
        this.digitalFrame = new DigitalPhotoFrame();
        this.navigationManager = new NavigationManager(
            this.storyManager,
            this.characterManager,
            this.contentManager
        );
        this.isInitialized = false;
        this.frameMode = 'story'; // 'story' o 'digital'
    }

    async init() {
        if (this.isInitialized) return;

        try {
            console.log('🚀 Inicializando aplicación...');

            // Inicializar managers en orden
            this.effectsManager.init();
            this.contentManager.init();
            this.characterFrameManager.init();
            
            // Esperar a que Lottie se cargue
            await this.waitForLottie();
            
            this.characterManager.init();
            this.navigationManager.init();

            // Configurar interacciones principales
            this.setupMainInteractions();

            // Mostrar mensaje inicial
            this.showInitialMessage();

            // Mostrar marco de personajes después de un delay
            setTimeout(() => {
                this.characterFrameManager.show();
                console.log('✨ Marco de personajes activado');
            }, 2000);

            this.isInitialized = true;
            console.log('✅ Aplicación inicializada correctamente');

        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
            this.showErrorMessage();
        }
    }

    async waitForLottie() {
        return new Promise((resolve) => {
            const checkLottie = () => {
                const lottiePlayer = document.getElementById('lottiePlayer');
                if (lottiePlayer && lottiePlayer.load) {
                    resolve();
                } else {
                    setTimeout(checkLottie, 100);
                }
            };
            checkLottie();
        });
    }

    setupMainInteractions() {
        // Click principal en el personaje para avanzar la historia
        this.characterManager.lottiePlayer.addEventListener('click', () => {
            if (!this.storyManager.isCompleted()) {
                this.navigationManager.goToNext();
            } else {
                this.characterManager.showRandomMessage();
            }
            this.effectsManager.createMultipleHearts(3, this.characterManager.lottiePlayer);
        });

        // Vibración en móviles
        document.addEventListener('touchstart', () => {
            this.effectsManager.vibrate();
        });

        // Controles de teclado adicionales para el marco
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                this.characterFrameManager.toggle();
                console.log('🔄 Marco de personajes alternado');
            }
            if (e.key === 'r' || e.key === 'R') {
                this.characterFrameManager.reloadImages();
                console.log('🔄 Recargando imágenes de personajes');
            }
            if (e.key === 'd' || e.key === 'D') {
                this.toggleDigitalFrame();
                console.log('🖼️ Marco digital alternado');
            }
        });
    }

    showInitialMessage() {
        setTimeout(() => {
            const firstStep = this.storyManager.getCurrentStep();
            if (firstStep.useMysticName) {
                this.characterManager.showMysticMessage(firstStep.message);
            } else {
                this.characterManager.showMessage(firstStep.message, false);
            }
            this.navigationManager.updateButtons();
        }, 1000);
    }

    showErrorMessage() {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                        text-align: center; z-index: 9999;">
                <h3 style="color: #ff6b6b; margin-bottom: 1rem;">Error de inicialización</h3>
                <p>Hubo un problema al cargar la aplicación. Por favor, recarga la página.</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; 
                        background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Recargar
                </button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }

    // Métodos públicos para personalización
    updateCharacterImages(imageUrls) {
        this.characterFrameManager.updateCharacterImages(imageUrls);
    }

    setCharacterNames(names) {
        this.characterFrameManager.setCharacterNames(names);
    }

    toggleCharacterFrame() {
        this.characterFrameManager.toggle();
    }

    reloadCharacterImages() {
        this.characterFrameManager.reloadImages();
    }

    // Nuevo método para alternar marco digital
    async toggleDigitalFrame() {
        if (this.frameMode === 'story') {
            // Cambiar a modo marco digital
            this.frameMode = 'digital';
            this.characterFrameManager.hide();
            await this.digitalFrame.init();
            console.log('🖼️ Marco digital activado');
        } else {
            // Cambiar a modo historia
            this.frameMode = 'story';
            this.digitalFrame.cleanup();
            this.characterFrameManager.show();
            console.log('📖 Modo historia activado');
        }
    }

    // Método para inicializar solo el marco digital
    async initDigitalFrameOnly() {
        console.log('🖼️ Inicializando solo marco digital...');
        await this.digitalFrame.init();
        this.frameMode = 'digital';
    }

    cleanup() {
        this.characterManager.cleanup();
        this.effectsManager.cleanup();
        this.characterFrameManager.cleanup();
        this.digitalFrame.cleanup();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    // Verificar si se quiere iniciar directamente en modo marco digital
    const urlParams = new URLSearchParams(window.location.search);
    const frameMode = urlParams.get('mode');
    
    if (frameMode === 'digital') {
        app.initDigitalFrameOnly();
    } else {
        app.init();
    }

    // Cleanup al cerrar la página
    window.addEventListener('beforeunload', () => {
        app.cleanup();
    });

    // Exponer para debugging y personalización
    window.app = app;
    
    // Funciones de utilidad para personalización
    window.updateCharacters = (imageUrls) => app.updateCharacterImages(imageUrls);
    window.setCharacterNames = (names) => app.setCharacterNames(names);
    window.toggleFrame = () => app.toggleCharacterFrame();
    window.reloadImages = () => app.reloadCharacterImages();
    window.toggleDigitalFrame = () => app.toggleDigitalFrame();
    window.startDigitalFrame = () => app.initDigitalFrameOnly();
    
    // Mostrar instrucciones en consola
    console.log(`
🎭 MARCO DE PERSONAJES + MARCO DIGITAL - INSTRUCCIONES
====================================================

📁 Imágenes detectadas en: assets/characters/
   • ${app.characterFrameManager?.availableImages?.length || 18} imágenes PNG encontradas

⌨️  Controles de teclado:
   • F: Mostrar/ocultar marco de personajes
   • R: Recargar imágenes
   • D: Alternar marco digital de fotos

🖼️ Marco Digital de Fotos:
   • Escaneo automático de imágenes
   • Renombrado secuencial automático
   • Detección de nuevas imágenes
   • Slideshow con controles
   • Registro completo de operaciones

🎨 Personalización:
   • setCharacterNames(['Nombre1', 'Nombre2', ...])
   • updateCharacters(['url1', 'url2', ...])
   • toggleDigitalFrame() - Alternar entre modos
   • startDigitalFrame() - Solo marco digital

🚀 URLs especiales:
   • ?mode=digital - Iniciar directamente en marco digital

✨ ¡Disfruta creando tu página especial!
    `);
});