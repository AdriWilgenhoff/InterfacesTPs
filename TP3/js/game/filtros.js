/**
 * Establece el color de un píxel específico en el ImageData
 * @param {ImageData} imageData - Datos de la imagen
 * @param {number} x - Coordenada X del píxel
 * @param {number} y - Coordenada Y del píxel
 * @param {number} r - Valor rojo (0-255)
 * @param {number} g - Valor verde (0-255)
 * @param {number} b - Valor azul (0-255)
 * @param {number} a - Valor alpha/transparencia (0-255)
 */
function setPixel(imageData, x, y, r, g, b, a) {
    const index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

/**
 * Obtiene el color de un píxel específico del ImageData
 * @param {ImageData} imageData - Datos de la imagen
 * @param {number} x - Coordenada X del píxel
 * @param {number} y - Coordenada Y del píxel
 * @returns {Object} - Objeto con propiedades r, g, b, a
 */
function getPixel(imageData, x, y) {
    const index = (x + y * imageData.width) * 4;
    return {
        r: imageData.data[index + 0],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3]
    };
}

// ===== FILTROS =====

/**
 * Convierte la imagen a escala de grises
 */
export function aplicarFiltroEscalaGrises(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const pixel = getPixel(imageData, x, y);

            const gris = pixel.r * 0.299 + pixel.g * 0.587 + pixel.b * 0.114;

            setPixel(imageData, x, y, gris, gris, gris, pixel.a);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

/**
 * Invierte los colores de la imagen (negativo fotográfico)
 * Cada canal RGB se calcula como 255 - valorOriginal
 */
export function aplicarFiltroNegativo(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const pixel = getPixel(imageData, x, y);
            setPixel(imageData, x, y, 255 - pixel.r, 255 - pixel.g, 255 - pixel.b, pixel.a);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

/**
 * Aplica un efecto sepia (tono marrón antiguo)
 */
export function aplicarFiltroSepia(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const pixel = getPixel(imageData, x, y);

            // Combinamos el cálculo y el límite en cada línea
            const r = Math.min(255, (pixel.r * 0.393) + (pixel.g * 0.769) + (pixel.b * 0.189));
            const g = Math.min(255, (pixel.r * 0.349) + (pixel.g * 0.686) + (pixel.b * 0.168));
            const b = Math.min(255, (pixel.r * 0.272) + (pixel.g * 0.534) + (pixel.b * 0.131));

            setPixel(imageData, x, y, r, g, b, pixel.a);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}


/**
 * Aplica un filtro de Desenfoque de Caja (Box Blur)
 * @param {number} radio - El tamaño del área a promediar
 */
export function aplicarFiltroBlur(ctx, canvas, radio = 1) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = imageData.width;
    const height = imageData.height;

    // Para usar getPixel, necesitamos una copia completa del ImageData, no solo del array de datos.
    const originalImageData = new ImageData(
        new Uint8ClampedArray(imageData.data),
        width,
        height
    );

    // Recorrer cada píxel (evitando los bordes para simplificar)
    for (let y = radio; y < height - radio; y++) {
        for (let x = radio; x < width - radio; x++) {
            let rSum = 0, gSum = 0, bSum = 0, count = 0;

            // 1. LEER los valores de los vecinos usando getPixel de la copia
            for (let ky = -radio; ky <= radio; ky++) {
                for (let kx = -radio; kx <= radio; kx++) {
                    const pixelVecino = getPixel(originalImageData, x + kx, y + ky);
                    rSum += pixelVecino.r;
                    gSum += pixelVecino.g;
                    bSum += pixelVecino.b;
                    count++;
                }
            }

            // Calcular el color promedio
            const rAvg = rSum / count;
            const gAvg = gSum / count;
            const bAvg = bSum / count;
            
            // Mantenemos el valor alpha original del píxel
            const alphaOriginal = getPixel(originalImageData, x, y).a;

            // 2. ESCRIBIR el nuevo valor en la imagen principal usando setPixel
            setPixel(imageData, x, y, rAvg, gAvg, bAvg, alphaOriginal);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

/**
 * Ajusta el brillo de la imagen
 * @param {number} porcentaje - Porcentaje de brillo a agregar (puede ser negativo)
 */
export function aplicarFiltroBrillo(ctx, canvas, porcentaje) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const factor = porcentaje / 100;

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const pixel = getPixel(imageData, x, y);

            // Aumentar cada canal según el factor
            let r = pixel.r + (255 * factor);
            let g = pixel.g + (255 * factor);
            let b = pixel.b + (255 * factor);

            // Limitar valores entre 0 y 255
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));

            setPixel(imageData, x, y, r, g, b, pixel.a);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

/**
 * Aplica un filtro por su nombre (helper function)
 * @param {string} nombreFiltro - Nombre del filtro a aplicar
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {HTMLCanvasElement} canvas - Elemento canvas
 */
export function aplicarFiltroPorNombre(nombreFiltro, ctx, canvas) {
    switch (nombreFiltro) {
        case 'escalaGrises':
            aplicarFiltroEscalaGrises(ctx, canvas);
            break;
        case 'sepia':
            aplicarFiltroSepia(ctx, canvas);
            break;
        case 'negativo':
            aplicarFiltroNegativo(ctx, canvas);
            break;
        case 'brillo':
            aplicarFiltroBrillo(ctx, canvas, 70);
            break;
        case 'blur':
            aplicarFiltroBlur(ctx, canvas, 2);
            break;
        case 'ninguno':
            break;
        default:
            console.warn(`Filtro desconocido: ${nombreFiltro}`);
    }
}


/* DEGRADE NATIVO*/
 export function crearDegradadoModal(ctx, colorInicio, colorFin, x, y, width, height) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height); // Degradado vertical
    gradient.addColorStop(0, `rgb(${colorInicio.r}, ${colorInicio.g}, ${colorInicio.b})`);
    gradient.addColorStop(1, `rgb(${colorFin.r}, ${colorFin.g}, ${colorFin.b})`);
    return gradient;
} 


