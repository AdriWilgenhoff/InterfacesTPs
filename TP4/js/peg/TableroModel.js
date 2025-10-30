// ============================================
// TABLEROMODEL.JS - Lógica del Juego
// ============================================
// Modelo que contiene toda la lógica del juego Peg Solitaire
// No conoce nada sobre Canvas ni renderizado

import { BOARDS } from './constants.js';
import { copiarMatriz } from './utils.js';

export class TableroModel {
    constructor(tipoTablero) {
        this.tipoTablero = tipoTablero;
        this.tablero = null;
        this.tableroInicial = null;
        this.movimientosRealizados = 0;
        this.fichasRestantes = 0;
        this.juegoTerminado = false;

        this.inicializarTablero(tipoTablero);
    }

    /**
     * Inicializa el tablero según el tipo seleccionado
     * @param {string} tipoTablero - Tipo de tablero (english, european, etc.)
     */
    inicializarTablero(tipoTablero) {
        // Obtener el tablero desde constants
        const tableroBase = BOARDS[tipoTablero];

        if (!tableroBase) {
            console.error('Tipo de tablero no válido:', tipoTablero);
            return;
        }

        // Copiar el tablero base
        this.tablero = copiarMatriz(tableroBase);
        this.tableroInicial = copiarMatriz(tableroBase);

        // Contar fichas iniciales
        this.fichasRestantes = this.contarFichas();
        this.movimientosRealizados = 0;
        this.juegoTerminado = false;
    }

    /**
     * Cuenta el número de fichas en el tablero
     * @returns {number} Cantidad de fichas
     */
    contarFichas() {
        let contador = 0;
        for (let i = 0; i < this.tablero.length; i++) {
            for (let j = 0; j < this.tablero[i].length; j++) {
                if (this.tablero[i][j] === 1) {
                    contador++;
                }
            }
        }
        return contador;
    }

    /**
     * Verifica si una posición es válida en el tablero
     * @param {number} fila - Fila
     * @param {number} col - Columna
     * @returns {boolean} true si la posición es válida
     */
    esPosicionValida(fila, col) {
        if (fila < 0 || fila >= this.tablero.length) {
            return false;
        }
        if (col < 0 || col >= this.tablero[fila].length) {
            return false;
        }
        // -1 indica posición no jugable
        return this.tablero[fila][col] !== -1;
    }

    /**
     * Verifica si hay una ficha en la posición
     * @param {number} fila - Fila
     * @param {number} col - Columna
     * @returns {boolean} true si hay una ficha
     */
    hayFicha(fila, col) {
        if (!this.esPosicionValida(fila, col)) {
            return false;
        }
        return this.tablero[fila][col] === 1;
    }

    /**
     * Verifica si la posición está vacía
     * @param {number} fila - Fila
     * @param {number} col - Columna
     * @returns {boolean} true si está vacía
     */
    estaVacio(fila, col) {
        if (!this.esPosicionValida(fila, col)) {
            return false;
        }
        return this.tablero[fila][col] === 0;
    }

    /**
     * Verifica si un movimiento es válido
     * @param {number} filaOrigen - Fila origen
     * @param {number} colOrigen - Columna origen
     * @param {number} filaDestino - Fila destino
     * @param {number} colDestino - Columna destino
     * @returns {boolean} true si el movimiento es válido
     */
    esMovimientoValido(filaOrigen, colOrigen, filaDestino, colDestino) {

        // Verificar que destino esté vacío
        if (!this.estaVacio(filaDestino, colDestino)) {
            return false;
        }

        // Calcular diferencias
        const difFila = filaDestino - filaOrigen;
        const difCol = colDestino - colOrigen;

        // Movimiento horizontal (2 casillas)
        if (difFila === 0 && Math.abs(difCol) === 2) {
            const colIntermedia = colOrigen + difCol / 2;
            return this.hayFicha(filaOrigen, colIntermedia);
        }

        // Movimiento vertical (2 casillas)
        if (difCol === 0 && Math.abs(difFila) === 2) {
            const filaIntermedia = filaOrigen + difFila / 2;
            return this.hayFicha(filaIntermedia, colOrigen);
        }

        // No es un movimiento válido
        return false;
    }

