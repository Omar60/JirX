// Personaje Lottie - Narrador Interactivo
let lottiePlayer = null;
let characterSpeech = null;
let characterMessage = null;

// Variables para navegación (se inicializarán cuando el DOM esté listo)
let navigationControls = null;
let prevButton = null;
let nextButton = null;

// Historia del narrador - Secuencia de mensajes CON CONTENIDO
const storySequence = [
    {
        message: "¡Hola! Mi nombre es... 🐱 Haz clic en mí para comenzar esta historia especial...",
        action: "welcome",
        content: null,
        useMysticName: true // Indicador especial para usar animación mística
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
        message: "Su preocupación por lo que está pasando... �",
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

// Mensajes aleatorios para interacciones extra
const randomMessages = [
    "¡Ronroneo! 😸",
    "¿Necesitas un abrazo virtual? 🤗",
    "Estoy aquí para ti 💕",
    "¡Miau de apoyo! 🐾",
    "Eres especial ✨",
    "El amor es hermoso 💖",
    // Mensajes místicos ocasionales
    () => `¡Soy ${generateMysticName(4)}! ✨`,
    () => `Mi verdadero nombre es ${generateMysticName(6)} 🔮`,
    () => `${generateMysticName(5)} significa 'amigo' en idioma místico 🌟`
];

let currentStoryIndex = 0;
let storyCompleted = false;
let messageCard = null;

// Función para mostrar el siguiente mensaje de la historia
function showNextStoryMessage() {
    console.log('showNextStoryMessage llamada, currentStoryIndex:', currentStoryIndex);
    
    if (currentStoryIndex < storySequence.length) {
        const currentStep = storySequence[currentStoryIndex];
        console.log('Paso actual:', currentStep);
        
        // Primero limpiar contenido anterior si es necesario
        if (currentStoryIndex > 0) {
            clearDynamicContent();
        }        // Mostrar mensaje del gatito con un pequeño delay
        setTimeout(() => {
            // Parar cualquier animación de nombre anterior
            stopMysticNameAnimation();
            
            // Si es un mensaje místico, usar animación especial
            if (currentStep.useMysticName) {
                showMysticMessage(currentStep.message);
            } else {
                showCharacterMessageWithAdjustment(currentStep.message);
            }
        }, 200);
        
        // Mostrar contenido dinámico si existe con más delay
        if (currentStep.content) {
            console.log('Mostrando contenido:', currentStep.content);
            setTimeout(() => {
                showDynamicContent(currentStep.content);
            }, 1000); // Un segundo después del mensaje del gatito
        } else {
            console.log('No hay contenido para este paso');
        }
        
        // Ejecutar la acción correspondiente
        executeStoryAction(currentStep.action);
        
        currentStoryIndex++;
        
        // Auto-ocultar el diálogo después de un tiempo, excepto en ciertos pasos importantes
        if (currentStep.action !== "welcome" && currentStep.action !== "ready" && currentStep.action !== "end") {
            setTimeout(() => {
                characterSpeech.classList.remove('show');
            }, 6000); // Más tiempo para leer mensajes largos
        }
        
        // Si completamos la historia, activar modo libre
        if (currentStoryIndex >= storySequence.length) {
            storyCompleted = true;
            setTimeout(() => {
                showCharacterMessageWithAdjustment("¡Historia completa! Ahora puedes hablar conmigo libremente 😊");
                setTimeout(() => {
                    characterSpeech.classList.remove('show');
                }, 4000);
            }, 8000);
        }
    } else {
        // Modo libre: mensajes aleatorios
        console.log('Modo libre activado');
        showRandomMessage();
    }
}

// Función para ejecutar acciones según el paso de la historia
function executeStoryAction(action) {
    switch(action) {
        case "welcome":
            // Hacer que el gatito sea más visible
            lottiePlayer.style.transform = 'scale(1.1)';
            setTimeout(() => {
                lottiePlayer.style.transform = 'scale(1)';
            }, 500);
            break;
            
        case "intro":
            // Crear algunos corazones
            createMultipleHearts(3);
            break;
            
        case "buildup":
            // Efecto de misterio - oscurecer un poco el fondo
            document.body.style.filter = 'brightness(0.9)';
            setTimeout(() => {
                document.body.style.filter = 'brightness(1)';
            }, 2000);
            break;
            
        case "ready":
            // Parpadear para llamar la atención
            lottiePlayer.style.animation = 'pulse 1s ease-in-out 3';
            break;
            
        case "reveal":
            // Mostrar el mensaje principal gradualmente
            if (!messageCard) {
                messageCard = document.querySelector('.message-card');
            }
            if (messageCard) {
                messageCard.style.opacity = '0.3';
                messageCard.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    messageCard.style.transition = 'all 2s ease';
                    messageCard.style.opacity = '1';
                    messageCard.style.transform = 'translateY(0)';
                }, 1000);
            }
            break;
            
        case "reading":
            // Crear efecto de lectura
            createReadingEffect();
            break;
            
        case "reaction":
            // Gatito expectante
            lottiePlayer.style.transform = 'scale(1.05)';
            break;
            
        case "end":
            // Efecto final de celebración
            createMultipleHearts(8);
            createStarBurst();
            break;
    }
}