/**
 * Dibuja un degradado vertical de 2 colores usando setPixel.
 * @param {CanvasRenderingContext2D} ctx - El contexto 2D.
 * @param {{r,g,b}} colorInicio - Objeto con el color de inicio.
 * @param {{r,g,b}} colorFin - Objeto con el color final.
 */

export function dibujarDegradado2Colores(ctx, colorInicio, colorFin) {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        // 1. Calcular el factor de progreso (0.0 en la cima, 1.0 en la base)
        const factor = t = x / (imageData.width - 1) + y / (imageData.height -1) / 2;

        // 2. Interpolar cada canal de color usando el factor
        const r = colorInicio.r + (colorFin.r - colorInicio.r) * factor;
        const g = colorInicio.g + (colorFin.g - colorInicio.g) * factor;
        const b = colorInicio.b + (colorFin.b - colorInicio.b) * factor;

        // 3. Aplicar el color calculado a toda la fila
        for (let x = 0; x < canvas.width; x++) {
            setPixel(imageData, x, y, r, g, b, 255); // 255 para alfa opaco
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

/**
 * Aplica una sombra al contexto del canvas
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {Object} config - Configuración de la sombra
 * @param {string} config.color - Color de la sombra (default: 'rgba(0,0,0,0.4)')
 * @param {number} config.blur - Difuminado (default: 10)
 * @param {number} config.offsetX - Desplazamiento X (default: 0)
 * @param {number} config.offsetY - Desplazamiento Y (default: 4)
 */
export function aplicarSombra(ctx, { color = 'rgba(0, 0, 0, 0.4)', blur = 10, offsetX = 0, offsetY = 4 } = {}) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
}

/**
 * Limpia/resetea la sombra del contexto
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 */
export function limpiarSombra(ctx) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}