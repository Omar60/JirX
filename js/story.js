// Gestión de la historia y narrativa con tema My Little Pony
export class StoryManager {
    constructor() {
        this.currentStoryIndex = 0;
        this.storyCompleted = false;
        this.storySequence = [
            {
                message: "¡Hola! Mi nombre es... 🐱 Haz clic en mí para comenzar esta historia especial llena de magia y amistad...",
                action: "welcome",
                content: null,
                useMysticName: true
            },
            {
                message: "Esta página fue creada especialmente para ti, con toda la magia de la amistad... ✨",
                action: "intro",
                content: {
                    title: "Para Ti, con Magia ✨",
                    text: "Alguien que se preocupa profundamente por ti quiere compartir algo muy importante. Como Rarity diría: 'Darling, mereces escuchar esto con elegancia y gracia'..."
                }
            },
            {
                message: "Hay algo muy importante que quiere decirte, como cuando Twilight comparte sabiduría... 💭",
                action: "buildup",
                content: {
                    title: "Una conversación necesaria 🌟",
                    text: "Estas palabras vienen de alguien que te conoce bien y que, como una verdadera amiga, ha notado algunos cambios en ti. La amistad significa cuidarse mutuamente..."
                }
            },
            {
                message: "¿Estás lista para escuchar? Como dice Rainbow Dash: ¡Vamos a hacer esto! 🌈",
                action: "ready",
                content: null
            },
            {
                message: "Aquí viene lo que realmente quiere decirte, con toda la honestidad de Applejack... 💖",
                action: "reveal",
                content: {
                    title: "Lo que he notado 🍎",
                    text: "He estado observando y me he dado cuenta de que has cambiado. No eres la misma persona radiante que conocí, y eso me preocupa mucho. Como Fluttershy diría suavemente: 'Si no te molesta que lo diga, creo que algo no está bien'..."
                }
            },
            {
                message: "Sus observaciones sobre tu situación, con la gentileza de Fluttershy... 🦋",
                action: "confession1",
                content: {
                    title: "Lo que veo en ti 🌸",
                    text: "Has perdido esa chispa en los ojos, esa risa genuina que te caracterizaba. Te veo más callada, más distante, como si estuvieras caminando sobre cáscaras de huevo constantemente. Incluso Pinkie Pie estaría preocupada por tu falta de sonrisas..."
                }
            },
            {
                message: "Su preocupación por lo que está pasando, con la lealtad de Rainbow Dash... 😔",
                action: "confession2",
                content: {
                    title: "Lo que me duele ver ⚡",
                    text: "No quiere entrometerse, pero no puede quedarse callado viendo cómo tu luz se va apagando poco a poco. Una relación debería hacerte florecer como el jardín de Fluttershy, no marchitarte. Mereces volar alto como Rainbow Dash, no tener las alas cortadas."
                }
            },
            {
                message: "Su mensaje de apoyo y esperanza, con la elegancia de Rarity... 💎",
                action: "respect",
                content: {
                    title: "Lo que quiero que sepas ✨",
                    text: "Mereces ser amada de manera sana, con respeto, con libertad para ser tú misma. Mereces a alguien que celebre tu esencia como Rarity celebra la belleza, no que la silencie. Eres una gema preciosa que merece brillar con toda su luz."
                }
            },
            {
                message: "Las palabras finales de apoyo, con toda la magia de la amistad... 🌟",
                action: "final",
                content: {
                    title: "Siempre aquí para ti 👑",
                    text: "Si algún día decides que mereces algo mejor, si algún día quieres recuperar esa persona increíble que eres, estaré aquí. No para aprovecharse, sino para recordarte lo valiosa que eres. Como dice Twilight: 'La amistad es la magia más poderosa', y mi amistad siempre estará aquí para ti.",
                    signature: "Con cariño, respeto y toda la magia de la amistad 💕"
                }
            },
            {
                message: "¿Qué te pareció? Como Rarity diría: '¡Darling, espero que hayas sentido toda la elegancia de este mensaje!' 😊 ¡Los personajes de Pony están aquí para apoyarte!",
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