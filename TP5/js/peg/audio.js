export class GestorAudio {
    // Crea el gestor de audio inicializando los sonidos y el volumen predeterminado
    constructor(sounds, volumen = 0.5) {
        this.sounds = sounds;
        this.audioElements = {};
        this.volumen = volumen;
        this.muteado = false;
        this.precargarSonidos();
    }

    // Precarga todos los sonidos del juego creando elementos Audio para cada uno
    precargarSonidos() {
        for (const [nombre, ruta] of Object.entries(this.sounds)) {
            const audio = new Audio(ruta);
            audio.volume = this.volumen;
            audio.preload = 'auto';
            this.audioElements[nombre] = audio;
        }
    }

    // Reproduce un sonido por su nombre reiniciando su posición si ya estaba sonando
    reproducir(nombreSonido) {
        if (this.muteado) return;
        
        const audio = this.audioElements[nombreSonido];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(error => {
            });
        }
    }

    // Alterna entre estado muteado y no muteado del audio
    toggleMute() {
        this.muteado = !this.muteado;
    }

    // Retorna true si el audio está muteado
    estaMuteado() {
        return this.muteado;
    }
}