// Función para mostrar mensaje aleatorio (modo libre)
function showRandomMessage() {
    // Parar animación de nombre
    stopMysticNameAnimation();
    
    const randomItem = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    // Si es una función, ejecutarla para obtener el mensaje
    const randomMsg = typeof randomItem === 'function' ? randomItem() : randomItem;
    showCharacterMessageWithAdjustment(randomMsg);
    
    setTimeout(() => {
        characterSpeech.classList.remove('show');
    }, 3000);
    
    createMultipleHearts(2);
}

// Función para efecto de lectura
function createReadingEffect() {
    const confessionTexts = document.querySelectorAll('.confession-text');
    confessionTexts.forEach((text, index) => {
        setTimeout(() => {
            text.style.border = '2px solid rgba(102, 126, 234, 0.3)';
            text.style.borderRadius = '8px';
            text.style.padding = '10px';
            text.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                text.style.border = 'none';
                text.style.padding = '0 0.5rem';
            }, 2000);
        }, index * 3000);
    });
}

// Función para crear explosión de estrellas
function createStarBurst() {
    const playerRect = lottiePlayer.getBoundingClientRect();
    const centerX = playerRect.left + playerRect.width / 2;
    const centerY = playerRect.top + playerRect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const angle = (i * 30) * Math.PI / 180;
            const distance = 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const star = document.createElement('div');
            star.innerHTML = '⭐';
            star.style.position = 'fixed';
            star.style.left = centerX + 'px';
            star.style.top = centerY + 'px';
            star.style.pointerEvents = 'none';
            star.style.fontSize = '20px';
            star.style.zIndex = '1000';
            star.style.transition = 'all 1s ease-out';
            
            document.body.appendChild(star);
            
            setTimeout(() => {
                star.style.left = x + 'px';
                star.style.top = y + 'px';
                star.style.opacity = '0';
            }, 100);
            
            setTimeout(() => {
                star.remove();
            }, 1200);
        }, i * 100);
    }
}

// Crear múltiples corazones (cantidad personalizable)
function createMultipleHearts(count = 5) {
    const playerRect = lottiePlayer.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createHeart(
                playerRect.left + Math.random() * playerRect.width,
                playerRect.top + Math.random() * playerRect.height
            );
        }, i * 200);
    }
}

