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

//hacer un metodo que dibuje la imagen 