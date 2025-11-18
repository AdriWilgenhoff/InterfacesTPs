


/* el codigo de la taradaaaaa estupida */

let state = 'start';

/* let states = ['start','playing','gameOver'] */

let divJuego = document.querySelector('#gameFlappy');

let pantallaInicio = document.querySelector('#initScreenFlappy');
let pantallaJuego = document.querySelector('#playingScreenFlappy');
let pantallaFin = document.querySelector('#gameOverFlappy');
let background = document.querySelector('#backgroundFlappy');

let buttonStart = document.querySelector('#startButton');
let buttonRestart = document.querySelector('#reStartButton');
let buttonNext = document.querySelector('#nextButton');


function changeState(newState) {
    state = newState;

    // Limpiar todas las clases de las pantallas
    pantallaInicio.classList.remove('showScreen', 'hideScreen');
    pantallaJuego.classList.remove('showScreen', 'hideScreen');
    pantallaFin.classList.remove('showScreen', 'hideScreen');

    switch (state) {
        case 'start':
            pantallaInicio.classList.add('showScreen');
            pantallaJuego.classList.add('hideScreen');
            pantallaFin.classList.add('hideScreen');
            // Detener el background
            background.classList.remove('bg-active');
            break;
        case 'playing':
            pantallaInicio.classList.add('hideScreen');
            pantallaJuego.classList.add('showScreen');
            pantallaFin.classList.add('hideScreen');
            // Activar el background parallax
            background.classList.add('bg-active');
            break;
        case 'gameOver':
            pantallaInicio.classList.add('hideScreen');
            pantallaJuego.classList.add('hideScreen');
            pantallaFin.classList.add('showScreen');
            // Detener el background
            background.classList.remove('bg-active');
            break;
        default:
            state = 'start';
            break;
    }
}

/*eventos de botones de estado*/

buttonStart.addEventListener('click', () => {
    changeState('playing')
    startGame();
    /* acá estan todos los eventos que desencadena el cambio de estado */
});


buttonNext.addEventListener('click', () => { changeState('gameOver') });


buttonRestart.addEventListener('click', () => { changeState('start') });

// Inicializar el estado al cargar la página
changeState('start');

/********* funciones y variables del juego *************/
/* startGame(){

} */




const dragonElement = document.querySelector('#dragonPlayer');
const obstaclesContainer = document.querySelector('#pipes-container');
const coinsContainer = document.querySelector('#coins-container');
const powerupsContainer = document.querySelector('#powerups-container');
const currentScoreEl = document.querySelector('#current-score');
const finalScoreEl = document.querySelector('#final-score span');
const finalHighScoreEl = document.querySelector('#final-high-score span');
const powerupIndicatorsEl = document.querySelector('#powerup-indicators');

//DATOS DE PANTALLA 

const SCREEN_WIDTH = pantallaJuego.width;
const SCREEN_HEIGHT = pantallaJuego.height;

//FISICA DEL PATADROGON XD
let player_width = 34;
let player_heigth = 24;
let playerPosY = SCREEN_HEIGHT / 2;
let playerPosX = SCREEN_WIDTH / 8



let player = {
    x: playerPosX,
    y: playerPosY,
    width: player_width,
    height: player_heigth
}


// obstaculos 
let obstacles = [];
const OBS_WIDTH = 64;
const OBS_HEIGHT = 512;
let OBS_GAP = 180;
let obsPosX = SCREEN_WIDTH;
let obsPosY = 0;
lastObstacleSpawned = 0 ;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let JUMP_FORCE = 0; 
const GRAVITY_FORCE = 0.4;

//Puntuacion
let gameOver = false;
let score = 0;


//Coleccionables
let coins = [];
let powerups = [];
const COIN_SIZE = 40;
const POWERUP_SIZE = 45;
const COIN_SPAWN_CHANCE = 0.6; // 60% de probabilidad
const POWERUP_SPAWN_CHANCE = 0.15; // 15% de probabilidad

// Power-ups activos
let activePowerups = {
    shield: false,
    slow: false,
    boost: false
};

// Control del juego
let gameLoopId = null;
let lastTime = 0;


function startGame() {

    // Resetear variables
    playerPosY = BOARD_HEIGHT / 2;
    JUMP_FORCE = 0;
    obstacles = [];
    coins = [];
    powerups = [];
    score = 0;
    velocityX = -2;
    OBS_GAP = 180;
    lastObstacleSpawned = 0;
    activePowerups = { shield: false, slow: false, boost: false };

    // Limpiar contenedores
    obstaclesContainer.innerHTML = '';
    coinsContainer.innerHTML = '';
    powerupsContainer.innerHTML = '';
    powerupIndicatorsEl.innerHTML = '';

    // Actualizar UI
    updateScoreDisplay();

    // Iniciar game loop
    lastTime = performance.now();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function resetGame() {
    // Cancelar game loop
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }

    // Guardar high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyHighScore', highScore);
    }

    // Actualizar stats de game over
    finalScoreEl.textContent = score;
    finalHighScoreEl.textContent = highScore;
}



/* funciones de dragon */ 

function updateDragon(){
     // Aplicar gravedad
    dragonVelocityY += GRAVITY;
    dragonY += dragonVelocityY;

    // Límites
    if (dragonY < 0) {
        dragonY = 0;
        triggerGameOver();
    }
    if (dragonY > BOARD_HEIGHT - DRAGON_SIZE) {
        dragonY = BOARD_HEIGHT - DRAGON_SIZE;
        triggerGameOver();
    }

    // Actualizar posición visual
    dragonElement.style.top = dragonY + 'px';}

function jump()
{if (state === 'playing') {
        dragonVelocityY = JUMP_FORCE;
    }}

/* --- CONTROLES CORREGIDOS --- */

// Click en cualquier parte del área jugable
pantallaJuego.addEventListener('click', () => {
    if (state === 'playing') {
        jump();
    }
});

// Tecla X para saltar
document.addEventListener('keydown', (e) => {
    if (state === 'playing' && (e.code === 'KeyX' || e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        jump();
    }
});
/* -------------------------------- */


/* obstaculos */ 

function spawnObstacle(){}

function updateObstacles(deltaTime){

}

/*colleccionables*/

function spawnCollectibles(x, centerY){}

function spawnCoin(x,y){}

function spawnPowerUp(x,y,type){}

function updateCollectibles(){}



