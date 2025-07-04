# Documentación Técnica - JirX

## Arquitectura del Sistema Anti-Colisión

### Principios de Funcionamiento

El sistema anti-colisión implementado en `js/content.js` funciona bajo los siguientes principios:

1. **Texto Fijo**: El contenido central NUNCA se mueve, permanece centrado
2. **Mascota Adaptativa**: Solo la mascota se reposiciona para evitar colisiones
3. **Expansión Dinámica**: La página crece verticalmente cuando es necesario
4. **Detección Precisa**: Cálculo exacto incluyendo CSS transforms

### Componentes Clave

#### ContentManager (`js/content.js`)
- **Responsabilidad**: Gestión de posicionamiento inteligente
- **Métodos principales**:
  - `checkCollision()`: Detección de superposiciones
  - `expandPageForMascot()`: Expansión dinámica de página
  - `getAccuratePosition()`: Cálculo preciso de posiciones
  - `resetMascotPosition()`: Restauración de estado inicial

#### Configuración Clave
```javascript
this.minDistanceFromMascot = 80;    // Distancia mínima en píxeles
this.movementThreshold = 15;        // Umbral para activar movimiento
this.expansionMargin = 100;         // Margen para expansión de página
this.collisionCheckInterval = 100;  // Frecuencia de verificación (ms)
```

### Flujo de Detección

1. **Timer Constante**: Verificación cada 100ms
2. **Cálculo de Posiciones**: Ubicación exacta de texto y mascota
3. **Evaluación de Distancia**: Comparación con threshold mínimo
4. **Decisión de Acción**:
   - Si hay colisión → Expandir página y mover mascota
   - Si no hay colisión → Mantener estado actual

### Prevención de Rebotes

#### Problema Original
- Múltiples reposicionamientos simultáneos
- Movimientos erráticos de la mascota
- Bucles infinitos de detección

#### Solución Implementada
```javascript
// Flag para evitar operaciones múltiples
if (this.isRepositioning) return;
this.isRepositioning = true;

// Threshold para evitar micro-movimientos
const distanceNeeded = this.minDistanceFromMascot - currentDistance;
if (distanceNeeded < this.movementThreshold) {
    this.isRepositioning = false;
    return;
}

// Operación de reposicionamiento
// ...

// Liberar flag
this.isRepositioning = false;
```

### Debugging y Monitoreo

#### Controles de Teclado
- **Ctrl/Cmd + D**: Toggle debug visual
- **Ctrl/Cmd + C**: Toggle sistema anti-colisión
- **Ctrl/Cmd + R**: Reset posición mascota

#### Logs Estructurados
```javascript
// Diferentes niveles de log
Logger.debug('Información detallada de desarrollo');
Logger.info('Información general del sistema');
Logger.warn('Advertencias no críticas');
Logger.error('Errores que requieren atención');
```

#### Métricas Disponibles
```javascript
// Estadísticas del sistema
const stats = contentManager.getPositionStats();
// Retorna: { collisions, repositions, expansions, resetTime }

// Historial de posiciones
const history = contentManager.getPositionHistory();
// Array con todas las posiciones históricas
```

## Managers del Sistema

### StoryManager (`js/story.js`)
- **Función**: Gestión de narrativa y secuencias
- **Responsabilidades**: 
  - Cargar y organizar historias
  - Controlar timing de transiciones
  - Sincronización con otros managers

### CharacterManager (`js/character.js`)
- **Función**: Control de personajes y emociones
- **Responsabilidades**:
  - Cambio de personajes según contexto
  - Gestión de estados emocionales
  - Animaciones y transiciones

### EffectsManager (`js/effects.js`)
- **Función**: Efectos visuales y animaciones
- **Responsabilidades**:
  - Partículas de corazones
  - Animaciones de entrada/salida
  - Efectos ambientales

### NavigationManager (`js/navigation.js`)
- **Función**: Sistema de navegación
- **Responsabilidades**:
  - Controles de navegación
  - Sincronización entre managers
  - Gestión de estado de navegación

### CharacterFrameManager (`js/character-frame.js`)
- **Función**: Marco e interacciones del personaje
- **Responsabilidades**:
  - Gestión del marco de personajes
  - Interacciones del usuario
  - Efectos del marco

## Optimizaciones de Performance

### CSS Optimizado
- **Variables CSS**: Centralización de valores de diseño
- **GPU Acceleration**: Uso de `transform` en lugar de `left/top`
- **Transiciones Suaves**: Easing functions optimizadas

### JavaScript Eficiente
- **Debouncing**: Limitación de frecuencia en eventos
- **Memory Management**: Cleanup automático de timers
- **Modular Loading**: Carga solo de módulos necesarios

### Assets Optimizados
- **Lazy Loading**: Carga diferida de imágenes
- **Format Optimization**: PNG optimizados para web
- **Fallback Images**: URLs de respaldo desde CDN

## Compatibilidad

### Navegadores Soportados
- **Chrome/Edge**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+

### Características Requeridas
- ES6 Modules support
- CSS Grid y Flexbox
- CSS Custom Properties
- Intersection Observer API

### Fallbacks Implementados
- Imágenes de respaldo para personajes
- Graceful degradation sin JavaScript
- CSS fallbacks para navegadores antiguos

## Deployment

### GitHub Pages Configuration
El proyecto está optimizado para deployment directo en GitHub Pages sin build steps:

1. **Estructura lista**: Todos los archivos en root
2. **ES6 Modules**: Compatible con servido estático
3. **Paths relativos**: Funcionan en subdirectorios
4. **Assets optimizados**: Tamaños web-ready

### Environment Variables
El proyecto no requiere variables de entorno ni configuración especial para deployment.

---

**Documentación actualizada para v4.0 - Arquitectura Modular Perfecta**
