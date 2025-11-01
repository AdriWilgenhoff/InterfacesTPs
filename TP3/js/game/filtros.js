function setPixel(imageData, x, y, r, g, b, a) {
    const index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

function getPixel(imageData, x, y) {
    const index = (x + y * imageData.width) * 4;
    return {
        r: imageData.data[index + 0],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3]
    };
}


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


export function aplicarFiltroSepia(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const pixel = getPixel(imageData, x, y);

            const r = Math.min(255, (pixel.r * 0.393) + (pixel.g * 0.769) + (pixel.b * 0.189));
            const g = Math.min(255, (pixel.r * 0.349) + (pixel.g * 0.686) + (pixel.b * 0.168));
            const b = Math.min(255, (pixel.r * 0.272) + (pixel.g * 0.534) + (pixel.b * 0.131));

            setPixel(imageData, x, y, r, g, b, pixel.a);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}


export function aplicarFiltroBlur(ctx, canvas, radio = 1) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const width = imageData.width;
    const height = imageData.height;

    const originalImageData = new ImageData(
        new Uint8ClampedArray(imageData.data),
        width,
        height
    );

    for (let y = radio; y < height - radio; y++) {
        for (let x = radio; x < width - radio; x++) {
            let rSum = 0, gSum = 0, bSum = 0, count = 0;

            for (let ky = -radio; ky <= radio; ky++) {
                for (let kx = -radio; kx <= radio; kx++) {
                    const pixelVecino = getPixel(originalImageData, x + kx, y + ky);
                    rSum += pixelVecino.r;
                    gSum += pixelVecino.g;
                    bSum += pixelVecino.b;
                    count++;
                }
            }

            const rAvg = rSum / count;
            const gAvg = gSum / count;
            const bAvg = bSum / count;
            
            const alphaOriginal = getPixel(originalImageData, x, y).a;

            setPixel(imageData, x, y, rAvg, gAvg, bAvg, alphaOriginal);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

export function aplicarFiltroBrillo(ctx, canvas, porcentaje) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const factor = porcentaje / 100;

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const pixel = getPixel(imageData, x, y);

            let r = pixel.r + (255 * factor);
            let g = pixel.g + (255 * factor);
            let b = pixel.b + (255 * factor);

            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));

            setPixel(imageData, x, y, r, g, b, pixel.a);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

export function aplicarFiltroEscalaAzul(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const pixel = getPixel(imageData, x, y);

            const azul = pixel.r * 0.299 + pixel.g * 0.587 + pixel.b * 0.114;

            setPixel(imageData, x, y, 0, 0, azul, pixel.a);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

export function aplicarFiltroPorNombre(nombreFiltro, ctx, canvas) {
    switch (nombreFiltro) {
        case 'escalaGrises':
            aplicarFiltroEscalaGrises(ctx, canvas);
            break;
            case 'escalaAzul':
            aplicarFiltroEscalaAzul(ctx, canvas);
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

export function aplicarSombra(ctx, { color = 'rgba(0, 0, 0, 0.4)', blur = 10, offsetX = 0, offsetY = 4 } = {}) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
}

export function limpiarSombra(ctx) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}