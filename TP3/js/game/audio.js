export class GestorAudio {
    constructor(sounds, volumen = 0.5) {
        this.sounds = sounds;
        this.audioElements = {};
        this.volumen = volumen;
        this.muteado = false;
        this.precargarSonidos();
    }
    
    /* Precarga todos los sonidos del juego */
    precargarSonidos() {
        for (const [nombre, ruta] of Object.entries(this.sounds)) {
            const audio = new Audio(ruta);
            audio.volume = this.volumen;
            audio.preload = 'auto';
            this.audioElements[nombre] = audio;
        }
    }
    
    /* Reproduce un sonido por su nombre */
    reproducir(nombreSonido) {
        if (this.muteado) return;
        
        const audio = this.audioElements[nombreSonido];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.warn(`No se pudo reproducir ${nombreSonido}:`, error);
            });
        } else {
            console.warn(`Sonido no encontrado: ${nombreSonido}`);
        }
    }
    
    /* Alterna entre muteado y no muteado */
    toggleMute() {
        this.muteado = !this.muteado;
    }

    
    /* Retorna si está muteado */
    estaMuteado() {
        return this.muteado;
    }
}