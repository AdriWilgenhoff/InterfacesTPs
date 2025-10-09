// audio.js - Gestor de audio del juego

export class GestorAudio {
    constructor(sounds) {
        this.sounds = sounds;              // Objeto con los nombres y rutas de los sonidos
        this.audioElements = {};           // Almacena los elementos Audio precargados
        this.volumen = 0.5;                // Volumen por defecto (50%)
        this.muteado = false;              // Estado del audio (false = sonido activo)
        this.precargarSonidos();
    }
    
    /**
     * Precarga todos los sonidos del juego para evitar delays al reproducir
     */
    precargarSonidos() {
        // Recorrer cada sonido definido en constans.js
        for (const [nombre, ruta] of Object.entries(this.sounds)) {
            const audio = new Audio(ruta);
            audio.volume = this.volumen;
            audio.preload = 'auto';        // Precargar automáticamente
            this.audioElements[nombre] = audio;
        }
    }
    
    /**
     * Reproduce un sonido por su nombre
     * @param {string} nombreSonido - Nombre del sonido a reproducir (ej: 'movimiento', 'nivelCompletado')
     */
    reproducir(nombreSonido) {
        // Si está muteado, no reproducir nada
        if (this.muteado) return;
        
        const audio = this.audioElements[nombreSonido];
        if (audio) {
            // Reiniciar el audio desde el inicio para poder reproducirlo múltiples veces
            audio.currentTime = 0;
            audio.play().catch(error => {
                // Algunos navegadores bloquean el audio hasta que el usuario interactúe
                console.warn(`No se pudo reproducir ${nombreSonido}:`, error);
            });
        } else {
            console.warn(`Sonido no encontrado: ${nombreSonido}`);
        }
    }
    
    /**
     * Establece el volumen general del juego
     * @param {number} volumen - Valor entre 0 y 1 (0 = silencio, 1 = máximo)
     */
    establecerVolumen(volumen) {
        this.volumen = Math.max(0, Math.min(1, volumen)); // Limitar entre 0 y 1
        
        // Aplicar el nuevo volumen a todos los audios
        for (const audio of Object.values(this.audioElements)) {
            audio.volume = this.volumen;
        }
    }
    
    /**
     * Mutea el audio del juego
     */
    mutear() {
        this.muteado = true;
    }
    
    /**
     * Desmutea el audio del juego
     */
    desmutear() {
        this.muteado = false;
    }
    
    /**
     * Alterna entre muteado y no muteado
     */
    toggleMute() {
        this.muteado = !this.muteado;
    }

    /**
     * Retorna el estado actual del audio
     * @returns {boolean} - true si está muteado, false si no
     */
    estaMuteado() {
        return this.muteado;
    }
}