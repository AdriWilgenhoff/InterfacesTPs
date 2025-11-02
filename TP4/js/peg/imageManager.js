// ============================================
// IMAGEMANAGER.JS - Gestor de Imágenes
// ============================================
// Sistema de pre-carga y renderizado síncrono de imágenes
// Sin callbacks ni promises en el renderizado

/**
 * Gestor central de imágenes
 * Pre-carga todas las imágenes y las mantiene en caché
 */
export class ImageManager {
    constructor() {
        // Caché de imágenes cargadas
        this.cache = {};
        
        // Estado de carga
        this.cargaCompleta = false;
        this.totalImagenes = 0;
        this.imagenesCargadas = 0;
    }

    /**
     * Pre-carga todas las imágenes necesarias
     * Esta es la ÚNICA función que usa promises
     * Se debe llamar ANTES de comenzar el juego
     * @param {Array<Object>} listaImagenes - Array de {id, ruta}
     * @returns {Promise<void>}
     */
    precargarImagenes(listaImagenes) {
        this.totalImagenes = listaImagenes.length;
        this.imagenesCargadas = 0;
        this.cargaCompleta = false;

        const promesas = [];
        
        for (let i = 0; i < listaImagenes.length; i++) {
            const item = listaImagenes[i];
            const promesa = this._cargarImagenInterna(item.id, item.ruta);
            promesas.push(promesa);
        }

        return Promise.all(promesas).then(function() {
            this.cargaCompleta = true;
            console.log('Todas las imágenes cargadas:', this.imagenesCargadas);
        }.bind(this));
    }

    /**
     * Carga interna de una imagen (privado)
     * @param {string} id - Identificador único
     * @param {string} ruta - Ruta de la imagen
     * @returns {Promise<void>}
     */
    _cargarImagenInterna(id, ruta) {
        return new Promise(function(resolve, reject) {
            const img = new Image();
            
            img.onload = function() {
                this.cache[id] = img;
                this.imagenesCargadas++;
                resolve();
            }.bind(this);
            
            img.onerror = function() {
                console.error('Error cargando imagen:', ruta);
                // Crear imagen de fallback (cuadrado de color)
                this.cache[id] = this._crearImagenFallback();
                this.imagenesCargadas++;
                resolve(); // No rechazamos, usamos fallback
            }.bind(this);
            
            img.src = ruta;
        }.bind(this));
    }

    /**
     * Crea una imagen de fallback cuando falla la carga
     * @returns {HTMLCanvasElement}
     */
    _crearImagenFallback() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#95A5A6';
        ctx.fillRect(0, 0, 100, 100);
        return canvas;
    }

    /**
     * Dibuja una imagen en el canvas (SÍNCRONO)
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     * @param {string} id - ID de la imagen
     * @param {number} x - Posición X
     * @param {number} y - Posición Y
     * @param {number} ancho - Ancho de la imagen
     * @param {number} alto - Alto de la imagen
     * @returns {boolean} true si se dibujó correctamente
     */
    dibujarImagen(ctx, id, x, y, ancho, alto) {
        const img = this.cache[id];
        
        if (!img) {
            console.warn('Imagen no encontrada en caché:', id);
            // Dibujar rectángulo de placeholder
            ctx.fillStyle = '#95A5A6';
            ctx.fillRect(x, y, ancho, alto);
            return false;
        }
        
        ctx.drawImage(img, x, y, ancho, alto);
        return true;
    }

    /**
     * Dibuja un fondo completo (SÍNCRONO)
     * Útil para fondos de pantalla, modales, etc.
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     * @param {string} id - ID de la imagen de fondo
     * @param {number} x - Posición X (default: 0)
     * @param {number} y - Posición Y (default: 0)
     * @param {number} ancho - Ancho (default: canvas.width)
     * @param {number} alto - Alto (default: canvas.height)
     * @param {string} colorFallback - Color si no hay imagen (default: '#000000')
     * @returns {boolean} true si se dibujó la imagen
     */
    dibujarFondo(ctx, id, x, y, ancho, alto, colorFallback) {
        // Valores por defecto
        x = x || 0;
        y = y || 0;
        ancho = ancho || ctx.canvas.width;
        alto = alto || ctx.canvas.height;
        colorFallback = colorFallback || '#000000';
        
        const img = this.cache[id];
        
        if (!img) {
            // Dibujar fondo de color sólido
            ctx.fillStyle = colorFallback;
            ctx.fillRect(x, y, ancho, alto);
            return false;
        }
        
        ctx.drawImage(img, x, y, ancho, alto);
        return true;
    }

    /**
     * Verifica si una imagen está en caché
     * @param {string} id - ID de la imagen
     * @returns {boolean}
     */
    tieneImagen(id) {
        return this.cache[id] !== undefined;
    }

    /**
     * Obtiene el progreso de carga (0 a 1)
     * @returns {number}
     */
    getProgresoCarga() {
        if (this.totalImagenes === 0) {
            return 1;
        }
        return this.imagenesCargadas / this.totalImagenes;
    }

    /**
     * Verifica si todas las imágenes están cargadas
     * @returns {boolean}
     */
    estaCargaCompleta() {
        return this.cargaCompleta;
    }

    /**
     * Limpia el caché
     */
    limpiarCache() {
        this.cache = {};
        this.cargaCompleta = false;
        this.imagenesCargadas = 0;
        this.totalImagenes = 0;
    }
}

// Instancia global del gestor de imágenes
export const imageManager = new ImageManager();
