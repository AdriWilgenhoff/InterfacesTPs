// ============================================
// MENUCONTROLLER.JS - Controlador del Menú
// ============================================

import { MenuView } from './MenuView.js';

export class MenuController {
    constructor(canvas, appState) {
        this.canvas = canvas;
        this.appState = appState;
        this.menuView = new MenuView(canvas);
        this.eventListeners = [];

        this.inicializar();
    }

    inicializar() {
        this.configurarEventos();
        this.renderizar();
    }

    configurarEventos() {
        // Event listener para clicks
        const clickHandler = this.manejarClick.bind(this);
        this.canvas.addEventListener('click', clickHandler);
        this.eventListeners.push({ tipo: 'click', handler: clickHandler });
    }

    manejarClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Detectar click en selector de tablero
        const tipoTablero = this.menuView.detectarClickTablero(x, y);
        if (tipoTablero) {
            this.seleccionarTablero(tipoTablero);
            return;
        }

        // Detectar click en selector de ficha
        const indiceFicha = this.menuView.detectarClickFicha(x, y);
        if (indiceFicha !== null) {
            this.seleccionarFicha(indiceFicha);
            return;
        }

        // Detectar click en botón comenzar
        if (this.menuView.detectarClickComenzar(x, y)) {
            this.comenzarJuego();
            return;
        }
    }

    seleccionarTablero(tipo) {
        this.menuView.tableroSeleccionado = tipo;
        this.renderizar();
    }

    seleccionarFicha(indice) {
        this.menuView.fichaSeleccionada = indice;
        this.renderizar();
    }

    comenzarJuego() {
        const config = this.menuView.obtenerConfiguracion();

        // Cambiar estado a juego usando AppState
        // El main.js detectará el cambio y creará el GameController
        this.appState.cambiarAJuego(config);
    }

    renderizar() {
        this.menuView.renderizar();
    }

    actualizar() {
        // El menú no necesita actualización continua
        this.renderizar();
    }

    destruir() {
        // Remover event listeners
        for (let i = 0; i < this.eventListeners.length; i++) {
            const listener = this.eventListeners[i];
            this.canvas.removeEventListener(listener.tipo, listener.handler);
        }
        this.eventListeners = [];

        // Limpiar canvas
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
