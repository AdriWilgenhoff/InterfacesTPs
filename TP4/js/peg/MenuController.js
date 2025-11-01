// ============================================
// MENUCONTROLLER.JS - Controlador del Men�
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

        // Tiempo
        const preset = this.menuView.detectarClickTiempo(x, y);
        if (preset !== null) {
            this.renderizar();
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
        this.appState.cambiarAJuego(config);
    }

    renderizar() {
        this.menuView.renderizar();
    }

    actualizar() {
        this.renderizar();
    }

    destruir() {
        for (let i = 0; i < this.eventListeners.length; i++) {
            const listener = this.eventListeners[i];
            this.canvas.removeEventListener(listener.tipo, listener.handler);
        }
        this.eventListeners = [];
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
