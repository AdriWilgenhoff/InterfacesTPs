// rotacion.js - Lógica principal para dividir imágenes en piezas y manejar sus rotaciones

import { COLORES, FUENTES } from './constans.js';
export class GestorRotacion {
    constructor(canvas, ctx, imagen, hud = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imagen = imagen;                    // Imagen a dividir y rotar
        this.hud = hud;                          // Referencia al HUD (opcional)
        this.rotaciones = [];                    // Rotaciones actuales de cada pieza
        this.rotacionesCorrectas = [];           // Rotaciones correctas (solución)
        this.juegoActivo = true;                 // Control de si se pueden hacer movimientos
        this.filtroCallback = null;              // Función de filtro visual (opcional)
        this.completadoCallback = null;          // Callback cuando se completa el puzzle
        this.movimientoCallback = null;          // Callback cuando se rota una pieza

        // Configuración del grid de piezas
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

    /**
     * Establece el callback que se ejecuta al completar el puzzle
     * @param {Function} callback - Función a ejecutar
     */
    establecerCallbackCompletado(callback) {
        this.completadoCallback = callback;
    }

    /**
     * Establece el callback que se ejecuta al mover una pieza
     * @param {Function} callback - Función a ejecutar
     */
    establecerCallbackMovimiento(callback) {
        this.movimientoCallback = callback;
    }

    /**
     * Inicializa los event listeners para rotar piezas
     * - Clic izquierdo: rotar sentido antihorario (-90°)
     * - Clic derecho: rotar sentido horario (+90°)
     */
    inicializarEventos() {
        // Clic izquierdo: rotar a la izquierda
        this.canvas.addEventListener('click', (e) => {
            this.rotarCuadrado(e, -90);
            e.stopPropagation();
        });

        // Clic derecho: rotar a la derecha
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.rotarCuadrado(e, 90);
            e.stopPropagation();
        });
    }

    /**
     * Establece un filtro visual para aplicar sobre la imagen
     * @param {Function} filtroCallback - Función que aplica el filtro
     */
    establecerFiltro(filtroCallback) {
        this.filtroCallback = filtroCallback;
    }

    /**
     * Remueve el filtro visual y muestra la imagen original
     */
    removerFiltro() {
        this.filtroCallback = null;
        this.redibujarImagen();
    }

    /**
     * Divide la imagen en un grid de cuadrados y los rota aleatoriamente
     * @param {number} numCuadrados - Número de piezas (debe ser 4, 9, 16 o 25)
     * @param {number} tamañoContenedor - Tamaño del contenedor en píxeles (default: 400)
     */
    dibujarImagenDividida(numCuadrados, tamañoContenedor = 400) {

        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calcular filas y columnas (siempre iguales para formar cuadrado perfecto)
        const filas = Math.sqrt(numCuadrados);
        const columnas = Math.sqrt(numCuadrados);

        // Guardar configuración del grid para uso posterior
        this.gridConfig.filas = filas;
        this.gridConfig.columnas = columnas;
        this.gridConfig.numCuadrados = numCuadrados;
        this.gridConfig.tamañoContenedor = tamañoContenedor;
        this.gridConfig.tamañoCuadrado = tamañoContenedor / filas;
        this.gridConfig.xInicio = (this.canvas.width - tamañoContenedor) / 2;
        this.gridConfig.yInicio = (this.canvas.height - tamañoContenedor) / 2;

        // Inicializar rotaciones correctas (todas en 0° = imagen sin rotar)
        this.rotacionesCorrectas = [];
        for (let i = 0; i < numCuadrados; i++) {
            this.rotacionesCorrectas.push(0);
        }

        // Inicializar rotaciones aleatorias (estado inicial del puzzle)
        this.rotaciones = [];
        for (let i = 0; i < numCuadrados; i++) {
            const rotacionesPosibles = [0, 90, 180, 270];
            const rotacionAleatoria = rotacionesPosibles[Math.floor(Math.random() * rotacionesPosibles.length)];
            this.rotaciones.push(rotacionAleatoria);
        }

        // Dibujar el estado inicial
        this.redibujarImagen();

        // Activar el juego
        this.juegoActivo = true;
    }

    /**
 * Redibuja toda la imagen con las rotaciones actuales
 * También dibuja el HUD y modal si están activos
 */
