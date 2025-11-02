// ============================================
// APPSTATE.JS - Estado Centralizado
// ============================================
// Clase que mantiene el estado global de la aplicaci�n
// Evita callbacks entre controladores usando estado compartido

export class AppState {
    constructor(canvas) {
        this.canvas = canvas;
        this.estadoActual = 'menu'; // 'menu' | 'jugando'
        this.configuracionJuego = null; // {tipoTablero, indiceFicha}
        this.controladorActual = null; // Referencia al controlador activo
    }

    /**
     * Inicializa el estado de la aplicaci�n
     */
    inicializar() {
        this.estadoActual = 'menu';
        this.configuracionJuego = null;
        this.controladorActual = null;
    }

    /**
     * Obtiene el estado actual de la aplicaci�n
     * @returns {string} 'menu' o 'jugando'
     */
    getEstadoActual() {
        return this.estadoActual;
    }

    /**
     * Obtiene la configuraci�n del juego
     * @returns {Object|null} Configuraci�n actual del juego
     */
    getConfiguracion() {
        return this.configuracionJuego;
    }

    /**
     * Obtiene el canvas
     * @returns {HTMLCanvasElement} Canvas de la aplicaci�n
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * Cambia al estado de men�
     * Llamado por GameController cuando se presiona Home o Modal
     */
    cambiarAMenu() {
        this.limpiarControladorActual();
        this.estadoActual = 'menu';
        this.configuracionJuego = null;
    }

    /**
     * Cambia al estado de juego con la configuraci�n dada
     * Llamado por MenuController cuando se presiona Comenzar
     * @param {Object} config - {tipoTablero, indiceFicha}
     */
    cambiarAJuego(config) {
        this.limpiarControladorActual();
        this.estadoActual = 'jugando';
        this.configuracionJuego = config;
    }

    /**
     * Establece el controlador actual
     * @param {Object} controlador - Controlador activo (MenuController o GameController)
     */
    setControladorActual(controlador) {
        this.controladorActual = controlador;
    }

    /**
     * Limpia el controlador actual llamando a su m�todo destruir()
     */
    limpiarControladorActual() {
        if (this.controladorActual && this.controladorActual.destruir) {
            this.controladorActual.destruir();
            this.controladorActual = null;
        }
    }

    /**
     * Actualiza el estado (llamado por el loop principal)
     * Delega la actualizaci�n al controlador actual
     */
    actualizarEstado() {
        if (this.controladorActual && this.controladorActual.actualizar) {
            this.controladorActual.actualizar();
        }
    }

    /**
     * Renderiza el estado actual
     * Delega el renderizado al controlador actual
     */
    renderizar() {
        if (this.controladorActual && this.controladorActual.renderizar) {
            this.controladorActual.renderizar();
        }
    }
}
