/* // ============================================
// BACKGROUNDPEG.JS - Fondo animado del juego
// ============================================

class Nodo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class LineaCircuito {
  constructor(inicio, fin, grosor = 1.2, color = "#083a16") {
    this.inicio = inicio;
    this.fin = fin;
    this.grosor = grosor;
    this.color = color;
    this.camino = this.generarCamino();
    this.progresoPulso = Math.random();
    this.velocidadPulso = 0.002 + Math.random() * 0.005;
  }

  generarCamino() {
    const puntos = [];
    puntos.push({ x: this.inicio.x, y: this.inicio.y });

    const numSegmentos = 3 + Math.floor(Math.random() * 2);
    let x = this.inicio.x;
    let y = this.inicio.y;
    let angulo = (Math.floor(Math.random() * 8) * 45) * Math.PI / 180;

    for (let i = 0; i < numSegmentos; i++) {
      const longitud = 40 + Math.random() * 120;
      x += Math.cos(angulo) * longitud;
      y += Math.sin(angulo) * longitud;
      puntos.push({ x, y });

      if (Math.random() < 0.8) {
        const opciones = [Math.PI / 4, -Math.PI / 4, Math.PI / 2, -Math.PI / 2];
        angulo += opciones[Math.floor(Math.random() * opciones.length)];
      }
    }

    puntos.push({ x: this.fin.x, y: this.fin.y });
    return puntos;
  }

  dibujar(ctx) {
    ctx.beginPath();
    ctx.lineWidth = this.grosor;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.camino[0].x, this.camino[0].y);
    for (let i = 1; i < this.camino.length; i++) {
      ctx.lineTo(this.camino[i].x, this.camino[i].y);
    }
    ctx.stroke();
  }

  dibujarPulso(ctx, delta) {
    this.progresoPulso += this.velocidadPulso * delta * 0.05;
    if (this.progresoPulso > 1) this.progresoPulso = 0;

    const totalSegmentos = this.camino.length - 1;
    const segIndex = Math.floor(this.progresoPulso * totalSegmentos);
    const t = (this.progresoPulso * totalSegmentos) % 1;

    const a = this.camino[segIndex];
    const b = this.camino[segIndex + 1] || this.fin;

    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, 6);
    grad.addColorStop(0, "#00ff66");
    grad.addColorStop(0.5, "#00ffaa");
    grad.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class BackgroundPeg {
  constructor(ctx, width, height,cleanArea) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.cleanArea = cleanArea ; 

    this.nodos = [];
    this.lineas = [];
    this.animando = false;
    this.tiempoPrevio = 0;

    // Buffer con el fondo estático
    this.buffer = document.createElement("canvas");
    this.buffer.width = width;
    this.buffer.height = height;
    this.bctx = this.buffer.getContext("2d");

    this.generarCircuito();
    this.dibujarFondo();
  }

  generarCircuito() {
    const ancho = this.width;
    const alto = this.height;
    const numNodos = 50;

    this.nodos = Array.from({ length: numNodos }, () =>
      new Nodo(Math.random() * ancho, Math.random() * alto)
    );

    const lado = Math.min(ancho, alto) * 0.4;
    this.zonaExclusion = {
      x: (ancho - lado) / 2,
      y: (alto - lado) / 2,
      ancho: lado,
      alto: lado,
    };

    const numLineasBase = 6 + Math.floor(Math.random() * 3);
    const lineasBase = [];

    for (let i = 0; i < numLineasBase; i++) {
      const a = this.nodos[Math.floor(Math.random() * numNodos)];
      const b = this.nodos[Math.floor(Math.random() * numNodos)];
      if (a !== b) {
        const linea = new LineaCircuito(a, b, 1.2);
        if (!this.lineaTocaZona(linea, this.zonaExclusion)) {
          lineasBase.push(linea);
        }
      }
    }

    this.lineas = [...lineasBase];

    // Clonar con desplazamientos
    for (const base of lineasBase) {
      const repeticiones = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < repeticiones; i++) {
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        const grosorExtra = Math.random() * 1.5;

        const nueva = this.clonarLinea(base, offsetX, offsetY, grosorExtra);
        if (!this.lineaTocaZona(nueva, this.zonaExclusion)) {
          this.lineas.push(nueva);
        }
      }
    }
  }

  clonarLinea(lineaBase, offsetX = 0, offsetY = 0, grosorExtra = 0) {
    const nuevoInicio = new Nodo(
      lineaBase.inicio.x + offsetX,
      lineaBase.inicio.y + offsetY
    );
    const nuevoFin = new Nodo(
      lineaBase.fin.x + offsetX,
      lineaBase.fin.y + offsetY
    );

    const nueva = new LineaCircuito(
      nuevoInicio,
      nuevoFin,
      lineaBase.grosor + grosorExtra,
      lineaBase.color
    );

    nueva.camino = lineaBase.camino.map(p => ({
      x: p.x + offsetX,
      y: p.y + offsetY,
    }));

    return nueva;
  }

  lineaTocaZona(linea, zona) {
    return linea.camino.some(
      (p) =>
        p.x > zona.x &&
        p.x < zona.x + zona.ancho &&
        p.y > zona.y &&
        p.y < zona.y + zona.alto
    );
  }

  dibujarFondo() {
    const ctx = this.bctx;
    ctx.fillStyle = "#02040A";
    ctx.fillRect(0, 0, this.width, this.height);

    for (const linea of this.lineas) {
      linea.dibujar(ctx);
    }

    for (const nodo of this.nodos) {
      if (
        nodo.x < this.zonaExclusion.x ||
        nodo.x > this.zonaExclusion.x + this.zonaExclusion.ancho ||
        nodo.y < this.zonaExclusion.y ||
        nodo.y > this.zonaExclusion.y + this.zonaExclusion.alto
      ) {
        ctx.beginPath();
        ctx.arc(nodo.x, nodo.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#0f0";
        ctx.fill();
      }
    }
  }

  dibujar(delta = 16) {
    // Dibuja el fondo base
    this.ctx.drawImage(this.buffer, 0, 0);

    // Encima, los pulsos animados
    for (const linea of this.lineas) {
      linea.dibujarPulso(this.ctx, delta);
    }
  }

  iniciar() {
    if (this.animando) return;
    this.animando = true;
    this.tiempoPrevio = performance.now();

    const loop = (tiempoActual) => {
      if (!this.animando) return;
      const delta = tiempoActual - this.tiempoPrevio;
      this.tiempoPrevio = tiempoActual;

      this.dibujar(delta);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  detener() {
    this.animando = false;
  }
}
 */


