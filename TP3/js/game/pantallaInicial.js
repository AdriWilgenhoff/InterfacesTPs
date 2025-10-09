// pantallaInicial.js - Pantalla de inicio/menú principal del juego

export class PantallaInicial {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.visible = true;       // Si la pantalla está visible o no
        this.botonRect = null;     // Rectángulo del botón de inicio para detección de clicks
    }
    
    /**
     * Muestra la pantalla inicial
     */
    mostrar() {
        this.visible = true;
    }
    
    /**
     * Oculta la pantalla inicial
     */
    ocultar() {
        this.visible = false;
    }
    
    /**
     * Dibuja la pantalla inicial en el canvas
     */
    dibujar() {
        if (!this.visible) return;
        
        this.ctx.save();
        
        // Fondo oscuro
        this.ctx.fillStyle = '#201F24'; //  #1a1a1a
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
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
        
        // Guardar posición del botón para detección de clicks
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
    
    /**
     * Detecta si se hizo click en el botón de inicio
     * @param {number} x - Coordenada X del click
     * @param {number} y - Coordenada Y del click
     * @returns {boolean} - true si se clickeó el botón, false si no
     */
    clickEnBoton(x, y) {
        if (!this.visible || !this.botonRect) return false;
        
        return x >= this.botonRect.x &&
               x <= this.botonRect.x + this.botonRect.width &&
               y >= this.botonRect.y &&
               y <= this.botonRect.y + this.botonRect.height;
    }
}