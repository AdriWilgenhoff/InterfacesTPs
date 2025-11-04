export class BackgroundPeg {
  constructor(ctx, width, height, cleanArea) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.cleanArea = cleanArea;

    this.fontSize = 16;
    this.columns = Math.floor(width / this.fontSize);

    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
    }

    this.animando = false;
  }

  dibujar() {
    const ctx = this.ctx;

    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = "rgba(67, 122, 104, 1)";
    ctx.font = `${this.fontSize}px monospace`;
    ctx.textBaseline = 'top';

    for (let i = 0; i < this.columns; i++) {
      const char = Math.random() > 0.5 ? '0' : '1';

      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      const dentroAreaLimpia = this.cleanArea &&
        x >= this.cleanArea.x &&
        x <= this.cleanArea.x + this.cleanArea.ancho &&
        y >= this.cleanArea.y &&
        y <= this.cleanArea.y + this.cleanArea.alto;

      if (!dentroAreaLimpia) {
        ctx.fillText(char, x, y);
      }

      this.drops[i]++;

      if (y > this.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
    }
  }

  iniciar(fps = 24) {
    if (this.intervalId) return;
    const intervalo = 1000 / fps;
    this.intervalId = setInterval(() => {
      this.dibujar();
    }, intervalo);
  }

  detener() {
    this.animando = false;
  }

  limpiar() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
}