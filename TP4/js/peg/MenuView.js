// ============================================
// MENUVIEW.JS - Vista del Menu Principal
// ============================================

import { BOARDS, BUG_IMAGES } from './constants.js';
import { dibujarTextoCentrado, dibujarRectanguloRedondeado, puntoEnRectangulo } from './utils.js';

export class MenuView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Configuracion seleccionada
        this.tableroSeleccionado = Object.keys(BOARDS)[0];
        this.fichaSeleccionada = 0;

        // Elementos de UI
        this.selectoresTablero = [];
        this.selectoresFicha = [];
        this.botonComenzar = null;

        this.inicializar();
    }

    inicializar() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        // ---------------------------
        // Selectores de tablero (centrados en 1 fila)
        // ---------------------------
        const tiposTablero = Object.keys(BOARDS);
        const anchoSelector = 100;
        const altoSelector = 50;
        const gapTableroX = 20;
        const tablerosY = 110;

        const totalTablerosAncho = tiposTablero.length * anchoSelector + (tiposTablero.length - 1) * gapTableroX;
        const inicioTablerosX = (canvasWidth - totalTablerosAncho) / 2;

        this.selectoresTablero = [];

        for (let i = 0; i < tiposTablero.length; i++) {
            const tipo = tiposTablero[i];
            this.selectoresTablero.push({
                tipo,
                nombre: tipo,
                x: inicioTablerosX + i * (anchoSelector + gapTableroX),
                y: tablerosY,
                ancho: anchoSelector,
                alto: altoSelector
            });
        }

        // ---------------------------
        // Selectores de ficha (centrados en 1 fila)
        // ---------------------------
        const tamFicha = 60;
        const gapFichaX = 20;
        const fichaY = canvasHeight - 200;

        this.selectoresFicha = [];

        const cantFichas = BUG_IMAGES.length;
        const totalFichasAncho = cantFichas * tamFicha + (cantFichas - 1) * gapFichaX;
        const inicioFichaX = (canvasWidth - totalFichasAncho) / 2;

        for (let i = 0; i < cantFichas; i++) {
            this.selectoresFicha.push({
                indice: i,
                x: inicioFichaX + i * (tamFicha + gapFichaX),
                y: fichaY,
                ancho: tamFicha,
                alto: tamFicha
            });
        }

        // ---------------------------
        // Botón comenzar (centrado)
        // ---------------------------
        const btnAncho = 150;
        const btnAlto = 45;
        const margenInferior = 40;

        this.botonComenzar = {
            x: (canvasWidth - btnAncho) / 2,
            y: canvasHeight - btnAlto - margenInferior,
            ancho: btnAncho,
            alto: btnAlto
        };
    }


    renderizar() {
        // Limpiar canvas
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Titulo
        dibujarTextoCentrado(
            this.ctx,
            '<PEG SOLITAIRE/>',
            this.canvas.width / 2,
            40,
            'bold 32px Arial',
            '#ECF0F1'
        );

        // Subtitulo tablero
        dibujarTextoCentrado(
            this.ctx,
            'Selecciona un tablero:',
            this.canvas.width / 2,
            80,
            '18px Arial',
            '#ECF0F1'
        );

        // Dibujar selectores de tablero
        for (let i = 0; i < this.selectoresTablero.length; i++) {
            const selector = this.selectoresTablero[i];
            const seleccionado = selector.tipo === this.tableroSeleccionado;

            this.ctx.save();
            dibujarRectanguloRedondeado(
                this.ctx,
                selector.x,
                selector.y,
                selector.ancho,
                selector.alto,
                10
            );

            this.ctx.fillStyle = seleccionado ? '#3498DB' : '#34495E';
            this.ctx.fill();
            this.ctx.strokeStyle = seleccionado ? '#2980B9' : '#2C3E50';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            dibujarTextoCentrado(
                this.ctx,
                selector.nombre,
                selector.x + selector.ancho / 2,
                selector.y + selector.alto / 2,
                'bold 16px Arial',
                '#ECF0F1'
            );
            this.ctx.restore();
        }

        dibujarTextoCentrado(
            this.ctx,
            'Selecciona una ficha:',
            this.canvas.width / 2,
            250,
            '18px Arial',
            '#ECF0F1'
        );

        // Dibujar selectores de ficha (solo rectAngulos de color por ahora)
        for (let i = 0; i < this.selectoresFicha.length; i++) {
            const selector = this.selectoresFicha[i];
            const seleccionado = selector.indice === this.fichaSeleccionada;

            this.ctx.save();
            this.ctx.fillStyle = seleccionado ? '#F39C12' : '#95A5A6';
            this.ctx.fillRect(selector.x, selector.y, selector.ancho, selector.alto);
            this.ctx.strokeStyle = seleccionado ? '#E67E22' : '#7F8C8D';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(selector.x, selector.y, selector.ancho, selector.alto);

            // Numero de ficha
            dibujarTextoCentrado(
                this.ctx,
                (i + 1).toString(),
                selector.x + selector.ancho / 2,
                selector.y + selector.alto / 2,
                'bold 24px Arial',
                '#ECF0F1'
            );
            this.ctx.restore();
        }

        // Boton comenzar
        this.ctx.save();
        dibujarRectanguloRedondeado(
            this.ctx,
            this.botonComenzar.x,
            this.botonComenzar.y,
            this.botonComenzar.ancho,
            this.botonComenzar.alto,
            10
        );
        this.ctx.fillStyle = '#27AE60';
        this.ctx.fill();
        this.ctx.strokeStyle = '#229954';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        dibujarTextoCentrado(
            this.ctx,
            'COMENZAR',
            this.botonComenzar.x + this.botonComenzar.ancho / 2,
            this.botonComenzar.y + this.botonComenzar.alto / 2,
            'bold 18px Arial',
            '#ECF0F1'
        );
        this.ctx.restore();
    }

    detectarClickTablero(x, y) {
        for (let i = 0; i < this.selectoresTablero.length; i++) {
            const selector = this.selectoresTablero[i];
            if (puntoEnRectangulo(x, y, selector)) {
                this.tableroSeleccionado = selector.tipo;
                return selector.tipo;
            }
        }
        return null;
    }

    detectarClickFicha(x, y) {
        for (let i = 0; i < this.selectoresFicha.length; i++) {
            const selector = this.selectoresFicha[i];
            if (puntoEnRectangulo(x, y, selector)) {
                this.fichaSeleccionada = selector.indice;
                return selector.indice;
            }
        }
        return null;
    }

    detectarClickComenzar(x, y) {
        return puntoEnRectangulo(x, y, this.botonComenzar);
    }

    obtenerConfiguracion() {
        return {
            tipoTablero: this.tableroSeleccionado,
            indiceFicha: this.fichaSeleccionada
        };
    }
}
