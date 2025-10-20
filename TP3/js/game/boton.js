import { cargarImagen } from './utils.js';

export class BotonImagen {
    constructor(x, y, width, height, rutaImagenNormal, rutaImagenHover, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
        this.hover = false;
        this.visible = true;
        this.imagenNormal = null;
        this.imagenHover = null;
        this.cargado = false;

        this.cargarImagenes(rutaImagenNormal, rutaImagenHover);
    }

    async cargarImagenes(rutaNormal, rutaHover) {
        try {
            this.imagenNormal = await cargarImagen(rutaNormal);
            this.imagenHover = await cargarImagen(rutaHover);
            this.cargado = true;
        } catch (error) {
            console.error(`Error al cargar imágenes del botón ${this.id}:`, error);
        }
    }

    actualizarHover(mouseX, mouseY) {
        if (!this.visible) {
            this.hover = false;
            return false;
        }

        const hoverAnterior = this.hover;
        this.hover =
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height;

        return hoverAnterior !== this.hover;
    }

    dibujar(ctx) {
        if (!this.visible || !this.cargado) return;

        const imagen = this.hover ? this.imagenHover : this.imagenNormal;
        if (imagen) {
            ctx.drawImage(imagen, this.x, this.y, this.width, this.height);
        }
    }

    estaClickeado(x, y) {
        if (!this.visible) return false;

        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

    actualizarPosicion(x, y) {
        this.x = x;
        this.y = y;
    }

    setVisible(visible) {
        this.visible = visible;
        if (!visible) this.hover = false;
    }
}
