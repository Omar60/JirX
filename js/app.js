// Aplicación principal - Punto de entrada
import { StoryManager } from './story.js';
import { CharacterManager } from './character.js';
import { EffectsManager } from './effects.js';
import { ContentManager } from './content.js';
import { NavigationManager } from './navigation.js';

class App {
    constructor() {
        this.storyManager = new StoryManager();
        this.characterManager = new CharacterManager();
        this.effectsManager = new EffectsManager();
        this.contentManager = new ContentManager();
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
            console.log('Inicializando aplicación...');

            // Inicializar managers en orden
            this.effectsManager.init();
            this.contentManager.init();
            
            // Esperar a que Lottie se cargue
            await this.waitForLottie();
            
            this.characterManager.init();
            this.navigationManager.init();

            // Configurar interacciones principales
            this.setupMainInteractions();

            // Mostrar mensaje inicial
            this.showInitialMessage();

            this.isInitialized = true;
            console.log('Aplicación inicializada correctamente');

        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
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

    cleanup() {
        this.characterManager.cleanup();
        this.effectsManager.cleanup();
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

    // Exponer para debugging
    window.app = app;
});