// Configurar interacciones con Lottie como narrador
function setupLottieInteractions() {
    // Click principal - avanzar en la historia
    lottiePlayer.addEventListener('click', () => {
        // Reiniciar la animación
        lottiePlayer.stop();
        lottiePlayer.play();
        
        // Avanzar en la historia o mostrar mensaje aleatorio
        if (!storyCompleted) {
            showNextStoryMessage();
        } else {
            showRandomMessage();
        }
        
        // Efecto visual
        lottiePlayer.style.transform = 'scale(1.2)';
        setTimeout(() => {
            lottiePlayer.style.transform = 'scale(1)';
        }, 200);
    });      // Hover effect
    lottiePlayer.addEventListener('mouseenter', () => {
        if (storyCompleted) {
            // 30% de probabilidad de mostrar nombre místico
            if (Math.random() < 0.3) {
                const mysticName = generateMysticName(5);
                showCharacterMessageWithAdjustment(`¡Soy ${mysticName}! ¡Haz clic para hablar! ✨`);
            } else {
                showCharacterMessageWithAdjustment("¡Haz clic para hablar conmigo! 😊");
            }
            setTimeout(() => {
                characterSpeech.classList.remove('show');
            }, 2000);
        }
        lottiePlayer.style.transform = 'scale(1.05)';
    });
    
    lottiePlayer.addEventListener('mouseleave', () => {
        lottiePlayer.style.transform = 'scale(1)';
    });
}

// Función para actualizar el estado de los botones de navegación
function updateNavigationButtons() {
    console.log('Actualizando botones de navegación...');
    console.log('currentStoryIndex:', currentStoryIndex);
    console.log('storySequence.length:', storySequence.length);
    console.log('navigationControls existe:', !!navigationControls);
    
    if (!prevButton || !nextButton) {
        console.error('Botones no encontrados:', { prevButton, nextButton });
        return;
    }
    
    // Habilitar/deshabilitar botón anterior
    prevButton.disabled = currentStoryIndex <= 0;
    
    // Habilitar/deshabilitar botón siguiente
    nextButton.disabled = currentStoryIndex >= storySequence.length - 1;
      // Mostrar controles siempre para debug
    if (currentStoryIndex >= 0) {
        console.log('Mostrando controles de navegación (modo debug)');
        navigationControls.classList.add('show');
    }
}

// Función para ir al mensaje anterior
function goToPreviousMessage() {
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        showCurrentMessage();
        updateNavigationButtons();
    }
}

// Función para ir al siguiente mensaje
function goToNextMessage() {
    if (currentStoryIndex < storySequence.length - 1) {
        currentStoryIndex++;
        showCurrentMessage();
        updateNavigationButtons();
    } else if (currentStoryIndex >= storySequence.length - 1 && !storyCompleted) {
        // Si llegamos al final, marcar como completado
        storyCompleted = true;
        updateNavigationButtons();
    }
}

// Función para mostrar el mensaje actual
function showCurrentMessage() {
    const currentStep = storySequence[currentStoryIndex];
    console.log('Mostrando mensaje:', currentStoryIndex, currentStep);
    
    // Limpiar contenido anterior
    clearDynamicContent();
    
    // Parar cualquier animación de nombre anterior
    stopMysticNameAnimation();
    
    // Mostrar mensaje del gatito
    if (currentStep.useMysticName) {
        showMysticMessage(currentStep.message);
    } else {
        showCharacterMessageWithAdjustment(currentStep.message);
    }
    
    // Mostrar contenido dinámico si existe
    if (currentStep.content) {
        setTimeout(() => {
            showDynamicContent(currentStep.content);
        }, 500);
    }
    
    // Ejecutar la acción correspondiente
    executeStoryAction(currentStep.action);
}

// Función para configurar la navegación
function setupNavigation() {
    console.log('Configurando navegación...');
    
    // Inicializar variables de navegación
    navigationControls = document.getElementById('navigationControls');
    prevButton = document.getElementById('prevButton');
    nextButton = document.getElementById('nextButton');
    
    console.log('navigationControls:', navigationControls);
    console.log('prevButton:', prevButton);
    console.log('nextButton:', nextButton);
    
    if (prevButton && nextButton && navigationControls) {
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Clic en botón anterior');
            goToPreviousMessage();
        });
        
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Clic en botón siguiente');
            goToNextMessage();
        });
        
        // Inicializar estado de botones
        updateNavigationButtons();
        console.log('Navegación configurada correctamente');
    } else {
        console.error('No se pudieron encontrar los botones de navegación');
        console.error('navigationControls:', navigationControls);
        console.error('prevButton:', prevButton);
        console.error('nextButton:', nextButton);
    }
}

