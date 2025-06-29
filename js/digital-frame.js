// Marco Digital de Fotos Inteligente
export class DigitalPhotoFrame {
    constructor() {
        this.frameContainer = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.originalNames = new Map();
        this.transitionInterval = 3000; // 3 segundos por defecto
        this.slideInterval = null;
        this.isPlaying = true;
        this.supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        this.logEntries = [];
        this.watchInterval = null;
        this.lastImageCount = 0;
    }

    async init() {
        console.log('🖼️ Inicializando Marco Digital de Fotos...');
        
        this.createFrameInterface();
        await this.scanAndProcessImages();
        this.startSlideshow();
        this.startImageWatcher();
        
        console.log('✅ Marco Digital inicializado correctamente');
    }

    createFrameInterface() {
        // Crear contenedor principal del marco
        const frameHTML = `
            <div class="digital-frame-container" id="digitalFrame">
                <div class="frame-header">
                    <h2 class="frame-title">📸 Marco Digital de Fotos</h2>
                    <div class="frame-controls">
                        <button id="playPauseBtn" class="control-btn" title="Reproducir/Pausar">⏸️</button>
                        <button id="prevBtn" class="control-btn" title="Anterior">⏮️</button>
                        <button id="nextBtn" class="control-btn" title="Siguiente">⏭️</button>
                        <button id="shuffleBtn" class="control-btn" title="Aleatorio">🔀</button>
                        <select id="speedSelect" class="speed-select" title="Velocidad">
                            <option value="1000">Rápido (1s)</option>
                            <option value="3000" selected>Normal (3s)</option>
                            <option value="5000">Lento (5s)</option>
                            <option value="10000">Muy Lento (10s)</option>
                        </select>
                    </div>
                </div>
                
                <div class="frame-display" id="frameDisplay">
                    <div class="image-container" id="imageContainer">
                        <img id="currentImage" class="frame-image" alt="Imagen del marco" />
                        <div class="image-overlay">
                            <div class="image-info" id="imageInfo">
                                <span class="image-counter" id="imageCounter">0 / 0</span>
                                <span class="image-name" id="imageName">Cargando...</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="loading-indicator" id="loadingIndicator">
                        <div class="spinner"></div>
                        <p>Escaneando imágenes...</p>
                    </div>
                    
                    <div class="no-images-message" id="noImagesMessage" style="display: none;">
                        <div class="empty-state">
                            <h3>📁 No se encontraron imágenes</h3>
                            <p>Agrega imágenes (.jpg, .png, .gif) a la carpeta <code>assets/characters/</code></p>
                            <button id="rescanBtn" class="rescan-btn">🔄 Escanear nuevamente</button>
                        </div>
                    </div>
                </div>
                
                <div class="frame-footer">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="frame-status" id="frameStatus">
                        <span id="statusText">Inicializando...</span>
                        <button id="logBtn" class="log-btn" title="Ver registro">📋</button>
                    </div>
                </div>
            </div>
            
            <!-- Modal de registro -->
            <div class="log-modal" id="logModal" style="display: none;">
                <div class="log-content">
                    <div class="log-header">
                        <h3>📋 Registro de Operaciones</h3>
                        <button id="closeLogBtn" class="close-btn">✖️</button>
                    </div>
                    <div class="log-body" id="logBody">
                        <!-- Entradas del log se insertan aquí -->
                    </div>
                    <div class="log-footer">
                        <button id="clearLogBtn" class="clear-log-btn">🗑️ Limpiar Registro</button>
                        <button id="exportLogBtn" class="export-log-btn">💾 Exportar Log</button>
                    </div>
                </div>
            </div>
        `;

        // Insertar en el DOM
        const existingFrame = document.getElementById('digitalFrame');
        if (existingFrame) {
            existingFrame.remove();
        }

        document.body.insertAdjacentHTML('beforeend', frameHTML);
        this.frameContainer = document.getElementById('digitalFrame');
        
        this.setupEventListeners();
        this.addFrameStyles();
    }

