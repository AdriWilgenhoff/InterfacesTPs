
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
        this.selectoresTiempo = [];
        this.botonComenzar = null;

        // URLs de imágenes
        this.urlImgFondoMenu = '../assets_game/peg/menu/background.png';
        this.urlImgBotonComenzar = '../assets_game/peg/menu/boton_comenzar.png';
        this.urlImgBoardClasico = '../assets_game/peg/boards/square49.png';
        this.urlImgBoardEuropeo = '../assets_game/peg/boards/european.png';
        this.urlImgBoardCuadrado = '../assets_game/peg/boards/european.png';
        this.urlImgBoardDiamante = '../assets_game/peg/boards/european.png';
        this.urlImgBoardTestWin = '../assets_game/peg/boards/european.png';
        this.urlImgBoardTestFail = '../assets_game/peg/boards/european.png';
        this.urlImgFicha1 = '../assets_game/peg/bugs/ficha3.png';
        this.urlImgFicha2 = '../assets_game/peg/bugs/ficha3.png';
        this.urlImgFicha3 = '../assets_game/peg/bugs/ficha3.png';
        this.urlImgFicha4 = '../assets_game/peg/bugs/ficha3.png';

        // Imágenes cargadas
        this.imgFondoMenu = null;
        this.imgBotonComenzar = null;
        this.imgBoardClasico = null;
        this.imgBoardEuropeo = null;
        this.imgBoardCuadrado = null;
        this.imgBoardDiamante = null;
        this.imgBoardTestWin = null;
        this.imgBoardTestFail = null;
        this.imgFicha1 = null;
        this.imgFicha2 = null;
        this.imgFicha3 = null;
        this.imgFicha4 = null;

        // Flag de carga
        this.imagenesListas = false;

        // Inicializar (no se puede await en constructor)
        this.precargarImagenes();
        this.inicializar();
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
            
            // Actualizar las referencias de imágenes en los selectores de TABLERO
            for (let i = 0; i < this.selectoresTablero.length; i++) {
                const tipo = this.selectoresTablero[i].tipo;
                this.selectoresTablero[i].img = this.elegirTableroMiniatura(tipo);
            }

            // Actualizar las referencias de imágenes en los selectores de FICHA
            for (let i = 0; i < this.selectoresFicha.length; i++) {
                const indice = this.selectoresFicha[i].indice;
                this.selectoresFicha[i].img = this.elegirFichaMiniatura(indice);
            }

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
                img: null // Se asignará cuando las imágenes se carguen
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
                alto: tamFicha,
                img: null // Se asignará cuando las imágenes se carguen
            });
        }
             const totalTiempoAncho = TIME_PRESETS.length * chipW + (TIME_PRESETS.length - 1) * chipGap;
                const inicioTiempoX = (W - totalTiempoAncho) / 2;
        
                this.selectoresTiempo = [];
                for (let i = 0; i < TIME_PRESETS.length; i++) {
                    this.selectoresTiempo.push({
                        indice: i,
                        label: TIME_PRESETS[i].label,
                        x: inicioTiempoX + i * (chipW + chipGap),
                        y: tiempoY,
                        ancho: chipW,
                        alto: chipH
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

            // Dibujar imagen si está disponible
            if (this.imagenesListas && selector.img) {
                this.ctx.drawImage(selector.img, selector.x, selector.y, 60, 60);
            } else {
                dibujarTextoCentrado(this.ctx, selector.tipo, selector.x + selector.ancho / 2, selector.y + selector.alto / 2, '12px Arial', '#ECF0F1');
            }
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

            // Dibujar imagen si está disponible
            if (this.imagenesListas && selector.img) {
                this.ctx.drawImage(selector.img, selector.x, selector.y, selector.ancho, selector.alto);
            } else {
                // Fallback: mostrar número
                dibujarTextoCentrado(
                    this.ctx,
                    (i + 1).toString(),
                    selector.x + selector.ancho / 2,
                    selector.y + selector.alto / 2,
                    'bold 24px Arial',
                    '#ECF0F1'
                );
            }
            this.ctx.restore();
        }
          dibujarTextoCentrado(ctx, 'Selecciona tiempo:', W / 2, this.layout.tiempoY - 20, '16px Arial', '#ECF0F1');
        
                for (let i = 0; i < this.selectoresTiempo.length; i++) {
                    const s = this.selectoresTiempo[i];
                    const seleccionado = (i === this.tiempoSeleccionadoIndex);
        
                    this.estiloAlSeleccionar(s.x, s.y, s.ancho, s.alto, seleccionado);
                    dibujarTextoCentrado(ctx, s.label, s.x + s.ancho / 2, s.y + s.alto / 2, 'bold 14px Arial', '#ECF0F1');
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

    elegirTableroMiniatura(tipo) {
        switch (tipo) {
            case 'Clasico': 
                return this.imgBoardClasico;
            case 'Europeo':  
                return this.imgBoardEuropeo;
            case 'Cuadrado': 
                return this.imgBoardCuadrado;
            case 'Diamante': 
                return this.imgBoardDiamante;
            case 'TestWin': 
                return this.imgBoardTestWin;
            case 'TestFail': 
                return this.imgBoardTestFail;
            default:
                return null;
        }
    }

    elegirFichaMiniatura(indice) {
        switch (indice) {
            case 0:
                return this.imgFicha1;
            case 1:
                return this.imgFicha2;
            case 2:
                return this.imgFicha3;
            case 3:
                return this.imgFicha4;
            default:
                return null;
        }
    }
}

/********el codigo de este mogolico *********************************************************************************************** */
// ============================================
// MENUVIEW.JS - Vista del Menu Principal
// ============================================
