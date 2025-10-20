import { COLORES } from "./constans.js";

export class Background {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.particles = [];
    this.createParticles();

    this.intervalId = null; // para controlar la animación
  }

  // Crear partículas
  createParticles() {
    const num = 400;
    this.particles = [];

    for (let i = 0; i < num; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        a: Math.random()
      });
    }
  }

  // Dibujar todas las partículas
  draw() {
    const ctx = this.ctx;

    // Fondo semitransparente
    ctx.fillStyle = COLORES.fondoEspacial;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Partículas
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Bucle de partículas dentro del canvas
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Inicia la animación usando setInterval
  start(fps = 60) {
    if (this.intervalId) return; // ya está corriendo

    const intervalo = 1000 / fps; // tiempo entre frames
    this.intervalId = setInterval(() => {
      this.draw();
    }, intervalo);
  }

  // Detiene la animación
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
