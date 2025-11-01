// ============================================
// GAMECONTROLLER.JS - Controlador del Juego
// ============================================

import { TableroModel } from './TableroModel.js';
import { TableroView } from './TableroView.js';
import { HudView } from './HudView.js';
import { ModalView } from './ModalView.js';
import { BUG_IMAGES, SOUNDS, } from './constants.js';
import { cargarImagen } from './utils.js';
import { GestorAudio } from './audio.js';
/* import {Background} from './background.js'; */

export class GameController {
    constructor(canvas, config, appState) {
        this.canvas = canvas;
        this.config = config;
        this.appState = appState;
        /* this.background = new Background(canvas); */

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

        // Timer
        this.tiempoActual = 0;
        this.tiempoLimite = null;
        this.timerInterval = null;

        this.audio = new GestorAudio(SOUNDS, 0.6);

        this.inicializar();
    }

    inicializar() {
        // Cargar imagen de ficha seleccionada
        const rutaFicha = BUG_IMAGES[this.config.indiceFicha];
        cargarImagen(rutaFicha).then(function (imagen) {
            this.imagenFicha = imagen;
            this.vistaTablero.crearFichas(this.modelo, imagen);
            this.configurarEventos();
            this.iniciarTimer();
            this.renderizar();
        }.bind(this)).catch(function (error) {
            console.error('Error al cargar imagen de ficha:', error);
        });
    }

    configurarEventos() {
        // Mouse down - iniciar arrastre
        const mouseDownHandler = this.manejarMouseDown.bind(this);
        this.canvas.addEventListener('mousedown', mouseDownHandler);
        this.eventListeners.push({ tipo: 'mousedown', handler: mouseDownHandler });

        // Mouse move - actualizar arrastre
        const mouseMoveHandler = this.manejarMouseMove.bind(this);
        this.canvas.addEventListener('mousemove', mouseMoveHandler);
        this.eventListeners.push({ tipo: 'mousemove', handler: mouseMoveHandler });

        // Mouse up - finalizar arrastre
        const mouseUpHandler = this.manejarMouseUp.bind(this);
        this.canvas.addEventListener('mouseup', mouseUpHandler);
        this.eventListeners.push({ tipo: 'mouseup', handler: mouseUpHandler });

        // Click - para botones del HUD y modal
        const clickHandler = this.manejarClickHud.bind(this);
        this.canvas.addEventListener('click', clickHandler);
        this.eventListeners.push({ tipo: 'click', handler: clickHandler });
    }

    manejarMouseDown(event) {
        if (!this.juegoActivo || this.vistaModal.estaVisible()) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Buscar ficha en esa posición
        const ficha = this.vistaTablero.obtenerFichaEnPosicion(x, y);

        if (ficha) {
            this.fichaArrastrada = ficha;
            ficha.iniciarArrastre(x, y);

            // Obtener movimientos posibles
            const pos = ficha.getPosicionTablero();
            const movimientos = this.modelo.obtenerMovimientosPosibles(pos.fila, pos.col);
            this.vistaTablero.movimientosPosibles = movimientos;

            this.renderizar();
        }
    }

    manejarMouseMove(event) {
        if (!this.fichaArrastrada) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.fichaArrastrada.actualizarArrastre(x, y);
        this.renderizar();
    }

    manejarMouseUp(event) {
        if (!this.fichaArrastrada || !this.juegoActivo) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Obtener posición del tablero donde se soltó
        const posDestino = this.vistaTablero.obtenerPosicionTablero(x, y);
        const posOrigen = this.fichaArrastrada.getPosicionOriginal();

        let movimientoValido = false;

        if (posDestino) {
            // Verificar si el movimiento es válido
            if (this.modelo.esMovimientoValido(
                posOrigen.fila,
                posOrigen.col,
                posDestino.fila,
                posDestino.col
            )) {
                // Realizar movimiento en el modelo
                this.modelo.realizarMovimiento(
                    posOrigen.fila,
                    posOrigen.col,
                    posDestino.fila,
                    posDestino.col
                );

                // Actualizar posición visual de la ficha
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

                // Eliminar ficha saltada
                const filaSaltada = (posOrigen.fila + posDestino.fila) / 2;
                const colSaltada = (posOrigen.col + posDestino.col) / 2;
                const fichaSaltada = this.vistaTablero.obtenerFichaEnCelda(
                    filaSaltada,
                    colSaltada
                );
                if (fichaSaltada) {
                    this.vistaTablero.eliminarFicha(fichaSaltada);
                }

                movimientoValido = true;
                this.audio.reproducir('move');


                // Actualizar HUD
                const stats = this.modelo.obtenerEstadisticas();
                this.vistaHud.actualizarMovimientos(stats.movimientos);
                this.vistaHud.actualizarFichasRestantes(stats.fichasRestantes);

                // Verificar victoria/derrota
                this.verificarEstadoJuego();
            }
        }

        // Si el movimiento no fue válido, retornar la ficha
        if (!movimientoValido) {
            this.audio.reproducir('error');
            this.fichaArrastrada.retornarPosicionInicial();
        }

        // Finalizar arrastre
        this.fichaArrastrada.finalizarArrastre();
        this.fichaArrastrada = null;

        // Limpiar movimientos posibles
        this.vistaTablero.limpiarMovimientosPosibles();

        this.renderizar();
    }

