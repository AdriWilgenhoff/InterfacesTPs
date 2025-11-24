import { MenuView } from './MenuView.js';

export class MenuController {
    // Crea el controlador del menú inicializando la vista y los event listeners
    constructor(canvas, appState) {
        this.canvas = canvas;
        this.appState = appState;
        this.menuView = new MenuView(canvas);
        this.eventListeners = [];

        this.inicializar();
    }

    // Inicializa el controlador configurando eventos y renderizando el menú
    inicializar() {
        this.configurarEventos();
        this.renderizar();
    }

    // Configura los event listeners del canvas para detectar clicks en el menú
    configurarEventos() {
        const clickHandler = this.manejarClick.bind(this);
        this.canvas.addEventListener('click', clickHandler);
        this.eventListeners.push({ tipo: 'click', handler: clickHandler });
    }

    // Maneja los eventos de click en el menú detectando en qué selector se hizo click
    manejarClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const tipoTablero = this.menuView.detectarClickTablero(x, y);
        if (tipoTablero) {
            this.seleccionarTablero(tipoTablero);
            return;
        }

        const indiceFicha = this.menuView.detectarClickFicha(x, y);
        if (indiceFicha !== null) {
            this.seleccionarFicha(indiceFicha);
            return;
        }

        const preset = this.menuView.detectarClickTiempo(x, y);
        if (preset !== null) {
            this.renderizar();
            return;
        }

        if (this.menuView.detectarClickComenzar(x, y)) {
            this.comenzarJuego();
            return;
        }
    }

    // Selecciona un tipo de tablero y actualiza la vista
    seleccionarTablero(tipo) {
        this.menuView.tableroSeleccionado = tipo;
        this.renderizar();
    }

    // Selecciona una ficha por su índice y actualiza la vista
    seleccionarFicha(indice) {
        this.menuView.fichaSeleccionada = indice;
        this.renderizar();
    }

    // Obtiene la configuración seleccionada y cambia el estado de la aplicación para iniciar el juego
    comenzarJuego() {
        const config = this.menuView.obtenerConfiguracion();
        this.appState.cambiarAJuego(config);
    }

    // Renderiza el menú delegando a la vista
    renderizar() {
        this.menuView.renderizar();
    }

    // Actualiza el estado del controlador renderizando el menú
    actualizar() {
        this.renderizar();
    }

    // Limpia el controlador eliminando event listeners y limpiando el canvas
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
