// ============================================
// MENUVIEW.JS - Vista del Menu Principal
// ============================================

import { BOARDS, BUG_IMAGES } from './constants.js';
import { dibujarTextoCentrado, dibujarRectanguloRedondeado, puntoEnRectangulo, cargarImagenes } from './utils.js';

export class MenuView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Configuración seleccionada
        this.tableroSeleccionado = Object.keys(BOARDS)[0];
        this.fichaSeleccionada = 0;

        // Elementos de UI
        this.selectoresTablero = [];
        this.selectoresFicha = [];
        this.botonComenzar = null;

        // URLs de imágenes
        this.urlImgFondoMenu = '../assets_game/peg/menu/background.png';
        this.urlImgBotonComenzar = '../assets_game/peg/menu/boton_comenzar.png';
        this.urlImgBoardClasico = '../assets_game/peg/menu/board_clasico.png';
        this.urlImgBoardEuropeo = '../assets_game/peg/menu/board_europeo.png';
        this.urlImgBoardCuadrado = '../assets_game/peg/menu/board_cuadrado.png';
        this.urlImgBoardDiamante = '../assets_game/peg/menu/board_diamante.png';
        this.urlImgBoardTestWin = '../assets_game/peg/menu/board_test_win.png';
        this.urlImgBoardTestFail = '../assets_game/peg/menu/board_test_fail.png';
        this.urlImgFicha1 = '../assets_game/peg/menu/ficha1.png';
        this.urlImgFicha2 = '../assets_game/peg/menu/ficha2.png';
        this.urlImgFicha3 = '../assets_game/peg/menu/ficha3.png';
        this.urlImgFicha4 = '../assets_game/peg/menu/ficha4.png';

        // Imágenes cargadas
        this.imgFondoMenu = null;
        this.imgBotonComenzar = null;
        this.imgBoardClasico = null;
        this.imgBoardEuropeo = null;
        this.imgBoardCuadrado = null;
        this.imgBoardDiamante = null;
        this.imgBoardTestWin = null;
        this.imgBoardTestFail = null;

        // Flag de carga
        this.imagenesListas = false;

        this.inicializar();
        this.precargarImagenes();
    }

    async precargarImagenes() {
        try {
            const imagenes = await cargarImagenes([
                this.urlImgFondoMenu,
                this.urlImgBotonComenzar,
                this.urlImgBoardClasico,
                this.urlImgBoardEuropeo,
                this.urlImgBoardCuadrado,
                this.urlImgBoardDiamante,
                this.urlImgBoardTestWin,
                this.urlImgBoardTestFail,
                this.urlImgFicha1,
                this.urlImgFicha2,
                this.urlImgFicha3,
                this.urlImgFicha4
            ]);

            this.imgFondoMenu = imagenes[0];
            this.imgBotonComenzar = imagenes[1];
            this.imgBoardClasico = imagenes[2];
            this.imgBoardEuropeo = imagenes[3];
            this.imgBoardCuadrado = imagenes[4];
            this.imgBoardDiamante = imagenes[5];
            this.imgBoardTestWin = imagenes[6];
            this.imgBoardTestFail = imagenes[7];
            this.imgFicha1 = imagenes[8];
            this.imgFicha2 = imagenes[9];
            this.imgFicha3 = imagenes[10];
            this.imgFicha4 = imagenes[11];

            this.imagenesListas = true;
            console.log('✓ Imágenes del menú cargadas correctamente');
        } catch (error) {
            console.error('Error al precargar imágenes del menú:', error);
            this.imagenesListas = true;
        }
    }

    inicializar() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        // ---------------------------
        // Selectores de tablero
        // ---------------------------
        const tiposTablero = Object.keys(BOARDS);
        const anchoSelector = 100;
        const altoSelector = 50;
        const gapTableroX = 20;
        const tablerosY = 110;

        const totalTablerosAncho = tiposTablero.length * anchoSelector + (tiposTablero.length - 1) * gapTableroX;
        const inicioTablerosX = (canvasWidth - totalTablerosAncho) / 2;

        this.selectoresTablero = [];

        for (let i = 0; i < tiposTablero.length; i++) {
            const tipo = tiposTablero[i];
            this.selectoresTablero.push({
                tipo,
                nombre: tipo,
                x: inicioTablerosX + i * (anchoSelector + gapTableroX),
                y: tablerosY,
                ancho: anchoSelector,
                alto: altoSelector,
                urlImg:
                    tipo === 'CLASICO' ? this.urlImgBoardClasico :
                    tipo === 'EUROPEO' ? this.urlImgBoardEuropeo :
                    tipo === 'CUADRADO' ? this.urlImgBoardCuadrado :
                    tipo === 'DIAMANTE' ? this.urlImgBoardDiamante :
                    tipo === 'TEST_WIN' ? this.urlImgBoardTestWin :
                    tipo === 'TEST_FAIL' ? this.urlImgBoardTestFail :
                    null
            });
        }

        // ---------------------------
        // Selectores de ficha
        // ---------------------------
        const tamFicha = 60;
        const gapFichaX = 20;
        const fichaY = canvasHeight - 200;

        this.selectoresFicha = [];

        const cantFichas = BUG_IMAGES.length;
        const totalFichasAncho = cantFichas * tamFicha + (cantFichas - 1) * gapFichaX;
        const inicioFichaX = (canvasWidth - totalFichasAncho) / 2;

        for (let i = 0; i < cantFichas; i++) {
            this.selectoresFicha.push({
                indice: i,
                x: inicioFichaX + i * (tamFicha + gapFichaX),
                y: fichaY,
                ancho: tamFicha,
                alto: tamFicha
            });
        }

        // ---------------------------
        // Botón comenzar
        // ---------------------------
        const btnAncho = 150;
        const btnAlto = 45;
        const margenInferior = 40;

        this.botonComenzar = {
            x: (canvasWidth - btnAncho) / 2,
            y: canvasHeight - btnAlto - margenInferior,
            ancho: btnAncho,
            alto: btnAlto
        };
    }

    renderizar() {
        // Fondo del menú
        if (this.imagenesListas && this.imgFondoMenu) {
            this.ctx.drawImage(this.imgFondoMenu, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = 'rgba(184, 22, 22, 0.76)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Título
        dibujarTextoCentrado(this.ctx, '<PEG SOLITAIRE/>', this.canvas.width / 2, 40, 'bold 32px Arial', '#ECF0F1');

        // Subtítulo tablero
        dibujarTextoCentrado(this.ctx, 'Selecciona un tablero:', this.canvas.width / 2, 80, '18px Arial', '#ECF0F1');

        // Dibujar selectores de tablero
        for (let i = 0; i < this.selectoresTablero.length; i++) {
            const selector = this.selectoresTablero[i];
            const seleccionado = selector.tipo === this.tableroSeleccionado;

            this.ctx.save();
            dibujarRectanguloRedondeado(this.ctx, selector.x, selector.y, selector.ancho, selector.alto, 10);

            this.ctx.fillStyle = seleccionado ? '#3498DB' : '#34495E';
            this.ctx.fill();
            this.ctx.strokeStyle = seleccionado ? '#2980B9' : '#2C3E50';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            // (en el futuro se puede dibujar la miniatura con this.ctx.drawImage)
            this.ctx.restore();
        }

        // Subtítulo ficha
        dibujarTextoCentrado(this.ctx, 'Selecciona una ficha:', this.canvas.width / 2, 250, '18px Arial', '#ECF0F1');

        // Dibujar selectores de ficha
        for (let i = 0; i < this.selectoresFicha.length; i++) {
            const selector = this.selectoresFicha[i];
            const seleccionado = selector.indice === this.fichaSeleccionada;

            this.ctx.save();
            this.ctx.fillStyle = seleccionado ? '#F39C12' : '#95A5A6';
            this.ctx.fillRect(selector.x, selector.y, selector.ancho, selector.alto);
            this.ctx.strokeStyle = seleccionado ? '#E67E22' : '#7F8C8D';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(selector.x, selector.y, selector.ancho, selector.alto);

            dibujarTextoCentrado(
                this.ctx,
                (i + 1).toString(),
                selector.x + selector.ancho / 2,
                selector.y + selector.alto / 2,
                'bold 24px Arial',
                '#ECF0F1'
            );
            this.ctx.restore();
        }

        // Botón comenzar
        if (this.imagenesListas && this.imgBotonComenzar) {
            this.ctx.drawImage(
                this.imgBotonComenzar,
                this.botonComenzar.x,
                this.botonComenzar.y,
                this.botonComenzar.ancho,
                this.botonComenzar.alto
            );
        } else {
            this.ctx.save();
            dibujarRectanguloRedondeado(this.ctx, this.botonComenzar.x, this.botonComenzar.y, this.botonComenzar.ancho, this.botonComenzar.alto, 10);
            this.ctx.fillStyle = '#27AE60';
            this.ctx.fill();
            this.ctx.strokeStyle = '#229954';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            dibujarTextoCentrado(
                this.ctx,
                'COMENZAR',
                this.botonComenzar.x + this.botonComenzar.ancho / 2,
                this.botonComenzar.y + this.botonComenzar.alto / 2,
                'bold 18px Arial',
                '#ECF0F1'
            );
            this.ctx.restore();
        }
    }

    detectarClickTablero(x, y) {
        for (let selector of this.selectoresTablero) {
            if (puntoEnRectangulo(x, y, selector)) {
                this.tableroSeleccionado = selector.tipo;
                return selector.tipo;
            }
        }
        return null;
    }

    detectarClickFicha(x, y) {
        for (let selector of this.selectoresFicha) {
            if (puntoEnRectangulo(x, y, selector)) {
                this.fichaSeleccionada = selector.indice;
                return selector.indice;
            }
        }
        return null;
    }

    detectarClickComenzar(x, y) {
        return puntoEnRectangulo(x, y, this.botonComenzar);
    }

    obtenerConfiguracion() {
        return {
            tipoTablero: this.tableroSeleccionado,
            indiceFicha: this.fichaSeleccionada
        };
    }

    estanImagenesListas() {
        return this.imagenesListas;
    }
}
