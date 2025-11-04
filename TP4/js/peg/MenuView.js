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

        // ========================================
        // CONFIGURACIÓN DE TAMAÑOS DE BOTONES
        // ========================================
        this.tamañoTablero = {
            ancho: 100,
            alto: 100
        };

        this.tamañoFicha = {
            ancho: 100,
            alto: 100
        };

        this.tamañoTiempo = {
            ancho: 100,
            alto: 100
        };

        this.tamañoComenzar = {
            ancho: 200,
            alto: 50
        };

        // URLs de imágenes - TABLEROS
        this.urlImgFondoMenu = '../assets_game/peg/menu/background133.png';
        this.urlImgBotonComenzar = '../assets_game/peg/menu/hud8 (3) (1).png';
        this.urlImgBoardClasico = BOARD_THUMB_URLS['Clasico'];
        this.urlImgBoardEuropeo = BOARD_THUMB_URLS['Europeo'];
        this.urlImgBoardCuadrado = BOARD_THUMB_URLS['Cuadrado'];
        this.urlImgBoardDiamante = BOARD_THUMB_URLS['Diamante'];
        this.urlImgBoardTestWin = BOARD_THUMB_URLS['TestWin'];
        this.urlImgBoardTestFail = BOARD_THUMB_URLS['TestFail'];

        // URLs de imágenes - FICHAS
        this.urlImgFicha1 = BUG_IMAGES[0];
        this.urlImgFicha2 = BUG_IMAGES[1];
        this.urlImgFicha3 = BUG_IMAGES[2];
        this.urlImgFicha4 = BUG_IMAGES[3];

        // URLs de imágenes - FONDOS DE SELECTORES
        this.urlImgFondoSelectorTablero = '../assets_game/peg/menu/hud8 (3) (1).png';
        this.urlImgFondoSelectorFicha = '../assets_game/peg/menu/hud8 (3) (1).png';
        
        // URLs de imágenes - BOTONES DE TIEMPO (uno para cada preset)
        // CONFIGURA AQUÍ LAS URLS DE CADA IMAGEN DE TIEMPO
        this.urlImgTiempo = [
            '../assets_game/peg/menu/prueba.png', // Sin límite
            '../assets_game/peg/menu/timer01.png', // 5 min
            '../assets_game/peg/menu/timer5.png', // 10 min
            '../assets_game/peg/menu/timer10.png', // 15 min
            '../assets_game/peg/menu/timer15.png', // 20 min
            '../assets_game/peg/menu/timer20.png'  // 30 min
        ];

        // URLs de imágenes - FONDOS DE BOTONES DE TIEMPO (uno para cada preset)
        this.urlImgFondoTiempo = [
            '../assets_game/peg/menu/hud8 (3) (1).png', // Sin límite
            '../assets_game/peg/menu/hud8 (3) (1).png', // 5 min
            '../assets_game/peg/menu/hud8 (3) (1).png', // 10 min
            '../assets_game/peg/menu/hud8 (3) (1).png', // 15 min
            '../assets_game/peg/menu/hud8 (3) (1).png', // 20 min
            '../assets_game/peg/menu/hud8 (3) (1).png'  // 30 min
        ];

        // Imágenes cargadas - FONDO Y BOTONES
        this.imgFondoMenu = null;
        this.imgBotonComenzar = null;

        // Imágenes cargadas - TABLEROS
        this.imgBoardClasico = null;
        this.imgBoardEuropeo = null;
        this.imgBoardCuadrado = null;
        this.imgBoardDiamante = null;
        this.imgBoardTestWin = null;
        this.imgBoardTestFail = null;

        // Imágenes cargadas - FICHAS
        this.imgFicha1 = null;
        this.imgFicha2 = null;
        this.imgFicha3 = null;
        this.imgFicha4 = null;

        // Imágenes cargadas - FONDOS DE SELECTORES
        this.imgFondoSelectorTablero = null;
        this.imgFondoSelectorFicha = null;

        // Imágenes cargadas - TIEMPO (array de imágenes, una por cada preset)
        this.imgTiempo = [];
        this.imgFondoTiempo = [];

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
            this.urlImgBoardCuadrado,
            this.urlImgBoardDiamante,
            this.urlImgBoardTestWin,
            this.urlImgBoardTestFail,
            this.urlImgFicha1,
            this.urlImgFicha2,
            this.urlImgFicha3,
            this.urlImgFicha4,
            this.urlImgFondoSelectorTablero,
            this.urlImgFondoSelectorFicha,
            ...this.urlImgTiempo,        // Cargar todas las imágenes de tiempo
            ...this.urlImgFondoTiempo    // Cargar todos los fondos de tiempo
        ]);

        const cantidadTiempo = this.urlImgTiempo.length;
        const cantidadFondoTiempo = this.urlImgFondoTiempo.length;

        // Asignar las primeras 14 imágenes (individuales)
        [
            this.imgFondoMenu,
            this.imgBotonComenzar,
            this.imgBoardClasico,
            this.imgBoardEuropeo,
            this.imgBoardCuadrado,
            this.imgBoardDiamante,
            this.imgBoardTestWin,
            this.imgBoardTestFail,
            this.imgFicha1,
            this.imgFicha2,
            this.imgFicha3,
            this.imgFicha4,
            this.imgFondoSelectorTablero,
            this.imgFondoSelectorFicha
        ] = imagenes;

        // Asignar arrays de imágenes de tiempo usando slice
        this.imgTiempo = imagenes.slice(14, 14 + cantidadTiempo);
        this.imgFondoTiempo = imagenes.slice(14 + cantidadTiempo, 14 + cantidadTiempo + cantidadFondoTiempo);

        this.imagenesListas = true;
        console.log('✓ Imágenes del menú cargadas correctamente');

        // Actualizar imágenes de selectores
        this.selectoresTablero.forEach(sel => sel.img = this.elegirTableroMiniatura(sel.tipo));
        this.selectoresFicha.forEach(sel => sel.img = this.elegirFichaMiniatura(sel.indice));
        this.selectoresTiempo.forEach((sel, i) => {
            sel.img = this.imgTiempo[i] || null;
            sel.imgFondo = this.imgFondoTiempo[i] || null;
        });

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
        const anchoTablero = this.tamañoTablero.ancho;
        const altoTablero = this.tamañoTablero.alto;
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
        const tamFicha = this.tamañoFicha.ancho;
        const tamFichaAlto = this.tamañoFicha.alto;
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

        this.selectoresFicha = Array.from({ length: cantFichas }, (_, i) => {
            const fila = Math.floor(i / columnasFicha);
            const col = i % columnasFicha;

            return {
                indice: i,
                x: bloqueFichaX + col * (tamFicha + gapFichaX) + difFichaX,
                y: bloqueFichaY + fila * (tamFichaAlto + gapFichaY) + difFichaY,
                ancho: tamFicha,
                alto: tamFichaAlto,
                img: null
            };
        });

        // =======================
        // 3️⃣ SELECTORES TIEMPO
        // =======================
        const chipW = this.tamañoTiempo.ancho;
        const chipH = this.tamañoTiempo.alto;
        const gapChipX = 15;
        const gapChipY = 15;
        const columnasTiempo = 2;
        const filasTiempo = Math.ceil(TIME_PRESETS.length / columnasTiempo);
        const difTiempoX = +150;
        const difTiempoY = 10;

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
                alto: chipH,
                img: null,
                imgFondo: null
            };
        });

        // =======================
        // BOTÓN COMENZAR
        // =======================
        const btnW = this.tamañoComenzar.ancho;
        const btnH = this.tamañoComenzar.alto;
        const margenInferior = 40;
        const compX =15;
        const compY =0;

        this.botonComenzar = {
            x: ((W - btnW) / 2) + compX,
            y: (H - btnH - margenInferior) + compY,
            ancho: btnW,
            alto: btnH
        };
    }

    // Función auxiliar para dibujar imágenes centradas
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
        dibujarTextoCentrado(ctx, '<Peg Debugger/>', (W / 2) + 20 , 50, 'bold 40px Orbitron', '#ECF0F1');

        // =======================
        // RENDERIZAR TABLEROS
        // =======================

        const difXTab = -285;
        const difYTab = 25;

        dibujarTextoCentrado(ctx, 'TABLEROS', (W / 2) + difXTab, 80 + difYTab, '18px Orbitron', '#ECF0F1');

        this.selectoresTablero.forEach(sel => {
            const seleccionado = sel.tipo === this.tableroSeleccionado;
            const padding = 10;

            ctx.save();

            // Dibujar imagen de fondo del selector
            if (this.imagenesListas && this.imgFondoSelectorTablero) {
                ctx.drawImage(this.imgFondoSelectorTablero, sel.x, sel.y, sel.ancho, sel.alto);
            } else {
                // Fallback: dibujar rectángulo redondeado
                dibujarRectanguloRedondeado(ctx, sel.x, sel.y, sel.ancho, sel.alto, 10);
                ctx.fillStyle = seleccionado ? '#141414b2' : '#0e0e0eff';
                ctx.fill();
            }

            // Dibujar imagen del tablero encima
            if (this.imagenesListas && sel.img) {
                this.dibujarImagenCentrada(ctx, sel.img, sel.x, sel.y, sel.ancho, sel.alto, padding);
            } else {
                dibujarTextoCentrado(ctx, sel.nombre, sel.x + sel.ancho / 2, sel.y + sel.alto / 2, '12px Orbitron', '#ECF0F1');
            }

            // Dibujar borde de selección
            dibujarRectanguloRedondeado(ctx, sel.x, sel.y, sel.ancho, sel.alto, 10);
            ctx.strokeStyle = seleccionado ? '#1fcf77ff' : '#26272700';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.restore();
        });

        // =======================
        // RENDERIZAR FICHAS
        // =======================
        const difXFicha = 15;
        const difYFicha = -130;

        dibujarTextoCentrado(ctx, 'FICHAS', (W / 2) + difXFicha, (H / 2) + difYFicha, '18px Orbitron', '#ECF0F1');
        this.selectoresFicha.forEach(sel => {
            const padding = 5;
            const seleccionado = sel.indice === this.fichaSeleccionada;

            ctx.save();

            // Dibujar imagen de fondo del selector
            if (this.imagenesListas && this.imgFondoSelectorFicha) {
                ctx.drawImage(this.imgFondoSelectorFicha, sel.x, sel.y, sel.ancho + padding, sel.alto + padding);
            } else {
                // Fallback: dibujar rectángulo sólido
                ctx.fillStyle = seleccionado ? '#222222ff' : '#0e0e0eff';
                ctx.fillRect(sel.x, sel.y, sel.ancho + padding, sel.alto + padding);
            }

            // Dibujar imagen de la ficha encima
            if (this.imagenesListas && sel.img) {
                this.dibujarImagenCentrada(ctx, sel.img, sel.x, sel.y, sel.ancho, sel.alto, padding);
            } else {
                dibujarTextoCentrado(ctx, (sel.indice + 1).toString(), sel.x + sel.ancho / 2, sel.y + sel.alto / 2, 'bold 24px Arial', '#ECF0F1');
            }

            // Dibujar borde de selección
            ctx.strokeStyle = seleccionado ? '#22e68bff' : '#26272700';
            ctx.lineWidth = 3;
            ctx.strokeRect(sel.x, sel.y, sel.ancho + padding, sel.alto + padding);

            ctx.restore();
        });

        // =======================
        // RENDERIZAR BOTONES DE TIEMPO (IGUAL QUE TABLEROS)
        // =======================
        const difXTiempo = 285;
        const difYTiempo = -15;

        dibujarTextoCentrado(ctx, 'TIEMPO', W / 2 + difXTiempo, this.selectoresTiempo[0].y + difYTiempo, '18px Orbitron', '#ECF0F1');
        
        this.selectoresTiempo.forEach(s => {
            const seleccionado = (s.indice === this.tiempoSeleccionadoIndex);
            const padding = 10;

            ctx.save();

            // Dibujar imagen de fondo del selector
            if (this.imagenesListas && s.imgFondo) {
                ctx.drawImage(s.imgFondo, s.x, s.y, s.ancho, s.alto);
            } else {
                // Fallback: dibujar rectángulo redondeado
                dibujarRectanguloRedondeado(ctx, s.x, s.y, s.ancho, s.alto, 8);
                ctx.fillStyle = seleccionado ? '#3c4041ea' : '#0e0e0eff';
                ctx.fill();
            }

            // Dibujar imagen del tiempo encima (si existe y es diferente del fondo)
            if (this.imagenesListas && s.img && s.img !== s.imgFondo) {
                this.dibujarImagenCentrada(ctx, s.img, s.x, s.y+5, s.ancho, s.alto, padding);
            }

            // Dibujar borde de selección
            dibujarRectanguloRedondeado(ctx, s.x, s.y, s.ancho, s.alto, 8);
            ctx.strokeStyle = seleccionado ? '#03ff8aff' : '#26272700';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Siempre dibujar el texto encima
          /*   dibujarTextoCentrado(ctx, s.label, s.x + s.ancho / 2, s.y + s.alto / 2, 'bold 14px Arial', '#ECF0F1'); */
            
            ctx.restore();
        });

        // =======================
        // RENDERIZAR BOTÓN COMENZAR
        // =======================
        ctx.save();

        if (this.imagenesListas && this.imgBotonComenzar) {
            // Dibujar imagen directamente sin padding para respetar dimensiones exactas
            ctx.drawImage(
                this.imgBotonComenzar,
                this.botonComenzar.x,
                this.botonComenzar.y,
                this.botonComenzar.ancho,
                this.botonComenzar.alto
            );
        } else {
            // Fallback: dibujar botón con estilo
            dibujarRectanguloRedondeado(ctx, this.botonComenzar.x, this.botonComenzar.y, this.botonComenzar.ancho, this.botonComenzar.alto, 10);
            ctx.fillStyle = '#27AE60';
            ctx.fill();
            ctx.strokeStyle = '#229954';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Siempre dibujar el texto encima
        dibujarTextoCentrado(ctx, 'COMENZAR', this.botonComenzar.x + this.botonComenzar.ancho / 2, (this.botonComenzar.y + this.botonComenzar.alto / 2) + 3, 'bold 19px Orbitron', '#ECF0F1');
        ctx.restore();
    }

    // === Detectores de click ===
    detectarClickTablero(x, y) {
        for (const s of this.selectoresTablero) {
            if (puntoEnRectangulo(x, y, s)) {
                this.tableroSeleccionado = s.tipo;
                return s.tipo;
            }
        }
        return null;
    }

    detectarClickFicha(x, y) {
        for (const s of this.selectoresFicha) {
            if (puntoEnRectangulo(x, y, s)) {
                this.fichaSeleccionada = s.indice;
                return s.indice;
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

    detectarClickComenzar(x, y) {
        return puntoEnRectangulo(x, y, this.botonComenzar);
    }

    // === Auxiliares ===
    obtenerConfiguracion() {
        const presetTiempo = TIME_PRESETS[this.tiempoSeleccionadoIndex];

        console.log('✅ Configuración seleccionada:');
        console.log('  - Índice tiempo:', this.tiempoSeleccionadoIndex);
        console.log('  - Preset completo:', presetTiempo);
        console.log('  - Segundos extraídos:', presetTiempo?.seconds);

        const config = {
            tipoTablero: this.tableroSeleccionado,
            indiceFicha: this.fichaSeleccionada,
            tiempoLimiteSegundos: presetTiempo?.seconds || null
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