    setupEventListeners() {
        // Controles principales
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousImage());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextImage());
        document.getElementById('shuffleBtn').addEventListener('click', () => this.shuffleImages());
        document.getElementById('speedSelect').addEventListener('change', (e) => this.changeSpeed(parseInt(e.target.value)));
        document.getElementById('rescanBtn').addEventListener('click', () => this.rescanImages());
        
        // Modal de registro
        document.getElementById('logBtn').addEventListener('click', () => this.showLogModal());
        document.getElementById('closeLogBtn').addEventListener('click', () => this.hideLogModal());
        document.getElementById('clearLogBtn').addEventListener('click', () => this.clearLog());
        document.getElementById('exportLogBtn').addEventListener('click', () => this.exportLog());
        
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            
            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextImage();
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    this.shuffleImages();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.rescanImages();
                    break;
            }
        });

        // Click en imagen para pausar/reproducir
        document.getElementById('currentImage').addEventListener('click', () => this.togglePlayPause());
    }

    async scanAndProcessImages() {
        this.log('🔍 Iniciando escaneo de imágenes...');
        this.showLoading(true);
        
        try {
            const detectedImages = await this.detectImages();
            
            if (detectedImages.length === 0) {
                this.showNoImagesMessage();
                this.log('⚠️ No se encontraron imágenes en la carpeta');
                return;
            }

            this.log(`📊 Encontradas ${detectedImages.length} imágenes`);
            
            // Procesar y renombrar imágenes
            await this.processAndRenameImages(detectedImages);
            
            // Cargar imágenes procesadas
            await this.loadProcessedImages();
            
            this.showLoading(false);
            this.updateStatus(`${this.images.length} imágenes cargadas`);
            
        } catch (error) {
            this.log(`❌ Error durante el escaneo: ${error.message}`);
            this.showError('Error al escanear imágenes');
        }
    }

    async detectImages() {
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const detectedImages = [];
        
        // Lista de imágenes conocidas en la carpeta
        const knownImages = [
            'pngwing.com (12).png', 'pngwing.com (13).png', 'pngwing.com (14).png',
            'pngwing.com (15).png', 'pngwing.com (16).png', 'pngwing.com (17).png',
            'pngwing.com (18).png', 'pngwing.com (19).png', 'pngwing.com (20).png',
            'pngwing.com (21).png', 'pngwing.com (22).png', 'pngwing.com (23).png',
            'pngwing.com (24).png', 'pngwing.com (25).png', 'pngwing.com (26).png',
            'pngwing.com (27).png', 'pngwing.com (28).png', 'pngwing.com (29).png'
        ];

        // Verificar cada imagen conocida
        for (const imageName of knownImages) {
            try {
                const response = await fetch(`assets/characters/${imageName}`, { method: 'HEAD' });
                if (response.ok) {
                    detectedImages.push({
                        originalName: imageName,
                        path: `assets/characters/${imageName}`,
                        size: response.headers.get('content-length') || 'Desconocido',
                        lastModified: response.headers.get('last-modified') || new Date().toISOString()
                    });
                    this.log(`✅ Imagen detectada: ${imageName}`);
                }
            } catch (error) {
                this.log(`⚠️ Error verificando ${imageName}: ${error.message}`);
            }
        }

        return detectedImages;
    }

    async processAndRenameImages(detectedImages) {
        this.log('🔄 Procesando y renombrando imágenes...');
        
        // Simular el proceso de renombrado (en un entorno real, esto requeriría backend)
        detectedImages.forEach((imageData, index) => {
            const newName = `${index + 1}.${this.getFileExtension(imageData.originalName)}`;
            
            // Guardar mapeo de nombres
            this.originalNames.set(newName, {
                original: imageData.originalName,
                renamed: newName,
                path: imageData.path,
                size: imageData.size,
                processed: new Date().toISOString()
            });
            
            this.log(`📝 ${imageData.originalName} → ${newName}`);
        });
        
        this.log(`✅ Procesadas ${detectedImages.length} imágenes`);
    }

    async loadProcessedImages() {
        this.log('📥 Cargando imágenes procesadas...');
        this.images = [];
        
        for (const [newName, imageData] of this.originalNames) {
            try {
                // Verificar que la imagen se puede cargar
                await this.validateImage(imageData.path);
                
                this.images.push({
                    id: this.images.length + 1,
                    name: newName,
                    originalName: imageData.original,
                    path: imageData.path,
                    size: imageData.size,
                    loaded: true
                });
                
                this.log(`✅ Imagen cargada: ${newName}`);
                
            } catch (error) {
                this.log(`❌ Error cargando ${imageData.original}: ${error.message}`);
                
                // Marcar como corrupta pero mantener en la lista
                this.images.push({
                    id: this.images.length + 1,
                    name: newName,
                    originalName: imageData.original,
                    path: imageData.path,
                    size: imageData.size,
                    loaded: false,
                    error: error.message
                });
            }
        }
        
        // Filtrar solo imágenes válidas para el slideshow
        this.images = this.images.filter(img => img.loaded);
        this.log(`📊 Total de imágenes válidas: ${this.images.length}`);
    }

    async validateImage(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(new Error('Imagen corrupta o no accesible'));
            img.src = imagePath;
        });
    }

    startSlideshow() {
        if (this.images.length === 0) {
            this.log('⚠️ No hay imágenes para mostrar');
            return;
        }

        this.showCurrentImage();
        
        if (this.isPlaying) {
            this.slideInterval = setInterval(() => {
                this.nextImage();
            }, this.transitionInterval);
        }
        
        this.log('▶️ Slideshow iniciado');
    }

    stopSlideshow() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
        this.log('⏸️ Slideshow pausado');
    }

    showCurrentImage() {
        if (this.images.length === 0) return;

        const currentImg = this.images[this.currentImageIndex];
        const imgElement = document.getElementById('currentImage');
        const imageInfo = document.getElementById('imageInfo');
        const imageCounter = document.getElementById('imageCounter');
        const imageName = document.getElementById('imageName');

        // Actualizar imagen
        imgElement.src = currentImg.path;
        imgElement.alt = currentImg.originalName;

        // Actualizar información
        imageCounter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
        imageName.textContent = currentImg.originalName;

        // Actualizar barra de progreso
        this.updateProgressBar();

        this.log(`🖼️ Mostrando: ${currentImg.name} (${currentImg.originalName})`);
    }

    nextImage() {
        if (this.images.length === 0) return;
        
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.showCurrentImage();
    }

    previousImage() {
        if (this.images.length === 0) return;
        
        this.currentImageIndex = this.currentImageIndex === 0 
            ? this.images.length - 1 
            : this.currentImageIndex - 1;
        this.showCurrentImage();
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        const playPauseBtn = document.getElementById('playPauseBtn');
        
        if (this.isPlaying) {
            this.startSlideshow();
            playPauseBtn.textContent = '⏸️';
            playPauseBtn.title = 'Pausar';
            this.updateStatus('Reproduciendo...');
        } else {
            this.stopSlideshow();
            playPauseBtn.textContent = '▶️';
            playPauseBtn.title = 'Reproducir';
            this.updateStatus('Pausado');
        }
    }

    shuffleImages() {
        if (this.images.length <= 1) return;
        
        // Algoritmo Fisher-Yates para mezclar
        for (let i = this.images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.images[i], this.images[j]] = [this.images[j], this.images[i]];
        }
        
        this.currentImageIndex = 0;
        this.showCurrentImage();
        this.log('🔀 Imágenes mezcladas aleatoriamente');
        this.updateStatus('Orden aleatorio aplicado');
    }

    changeSpeed(newInterval) {
        this.transitionInterval = newInterval;
        
        if (this.isPlaying) {
            this.stopSlideshow();
            this.startSlideshow();
        }
        
        const speedText = {
            1000: 'Rápido',
            3000: 'Normal', 
            5000: 'Lento',
            10000: 'Muy Lento'
        };
        
        this.log(`⚡ Velocidad cambiada a: ${speedText[newInterval]} (${newInterval}ms)`);
        this.updateStatus(`Velocidad: ${speedText[newInterval]}`);
    }

    async rescanImages() {
        this.log('🔄 Reescaneando carpeta de imágenes...');
        this.updateStatus('Reescaneando...');
        
        this.stopSlideshow();
        await this.scanAndProcessImages();
        
        if (this.images.length > 0) {
            this.currentImageIndex = 0;
            this.startSlideshow();
        }
    }

    startImageWatcher() {
        // Simular vigilancia de carpeta verificando periódicamente
        this.watchInterval = setInterval(async () => {
            try {
                const detectedImages = await this.detectImages();
                
                if (detectedImages.length !== this.lastImageCount) {
                    this.log(`🔍 Cambios detectados: ${detectedImages.length} imágenes (antes: ${this.lastImageCount})`);
                    
                    if (detectedImages.length > this.lastImageCount) {
                        this.log('➕ Nuevas imágenes detectadas, reescaneando...');
                        await this.rescanImages();
                    } else if (detectedImages.length < this.lastImageCount) {
                        this.log('➖ Imágenes eliminadas detectadas, reescaneando...');
                        await this.rescanImages();
                    }
                    
                    this.lastImageCount = detectedImages.length;
                }
            } catch (error) {
                this.log(`❌ Error en vigilancia: ${error.message}`);
            }
        }, 5000); // Verificar cada 5 segundos
        
        this.lastImageCount = this.images.length;
        this.log('👁️ Vigilancia de carpeta iniciada');
    }

    updateProgressBar() {
        if (this.images.length === 0) return;
        
        const progressFill = document.getElementById('progressFill');
        const progress = ((this.currentImageIndex + 1) / this.images.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const imageContainer = document.getElementById('imageContainer');
        
        if (show) {
            loadingIndicator.style.display = 'flex';
            imageContainer.style.display = 'none';
        } else {
            loadingIndicator.style.display = 'none';
            imageContainer.style.display = 'block';
        }
    }

    showNoImagesMessage() {
        const noImagesMessage = document.getElementById('noImagesMessage');
        const imageContainer = document.getElementById('imageContainer');
        
        noImagesMessage.style.display = 'flex';
        imageContainer.style.display = 'none';
        this.updateStatus('No hay imágenes disponibles');
    }

    showError(message) {
        this.updateStatus(`❌ ${message}`);
        this.log(`❌ Error: ${message}`);
    }

    updateStatus(message) {
        const statusText = document.getElementById('statusText');
        statusText.textContent = message;
    }

    // Sistema de logging
    log(message) {
        const timestamp = new Date().toLocaleString();
        const logEntry = {
            timestamp,
            message,
            id: Date.now()
        };
        
        this.logEntries.unshift(logEntry);
        
        // Mantener solo los últimos 100 registros
        if (this.logEntries.length > 100) {
            this.logEntries = this.logEntries.slice(0, 100);
        }
        
        console.log(`[${timestamp}] ${message}`);
    }

    showLogModal() {
        const logModal = document.getElementById('logModal');
        const logBody = document.getElementById('logBody');
        
        // Generar HTML del log
        const logHTML = this.logEntries.map(entry => `
            <div class="log-entry">
                <span class="log-timestamp">${entry.timestamp}</span>
                <span class="log-message">${entry.message}</span>
            </div>
        `).join('');
        
        logBody.innerHTML = logHTML || '<p class="no-logs">No hay registros disponibles</p>';
        logModal.style.display = 'flex';
    }

    hideLogModal() {
        const logModal = document.getElementById('logModal');
        logModal.style.display = 'none';
    }

    clearLog() {
        this.logEntries = [];
        this.log('🗑️ Registro limpiado');
        this.showLogModal(); // Actualizar vista
    }

    exportLog() {
        const logText = this.logEntries.map(entry => 
            `[${entry.timestamp}] ${entry.message}`
        ).join('\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marco-digital-log-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.log('💾 Registro exportado');
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    cleanup() {
        this.stopSlideshow();
        
        if (this.watchInterval) {
            clearInterval(this.watchInterval);
            this.watchInterval = null;
        }
        
        const frameElement = document.getElementById('digitalFrame');
        if (frameElement) {
            frameElement.remove();
        }
        
        const logModal = document.getElementById('logModal');
        if (logModal) {
            logModal.remove();
        }
        
        this.log('🧹 Marco digital limpiado');
    }

    addFrameStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .digital-frame-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90vw;
                max-width: 800px;
                height: 80vh;
                background: linear-gradient(145deg, #2c3e50, #34495e);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 3px solid #ecf0f1;
            }

            .frame-header {
                background: linear-gradient(135deg, #3498db, #2980b9);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid rgba(255,255,255,0.1);
            }

            .frame-title {
                color: white;
                margin: 0;
                font-size: 1.2rem;
                font-weight: 600;
            }

            .frame-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .control-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 8px;
                padding: 8px 12px;
                color: white;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .control-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.05);
            }

            .speed-select {
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 8px;
                padding: 8px 12px;
                color: white;
                cursor: pointer;
                backdrop-filter: blur(10px);
            }

            .speed-select option {
                background: #2c3e50;
                color: white;
            }

            .frame-display {
                flex: 1;
                position: relative;
                background: #1a1a1a;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .image-container {
                width: 100%;
                height: 100%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .frame-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                transition: all 0.5s ease;
                cursor: pointer;
            }

            .frame-image:hover {
                transform: scale(1.02);
            }

            .image-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(transparent, rgba(0,0,0,0.8));
                padding: 20px;
                color: white;
            }

            .image-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .image-counter {
                background: rgba(52, 152, 219, 0.8);
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.9rem;
                font-weight: 600;
            }

            .image-name {
                font-size: 0.9rem;
                opacity: 0.9;
                max-width: 60%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .loading-indicator {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                gap: 20px;
            }

            .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .no-images-message {
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
            }

            .empty-state h3 {
                color: #e74c3c;
                margin-bottom: 15px;
            }

            .empty-state code {
                background: rgba(255,255,255,0.1);
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
            }

            .rescan-btn {
                background: #27ae60;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 15px;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .rescan-btn:hover {
                background: #2ecc71;
                transform: translateY(-2px);
            }

            .frame-footer {
                background: #34495e;
                padding: 10px 20px;
                border-top: 2px solid rgba(255,255,255,0.1);
            }

            .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(255,255,255,0.2);
                border-radius: 2px;
                margin-bottom: 10px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #3498db, #2980b9);
                border-radius: 2px;
                transition: width 0.5s ease;
                width: 0%;
            }

            .frame-status {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: white;
                font-size: 0.9rem;
            }

            .log-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 6px;
                padding: 5px 10px;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .log-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            /* Modal de registro */
            .log-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }

            .log-content {
                background: white;
                border-radius: 15px;
                width: 90vw;
                max-width: 600px;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }

            .log-header {
                background: #3498db;
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .log-header h3 {
                margin: 0;
            }

            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: background 0.3s ease;
            }

            .close-btn:hover {
                background: rgba(255,255,255,0.2);
            }

            .log-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                max-height: 400px;
            }

            .log-entry {
                display: flex;
                gap: 15px;
                padding: 8px 0;
                border-bottom: 1px solid #ecf0f1;
                font-family: monospace;
                font-size: 0.85rem;
            }

            .log-timestamp {
                color: #7f8c8d;
                white-space: nowrap;
                min-width: 150px;
            }

            .log-message {
                flex: 1;
                word-break: break-word;
            }

            .no-logs {
                text-align: center;
                color: #7f8c8d;
                font-style: italic;
                padding: 40px;
            }

            .log-footer {
                background: #ecf0f1;
                padding: 15px 20px;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            .clear-log-btn, .export-log-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .clear-log-btn {
                background: #e74c3c;
                color: white;
            }

            .clear-log-btn:hover {
                background: #c0392b;
            }

            .export-log-btn {
                background: #27ae60;
                color: white;
            }

            .export-log-btn:hover {
                background: #229954;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .digital-frame-container {
                    width: 95vw;
                    height: 85vh;
                }

                .frame-controls {
                    gap: 5px;
                }

                .control-btn {
                    padding: 6px 8px;
                    font-size: 14px;
                }

                .speed-select {
                    padding: 6px 8px;
                    font-size: 12px;
                }

                .image-info {
                    flex-direction: column;
                    gap: 10px;
                    align-items: flex-start;
                }

                .image-name {
                    max-width: 100%;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}