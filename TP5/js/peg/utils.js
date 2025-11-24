/**
 * Carga una imagen desde una ruta
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
 */
export function puntoEnRectangulo(x, y, rect) {
    return x >= rect.x &&
           x <= rect.x + rect.ancho &&
           y >= rect.y &&
           y <= rect.y + rect.alto;
}

/**
 * Dibuja texto centrado en el canvas
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
 */
export function calcularDistancia(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Formatea tiempo en segundos a formato MM:SS
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
 */
export function puntoEnCirculo(x, y, centroX, centroY, radio) {
    const distancia = calcularDistancia(x, y, centroX, centroY);
    return distancia <= radio;
}

/**
 * Copia profunda de una matriz 2D
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
