// ============================================
// MAIN.JS - Coordinador Principal
// ============================================
// Archivo principal que coordina toda la aplicación
// Usa AppState para gestionar transiciones entre menú y juego

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
        // Inicializar estado
        this.appState.inicializar();

        // Crear el controlador inicial (menú)
        this.crearMenuController();

        // Iniciar loop principal
        this.iniciarLoopPrincipal();
    }

    /**
     * Verifica cambios de estado y actualiza controladores
     */
    verificarCambiosEstado() {
        const estadoActual = this.appState.getEstadoActual();

        // Si el estado cambió, actualizar controladores
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
        // Limpiar controlador anterior
        this.appState.limpiarControladorActual();

        // Crear nuevo controlador de menú
        const menuController = new MenuController(this.canvas, this.appState);

        // Registrar controlador en AppState
        this.appState.setControladorActual(menuController);
    }

    /**
     * Crea el controlador del juego
     * @param {Object} config - Configuración del juego {tipoTablero, indiceFicha}
     */
    crearGameController(config) {
        // Limpiar controlador anterior
        this.appState.limpiarControladorActual();

        // Crear nuevo controlador de juego
        const gameController = new GameController(this.canvas, config, this.appState);

        // Registrar controlador en AppState
        this.appState.setControladorActual(gameController);
    }

    /**
     * Inicia el loop principal de la aplicación
     */
    iniciarLoopPrincipal() {
        const loop = function() {
            // Verificar cambios de estado
            this.verificarCambiosEstado();

            // Actualizar estado actual
            this.appState.actualizarEstado();

            // Continuar loop
            this.loopId = requestAnimationFrame(loop);
        }.bind(this);

        // Iniciar loop
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

    // Crear instancia de la aplicación
    app = new MainApp(canvas);

    // Inicializar
    app.inicializar();

    console.log('Juego inicializado correctamente');
}

/**
 * Event listener para cuando el DOM esté listo
 * Observa el contenedor .gameLauncher para detectar cuando se activa
 */
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Cargado - Esperando activación del juego');
    
    const gameLauncher = document.querySelector('.gameLauncher'); // Contenedor de los canvas
    let juegoInicializado = false;

    if (!gameLauncher) {
        console.error('No se encontró el elemento .gameLauncher');
        return;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (gameLauncher.classList.contains('active') && !juegoInicializado) {
                    console.log('Canvas activado, inicializando juego...');
                    juegoInicializado = true;
                    inicializarJuego();
                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(gameLauncher, { attributes: true });
    console.log('Observer configurado correctamente');
});