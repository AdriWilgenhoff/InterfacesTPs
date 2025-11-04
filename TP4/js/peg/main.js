import { AppState } from './appState.js';
import { MenuController } from './MenuController.js';
import { GameController } from './GameController.js';

// Variable global para la aplicación
let app = null;

/**
 * Clase principal de la aplicación
 */
class MainApp {
    constructor(canvas) {
        this.canvas = canvas;
        this.appState = new AppState(canvas);
        this.estadoAnterior = null;
        this.loopId = null;
    }

    /**
     * Inicializa la aplicación
     */
    inicializar() {
        this.appState.inicializar();

        this.crearMenuController();

        this.iniciarLoopPrincipal();
    }

    /**
     * Verifica cambios de estado y actualiza controladores
     */
    verificarCambiosEstado() {
        const estadoActual = this.appState.getEstadoActual();

        if (estadoActual !== this.estadoAnterior) {
            console.log('Cambio de estado:', this.estadoAnterior, '->', estadoActual);

            if (estadoActual === 'menu') {
                this.crearMenuController();
            } else if (estadoActual === 'jugando') {
                const config = this.appState.getConfiguracion();
                this.crearGameController(config);
            }

            this.estadoAnterior = estadoActual;
        }
    }

    /**
     * Crea el controlador del menú
     */
    crearMenuController() {
        this.appState.limpiarControladorActual();

        const menuController = new MenuController(this.canvas, this.appState);

        this.appState.setControladorActual(menuController);
    }

    /**
     * Crea el controlador del juego
     */
    crearGameController(config) {
        // Limpiar controlador anterior
        this.appState.limpiarControladorActual();

           const gameController = new GameController(this.canvas, config, this.appState);

        this.appState.setControladorActual(gameController);
    }

    /**
     * Inicia el loop principal de la aplicación
     */
    iniciarLoopPrincipal() {
        const loop = function() {
              this.verificarCambiosEstado();

              this.appState.actualizarEstado();

            this.loopId = requestAnimationFrame(loop);
        }.bind(this);

        this.loopId = requestAnimationFrame(loop);
    }

    /**
     * Detiene el loop principal
     */
    detenerLoop() {
        if (this.loopId) {
            cancelAnimationFrame(this.loopId);
            this.loopId = null;
        }
    }
}

/**
 * Función de inicialización del juego
 */
function inicializarJuego() {
    console.log('Inicializando juego Peg Solitaire...');

    const canvas = document.getElementById('game');

    if (!canvas) {
        console.error('No se encontró el elemento canvas con id "game"');
        return;
    }

    app = new MainApp(canvas);

    app.inicializar();

    console.log('Juego inicializado correctamente');
}

window.addEventListener('DOMContentLoaded', () => {
   
    const gameLauncher = document.querySelector('.gameLauncher');
    let juegoInicializado = false;

    if (!gameLauncher) {
        console.error('No se encontró el elemento .gameLauncher');
        return;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (gameLauncher.classList.contains('active') && !juegoInicializado) {
                    juegoInicializado = true;
                    inicializarJuego();
                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(gameLauncher, { attributes: true });
});