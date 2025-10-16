// seleccionadorImagen.js - Animación de selección aleatoria de imagen antes de cada nivel
// Muestra un grid con todas las imágenes y hace una animación de "ruleta" hasta seleccionar una

import { COLORES, FUENTES } from './constans.js';
import { SOMBRAS, aplicarSombra } from './filtros.js';
import { cargarImagen } from './utils.js';

export class SeleccionadorImagen {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.visible = false;
        this.imagenes = [];
        this.imagenesObj = [];
        this.indiceSeleccionado = 0;
        this.animando = false;
        this.tiempoAnimacion = 0;
        this.intervaloAnimacion = null;
        this.onSeleccionCompleta = null;
    }
    
    /**
     * Carga todas las imágenes del juego
     * @param {Array<string>} rutasImagenes - Array de rutas de imágenes
     */
    async cargarImagenes(rutasImagenes) {
        this.imagenes = rutasImagenes;
        this.imagenesObj = [];
        
        for (const ruta of rutasImagenes) {
            try {
                const img = await cargarImagen(ruta);
                this.imagenesObj.push(img);
            } catch (error) {
                console.warn(`No se pudo cargar imagen: ${ruta}`, error);
            }
        }
    }
    
    /**
     * Inicia la animación de selección de imagen
     * Hace un efecto de "ruleta" que va desacelerando hasta detenerse en la imagen elegida
     * @param {string} imagenFinal - Ruta de la imagen que debe ser seleccionada
     * @param {Function} callback - Función a ejecutar cuando termine la animación
     */
    iniciarSeleccion(imagenFinal, callback) {
        this.visible = true;
        this.animando = true;
        this.indiceSeleccionado = 0;
        this.tiempoAnimacion = 0;
        this.onSeleccionCompleta = callback;
        
        // Encontrar el índice de la imagen final
        const indiceFinal = this.imagenes.indexOf(imagenFinal);
        
        // Configuración de la animación
        let velocidad = 100;
        const incrementoVelocidad = 50;
        const duracionTotal = 5000;
        
        // Intervalo que cambia la imagen resaltada
        this.intervaloAnimacion = setInterval(() => {
            this.tiempoAnimacion += velocidad;
            
            // Avanzar al siguiente índice (circular)
            this.indiceSeleccionado = (this.indiceSeleccionado + 1) % this.imagenesObj.length;
            
            if (this.tiempoAnimacion < duracionTotal) {
                velocidad += incrementoVelocidad;
            } else {
                // Tiempo cumplido - seleccionar la imagen final
                this.indiceSeleccionado = indiceFinal;
                this.detenerAnimacion();
            }
        }, velocidad);
    }
    
    /**
     * Detiene la animación y ejecuta el callback después de 1 segundo
     */
    detenerAnimacion() {
        if (this.intervaloAnimacion) {
            clearInterval(this.intervaloAnimacion);
            this.intervaloAnimacion = null;
        }
        
        this.animando = false;
        
        // Esperar 1 segundo antes de ocultar y ejecutar callback
        setTimeout(() => {
            this.visible = false;
            if (this.onSeleccionCompleta) {
                this.onSeleccionCompleta();
                this.onSeleccionCompleta = null;
            }
        }, 1000);
    }
    
    /**
     * Dibuja la pantalla de selección con el grid de imágenes
     */
    dibujar() {
        if (!this.visible) return;
        
        this.ctx.save();
        
        // Fondo
        this.ctx.fillStyle = COLORES.fondoPantalla;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Título
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.tituloPequeño; 
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Seleccionando imagen...', centerX, 70);
        
        // Configuración del grid de imágenes
        const thumbSize = 100;
        const cols = Math.min(4, this.imagenesObj.length);
        const rows = Math.ceil(this.imagenesObj.length / cols);
        const espaciado = 30;
        const gridWidth = (thumbSize * cols) + (espaciado * (cols - 1));
        const gridHeight = (thumbSize * rows) + (espaciado * (rows - 1));
        const startX = centerX - gridWidth / 2;
        const startY = centerY - gridHeight / 2;
        
        // Dibujar cada imagen del grid
        for (let i = 0; i < this.imagenesObj.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + (col * (thumbSize + espaciado));
            const y = startY + (row * (thumbSize + espaciado));
            
            const img = this.imagenesObj[i];
            const esSeleccionado = i === this.indiceSeleccionado;
            
            // Fondo de la miniatura
            if (esSeleccionado) {
                // Imagen seleccionada - fondo verde con efecto de brillo
                this.ctx.fillStyle = COLORES.botonPrimario;
                this.ctx.fillRect(x - 10, y - 10, thumbSize + 20, thumbSize + 20);
                
                aplicarSombra(this.ctx, SOMBRAS.glow);
            } else {
                // Imagen no seleccionada - fondo semi-transparente
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.fillRect(x - 5, y - 5, thumbSize + 10, thumbSize + 10);
            }
            
            // Borde de la miniatura
            this.ctx.strokeStyle = esSeleccionado ? '#ffffff' : '#666666';
            this.ctx.lineWidth = esSeleccionado ? 5 : 2;
            this.ctx.strokeRect(x - 5, y - 5, thumbSize + 10, thumbSize + 10);
            
            this.ctx.shadowBlur = 0;
            
            // Calcular dimensiones manteniendo aspect ratio
            const aspectRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (aspectRatio > 1) {
                // Imagen horizontal
                drawWidth = thumbSize;
                drawHeight = thumbSize / aspectRatio;
                offsetX = 0;
                offsetY = (thumbSize - drawHeight) / 2;
            } else {
                // Imagen vertical o cuadrada
                drawHeight = thumbSize;
                drawWidth = thumbSize * aspectRatio;
                offsetX = (thumbSize - drawWidth) / 2;
                offsetY = 0;
            }
            
            // Oscurecer imágenes no seleccionadas
            if (!esSeleccionado) {
                this.ctx.globalAlpha = 0.4;
            }
            
            // Dibujar la imagen
            this.ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
            
            this.ctx.globalAlpha = 1.0;
        }
        
        this.ctx.restore();
    }
}