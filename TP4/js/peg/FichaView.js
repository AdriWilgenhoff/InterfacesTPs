import { puntoEnCirculo } from './utils.js';
export class FichaView {
    constructor(fila, col, imagen, tamanio, offsetX, offsetY) {
        this.fila = fila;
        this.col = col;
        this.filaOriginal = fila;
        this.colOriginal = col;

        this.imagen = imagen;
        this.tamanio = tamanio;

        // Posición en píxeles (calculada desde el tablero)
        this.x = 0;
        this.y = 0;
        this.xOriginal = 0;
        this.yOriginal = 0;

        // Offset del tablero (para calcular posiciones absolutas)
        this.offsetX = offsetX || 0;
        this.offsetY = offsetY || 0;

        // Estado de arrastre
        this.arrastrando = false;
        this.seleccionada = false;

        // Offset del mouse al iniciar arrastre
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
    }

    /**
     * Establece la posición de la ficha en píxeles
     */
    setPosicion(x, y) {
        this.x = x;
        this.y = y;
        this.xOriginal = x;
        this.yOriginal = y;
    }

    /**
     * Actualiza la posición del tablero (offset)
     */
    setOffset(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    /**
     * Inicia el arrastre de la ficha
       */
    iniciarArrastre(mouseX, mouseY) {
        this.arrastrando = true;
        this.seleccionada = true;
        this.mouseOffsetX = mouseX - (this.x + this.offsetX);
        this.mouseOffsetY = mouseY - (this.y + this.offsetY);
    }

    /**
     * Actualiza la posición durante el arrastre
     */
    actualizarArrastre(mouseX, mouseY) {
        if (this.arrastrando) {
            this.x = mouseX - this.offsetX - this.mouseOffsetX;
            this.y = mouseY - this.offsetY - this.mouseOffsetY;
        }
    }

    /**
     * Finaliza el arrastre
     */
    finalizarArrastre() {
        this.arrastrando = false;
    }

    /**
     * Retorna la ficha a su posición original
     */
    retornarPosicionInicial() {
        this.x = this.xOriginal;
        this.y = this.yOriginal;
        this.fila = this.filaOriginal;
        this.col = this.colOriginal;
        this.arrastrando = false;
        this.seleccionada = false;
    }

    /**
     * Mueve la ficha a una nueva posición con animación
     */
    moverAPosicion(x, y, fila, col) {
        this.x = x;
        this.y = y;
        this.xOriginal = x;
        this.yOriginal = y;
        this.fila = fila;
        this.col = col;
        this.filaOriginal = fila;
        this.colOriginal = col;
        this.arrastrando = false;
        this.seleccionada = false;
    }

    /**
     * Verifica si un punto está dentro de la ficha
     */
    contienePoint(x, y) {
        // Calcular posición absoluta de la ficha
        const fichaX = this.x + this.offsetX;
        const fichaY = this.y + this.offsetY;

        // Calcular centro de la ficha
        const centroX = fichaX + this.tamanio / 2;
        const centroY = fichaY + this.tamanio / 2;

        return puntoEnCirculo(x, y, centroX, centroY, this.tamanio / 2);
    }

    /**
     * Dibuja la ficha en el canvas
     */
    dibujar(ctx) {
        ctx.save();

        // Posición absoluta para dibujar
        const posX = this.x + this.offsetX;
        const posY = this.y + this.offsetY;

        if (this.arrastrando) {
            ctx.shadowColor = 'rgba(255, 255, 255, 1)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
        } else if (this.seleccionada) {
            ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        ctx.beginPath();
        ctx.arc(
            posX + this.tamanio / 2,
            posY + this.tamanio / 2,
            this.tamanio / 2,
            0,
            Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();


        ctx.drawImage(
            this.imagen,
            posX,
            posY,
            this.tamanio,
            this.tamanio
        );

        ctx.restore();

        if (this.seleccionada && !this.arrastrando) {
            ctx.save();
            ctx.strokeStyle = '#ff0000ff';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(
                posX + this.tamanio / 2,
                posY + this.tamanio / 2,
                this.tamanio / 2,
                0,
                Math.PI * 2
            );
            ctx.stroke();
            ctx.restore();
        }
    }

    /**
     * Obtiene la posición en el tablero (fila, columna)
     */
    getPosicionTablero() {
        return {
            fila: this.fila,
            col: this.col
        };
    }

    /**
     * Obtiene la posición original en el tablero
     */
    getPosicionOriginal() {
        return {
            fila: this.filaOriginal,
            col: this.colOriginal
        };
    }

    /**
     * Verifica si la ficha está siendo arrastrada
     */
    estaArrastrando() {
        return this.arrastrando;
    }

    /**
     * Marca la ficha como seleccionada
     */
    setSeleccionada(seleccionada) {
        this.seleccionada = seleccionada;
    }
}