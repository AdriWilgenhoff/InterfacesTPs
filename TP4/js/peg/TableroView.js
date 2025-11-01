
// ============================================
// TABLEROVIEW.JS - Vista del Tablero
// ============================================

import { FichaView } from './FichaView.js';
import { cargarImagenes } from './utils.js';

export class TableroView {
    constructor(canvas, numFilas, numColumnas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.numFilas = numFilas;
        this.numColumnas = numColumnas;

        // Dimensiones del tablero y celdas
        this.tamanioCelda = 60.8;
        this.tamanioFicha = 50;
        this.anchoTablero = this.numColumnas * this.tamanioCelda;
        this.altoTablero = this.numFilas * this.tamanioCelda;

        // Posición del tablero en el canvas
        this.offsetX = 0;
        this.offsetY = 0;

        // Array de fichas 
        this.fichasView = [];

        // Imágenes de celdas
        this.urlImgCeldaInactiva = '../assets_game/peg/cells/inactive.png';
        this.urlImgCeldaVacia = '../assets_game/peg/cells/empty.png';
        this.urlImgCeldaConFicha = '../assets_game/peg/cells/active.png';

        this.imgCeldaInactiva = null;
        this.imgCeldaVacia = null;
        this.imgCeldaConFicha = null;

        // Flag para saber si las imágenes están listas
        this.imagenesListas = false;

        // Movimientos posibles a mostrar
        this.movimientosPosibles = [];

        this.calcularDimensiones();
        this.precargarImagenes();
    }

    async precargarImagenes() {
        try {
            const imagenes = await cargarImagenes([
                this.urlImgCeldaInactiva,
                this.urlImgCeldaVacia,
                this.urlImgCeldaConFicha
            ]);

            this.imgCeldaInactiva = imagenes[0];
            this.imgCeldaVacia = imagenes[1];
            this.imgCeldaConFicha = imagenes[2];
            
            // Marcar las imágenes como listas
            this.imagenesListas = true;
            console.log('✓ Imágenes del tablero cargadas correctamente');
        } catch (error) {
            console.error('Error al precargar imágenes del tablero:', error);
            // Incluso con error, marcamos como listas para no bloquear el render
            this.imagenesListas = true;
        }
    }

    calcularDimensiones() {
        this.offsetX = (this.canvas.width - this.anchoTablero) / 2;
        this.offsetY = (this.canvas.height - this.altoTablero) / 2;
    }

