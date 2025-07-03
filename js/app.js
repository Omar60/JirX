// Aplicación principal - Punto de entrada con sistema de aleatorización
import { StoryManager } from './story.js';
import { CharacterManager } from './character.js';
import { EffectsManager } from './effects.js';
import { ContentManager } from './content.js';
import { NavigationManager } from './navigation.js';
import { CharacterFrameManager } from './character-frame.js';

class App {
    constructor() {
        this.storyManager = new StoryManager();
        this.characterManager = new CharacterManager();
        this.effectsManager = new EffectsManager();
        this.contentManager = new ContentManager();
        this.characterFrameManager = new CharacterFrameManager();
        this.navigationManager = new NavigationManager(
            this.storyManager,
            this.characterManager,
            this.contentManager
        );
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            console.log('🚀 Inicializando aplicación con sistema aleatorio...');

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
                console.log('✨ Marco de personajes aleatorio activado');
            }, 2000);

            // Añadir indicador de aleatorización
            this.addRandomizationIndicator();

            this.isInitialized = true;
            console.log('✅ Aplicación inicializada correctamente con sistema aleatorio');

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
            // NUEVO: Tecla para aleatorizar
            if (e.key === 's' || e.key === 'S') {
                this.characterFrameManager.shuffleImages();
                console.log('🎲 Aleatorizando imágenes');
            }
            // NUEVO: Mostrar estadísticas
            if (e.key === 'i' || e.key === 'I') {
                const stats = this.characterFrameManager.getRandomizationStats();
                console.log('📊 Estadísticas de aleatorización:', stats);
            }
        });
    }

    addRandomizationIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'randomization-indicator';
        indicator.innerHTML = '🎲 Aleatorio';
        indicator.title = 'Presiona S para mezclar imágenes';
        document.body.appendChild(indicator);

        // Hacer clic en el indicador para aleatorizar
        indicator.addEventListener('click', () => {
            this.characterFrameManager.shuffleImages();
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

    // NUEVO: Método para aleatorizar imágenes
    shuffleCharacterImages() {
        this.characterFrameManager.shuffleImages();
    }

    // NUEVO: Obtener estadísticas de aleatorización
    getRandomizationStats() {
        return this.characterFrameManager.getRandomizationStats();
    }

    cleanup() {
        this.characterManager.cleanup();
        this.effectsManager.cleanup();
        this.characterFrameManager.cleanup();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();

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
    window.shuffleImages = () => app.shuffleCharacterImages(); // NUEVO
    window.getStats = () => app.getRandomizationStats(); // NUEVO
    
    // Mostrar instrucciones en consola
    console.log(`
🎭 MARCO DE PERSONAJES ALEATORIO - INSTRUCCIONES
===============================================

📁 Imágenes detectadas: ${app.characterFrameManager?.detectedImages?.length || 'Detectando...'}
🎲 Sistema de aleatorización: ACTIVADO

⌨️  Controles de teclado:
   • F: Mostrar/ocultar marco
   • R: Recargar imágenes
   • S: 🎲 ALEATORIZAR imágenes (¡NUEVO!)
   • I: Mostrar estadísticas de aleatorización

🎨 Personalización:
   • setCharacterNames(['Nombre1', 'Nombre2', ...])
   • updateCharacters(['url1', 'url2', ...])
   • shuffleImages() - 🎲 Mezclar orden aleatorio
   • getStats() - Ver estadísticas de aleatorización
   • reloadImages() - después de añadir imágenes

🎲 CARACTERÍSTICAS ALEATORIAS:
   • Cada carga usa un orden completamente aleatorio
   • Presiona S para re-aleatorizar sin recargar
   • Tooltips muestran el número de imagen original
   • Indicador visual en esquina inferior izquierda

✨ ¡Disfruta de tu collage siempre diferente!
    `);
});