// Configurar todo cuando esté listo - INICIALIZACIÓN ÚNICA
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando...');
    
    // Inicializar todas las variables del DOM
    lottiePlayer = document.getElementById('lottiePlayer');
    characterSpeech = document.getElementById('characterSpeech');
    characterMessage = document.getElementById('characterMessage');
    
    const dynamicContainer = document.getElementById('dynamicContent');
    
    console.log('Elementos encontrados:', {
        lottiePlayer,
        characterSpeech,
        characterMessage,
        dynamicContainer
    });
    
    // Verificar que los elementos críticos existen
    if (!lottiePlayer || !characterSpeech || !characterMessage) {
        console.error('Error: No se encontraron elementos críticos del DOM');
        return;
    }
      // Esperar a que Lottie se cargue
    setTimeout(() => {
        setupLottieInteractions();
        setupNavigation();
        console.log('Interacciones configuradas');
    }, 1000);
      // Mostrar solo el primer mensaje con animación (sin avanzar la historia)
    setTimeout(() => {
        console.log('Mostrando mensaje inicial...');
        const firstMessage = storySequence[0];
        
        // Test de funcionalidad básica
        console.log('Test: Mostrando mensaje básico primero');
        if (characterMessage && characterSpeech) {
            characterMessage.textContent = "¡Hola! Test de mensaje 🐱";
            characterSpeech.classList.add('show');
            console.log('Test básico aplicado');
        }
        
        // Luego aplicar el mensaje místico
        setTimeout(() => {
            if (firstMessage.useMysticName) {
                showMysticMessage(firstMessage.message);
            } else {
                showCharacterMessageWithAdjustment(firstMessage.message);
            }
        }, 1000);
        
        // Actualizar botones de navegación
        updateNavigationButtons();
    }, 2000);
    
    // Inicializar observador de elementos
    observeElements();
    
    // Primer corazón después de cargar
    setTimeout(() => {
        createRandomHeart();
    }, 2000);
});

// Función para crear corazones interactivos
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.className = 'interactive-heart';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    document.getElementById('heartsContainer').appendChild(heart);
    
    // Eliminar el corazón después de la animación
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

// Crear corazones al hacer clic
document.addEventListener('click', (e) => {
    createHeart(e.clientX, e.clientY);
});

// Crear corazones al tocar en móvil
document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    createHeart(touch.clientX, touch.clientY);
});

// Función para crear corazones aleatorios
function createRandomHeart() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createHeart(x, y);
}

// Crear corazones aleatorios cada cierto tiempo (menos frecuente)
setInterval(createRandomHeart, 5000);

// Efecto de escritura para los mensajes
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Animación de entrada para los elementos
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
            }
        });
    });

    document.querySelectorAll('.message-card').forEach(el => {
        observer.observe(el);
    });
}

// Función para añadir partículas de estrellas
function createStarParticle() {
    const star = document.createElement('div');
    star.innerHTML = '✨';
    star.style.position = 'fixed';
    star.style.color = 'rgba(255, 255, 255, 0.8)';
    star.style.fontSize = '16px';
    star.style.left = Math.random() * (window.innerWidth - 20) + 'px'; // Evitar que salga del viewport
    star.style.top = '-30px'; // Empezar más arriba
    star.style.pointerEvents = 'none';
    star.style.zIndex = '2';
    star.style.animation = 'fall 5s linear forwards';
    star.style.willChange = 'transform, opacity'; // Optimización de rendimiento
    
    document.body.appendChild(star);
    
    setTimeout(() => {
        if (star && star.parentNode) {
            star.remove();
        }
    }, 5000);
}

