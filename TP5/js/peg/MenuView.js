import { BOARDS, BUG_IMAGES, TIME_PRESETS, BOARD_THUMB_URLS, MENU_IMAGES } from './constants.js';
import { dibujarTextoCentrado, dibujarRectanguloRedondeado, puntoEnRectangulo, cargarImagenes } from './utils.js';

export class MenuView {
    // Crea la vista del menú inicializando selectores, imágenes y configuración visual
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.tableroSeleccionado = Object.keys(BOARDS)[0];
        this.fichaSeleccionada = 0;
        this.tiempoSeleccionadoIndex = 0;

        this.selectoresTablero = [];
        this.selectoresFicha = [];
        this.selectoresTiempo = [];
        this.botonComenzar = null;

        this.images = {
            background: null,
            buttonFrame: null,
            boards: [],
            pieces: [],
            timerIcons: []
        };

        this.imagenesListas = false;

        this.precargarImagenes();
        this.inicializar();
    }

    // Precarga todas las imágenes del menú incluyendo fondos, tableros, fichas e iconos de tiempo
    precargarImagenes() {
        const urls = [
            MENU_IMAGES.background,
            MENU_IMAGES.buttonFrame
        ];

        const boardKeys = Object.keys(BOARD_THUMB_URLS);
        for (let i = 0; i < boardKeys.length; i++) {
            urls.push(BOARD_THUMB_URLS[boardKeys[i]]);
        }

        for (let i = 0; i < BUG_IMAGES.length; i++) {
            urls.push(BUG_IMAGES[i]);
        }

        for (let i = 0; i < MENU_IMAGES.timerIcons.length; i++) {
            urls.push(MENU_IMAGES.timerIcons[i]);
        }

        cargarImagenes(urls).then(function(loaded) {
            let idx = 0;

            this.images.background = loaded[idx++];
            this.images.buttonFrame = loaded[idx++];

            for (let i = 0; i < boardKeys.length; i++) {
                this.images.boards.push(loaded[idx++]);
            }

            for (let i = 0; i < BUG_IMAGES.length; i++) {
                this.images.pieces.push(loaded[idx++]);
            }

            for (let i = 0; i < MENU_IMAGES.timerIcons.length; i++) {
                this.images.timerIcons.push(loaded[idx++]);
            }

            this.imagenesListas = true;
            this.actualizarImagenesSelectores();
        }.bind(this)).catch(function(error) {
            this.imagenesListas = true;
        }.bind(this));
    }

    // Actualiza las referencias de imágenes en los selectores una vez que han sido cargadas
    actualizarImagenesSelectores() {
        for (let i = 0; i < this.selectoresTablero.length; i++) {
            this.selectoresTablero[i].img = this.images.boards[i];
        }

        for (let i = 0; i < this.selectoresFicha.length; i++) {
            this.selectoresFicha[i].img = this.images.pieces[i];
        }

        for (let i = 0; i < this.selectoresTiempo.length; i++) {
            this.selectoresTiempo[i].img = this.images.timerIcons[i];
        }
    }

    // Inicializa los selectores del menú calculando sus posiciones y dimensiones
    inicializar() {
        const W = this.canvas.width;
        const H = this.canvas.height;

        const centroY = H / 2 + 40;
        const separacionColumnas = 140;

        const tiposTablero = Object.keys(BOARDS);
        const anchoTablero = 100;
        const altoTablero = 100;
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

        this.selectoresTablero = [];
        for (let i = 0; i < tiposTablero.length; i++) {
            const tipo = tiposTablero[i];
            const fila = Math.floor(i / columnasTablero);
            const col = i % columnasTablero;
            this.selectoresTablero.push({
                tipo: tipo,
                nombre: tipo,
                x: bloqueTableroX + col * (anchoTablero + gapTableroX) + difTabX,
                y: bloqueTableroY + fila * (altoTablero + gapTableroY) + difTabY,
                ancho: anchoTablero,
                alto: altoTablero,
                img: null
            });
        }

        const tamFicha = 100;
        const tamFichaAlto = 100;
        const gapFichaX = 15;
        const gapFichaY = 15;
        const columnasFicha = 2;
        const filasFicha = 2;
        const cantFichas = BUG_IMAGES.length;
        const difFichaX = 10;
        const difFichaY = -45;

        const totalAnchoFicha = columnasFicha * tamFicha + (columnasFicha - 1) * gapFichaX;
        const totalAltoFicha = filasFicha * tamFichaAlto + (filasFicha - 1) * gapFichaY;

        const bloqueFichaX = W / 2 - totalAnchoFicha / 2;
        const bloqueFichaY = centroY - totalAltoFicha / 2;

        this.selectoresFicha = [];
        for (let i = 0; i < cantFichas; i++) {
            const fila = Math.floor(i / columnasFicha);
            const col = i % columnasFicha;
            this.selectoresFicha.push({
                indice: i,
                x: bloqueFichaX + col * (tamFicha + gapFichaX) + difFichaX,
                y: bloqueFichaY + fila * (tamFichaAlto + gapFichaY) + difFichaY,
                ancho: tamFicha,
                alto: tamFichaAlto,
                img: null
            });
        }

        const chipW = 100;
        const chipH = 100;
        const gapChipX = 15;
        const gapChipY = 15;
        const columnasTiempo = 2;
        const filasTiempo = Math.ceil(TIME_PRESETS.length / columnasTiempo);
        const difTiempoX = 150;
        const difTiempoY = 10;

        const totalAnchoTiempo = columnasTiempo * chipW + (columnasTiempo - 1) * gapChipX;
        const totalAltoTiempo = filasTiempo * chipH + (filasTiempo - 1) * gapChipY;

        const bloqueTiempoX = (W / 2 + separacionColumnas) - totalAnchoTiempo / 2;
        const bloqueTiempoY = centroY - totalAltoTiempo / 2;

        this.selectoresTiempo = [];
        for (let i = 0; i < TIME_PRESETS.length; i++) {
            const preset = TIME_PRESETS[i];
            const fila = Math.floor(i / columnasTiempo);
            const col = i % columnasTiempo;
            this.selectoresTiempo.push({
                indice: i,
                label: preset.label,
                x: bloqueTiempoX + col * (chipW + gapChipX) + difTiempoX,
                y: bloqueTiempoY + fila * (chipH + gapChipY) + difTiempoY,
                ancho: chipW,
                alto: chipH,
                img: null
            });
        }

        const btnW = 200;
        const btnH = 50;
        const margenInferior = 40;
        const compX = 15;
        const compY = 0;

        this.botonComenzar = {
            x: ((W - btnW) / 2) + compX,
            y: (H - btnH - margenInferior) + compY,
            ancho: btnW,
            alto: btnH
        };
    }

    // Dibuja una imagen centrada dentro de un área rectangular manteniendo su aspect ratio
    dibujarImagenCentrada(ctx, img, x, y, ancho, alto, padding) {
        const innerW = ancho - padding * 2;
        const innerH = alto - padding * 2;

        const ratioImg = img.naturalWidth / img.naturalHeight;
        const ratioBox = innerW / innerH;

        let drawW, drawH;
        if (ratioImg > ratioBox) {
            drawW = innerW;
            drawH = innerW / ratioImg;
        } else {
            drawH = innerH;
            drawW = innerH * ratioImg;
        }

        const drawX = x + (ancho - drawW) / 2;
        const drawY = y + (alto - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    // Renderiza el menú completo con todos sus selectores y botones
    renderizar() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        if (this.imagenesListas && this.images.background) {
            ctx.drawImage(this.images.background, 0, 0, W, H);
        } else {
            ctx.fillStyle = '#222';
            ctx.fillRect(0, 0, W, H);
        }

        dibujarTextoCentrado(ctx, '<Peg Debugging/>', (W / 2) + 20, 50, 'bold 40px Orbitron', '#ECF0F1');

        const difXTab = -285;
        const difYTab = 25;
        dibujarTextoCentrado(ctx, 'TABLEROS', (W / 2) + difXTab, 80 + difYTab, '18px Orbitron', '#ECF0F1');

        for (let i = 0; i < this.selectoresTablero.length; i++) {
            const sel = this.selectoresTablero[i];
            const seleccionado = sel.tipo === this.tableroSeleccionado;
            const padding = 10;

            ctx.save();

            if (this.imagenesListas && this.images.buttonFrame) {
                ctx.drawImage(this.images.buttonFrame, sel.x, sel.y, sel.ancho, sel.alto);
            } else {
                dibujarRectanguloRedondeado(ctx, sel.x, sel.y, sel.ancho, sel.alto, 10);
                ctx.fillStyle = seleccionado ? '#141414b2' : '#0e0e0eff';
                ctx.fill();
            }

            if (this.imagenesListas && sel.img) {
                this.dibujarImagenCentrada(ctx, sel.img, sel.x, sel.y, sel.ancho, sel.alto, padding);
            } else {
                dibujarTextoCentrado(ctx, sel.nombre, sel.x + sel.ancho / 2, sel.y + sel.alto / 2, '12px Orbitron', '#ECF0F1');
            }

            dibujarRectanguloRedondeado(ctx, sel.x, sel.y, sel.ancho, sel.alto, 10);
            ctx.strokeStyle = seleccionado ? '#1fcf77ff' : '#26272700';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.restore();
        }

        const difXFicha = 15;
        const difYFicha = -130;
        dibujarTextoCentrado(ctx, 'FICHAS', (W / 2) + difXFicha, (H / 2) + difYFicha, '18px Orbitron', '#ECF0F1');

        for (let i = 0; i < this.selectoresFicha.length; i++) {
            const sel = this.selectoresFicha[i];
            const padding = 5;
            const seleccionado = sel.indice === this.fichaSeleccionada;

            ctx.save();

            if (this.imagenesListas && this.images.buttonFrame) {
                ctx.drawImage(this.images.buttonFrame, sel.x, sel.y, sel.ancho + padding, sel.alto + padding);
            } else {
                ctx.fillStyle = seleccionado ? '#222222ff' : '#0e0e0eff';
                ctx.fillRect(sel.x, sel.y, sel.ancho + padding, sel.alto + padding);
            }

            if (this.imagenesListas && sel.img) {
                this.dibujarImagenCentrada(ctx, sel.img, sel.x, sel.y, sel.ancho, sel.alto, padding);
            } else {
                dibujarTextoCentrado(ctx, (sel.indice + 1).toString(), sel.x + sel.ancho / 2, sel.y + sel.alto / 2, 'bold 24px Arial', '#ECF0F1');
            }

            ctx.strokeStyle = seleccionado ? '#22e68bff' : '#26272700';
            ctx.lineWidth = 3;
            ctx.strokeRect(sel.x, sel.y, sel.ancho + padding, sel.alto + padding);

            ctx.restore();
        }

        const difXTiempo = 285;
        const difYTiempo = -15;
        dibujarTextoCentrado(ctx, 'TIEMPO', W / 2 + difXTiempo, this.selectoresTiempo[0].y + difYTiempo, '18px Orbitron', '#ECF0F1');

        for (let i = 0; i < this.selectoresTiempo.length; i++) {
            const s = this.selectoresTiempo[i];
            const seleccionado = (s.indice === this.tiempoSeleccionadoIndex);
            const padding = 10;

            ctx.save();

            if (this.imagenesListas && this.images.buttonFrame) {
                ctx.drawImage(this.images.buttonFrame, s.x, s.y, s.ancho, s.alto);
            } else {
                dibujarRectanguloRedondeado(ctx, s.x, s.y, s.ancho, s.alto, 8);
                ctx.fillStyle = seleccionado ? '#3c4041ea' : '#0e0e0eff';
                ctx.fill();
            }

            if (this.imagenesListas && s.img) {
                this.dibujarImagenCentrada(ctx, s.img, s.x, s.y + 5, s.ancho, s.alto, padding);
            }

            dibujarRectanguloRedondeado(ctx, s.x, s.y, s.ancho, s.alto, 8);
            ctx.strokeStyle = seleccionado ? '#03ff8aff' : '#26272700';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.restore();
        }

        ctx.save();

        if (this.imagenesListas && this.images.buttonFrame) {
            ctx.drawImage(
                this.images.buttonFrame,
                this.botonComenzar.x,
                this.botonComenzar.y,
                this.botonComenzar.ancho,
                this.botonComenzar.alto
            );
        } else {
            dibujarRectanguloRedondeado(ctx, this.botonComenzar.x, this.botonComenzar.y, this.botonComenzar.ancho, this.botonComenzar.alto, 10);
            ctx.fillStyle = '#27AE60';
            ctx.fill();
            ctx.strokeStyle = '#229954';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        dibujarTextoCentrado(ctx, 'COMENZAR', this.botonComenzar.x + this.botonComenzar.ancho / 2, (this.botonComenzar.y + this.botonComenzar.alto / 2) + 3, 'bold 19px Orbitron', '#ECF0F1');
        ctx.restore();
    }

    // Detecta si se hizo click en algún selector de tablero y retorna el tipo seleccionado
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

    // Detecta si se hizo click en algún selector de ficha y retorna el índice seleccionado
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

    // Detecta si se hizo click en algún selector de tiempo y retorna el preset seleccionado
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

    // Detecta si se hizo click en el botón comenzar
    detectarClickComenzar(x, y) {
        return puntoEnRectangulo(x, y, this.botonComenzar);
    }

    // Obtiene la configuración seleccionada por el usuario en el menú
    obtenerConfiguracion() {
        const presetTiempo = TIME_PRESETS[this.tiempoSeleccionadoIndex];
        return {
            tipoTablero: this.tableroSeleccionado,
            indiceFicha: this.fichaSeleccionada,
            tiempoLimiteSegundos: presetTiempo ? presetTiempo.seconds : null
        };
    }

    // Verifica si todas las imágenes del menú han sido cargadas
    estanImagenesListas() {
        return this.imagenesListas;
    }
}