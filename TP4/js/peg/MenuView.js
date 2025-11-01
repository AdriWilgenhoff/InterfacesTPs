// ============================================
// MENUVIEW.JS - Vista del Menu Principal
// ============================================

import {
    BOARDS,
    BUG_IMAGES,
    BOARD_THUMB_URLS,
    MENU_ASSETS,
    TIME_PRESETS,
} from './constants.js';

import {
    dibujarTextoCentrado,
    dibujarRectanguloRedondeado,
    puntoEnRectangulo,
    cargarImagenes,
} from './utils.js';

export class MenuView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Selección actual
        this.tableroSeleccionado = Object.keys(BOARDS)[0];
        this.fichaSeleccionada = 0;
        this.tiempoSeleccionadoIndex = 0;

        // UI
        this.selectoresTablero = [];
        this.selectoresTiempo = [];
        this.selectoresFicha = [];
        this.botonComenzar = null;

        // Imágenes cargadas
        this.imgFondoMenu = null;
        this.imgBotonComenzar = null;
        this.boardThumbImgs = [];
        this.bugThumbImgs = [];

        // Estado
        this.imagenesListas = false;

        this.layout = null;

        // Init
        this.precargarImagenes();
        this.inicializar();
    }

    estiloAlSeleccionar(x, y, w, h, seleccionado) {
        // Un único estilo para todos los selectores (boards, tiempo, fichas)
        const ctx = this.ctx;
        ctx.save();
        dibujarRectanguloRedondeado(ctx, x, y, w, h, 10);
        ctx.fillStyle = seleccionado ? '#3498DB' : '#34495E';
        ctx.strokeStyle = seleccionado ? '#2980B9' : '#2C3E50';
        ctx.lineWidth = 3;

        // sombra solo cuando está seleccionado
        if (seleccionado) {
            ctx.shadowColor = 'rgba(0,0,0,0.35)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
        }

        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    // Dibujo de imagen "contain" con padding para no deformar
    dibujarImagenEnContenedor(img, x, y, w, h, pad) {
        if (!img) return;
        const iw = w - pad * 2;
        const ih = h - pad * 2;
        const ratio = img.naturalWidth / img.naturalHeight;
        const boxR = iw / ih;
        let dw = iw, dh = ih;
        if (ratio > boxR) { dh = iw / ratio; } else { dw = ih * ratio; }
        const dx = x + (w - dw) / 2;
        const dy = y + (h - dh) / 2;
        this.ctx.drawImage(img, dx, dy, dw, dh);
    }

    // ---------- Carga de Imágenes ----------
    async precargarImagenes() {
        try {
            const tiposTablero = Object.keys(BOARDS);

            const urls = [];
            urls.push(MENU_ASSETS.background);
            urls.push(MENU_ASSETS.startBtn);

            const idxBoardsStart = urls.length;
            for (let i = 0; i < tiposTablero.length; i++) {
                const tipo = tiposTablero[i];
                urls.push(BOARD_THUMB_URLS[tipo]);
            }

            const idxBugsStart = urls.length;
            for (let i = 0; i < BUG_IMAGES.length; i++) {
                urls.push(BUG_IMAGES[i]);
            }

            const imgs = await cargarImagenes(urls);

            this.imgFondoMenu = imgs[0];
            this.imgBotonComenzar = imgs[1];

            this.boardThumbImgs = [];
            for (let i = 0; i < tiposTablero.length; i++) {
                this.boardThumbImgs.push(imgs[idxBoardsStart + i]);
            }

            this.bugThumbImgs = [];
            for (let i = 0; i < BUG_IMAGES.length; i++) {
                this.bugThumbImgs.push(imgs[idxBugsStart + i]);
            }

            // Vincular imágenes a los selectores ya creados
            for (let i = 0; i < this.selectoresTablero.length; i++) {
                this.selectoresTablero[i].img = this.boardThumbImgs[i] || null;
            }
            for (let i = 0; i < this.selectoresFicha.length; i++) {
                this.selectoresFicha[i].img = this.bugThumbImgs[i] || null;
            }

            this.imagenesListas = true;
            this.renderizar();
        } catch (error) {
            console.error('Error al precargar imágenes del menú:', error);
            this.imagenesListas = true;
            this.renderizar();
        }
    }

    // ---------- layout + construcción de selectores ----------
    inicializar() {
        const W = this.canvas.width;

        // Medidas
        const anchoSelector = 100, altoSelector = 50, gapX = 20;
        const chipW = 110, chipH = 40, chipGap = 14;
        const tamFicha = 60, gapFichaX = 20;

        const tablerosY = 110;
        const tiempoY = tablerosY + altoSelector + 70;
        const fichasY = tiempoY + chipH + 70;
        const btnY = fichasY + tamFicha + 20;

        this.layout = { tablerosY, tiempoY, fichasY, btnY };

        // --- TABLEROS ---
        const tiposTablero = Object.keys(BOARDS);
        const totalTablerosAncho = tiposTablero.length * anchoSelector + (tiposTablero.length - 1) * gapX;
        const inicioTablerosX = (W - totalTablerosAncho) / 2;

        this.selectoresTablero = [];
        for (let i = 0; i < tiposTablero.length; i++) {
            this.selectoresTablero.push({
                tipo: tiposTablero[i],
                x: inicioTablerosX + i * (anchoSelector + gapX),
                y: tablerosY,
                ancho: anchoSelector,
                alto: altoSelector,
                img: null
            });
        }

        // --- TIEMPO ---
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

        // --- FICHAS ---
        const cantFichas = BUG_IMAGES.length;
        const totalFichasAncho = cantFichas * tamFicha + (cantFichas - 1) * gapFichaX;
        const inicioFichaX = (W - totalFichasAncho) / 2;

        this.selectoresFicha = [];
        for (let i = 0; i < cantFichas; i++) {
            this.selectoresFicha.push({
                indice: i,
                x: inicioFichaX + i * (tamFicha + gapFichaX),
                y: fichasY,
                ancho: tamFicha,
                alto: tamFicha,
                img: null
            });
        }

        // --- BOTÓN ---
        this.botonComenzar = { x: (W - 150) / 2, y: btnY, ancho: 150, alto: 45 };
    }

    // ---------- render ----------
    renderizar() {
        const ctx = this.ctx;
        const W = this.canvas.width;

        // Fondo
        if (this.imagenesListas && this.imgFondoMenu) {
            ctx.drawImage(this.imgFondoMenu, 0, 0, W, this.canvas.height);
        } else {
            ctx.fillStyle = 'rgba(23,29,41,0.85)';
            ctx.fillRect(0, 0, W, this.canvas.height);
        }

        // Títulos
        dibujarTextoCentrado(ctx, '<PEG DEBUGGING/>', W / 2, 40, 'bold 32px Arial', '#ECF0F1');

        // --- Tableros ---
        dibujarTextoCentrado(ctx, 'Selecciona un tablero:', W / 2, this.layout.tablerosY - 30, '16px Arial', '#ECF0F1');

        for (let i = 0; i < this.selectoresTablero.length; i++) {
            const s = this.selectoresTablero[i];

            this.estiloAlSeleccionar(s.x, s.y, s.ancho, s.alto, s.tipo === this.tableroSeleccionado);

            if (this.imagenesListas && s.img) {
                this.dibujarImagenEnContenedor(s.img, s.x, s.y, s.ancho, s.alto, 6);
            } else {
                dibujarTextoCentrado(ctx, s.tipo, s.x + s.ancho / 2, s.y + s.alto / 2, '12px Arial', '#ECF0F1');
            }
        }

        // --- Tiempo ---
        dibujarTextoCentrado(ctx, 'Selecciona tiempo:', W / 2, this.layout.tiempoY - 20, '16px Arial', '#ECF0F1');

        for (let i = 0; i < this.selectoresTiempo.length; i++) {
            const s = this.selectoresTiempo[i];
            const seleccionado = (i === this.tiempoSeleccionadoIndex);

            this.estiloAlSeleccionar(s.x, s.y, s.ancho, s.alto, seleccionado);
            dibujarTextoCentrado(ctx, s.label, s.x + s.ancho / 2, s.y + s.alto / 2, 'bold 14px Arial', '#ECF0F1');
        }

        // --- Fichas ---
        dibujarTextoCentrado(ctx, 'Selecciona una ficha:', W / 2, this.layout.fichasY - 20, '16px Arial', '#ECF0F1');

        for (let i = 0; i < this.selectoresFicha.length; i++) {
            const s = this.selectoresFicha[i];
            const seleccionado = s.indice === this.fichaSeleccionada;

            this.estiloAlSeleccionar(s.x, s.y, s.ancho, s.alto, seleccionado);

            if (this.imagenesListas && s.img) {
                this.dibujarImagenEnContenedor(s.img, s.x, s.y, s.ancho, s.alto, 4);
            } else {
                dibujarTextoCentrado(ctx, String(i + 1), s.x + s.ancho / 2, s.y + s.alto / 2, 'bold 24px Arial', '#ECF0F1');
            }
        }

        // Botón comenzar 
        if (this.imagenesListas && this.imgBotonComenzar) {
            ctx.drawImage(this.imgBotonComenzar, this.botonComenzar.x, this.botonComenzar.y, this.botonComenzar.ancho, this.botonComenzar.alto);
        }
        else {
            ctx.save();
            dibujarRectanguloRedondeado(ctx, this.botonComenzar.x, this.botonComenzar.y, this.botonComenzar.ancho, this.botonComenzar.alto, 10);
            ctx.fillStyle = '#ae2727ff';
            ctx.fill();
            ctx.strokeStyle = '#200000ff';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
        }
        dibujarTextoCentrado(ctx, 'COMENZAR', this.botonComenzar.x + this.botonComenzar.ancho / 2, this.botonComenzar.y + this.botonComenzar.alto / 2, 'bold 18px Arial', '#ECF0F1');
    }

    // ---------- hit tests ----------
    detectarClickTablero(x, y) {
        for (let i = 0; i < this.selectoresTablero.length; i++) {
            const s = this.selectoresTablero[i];
            if (puntoEnRectangulo(x, y, s)) {
                this.tableroSeleccionado = s.tipo;
                return s.tipo;
            }
        }
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

    detectarClickFicha(x, y) {
        for (let i = 0; i < this.selectoresFicha.length; i++) {
            const s = this.selectoresFicha[i];
            if (puntoEnRectangulo(x, y, s)) {
                this.fichaSeleccionada = s.indice;
                return s.indice;
            }
        }
        return null;
    }

    detectarClickComenzar(x, y) {
        return puntoEnRectangulo(x, y, this.botonComenzar);
    }

    obtenerConfiguracion() {
        const preset = TIME_PRESETS[this.tiempoSeleccionadoIndex];
        return {
            tipoTablero: this.tableroSeleccionado,
            indiceFicha: this.fichaSeleccionada,
            tiempoLimiteSegundos: preset ? preset.seconds : null, // null = sin timer
            tiempoKey: preset ? preset.key : 'none'
        };
    }

    estanImagenesListas() {
        return this.imagenesListas;
    }
}