redibujarImagen() {
    // 1. Dibujar fondo completo (sin filtro)
    this.ctx.fillStyle = COLORES.fondoPantalla;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const filas = this.gridConfig.filas;
    const columnas = this.gridConfig.columnas;
    const tamañoCuadrado = this.gridConfig.tamañoCuadrado;
    const xInicio = this.gridConfig.xInicio;
    const yInicio = this.gridConfig.yInicio;

    // Calcular tamaño de cada porción en la imagen original
    const anchoPortionImg = this.imagen.width / columnas;
    const altoPortionImg = this.imagen.height / filas;

    // 2. Dibujar cada pieza del puzzle
    let indice = 0;
    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            const x = xInicio + (col * tamañoCuadrado);
            const y = yInicio + (fila * tamañoCuadrado);
            const sx = col * anchoPortionImg;
            const sy = fila * altoPortionImg;
            const rotacion = this.rotaciones[indice];

            // Dibujar pieza con rotación
            this.dibujarCuadradoRotado(
                sx, sy, anchoPortionImg, altoPortionImg,
                x, y, tamañoCuadrado, rotacion
            );

            // Dibujar borde de la pieza
            this.ctx.strokeStyle = COLORES.bordePieza;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, tamañoCuadrado, tamañoCuadrado);

            indice++;
        }
    }

    // 3. 👇 NUEVO - Aplicar filtro SOLO al área de la imagen
    if (this.filtroCallback) {
        const anchoImagen = this.gridConfig.tamañoContenedor;
        const altoImagen = this.gridConfig.tamañoContenedor;
        
        // Guardar solo el área de la imagen
        const imageDataImagen = this.ctx.getImageData(xInicio, yInicio, anchoImagen, altoImagen);
        
        // Crear un canvas temporal para aplicar el filtro
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = anchoImagen;
        tempCanvas.height = altoImagen;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Poner la imagen en el canvas temporal
        tempCtx.putImageData(imageDataImagen, 0, 0);
        
        // Aplicar filtro al canvas temporal
        this.filtroCallback(tempCtx, tempCanvas);
        
        // Obtener la imagen filtrada
        const imageDataFiltrada = tempCtx.getImageData(0, 0, anchoImagen, altoImagen);
        
        // Poner la imagen filtrada de vuelta en el canvas principal
        this.ctx.putImageData(imageDataFiltrada, xInicio, yInicio);
    }

    // 4. Dibujar HUD si existe (después del filtro para que no le afecte)
    if (this.hud) {
        const audioMuteado = window.audioGlobal ? window.audioGlobal.estaMuteado() : false;
        this.hud.dibujar(audioMuteado);
    }

    // 5. Dibujar modal si está visible
    if (window.modalGlobal && window.modalGlobal.visible) {
        window.modalGlobal.dibujar();
    }
}

    /**
     * Dibuja un cuadrado rotado de la imagen
     * @param {number} sx - Coordenada X en la imagen original
     * @param {number} sy - Coordenada Y en la imagen original
     * @param {number} sWidth - Ancho en la imagen original
     * @param {number} sHeight - Alto en la imagen original
     * @param {number} dx - Coordenada X de destino en el canvas
     * @param {number} dy - Coordenada Y de destino en el canvas
     * @param {number} tamaño - Tamaño del cuadrado en el canvas
     * @param {number} rotacion - Rotación en grados (0, 90, 180, 270)
     */
    dibujarCuadradoRotado(sx, sy, sWidth, sHeight, dx, dy, tamaño, rotacion) {
        this.ctx.save();

        // Trasladar al centro del cuadrado
        this.ctx.translate(dx + tamaño / 2, dy + tamaño / 2);

        // Rotar (convertir grados a radianes)
        this.ctx.rotate((rotacion * Math.PI) / 180);

        // Dibujar la imagen centrada
        this.ctx.drawImage(
            this.imagen,
            sx, sy, sWidth, sHeight,
            -tamaño / 2, -tamaño / 2, tamaño, tamaño
        );

        this.ctx.restore();
    }

    /**
     * Rota un cuadrado al hacer click
     * @param {MouseEvent} event - Evento del click
     * @param {number} grados - Grados a rotar (-90 o 90)
     */
    rotarCuadrado(event, grados) {
        // No permitir movimientos si el juego está completado
        if (!this.juegoActivo) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Calcular en qué cuadrado se hizo clic
        const clickX = x - this.gridConfig.xInicio;
        const clickY = y - this.gridConfig.yInicio;

        // Verificar que el clic esté dentro del contenedor
        if (clickX < 0 || clickY < 0 ||
            clickX > this.gridConfig.tamañoContenedor ||
            clickY > this.gridConfig.tamañoContenedor) {
            return;
        }

        // Calcular índice de la pieza clickeada
        const col = Math.floor(clickX / this.gridConfig.tamañoCuadrado);
        const fila = Math.floor(clickY / this.gridConfig.tamañoCuadrado);
        const indice = fila * this.gridConfig.columnas + col;

        if (indice >= 0 && indice < this.rotaciones.length) {
            // Rotar el cuadrado
            this.rotaciones[indice] += grados;

            // Normalizar a rango 0-270
            if (this.rotaciones[indice] < 0) this.rotaciones[indice] += 360;
            if (this.rotaciones[indice] >= 360) this.rotaciones[indice] -= 360;

            // Ejecutar callback de movimiento (para reproducir sonido)
            if (this.movimientoCallback) {
                this.movimientoCallback();
            }

            // Redibujar con las nuevas rotaciones
            this.redibujarImagen();

            // Verificar si se completó el puzzle
            if (this.verificarCompletado() && this.completadoCallback) {
                this.juegoActivo = false;
                this.completadoCallback();
            }
        }
    }

    /**
     * Verifica si todas las piezas están en su rotación correcta
     * @returns {boolean} - true si el puzzle está completo
     */
    verificarCompletado() {
        return this.rotaciones.every((rotacion, index) =>
            rotacion === this.rotacionesCorrectas[index]
        );
    }

    /**
     * Obtiene una copia del array de rotaciones actuales
     * @returns {Array<number>} - Array de rotaciones
     */
    obtenerRotaciones() {
        return [...this.rotaciones];
    }

    /**
     * Establece las rotaciones manualmente
     * Útil para cargar una partida guardada
     * @param {Array<number>} nuevasRotaciones - Array de rotaciones
     */
    establecerRotaciones(nuevasRotaciones) {
        if (nuevasRotaciones.length === this.rotaciones.length) {
            this.rotaciones = [...nuevasRotaciones];
            this.redibujarImagen();
        }
    }

    /**
     * Corrige automáticamente una pieza mal posicionada (ayuda)
     * @returns {boolean} - true si se corrigió algo, false si ya está completo
     */
    ayudita() {
        // Buscar piezas que NO estén en su rotación correcta
        const cuadradosMalPosicionados = [];

        for (let i = 0; i < this.rotaciones.length; i++) {
            if (this.rotaciones[i] !== this.rotacionesCorrectas[i]) {
                cuadradosMalPosicionados.push(i);
            }
        }

        // Si no hay piezas mal posicionadas, no hacer nada
        if (cuadradosMalPosicionados.length === 0) {
            return false;
        }

        // Elegir una pieza al azar para corregir
        const indiceAleatorio = Math.floor(Math.random() * cuadradosMalPosicionados.length);
        const cuadradoACorregir = cuadradosMalPosicionados[indiceAleatorio];

        // Corregir la pieza
        this.rotaciones[cuadradoACorregir] = this.rotacionesCorrectas[cuadradoACorregir];

        // Redibujar
        this.redibujarImagen();

        // Verificar si con esta ayuda se completó el puzzle
        if (this.verificarCompletado() && this.completadoCallback) {
            this.juegoActivo = false;
            this.completadoCallback();
        }

        return true;
    }

    /**
     * Establece referencia al previsualizador (actualmente no se usa)
     * @param {Previsualizador} previsualizador - Instancia del previsualizador
     */
    setPrevisualizador(previsualizador) {
        this.previsualizador = previsualizador;
    }

    /**
     * Obtiene la cantidad de piezas que están mal posicionadas
     * @returns {number} - Cantidad de piezas incorrectas
     */
    obtenerCantidadMalPosicionados() {
        return this.rotaciones.filter((rotacion, index) =>
            rotacion !== this.rotacionesCorrectas[index]
        ).length;
    }
}