// utils.js - Funciones utilitarias para manejo de imágenes

/**
 * Obtiene una imagen aleatoria del array de imágenes disponibles
 * @param {Array<string>} imagenes - Array de rutas de imágenes
 * @returns {string} - Ruta de la imagen seleccionada aleatoriamente
 */
export function obtenerImagenAleatoria(imagenes) {
    const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
    return imagenes[indiceAleatorio];
}

/**
 * Carga una imagen específica y retorna una promesa
 * @param {string} ruta - Ruta de la imagen a cargar
 * @returns {Promise<Image>} - Promesa que resuelve con el objeto Image cargado
 */
export function cargarImagen(ruta) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Error al cargar imagen: ${ruta}`));
        img.src = ruta;
    });
}


// Función auxiliar para formatear el tiempo restante
export function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos}:${segs.toString().padStart(2, '0')}`;
}


/**
 * Dibuja un rectángulo con esquinas redondeadas en un contexto de canvas.
 * @param {CanvasRenderingContext2D} ctx - El contexto de dibujo del canvas.
 * @param {number} x - La coordenada X de la esquina superior izquierda.
 * @param {number} y - La coordenada Y de la esquina superior izquierda.
 * @param {number} width - El ancho del rectángulo.
 * @param {number} height - La altura del rectángulo.
 * @param {number} radius - El radio de las esquinas redondeadas.
 */
export function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}