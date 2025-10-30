// ============================================
// MODALVIEW.JS - Vista de Modales
// ============================================

import { dibujarTextoCentrado, dibujarRectanguloRedondeado, puntoEnRectangulo, formatearTiempo } from './utils.js';

export class ModalView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.visible = false;
        this.tipoModal = '';
        this.tiempo = 0;
        this.movimientos = 0;
        this.fichasRestantes = 0;

        // Botones
        this.botonMenu = null;
        this.botonReintentar = null;
    }

    mostrarVictoria(tiempo, movimientos, fichasRestantes) {
        this.visible = true;
        this.tipoModal = 'victoria';
        this.tiempo = tiempo;
        this.movimientos = movimientos;
        this.fichasRestantes = fichasRestantes;
        this.inicializarBotonesWin();
    }

    mostrarDerrota(tiempo, movimientos, fichasRestantes) {
        this.visible = true;
        this.tipoModal = 'derrota';
        this.tiempo = tiempo;
        this.movimientos = movimientos;
        this.fichasRestantes = fichasRestantes;
        this.inicializarBotonesFail();
    }

    ocultar() {
        this.visible = false;
    }

    inicializarBotonesFail() {
        const centroX = this.canvas.width / 2;
        const centroY = this.canvas.height / 2;

        this.botonMenu = {
            x: centroX - 180,
            y: centroY + 80,
            ancho: 150,
            alto: 50
        };

        this.botonReintentar = {
            x: centroX + 30,
            y: centroY + 80,
            ancho: 150,
            alto: 50
        };
    }

     inicializarBotonesWin() {
        const centroX = this.canvas.width / 2;
        const centroY = this.canvas.height / 2;

        this.botonMenu = {
            x: centroX - 180,
            y: centroY + 80,
            ancho: 150,
            alto: 50
        };
    }


    renderizar() {
        if (!this.visible) {
            return;
        }

        const centroX = this.canvas.width / 2;
        const centroY = this.canvas.height / 2;

        // Overlay oscuro
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Modal
        const modalAncho = 400;
        const modalAlto = 300;
        const modalX = centroX - modalAncho / 2;
        const modalY = centroY - modalAlto / 2;

        this.ctx.save();
        dibujarRectanguloRedondeado(
            this.ctx,
            modalX,
            modalY,
            modalAncho,
            modalAlto,
            15
        );
        this.ctx.fillStyle = '#ECF0F1';
        this.ctx.fill();
        this.ctx.strokeStyle = '#34495E';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();
        this.ctx.restore();

        // Título
        const esVictoria = this.tipoModal === 'victoria';
        const titulo = esVictoria ? 'VICTORIA!' : 'DERROTA';
        const colorTitulo = esVictoria ? '#27AE60' : '#E74C3C';

        dibujarTextoCentrado(
            this.ctx,
            titulo,
            centroX,
            centroY - 80,
            'bold 36px Arial',
            colorTitulo
        );

        // Estadísticas
        const inicioEstadisticas = centroY - 30;
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';

        this.ctx.fillText('Tiempo: ' + formatearTiempo(this.tiempo), centroX, inicioEstadisticas);
        this.ctx.fillText('Movimientos: ' + this.movimientos, centroX, inicioEstadisticas + 30);
        this.ctx.fillText('Fichas restantes: ' + this.fichasRestantes, centroX, inicioEstadisticas + 60);

        // Botones
        // Botón Menú
        this.ctx.save();
        dibujarRectanguloRedondeado(
            this.ctx,
            this.botonMenu.x,
            this.botonMenu.y,
            this.botonMenu.ancho,
            this.botonMenu.alto,
            8
        );
        this.ctx.fillStyle = '#3498DB';
        this.ctx.fill();
        this.ctx.strokeStyle = '#2980B9';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        dibujarTextoCentrado(
            this.ctx,
            'MENU',
            this.botonMenu.x + this.botonMenu.ancho / 2,
            this.botonMenu.y + this.botonMenu.alto / 2,
            'bold 18px Arial',
            '#FFFFFF'
        );
        this.ctx.restore();

        
        if (this.tipoModal === 'derrota') {
        // Botón Reintentar
        this.ctx.save();
        dibujarRectanguloRedondeado(
            this.ctx,
            this.botonReintentar.x,
            this.botonReintentar.y,
            this.botonReintentar.ancho,
            this.botonReintentar.alto,
            8
        );
        this.ctx.fillStyle = '#27AE60';
        this.ctx.fill();
        this.ctx.strokeStyle = '#229954';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        dibujarTextoCentrado(
            this.ctx,
            'REINTENTAR',
            this.botonReintentar.x + this.botonReintentar.ancho / 2,
            this.botonReintentar.y + this.botonReintentar.alto / 2,
            'bold 18px Arial',
            '#FFFFFF'
        );
        this.ctx.restore();
        }

        this.ctx.textAlign = 'start';
    }

    detectarClickBoton(x, y) {
        if (!this.visible) {
            return null;
        }

        if (puntoEnRectangulo(x, y, this.botonMenu)) {
            return 'menu';
        }
        if (puntoEnRectangulo(x, y, this.botonReintentar)) {
            return 'reintentar';
        }
        return null;
    }

    estaVisible() {
        return this.visible;
    }
}