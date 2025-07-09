// Gestión de la historia y narrativa
export class StoryManager {
    constructor() {
        this.currentStoryIndex = 0;
        this.storyCompleted = false;
        this.storySequence = [
            {
                message: "¡Hola! Soy tu guía en esta pequeña aventura... 🐱 Haz clic en mí para descubrir un mensaje muy especial.",
                action: "welcome",
                content: null,
                useMysticName: true
            },
            {
                message: "Cada palabra aquí ha sido pensada solo para ti... 💕",
                action: "intro",
                content: {
                    title: "Un Mensaje del Corazón",
                    text: "Alguien que te valora profundamente desea compartir algo que ha estado en su mente y corazón."
                }
            },
            {
                message: "Es un mensaje que viene de un lugar de profundo cariño y observación... 💭",
                action: "buildup",
                content: {
                    title: "Reflexiones Sinceras",
                    text: "Estas palabras son de alguien que te conoce bien y ha percibido sutiles, pero importantes, cambios en tu esencia."
                }
            },
            {
                message: "¿Estás preparada para abrir tu corazón a estas palabras? ¡Haz clic para seguir! ✨",
                action: "ready",
                content: null
            },
            {
                message: "Con todo el respeto y cariño, esto es lo que he sentido la necesidad de compartir... 💖",
                action: "reveal",
                content: {
                    title: "Mi Observación, con Amor",
                    text: "He estado observando con atención y he notado que tu brillo, esa luz tan tuya, parece haberse atenuado. Esto me genera una genuina preocupación..."
                }
            },
            {
                message: "Esto es lo que mis ojos han percibido en ti... 💭",
                action: "confession1",
                content: {
                    title: "Tu Esencia, Mi Preocupación",
                    text: "Esa chispa en tus ojos, esa risa contagiosa que te definía, parecen haberse desvanecido. Te percibo más retraída, más cautelosa, como si cada paso fuera incierto."
                }
            },
            {
                message: "Y esto es lo que mi corazón siente al verte... 😔",
                action: "confession2",
                content: {
                    title: "El Dolor de Verte Así",
                    text: "No es mi intención inmiscuirme, pero me resulta imposible permanecer indiferente mientras veo cómo tu luz se apaga lentamente. Una relación verdadera debe nutrirte y hacerte crecer, no consumirte."
                }
            },
            {
                message: "Pero sobre todo, quiero que recuerdes esto... 🌟",
                action: "respect",
                content: {
                    title: "Tu Valor Inquebrantable",
                    text: "Mereces un amor que te eleve, que te respete en cada fibra de tu ser, que te dé la libertad de ser auténticamente tú. Mereces a alguien que celebre tu individualidad, no que intente opacarla. Aunque no pueda cambiar tu realidad, quiero que sepas que te valoro y admiro tal como eres."
                }
            },
            {
                message: "Y con esto, mi mensaje concluye, pero mi esperanza y apoyo permanecen... ✨",
                action: "final",
                content: {
                    title: "Una Puerta Abierta, Sin Presión",
                    text: "Si en algún momento decides que es tiempo de buscar lo que realmente mereces, si anhelas reencontrarte con esa persona increíble que sé que eres, quiero que sepas que estoy aquí. No para aprovecharme, ni para presionar, sino para ofrecerte mi apoyo incondicional. Quiero que seas feliz, desde el fondo de mi corazón porque tu felicidad ilumina mi vida, te quiero de la manera más sincera. Este mensaje es un reflejo puro de mi cariño y respeto, sin más pretensiones que tu bienestar y la esperanza de que, si hay una oportunidad, la consideres. Quiero ser una oportunidad en tu vida de que estés feliz y seas tú sin todo lo que te presiona y aflige.",
                    signature: "Con todo mi cariño y respeto ~ "
                }
            },
            {
                message: "¿Cómo te sientes después de leer esto? Tu amigo gatuno está aquí para escucharte. 😊",
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