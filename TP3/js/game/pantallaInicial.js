// pantallaInicial.js - Pantalla de inicio/menú principal del juego

import { dibujarDegradado3Colores } from './filtros.js';

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
    
    /**
     * Dibuja la pantalla inicial en el canvas
     */
    dibujar() {
        if (!this.visible) return;
        
        this.ctx.save();
        
        // 👇 CAMBIAR - Usar degradado en lugar de fillRect
        //const color1 = { r: 20, g: 20, b: 25 };   // Gris muy oscuro (arriba)
        //const color2 = { r: 32, g: 31, b: 36 };   // Tu color #201F24 (medio)
        //const color3 = { r: 50, g: 50, b: 55 };   // Gris más claro (abajo)

/*         const color1 = { r: 10, g: 15, b: 35 };   // Azul muy oscuro
const color2 = { r: 25, g: 42, b: 86 };   // Azul medianoche
const color3 = { r: 44, g: 62, b: 80 };   // Azul grisáceo */
        
/*         const color1 = { r: 25, g: 10, b: 35 };   // Morado muy oscuro
const color2 = { r: 54, g: 27, b: 82 };   // Morado profundo
const color3 = { r: 88, g: 45, b: 120 };  // Morado medio */

/* const color1 = { r: 5, g: 20, b: 10 };    // Verde muy oscuro
const color2 = { r: 15, g: 40, b: 25 };   // Verde oscuro
const color3 = { r: 30, g: 65, b: 45 };   // Verde bosque */

/* const color1 = { r: 25, g: 5, b: 10 };    // Rojo muy oscuro
const color2 = { r: 50, g: 15, b: 20 };   // Rojo profundo
const color3 = { r: 75, g: 30, b: 35 };   // Rojo apagado
 */
/* const color1 = { r: 10, g: 25, b: 30 };   // Cyan muy oscuro
const color2 = { r: 20, g: 45, b: 52 };   // Teal oscuro
const color3 = { r: 35, g: 70, b: 78 };   // Teal medio */

/* const color1 = { r: 30, g: 15, b: 5 };    // Naranja muy oscuro
const color2 = { r: 60, g: 30, b: 10 };   // Naranja profundo
const color3 = { r: 90, g: 50, b: 20 };   // Naranja medio */

/* const color1 = { r: 18, g: 20, b: 28 };   // Gris azulado oscuro
const color2 = { r: 35, g: 40, b: 52 };   // Gris azulado medio
const color3 = { r: 55, g: 62, b: 75 };   // Gris azulado claro
 */
const color3 = { r: 20, g: 15, b: 10 };   // Marrón muy oscuro
const color2 = { r: 45, g: 35, b: 25 };   // Marrón oscuro
const color1 = { r: 70, g: 55, b: 40 };   // Marrón medio
        dibujarDegradado3Colores(this.ctx, color1, color2, color3);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Título del juego
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 80px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('BLOCKA', centerX, centerY - 100);
        
        // Subtítulo descriptivo
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Rota las piezas para completar la imagen', centerX, centerY - 40);
        
        // Configuración del botón "INICIAR JUEGO"
        const buttonWidth = 300;
        const buttonHeight = 80;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = centerY + 40;
        
        this.botonRect = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight
        };
        
        // Fondo del botón
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // Borde del botón
        this.ctx.strokeStyle = '#2E7D32';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        
        // Texto del botón
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText('INICIAR JUEGO', centerX, buttonY + 50);
        
        // Instrucciones de controles
        this.ctx.fillStyle = '#666666';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Clic izquierdo: rotar ↺  |  Clic derecho: rotar ↻', centerX, centerY + 180);
        
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