    manejarClickHud(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Verificar clicks en modal primero
        if (this.vistaModal.estaVisible()) {
            const botonModal = this.vistaModal.detectarClickBoton(x, y);
            if (botonModal === 'menu') {
                this.volverAlMenu();
            } else if (botonModal === 'reintentar') {
                this.reiniciarPartida();
            }
            return;
        }

        // Verificar clicks en HUD
        const botonHud = this.vistaHud.detectarClickBoton(x, y);
        if (botonHud === 'home') {
            this.volverAlMenu();
        } else if (botonHud === 'reiniciar') {
            this.reiniciarPartida();
        } else if (botonHud === 'mute') {
            this.toggleMute();
        }
    }

    toggleMute() {
        this.audio.toggleMute();
        this.renderizar();
    }

    iniciarTimer() {
        // Detener timer anterior si existe
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Obtener el tiempo límite de la configuración (para mostrar en el HUD)
        this.tiempoLimite = this.config.tiempoLimiteSegundos || null;

        // ===============================================
        // MODO ASCENDENTE (ACTUAL)
        // ===============================================
        // Siempre inicia en 0 y cuenta hacia arriba
        this.tiempoActual = 0;

        this.timerInterval = setInterval(function () {
            this.tiempoActual++;
            
            // Verificar si se alcanzó el límite (solo si hay límite configurado)
            if (this.tiempoLimite !== null && this.tiempoActual >= this.tiempoLimite) {
                this.tiempoAgotado();
            }
        }.bind(this), 1000);

        // ===============================================
        // MODO DESCENDENTE (COMENTADO - PARA ACTIVAR EN EL FUTURO)
        // ===============================================
        // Descomentar las siguientes líneas para usar modo descendente:
        
        /*
        // Inicia con el tiempo límite y cuenta hacia abajo
        this.tiempoActual = this.tiempoLimite !== null ? this.tiempoLimite : 0;

        this.timerInterval = setInterval(function () {
            if (this.tiempoLimite === null) {
                // Si no hay límite, modo ascendente
                this.tiempoActual++;
            } else {
                // Modo descendente
                this.tiempoActual--;

                // Verificar si se agotó el tiempo
                if (this.tiempoActual <= 0) {
                    this.tiempoActual = 0;
                    this.tiempoAgotado();
                }
            }
        }.bind(this), 1000);
        */
    }

    tiempoAgotado() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.juegoActivo = false;

        const stats = this.modelo.obtenerEstadisticas();
        this.vistaModal.mostrarDerrota(
            this.tiempoActual,
            stats.movimientos,
            stats.fichasRestantes
        );
        this.renderizar();
    }

    detenerTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    volverAlMenu() {
        // Cambiar estado usando AppState
        this.appState.cambiarAMenu();
    }

    reiniciarPartida() {
        // Reiniciar modelo
        this.modelo.reiniciar();

        // Recrear fichas visuales
        this.vistaTablero.crearFichas(this.modelo, this.imagenFicha);

        // Reiniciar timer con la configuración original
        this.detenerTimer();
        this.iniciarTimer();

        // Reiniciar HUD
        this.vistaHud.reiniciar();
        const stats = this.modelo.obtenerEstadisticas();
        this.vistaHud.actualizarFichasRestantes(stats.fichasRestantes);

        // Ocultar modal
        this.vistaModal.ocultar();

        // Reactivar juego
        this.juegoActivo = true;

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

            this.renderizar();
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

            this.renderizar();
        }
    }

    renderizar() {
        // Limpiar canvas
        const ctx = this.canvas.getContext('2d');
        //fondo background tablero 
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


        // Renderizar tablero y fichas
        this.vistaTablero.actualizar(this.modelo);

        // Renderizar HUD pasando el tiempo actual y estado de audio
        this.vistaHud.renderizar(this.tiempoActual, this.tiempoLimite, this.audio.estaMuteado());

        // Renderizar modal si está visible
        if (this.vistaModal.estaVisible()) {
            this.vistaModal.renderizar();
        }
    }

    actualizar() {
        // Actualizar HUD con tiempo actual
        const stats = this.modelo.obtenerEstadisticas();
        this.vistaHud.actualizarMovimientos(stats.movimientos);
        this.vistaHud.actualizarFichasRestantes(stats.fichasRestantes);

        this.renderizar();
    }

    destruir() {
        // Remover event listeners
        for (let i = 0; i < this.eventListeners.length; i++) {
            const listener = this.eventListeners[i];
            this.canvas.removeEventListener(listener.tipo, listener.handler);
        }
        this.eventListeners = [];

        // Detener timer
        this.detenerTimer();

        // Limpiar canvas
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}