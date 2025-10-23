
import { COLORES, FUENTES } from './constans.js';
import { formatearTiempo, cargarImagen } from './utils.js';

export class HUD {
    constructor(canvas, ctx, audio = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audio = audio;
        this.tiempoActual = 0;
        this.nivel = 1;
        this.dificultad = '';
        this.tieneTimerLimite = false;
        this.tiempoLimite = null;
        this.botones = [];
        this.botonAyuda = null;
        this.ayudaHabilitada = false;
        this.actualizarBotones();

        this.urlImg1 = '../assets_game/images/hud7.png';
        this.urlImg3 = '../assets_game/images/hud6.png';
        this.urlImg4 = '../assets_game/images/boton8.png';
        this.urlImg5 = '../assets_game/images/cuadrado6.png';

        this.imagenHud1 = null;
        this.imagenHud3 = null;
        this.imagenAyudita = null;
        this.imagenBotonCuadrado = null;

        this.imagenesCargadas = false;


        this.cargarImagenes();
    }
    async cargarImagenes() {
        try {
            this.imagenHud1 = await cargarImagen(this.urlImg1);
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

    actualizarTiempo(segundos, esLimite = false, limite = null) {
        this.tiempoActual = segundos;
        this.tieneTimerLimite = esLimite;
        this.tiempoLimite = limite;
    }


    actualizarNivel(nivel, dificultad) {
        this.nivel = nivel;
        this.dificultad = dificultad;
    }


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


    establecerAyudaHabilitada(habilitado) {
        this.ayudaHabilitada = habilitado;
    }


    dibujarBotones(audioMuteado = false) {
        this.ctx.save();
        this.ctx.fillStyle = COLORES.textoClaro;
        for (const boton of this.botones) {

            if (this.imagenesCargadas && this.imagenBotonCuadrado) {
                this.ctx.drawImage(this.imagenBotonCuadrado, boton.x, boton.y, boton.width, boton.height);
            } else {
                this.ctx.fillStyle = boton.color;
                this.ctx.fillRect(boton.x, boton.y, boton.width, boton.height);

                this.ctx.strokeStyle = boton.colorBorde;
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(boton.x, boton.y, boton.width, boton.height);
            }

            this.ctx.font = FUENTES.textoGrande;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

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


    dibujarBotonAyuda() {
        if (!this.ayudaHabilitada) return;

        this.ctx.save();

        const buttonWidth = 160;
        const buttonHeight = 55;
        const x = this.canvas.width - this.canvas.width / 8 - buttonWidth / 2;
        const y = this.canvas.height / 2 - buttonHeight / 2;
        const difX = 0;
        const difY = -3;



        if (this.imagenesCargadas && this.imagenAyudita) {
            this.ctx.drawImage(this.imagenAyudita, x + difX, y + difY, buttonWidth, buttonHeight);
        } else {
            this.ctx.fillStyle = COLORES.botonAyuda;
            this.ctx.fillRect(x, y, buttonWidth, buttonHeight);

            this.ctx.strokeStyle = COLORES.botonAyudaBorde;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x, y, buttonWidth, buttonHeight);
        }

        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonMedio;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(' AYUDA ', x + buttonWidth / 2, (y + buttonHeight / 2) - 2);

        this.ctx.restore();
    }


    clickEnBoton(x, y) {
        for (const boton of this.botones) {
            if (x >= boton.x &&
                x <= boton.x + boton.width &&
                y >= boton.y &&
                y <= boton.y + boton.height) {
                return boton.id;
            }
        }
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


    async dibujar(audioMuteado = false) {
        const margen = 20;
        const espacioEntreBoxes = 15;
        let yPos = margen;

        this.ctx.save();

        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // === BOX 1: TIEMPO ===
        const altoBoxTiempo = 80;

        if (this.imagenesCargadas && this.imagenHud1) {
            this.ctx.drawImage(this.imagenHud1, margen - 10, yPos - 5, 200, altoBoxTiempo);
        } else {
            this.ctx.fillStyle = COLORES.fondoModal;
            this.ctx.fillRect(margen - 10, yPos, 200, altoBoxTiempo);
        }

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
         this.ctx.font = FUENTES.textoPequeño;
        this.ctx.fillStyle = COLORES.textoSecundario;

        if (this.tieneTimerLimite && this.tiempoLimite !== null) {
            this.ctx.fillText(`Tiempo límite: ${formatearTiempo(this.tiempoLimite)}`, margen + 5, yPos + 42);
        } else {
            this.ctx.fillText('Sin tiempo límite', margen + 5, yPos + 42);
        }

        yPos += altoBoxTiempo + espacioEntreBoxes;

        // === BOX 2: NIVEL ===
        if (this.imagenesCargadas && this.imagenHud3) {
            this.ctx.drawImage(this.imagenHud3, margen - 10, yPos - 3, 200, 45);
        } else {
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
            this.ctx.fillStyle = COLORES.fondoModal;
            this.ctx.fillRect(margen - 10, yPos, 200, 40);
        }

        this.ctx.font = FUENTES.textoPequeño;

        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.fillText('🎯 Dificultad: ', margen + 5, yPos + 12);

        const anchoDificultad = this.ctx.measureText('🎯 Dificultad:  ').width;

        switch (this.dificultad.toLowerCase()) {
            case 'fácil':
                this.ctx.fillStyle = '#44ff44';
                break;
            case 'medio':
                this.ctx.fillStyle = '#ffff44';
                break;
            case 'difícil':
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

