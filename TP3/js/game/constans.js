// Imágenes
export const IMAGES = [
  '../assets_game/images/image1.jpg',
  '../assets_game/images/image2.png',
  '../assets_game/images/image3.png',
  '../assets_game/images/image4.png',
  '../assets_game/images/image5.png',
  '../assets_game/images/image6.png',
  '../assets_game/images/image7.png',
  '../assets_game/images/image8.png'
];

// Sonidos
export const SOUNDS = {
  movimiento: '../assets_game/sounds/move.mp3',
  nivelCompletado: '../assets_game/sounds/level-complete.mp3',
  nivelFallido: '../assets_game/sounds/level-failed.mp3',
  juegoCompletado: '../assets_game/sounds/game-complete.mp3',
  ayudita: '../assets_game/sounds/help.mp3'
};


// === Colores del juego ===
export const COLORES = {
  // Colores de texto
  textoPrimario: '#e4e4e4',
  textoSecundario: '#aaaaaa',
  textoOscuro: '#333333',

  bordeBloqueado: '#88ff88',
  
  bordePieza: '#333333',
  juegoTerminado: '#FFD700',

  // Colores de botones
  botonPrimario: '#4CAF50',
  botonPrimarioBorde: '#2E7D32',
  botonSecundario: '#2196F3',
  botonSecundarioBorde: '#1565C0',
  botonPeligro: '#f44336',
  botonPeligroBorde: '#c62828',
  botonAyuda: '#9C27B0',
  botonAyudaBorde: '#6A1B9A',
  botonIcono: '#2c3e50',
  botonIconoBorde: '#34495e',


  // Colores de dificultad
  dificultadFacil: '#44ff44',
  dificultadMedio: '#ffff44',
  dificultadDificil: '#ffaa44',
  dificultadExtremo: '#ff4444',

  // Colores de timer
  timerNormal: '#44ff44',
  timerAdvertencia: '#ffaa44',
  timerUrgente: '#ff4444',
  timerCountup: '#4499ff',

  // Colores de fondo
  fondoOscuro: '#1a1a1a',
  fondoTransparente: 'rgba(0, 0, 0, 0.9)',

  fondoPantalla: '#12141c',
  fondoModal: '#2c3e50',

  // Degradados (para pantalla inicial)
  degradado: {
    color1: { r: 10, g: 15, b: 35 },
    color2: { r: 25, g: 42, b: 86 },
    color3: { r: 44, g: 62, b: 80 }
  }
};

// === Tipografía ===
export const FUENTES = {
  tituloGrande: 'bold 80px Roboto',
  tituloPequeño: 'bold 40px Roboto',
  subtitulo: 'bold 32px Roboto',
  botonGrande: 'bold 32px Roboto',
  botonMedio: 'bold 24px Roboto',
  botonPequeño: 'bold 20px Roboto',
  textoGrande: 'bold 28px Roboto',
  textoMedio: 'bold 24px Roboto',
  textoNormal: '20px Roboto',
  textoPequeño: '18px Roboto',
  hud: 'bold 20px Roboto',
  hudGrande: 'bold 28px Roboto'
};
