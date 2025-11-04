// ============================================
// GAMECONTROLLER.JS - Controlador del Juego
// ============================================

import { TableroModel } from './TableroModel.js';
import { TableroView } from './TableroView.js';
import { HudView } from './HudView.js';
import { ModalView } from './ModalView.js';
import { BUG_IMAGES, SOUNDS } from './constants.js';
import { cargarImagen } from './utils.js';
import { GestorAudio } from './audio.js';
import { BackgroundPeg } from './BackgroundPeg.js';

export class GameController {
    constructor(canvas, config, appState) {

        this.canvas = canvas;
        this.config = config;
        this.appState = appState;

        this.canvasBackground = document.querySelector('#backgroundGamePeg');
        this.ctxBackground = this.canvasBackground.getContext('2d');
        this.ctx = this.canvas.getContext('2d');

        // Modelo
        this.modelo = new TableroModel(config.tipoTablero);

        // Vistas
        this.vistaTablero = new TableroView(
            canvas,
            this.modelo.getFilas(),
            this.modelo.getColumnas()
        );
        this.vistaHud = new HudView(canvas);
        this.vistaModal = new ModalView(canvas);

        // Estado del juego
        this.fichaArrastrada = null;
        this.juegoActivo = true;
        this.eventListeners = [];
        this.imagenFicha = null;
        this.animationFrameId = null;
        // Timer
        this.tiempoActual = 0;
        this.tiempoLimite = null;
        this.timerInterval = null;

        this.audio = new GestorAudio(SOUNDS, 0.6);

        // Animaciones de fichas eliminadas
        this.animacionesEliminacion = [];

        // Obtener área del tablero desde la vista
        const areaTablero = this.vistaTablero.getAreaTablero();
        // Fondo
        this.background = new BackgroundPeg(this.ctxBackground, this.canvasBackground.width, this.canvasBackground.height, areaTablero);
        this.background.dibujar();
        this.background.iniciar();

        this.inicializar();
    }

    inicializar() {
        const rutaFicha = BUG_IMAGES[this.config.indiceFicha];

        Promise.all([
            cargarImagen(rutaFicha),
            this.vistaTablero.esperarImagenes()
        ])
            .then(([imagen]) => {
                this.imagenFicha = imagen;
                this.vistaTablero.crearFichas(this.modelo, imagen);

                const stats = this.modelo.obtenerEstadisticas();
                this.vistaHud.actualizarMovimientos(stats.movimientos);
                this.vistaHud.actualizarFichasRestantes(stats.fichasRestantes);

                this.configurarEventos();
                this.iniciarTimer();
                this.renderizar();
            })
            .catch((error) => {
                console.error('Error al cargar recursos del juego:', error);
            });

    }

    configurarEventos() {
        const eventos = [
            ['mousedown', this.manejarMouseDown],
            ['mousemove', this.manejarMouseMove],
            ['mouseup', this.manejarMouseUp],
            ['click', this.manejarClickHud]
        ];

        for (const [tipo, metodo] of eventos) {
            const handler = metodo.bind(this);
            this.canvas.addEventListener(tipo, handler);
            this.eventListeners.push({ tipo, handler });
        }
    }

    manejarMouseDown(event) {
        if (!this.juegoActivo || this.vistaModal.estaVisible()) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const ficha = this.vistaTablero.obtenerFichaEnPosicion(x, y);

        if (ficha) {
            this.fichaArrastrada = ficha;
            ficha.iniciarArrastre(x, y);
            const pos = ficha.getPosicionTablero();
            const movimientos = this.modelo.obtenerMovimientosPosibles(pos.fila, pos.col);
            this.vistaTablero.movimientosPosibles = movimientos;

            this.iniciarLoopAnimacion();

            this.renderizar();
        }
    }

    manejarMouseMove(event) {
        if (!this.fichaArrastrada) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.fichaArrastrada.actualizarArrastre(x, y);
        this.renderizar();
    }

    manejarMouseUp(event) {
        if (!this.fichaArrastrada || !this.juegoActivo) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const posDestino = this.vistaTablero.obtenerPosicionTablero(x, y);
        const posOrigen = this.fichaArrastrada.getPosicionOriginal();
        let movimientoValido = false;

        if (posDestino) {
            if (this.modelo.esMovimientoValido(
                posOrigen.fila,
                posOrigen.col,
                posDestino.fila,
                posDestino.col
            )) {
                this.modelo.realizarMovimiento(
                    posOrigen.fila,
                    posOrigen.col,
                    posDestino.fila,
                    posDestino.col
                );

                const coords = this.vistaTablero.obtenerCoordenadasPixeles(
                    posDestino.fila,
                    posDestino.col
                );
                this.fichaArrastrada.moverAPosicion(
                    coords.x,
                    coords.y,
                    posDestino.fila,
                    posDestino.col
                );

                // Eliminar ficha saltada con animación
                const filaSaltada = (posOrigen.fila + posDestino.fila) / 2;
                const colSaltada = (posOrigen.col + posDestino.col) / 2;
                const fichaSaltada = this.vistaTablero.obtenerFichaEnCelda(filaSaltada, colSaltada);

                if (fichaSaltada) {
                    this.vistaTablero.eliminarFicha(fichaSaltada);

                    // Agregar animación de eliminación
                    const coords = this.vistaTablero.obtenerCoordenadasPixeles(filaSaltada, colSaltada);
                    this.animacionesEliminacion.push({
                        x: this.vistaTablero.offsetX + coords.x + this.vistaTablero.tamanioFicha / 2,
                        y: this.vistaTablero.offsetY + coords.y + this.vistaTablero.tamanioFicha / 2,
                        progress: 0
                    });
                }

                movimientoValido = true;
                this.audio.reproducir('move');

                const stats = this.modelo.obtenerEstadisticas();
                this.vistaHud.actualizarMovimientos(stats.movimientos);
                this.vistaHud.actualizarFichasRestantes(stats.fichasRestantes);

                this.verificarEstadoJuego();
            }
        }

        if (!movimientoValido) {
            this.audio.reproducir('error');
            this.fichaArrastrada.retornarPosicionInicial();
        }

        this.fichaArrastrada.finalizarArrastre();
        this.fichaArrastrada = null;
        this.vistaTablero.limpiarMovimientosPosibles();

        this.renderizar();
    }

