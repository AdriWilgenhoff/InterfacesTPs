// ============================================
// UTILS.JS - Funciones Auxiliares
// ============================================

/**
 * Carga una imagen desde una ruta
 * @param {string} src - Ruta de la imagen
 * @returns {Promise<HTMLImageElement>} Promesa con la imagen cargada
 */
export function cargarImagen(src) {
    return new Promise(function(resolve, reject) {
        const imagen = new Image();
        imagen.onload = function() {
            resolve(imagen);
        };
        imagen.onerror = function() {
            reject(new Error('Error al cargar imagen: ' + src));
        };
        imagen.src = src;
    });
}

/**
 * Carga múltiples imágenes desde un array de rutas
 * @param {Array<string>} arrayRutas - Array con rutas de imágenes
 * @returns {Promise<Array<HTMLImageElement>>} Promesa con array de imágenes
 */
export function cargarImagenes(arrayRutas) {
    const promesas = [];
    for (let i = 0; i < arrayRutas.length; i++) {
        promesas.push(cargarImagen(arrayRutas[i]));
    }
    return Promise.all(promesas);
}

/**
 * Verifica si un punto está dentro de un rectángulo
 * @param {number} x - Coordenada x del punto
 * @param {number} y - Coordenada y del punto
 * @param {Object} rect - Rectángulo con propiedades x, y, ancho, alto
 * @returns {boolean} true si el punto está dentro del rectángulo
 */
export function puntoEnRectangulo(x, y, rect) {
    return x >= rect.x &&
           x <= rect.x + rect.ancho &&
           y >= rect.y &&
           y <= rect.y + rect.alto;
}

/**
 * Dibuja texto centrado en el canvas
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {string} texto - Texto a dibujar
 * @param {number} x - Coordenada x del centro
 * @param {number} y - Coordenada y del centro
 * @param {string} fuente - Fuente del texto (opcional)
 * @param {string} color - Color del texto (opcional)
 */
export function dibujarTextoCentrado(ctx, texto, x, y, fuente, color) {
    ctx.save();

    if (fuente) {
        ctx.font = fuente;
    }
    if (color) {
        ctx.fillStyle = color;
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, x, y);

    ctx.restore();
}

/**
 * Dibuja un rectángulo con bordes redondeados
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {number} x - Coordenada x
 * @param {number} y - Coordenada y
 * @param {number} ancho - Ancho del rectángulo
 * @param {number} alto - Alto del rectángulo
 * @param {number} radio - Radio de las esquinas
 */
export function dibujarRectanguloRedondeado(ctx, x, y, ancho, alto, radio) {
    ctx.beginPath();
    ctx.moveTo(x + radio, y);
    ctx.lineTo(x + ancho - radio, y);
    ctx.arcTo(x + ancho, y, x + ancho, y + radio, radio);
    ctx.lineTo(x + ancho, y + alto - radio);
    ctx.arcTo(x + ancho, y + alto, x + ancho - radio, y + alto, radio);
    ctx.lineTo(x + radio, y + alto);
    ctx.arcTo(x, y + alto, x, y + alto - radio, radio);
    ctx.lineTo(x, y + radio);
    ctx.arcTo(x, y, x + radio, y, radio);
    ctx.closePath();
}

/**
 * Calcula la distancia entre dos puntos
 * @param {number} x1 - Coordenada x del primer punto
 * @param {number} y1 - Coordenada y del primer punto
 * @param {number} x2 - Coordenada x del segundo punto
 * @param {number} y2 - Coordenada y del segundo punto
 * @returns {number} Distancia entre los puntos
 */
export function calcularDistancia(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Formatea tiempo en segundos a formato MM:SS
 * @param {number} segundos - Tiempo en segundos
 * @returns {string} Tiempo formateado
 */
export function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    const minutosStr = minutos < 10 ? '0' + minutos : minutos.toString();
    const segsStr = segs < 10 ? '0' + segs : segs.toString();
    return minutosStr + ':' + segsStr;
}

/**
 * Verifica si un punto está dentro de un círculo
 * @param {number} x - Coordenada x del punto
 * @param {number} y - Coordenada y del punto
 * @param {number} centroX - Coordenada x del centro del círculo
 * @param {number} centroY - Coordenada y del centro del círculo
 * @param {number} radio - Radio del círculo
 * @returns {boolean} true si el punto está dentro del círculo
 */
export function puntoEnCirculo(x, y, centroX, centroY, radio) {
    const distancia = calcularDistancia(x, y, centroX, centroY);
    return distancia <= radio;
}

/**
 * Copia profunda de una matriz 2D
 * @param {Array<Array>} matriz - Matriz a copiar
 * @returns {Array<Array>} Copia de la matriz
 */
export function copiarMatriz(matriz) {
    const copia = [];
    for (let i = 0; i < matriz.length; i++) {
        const fila = [];
        for (let j = 0; j < matriz[i].length; j++) {
            fila.push(matriz[i][j]);
        }
        copia.push(fila);
    }
    return copia;
}
