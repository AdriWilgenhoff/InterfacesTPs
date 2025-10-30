// ============================================
// TABLEROVIEW.JS - Vista del Tablero
// ============================================
// Clase que renderiza el tablero y gestiona las fichas visuales

import { FichaView } from './FichaView.js';

export class TableroView {
    constructor(canvas, numFilas, numColumnas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.numFilas = numFilas;
        this.numColumnas = numColumnas;

        // Dimensiones del tablero y celdas
        this.tamanioCelda = 64;
        this.tamanioFicha = 50;
        this.anchoTablero = this.numColumnas * this.tamanioCelda;
        this.altoTablero = this.numFilas * this.tamanioCelda;

        // Posición del tablero en el canvas
        this.offsetX = 0;
        this.offsetY = 0;

        // Array de fichas visuales
        this.fichasView = [];

        // Movimientos posibles a mostrar
        this.movimientosPosibles = [];

        this.calcularDimensiones();
    }

    /**
     * Calcula las dimensiones y posición del tablero en el canvas
     */
    calcularDimensiones() {
        // Centrar el tablero en el canvas
        this.offsetX = (this.canvas.width - this.anchoTablero) / 2;
        this.offsetY = (this.canvas.height - this.altoTablero) / 2;
    }

    /**
     * Crea las fichas visuales basándose en el modelo
     * @param {TableroModel} modelo - Modelo del tablero
     * @param {HTMLImageElement} imagenFicha - Imagen de la ficha
     */
    crearFichas(modelo, imagenFicha) {
        this.fichasView = [];
        const tablero = modelo.getTablero();

        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                if (tablero[i][j] === 1) {
                    // Crear una nueva ficha visual
                    const ficha = new FichaView(
                        i,
                        j,
                        imagenFicha,
                        this.tamanioFicha,
                        this.offsetX,
                        this.offsetY
                    );

                    // Calcular posición en píxeles
                    const coords = this.obtenerCoordenadasPixeles(i, j);
                    ficha.setPosicion(coords.x, coords.y);

                    this.fichasView.push(ficha);
                }
            }
        }
    }

    /**
     * Renderiza el tablero completo
     * @param {TableroModel} modelo - Modelo del tablero
     */
    renderizarTablero(modelo) {
        const tablero = modelo.getTablero();

        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                const valor = tablero[i][j];

                // Calcular posición de la celda
                const x = this.offsetX + j * this.tamanioCelda;
                const y = this.offsetY + i * this.tamanioCelda;

                if (valor === -1) {
                    this.ctx.fillStyle = '#0004ffff';
                    this.ctx.fillRect(x, y, this.tamanioCelda, this.tamanioCelda);
                    // Celda no jugable - no dibujar nada o fondo diferente
                    continue;
                } else {
                    // Celda jugable (vacía o con ficha)
                    this.dibujarCelda(x, y, valor === 0);
                }
            }
        }

        // Mostrar movimientos posibles si hay alguno
        this.mostrarMovimientosPosibles(this.movimientosPosibles);
    }

    /**
     * Dibuja una celda del tablero
     * @param {number} x - Coordenada x
     * @param {number} y - Coordenada y
     * @param {boolean} vacia - true si la celda está vacía
     */
    dibujarCelda(x, y, vacia) {
        this.ctx.save();

        // Dibujar fondo de la celda
        this.ctx.fillStyle = vacia ? '#8B4513' : '#D2691E';
        this.ctx.fillRect(x, y, this.tamanioCelda, this.tamanioCelda);

        // Dibujar borde de la celda
        this.ctx.strokeStyle = '#5C4033';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, this.tamanioCelda, this.tamanioCelda);

        // Dibujar círculo para indicar posición jugable
        const centroX = x + this.tamanioCelda / 2;
        const centroY = y + this.tamanioCelda / 2;
        const radio = this.tamanioFicha / 2 - 5;

        this.ctx.beginPath();
        this.ctx.arc(centroX, centroY, radio, 0, Math.PI * 2);
        this.ctx.fillStyle = vacia ? '#A0522D' : '#CD853F';
        this.ctx.fill();
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }

    /**
     * Renderiza todas las fichas
     */
    renderizarFichas() {
        for (let i = 0; i < this.fichasView.length; i++) {
            this.fichasView[i].dibujar(this.ctx);
        }
    }

    /**
     * Muestra visualmente los movimientos posibles
     * @param {Array<Object>} movimientos - Array de {fila, col}
     */
    mostrarMovimientosPosibles(movimientos) {
        this.movimientosPosibles = movimientos;

        for (let i = 0; i < movimientos.length; i++) {
            const mov = movimientos[i];
            const coords = this.obtenerCoordenadasPixeles(mov.fila, mov.col);

            // Dibujar indicador de movimiento posible
            this.ctx.save();

            const centroX = this.offsetX + coords.x + this.tamanioFicha / 2;
            const centroY = this.offsetY + coords.y + this.tamanioFicha / 2;
            const radio = this.tamanioFicha / 2;

            // Círculo pulsante dorado
            this.ctx.beginPath();
            this.ctx.arc(centroX, centroY, radio, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(26, 10, 255, 0.3)';
            this.ctx.fill();
            this.ctx.strokeStyle = '#ff0000ff';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            this.ctx.restore();
        }
    }

    /**
     * Obtiene la ficha en una posición de píxeles
     * @param {number} x - Coordenada x
     * @param {number} y - Coordenada y
     * @returns {FichaView|null} Ficha encontrada o null
     */
    obtenerFichaEnPosicion(x, y) {
        // Buscar en orden inverso para obtener la ficha más arriba
        for (let i = this.fichasView.length - 1; i >= 0; i--) {
            if (this.fichasView[i].contienePoint(x, y)) {
                const ficha = this.fichasView[i];

                // Mover la ficha al final del array para que se dibuje encima
                this.fichasView.splice(i, 1);
                this.fichasView.push(ficha);

                return ficha;
            }
        }
        return null;
    }

    /**
     * Obtiene la posición del tablero (fila, columna) desde coordenadas de píxeles
     * @param {number} x - Coordenada x en píxeles
     * @param {number} y - Coordenada y en píxeles
     * @returns {Object|null} {fila, col} o null si está fuera del tablero
     */
    obtenerPosicionTablero(x, y) {
        // Ajustar por el offset del tablero
        const relX = x - this.offsetX;
        const relY = y - this.offsetY;

        // Verificar si está dentro del tablero
        if (relX < 0 || relY < 0 ||
            relX >= this.anchoTablero ||
            relY >= this.altoTablero) {
            return null;
        }

        // Calcular fila y columna
        const col = Math.floor(relX / this.tamanioCelda);
        const fila = Math.floor(relY / this.tamanioCelda);

        return { fila: fila, col: col };
    }

    /**
     * Obtiene las coordenadas en píxeles de una posición del tablero
     * @param {number} fila - Fila
     * @param {number} col - Columna
     * @returns {Object} {x, y} coordenadas relativas al offset
     */
    obtenerCoordenadasPixeles(fila, col) {
        const x = col * this.tamanioCelda + (this.tamanioCelda - this.tamanioFicha) / 2;
        const y = fila * this.tamanioCelda + (this.tamanioCelda - this.tamanioFicha) / 2;

        return { x: x, y: y };
    }

    /**
     * Elimina una ficha visual
     * @param {FichaView} ficha - Ficha a eliminar
     */
    eliminarFicha(ficha) {
        const indice = this.fichasView.indexOf(ficha);
        if (indice !== -1) {
            this.fichasView.splice(indice, 1);
        }
    }

    /**
     * Encuentra la ficha en una posición del tablero
     * @param {number} fila - Fila
     * @param {number} col - Columna
     * @returns {FichaView|null} Ficha encontrada o null
     */
    obtenerFichaEnCelda(fila, col) {
        for (let i = 0; i < this.fichasView.length; i++) {
            const pos = this.fichasView[i].getPosicionTablero();
            if (pos.fila === fila && pos.col === col) {
                return this.fichasView[i];
            }
        }
        return null;
    }

    /**
     * Actualiza la vista completa
     * @param {TableroModel} modelo - Modelo del tablero
     */
    actualizar(modelo) {
        // Limpiar canvas (solo la zona del tablero)
        this.ctx.clearRect(
            this.offsetX,
            this.offsetY,
            this.anchoTablero,
            this.altoTablero
        );

        // Renderizar tablero y fichas
        this.renderizarTablero(modelo);
        this.renderizarFichas();
    }

    /**
     * Limpia los movimientos posibles
     */
    limpiarMovimientosPosibles() {
        this.movimientosPosibles = [];
    }

    /**
     * Obtiene todas las fichas visuales
     * @returns {Array<FichaView>}
     */
    getFichas() {
        return this.fichasView;
    }
}