// Añadir estilos para la animación de caída mejorada
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-30px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Crear partículas de estrellas cada cierto tiempo (menos frecuente)
setInterval(createStarParticle, 6000); // Cambiado de 4000 a 6000ms

// Efecto de cursor personalizado
document.addEventListener('mousemove', (e) => {
    // Crear un pequeño brillo en el cursor
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.fontSize = '12px';
    sparkle.style.color = 'rgba(255, 255, 255, 0.8)';
    sparkle.style.zIndex = '1000';
    sparkle.style.animation = 'sparkle 0.6s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 600);
});

// Añadir animación de brillo
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 1;
            transform: scale(0);
        }
        50% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Eliminar la inicialización duplicada
// Inicializar cuando la página esté cargada
// document.addEventListener('DOMContentLoaded', () => {
//     observeElements();
//     
//     // Pequeña delay para la primera carga
//     setTimeout(() => {
//         createRandomHeart();
//     }, 2000);
// });

// Función para hacer vibrar el dispositivo (si está disponible)
function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Vibrar cuando se toca la pantalla
document.addEventListener('touchstart', () => {
    vibrate();
});

// Efecto especial para el día de San Valentín
function checkSpecialDate() {
    const today = new Date();
    const valentine = new Date(today.getFullYear(), 1, 14); // 14 de febrero
    
    if (today.getMonth() === valentine.getMonth() && today.getDate() === valentine.getDate()) {
        // Añadir efectos especiales para San Valentín
        document.body.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ff6b9d 100%)';
        
        // Crear más corazones
        setInterval(createRandomHeart, 1000);
    }
}

checkSpecialDate();

// Función para mostrar contenido dinámico
function showDynamicContent(content) {
    console.log('showDynamicContent llamada con:', content);
    const dynamicContainer = document.getElementById('dynamicContent');
    console.log('dynamicContainer encontrado:', dynamicContainer);
    
    if (!dynamicContainer) {
        console.error('Dynamic container no encontrado!');
        return;
    }
    
    if (content) {
        const textElement = document.createElement('div');
        textElement.className = 'dynamic-text';
        
        let htmlContent = '';
        if (content.title) {
            htmlContent += `<h2>${content.title}</h2>`;
        }
        if (content.text) {
            htmlContent += `<p>${content.text}</p>`;
        }
        if (content.signature) {
            htmlContent += `<p class="signature">${content.signature}</p>`;
        }
        
        textElement.innerHTML = htmlContent;
        console.log('Contenido HTML creado:', htmlContent);
        
        // Limpiar contenido anterior
        dynamicContainer.innerHTML = '';
        dynamicContainer.appendChild(textElement);
        
        // Mostrar con animación
        requestAnimationFrame(() => {
            textElement.classList.add('show');
            console.log('Clase show añadida');
        });
    } else {
        console.log('No hay contenido para mostrar');
        // Limpiar si no hay contenido
        dynamicContainer.innerHTML = '';
    }
}

// Función para limpiar contenido dinámico
function clearDynamicContent() {
    const dynamicContainer = document.getElementById('dynamicContent');
    if (dynamicContainer) {
        // Añadir efecto de salida antes de limpiar
        const existingContent = dynamicContainer.querySelector('.dynamic-text');
        if (existingContent) {
            existingContent.style.opacity = '0';
            existingContent.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                dynamicContainer.innerHTML = '';
            }, 300);
        } else {
            dynamicContainer.innerHTML = '';
        }
    }
}

