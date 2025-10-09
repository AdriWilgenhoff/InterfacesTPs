// previsualizador.js - Muestra miniaturas de las imágenes disponibles en el juego
// (Actualmente no se usa en el flujo principal, pero está disponible para debug/referencia)

export class Previsualizador {
    constructor(canvas, ctx, imagenes) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imagenes = imagenes;      // Array de rutas de imágenes
        this.imagenesObj = [];         // Array de objetos Image cargados
        this.visible = false;
    }
    
    /**
     * Carga todas las imágenes como objetos Image
     * Útil para mostrar previews sin afectar el juego principal
     */
    async cargarImagenes() {
        this.imagenesObj = [];
        
        for (const ruta of this.imagenes) {
            try {
                const img = await this.cargarImagen(ruta);
                this.imagenesObj.push(img);
            } catch (error) {
                console.warn(`No se pudo cargar preview de: ${ruta}`);
            }
        }
    }
    
    /**
     * Carga una imagen individual
     * @param {string} ruta - Ruta de la imagen
     * @returns {Promise<Image>} - Promesa que resuelve con el objeto Image
     */
    cargarImagen(ruta) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = ruta;
        });
    }
    
    /**
     * Muestra el previsualizador
     */
    mostrar() {
        this.visible = true;
    }
    
    /**
     * Oculta el previsualizador
     */
    ocultar() {
        this.visible = false;
    }
    
    /**
     * Dibuja todas las miniaturas en el lado derecho del canvas
     */
    dibujar() {
        if (!this.visible || this.imagenesObj.length === 0) return;
        
        this.ctx.save();
        
        // Configuración del grid de thumbnails
        const margen = 20;
        const thumbSize = 80;          // Tamaño de cada miniatura
        const espaciado = 10;
        const xInicio = this.canvas.width - (thumbSize + margen);
        let yPos = margen + 150;       // Posición inicial (debajo del HUD)
        
        // Título del previsualizador
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(xInicio - 10, yPos - 35, thumbSize + 20, 30);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('IMÁGENES', xInicio + thumbSize / 2, yPos - 15);
        
        // Dibujar cada miniatura
        for (let i = 0; i < this.imagenesObj.length; i++) {
            const img = this.imagenesObj[i];
            
            // Fondo de la miniatura
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(xInicio - 5, yPos - 5, thumbSize + 10, thumbSize + 10);
            
            // Borde de la miniatura
            this.ctx.strokeStyle = '#666666';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(xInicio - 5, yPos - 5, thumbSize + 10, thumbSize + 10);
            
            // Calcular dimensiones para mantener aspect ratio
            const aspectRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (aspectRatio > 1) {
                // Imagen horizontal (ancho > alto)
                drawWidth = thumbSize;
                drawHeight = thumbSize / aspectRatio;
                offsetX = 0;
                offsetY = (thumbSize - drawHeight) / 2;
            } else {
                // Imagen vertical o cuadrada
                drawHeight = thumbSize;
                drawWidth = thumbSize * aspectRatio;
                offsetX = (thumbSize - drawWidth) / 2;
                offsetY = 0;
            }
            
            // Dibujar la imagen centrada en el thumbnail
            this.ctx.drawImage(
                img,
                xInicio + offsetX,
                yPos + offsetY,
                drawWidth,
                drawHeight
            );
            
            yPos += thumbSize + espaciado;
        }
        
        this.ctx.restore();
    }
}