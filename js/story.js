// Gestión de la historia y narrativa
export class StoryManager {
    constructor() {
        this.currentStoryIndex = 0;
        this.storyCompleted = false;
        this.storySequence = [
            {
                message: "¡Hola! Mi nombre es... 🐱 Haz clic en mí para comenzar esta historia especial...",
                action: "welcome",
                content: null,
                useMysticName: true
            },
            {
                message: "Esta página fue creada especialmente para ti... 💕",
                action: "intro",
                content: {
                    title: "Para Ti",
                    text: "Alguien que se preocupa por ti quiere compartir algo importante..."
                }
            },
            {
                message: "Hay algo muy importante que quiere decirte... 💭",
                action: "buildup",
                content: {
                    title: "Una conversación necesaria",
                    text: "Estas palabras vienen de alguien que te conoce y que ha notado algunos cambios..."
                }
            },
            {
                message: "¿Estás lista para escuchar? ¡Haz clic para continuar! ✨",
                action: "ready",
                content: null
            },
            {
                message: "Aquí viene lo que realmente quiere decirte... 💖",
                action: "reveal",
                content: {
                    title: "Lo que he notado",
                    text: "He estado observando y me he dado cuenta de que has cambiado. No eres la misma persona radiante que conocí, y eso me preocupa mucho..."
                }
            },
            {
                message: "Sus observaciones sobre tu situación... 💭",
                action: "confession1",
                content: {
                    title: "Lo que ve en ti",
                    text: "Has perdido esa chispa en los ojos, esa risa genuina que te caracterizaba. Te veo más callada, más distante, como si estuvieras caminando sobre cáscaras de huevo constantemente."
                }
            },
            {
                message: "Su preocupación por lo que está pasando... 😔",
                action: "confession2",
                content: {
                    title: "Lo que le duele ver",
                    text: "No quiere entrometerse, pero no puede quedarse callado viendo cómo tu luz se va apagando poco a poco. Una relación debería hacerte florecer, no marchitarte."
                }
            },
            {
                message: "Su mensaje de apoyo y esperanza... 🌟",
                action: "respect",
                content: {
                    title: "Lo que quiere que sepas",
                    text: "Mereces ser amada de manera sana, con respeto, con libertad para ser tú misma. Mereces a alguien que celebre tu esencia, no que la silencie. Y aunque no pueda cambiar tu situación, quiere que sepas que te valora exactamente como eres."
                }
            },
            {
                message: "Las palabras finales de apoyo... ✨",
                action: "final",
                content: {
                    title: "Siempre aquí para ti",
                    text: "Si algún día decides que mereces algo mejor, si algún día quieres recuperar esa persona increíble que eres, estaré aquí. No para aprovecharse, sino para recordarte lo valiosa que eres.",
                    signature: "Con cariño y respeto, [Tu nombre]"
                }
            },
            {
                message: "¿Qué te pareció? Soy tu confidente gatuno 😊 ¡Puedes hablar conmigo!",
                action: "end",
                content: null
            }
        ];
    }

    getCurrentStep() {
        return this.storySequence[this.currentStoryIndex];
    }

    hasNext() {
        return this.currentStoryIndex < this.storySequence.length - 1;
    }

    hasPrevious() {
        return this.currentStoryIndex > 0;
    }

    next() {
        if (this.hasNext()) {
            this.currentStoryIndex++;
            return this.getCurrentStep();
        }
        this.storyCompleted = true;
        return null;
    }

    previous() {
        if (this.hasPrevious()) {
            this.currentStoryIndex--;
            return this.getCurrentStep();
        }
        return null;
    }

    reset() {
        this.currentStoryIndex = 0;
        this.storyCompleted = false;
    }

    isCompleted() {
        return this.storyCompleted;
    }
}