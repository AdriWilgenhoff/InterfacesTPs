// pantallaInicial.js - Pantalla de inicio/menú principal del juego

import { dibujarDegradado3Colores, SOMBRAS, aplicarSombra, limpiarSombra} from './filtros.js';
import { COLORES, FUENTES } from './constans.js';

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

        //const color1 = { r: 20, g: 20, b: 25 };   // Gris muy oscuro (arriba)
        //const color2 = { r: 32, g: 31, b: 36 };   // Tu color #201F24 (medio)
        //const color3 = { r: 50, g: 50, b: 55 };   // Gris más claro (abajo)

        /*const color1 = { r: 10, g: 15, b: 35 };   // Azul muy oscuro
        const color2 = { r: 25, g: 42, b: 86 };   // Azul medianoche
        const color3 = { r: 44, g: 62, b: 80 };   // Azul grisáceo */

        /*const color1 = { r: 25, g: 10, b: 35 };   // Morado muy oscuro
        const color2 = { r: 54, g: 27, b: 82 };   // Morado profundo
        const color3 = { r: 88, g: 45, b: 120 };  // Morado medio */

        /*const color1 = { r: 5, g: 20, b: 10 };    // Verde muy oscuro
        const color2 = { r: 15, g: 40, b: 25 };   // Verde oscuro
        const color3 = { r: 30, g: 65, b: 45 };   // Verde bosque */

        /*const color1 = { r: 25, g: 5, b: 10 };    // Rojo muy oscuro
        const color2 = { r: 50, g: 15, b: 20 };   // Rojo profundo
        const color3 = { r: 75, g: 30, b: 35 };   // Rojo apagado
         */

        /*const color1 = { r: 10, g: 25, b: 30 };   // Cyan muy oscuro
        const color2 = { r: 20, g: 45, b: 52 };   // Teal oscuro
        const color3 = { r: 35, g: 70, b: 78 };   // Teal medio */

        /*const color1 = { r: 30, g: 15, b: 5 };    // Naranja muy oscuro
        const color2 = { r: 60, g: 30, b: 10 };   // Naranja profundo
        const color3 = { r: 90, g: 50, b: 20 };   // Naranja medio */

        const color3 = { r: 18, g: 20, b: 28 };   // Gris azulado oscuro
        const color2 = { r: 35, g: 40, b: 52 };   // Gris azulado medio
        const color1 = { r: 55, g: 62, b: 75 };   // Gris azulado claro 

/*         const color3 = { r: 20, g: 15, b: 10 };   // Marrón muy oscuro
        const color2 = { r: 45, g: 35, b: 25 };   // Marrón oscuro
        const color1 = { r: 70, g: 55, b: 40 };   // Marrón medio */
        dibujarDegradado3Colores(this.ctx, color1, color2, color3);

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


        aplicarSombra(this.ctx, SOMBRAS.glow);

        // Fondo del botón
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