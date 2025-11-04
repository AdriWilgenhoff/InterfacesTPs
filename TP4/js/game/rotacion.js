// rotacion.js - Lógica principal para dividir imágenes en piezas y manejar sus rotaciones

import { COLORES } from './constans.js';

export class GestorRotacion {
    constructor(canvas, ctx, imagen, hud = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imagen = imagen;
        this.hud = hud;
        this.modal = null;
        
        // Estado del juego
        this.rotaciones = [];
        this.piezasBloqueadas = [];
        this.juegoActivo = true;
        
        // Callbacks
        this.filtroCallback = null;
        this.completadoCallback = null;
        this.movimientoCallback = null;
        
        // Canvas temporal para filtros (se crea UNA VEZ)
        this.tempCanvas = null;
        this.tempCtx = null;

        // Configuración del grid
        this.gridConfig = {
            filas: 0,
            columnas: 0,
            tamañoCuadrado: 0,
            xInicio: 0,
            yInicio: 0,
            numCuadrados: 0,
            tamañoContenedor: 0
        };

        // Flag para logs de debug
        this.DEBUG = false;
    }

    // === Métodos de configuración ===
    
    establecerCallbackCompletado(callback) {
        this.completadoCallback = callback;
    }

    establecerCallbackMovimiento(callback) {
        this.movimientoCallback = callback;
    }

    establecerModal(modal) {
        this.modal = modal;
    }

    establecerFiltro(filtroCallback) {
        this.filtroCallback = filtroCallback;
    }

    removerFiltro() {
        this.filtroCallback = null;
        this.redibujarImagen();
    }

    // === Métodos principales ===
    
    dibujarImagenDividida(numCuadrados, tamañoContenedor = 400) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calcular grid
        const filas = Math.sqrt(numCuadrados);
        const columnas = Math.sqrt(numCuadrados);

        this.gridConfig = {
            filas,
            columnas,
            numCuadrados,
            tamañoContenedor,
            tamañoCuadrado: tamañoContenedor / filas,
            xInicio: (this.canvas.width - tamañoContenedor) / 2,
            yInicio: (this.canvas.height - tamañoContenedor) / 2
        };

        // Crear canvas temporal UNA VEZ con el tamaño correcto
        if (!this.tempCanvas) {
            this.tempCanvas = document.createElement('canvas');
            this.tempCtx = this.tempCanvas.getContext('2d', { willReadFrequently: true });
        }
        this.tempCanvas.width = tamañoContenedor;
        this.tempCanvas.height = tamañoContenedor;

        // Inicializar arrays
        this.rotaciones = [];
        this.piezasBloqueadas = [];
        
        for (let i = 0; i < numCuadrados; i++) {
            // Rotación aleatoria inicial
            const rotacionesPosibles = [0, 90, 180, 270];
            const rotacionAleatoria = rotacionesPosibles[Math.floor(Math.random() * rotacionesPosibles.length)];
            this.rotaciones.push(rotacionAleatoria);
            
            // Ninguna pieza bloqueada al inicio
            this.piezasBloqueadas.push(false);
        }

        // Debug logs
        if (this.DEBUG) {
            console.log('🎮 Nivel iniciado con', numCuadrados, 'piezas');
            console.log('📋 Estado inicial:', this.rotaciones);
        }

