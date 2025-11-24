// pantallaInicial.js - Pantalla de inicio/menú principal del juego

import { aplicarSombra, limpiarSombra } from './filtros.js';
import { COLORES, FUENTES, SOMBRAS } from './constans.js';
import { cargarImagen } from "./utils.js";

export class PantallaInicial {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.visible = true;
        this.botonRect = null;
        this.imagenCargada = false;
        this.buttonImg = '../assets_game/images/boton8.png';
        this.imagenBotonFinal = null;
        this.precargarImg();
    }

    mostrar() {
        this.visible = true;
    }

    ocultar() {
        this.visible = false;
    }

    async precargarImg() {
        try {
            this.imagenBotonFinal = await cargarImagen(this.buttonImg);
            this.imagenCargada = true;
            console.log('✅ Imagen del botón cargada correctamente');
        } catch (error) {
            console.warn('⚠️ No se pudo cargar la imagen del botón, usando degradado:', error);
            this.imagenCargada = false;
        }
    }

    dibujar() {
        if (!this.visible) return;

        this.ctx.save();

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Título del juego
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.tituloGrande;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('BLOCKA', centerX, centerY - 130);

        // Subtítulo
        this.ctx.fillStyle = COLORES.textoSecundario;
        this.ctx.font = FUENTES.textoMedio;
        this.ctx.fillText('Rota las piezas para completar la imagen', centerX, centerY - 80);

        // Configuración del botón
        const buttonWidth = 300;
        const buttonHeight = 70;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = centerY;
        const difX =0;
        const difY = -5; 

        this.botonRect = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };

        // Dibujar botón con imagen o degradado
        if (this.imagenCargada && this.imagenBotonFinal) {
            this.ctx.drawImage(this.imagenBotonFinal, buttonX + difX, buttonY + difY, buttonWidth, buttonHeight);
        } else {
            aplicarSombra(this.ctx, SOMBRAS.boton);
            this.ctx.fillStyle = COLORES.botonPrimario;
            this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
            limpiarSombra(this.ctx);

            this.ctx.strokeStyle = COLORES.botonPrimarioBorde;
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }

        // Texto del botón
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonGrande;
        this.ctx.fillText('INICIAR JUEGO', centerX, buttonY + 40);

        // Instrucciones de controles
        this.ctx.fillStyle = COLORES.textoSecundario;
        this.ctx.font = FUENTES.textoPequeño;
        this.ctx.fillText('Clic izquierdo: rota izquierda ↺  |  Clic derecho: rota derecha ↻', centerX, centerY + 150);

        // Explicación de ayudas
        this.ctx.fillText('Si en un nivel difícil no sabes cómo seguir, usá ayudas para ubicar una pieza. Esto te costará tiempo.', centerX, centerY + 190);

        this.ctx.restore();
    }

    clickEnBoton(x, y) {
        if (!this.visible || !this.botonRect) return false;

        return x >= this.botonRect.x &&
               x <= this.botonRect.x + this.botonRect.width &&
               y >= this.botonRect.y &&
               y <= this.botonRect.y + this.botonRect.height;
    }
}
