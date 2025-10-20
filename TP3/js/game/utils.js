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

/* Olf */ 
const hexaAdecimal = (c) => {
  switch (c.toUpperCase()) {
    case '0': return 0;
    case '1': return 1;
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    case '5': return 5;
    case '6': return 6;
    case '7': return 7;
    case '8': return 8;
    case '9': return 9;
    case 'A': return 10;
    case 'B': return 11;
    case 'C': return 12;
    case 'D': return 13;
    case 'E': return 14;
    case 'F': return 15;
    default: throw new Error("Carácter hexadecimal inválido: " + c);
  }
};


function hexToRGBA(colorHex) {
  let rr, gg, bb, aa; 

  let r1 = hexaAdecimal(colorHex.charAt(1));
  let r2 = hexaAdecimal(colorHex.charAt(2));

  let g1 = hexaAdecimal(colorHex.charAt(3));
  let g2 = hexaAdecimal(colorHex.charAt(4));

  let b1 = hexaAdecimal(colorHex.charAt(5));
  let b2 = hexaAdecimal(colorHex.charAt(6));

  let a1, a2;

  if (colorHex.charAt(7) && colorHex.charAt(8)) {
    a1 = hexaAdecimal(colorHex.charAt(7));
    a2 = hexaAdecimal(colorHex.charAt(8));
    aa = (a1 * 16 + a2) / 255;
  } else {
    aa = 1;
  }

  rr = r1 * 16 + r2;
  gg = g1 * 16 + g2;
  bb = b1 * 16 + b2;

  return [rr, gg, bb, aa];
}


export function degrade(ctx, color1, color2, x, y, width, height, direccion) {

  const degrade = ctx.createImageData(width, height);
  const data = degrade.data;

  color1 = hexToRGBA(color1);
  color2 = hexToRGBA(color2);

  for (let y = 0; y < degrade.height; y++) {
    for (let x = 0; x < degrade.width; x++) {
      let index = (y * degrade.width + x) * 4;

      let t = 0;
      switch (direccion) {
        case 'horizontal': t = x / (degrade.width - 1); break;
        case 'vertical': t = y / (degrade.height - 1); break;
        case 'diagonal1': t = x / (degrade.width - 1) + y / (degrade.height - 1) / 2; break;
        case 'diagonal2': t = ((degrade.width - 1 - x) / (degrade.width - 1) + y / (degrade.height - 1)) / 2; break;
        default: t = 0; break;
      }

      const r = color1[0] + (color2[0] - color1[0]) * t;
      const g = color1[1] + (color2[1] - color1[1]) * t;
      const b = color1[2] + (color2[2] - color1[2]) * t;
      const a = color1[3] + (color2[3] - color1[3]) * t;

      data[index + 0] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = a * 255;
    }
  }

  ctx.putImageData(degrade, x, y);
}




function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}

export async function drawImageScaled(ctx, imageSRC, x , y , width, height) {

  try {
    const img = await cargarImagen(imageSRC);

    /* const x = puntoRelativoX * ctx.canvas.width;
    const y = puntoRelativoY * ctx.canvas.height;
    const width = widthRelativo * ctx.canvas.width;
    const height = heightRelativo * ctx.canvas.height; */

    ctx.drawImage(img, x, y, width, height);
    ctx.drawImage(img, x, y, width, height);
    //devuelvo los pixeles reales para usarlos en ImageData;
    return { x, y, width, height };

  } catch (error) {
    console.error("❌ Error al cargar la imagen:", error);
  }
}