// Función para ajustar el tamaño de la burbuja según el contenido
function adjustSpeechBubble() {
    const bubble = characterSpeech;
    const message = characterMessage.textContent;
    
    // Resetear estilos
    bubble.style.width = 'auto';
    
    // Si el mensaje es muy largo, permitir más líneas
    if (message.length > 80) {
        bubble.style.maxWidth = '300px';
        bubble.style.whiteSpace = 'normal';
    } else if (message.length > 50) {
        bubble.style.maxWidth = '250px';
        bubble.style.whiteSpace = 'normal';
    } else {
        bubble.style.maxWidth = '200px';
        bubble.style.whiteSpace = 'normal'; // Siempre permitir wrap
    }
    
    // En móviles, ajustar mejor
    if (window.innerWidth < 768) {
        bubble.style.maxWidth = '200px';
        bubble.style.right = '-10px';
        bubble.style.whiteSpace = 'normal';
    }
}

// Función para mostrar mensaje del gatito con ajuste automático y debug
function showCharacterMessageWithAdjustment(message) {
    console.log('Mostrando mensaje del gatito:', message);
    
    if (!characterMessage || !characterSpeech) {
        console.error('Error: characterMessage o characterSpeech no están definidos');
        return;
    }
    
    characterMessage.textContent = message;
    adjustSpeechBubble();
    characterSpeech.classList.add('show');
    console.log('Mensaje mostrado y burbuja visible');
}

// Función para mostrar mensaje con animación mística
function showMysticMessage(finalMessage) {
    console.log('Mostrando mensaje místico:', finalMessage);
    
    if (!characterSpeech || !characterMessage) {
        console.error('Error: characterSpeech o characterMessage no están definidos');
        return;
    }
    
    // Mostrar la burbuja primero
    characterSpeech.classList.add('show');
    
    // Establecer el mensaje base para la animación
    const baseMessage = "¡Hola! Mi nombre es ᚦᚱᚨᚾᚲ 🐱 Haz clic en mí para comenzar esta historia especial...";
    characterMessage.textContent = baseMessage;
    
    // Iniciar la animación continua del nombre
    startMysticNameAnimation(characterMessage);
    
    console.log('Animación mística continua iniciada');
}

// Caracteres místicos tipo encantamiento de Minecraft
const enchantmentChars = [
    'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ',
    'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ', '☆', '✦', '✧', '※', '◊', '◈', '⬟', '⬢',
    '⟐', '⟑', '⌬', '⌭', '⌮', '⟡', '⟢', '⟣', '⬡', '◉', '⬢', '⬣', '⟐', '◈'
];

// Función para generar nombre místico aleatorio
function generateMysticName(length = 8) {
    let name = '';
    for (let i = 0; i < length; i++) {
        name += enchantmentChars[Math.floor(Math.random() * enchantmentChars.length)];
    }
    return name;
}

// Función para animar el nombre constantemente como en Minecraft
let nameAnimationInterval = null;

function startMysticNameAnimation(element) {
    console.log('Iniciando animación mística para elemento:', element);
    
    // Limpiar animación anterior si existe
    if (nameAnimationInterval) {
        clearInterval(nameAnimationInterval);
    }
    
    nameAnimationInterval = setInterval(() => {
        const mysticName = generateMysticName(6);
        const currentText = element.textContent;
        
        console.log('Texto actual:', currentText);
        console.log('Nombre místico generado:', mysticName);
        
        // Mantener el resto del mensaje, solo cambiar el nombre
        if (currentText.includes('Mi nombre es')) {
            const beforeName = currentText.split('Mi nombre es')[0];
            const afterName = currentText.split('🐱')[1] || ' 🐱 Haz clic en mí para comenzar esta historia especial...';
            const newText = `${beforeName}Mi nombre es ${mysticName} 🐱${afterName}`;
            element.textContent = newText;
            console.log('Texto actualizado:', newText);
        } else {
            console.log('No se encontró "Mi nombre es" en el texto');
        }
    }, 150); // Cambiar cada 150ms
}

function stopMysticNameAnimation() {
    if (nameAnimationInterval) {
        clearInterval(nameAnimationInterval);
        nameAnimationInterval = null;
    }
}
