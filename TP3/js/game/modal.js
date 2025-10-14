// modal.js - Sistema de modales/popups para mostrar resultados del nivel

import { getTotalNiveles } from "./levels.js";
import { COLORES, FUENTES } from './constans.js';

export class Modal {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.visible = false;
        this.tipo = 'completado';    // Tipos: 'completado', 'fallido', 'juegoCompletado'
        this.datos = {};             // Datos específicos del modal (tiempo, nivel, etc.)
        this.botones = [];           // Array de botones clickeables
    }

    /**
 * Muestra modal de nivel completado
 * @param {number} nivel - Número del nivel completado
 * @param {number} tiempo - Tiempo final del nivel
 * @param {string} dificultad - Dificultad del nivel
 * @param {number} movimientos - Cantidad de movimientos realizados
 */
    mostrarCompletado(nivel, tiempo, dificultad, movimientos) {
        this.visible = true;
        this.tipo = 'completado';
        this.datos = {
            nivel,
            tiempo,
            dificultad,
            movimientos
        };
    }

    /**
 * Muestra modal de juego completado (todos los niveles)
 * @param {number} tiempoTotal - Tiempo acumulado de todos los niveles
 * @param {number} movimientosTotales - Movimientos totales
 * @param {number} ayudasUsadas - Cantidad de ayudas usadas
 */
    mostrarJuegoCompletado(tiempoTotal, movimientosTotales, ayudasUsadas) {
        this.visible = true;
        this.tipo = 'juegoCompletado';
        this.datos = {
            tiempoTotal,
            movimientosTotales,
            ayudasUsadas
        };
    }

    /**
     * Muestra modal de nivel fallido
     * @param {number} nivel - Número del nivel fallido
     */
    mostrarFallido(nivel) {
        this.visible = true;
        this.tipo = 'fallido';
        this.datos = { nivel };
    }

    /**
     * Oculta el modal y limpia sus datos
     */
    ocultar() {
        this.visible = false;
        this.datos = {};
        this.botones = [];
    }

    /**
     * Formatea segundos a formato MM:SS
     * @param {number} segundos - Tiempo en segundos
     * @returns {string} - Tiempo formateado
     */
    formatearTiempo(segundos) {
        const mins = Math.floor(Math.abs(segundos) / 60);
        const segs = Math.abs(segundos) % 60;
        return `${mins}:${segs.toString().padStart(2, '0')}`;
    }

    /**
     * Dibuja el modal en el canvas
     */
    dibujar() {
        if (!this.visible) return;

        this.ctx.save();

        // Fondo oscuro semitransparente
        this.ctx.fillStyle = COLORES.fondoTransparente;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dimensiones y posición del modal
        const modalWidth = 500;
        const modalHeight = 350;
        const modalX = (this.canvas.width - modalWidth) / 2;
        const modalY = (this.canvas.height - modalHeight) / 2;

        // Fondo blanco del modal
        this.ctx.fillStyle = COLORES.fondoModal;
        this.ctx.fillRect(modalX, modalY, modalWidth, modalHeight);

        // Borde del modal
         this.ctx.lineWidth = 3;

        // Dibujar contenido según el tipo de modal
        if (this.tipo === 'completado') {
            this.ctx.strokeStyle = COLORES.botonPrimario;
            this.ctx.strokeRect(modalX, modalY, modalWidth, modalHeight);
            this.dibujarCompletado(modalX, modalY, modalWidth, modalHeight);
        } else if (this.tipo === 'fallido') {
            this.ctx.strokeStyle = COLORES.botonPeligro;
            this.ctx.strokeRect(modalX, modalY, modalWidth, modalHeight);
            this.dibujarFallido(modalX, modalY, modalWidth, modalHeight);
        } else if (this.tipo === 'juegoCompletado') {
            this.ctx.strokeStyle = COLORES.juegoTerminado;
            this.ctx.strokeRect(modalX, modalY, modalWidth, modalHeight);
            this.dibujarJuegoCompletado(modalX, modalY, modalWidth, modalHeight);
        }

        this.ctx.restore();
    }

    /**
   * Dibuja el contenido del modal de nivel completado
   */
    dibujarCompletado(x, y, width, height) {
        const centerX = x + width / 2;
        let currentY = y + 65;

        // Título con número de nivel
        this.ctx.fillStyle = COLORES.botonPrimario;
        this.ctx.font = FUENTES.botonGrande;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`🎉 NIVEL ${this.datos.nivel} COMPLETADO 🎉`, centerX, currentY);

        this.ctx.font = FUENTES.textoNormal;
        this.ctx.fillStyle = COLORES.textoPrimario;

        currentY += 55;
        // const dificultad = this.datos.dificultad;//.charAt(0).toUpperCase() + this.datos.dificultad.slice(1);
        this.ctx.fillText(`🎯 Dificultad: ${this.datos.dificultad}`, centerX, currentY);

        currentY += 35;
        this.ctx.fillText(`⏱️ Tiempo empleado: ${this.formatearTiempo(this.datos.tiempo)}`, centerX, currentY);

        currentY += 35;
        this.ctx.fillText(`🔄 Movimientos: ${this.datos.movimientos}`, centerX, currentY);

        currentY += 60;

        const buttonWidth = 220;
        const buttonHeight = 55;
        const espaciado = 20;
        const totalWidth = (buttonWidth * 2) + espaciado;
        const startX = centerX - totalWidth / 2;
        const buttonY = currentY;

        // Posiciones de los botones
        const button1X = startX;
        const button2X = startX + buttonWidth + espaciado;

        this.botones = [
            {
                id: 'siguiente',
                x: button1X,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight
            },
            {
                id: 'home',
                x: button2X,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight
            }
        ];

        const esUltimoNivel = this.datos.nivel === getTotalNiveles();
        const textoBotonSiguiente = esUltimoNivel ? 'VER ESTADÍSTICAS' : 'SIGUIENTE NIVEL';

        // Dibujar botón "Siguiente Nivel" (verde)
        this.ctx.fillStyle = COLORES.botonPrimario;
        this.ctx.fillRect(button1X, buttonY, buttonWidth, buttonHeight);

        this.ctx.strokeStyle = COLORES.botonPrimarioBorde;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(button1X, buttonY, buttonWidth, buttonHeight);

        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.fillText(textoBotonSiguiente, button1X + buttonWidth / 2, buttonY + 35);

        // Dibujar botón "Volver al Inicio" (rojo)
        this.ctx.fillStyle = COLORES.botonPeligro;
        this.ctx.fillRect(button2X, buttonY, buttonWidth, buttonHeight);

        this.ctx.strokeStyle = COLORES.botonPeligroBorde;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(button2X, buttonY, buttonWidth, buttonHeight);

        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.fillText('VOLVER AL INICIO', button2X + buttonWidth / 2, buttonY + 35);
    }

    /**
     * Dibuja el contenido del modal de juego completado
     */

    dibujarJuegoCompletado(x, y, width, height) {
        const centerX = x + width / 2;
        let currentY = y + 65;

        // Título
        this.ctx.fillStyle = COLORES.juegoTerminado;
        this.ctx.font = FUENTES.tituloPequeño;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏆 ¡FELICITACIONES! 🏆', centerX, currentY);

        currentY += 30;

        // Mensaje
        this.ctx.fillStyle = COLORES.textoSecundario;
        this.ctx.font = FUENTES.textoMedio;
        this.ctx.fillText('¡Completaste Blocka!', centerX, currentY);
        //this.ctx.fillText('¡Completaste todos los niveles!', centerX, currentY);


        currentY += 50;

        // Estadísticas totales
        this.ctx.font = FUENTES.textoNormal;
        this.ctx.fillStyle = COLORES.textoPrimario;

        this.ctx.fillText(`⏱️ Tiempo total: ${this.formatearTiempo(this.datos.tiempoTotal)}`, centerX, currentY);

        currentY += 35;
        this.ctx.fillText(`🔄 Movimientos totales: ${this.datos.movimientosTotales}`, centerX, currentY);

        currentY += 35;
        this.ctx.fillText(`💡 Ayudas usadas: ${this.datos.ayudasUsadas}`, centerX, currentY);

        currentY += 40;

        // Botón "Volver al Inicio"
        const buttonWidth = 250;
        const buttonHeight = 60;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = currentY;

        this.botones = [{
            id: 'home',
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        }];

        // Dibujar botón
        this.ctx.fillStyle = COLORES.botonSecundario;
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        this.ctx.strokeStyle = COLORES.botonSecundarioBorde;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.fillText('VOLVER AL INICIO', centerX, buttonY + 38);
    }

    /**
     * Dibuja el contenido del modal de nivel fallido
     */
    dibujarFallido(x, y, width, height) {
        const centerX = x + width / 2;
        let currentY = y + 75;

        // Título
        this.ctx.fillStyle = COLORES.botonPeligro;
        this.ctx.font = FUENTES.tituloPequeño;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('NIVEL FALLIDO 👎', centerX, currentY);

        currentY += 80;

        // Mensaje
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.textoMedio;
        this.ctx.fillText('¡Se acabó el tiempo!', centerX, currentY);

        currentY += 80;

        // Configuración de dos botones lado a lado
        const buttonWidth = 220;
        const buttonHeight = 55;
        const espaciado = 20;
        const totalWidth = (buttonWidth * 2) + espaciado;
        const startX = centerX - totalWidth / 2;
        const buttonY = currentY;

        // Posiciones de los botones
        const button1X = startX;
        const button2X = startX + buttonWidth + espaciado;

        this.botones = [
            {
                id: 'reintentar',
                x: button1X,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight
            },
            {
                id: 'home',
                x: button2X,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight
            }
        ];

        // Dibujar botón "Reintentar"
        this.ctx.fillStyle = COLORES.botonPrimario;
        this.ctx.fillRect(button1X, buttonY, buttonWidth, buttonHeight);

        this.ctx.strokeStyle = COLORES.botonPrimarioBorde;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(button1X, buttonY, buttonWidth, buttonHeight);

        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.fillText('REINTENTAR', button1X + buttonWidth / 2, buttonY + 35);

        // Dibujar botón "Volver"
        this.ctx.fillStyle = COLORES.botonPeligro;
        this.ctx.fillRect(button2X, buttonY, buttonWidth, buttonHeight);

        this.ctx.strokeStyle = COLORES.botonPeligroBorde;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(button2X, buttonY, buttonWidth, buttonHeight);

        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.fillText('VOLVER AL INICIO', button2X + buttonWidth / 2, buttonY + 35);
    }

    /**
     * Detecta si se hizo click en algún botón del modal
     * @param {number} x - Coordenada X del click
     * @param {number} y - Coordenada Y del click
     * @returns {string|null} - ID del botón clickeado o null
     */
    clickEnBoton(x, y) {
        if (!this.visible || this.botones.length === 0) return null;

        for (const boton of this.botones) {
            if (x >= boton.x &&
                x <= boton.x + boton.width &&
                y >= boton.y &&
                y <= boton.y + boton.height) {
                return boton.id; // 'siguiente', 'reintentar', o 'home'
            }
        }

        return null;
    }
}