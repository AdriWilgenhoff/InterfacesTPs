
import { COLORES, FUENTES } from './constans.js';
import { formatearTiempo, cargarImagen } from './utils.js';

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

        this.urlImg1 = '../assets_game/images/hud7.png';
        this.urlImg2 = '../assets_game/images/hud5.png';
        this.urlImg3 = '../assets_game/images/hud6.png';
        this.urlImg4 = '../assets_game/images/boton8.png';
        this.urlImg5 ='../assets_game/images/cuadrado6.png';
       

        this.imagenHud1 = null;
        this.imagenHud2 = null;
        this.imagenHud3 = null;
        this.imagenAyudita = null;
        this.imagenBotonCuadrado = null;
       

        this.imagenesCargadas = false;


        this.cargarImagenes();
    }
    async cargarImagenes() {
        try {
            this.imagenHud1 = await cargarImagen(this.urlImg1);
            this.imagenHud2 = await cargarImagen(this.urlImg2);
            this.imagenHud3 = await cargarImagen(this.urlImg3);
            this.imagenAyudita = await cargarImagen(this.urlImg4);
            
            this.imagenBotonCuadrado = await cargarImagen(this.urlImg5);
            this.imagenesCargadas = true;
            console.log('✅ Imagen del hud cargadas correctamente');
        } catch (error) {
            console.warn('⚠️ no se cargaron las img del modal ', error);
            this.imagenesCargadas = false;
        }
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
        const tamañoBoton = 60;
        const espaciado = 10;
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
                emoji: '⭯',
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

            
        if (this.imagenesCargadas && this.imagenBotonCuadrado) {
            this.ctx.drawImage(this.imagenBotonCuadrado,boton.x, boton.y, boton.width, boton.height);
        } else {
           this.ctx.fillStyle = boton.color;
            this.ctx.fillRect(boton.x, boton.y, boton.width, boton.height);

            // Borde del botón
            this.ctx.strokeStyle = boton.colorBorde;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(boton.x, boton.y, boton.width, boton.height); 
        }
           

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

        const buttonWidth = 160;
        const buttonHeight = 55;
        const x = this.canvas.width - this.canvas.width / 8 - buttonWidth / 2;
        const y = this.canvas.height / 2 - buttonHeight / 2;
        const difX=0; 
        const difY=-3;
        
               

        if (this.imagenesCargadas && this.imagenAyudita) {
            this.ctx.drawImage(this.imagenAyudita,x + difX, y +difY , buttonWidth, buttonHeight);
        } else {
            this.ctx.fillStyle = COLORES.botonAyuda;
            this.ctx.fillRect(x, y, buttonWidth, buttonHeight);

            // Borde
            this.ctx.strokeStyle = COLORES.botonAyudaBorde;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x, y, buttonWidth, buttonHeight); 
        }


        // Texto
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonMedio;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(' AYUDA ', x + buttonWidth / 2, (y + buttonHeight / 2) -2 );

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
    async dibujar(audioMuteado = false) {
        const margen = 20;
        const espacioEntreBoxes = 15;
        let yPos = margen;

        this.ctx.save();

        // Configuración de texto
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // === BOX 1: TIEMPO ===
        const altoBoxTiempo = 80;  // 👈 CAMBIAR - Siempre el mismo alto

        // Fondo de la box de tiempo
        if (this.imagenesCargadas && this.imagenHud1) {
            this.ctx.drawImage(this.imagenHud1, margen - 10, yPos - 5, 200, altoBoxTiempo);
        } else {
            // Si no hay imagen, usar degradado como fallback
            /* degrade(this.ctx, COLORES.modal1, COLORES.modal2, modalX, modalY, modalWidth, modalHeight, 'diagonal1'); */
            this.ctx.fillStyle = COLORES.fondoModal;
            this.ctx.fillRect(margen - 10, yPos, 200, altoBoxTiempo);
        }


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

        this.ctx.fillText(`⏱️ Tiempo: ${formatearTiempo(this.tiempoActual)}`, margen + 5, yPos + 10);
        // Línea 2: Límite o "Sin tiempo límite"
        this.ctx.font = FUENTES.textoPequeño;
        this.ctx.fillStyle = COLORES.textoSecundario;

        if (this.tieneTimerLimite && this.tiempoLimite !== null) {
            this.ctx.fillText(`Tiempo límite: ${formatearTiempo(this.tiempoLimite)}`, margen + 5, yPos + 42);
        } else {
            this.ctx.fillText('Sin tiempo límite', margen + 5, yPos + 42);
        }

        yPos += altoBoxTiempo + espacioEntreBoxes;

        // === BOX 2: NIVEL ===
        if (this.imagenesCargadas && this.imagenHud2) {
            this.ctx.drawImage(this.imagenHud3, margen - 10, yPos - 3, 200, 45);
        } else {
            // Si no hay imagen, usar degradado como fallback
            /* degrade(this.ctx, COLORES.modal1, COLORES.modal2, modalX, modalY, modalWidth, modalHeight, 'diagonal1'); */
            this.ctx.fillStyle = COLORES.fondoModal;
            this.ctx.fillRect(margen - 10, yPos, 200, 40);
        }




        this.ctx.font = FUENTES.textoPequeño;
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.fillText(`📊 Nivel: ${this.nivel}`, margen + 5, yPos + 12);

        yPos += 40 + espacioEntreBoxes;

        // === BOX 3: DIFICULTAD ===
        if (this.imagenesCargadas && this.imagenHud3) {
            this.ctx.drawImage(this.imagenHud3, margen - 10, yPos - 3, 200, 45);
        } else {
            // Si no hay imagen, usar degradado como fallback
            /* degrade(this.ctx, COLORES.modal1, COLORES.modal2, modalX, modalY, modalWidth, modalHeight, 'diagonal1'); */
            this.ctx.fillStyle = COLORES.fondoModal;
            this.ctx.fillRect(margen - 10, yPos, 200, 40);
        }

        /*  this.ctx.fillStyle = COLORES.fondoModal;
         this.ctx.fillRect(margen - 10, yPos, 200, 40); */

        this.ctx.font = FUENTES.textoPequeño;

        // "Dificultad:" en blanco
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.fillText('🎯 Dificultad: ', margen + 5, yPos + 12);

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

        // Dibujar botones de control
        this.dibujarBotones(audioMuteado);
        this.dibujarBotonAyuda();

        this.ctx.restore();
    }
}

