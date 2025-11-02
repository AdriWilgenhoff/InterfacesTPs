// Rutas de imágenes de fichas de insectos
export const BUG_IMAGES = [
  '../assets_game/peg/bugs/ficha1.png',
  '../assets_game/peg/bugs/ficha2.png',
  '../assets_game/peg/bugs/ficha3.png',
  '../assets_game/peg/bugs/ficha4.png',
];

export const BOARDS = {
  Clasico: [
    [-1,-1, 1, 1, 1,-1,-1],
    [-1,-1, 1, 1, 1,-1,-1],
    [ 1, 1, 1, 1, 1, 1, 1],
    [ 1, 1, 1, 0, 1, 1, 1],
    [ 1, 1, 1, 1, 1, 1, 1],
    [-1,-1, 1, 1, 1,-1,-1],
    [-1,-1, 1, 1, 1,-1,-1],
  ],
  Europeo: [
    [-1, 1, 1, 1, 1, 1,-1],
    [ 1, 1, 1, 1, 1, 1, 1],
    [ 1, 1, 1, 1, 1, 1, 1],
    [ 1, 1, 1, 0, 1, 1, 1],
    [ 1, 1, 1, 1, 1, 1, 1],
    [ 1, 1, 1, 1, 1, 1, 1],
    [-1, 1, 1, 1, 1, 1,-1],
  ],
  /*Cuadrado: [
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
  ],*/
  Diamante: [
    [-1,-1,-1,1,-1,-1,-1],
    [-1,-1,1,1,1,-1,-1],
    [-1,1,1,1,1,1,-1],
    [ 1,1,1,0,1,1, 1],
    [-1,1,1,1,1,1,-1],
    [-1,-1,1,1,1,-1,-1],
    [-1,-1,-1,1,-1,-1,-1],
  ],
  TestWin: [
    [-1,-1, 0, 0, 0,-1,-1],
    [-1,-1, 0, 0, 0,-1,-1],
    [ 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 1, 1, 0],
    [ 0, 0, 0, 0, 0, 0, 0],
    [-1,-1, 0, 0, 0,-1,-1],
    [-1,-1, 0, 0, 0,-1,-1],
  ],
  TestFail: [
    [-1,-1, 0, 0, 0,-1,-1],
    [-1,-1, 0, 0, 0,-1,-1],
    [ 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 1, 1, 1, 0],
    [ 0, 0, 0, 0, 0, 0, 0],
    [-1,-1, 0, 0, 0,-1,-1],
    [-1,-1, 0, 0, 0,-1,-1],
  ],
};

export const BOARD_THUMB_URLS = {
  Clasico:   '../assets_game/peg/boards/classic.png',
  Europeo:   '../assets_game/peg/boards/european.png',
  Cuadrado:  '../assets_game/peg/boards/square49.png',
  Diamante:  '../assets_game/peg/boards/diamond.png',
  TestWin:   '../assets_game/peg/boards/testwin.png',
  TestFail:  '../assets_game/peg/boards/testfail.png',
};

export const SOUNDS = {
  move:  '../assets_game/peg/sounds/movimiento_success.mp3',
  win:   '../assets_game/peg/sounds/movimiento_success.mp3',
  lose:  '../assets_game/peg/sounds/movimiento_error.mp3',
  error: '../assets_game/peg/sounds/movimiento_error.mp3',
};

// Imágenes del menú
export const MENU_ASSETS = {
  /* background: '../assets_game/peg/menu/background2.png', */
  startBtn:   '../assets_game/peg/menu/boton_comenzar.png',
  fuente:'',
};

// Presets de tiempo
export const TIME_PRESETS = [
  { key: 'none', label: 'Sin timer', seconds: null },
  { key: '1m',   label: '1 min',     seconds: 1 * 60 },
  { key: '5m',   label: '5 min',     seconds: 5 * 60 },
  { key: '10m',  label: '10 min',    seconds: 10 * 60 },
  { key: '15m',  label: '15 min',    seconds: 15 * 60 },
];
