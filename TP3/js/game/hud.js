// hud.js - Interfaz de usuario (HUD) dibujada en el canvas
// Muestra información del nivel, timer y botones de control

export class HUD {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.tiempoActual = 0;           // Tiempo actual en segundos
        this.nivel = 1;                  // Número de nivel actual
        this.dificultad = '';            // Dificultad del nivel (facil, medio, dificil, extremo)
        this.tieneTimerLimite = false;   // true = countdown, false = countup
        this.botones = [];               // Array de botones de control
        this.actualizarBotones();
    }
    
    /**
     * Actualiza el tiempo mostrado en el HUD
     * @param {number} segundos - Tiempo en segundos
     * @param {boolean} esLimite - Si es timer con límite (countdown) o sin límite (countup)
     */
    actualizarTiempo(segundos, esLimite = false) {
        this.tiempoActual = segundos;
        this.tieneTimerLimite = esLimite;
    }
    
    /**
     * Actualiza la información del nivel
     * @param {number} nivel - Número del nivel
     * @param {string} dificultad - Nombre de la dificultad
     */
    actualizarNivel(nivel, dificultad) {
        this.nivel = nivel;
        this.dificultad = dificultad;
    }
    
    /**
     * Formatea segundos a formato MM:SS
     * @param {number} segundos - Tiempo en segundos
     * @returns {string} - Tiempo formateado (ej: "2:05")
     */
    formatearTiempo(segundos) {
        const mins = Math.floor(Math.abs(segundos) / 60);
        const segs = Math.abs(segundos) % 60;
        return `${mins}:${segs.toString().padStart(2, '0')}`;
    }
    
    /**
     * Calcula y actualiza las posiciones de los botones de control
     * Los botones se posicionan en la esquina superior derecha
     */
    actualizarBotones() {
        const tamañoBoton = 50;
        const espaciado = 10;
        const margenDerecha = 20;
        const margenSuperior = 20;
        
        // Posición inicial (desde la derecha hacia la izquierda)
        let xPos = this.canvas.width - margenDerecha - tamañoBoton;
        const yPos = margenSuperior;
        
        this.botones = [
            {
                id: 'mute',
                x: xPos,
                y: yPos,
                width: tamañoBoton,
                height: tamañoBoton,
                emoji: '🔊',
                color: '#2196F3'
            },
            {
                id: 'home',
                x: xPos - tamañoBoton - espaciado,
                y: yPos,
                width: tamañoBoton,
                height: tamañoBoton,
                emoji: '🏠',
                color: '#757575'
            },
            {
                id: 'reiniciar',
                x: xPos - (tamañoBoton + espaciado) * 2,
                y: yPos,
                width: tamañoBoton,
                height: tamañoBoton,
                emoji: '🔄',
                color: '#ff9800'
            }
        ];
    }
    
    /**
     * Dibuja los botones de control en el canvas
     * @param {boolean} audioMuteado - Estado del audio para mostrar el icono correcto
     */
    dibujarBotones(audioMuteado = false) {
        this.ctx.save();
        
        for (const boton of this.botones) {
            // Fondo del botón
            this.ctx.fillStyle = boton.color;
            this.ctx.fillRect(boton.x, boton.y, boton.width, boton.height);
            
            // Borde del botón
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(boton.x, boton.y, boton.width, boton.height);
            
            // Emoji del botón
            this.ctx.font = '28px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Cambiar emoji de mute según estado del audio
            let emoji = boton.emoji;
            if (boton.id === 'mute') {
                emoji = audioMuteado ? '🔇' : '🔊';
            }
            
            this.ctx.fillText(emoji, 
                boton.x + boton.width / 2, 
                boton.y + boton.height / 2
            );
        }
        
        this.ctx.restore();
    }
    
    /**
     * Detecta si se hizo click en algún botón
     * @param {number} x - Coordenada X del click
     * @param {number} y - Coordenada Y del click
     * @returns {string|null} - ID del botón clickeado o null si no hubo click en ninguno
     */
    clickEnBoton(x, y) {
        for (const boton of this.botones) {
            if (x >= boton.x &&
                x <= boton.x + boton.width &&
                y >= boton.y &&
                y <= boton.y + boton.height) {
                return boton.id; // 'reiniciar', 'home', o 'mute'
            }
        }
        return null;
    }
    
    /**
     * Dibuja todo el HUD en el canvas
     * @param {boolean} audioMuteado - Estado del audio para actualizar el botón de mute
     */
    dibujar(audioMuteado = false) {
        const margen = 20;
        const espacioLinea = 35;
        let yPos = margen + 30;
        
        this.ctx.save();
        
        // Configuración de texto
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // === TIMER ===
        // Fondo del timer
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(margen - 10, margen, 200, 40);
        
        // Texto del timer
        this.ctx.font = 'bold 28px Arial';
        
        // Color según tipo de timer y tiempo restante
        if (this.tieneTimerLimite) {
            // Timer con límite (cuenta regresiva)
            if (this.tiempoActual <= 10) {
                this.ctx.fillStyle = '#ff4444'; // Rojo urgente (≤10 segundos)
            } else if (this.tiempoActual <= 30) {
                this.ctx.fillStyle = '#ffaa44'; // Naranja advertencia (≤30 segundos)
            } else {
                this.ctx.fillStyle = '#44ff44'; // Verde normal
            }
            this.ctx.fillText(`⏱️ ${this.formatearTiempo(this.tiempoActual)}`, margen, margen + 5);
        } else {
            // Timer sin límite (cuenta hacia arriba)
            this.ctx.fillStyle = '#4499ff'; // Azul para countup
            this.ctx.fillText(`⏱️ ${this.formatearTiempo(this.tiempoActual)}`, margen, margen + 5);
        }
        
        yPos = margen + 50;
        
        // === NIVEL ===
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(margen - 10, yPos - 5, 200, 30);
        
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`Nivel: ${this.nivel}`, margen, yPos);
        
        yPos += espacioLinea;
        
        // === DIFICULTAD ===
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(margen - 10, yPos - 5, 200, 30);
        
        this.ctx.font = '18px Arial';
        
        // Color según dificultad
        switch(this.dificultad.toLowerCase()) {
            case 'facil':
                this.ctx.fillStyle = '#44ff44';  // Verde
                break;
            case 'medio':
                this.ctx.fillStyle = '#ffff44';  // Amarillo
                break;
            case 'dificil':
                this.ctx.fillStyle = '#ffaa44';  // Naranja
                break;
            case 'extremo':
                this.ctx.fillStyle = '#ff4444';  // Rojo
                break;
            default:
                this.ctx.fillStyle = '#ffffff';  // Blanco por defecto
        }
        
        this.ctx.fillText(`${this.dificultad.toUpperCase()}`, margen, yPos);
        
        // Dibujar botones de control en la esquina superior derecha
        this.dibujarBotones(audioMuteado);
        
        this.ctx.restore();
    }
}