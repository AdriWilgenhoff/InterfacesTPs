// ============================================
// HUDVIEW.JS - Vista del HUD (Head-Up Display)
// ============================================

import { dibujarTextoCentrado, dibujarRectanguloRedondeado, puntoEnRectangulo, formatearTiempo, cargarImagen } from './utils.js';

export class HudView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.movimientos = 0;
    this.fichasRestantes = 0;

    const BTN = 60;
    const GAP = 10;
    const MARGIN = 15;
    const topY = 20;

    const rightX = this.canvas.width - MARGIN - BTN;

    this.botonMute = { 
      x: rightX,
      y: topY,
      ancho: BTN,
      alto: BTN
    };
    this.botonHome = {
      x: rightX - (BTN + GAP),
      y: topY,
      ancho: BTN,
      alto: BTN
    };
    this.botonReiniciar = {
      x: rightX - 2 * (BTN + GAP),
      y: topY,
      ancho: BTN,
      alto: BTN
    };

    // URLs de imágenes
    this.urlImg1 = '../assets_game/peg/hud/hud8 (3) (1).png';
    this.urlImg3 = '../assets_game/peg/hud/hud8 (3).png';
    this.urlImg5 = '../assets_game/peg/hud/hud8 (3).png';

    this.imagenHud1 = null;
    this.imagenHud3 = null;
    this.imagenBotonCuadrado = null;

    this.imagenesCargadas = false;

    // Cargar imágenes
    this.cargarImagenes();
  }

  async cargarImagenes() {
    try {
      this.imagenHud1 = await cargarImagen(this.urlImg1);
      this.imagenHud3 = await cargarImagen(this.urlImg3);
      this.imagenBotonCuadrado = await cargarImagen(this.urlImg5);
      this.imagenesCargadas = true;
    } catch (error) {
      console.warn('No se cargaron las imágenes del HUD', error);
      this.imagenesCargadas = false;
    }
  }

  actualizarMovimientos(cantidad) {
    this.movimientos = cantidad;
  }

  actualizarFichasRestantes(cantidad) {
    this.fichasRestantes = cantidad;
  }

  dibujarBotonHud(x, y, size, emoji) {
    const ctx = this.ctx;
    ctx.save();

    if (this.imagenesCargadas && this.imagenBotonCuadrado) {
      ctx.drawImage(this.imagenBotonCuadrado, x, y, size, size);
    } else {
      ctx.fillStyle = '#404447da';
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = '#0d0e0fff';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, size, size);
    }

    ctx.font = 'bold 28px inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f2E0dc';
    ctx.fillText(emoji, x + size / 2, y + size / 2);

    ctx.restore();
  }

  renderizar(tiempoActual, tiempoLimite, audioMuteado = false) {
    const ctx = this.ctx;
    const margen = 20;
    const espacioEntreBoxes = 15;
    let yPos = margen;

    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // ==== BOX: TIEMPO ====
    const altoBoxTiempo = 110;

    if (this.imagenesCargadas && this.imagenHud1) {
      ctx.drawImage(this.imagenHud1, margen - 10, yPos - 5, 200, altoBoxTiempo);
    } else {
      ctx.fillStyle = '#f2E0dc';
      ctx.fillRect(margen - 10, yPos, 200, altoBoxTiempo);
    }

    ctx.font = '16px inter';
    if (tiempoLimite !== null) {
      const tiempoRestante = tiempoLimite - tiempoActual;
      if (tiempoRestante <= 10) {
        ctx.fillStyle = '#ff4444';
      } else if (tiempoRestante <= 30) {
        ctx.fillStyle = '#ffaa44';
      } else {
        ctx.fillStyle = '#44ff44';
      }
    } else {
      ctx.fillStyle = '#f2E0dc';
    }

    ctx.fillText(`⏱️ Tiempo: ${formatearTiempo(tiempoActual)}`, margen + 15, yPos + 30);

    ctx.font = '16px inter';
    ctx.fillStyle = '#f2E0dc';
    if (tiempoLimite !== null) {
      ctx.fillText(`Tiempo límite: ${formatearTiempo(tiempoLimite)}`, margen + 10, yPos + 62);
    } else {
      ctx.fillText('Sin tiempo límite', margen + 20, yPos + 62);
    }

    yPos += altoBoxTiempo + espacioEntreBoxes;

    // ==== BOX 2: MOVIMIENTOS ====
    /*if (this.imagenesCargadas && this.imagenHud3) {
      ctx.drawImage(this.imagenHud3, margen - 10, yPos - 3, 200, 45);
    } else {
      ctx.fillStyle = '#04111fff';
      ctx.fillRect(margen - 10, yPos, 200, 40);
    }
    ctx.font = '16px inter';
    ctx.fillStyle = '#dadadacc';
    ctx.fillText(`🔄 Movimientos: ${this.movimientos}`, margen + 5, yPos + 12);
    yPos += 40 + espacioEntreBoxes;*/

    // ==== BOX: FICHAS RESTANTES ====
    if (this.imagenesCargadas && this.imagenHud3) {
      ctx.drawImage(this.imagenHud3, margen - 10, yPos - 3, 200, 45);
    } else {
      ctx.fillStyle = 'f2E0dc';
      ctx.fillRect(margen - 10, yPos, 200, 40);
    }

    ctx.font = '16px inter';
    ctx.fillStyle = '#f2E0dc';
    ctx.fillText('🐞 Fichas: ', margen + 15, yPos + 12);

    const anchoTexto = ctx.measureText('🪙 Fichas:  ').width;
    ctx.fillText(String(this.fichasRestantes), margen + anchoTexto+15, yPos + 12);

    // ==== BOTONES HUD ====
    const emojiMute = audioMuteado ? '🔇' : '🔊';
    this.dibujarBotonHud(this.botonReiniciar.x, this.botonReiniciar.y, this.botonReiniciar.ancho, '⭯');
    this.dibujarBotonHud(this.botonHome.x, this.botonHome.y, this.botonHome.ancho, '🏠');
    this.dibujarBotonHud(this.botonMute.x, this.botonMute.y, this.botonMute.ancho, emojiMute);
    ctx.restore();
  }

  detectarClickBoton(x, y) {
    console.log('Detectando click en HUD:', x, y);
    console.log('Botón Home:', this.botonHome);
    console.log('Botón Reiniciar:', this.botonReiniciar);
    console.log('Botón Mute:', this.botonMute);
    
    if (puntoEnRectangulo(x, y, this.botonHome)) {
      console.log('✓ Click en Home');
      return 'home';
    }
    if (puntoEnRectangulo(x, y, this.botonReiniciar)) {
      console.log('✓ Click en Reiniciar');
      return 'reiniciar';
    }
    if (puntoEnRectangulo(x, y, this.botonMute)) {
      console.log('✓ Click en Mute');
      return 'mute';
    }
    
    console.log('✗ No se detectó click en ningún botón');
    return null;
  }

  reiniciar() {
    this.movimientos = 0;
    this.fichasRestantes = 0;
  }
}