    crearFichas(modelo, imagenFicha) {
        this.fichasView = [];
        const tablero = modelo.getTablero();

        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                if (tablero[i][j] === 1) {
                    const ficha = new FichaView(
                        i, j, imagenFicha,
                        this.tamanioFicha,
                        this.offsetX, this.offsetY
                    );

                    const coords = this.obtenerCoordenadasPixeles(i, j);
                    ficha.setPosicion(coords.x, coords.y);
                    this.fichasView.push(ficha);
                }
            }
        }
    }

    renderizarTablero(modelo) {
        const tablero = modelo.getTablero();

        for (let i = 0; i < tablero.length; i++) {
            for (let j = 0; j < tablero[i].length; j++) {
                const valor = tablero[i][j];
                const x = this.offsetX + j * this.tamanioCelda;
                const y = this.offsetY + i * this.tamanioCelda;

                if (valor === -1) {
                    // Celda inactiva: intentar dibujar imagen si está lista
                    if (this.imagenesListas && this.imgCeldaInactiva) {
                        this.ctx.drawImage(this.imgCeldaInactiva, x, y, this.tamanioCelda, this.tamanioCelda);
                    } else {
                        // Fallback: dibujar color mientras cargan las imágenes
                        this.ctx.fillStyle = '#121414ff';
                        this.ctx.fillRect(x, y, this.tamanioCelda, this.tamanioCelda);
                    }
                    continue;
                } else {
                    this.dibujarCelda(x, y, valor === 0);
                }
            }
        }

        this.mostrarMovimientosPosibles(this.movimientosPosibles);
    }

    dibujarCelda(x, y, vacia) {
        this.ctx.save();
        
        // Si las imágenes están listas, usarlas
        if (this.imagenesListas) {
            if (vacia && this.imgCeldaVacia) {
                this.ctx.drawImage(this.imgCeldaVacia, x, y, this.tamanioCelda, this.tamanioCelda);
            } else if (!vacia && this.imgCeldaConFicha) {
                this.ctx.drawImage(this.imgCeldaConFicha, x, y, this.tamanioCelda, this.tamanioCelda);
            } else {
                // Fallback si la imagen no existe
                this.dibujarCeldaFallback(x, y, vacia);
            }
        } else {
            // Mientras cargan las imágenes, usar fallback
            this.dibujarCeldaFallback(x, y, vacia);
        }
        
        this.ctx.restore();
    }

    dibujarCeldaFallback(x, y, vacia) {
        // Dibujar fondo de la celda
        this.ctx.fillStyle = vacia ? '#3f4352ff' : '#28282eff';
        this.ctx.fillRect(x, y, this.tamanioCelda, this.tamanioCelda);

        // Dibujar borde de la celda
        this.ctx.strokeStyle = '#1b7513ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, this.tamanioCelda, this.tamanioCelda);

        // Dibujar círculo para indicar posición jugable
        const centroX = x + this.tamanioCelda / 2;
        const centroY = y + this.tamanioCelda / 2;
        const radio = this.tamanioFicha / 2 - 5;

        this.ctx.beginPath();
        this.ctx.arc(centroX, centroY, radio, 0, Math.PI * 2);
        this.ctx.fillStyle = '#323238ff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#1a4b36ff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    renderizarFichas() {
        for (const ficha of this.fichasView) {
            ficha.dibujar(this.ctx);
        }
    }

    mostrarMovimientosPosibles(movimientos) {
        this.movimientosPosibles = movimientos;
        for (const mov of movimientos) {
            const coords = this.obtenerCoordenadasPixeles(mov.fila, mov.col);
            this.ctx.save();
            const centroX = this.offsetX + coords.x + this.tamanioFicha / 2;
            const centroY = this.offsetY + coords.y + this.tamanioFicha / 2;
            const radio = this.tamanioFicha / 2;

            this.ctx.beginPath();
            this.ctx.arc(centroX, centroY, radio, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(80, 201, 100, 0.3)';
            this.ctx.fill();
            this.ctx.strokeStyle = '#354a77ff';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    obtenerFichaEnPosicion(x, y) {
        for (let i = this.fichasView.length - 1; i >= 0; i--) {
            if (this.fichasView[i].contienePoint(x, y)) {
                const ficha = this.fichasView[i];
                this.fichasView.splice(i, 1);
                this.fichasView.push(ficha);
                return ficha;
            }
        }
        return null;
    }

    obtenerPosicionTablero(x, y) {
        const relX = x - this.offsetX;
        const relY = y - this.offsetY;

        if (relX < 0 || relY < 0 ||
            relX >= this.anchoTablero || relY >= this.altoTablero) {
            return null;
        }

        const col = Math.floor(relX / this.tamanioCelda);
        const fila = Math.floor(relY / this.tamanioCelda);
        return { fila, col };
    }

    obtenerCoordenadasPixeles(fila, col) {
        const x = col * this.tamanioCelda + (this.tamanioCelda - this.tamanioFicha) / 2;
        const y = fila * this.tamanioCelda + (this.tamanioCelda - this.tamanioFicha) / 2;
        return { x, y };
    }

    eliminarFicha(ficha) {
        const i = this.fichasView.indexOf(ficha);
        if (i !== -1) this.fichasView.splice(i, 1);
    }

    obtenerFichaEnCelda(fila, col) {
        return this.fichasView.find(f => {
            const pos = f.getPosicionTablero();
            return pos.fila === fila && pos.col === col;
        }) || null;
    }

    actualizar(modelo) {
        this.ctx.clearRect(this.offsetX, this.offsetY, this.anchoTablero, this.altoTablero);
        this.renderizarTablero(modelo);
        this.renderizarFichas();
    }

    limpiarMovimientosPosibles() {
        this.movimientosPosibles = [];
    }

    getFichas() {
        return this.fichasView;
    }

    /**
     * Verifica si las imágenes del tablero están cargadas
     * @returns {boolean}
     */
    estanImagenesListas() {
        return this.imagenesListas;
    }
}


