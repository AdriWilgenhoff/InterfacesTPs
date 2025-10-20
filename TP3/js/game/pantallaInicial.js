import { dibujarDegradado2Colores, aplicarSombra, limpiarSombra } from './filtros.js';
import { COLORES, FUENTES, SOMBRAS } from './constans.js';
import { BotonImagen } from './boton.js';

export class PantallaInicial {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.visible = true;

        // Canvas opcional de fondo
        this.backgroundCanvas = document.querySelector('#backgroundGame');

        // Coordenadas del botón
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const buttonWidth = 350;
        const buttonHeight = 90;
        const buttonX = centerX - (buttonWidth ) / 2;
        const buttonY = centerY - buttonHeight / 2 ;

        // Crear el botón con imágenes
        this.botonIniciar = new BotonImagen(
            buttonX,
            buttonY,
            buttonWidth,
            buttonHeight,
            '../assets_game/images/boton2def.png',  // Imagen normal
            '../assets_game/images/image2.png',  // Imagen hover
            'iniciar'
        );
    }

    mostrar() {
        this.visible = true;
        this.botonIniciar.setVisible(true);
    }

    ocultar() {
        this.visible = false;
        this.botonIniciar.setVisible(false);
    }

    dibujar() {
        if (!this.visible) return;

        const ctx = this.ctx;
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.save();
        ctx.clearRect(0, 0, width, height);

        // Fondo degradado opcional
        /* const color1 = { r: 55, g: 62, b: 75 };
        const color2 = { r: 18, g: 20, b: 28 };
        dibujarDegradado2Colores(ctx, color1, color2); */

        // Título
        ctx.fillStyle = COLORES.textoPrimario;
        ctx.font = FUENTES.tituloGrande;
        ctx.textAlign = 'center';
        ctx.fillText('BLOCKA', centerX, centerY - 130);

        // Subtítulo
        ctx.fillStyle = COLORES.textoSecundario;
        ctx.font = FUENTES.textoMedio;
        ctx.fillText('Rota las piezas para completar la imagen', centerX, centerY - 80);

        // Fondo y sombra del botón
        aplicarSombra(ctx, SOMBRAS.boton);
        ctx.fillStyle = '#00000000';
        ctx.fillRect(
            this.botonIniciar.x,
            this.botonIniciar.y,
            this.botonIniciar.width,
            this.botonIniciar.height
        );
        limpiarSombra(ctx);

        // Borde del botón
     /*    ctx.strokeStyle = COLORES.botonPrimarioBorde;
        ctx.lineWidth = 4;
        ctx.strokeRect(
            this.botonIniciar.x,
            this.botonIniciar.y,
            this.botonIniciar.width,
            this.botonIniciar.height
        ); */

        // Imagen del botón (hover o normal)
        this.botonIniciar.dibujar(ctx);

        // Texto del botón
        ctx.fillStyle = COLORES.textoPrimario;
        ctx.font = FUENTES.botonGrande;
        ctx.fillText('INICIAR JUEGO', centerX, this.botonIniciar.y + 55 );

        // Instrucciones
        ctx.fillStyle = COLORES.textoSecundario;
        ctx.font = FUENTES.textoPequeño;
        ctx.fillText(
            'Clic izquierdo: rota izquierda ↺  |  Clic derecho: rota derecha ↻',
            centerX,
            centerY + 150
        );

        // Ayuda
        ctx.fillText(
            'Si en un nivel difícil no sabes cómo seguir, usá ayudas para ubicar una pieza. Esto te costará tiempo.',
            centerX,
            centerY + 190
        );

        ctx.restore();
    }

    actualizarHover(mouseX, mouseY) {
        if (!this.visible) return;
        this.botonIniciar.actualizarHover(mouseX, mouseY);
    }

    clickEnBoton(x, y) {
        if (!this.visible) return false;
        return this.botonIniciar.estaClickeado(x, y);
    }
}
