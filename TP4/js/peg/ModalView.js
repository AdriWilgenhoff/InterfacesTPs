import { dibujarTextoCentrado, dibujarRectanguloRedondeado, puntoEnRectangulo, formatearTiempo, cargarImagenes } from './utils.js';

export class ModalView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.visible = false;
        this.tipoModal = '';
        this.tiempo = 0;
        this.movimientos = 0;
        this.fichasRestantes = 0;

        this.botonMenu = null;
        this.botonReintentar = null;

        this.urlImgFondoModal = '../assets_game/peg/modal/fondo_modal.png';
        this.urlImgBotonMenu = '../assets_game/peg/modal/hud8 (3) (1).png';
        this.urlImgBotonReintentar = '../assets_game/peg/modal/hud8.png';

        this.imgFondoModal = null;
        this.imgBotonMenu = null;
        this.imgBotonReintentar = null;

        this.imagenesListas = false;

        this.motivoDerrota = 'sin_movimientos';

        this.precargarImagenes();
    }

    async precargarImagenes() {
        try {
            const imagenes = await cargarImagenes([
                this.urlImgFondoModal,
                this.urlImgBotonMenu,
                this.urlImgBotonReintentar
            ]);

            this.imgFondoModal = imagenes[0];
            this.imgBotonMenu = imagenes[1];
            this.imgBotonReintentar = imagenes[2];

            this.imagenesListas = true;
            console.log('✓ Imágenes del modal cargadas correctamente');
        } catch (error) {
            console.error('Error al precargar imágenes del modal:', error);
            this.imagenesListas = true;
        }
    }

    mostrarVictoria(tiempo, movimientos, fichasRestantes) {
        this.visible = true;
        this.tipoModal = 'victoria';
        this.tiempo = tiempo;
        this.movimientos = movimientos;
        this.fichasRestantes = fichasRestantes;
        this.inicializarBotonesWin();
    }

    mostrarDerrota(tiempo, movimientos, fichasRestantes, motivo = 'sin_movimientos') {
        this.visible = true;
        this.tipoModal = 'derrota';
        this.tiempo = tiempo;
        this.movimientos = movimientos;
        this.fichasRestantes = fichasRestantes;
        this.motivoDerrota = motivo;
        this.inicializarBotonesFail();
    }

    ocultar() {
        this.visible = false;
    }

    inicializarBotonesFail() {
        const centroX = this.canvas.width / 2;
        const centroY = this.canvas.height / 2;

        this.botonMenu = {
            x: centroX - 180,
            y: centroY + 60,
            ancho: 180,
            alto: 50
        };

        this.botonReintentar = {
            x: centroX + 30,
            y: centroY + 60,
            ancho: 180,
            alto: 50
        };
    }

    inicializarBotonesWin() {
        const centroX = this.canvas.width / 2;
        const centroY = this.canvas.height / 2;

        this.botonMenu = {
            x: centroX - 75,
            y: centroY + 55,
            ancho: 150,
            alto: 50
        };
    }

    renderizar() {
        if (!this.visible) return;

        const centroX = this.canvas.width / 2;
        const centroY = this.canvas.height / 2;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const modalAncho = 650;
        const modalAlto = 390;
        const modalX = (centroX - modalAncho / 2) + 5;
        const modalY = centroY - modalAlto / 2;

        if (this.imagenesListas && this.imgFondoModal) {
            this.ctx.drawImage(this.imgFondoModal, modalX, modalY, modalAncho, modalAlto);
        } else {
            this.ctx.save();
            dibujarRectanguloRedondeado(this.ctx, modalX, modalY, modalAncho, modalAlto, 15);
            this.ctx.fillStyle = '#ECF0F1';
            this.ctx.fill();
            this.ctx.strokeStyle = '#34495E';
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
            this.ctx.restore();
        }

        const esVictoria = this.tipoModal === 'victoria';
        const titulo = esVictoria ? '¡VICTORIA!' : 'DERROTA';
        const colorTitulo = esVictoria ? '#2a794bff' : '#b62313ff';

        dibujarTextoCentrado(this.ctx, titulo, centroX, centroY - 80, 'bold 36px Orbitron', colorTitulo);

        const inicioEstadisticas = centroY - 25;
        this.ctx.fillStyle = '#9ca7b3ff';
        this.ctx.font = 'bold 18px Inter';
        this.ctx.textAlign = 'center';


        if (this.tipoModal === 'derrota') {
            if (this.motivoDerrota === 'tiempo') {
                this.ctx.fillText('¡Se acabó el tiempo!', centroX, inicioEstadisticas+10);
            } else {
                this.ctx.fillText('¡No quedan movimientos posibles!', centroX, inicioEstadisticas+10);
            }
        } else {
                this.ctx.fillText('Tiempo: ' + formatearTiempo(this.tiempo), centroX, inicioEstadisticas+10);
            }

        this.ctx.fillText('Fichas restantes: ' + this.fichasRestantes, centroX, inicioEstadisticas + 40);


        if (this.imagenesListas && this.imgBotonMenu) {
            this.ctx.drawImage(this.imgBotonMenu, this.botonMenu.x, this.botonMenu.y, this.botonMenu.ancho, this.botonMenu.alto);
        } else {
            this.ctx.save();
            dibujarRectanguloRedondeado(this.ctx, this.botonMenu.x, this.botonMenu.y, this.botonMenu.ancho, this.botonMenu.alto, 8);
            this.ctx.fillStyle = '#3498DB';
            this.ctx.fill();
            this.ctx.strokeStyle = '#2980B9';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            this.ctx.restore();
        }

        dibujarTextoCentrado(
            this.ctx,
            'MENÚ',
            this.botonMenu.x + this.botonMenu.ancho / 2,
            this.botonMenu.y + this.botonMenu.alto / 2 ,
            'bold 18px Orbitron',
            '#FFFFFF'
        );

        if (this.tipoModal === 'derrota') {
            if (this.imagenesListas && this.imgBotonReintentar) {
                this.ctx.drawImage(this.imgBotonReintentar, this.botonReintentar.x, this.botonReintentar.y, this.botonReintentar.ancho, this.botonReintentar.alto);
            } else {
                this.ctx.save();
                dibujarRectanguloRedondeado(this.ctx, this.botonReintentar.x, this.botonReintentar.y, this.botonReintentar.ancho, this.botonReintentar.alto, 8);
                this.ctx.fillStyle = '#27AE60';
                this.ctx.fill();
                this.ctx.strokeStyle = '#229954';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
                this.ctx.restore();
            }

            dibujarTextoCentrado(
                this.ctx,
                'REINTENTAR',
                this.botonReintentar.x + this.botonReintentar.ancho / 2,
                this.botonReintentar.y + this.botonReintentar.alto / 2 ,
                'bold 18px Orbitron',
                '#FFFFFF'
            );
        }

        this.ctx.textAlign = 'start';
    }

    detectarClickBoton(x, y) {
        if (!this.visible) return null;
        if (this.botonMenu && puntoEnRectangulo(x, y, this.botonMenu)) return 'menu';
        if (this.botonReintentar && puntoEnRectangulo(x, y, this.botonReintentar)) return 'reintentar';
        return null;
    }

    estaVisible() {
        return this.visible;
    }

    estanImagenesListas() {
        return this.imagenesListas;
    }
}