        this.redibujarImagen();
        this.juegoActivo = true;
    }

    redibujarImagen() {

        // 1. Limpiar canvas
        const { filas, columnas, tamañoCuadrado, xInicio, yInicio } = this.gridConfig;
        const anchoPortionImg = this.imagen.width / columnas;
        const altoPortionImg = this.imagen.height / filas;
        const puzzleCompletado = this.verificarCompletado();

        // 2. Dibujar piezas
        let indice = 0;
        for (let fila = 0; fila < filas; fila++) {
            for (let col = 0; col < columnas; col++) {
                const x = xInicio + (col * tamañoCuadrado);
                const y = yInicio + (fila * tamañoCuadrado);
                const sx = col * anchoPortionImg;
                const sy = fila * altoPortionImg;

                // Dibujar pieza rotada
                this.dibujarCuadradoRotado(
                    sx, sy, anchoPortionImg, altoPortionImg,
                    x, y, tamañoCuadrado, this.rotaciones[indice]
                );

                // Dibujar borde (especial si está bloqueada)
                if (!puzzleCompletado && this.piezasBloqueadas[indice]) {
                    this.ctx.strokeStyle = COLORES.bordeBloqueado;
                    this.ctx.lineWidth = 3;
                } else {
                    this.ctx.strokeStyle = COLORES.bordePieza;
                    this.ctx.lineWidth = 2;
                }
                this.ctx.strokeRect(x, y, tamañoCuadrado, tamañoCuadrado);

                indice++;
            }
        }

        // 3. Aplicar filtro si existe
        if (this.filtroCallback && this.tempCanvas && this.tempCtx) {
            const { tamañoContenedor: ancho } = this.gridConfig;
            
            // Obtener imagen del área del puzzle
            const imageData = this.ctx.getImageData(xInicio, yInicio, ancho, ancho);
            
            // Aplicar filtro en canvas temporal
            this.tempCtx.putImageData(imageData, 0, 0);
            this.filtroCallback(this.tempCtx, this.tempCanvas);
            
            // Devolver imagen filtrada
            const imagenFiltrada = this.tempCtx.getImageData(0, 0, ancho, ancho);
            this.ctx.putImageData(imagenFiltrada, xInicio, yInicio);
        }

        // 4. Dibujar HUD y modal
        if (this.hud) {
            const audioMuteado = this.hud.audio ? this.hud.audio.estaMuteado() : false;
            this.hud.dibujar(audioMuteado);
        }

        if (this.modal && this.modal.visible) {
            this.modal.dibujar();
        }
    }

    dibujarCuadradoRotado(sx, sy, sWidth, sHeight, dx, dy, tamaño, rotacion) {
        this.ctx.save();
        this.ctx.translate(dx + tamaño / 2, dy + tamaño / 2);
        this.ctx.rotate((rotacion * Math.PI) / 180);
        this.ctx.drawImage(this.imagen, sx, sy, sWidth, sHeight, -tamaño / 2, -tamaño / 2, tamaño, tamaño);
        this.ctx.restore();
    }

    // === Lógica de rotación ===
    
    rotarCuadrado(event, grados) {
        if (!this.juegoActivo) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Verificar si el click está dentro del área del puzzle
        const clickX = x - this.gridConfig.xInicio;
        const clickY = y - this.gridConfig.yInicio;

        if (clickX < 0 || clickY < 0 ||
            clickX > this.gridConfig.tamañoContenedor ||
            clickY > this.gridConfig.tamañoContenedor) {
            return;
        }

        // Calcular índice de la pieza
        const col = Math.floor(clickX / this.gridConfig.tamañoCuadrado);
        const fila = Math.floor(clickY / this.gridConfig.tamañoCuadrado);
        const indice = fila * this.gridConfig.columnas + col;

        if (indice < 0 || indice >= this.rotaciones.length) return;

        // Verificar si está bloqueada
        if (this.piezasBloqueadas[indice]) {
            if (this.DEBUG) {
                console.log(`🔒 Pieza ${indice} bloqueada (no se puede rotar)`);
            }
            return;
        }

        // Rotar la pieza
        const rotacionPrevia = this.rotaciones[indice];
        this.rotaciones[indice] = ((this.rotaciones[indice] + grados) % 360 + 360) % 360;

        // Debug log
        if (this.DEBUG) {
            const esCorrecta = this.rotaciones[indice] === 0;
            console.log(`🔄 Pieza ${indice}: ${rotacionPrevia}° → ${this.rotaciones[indice]}° ${esCorrecta ? '✅' : '❌'}`);
        }

        // Callback de movimiento
        if (this.movimientoCallback) {
            this.movimientoCallback();
        }

        this.redibujarImagen();

        // Verificar si se completó el puzzle
        if (this.verificarCompletado()) {
            if (this.DEBUG) {
                console.log('🎉 ¡PUZZLE COMPLETADO!');
                console.log('Estado final:', this.rotaciones);
            }
            
            if (this.completadoCallback) {
                this.juegoActivo = false;
                this.completadoCallback();
            }
        } else if (this.DEBUG) {
            const malPosicionados = this.obtenerCantidadMalPosicionados();
            console.log(`📊 Quedan ${malPosicionados} piezas incorrectas`);
        }
    }

    // === Métodos de verificación ===
    
    verificarCompletado() {
        // Comparar directamente con 0
        return this.rotaciones.every(rotacion => rotacion === 0);
    }

    obtenerCantidadMalPosicionados() {
        // Contar piezas que no son 0
        return this.rotaciones.filter(rotacion => rotacion !== 0).length;
    }

    // === Ayuda ===
    
    ayudita() {
        // Encontrar piezas mal posicionadas y no bloqueadas
        const cuadradosMalPosicionados = this.rotaciones
            .map((rotacion, index) => (rotacion !== 0 && !this.piezasBloqueadas[index]) ? index : -1)
            .filter(index => index !== -1);

        if (cuadradosMalPosicionados.length === 0) {
            return false;
        }

        // Seleccionar una al azar
        const indiceAleatorio = Math.floor(Math.random() * cuadradosMalPosicionados.length);
        const cuadradoACorregir = cuadradosMalPosicionados[indiceAleatorio];

        if (this.DEBUG) {
            console.log(`💡 Ayuda: Corrigiendo pieza ${cuadradoACorregir} de ${this.rotaciones[cuadradoACorregir]}° a 0°`);
            console.log(`🔒 Pieza ${cuadradoACorregir} bloqueada`);
        }

        // Corregir y bloquear
        this.rotaciones[cuadradoACorregir] = 0;
        this.piezasBloqueadas[cuadradoACorregir] = true;

        this.redibujarImagen();

        // Verificar si con esto se completó
        if (this.verificarCompletado() && this.completadoCallback) {
            if (this.DEBUG) {
                console.log('🎉 ¡Completado con ayuda!');
            }
            this.juegoActivo = false;
            this.completadoCallback();
        }

        return true;
    }
}