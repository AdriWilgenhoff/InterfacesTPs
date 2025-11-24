import { BOARDS } from './constants.js';
import { copiarMatriz } from './utils.js';

export class TableroModel {
    // Crea el modelo del tablero inicializando el tipo de tablero y las estadísticas del juego
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
     */
    inicializarTablero(tipoTablero) {
        const tableroBase = BOARDS[tipoTablero];

        if (!tableroBase) {
            return;
        }

        this.tablero = copiarMatriz(tableroBase);
        this.tableroInicial = copiarMatriz(tableroBase);

        this.fichasRestantes = this.contarFichas();
        this.movimientosRealizados = 0;
        this.juegoTerminado = false;
    }

    /**
     * Cuenta el número de fichas en el tablero
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
     */
    hayFicha(fila, col) {
        if (!this.esPosicionValida(fila, col)) {
            return false;
        }
        return this.tablero[fila][col] === 1;
    }

    /**
     * Verifica si la posición está vacía
     */
    estaVacio(fila, col) {
        if (!this.esPosicionValida(fila, col)) {
            return false;
        }
        return this.tablero[fila][col] === 0;
    }

    /**
     * Verifica si un movimiento es válido
     */
    esMovimientoValido(filaOrigen, colOrigen, filaDestino, colDestino) {

        if (!this.estaVacio(filaDestino, colDestino)) {
            return false;
        }

        const difFila = filaDestino - filaOrigen;
        const difCol = colDestino - colOrigen;

        if (difFila === 0 && Math.abs(difCol) === 2) {
            const colIntermedia = colOrigen + difCol / 2;
            return this.hayFicha(filaOrigen, colIntermedia);
        }

        if (difCol === 0 && Math.abs(difFila) === 2) {
            const filaIntermedia = filaOrigen + difFila / 2;
            return this.hayFicha(filaIntermedia, colOrigen);
        }

        return false;
    }

    /**
     * Realiza un movimiento en el tablero
     */
    realizarMovimiento(filaOrigen, colOrigen, filaDestino, colDestino) {
        if (!this.esMovimientoValido(filaOrigen, colOrigen, filaDestino, colDestino)) {
            return false;
        }

        const filaIntermedia = (filaOrigen + filaDestino) / 2;
        const colIntermedia = (colOrigen + colDestino) / 2;

        this.tablero[filaOrigen][colOrigen] = 0;
        this.tablero[filaIntermedia][colIntermedia] = 0; 
        this.tablero[filaDestino][colDestino] = 1; 

        this.movimientosRealizados++;
        this.fichasRestantes = this.contarFichas();

        return true;
    }

    /**
     * Obtiene los movimientos posibles desde una posición
     */
    obtenerMovimientosPosibles(fila, col) {
        const movimientos = [];

        if (!this.hayFicha(fila, col)) {
            return movimientos;
        }

        const direcciones = [
            { df: -2, dc: 0 }, 
            { df: 2, dc: 0 },  
            { df: 0, dc: -2 }, 
            { df: 0, dc: 2 }          ];

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
     */
    getTablero() {
        return this.tablero;
    }

    /**
     * Obtiene el número de filas del tablero
     */
    getFilas() {
        return this.tablero.length;
    }

    /**
     * Obtiene el número de columnas del tablero
     */
    getColumnas() {
        return this.tablero[0].length;
    }
}