// ============================================
// BACKGROUNDMATRIX.JS - Fondo estilo Matrix
// ============================================

export class BackgroundPeg {
  constructor(ctx, width, height, cleanArea) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.cleanArea = cleanArea;

    this.chars = "01";
    this.fontSize = 16;
    this.columns = Math.floor(width / this.fontSize);

    // Cada columna tiene una "y" inicial aleatoria
    this.drops = Array.from({ length: this.columns }, () => Math.random() * height);

    this.animando = false;
    this.tiempoPrevio = 0;
  }

  dibujar(delta = 16) {
    const ctx = this.ctx;

    // Fondo semi-transparente para efecto de "rastro"
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = "#00FF66";
    ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.columns; i++) {
      const char = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Evitar dibujar dentro del área limpia
      if (
        !this.cleanArea ||
        x < this.cleanArea.x ||
        x > this.cleanArea.x + this.cleanArea.ancho ||
        y < this.cleanArea.y ||
        y > this.cleanArea.y + this.cleanArea.alto
      ) {
        ctx.fillText(char, x, y);
      }

      // Reiniciar columna cuando sale de pantalla
      if (y > this.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      } else {
        this.drops[i] += 0.5;
      }
    }
  }

  iniciar() {
    if (this.animando) return;
    this.animando = true;
    this.tiempoPrevio = performance.now();

    const loop = (tiempoActual) => {
      if (!this.animando) return;
      const delta = tiempoActual - this.tiempoPrevio;
      this.tiempoPrevio = tiempoActual;

      this.dibujar(delta);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  detener() {
    this.animando = false;
  }
}
