// ============================================
// HUDVIEW.JS - Vista del HUD (Head-Up Display)
// ============================================

import { dibujarTextoCentrado, dibujarRectanguloRedondeado, puntoEnRectangulo, formatearTiempo } from './utils.js';

export class HudView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.tiempoInicio = 0;
        this.tiempoTranscurrido = 0;
        this.movimientos = 0;
        this.fichasRestantes = 0;

        // Botones
        this.botonHome = {
            x: 20,
            y: 20,
            ancho: 80,
            alto: 40
        };

        this.botonReiniciar = {
            x: 110,
            y: 20,
            ancho: 80,
            alto: 40
        };
    }

    iniciarTemporizador() {
        this.tiempoInicio = Date.now();
        this.tiempoTranscurrido = 0;
    }

    detenerTemporizador() {
        if (this.tiempoInicio > 0) {
            this.tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);
            this.tiempoInicio = 0;
        }
    }

    actualizarMovimientos(cantidad) {
        this.movimientos = cantidad;
    }

    actualizarFichasRestantes(cantidad) {
        this.fichasRestantes = cantidad;
    }

    renderizar() {
        // Calcular tiempo actual
        let tiempoActual = this.tiempoTranscurrido;
        if (this.tiempoInicio > 0) {
            tiempoActual = Math.floor((Date.now() - this.tiempoInicio) / 1000);
        }

        // Botón Home
        this.ctx.save();
        dibujarRectanguloRedondeado(
            this.ctx,
            this.botonHome.x,
            this.botonHome.y,
            this.botonHome.ancho,
            this.botonHome.alto,
            5
        );
        this.ctx.fillStyle = '#E74C3C';
        this.ctx.fill();
        this.ctx.strokeStyle = '#C0392B';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        dibujarTextoCentrado(
            this.ctx,
            'HOME',
            this.botonHome.x + this.botonHome.ancho / 2,
            this.botonHome.y + this.botonHome.alto / 2,
            'bold 14px Arial',
            '#FFFFFF'
        );
        this.ctx.restore();

        // Botón Reiniciar
        this.ctx.save();
        dibujarRectanguloRedondeado(
            this.ctx,
            this.botonReiniciar.x,
            this.botonReiniciar.y,
            this.botonReiniciar.ancho,
            this.botonReiniciar.alto,
            5
        );
        this.ctx.fillStyle = '#F39C12';
        this.ctx.fill();
        this.ctx.strokeStyle = '#E67E22';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        dibujarTextoCentrado(
            this.ctx,
            'RESET',
            this.botonReiniciar.x + this.botonReiniciar.ancho / 2,
            this.botonReiniciar.y + this.botonReiniciar.alto / 2,
            'bold 14px Arial',
            '#FFFFFF'
        );
        this.ctx.restore();

        // Estadísticas en la parte superior derecha
        const infoX = this.canvas.width - 200;
        const infoY = 30;

        this.ctx.fillStyle = '#ECF0F1';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';

        this.ctx.fillText('Tiempo: ' + formatearTiempo(tiempoActual), infoX, infoY);
        this.ctx.fillText('Movimientos: ' + this.movimientos, infoX, infoY + 25);
        this.ctx.fillText('Fichas: ' + this.fichasRestantes, infoX, infoY + 50);

        this.ctx.textAlign = 'start';
    }

    detectarClickBoton(x, y) {
        if (puntoEnRectangulo(x, y, this.botonHome)) {
            return 'home';
        }
        if (puntoEnRectangulo(x, y, this.botonReiniciar)) {
            return 'reiniciar';
        }
        return null;
    }

    reiniciar() {
        this.iniciarTemporizador();
        this.movimientos = 0;
        this.fichasRestantes = 0;
    }

    getTiempoTranscurrido() {
        if (this.tiempoInicio > 0) {
            return Math.floor((Date.now() - this.tiempoInicio) / 1000);
        }
        return this.tiempoTranscurrido;
    }
}