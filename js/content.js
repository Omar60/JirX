// Gestión del contenido dinámico
export class ContentManager {
    constructor() {
        this.dynamicContainer = null;
    }

    init() {
        this.dynamicContainer = document.getElementById('dynamicContent');
        if (!this.dynamicContainer) {
            throw new Error('Dynamic content container no encontrado');
        }
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

        textElement.innerHTML = htmlContent;

        this.clearContent();
        this.dynamicContainer.appendChild(textElement);

        // Mostrar con animación
        requestAnimationFrame(() => {
            textElement.classList.add('show');
        });
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
}