export const BUG_IMAGES = [
  '../assets_game/peg/bugs/52.3.png',
  '../assets_game/peg/bugs/50.3.png',
  '../assets_game/peg/bugs/51.3.png',
  '../assets_game/peg/bugs/53.2.png',
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
  Cuadrado: [
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
  ],
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
  Cuadrado:  '../assets_game/peg/boards/cuadrado.png',
  Diamante:  '../assets_game/peg/boards/diamond.png',
  TestWin:   '../assets_game/peg/boards/testwin.png',
  TestFail:  '../assets_game/peg/boards/testfail.png',
};

export const SOUNDS = {
  move:  '../assets_game/peg/sounds/movimiento_success.mp3',
  win:   '../assets_game/peg/sounds/win.mp3',
  lose:  '../assets_game/peg/sounds/lose.mp3',
  error: '../assets_game/peg/sounds/movimiento_error.mp3',
};

export const MENU_IMAGES = {
  background: '../assets_game/peg/menu/background133.png',
  buttonFrame: '../assets_game/peg/menu/hud8 (3) (1).png',
  timerIcons: [
    '../assets_game/peg/menu/prueba.png',
    '../assets_game/peg/menu/timer01.png',
    '../assets_game/peg/menu/timer5.png',
    '../assets_game/peg/menu/timer10.png',
    '../assets_game/peg/menu/timer15.png',
    '../assets_game/peg/menu/timer20.png'
  ]
};

export const TIME_PRESETS = [
  { key: 'none', label: 'Sin timer', seconds: null },
  { key: '1m',   label: '1 min',     seconds: 60 },
  { key: '5m',   label: '5 min',     seconds: 300 },
  { key: '10m',  label: '10 min',    seconds: 600 },
  { key: '15m',  label: '15 min',    seconds: 900 },
  { key: '20m',  label: '20 min',    seconds: 1200 },
];