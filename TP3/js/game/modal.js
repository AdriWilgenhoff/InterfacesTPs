// modal.js - Sistema de modales/popups para mostrar resultados del nivel

import { getTotalNiveles } from "./levels.js";
import { COLORES, FUENTES, IMAGES, SOMBRAS } from './constans.js';
import { formatearTiempo, degrade, cargarImagen } from "./utils.js";
import { aplicarSombra, limpiarSombra } from './filtros.js';

export class Modal {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.visible = false;
        this.tipo = 'completado';
        this.datos = {};
        this.botones = [];
        this.imagenFondo = null;
        this.imagenCargada = false;
        this.imagenBotones = null;
        this.imagenBotonFinal = null;
        this.urlImg = '../assets_game/images/modal555.png';
        this.urlImgBotones = '../assets_game/images/boton9.png';
        this.cargarImagenFondo();
    }

    async cargarImagenFondo() {
        try {
            this.imagenFondo = await cargarImagen(this.urlImg);
            this.imagenBotones = await cargarImagen(this.urlImgBotones);
            this.imagenCargada = true;
            console.log('✅ Imagen de fondo del modal cargada correctamente');
        } catch (error) {
            console.warn('⚠️ No se pudo cargar la imagen de fondo del modal, usando degradado:', error);
            this.imagenCargada = false;
        }
    }

    mostrarCompletado(nivel, tiempo, dificultad, movimientos) {
        this.visible = true;
        this.tipo = 'completado';
        this.datos = { nivel, tiempo, dificultad, movimientos };
    }

    mostrarJuegoCompletado(tiempoTotal, movimientosTotales, ayudasUsadas) {
        this.visible = true;
        this.tipo = 'juegoCompletado';
        this.datos = { tiempoTotal, movimientosTotales, ayudasUsadas };
    }

    mostrarFallido(nivel) {
        this.visible = true;
        this.tipo = 'fallido';
        this.datos = { nivel };
    }

    ocultar() {
        this.visible = false;
        this.datos = {};
        this.botones = [];
    }

    dibujar() {
        if (!this.visible) return;

        this.ctx.save();

        this.ctx.fillStyle = COLORES.fondoTransparente;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const modalWidth = 550;
        const modalHeight = 340;
        const modalX = (this.canvas.width - modalWidth) / 2;
        const modalY = (this.canvas.height - modalHeight) / 2;
        const borderRadius = 20;

        if (this.imagenCargada && this.imagenFondo) {
            this.ctx.drawImage(
                this.imagenFondo,
                modalX - modalX * 0.22,
                modalY - modalY * 0.6,
                modalWidth + modalWidth * 0.2,
                modalHeight + modalHeight * 0.25
            );
        } else {
            degrade(this.ctx, COLORES.modal1, COLORES.modal2, modalX, modalY, modalWidth, modalHeight, 'diagonal1');
        }

        if (this.tipo === 'completado') {
            this.dibujarCompletado(modalX, modalY, modalWidth, modalHeight, borderRadius);
        } else if (this.tipo === 'fallido') {
            this.dibujarFallido(modalX, modalY, modalWidth, modalHeight, borderRadius);
        } else if (this.tipo === 'juegoCompletado') {
            this.dibujarJuegoCompletado(modalX, modalY, modalWidth, modalHeight, borderRadius);
        }

        this.ctx.restore();
    }

    dibujarCompletado(x, y, width, height) {
        const centerX = x + width / 2;
        let currentY = y + 55;

        this.ctx.fillStyle = COLORES.tituloModalCompletado;
        this.ctx.font = FUENTES.botonGrande;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`NIVEL ${this.datos.nivel} COMPLETADO`, centerX, currentY);

        currentY += 25;
        const linePadding = 50;
        const lineLength = width - (linePadding * 2);
        const lineStartX = centerX - (lineLength / 2);
        const lineEndX = centerX + (lineLength / 2);

        this.ctx.beginPath();
        this.ctx.moveTo(lineStartX, currentY);
        this.ctx.lineTo(lineEndX, currentY);
        this.ctx.strokeStyle = COLORES.textoPrimario;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.font = FUENTES.textoNormal;
        this.ctx.fillStyle = COLORES.textoPrimario;

        currentY += 55;
        this.ctx.fillText(`Dificultad: ${this.datos.dificultad}`, centerX, currentY);
        currentY += 35;
        this.ctx.fillText(`Tiempo empleado: ${formatearTiempo(this.datos.tiempo)}`, centerX, currentY);
        currentY += 35;
        this.ctx.fillText(`Movimientos: ${this.datos.movimientos}`, centerX, currentY);
        currentY += 55;

        const buttonWidth = 225;
        const buttonHeight = 65;
        const espaciado = 15;
        const totalWidth = (buttonWidth * 2) + espaciado;
        const startX = centerX - totalWidth / 2;
        const buttonY = currentY;
        const difX = 3;
        const difY = -5;

        const button1X = startX;
        const button2X = startX + buttonWidth + espaciado;

        this.botones = [
            { id: 'siguiente', x: button1X, y: buttonY, width: buttonWidth, height: buttonHeight },
            { id: 'home', x: button2X, y: buttonY, width: buttonWidth, height: buttonHeight }
        ];

        const esUltimoNivel = this.datos.nivel === getTotalNiveles();
        const textoBotonSiguiente = esUltimoNivel ? 'VER STATS' : 'SIGUIENTE NIVEL';

        if (this.imagenCargada && this.imagenBotones) {
            this.ctx.drawImage(this.imagenBotones, button1X + difX, buttonY + difY, buttonWidth, buttonHeight);
        } else {
            aplicarSombra(this.ctx, SOMBRAS.boton);
            this.ctx.fillStyle = COLORES.botonPrimario;
            this.ctx.fillRect(button1X, buttonY, buttonWidth, buttonHeight);
            limpiarSombra(this.ctx);
            this.ctx.strokeStyle = COLORES.botonPrimarioBorde;
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(button1X, buttonY, buttonWidth, buttonHeight);
        }

        this.ctx.fillStyle = COLORES.botonPrimario;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.fillText(textoBotonSiguiente, button1X + buttonWidth / 2, buttonY + 35);

        if (this.imagenCargada && this.imagenBotones) {
            this.ctx.drawImage(this.imagenBotones, button2X + difX, buttonY + difY, buttonWidth, buttonHeight);
        } else {
            aplicarSombra(this.ctx, SOMBRAS.boton);
            this.ctx.fillStyle = COLORES.botonPeligro;
            this.ctx.fillRect(button2X, buttonY, buttonWidth, buttonHeight);
            limpiarSombra(this.ctx);
            this.ctx.strokeStyle = COLORES.botonPeligroBorde;
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(button2X, buttonY, buttonWidth, buttonHeight);
        }

        this.ctx.fillStyle = COLORES.botonPeligro;
        this.ctx.fillText('RESTART', button2X + buttonWidth / 2, buttonY + 35);
    }

    dibujarJuegoCompletado(x, y, width, height) {
        const centerX = x + width / 2;
        let currentY = y + 65;

        this.ctx.fillStyle = COLORES.juegoTerminado;
        this.ctx.font = FUENTES.tituloPequeño;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('¡FELICITACIONES!', centerX , currentY);

        currentY += 25;

        // --- línea  ---
        const linePadding = 80;
        const lineLength = width - (linePadding * 2);
        const lineStartX = centerX - (lineLength / 2);
        const lineEndX = centerX + (lineLength / 2);

        this.ctx.beginPath();
        this.ctx.moveTo(lineStartX, currentY );
        this.ctx.lineTo(lineEndX, currentY);
        this.ctx.strokeStyle = COLORES.textoPrimario;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        // -----------------------

        currentY += 40;

        this.ctx.fillStyle = COLORES.textoSecundario;
        this.ctx.font = FUENTES.textoMedio;
        this.ctx.fillText('¡Completaste Blocka!', centerX  , currentY);

        currentY += 50;
        this.ctx.font = FUENTES.textoNormal;
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.fillText(`Tiempo total: ${formatearTiempo(this.datos.tiempoTotal)}`, centerX, currentY);
        currentY += 30;
        this.ctx.fillText(`Movimientos totales: ${this.datos.movimientosTotales}`, centerX, currentY);
        currentY += 30;
        this.ctx.fillText(`Ayudas usadas: ${this.datos.ayudasUsadas}`, centerX, currentY);
        currentY += 20;

        const buttonWidth = 250;
        const buttonHeight = 65;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = currentY;

        this.botones = [{ id: 'home', x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight }];

        if (this.imagenCargada && this.imagenBotones) {
            this.ctx.drawImage(this.imagenBotones, buttonX, buttonY, buttonWidth, buttonHeight);
        } else {
            aplicarSombra(this.ctx, SOMBRAS.boton);
            this.ctx.fillStyle = COLORES.botonSecundario;
            this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
            limpiarSombra(this.ctx);
            this.ctx.strokeStyle = COLORES.botonSecundarioBorde;
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        }

        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.fillText('VOLVER AL INICIO', centerX, buttonY + 38);
    }

    dibujarFallido(x, y, width, height) {
        const centerX = x + width / 2;
        let currentY = y + 75;

        this.ctx.fillStyle = COLORES.botonPeligro;
        this.ctx.font = FUENTES.tituloPequeño;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('NIVEL FALLIDO', centerX, currentY);

        currentY += 35;

        // --- línea corregida ---
        const linePadding = 90;
        const lineLength = width - (linePadding * 2);
        const lineStartX = centerX - (lineLength / 2);
        const lineEndX = centerX + (lineLength / 2);

        this.ctx.beginPath();
        this.ctx.moveTo(lineStartX, currentY);
        this.ctx.lineTo(lineEndX, currentY);
        this.ctx.strokeStyle = COLORES.textoPrimario;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        // -----------------------

        currentY += 65;

        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.textoMedio;
        this.ctx.fillText('¡Se acabó el tiempo!', centerX, currentY);

        currentY += 80;

        const buttonWidth = 220;
        const buttonHeight = 65;
        const espaciado = 20;
        const totalWidth = (buttonWidth * 2) + espaciado;
        const startX = centerX - totalWidth / 2;
        const buttonY = currentY;
        const difX = 0;
        const difY = -5;

        const button1X = startX;
        const button2X = startX + buttonWidth + espaciado;

        this.botones = [
            { id: 'reintentar', x: button1X, y: buttonY, width: buttonWidth, height: buttonHeight },
            { id: 'home', x: button2X, y: buttonY, width: buttonWidth, height: buttonHeight }
        ];

        if (this.imagenCargada && this.imagenBotones) {
            this.ctx.drawImage(this.imagenBotones, button1X + difX, buttonY + difY, buttonWidth, buttonHeight);
        } else {
            aplicarSombra(this.ctx, SOMBRAS.boton);
            this.ctx.fillStyle = COLORES.botonPrimario;
            this.ctx.fillRect(button1X, buttonY, buttonWidth, buttonHeight);
            limpiarSombra(this.ctx);
            this.ctx.strokeStyle = COLORES.botonPrimarioBorde;
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(button1X, buttonY, buttonWidth, buttonHeight);
        }

        this.ctx.fillStyle = COLORES.botonPrimario;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.fillText('REINTENTAR', button1X + buttonWidth / 2, buttonY + 35);

        if (this.imagenCargada && this.imagenBotones) {
            this.ctx.drawImage(this.imagenBotones, button2X + difX, buttonY + difY, buttonWidth, buttonHeight);
        } else {
            aplicarSombra(this.ctx, SOMBRAS.boton);
            this.ctx.fillStyle = COLORES.botonPeligro;
            this.ctx.fillRect(button2X, buttonY, buttonWidth, buttonHeight);
            limpiarSombra(this.ctx);
            this.ctx.strokeStyle = COLORES.botonPeligroBorde;
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(button2X, buttonY, buttonWidth, buttonHeight);
        }

        this.ctx.fillStyle = COLORES.botonPeligro;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.fillText('VOLVER', button2X + buttonWidth / 2, buttonY + 35);
    }

    clickEnBoton(x, y) {
        if (!this.visible || this.botones.length === 0) return null;
        for (const boton of this.botones) {
            if (x >= boton.x && x <= boton.x + boton.width && y >= boton.y && y <= boton.y + boton.height) {
                return boton.id;
            }
        }
        return null;
    }
}