    /**
     * Realiza un movimiento en el tablero
     * @param {number} filaOrigen - Fila origen
     * @param {number} colOrigen - Columna origen
     * @param {number} filaDestino - Fila destino
     * @param {number} colDestino - Columna destino
     * @returns {boolean} true si el movimiento se realizó
     */
    realizarMovimiento(filaOrigen, colOrigen, filaDestino, colDestino) {
        if (!this.esMovimientoValido(filaOrigen, colOrigen, filaDestino, colDestino)) {
            return false;
        }

        // Calcular posición intermedia
        const filaIntermedia = (filaOrigen + filaDestino) / 2;
        const colIntermedia = (colOrigen + colDestino) / 2;

        // Realizar movimiento
        this.tablero[filaOrigen][colOrigen] = 0; // Quitar ficha origen
        this.tablero[filaIntermedia][colIntermedia] = 0; // Eliminar ficha saltada
        this.tablero[filaDestino][colDestino] = 1; // Colocar ficha destino

        // Actualizar estadísticas
        this.movimientosRealizados++;
        this.fichasRestantes = this.contarFichas();

        return true;
    }

    /**
     * Obtiene los movimientos posibles desde una posición
     * @param {number} fila - Fila de la ficha
     * @param {number} col - Columna de la ficha
     * @returns {Array<Object>} Array de movimientos posibles {fila, col}
     */
    obtenerMovimientosPosibles(fila, col) {
        const movimientos = [];

        if (!this.hayFicha(fila, col)) {
            return movimientos;
        }

        // Direcciones: arriba, abajo, izquierda, derecha
        const direcciones = [
            { df: -2, dc: 0 },  // Arriba
            { df: 2, dc: 0 },   // Abajo
            { df: 0, dc: -2 },  // Izquierda
            { df: 0, dc: 2 }    // Derecha
        ];

        for (let i = 0; i < direcciones.length; i++) {
            const dir = direcciones[i];
            const nuevaFila = fila + dir.df;
            const nuevaCol = col + dir.dc;

            if (this.esMovimientoValido(fila, col, nuevaFila, nuevaCol)) {
                movimientos.push({ fila: nuevaFila, col: nuevaCol });
            }
        }

        return movimientos;
    }

    /**
     * Verifica si existe algún movimiento válido en todo el tablero
     * @returns {boolean} true si existe al menos un movimiento posible
     */
    existeMovimientoValido() {
        for (let i = 0; i < this.tablero.length; i++) {
            for (let j = 0; j < this.tablero[i].length; j++) {
                if (this.hayFicha(i, j)) {
                    const movimientos = this.obtenerMovimientosPosibles(i, j);
                    if (movimientos.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Verifica si el jugador ganó
     * @returns {boolean} true si ganó (solo queda 1 ficha)
     */
    verificarVictoria() {
        if (this.fichasRestantes === 1) {
            if (this.tablero[3][3] === 1) {
                this.juegoTerminado = true;
                return true;
            }
            this.verificarDerrota();
        }
        return false;
    }

    /**
     * Verifica si el jugador perdió
     * @returns {boolean} true si perdió (quedan fichas pero no hay movimientos)
     */
    verificarDerrota() {
        if (this.fichasRestantes >= 1 && !this.existeMovimientoValido()) {
            this.juegoTerminado = true;
            return true;
        }
        return false;
    }

    /**
     * Reinicia el tablero al estado inicial
     */
    reiniciar() {
        this.tablero = copiarMatriz(this.tableroInicial);
        this.fichasRestantes = this.contarFichas();
        this.movimientosRealizados = 0;
        this.juegoTerminado = false;
    }

    /**
     * Obtiene las estadísticas del juego
     * @returns {Object} Objeto con estadísticas
     */
    obtenerEstadisticas() {
        return {
            movimientos: this.movimientosRealizados,
            fichasRestantes: this.fichasRestantes,
            juegoTerminado: this.juegoTerminado
        };
    }

    /**
     * Obtiene el tablero actual
     * @returns {Array<Array<number>>} Matriz del tablero
     */
    getTablero() {
        return this.tablero;
    }

    /**
     * Obtiene el número de filas del tablero
     * @returns {number} Número de filas
     */
    getFilas() {
        return this.tablero.length;
    }

    /**
     * Obtiene el número de columnas del tablero
     * @returns {number} Número de columnas
     */
    getColumnas() {
        return this.tablero[0].length;
    }
}
