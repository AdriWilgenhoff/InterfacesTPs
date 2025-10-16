// rotacion.js - Lógica principal para dividir imágenes en piezas y manejar sus rotaciones

import { COLORES } from './constans.js';

export class GestorRotacion {
    constructor(canvas, ctx, imagen, hud = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imagen = imagen;
        this.hud = hud;
        this.rotaciones = [];
        this.rotacionesCorrectas = [];
        this.juegoActivo = true;
        this.filtroCallback = null;
        this.completadoCallback = null;
        this.movimientoCallback = null;

        this.gridConfig = {
            filas: 0,
            columnas: 0,
            tamañoCuadrado: 0,
            xInicio: 0,
            yInicio: 0,
            numCuadrados: 0,
            tamañoContenedor: 0
        };

        this.inicializarEventos();
    }

    establecerCallbackCompletado(callback) {
        this.completadoCallback = callback;
    }

    establecerCallbackMovimiento(callback) {
        this.movimientoCallback = callback;
    }

    inicializarEventos() {
        this.canvas.addEventListener('click', (e) => {
            this.rotarCuadrado(e, -90);
            e.stopPropagation();
        });

        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.rotarCuadrado(e, 90);
            e.stopPropagation();
        });
    }

    establecerFiltro(filtroCallback) {
        this.filtroCallback = filtroCallback;
    }

    removerFiltro() {
        this.filtroCallback = null;
        this.redibujarImagen();
    }

    dibujarImagenDividida(numCuadrados, tamañoContenedor = 400) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const filas = Math.sqrt(numCuadrados);
        const columnas = Math.sqrt(numCuadrados);

        this.gridConfig.filas = filas;
        this.gridConfig.columnas = columnas;
        this.gridConfig.numCuadrados = numCuadrados;
        this.gridConfig.tamañoContenedor = tamañoContenedor;
        this.gridConfig.tamañoCuadrado = tamañoContenedor / filas;
        this.gridConfig.xInicio = (this.canvas.width - tamañoContenedor) / 2;
        this.gridConfig.yInicio = (this.canvas.height - tamañoContenedor) / 2;

        // Inicializar rotaciones correctas
        this.rotacionesCorrectas = [];
        for (let i = 0; i < numCuadrados; i++) {
            this.rotacionesCorrectas.push(0);
        }

        // Inicializar rotaciones aleatorias
        this.rotaciones = [];
        for (let i = 0; i < numCuadrados; i++) {
            const rotacionesPosibles = [0, 90, 180, 270];
            const rotacionAleatoria = rotacionesPosibles[Math.floor(Math.random() * rotacionesPosibles.length)];
            this.rotaciones.push(rotacionAleatoria);
        }

        // 👇 AGREGAR - Log inicial del estado
        console.log('🎮 Nivel iniciado con', numCuadrados, 'piezas');
        console.log('📋 Estado inicial:', this.rotaciones);
        console.log('✅ Solución correcta:', this.rotacionesCorrectas);

        this.redibujarImagen();
        this.juegoActivo = true;
    }

    redibujarImagen() {
        this.ctx.fillStyle = COLORES.fondoPantalla;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const filas = this.gridConfig.filas;
        const columnas = this.gridConfig.columnas;
        const tamañoCuadrado = this.gridConfig.tamañoCuadrado;
        const xInicio = this.gridConfig.xInicio;
        const yInicio = this.gridConfig.yInicio;

        const anchoPortionImg = this.imagen.width / columnas;
        const altoPortionImg = this.imagen.height / filas;

        let indice = 0;
        for (let fila = 0; fila < filas; fila++) {
            for (let col = 0; col < columnas; col++) {
                const x = xInicio + (col * tamañoCuadrado);
                const y = yInicio + (fila * tamañoCuadrado);
                const sx = col * anchoPortionImg;
                const sy = fila * altoPortionImg;
                const rotacion = this.rotaciones[indice];

                this.dibujarCuadradoRotado(
                    sx, sy, anchoPortionImg, altoPortionImg,
                    x, y, tamañoCuadrado, rotacion
                );

                this.ctx.strokeStyle = COLORES.bordePieza;
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, tamañoCuadrado, tamañoCuadrado);

                indice++;
            }
        }

        if (this.filtroCallback) {
            const anchoImagen = this.gridConfig.tamañoContenedor;
            const altoImagen = this.gridConfig.tamañoContenedor;
            
            const imageDataImagen = this.ctx.getImageData(xInicio, yInicio, anchoImagen, altoImagen);
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = anchoImagen;
            tempCanvas.height = altoImagen;
            const tempCtx = tempCanvas.getContext('2d');
            
            tempCtx.putImageData(imageDataImagen, 0, 0);
            this.filtroCallback(tempCtx, tempCanvas);
            
            const imageDataFiltrada = tempCtx.getImageData(0, 0, anchoImagen, altoImagen);
            this.ctx.putImageData(imageDataFiltrada, xInicio, yInicio);
        }

        if (this.hud) {
            const audioMuteado = window.audioGlobal ? window.audioGlobal.estaMuteado() : false;
            this.hud.dibujar(audioMuteado);
        }

        if (window.modalGlobal && window.modalGlobal.visible) {
            window.modalGlobal.dibujar();
        }
    }

    dibujarCuadradoRotado(sx, sy, sWidth, sHeight, dx, dy, tamaño, rotacion) {
        this.ctx.save();
        this.ctx.translate(dx + tamaño / 2, dy + tamaño / 2);
        this.ctx.rotate((rotacion * Math.PI) / 180);
        this.ctx.drawImage(
            this.imagen,
            sx, sy, sWidth, sHeight,
            -tamaño / 2, -tamaño / 2, tamaño, tamaño
        );
        this.ctx.restore();
    }

    rotarCuadrado(event, grados) {
        if (!this.juegoActivo) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const clickX = x - this.gridConfig.xInicio;
        const clickY = y - this.gridConfig.yInicio;

        if (clickX < 0 || clickY < 0 ||
            clickX > this.gridConfig.tamañoContenedor ||
            clickY > this.gridConfig.tamañoContenedor) {
            return;
        }

        const col = Math.floor(clickX / this.gridConfig.tamañoCuadrado);
        const fila = Math.floor(clickY / this.gridConfig.tamañoCuadrado);
        const indice = fila * this.gridConfig.columnas + col;

        if (indice >= 0 && indice < this.rotaciones.length) {
            // Guardar rotación previa para el log
            const rotacionPrevia = this.rotaciones[indice];
            
            // Rotar el cuadrado
            this.rotaciones[indice] += grados;

            // Normalizar mejor para evitar bugs
            this.rotaciones[indice] = ((this.rotaciones[indice] % 360) + 360) % 360;

            // Log detallado de la rotación
            const esCorrecta = this.rotaciones[indice] === this.rotacionesCorrectas[indice];
            console.log(`🔄 Pieza ${indice}: ${rotacionPrevia}° → ${this.rotaciones[indice]}° ${esCorrecta ? '✅' : '❌'}`);

            if (this.movimientoCallback) {
                this.movimientoCallback();
            }

            this.redibujarImagen();

            // Log antes de verificar completado
            if (this.verificarCompletado()) {
                console.log('🎉 ¡PUZZLE COMPLETADO!');
                console.log('Estado final:', this.rotaciones);
                console.log('Esperado:', this.rotacionesCorrectas);
                
                if (this.completadoCallback) {
                    this.juegoActivo = false;
                    this.completadoCallback();
                }
            } else {
                // 👇 AGREGAR - Log de piezas mal posicionadas
                const malPosicionados = this.obtenerCantidadMalPosicionados();
                console.log(`📊 Quedan ${malPosicionados} piezas incorrectas`);
            }
        }
    }

    verificarCompletado() {
        // 👇 AGREGAR - Verificación más explícita con log si algo falla
        const completado = this.rotaciones.every((rotacion, index) => {
            const esCorrecta = rotacion === this.rotacionesCorrectas[index];
            if (!esCorrecta) {
                // Solo log en modo debug (comentar en producción)
                // console.log(`Pieza ${index}: tiene ${rotacion}°, necesita ${this.rotacionesCorrectas[index]}°`);
            }
            return esCorrecta;
        });
        return completado;
    }

    obtenerRotaciones() {
        return [...this.rotaciones];
    }

    establecerRotaciones(nuevasRotaciones) {
        if (nuevasRotaciones.length === this.rotaciones.length) {
            this.rotaciones = [...nuevasRotaciones];
            this.redibujarImagen();
        }
    }

    ayudita() {
        const cuadradosMalPosicionados = [];

        for (let i = 0; i < this.rotaciones.length; i++) {
            if (this.rotaciones[i] !== this.rotacionesCorrectas[i]) {
                cuadradosMalPosicionados.push(i);
            }
        }

        if (cuadradosMalPosicionados.length === 0) {
            return false;
        }

        const indiceAleatorio = Math.floor(Math.random() * cuadradosMalPosicionados.length);
        const cuadradoACorregir = cuadradosMalPosicionados[indiceAleatorio];

        // Log de ayuda
        console.log(`💡 Ayuda: Corrigiendo pieza ${cuadradoACorregir} de ${this.rotaciones[cuadradoACorregir]}° a ${this.rotacionesCorrectas[cuadradoACorregir]}°`);

        this.rotaciones[cuadradoACorregir] = this.rotacionesCorrectas[cuadradoACorregir];

        this.redibujarImagen();

        if (this.verificarCompletado() && this.completadoCallback) {
            console.log('🎉 ¡Completado con ayuda!');
            this.juegoActivo = false;
            this.completadoCallback();
        }

        return true;
    }

    obtenerCantidadMalPosicionados() {
        return this.rotaciones.filter((rotacion, index) =>
            rotacion !== this.rotacionesCorrectas[index]
        ).length;
    }
}