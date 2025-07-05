// Gestión de la navegación
export class NavigationManager {
    constructor(storyManager, characterManager, contentManager, effectsManager) {
        this.storyManager = storyManager;
        this.characterManager = characterManager;
        this.contentManager = contentManager;
        this.effectsManager = effectsManager;
        this.navigationControls = null;
        this.prevButton = null;
        this.nextButton = null;
    }

    init() {
        this.navigationControls = document.getElementById('navigationControls');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');

        if (!this.prevButton || !this.nextButton || !this.navigationControls) {
            throw new Error('Elementos de navegación no encontrados');
        }

        this.setupEventListeners();
        this.updateButtons();
    }

    setupEventListeners() {
        this.prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.goToPrevious();
        });

        this.nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.goToNext();
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.goToPrevious();
            } else if (e.key === 'ArrowRight') {
                this.goToNext();
            }
        });
    }

    goToPrevious() {
        const step = this.storyManager.previous();
        if (step) {
            this.showStep(step);
            this.updateButtons();
        }
    }

    goToNext() {
        const step = this.storyManager.next();
        if (step) {
            this.showStep(step);
            this.updateButtons();
        } else if (this.storyManager.isCompleted()) {
            this.characterManager.showRandomMessage();
        }
    }

    showStep(step) {
        this.contentManager.clearContent();
        this.characterManager.stopMysticNameAnimation();

        if (step.useMysticName) {
            this.characterManager.showMysticMessage(step.message);
        } else {
            this.characterManager.showMessage(step.message, false);
        }

        if (step.content) {
            setTimeout(() => {
                this.contentManager.showContent(step.content);
            }, 500);
        }

        this.executeStoryAction(step.action);
    }

    executeStoryAction(action) {
        switch (action) {
            case "welcome":
                this.characterManager.playClickAnimation();
                break;
            case "intro":
                // Crear algunos corazones
                break;
            case "buildup":
                document.body.style.filter = 'brightness(0.9)';
                setTimeout(() => {
                    document.body.style.filter = 'brightness(1)';
                }, 2000);
                break;
            case "ready":
                this.characterManager.lottiePlayer.style.animation = 'pulse 1s ease-in-out 3';
                break;
            case "final":
                // ¡LLUVIA FINAL DE CORAZONES Y ESTRELLAS!
                setTimeout(() => {
                    this.effectsManager.createFinalRain();
                }, 1000); // Delay de 1 segundo para que aparezca el contenido primero
                break;
            case "end":
                // Efectos finales
                break;
        }
    }

    updateButtons() {
        this.prevButton.disabled = !this.storyManager.hasPrevious();
        this.nextButton.disabled = !this.storyManager.hasNext() && this.storyManager.isCompleted();
        
        // Mostrar controles
        this.navigationControls.classList.add('show');
    }

    showControls() {
        this.navigationControls.classList.add('show');
    }

    hideControls() {
        this.navigationControls.classList.remove('show');
    }
}