    manejarClickHud(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.vistaModal.estaVisible()) {
            const botonModal = this.vistaModal.detectarClickBoton(x, y);
            if (botonModal === 'menu') this.volverAlMenu();
            else if (botonModal === 'reintentar') this.reiniciarPartida();
            return;
        }

        const botonHud = this.vistaHud.detectarClickBoton(x, y);
        if (botonHud === 'home') this.volverAlMenu();
        else if (botonHud === 'reiniciar') this.reiniciarPartida();
        else if (botonHud === 'mute') this.toggleMute();
    }

    toggleMute() {
        this.audio.toggleMute();
        this.renderizar();
    }

    iniciarTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.tiempoLimite = this.config.tiempoLimiteSegundos || null;

        this.tiempoActual = 0;

        this.timerInterval = setInterval(function () {
            this.tiempoActual++;

            if (this.tiempoLimite !== null && this.tiempoActual >= this.tiempoLimite) {
                this.tiempoAgotado();
            } else {
                this.renderizar();
            }
        }.bind(this), 1000);
    }

    tiempoAgotado() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.juegoActivo = false;

        const stats = this.modelo.obtenerEstadisticas();
        this.audio.reproducir('lose');
        this.vistaModal.mostrarDerrota(this.tiempoActual, stats.movimientos, stats.fichasRestantes, 'tiempo');
        this.renderizar();
    }

    detenerTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    volverAlMenu() {
        this.appState.cambiarAMenu();
    }

    reiniciarPartida() {
        this.modelo.reiniciar();
        this.vistaTablero.crearFichas(this.modelo, this.imagenFicha);
        this.detenerTimer();
        this.iniciarTimer();
        this.vistaHud.reiniciar();
        const stats = this.modelo.obtenerEstadisticas();
        this.vistaHud.actualizarFichasRestantes(stats.fichasRestantes);
        this.vistaModal.ocultar();
        this.juegoActivo = true;
        this.animacionesEliminacion = [];
        this.renderizar();
    }

    verificarEstadoJuego() {
        if (this.modelo.verificarVictoria()) {
            this.detenerTimer();
            this.juegoActivo = false;
            this.audio.reproducir('win');
            const stats = this.modelo.obtenerEstadisticas();
            this.vistaModal.mostrarVictoria(
                this.tiempoActual,
                stats.movimientos,
                stats.fichasRestantes
            );
        } else if (this.modelo.verificarDerrota()) {
            this.detenerTimer();
            this.juegoActivo = false;
            this.audio.reproducir('lose');
            const stats = this.modelo.obtenerEstadisticas();
            this.vistaModal.mostrarDerrota(
                this.tiempoActual,
                stats.movimientos,
                stats.fichasRestantes
            );
        }
        this.renderizar();
    }

    iniciarLoopAnimacion() {
        if (this.animationFrameId) return;

        const loop = () => {
            this.renderizar();
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    }

    detenerLoopAnimacion() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    animarFichasEliminadas() {
        const ctx = this.canvas.getContext('2d');

        for (let i = this.animacionesEliminacion.length - 1; i >= 0; i--) {
            const anim = this.animacionesEliminacion[i];

            const scale = 1 - anim.progress;
            const rotation = anim.progress * Math.PI * 6;

            if (scale > 0) {
                ctx.save();
                ctx.translate(anim.x, anim.y);
                ctx.rotate(rotation);
                ctx.scale(scale, scale);
                ctx.globalAlpha = 1 - anim.progress;

                ctx.beginPath();
                ctx.arc(0, 0, this.vistaTablero.tamanioFicha / 2, 0, Math.PI * 2);
                ctx.clip();

                ctx.drawImage(
                    this.imagenFicha,
                    -this.vistaTablero.tamanioFicha / 2,
                    -this.vistaTablero.tamanioFicha / 2,
                    this.vistaTablero.tamanioFicha,
                    this.vistaTablero.tamanioFicha
                );

                ctx.restore();
            }

            anim.progress += 0.03;

            // Eliminar si terminó
            if (anim.progress >= 1) {
                this.animacionesEliminacion.splice(i, 1);
            }
        }
    }

    renderizar() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Renderizar tablero y fichas
        this.vistaTablero.actualizar(this.modelo);

        // Renderizar animaciones de fichas eliminadas
        this.animarFichasEliminadas();

        // Renderizar HUD
        this.vistaHud.renderizar(this.tiempoActual, this.tiempoLimite, this.audio.estaMuteado());

        // Renderizar modal
        if (this.vistaModal.estaVisible()) this.vistaModal.renderizar();
    }

    destruir() {
        for (const listener of this.eventListeners) {
            this.canvas.removeEventListener(listener.tipo, listener.handler);
        }
        this.eventListeners = [];
        this.detenerTimer();
        this.detenerLoopAnimacion();

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}