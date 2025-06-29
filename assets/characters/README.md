# Carpeta de Personajes 🎭

Esta carpeta contiene las imágenes de los personajes que aparecerán en el marco decorativo de la página.

## 📁 Estructura de Archivos

Coloca las imágenes de los personajes con los siguientes nombres:

### Esquinas Principales (120x160px recomendado)
- `character-1.jpg` - Esquina superior izquierda
- `character-2.jpg` - Esquina superior derecha  
- `character-3.jpg` - Esquina inferior izquierda
- `character-4.jpg` - Esquina inferior derecha

### Laterales (80x100px recomendado)
- `character-5.jpg` - Lado izquierdo (superior)
- `character-6.jpg` - Lado izquierdo (inferior)
- `character-7.jpg` - Lado derecho (superior)
- `character-8.jpg` - Lado derecho (inferior)

### Superior e Inferior (250x200px recomendado)
- `character-9.jpg` - Parte superior (izquierda)
- `character-10.jpg` - Parte superior (derecha)
- `character-11.jpg` - Parte inferior (izquierda)
- `character-12.jpg` - Parte inferior (derecha)

## 🎨 Recomendaciones de Imágenes

- **Formato**: JPG, PNG o WebP
- **Calidad**: Alta resolución para mejor visualización
- **Aspecto**: Las imágenes se ajustarán automáticamente
- **Tamaño**: No hay límite estricto, se optimizarán automáticamente

## 🔄 Fallback

Si alguna imagen no está disponible, el sistema usará automáticamente imágenes de Pexels como respaldo.

## 📝 Nombres Personalizados

Puedes personalizar los nombres de los personajes editando el archivo `js/character-frame.js` o usando:

```javascript
window.setCharacterNames([
    'Nombre Personaje 1',
    'Nombre Personaje 2',
    // ... hasta 12 nombres
]);
```