import { BOARDS, BUG_IMAGES, TIME_PRESETS, BOARD_THUMB_URLS } from './constants.js';
import { dibujarTextoCentrado, dibujarRectanguloRedondeado, puntoEnRectangulo, cargarImagenes } from './utils.js';

export class MenuView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Configuración seleccionada
        this.tableroSeleccionado = Object.keys(BOARDS)[0];
        this.fichaSeleccionada = 0;
        this.tiempoSeleccionadoIndex = 0;

        // Elementos de UI
        this.selectoresTablero = [];
        this.selectoresFicha = [];
        this.selectoresTiempo = [];
        this.botonComenzar = null;

        // URLs de imágenes
        this.urlImgFondoMenu = '../assets_game/peg/menu/background13.png';
        this.urlImgBotonComenzar = '../assets_game/peg/menu/boton_comenzar.png';
        this.urlImgBoardClasico = BOARD_THUMB_URLS['Clasico'];
        this.urlImgBoardEuropeo = BOARD_THUMB_URLS['Europeo'];
        this.urlImgBoardDiamante = BOARD_THUMB_URLS['Diamante'];
        this.urlImgBoardTestWin = BOARD_THUMB_URLS['TestWin'];
        this.urlImgBoardTestFail = BOARD_THUMB_URLS['TestFail'];
        this.urlImgFicha1 = BUG_IMAGES[0];
        this.urlImgFicha2 = BUG_IMAGES[1];
        this.urlImgFicha3 = BUG_IMAGES[2];
        this.urlImgFicha4 = BUG_IMAGES[3];

        // Imágenes cargadas
        this.imgFondoMenu = null;
        this.imgBotonComenzar = null;
        this.imgBoardClasico = null;
        this.imgBoardEuropeo = null;
        this.imgBoardDiamante = null;
        this.imgBoardTestWin = null;
        this.imgBoardTestFail = null;
        this.imgFicha1 = null;
        this.imgFicha2 = null;
        this.imgFicha3 = null;
        this.imgFicha4 = null;

        // Flag de carga
        this.imagenesListas = false;

        // Inicializar
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
                this.urlImgBoardDiamante,
                this.urlImgBoardTestWin,
                this.urlImgBoardTestFail,
                this.urlImgFicha1,
                this.urlImgFicha2,
                this.urlImgFicha3,
                this.urlImgFicha4
            ]);

            [
                this.imgFondoMenu,
                this.imgBotonComenzar,
                this.imgBoardClasico,
                this.imgBoardEuropeo,
                this.imgBoardDiamante,
                this.imgBoardTestWin,
                this.imgBoardTestFail,
                this.imgFicha1,
                this.imgFicha2,
                this.imgFicha3,
                this.imgFicha4
            ] = imagenes;

            this.imagenesListas = true;
            console.log('✓ Imágenes del menú cargadas correctamente');

            // Actualizar imágenes de selectores
            this.selectoresTablero.forEach(sel => sel.img = this.elegirTableroMiniatura(sel.tipo));
            this.selectoresFicha.forEach(sel => sel.img = this.elegirFichaMiniatura(sel.indice));

        } catch (error) {
            console.error('Error al precargar imágenes del menú:', error);
            this.imagenesListas = true;
        }
    }

    inicializar() {
        const W = this.canvas.width;
        const H = this.canvas.height;

        // =======================
        // CONFIGURACIÓN GENERAL
        // =======================
        const centroY = H / 2 + 40;
        const separacionColumnas = 140;

        // =======================
        // 1️⃣ SELECTORES TABLERO
        // =======================
        const tiposTablero = Object.keys(BOARDS);
        const anchoTablero = 100;
        const altoTablero = 80;
        const gapTableroX = 15;
        const gapTableroY = 15;
        const columnasTablero = 2;
        const filasTablero = Math.ceil(tiposTablero.length / columnasTablero);
        const difTabX = -130;
        const difTabY = 10;

        const totalAnchoTab = columnasTablero * anchoTablero + (columnasTablero - 1) * gapTableroX;
        const totalAltoTab = filasTablero * altoTablero + (filasTablero - 1) * gapTableroY;

        const bloqueTableroX = (W / 2 - separacionColumnas) - totalAnchoTab / 2;
        const bloqueTableroY = centroY - totalAltoTab / 2;

        this.selectoresTablero = tiposTablero.map((tipo, i) => {
            const fila = Math.floor(i / columnasTablero);
            const col = i % columnasTablero;
            return {
                tipo,
                nombre: tipo,
                x: bloqueTableroX + col * (anchoTablero + gapTableroX) + difTabX,
                y: bloqueTableroY + fila * (altoTablero + gapTableroY) + difTabY,
                ancho: anchoTablero,
                alto: altoTablero,
                img: null
            };
        });

        // =======================
        // 2️⃣ SELECTORES FICHA
        // =======================
        const tamFicha = 60;
        const gapFichaX = 20;
        const gapFichaY = 20;
        const columnasFicha = 2;
        const filasFicha = 2;
        const cantFichas = BUG_IMAGES.length;
        const difFichaX = 10;
        const difFichaY = -50;

        const totalAnchoFicha = columnasFicha * tamFicha + (columnasFicha - 1) * gapFichaX;
        const totalAltoFicha = filasFicha * tamFicha + (filasFicha - 1) * gapFichaY;

        const bloqueFichaX = W / 2 - totalAnchoFicha / 2;
        const bloqueFichaY = centroY - totalAltoFicha / 2;

        this.selectoresFicha = Array.from({ length: cantFichas }, (_, i) => {
            const fila = Math.floor(i / columnasFicha);
            const col = i % columnasFicha;

            return {
                indice: i,
                x: bloqueFichaX + col * (tamFicha + gapFichaX) + difFichaX,
                y: bloqueFichaY + fila * (tamFicha + gapFichaY) + difFichaY,
                ancho: tamFicha,
                alto: tamFicha,
                img: null
            };
        });

        // =======================
        // 3️⃣ SELECTORES TIEMPO
        // =======================
        const chipW = 110;
        const chipH = 40;
        const gapChipX = 20;
        const gapChipY = 20;
        const columnasTiempo = 2;
        const filasTiempo = Math.ceil(TIME_PRESETS.length / columnasTiempo);
        const difTiempoX = +150;
        const difTiempoY = -40;

        const totalAnchoTiempo = columnasTiempo * chipW + (columnasTiempo - 1) * gapChipX;
        const totalAltoTiempo = filasTiempo * chipH + (filasTiempo - 1) * gapChipY;

        const bloqueTiempoX = (W / 2 + separacionColumnas) - totalAnchoTiempo / 2;
        const bloqueTiempoY = centroY - totalAltoTiempo / 2;

        this.selectoresTiempo = TIME_PRESETS.map((preset, i) => {
            const fila = Math.floor(i / columnasTiempo);
            const col = i % columnasTiempo;
            return {
                indice: i,
                label: preset.label,
                x: bloqueTiempoX + col * (chipW + gapChipX) + difTiempoX,
                y: bloqueTiempoY + fila * (chipH + gapChipY) + difTiempoY,
                ancho: chipW,
                alto: chipH
            };
        });

        // =======================
        // BOTÓN COMENZAR
        // =======================
        const btnW = 170;
        const btnH = 50;
        const margenInferior = 40;

        this.botonComenzar = {
            x: (W - btnW) / 2,
            y: H - btnH - margenInferior,
            ancho: btnW,
            alto: btnH
        };
    }

    renderizar() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        // Fondo
        if (this.imagenesListas && this.imgFondoMenu) {
            ctx.drawImage(this.imgFondoMenu, 0, 0, W, H);
        } else {
            ctx.fillStyle = '#222';
            ctx.fillRect(0, 0, W, H);
        }

        // Títulos
        dibujarTextoCentrado(ctx, '<PEG SOLITAIRE/>', W / 2, 50, 'bold 32px Arial', '#ECF0F1');

        // Tableros
        const difXTab = -285;
        const difYTab = 45;
        dibujarTextoCentrado(ctx, 'TABLEROS', (W / 2) + difXTab, 80 + difYTab, '18px Arial', '#ECF0F1');

        this.selectoresTablero.forEach(sel => {
            const seleccionado = sel.tipo === this.tableroSeleccionado;
            const padding = 10;

            ctx.save();
            dibujarRectanguloRedondeado(ctx, sel.x, sel.y, sel.ancho, sel.alto, 10);
            ctx.fillStyle = seleccionado ? '#141414b2' : '#0e0e0eff';
            ctx.fill();
            ctx.strokeStyle = seleccionado ? '#34cf1fff' : '#262727ff';
            ctx.lineWidth = 3;
            ctx.stroke();

            if (this.imagenesListas && sel.img) {
                const innerW = sel.ancho - padding * 2;
                const innerH = sel.alto - padding * 2;

                const ratioImg = sel.img.naturalWidth / sel.img.naturalHeight;
                const ratioBox = innerW / innerH;
                let drawW, drawH;

                if (ratioImg > ratioBox) {
                    drawW = innerW;
                    drawH = innerW / ratioImg;
                } else {
                    drawH = innerH;
                    drawW = innerH * ratioImg;
                }

                const drawX = sel.x + (sel.ancho - drawW) / 2;
                const drawY = sel.y + (sel.alto - drawH) / 2;

                ctx.drawImage(sel.img, drawX, drawY, drawW, drawH);
            } else {
                dibujarTextoCentrado(
                    ctx,
                    sel.nombre,
                    sel.x + sel.ancho / 2,
                    sel.y + sel.alto / 2,
                    '12px Arial',
                    '#ECF0F1'
                );
            }

            ctx.restore();
        });

        // Fichas
        const difXFicha = 15;
        const difYFicha = -112;

        dibujarTextoCentrado(ctx, 'FICHAS', (W / 2) + difXFicha, (H / 2) + difYFicha, '18px Arial', '#ECF0F1');
        this.selectoresFicha.forEach(sel => {
            const seleccionado = sel.indice === this.fichaSeleccionada;
            ctx.save();
            ctx.fillStyle = seleccionado ? '#F39C12' : '#0e0e0eff';
            ctx.fillRect(sel.x, sel.y, sel.ancho, sel.alto);
            ctx.strokeStyle = seleccionado ? '#E67E22' : '#262727ff';
            ctx.lineWidth = 3;
            ctx.strokeRect(sel.x, sel.y, sel.ancho, sel.alto);
            if (this.imagenesListas && sel.img)
                ctx.drawImage(sel.img, sel.x, sel.y, sel.ancho, sel.alto);
            else
                dibujarTextoCentrado(ctx, (sel.indice + 1).toString(), sel.x + sel.ancho / 2, sel.y + sel.alto / 2, 'bold 24px Arial', '#ECF0F1');
            ctx.restore();
        });

        // Tiempo
        const difXTiempo = 285;
        const difYTiempo = -35;

        dibujarTextoCentrado(ctx, 'TIEMPO', W / 2 + difXTiempo, this.selectoresTiempo[0].y + difYTiempo, '18px Arial', '#ECF0F1');
        this.selectoresTiempo.forEach(s => {
            const seleccionado = (s.indice === this.tiempoSeleccionadoIndex);
            ctx.save();
            dibujarRectanguloRedondeado(ctx, s.x, s.y, s.ancho, s.alto, 8);
            ctx.fillStyle = seleccionado ? '#309922ea' : '#0e0e0eff';
            ctx.fill();
            ctx.strokeStyle = seleccionado ? '#1ed10eff' : '#262727ff';
            ctx.lineWidth = 2;
            ctx.stroke();
            dibujarTextoCentrado(ctx, s.label, s.x + s.ancho / 2, s.y + s.alto / 2, 'bold 14px Arial', '#ECF0F1');
            ctx.restore();
        });

        // Botón comenzar
        if (this.imagenesListas && this.imgBotonComenzar) {
            ctx.drawImage(this.imgBotonComenzar, this.botonComenzar.x, this.botonComenzar.y, this.botonComenzar.ancho + 5, this.botonComenzar.alto + 5);
            dibujarTextoCentrado(ctx, 'COMENZAR', this.botonComenzar.x + this.botonComenzar.ancho / 2, (this.botonComenzar.y + this.botonComenzar.alto / 2) + 3, 'bold 18px Arial', '#000000ff');
        } else {
            ctx.save();
            dibujarRectanguloRedondeado(ctx, this.botonComenzar.x, this.botonComenzar.y, this.botonComenzar.ancho, this.botonComenzar.alto, 10);
            ctx.fillStyle = '#27AE60';
            ctx.fill();
            ctx.strokeStyle = '#229954';
            ctx.lineWidth = 3;
            ctx.stroke();
            dibujarTextoCentrado(ctx, 'COMENZAR', this.botonComenzar.x + this.botonComenzar.ancho / 2, this.botonComenzar.y + this.botonComenzar.alto / 2, 'bold 18px Arial', '#ECF0F1');
            ctx.restore();
        }
    }

    // === Detectores de click ===
    detectarClickTablero(x, y) {
        for (const s of this.selectoresTablero)
            if (puntoEnRectangulo(x, y, s)) return (this.tableroSeleccionado = s.tipo);
        return null;
    }

    detectarClickFicha(x, y) {
        for (const s of this.selectoresFicha)
            if (puntoEnRectangulo(x, y, s)) return (this.fichaSeleccionada = s.indice);
        return null;
    }

    detectarClickTiempo(x, y) {
        for (let i = 0; i < this.selectoresTiempo.length; i++) {
            const s = this.selectoresTiempo[i];
            if (puntoEnRectangulo(x, y, s)) {
                this.tiempoSeleccionadoIndex = i;
                return TIME_PRESETS[i];
            }
        }
        return null;
    }

    detectarClickComenzar(x, y) {
        return puntoEnRectangulo(x, y, this.botonComenzar);
    }

    // === Auxiliares ===
    obtenerConfiguracion() {
        const presetTiempo = TIME_PRESETS[this.tiempoSeleccionadoIndex];
        
        console.log('✅ Configuración seleccionada:');
        console.log('  - Índice tiempo:', this.tiempoSeleccionadoIndex);
        console.log('  - Preset completo:', presetTiempo);
        console.log('  - Segundos extraídos:', presetTiempo?.segundos);
         
        const config= {
            tipoTablero: this.tableroSeleccionado,
            indiceFicha: this.fichaSeleccionada,
            tiempoLimiteSegundos: presetTiempo?.seconds || null  // ✅ CORRECCIÓN AQUÍ
        };
        console.log('6. Config final que se envía:', config);
    console.log('=========================================================');
          return config;
    }

    estanImagenesListas() {
        return this.imagenesListas;
    }

    elegirTableroMiniatura(tipo) {
        switch (tipo) {
            case 'Clasico': return this.imgBoardClasico;
            case 'Europeo': return this.imgBoardEuropeo;
            case 'Cuadrado': return this.imgBoardCuadrado;
            case 'Diamante': return this.imgBoardDiamante;
            case 'TestWin': return this.imgBoardTestWin;
            case 'TestFail': return this.imgBoardTestFail;
            default: return null;
        }
    }

    elegirFichaMiniatura(indice) {
        return [this.imgFicha1, this.imgFicha2, this.imgFicha3, this.imgFicha4][indice] || null;
    }
}