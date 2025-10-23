// seleccionadorImagen.js - Animación de selección aleatoria de imagen antes de cada nivel

import { COLORES, FUENTES, SOMBRAS } from './constans.js';
import { aplicarSombra } from './filtros.js';
import { cargarImagen } from './utils.js';

export class SeleccionadorImagen {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.visible = false;
        
        // Imágenes
        this.imagenes = [];           // Array de rutas
        this.imagenesObj = [];        // Array de objetos Image
        
        // Animación
        this.animacion = {
            indiceActual: 0,
            indiceFinal: 0,
            velocidad: 100,
            intervalo: null,
            tiempoTranscurrido: 0,
            callback: null
        };
    }
    
    /**
     * Carga todas las imágenes del juego
     */
    async cargarImagenes(rutasImagenes) {
        this.imagenes = rutasImagenes;
        this.imagenesObj = [];
        
        for (let i = 0; i < rutasImagenes.length; i++) {
            try {
                const img = await cargarImagen(rutasImagenes[i]);
                this.imagenesObj.push(img);
            } catch (error) {
                console.warn(`Error cargando imagen: ${rutasImagenes[i]}`, error);
            }
        }
    }
    
    /**
     * Inicia la animación de selección tipo "ruleta"
     */

    iniciarSeleccion(imagenFinal, callback) {
        this.visible = true;
        
        // Configurar animación
        this.animacion = {
            indiceActual: 0,
            indiceFinal: this.imagenes.indexOf(imagenFinal),
            velocidad: 100,
            intervalo: null,
            tiempoTranscurrido: 0,
            callback: callback
        };
        
        // Iniciar intervalo
        this.animacion.intervalo = setInterval(() => {
            this.actualizarAnimacion();
        }, this.animacion.velocidad);
    }
    
    /**
     * Actualiza el estado de la animación (llamado por el intervalo)
     */
    actualizarAnimacion() {
        const DURACION_TOTAL = 5000;
        const INCREMENTO_VELOCIDAD = 50;
        
        this.animacion.tiempoTranscurrido += this.animacion.velocidad;
        
        // Avanzar al siguiente índice (circular)
        this.animacion.indiceActual = (this.animacion.indiceActual + 1) % this.imagenesObj.length;
        
        if (this.animacion.tiempoTranscurrido < DURACION_TOTAL) {
            // Desacelerar (aumentar velocidad = más lento)
            this.animacion.velocidad += INCREMENTO_VELOCIDAD;
        } else {
            // Tiempo cumplido - detener en la imagen final
            this.animacion.indiceActual = this.animacion.indiceFinal;
            this.detenerAnimacion();
        }
    }
    
    /**
     * Detiene la animación y ejecuta el callback
     */
    detenerAnimacion() {
        if (this.animacion.intervalo) {
            clearInterval(this.animacion.intervalo);
            this.animacion.intervalo = null;
        }
        
        const self = this;
        
        // Esperar 1 segundo antes de continuar
        setTimeout(function() {
            self.visible = false;
            if (self.animacion.callback) {
                self.animacion.callback();
                self.animacion.callback = null;
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
      /*   this.ctx.fillStyle = COLORES.fondoPantalla;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); */
        
        // Título
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.tituloPequeño;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Seleccionando imagen...', this.canvas.width / 2, 70);
        
        // Grid
        const THUMB_SIZE = 100;
        const ESPACIADO = 30;
        const COLS = 6; 

        const rows = Math.ceil(this.imagenesObj.length / COLS);
        const gridWidth = (THUMB_SIZE * COLS) + (ESPACIADO * (COLS - 1));
        const gridHeight = (THUMB_SIZE * rows) + (ESPACIADO * (rows - 1));
        const startX = (this.canvas.width - gridWidth) / 2;
        const startY = (this.canvas.height - gridHeight) / 2;
        
        // Dibujar cada miniatura
        for (let i = 0; i < this.imagenesObj.length; i++) {
            const img = this.imagenesObj[i];
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const x = startX + (col * (THUMB_SIZE + ESPACIADO));
            const y = startY + (row * (THUMB_SIZE + ESPACIADO));
            const esSeleccionado = i === this.animacion.indiceActual;
            
            this.dibujarMiniatura(img, x, y, THUMB_SIZE, esSeleccionado);
        }
        
        this.ctx.restore();
    }
    
    /**
     * Dibuja una miniatura individual
     */
    dibujarMiniatura(img, x, y, tamaño, esSeleccionado) {
        // Fondo
        if (esSeleccionado) {
            this.ctx.fillStyle = COLORES.selectImage;
            this.ctx.fillRect(x - 10, y - 10, tamaño + 20, tamaño + 20);
            aplicarSombra(this.ctx, SOMBRAS.glow);
        } else {
            this.ctx.fillStyle = 'rgba(160, 201, 169, 0.1)';
            this.ctx.fillRect(x - 5, y - 5, tamaño + 10, tamaño + 10);
        }
        
        // Borde
        this.ctx.strokeStyle = esSeleccionado ? '#ffffffff' : COLORES.toBeSelectedImage;
        this.ctx.lineWidth = esSeleccionado ? 5 : 2;
        this.ctx.strokeRect(x - 5, y - 5, tamaño + 10, tamaño + 10);
        
        this.ctx.shadowBlur = 0;
        
        // Oscurecer no seleccionadas
        this.ctx.globalAlpha = esSeleccionado ? 1.0 : 0.4;
        
        // Dibujar imagen cubriendo todo el cuadrado
        this.ctx.drawImage(img, x, y, tamaño, tamaño);
        
        this.ctx.globalAlpha = 1.0;
    }
}