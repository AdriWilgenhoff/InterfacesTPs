// filtros.js - Funciones para aplicar filtros visuales a imágenes en canvas

// ===== FUNCIONES AUXILIARES =====

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
 * Calcula el promedio de RGB para cada píxel
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
 * Invierte los colores de la imagen (negativo fotográfico)
 * Cada canal RGB se calcula como 255 - valorOriginal
 */
export function aplicarFiltroNegativo(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const pixel = getPixel(imageData, x, y);
            
            // Invertir cada canal
            const r = 255 - pixel.r;
            const g = 255 - pixel.g;
            const b = 255 - pixel.b;
            
            setPixel(imageData, x, y, r, g, b, pixel.a);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

/**
 * Aplica un efecto sepia (tono marrón antiguo)
 * Usa una matriz de transformación estándar para sepia
 */
export function aplicarFiltroSepia(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const pixel = getPixel(imageData, x, y);
            
            // Fórmula estándar de sepia
            let r = (pixel.r * 0.393) + (pixel.g * 0.769) + (pixel.b * 0.189);
            let g = (pixel.r * 0.349) + (pixel.g * 0.686) + (pixel.b * 0.168);
            let b = (pixel.r * 0.272) + (pixel.g * 0.534) + (pixel.b * 0.131);
            
            // Limitar a 255 máximo
            r = Math.min(255, r);
            g = Math.min(255, g);
            b = Math.min(255, b);
            
            setPixel(imageData, x, y, r, g, b, pixel.a);
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

/**
 * Crea efecto pixelado agrupando píxeles en bloques
 * @param {number} tamanioBloque - Tamaño de cada bloque de píxeles (default: 10)
 */
export function aplicarFiltroPixelado(ctx, canvas, tamanioBloque = 10) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Recorrer la imagen en bloques
    for (let y = 0; y < imageData.height; y += tamanioBloque) {
        for (let x = 0; x < imageData.width; x += tamanioBloque) {
            let rSum = 0, gSum = 0, bSum = 0, count = 0;
            
            // Calcular promedio de color del bloque
            for (let by = 0; by < tamanioBloque && y + by < imageData.height; by++) {
                for (let bx = 0; bx < tamanioBloque && x + bx < imageData.width; bx++) {
                    const pixel = getPixel(imageData, x + bx, y + by);
                    rSum += pixel.r;
                    gSum += pixel.g;
                    bSum += pixel.b;
                    count++;
                }
            }
            
            const rAvg = rSum / count;
            const gAvg = gSum / count;
            const bAvg = bSum / count;
            
            // Aplicar el promedio a todos los píxeles del bloque
            for (let by = 0; by < tamanioBloque && y + by < imageData.height; by++) {
                for (let bx = 0; bx < tamanioBloque && x + bx < imageData.width; bx++) {
                    const pixel = getPixel(imageData, x + bx, y + by);
                    setPixel(imageData, x + bx, y + by, rAvg, gAvg, bAvg, pixel.a);
                }
            }
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
    switch(nombreFiltro) {
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
            aplicarFiltroBrillo(ctx, canvas, 30); // 30% más de brillo
            break;
        case 'pixelado':
            aplicarFiltroPixelado(ctx, canvas, 10); // Bloques de 10x10 píxeles
            break;
        case 'ninguno':
            // No aplicar ningún filtro
            break;
        default:
            console.warn(`Filtro desconocido: ${nombreFiltro}`);
    }
}


/* DEGRADE */

/**
 * Dibuja un degradado vertical de 2 colores usando setPixel.
 * @param {CanvasRenderingContext2D} ctx - El contexto 2D.
 * @param {{r,g,b}} colorInicio - Objeto con el color de inicio.
 * @param {{r,g,b}} colorFin - Objeto con el color final.
 */
function dibujarDegradado2Colores(ctx, colorInicio, colorFin) {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        // 1. Calcular el factor de progreso (0.0 en la cima, 1.0 en la base)
        const factor = y / (canvas.height - 1);

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

// --- Ejemplo de uso ---
// const color1 = { r: 255, g: 0, b: 0 }; // Rojo
// const color2 = { r: 0, g: 0, b: 255 }; // Azul
// dibujarDegradado2Colores(ctx, color1, color2);

/**
 * Dibuja un degradado vertical de 3 colores usando setPixel.
 * @param {CanvasRenderingContext2D} ctx
 * @param {{r,g,b}} color1 - Color de inicio.
 * @param {{r,g,b}} color2 - Color del medio.
 * @param {{r,g,b}} color3 - Color final.
 */
 export function dibujarDegradado3Colores(ctx, color1, color2, color3) {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const mitad = canvas.height / 2;

    for (let y = 0; y < canvas.height; y++) {
        let r, g, b;

        if (y < mitad) {
            // --- PRIMERA MITAD: de color1 a color2 ---
            // El factor debe ir de 0 a 1 dentro de esta mitad
            const factor = y / mitad;
            r = color1.r + (color2.r - color1.r) * factor;
            g = color1.g + (color2.g - color1.g) * factor;
            b = color1.b + (color2.b - color1.b) * factor;
        } else {
            // --- SEGUNDA MITAD: de color2 a color3 ---
            // El factor también debe ir de 0 a 1 dentro de esta segunda mitad
            const factor = (y - mitad) / mitad;
            r = color2.r + (color3.r - color2.r) * factor;
            g = color2.g + (color3.g - color2.g) * factor;
            b = color2.b + (color3.b - color2.b) * factor;
        }

        for (let x = 0; x < canvas.width; x++) {
            setPixel(imageData, x, y, r, g, b, 255);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// --- Ejemplo de uso ---
// const c1 = { r: 255, g: 0, b: 0 }; // Rojo
// const c2 = { r: 255, g: 255, b: 0 }; // Amarillo
// const c3 = { r: 0, g: 0, b: 255 }; // Azul
// dibujarDegradado3Colores(ctx, c1, c2, c3);