
import { COLORES, FUENTES, SOMBRAS } from './constans.js';
import { formatearTiempo, drawRoundedRect } from './utils.js';
import { aplicarSombra, limpiarSombra } from './filtros.js';

export class HUD {
    constructor(canvas, ctx, audio = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audio = audio;
        this.tiempoActual = 0;           // Tiempo actual en segundos
        this.nivel = 1;                  // Número de nivel actual
        this.dificultad = '';            // Dificultad del nivel (facil, medio, dificil, extremo)
        this.tieneTimerLimite = false;   // true = countdown, false = countup
        this.tiempoLimite = null;
        this.botones = [];               // Array de botones de control
        this.botonAyuda = null;          // Botón de ayuda
        this.ayudaHabilitada = false;     // Si está habilitado o no
        this.actualizarBotones();
    }

    /**
     * Actualiza el tiempo mostrado en el HUD
     * @param {number} segundos - Tiempo en segundos
     * @param {boolean} esLimite - Si es timer con límite (countdown) o sin límite (countup)
     */
    actualizarTiempo(segundos, esLimite = false, limite = null) {
        this.tiempoActual = segundos;
        this.tieneTimerLimite = esLimite;
        this.tiempoLimite = limite;
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
     * Calcula y actualiza las posiciones de los botones de control
     * Los botones se posicionan en la esquina superior derecha
     */
    actualizarBotones() {
        const tamañoBoton = 55;
        const espaciado = 15;
        const margenDerecha = 15;
        const margenSuperior = 20;

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
                color: COLORES.botonIcono,
                colorBorde: COLORES.botonIconoBorde
            },
            {
                id: 'home',
                x: xPos - tamañoBoton - espaciado,
                y: yPos,
                width: tamañoBoton,
                height: tamañoBoton,
                emoji: '🏠',
                color: COLORES.botonIcono,
                colorBorde: COLORES.botonIconoBorde
            },
            {
                id: 'reiniciar',
                x: xPos - (tamañoBoton + espaciado) * 2,
                y: yPos,
                width: tamañoBoton,
                height: tamañoBoton,
                emoji: '🔁',
                color: COLORES.botonIcono,
                colorBorde: COLORES.botonIconoBorde
            }
        ];
    }

    /**
     * Establece si el botón de ayuda está habilitado
     * @param {boolean} habilitado - true si está habilitado, false si no
     */
    establecerAyudaHabilitada(habilitado) {
        this.ayudaHabilitada = habilitado;
    }

    /**
     * Dibuja los botones de control en el canvas
     * @param {boolean} audioMuteado - Estado del audio para mostrar el icono correcto
     */

    dibujarBotones(audioMuteado = false) {
        this.ctx.save();

        for (const boton of this.botones) {

            aplicarSombra(this.ctx, SOMBRAS.botonIcono);
            drawRoundedRect(this.ctx, boton.x, boton.y, boton.width, boton.height, 5);
            this.ctx.fillStyle = COLORES.fondoModal;
            this.ctx.fill();
            this.ctx.strokeStyle = COLORES.botonIconoBorde;
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
            limpiarSombra(this.ctx);

            // Emoji del botón
            this.ctx.font = FUENTES.textoGrande;
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
     * Dibuja el botón de ayuda
     */
    dibujarBotonAyuda() {
        if (!this.ayudaHabilitada) return;

        this.ctx.save();

        const buttonWidth = 130;
        const buttonHeight = 45;
        const x = this.canvas.width - this.canvas.width / 8 - buttonWidth / 2;
        const y = this.canvas.height / 2 - buttonHeight / 2;


        aplicarSombra(this.ctx, SOMBRAS.botonAyuda);
        this.ctx.fillStyle = COLORES.botonAyuda;
        this.ctx.fillRect(x, y, buttonWidth, buttonHeight);
        limpiarSombra(this.ctx);

        // Borde
        this.ctx.strokeStyle = COLORES.botonAyudaBorde;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, buttonWidth, buttonHeight);

        // Texto
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonPequeño;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('💡 AYUDA ', x + buttonWidth / 2, y + buttonHeight / 2);

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
        // Verificar botón de ayuda
        if (this.ayudaHabilitada) {
            const buttonWidth = 130;
            const buttonHeight = 45;
            const botonX = this.canvas.width - this.canvas.width / 8 - buttonWidth / 2;
            const botonY = this.canvas.height / 2 - buttonHeight / 2;

            if (x >= botonX &&
                x <= botonX + buttonWidth &&
                y >= botonY &&
                y <= botonY + buttonHeight) {
                return 'ayuda';
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
        const espacioEntreBoxes = 15;
        let yPos = margen;

        this.ctx.save();

        // Configuración de texto
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // === BOX 1: TIEMPO ===
        const altoBoxTiempo = 70;
        drawRoundedRect(this.ctx, margen - 10, yPos, 200, altoBoxTiempo, 10);
        this.ctx.fillStyle = COLORES.fondoModal;
        this.ctx.fill();

        // Línea 1: Tiempo actual
        this.ctx.font = FUENTES.textoPequeño;
        if (this.tieneTimerLimite && this.tiempoLimite !== null) {
            const tiempoRestante = this.tiempoLimite - this.tiempoActual;

            if (tiempoRestante <= 10) {
                this.ctx.fillStyle = '#ff4444';
            } else if (tiempoRestante <= 30) {
                this.ctx.fillStyle = '#ffaa44';
            } else {
                this.ctx.fillStyle = '#44ff44';
            }
        } else {
            this.ctx.fillStyle = '#4499ff';
        }

        this.ctx.fillText(`⏱️ Tiempo: ${formatearTiempo(this.tiempoActual)}`, margen, yPos + 10);
        
        // Línea 2: Límite o "Sin tiempo límite"
        this.ctx.font = FUENTES.textoPequeño;
        this.ctx.fillStyle = COLORES.textoSecundario;

        if (this.tieneTimerLimite && this.tiempoLimite !== null) {
            this.ctx.fillText(`Tiempo límite: ${formatearTiempo(this.tiempoLimite)}`, margen, yPos + 42);
        } else {
            this.ctx.fillText('Sin tiempo límite', margen, yPos + 42);
        }

        yPos += altoBoxTiempo + espacioEntreBoxes;

        // === BOX 2: NIVEL ===
        drawRoundedRect(this.ctx, margen - 10, yPos, 200, 40, 10);
        this.ctx.fillStyle = COLORES.fondoModal;
        this.ctx.fill();

        this.ctx.font = FUENTES.textoPequeño;
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.fillText(`📊 Nivel: ${this.nivel}`, margen, yPos + 12);

        yPos += 40 + espacioEntreBoxes;

        // === BOX 3: DIFICULTAD ===
        drawRoundedRect(this.ctx, margen - 10, yPos, 200, 40, 10);
        this.ctx.fillStyle = COLORES.fondoModal;
        this.ctx.fill();
        this.ctx.font = FUENTES.textoPequeño;

        // "Dificultad:" en blanco
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.fillText('🎯 Dificultad: ', margen, yPos + 12);

        // Calcular ancho para posicionar el nombre de la dificultad
        const anchoDificultad = this.ctx.measureText('🎯 Dificultad: ').width;

        // Color según dificultad
        switch (this.dificultad.toLowerCase()) {
            case 'facil':
                this.ctx.fillStyle = '#44ff44';
                break;
            case 'medio':
                this.ctx.fillStyle = '#ffff44';
                break;
            case 'dificil':
                this.ctx.fillStyle = '#ffaa44';
                break;
            case 'extremo':
                this.ctx.fillStyle = '#ff4444';
                break;
            default:
                this.ctx.fillStyle = '#ffffff';
        }

        this.ctx.fillText(this.dificultad, margen + anchoDificultad, yPos + 12);

        this.dibujarBotones(audioMuteado);
        this.dibujarBotonAyuda();

        this.ctx.restore();
    }
}