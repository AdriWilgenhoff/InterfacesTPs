// pantallaInicial.js - Pantalla de inicio/menú principal del juego

import { dibujarDegradado2Colores, aplicarSombra, limpiarSombra} from './filtros.js';
import { COLORES, FUENTES, SOMBRAS} from './constans.js';
export class PantallaInicial {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.visible = true;
        this.botonRect = null;
    }

    mostrar() {
        this.visible = true;
    }

    ocultar() {
        this.visible = false;
    }

    dibujar() {
        if (!this.visible) return;

        this.ctx.save();
        const color1 = { r: 55, g: 62, b: 75 };   // Gris azulado claro 
        const color2 = { r: 18, g: 20, b: 28 };   // Gris azulado oscuro

        dibujarDegradado2Colores(this.ctx, color1, color2);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Título del juego
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.tituloGrande;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('BLOCKA', centerX, centerY - 130);

        // Subtítulo descriptivo
        this.ctx.fillStyle = COLORES.textoSecundario;
        this.ctx.font = FUENTES.textoMedio;
        this.ctx.fillText('Rota las piezas para completar la imagen', centerX, centerY - 80);

        // Configuración del botón "INICIAR JUEGO"
        const buttonWidth = 300;
        const buttonHeight = 60;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = centerY;

        this.botonRect = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };

        // Fondo del botón
        aplicarSombra(this.ctx, SOMBRAS.boton);
        this.ctx.fillStyle = COLORES.botonPrimario;
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        limpiarSombra(this.ctx);

        // Borde del botón
        this.ctx.strokeStyle = COLORES.botonPrimarioBorde;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
 
        // Texto del botón
        this.ctx.fillStyle = COLORES.textoPrimario;
        this.ctx.font = FUENTES.botonGrande;
        this.ctx.fillText('INICIAR JUEGO', centerX, buttonY + 40);

        // Instrucciones de controles
        this.ctx.fillStyle = COLORES.textoSecundario;
        this.ctx.font = FUENTES.textoPequeño;
        this.ctx.fillText('Clic izquierdo: rota izquierda ↺  |  Clic derecho: rota derecha ↻', centerX, centerY + 150);

        // Explicacion ayuda
        this.ctx.fillStyle = COLORES.textoSecundario;
        this.ctx.font = FUENTES.textoPequeño;
        this.ctx.fillText('Si en un nivel difícil no sabes cómo seguir, usá ayudas para ubicar una pieza. Esto te costará tiempo.', centerX, centerY + 190);


        this.ctx.restore();
    }

    clickEnBoton(x, y) {
         if (!this.visible || !this.botonRect) return false;

        return x >= this.botonRect.x &&
            x <= this.botonRect.x + this.botonRect.width &&
            y >= this.botonRect.y &&
            y <= this.botonRect.y + this.botonRect.height;
    }
}