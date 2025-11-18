

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


function changeState(newState){
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
   /*  startGame(); */ startGame();
    /* acá estan todos los eventos que desencadena el cambio de estado */
    
}); 


buttonNext.addEventListener('click', () => { changeState('gameOver') }); 


buttonRestart.addEventListener('click', () => { changeState('start') });

// Inicializar el estado al cargar la página
changeState('start');

/* variables del juego y */





// Elementos DOM
const dragonElement = document.querySelector('#dragonPlayer');
const pipesContainer = document.querySelector('#pipes-container');
const coinsContainer = document.querySelector('#coins-container');
const powerupsContainer = document.querySelector('#powerups-container');
const currentScoreEl = document.querySelector('#current-score');
const highScoreEl = document.querySelector('#high-score');
const finalScoreEl = document.querySelector('#final-score span');
const finalHighScoreEl = document.querySelector('#final-high-score span');
const powerupIndicatorsEl = document.querySelector('#powerup-indicators');

// Dimensiones del tablero
const BOARD_WIDTH = 900;
const BOARD_HEIGHT = 475;

// Física del dragón
let dragonY = BOARD_HEIGHT / 2;
let dragonVelocityY = 0;
const GRAVITY = 0.3;
const JUMP_FORCE = -7;
const DRAGON_WIDTH = 60;
const DRAGON_HEIGHT = 45;
const DRAGON_X = 100; // Posición horizontal fija

// Tuberías
let pipes = [];
const PIPE_WIDTH = 64;
let PIPE_GAP = 180;
let pipeSpeed = 3;
const PIPE_SPAWN_INTERVAL = 1800; // milisegundos
let lastPipeSpawn = 0;

// Coleccionables// 
let coins = [];
let powerups = [];
const COIN_SIZE = 40;
const POWERUP_SIZE = 45;
const COIN_SPAWN_CHANCE = 0.6; // 60% de probabilidad
const POWERUP_SPAWN_CHANCE = 0.15; // 15% de probabilidad

// Puntuación
let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;

// Power-ups activos
let activePowerups = {
    shield: false,
    slow: false,
    boost: false
};

// Control del juego
let gameLoopId = null;
let lastTime = 0;

/* ═══════════════════════════════════════════════════════════════
   INICIALIZACIÓN DEL JUEGO
   ═══════════════════════════════════════════════════════════════ */

function startGame() {
    // Resetear variables
    dragonY = BOARD_HEIGHT / 2;
    dragonVelocityY = 0;
    pipes = [];
    coins = [];
    powerups = [];
    score = 0;
    pipeSpeed = 3;
    PIPE_GAP = 180;
    lastPipeSpawn = 0;
    activePowerups = { shield: false, slow: false, boost: false };

    // Limpiar contenedores
    pipesContainer.innerHTML = '';
    coinsContainer.innerHTML = '';
    powerupsContainer.innerHTML = '';
    powerupIndicatorsEl.innerHTML = '';

    // Actualizar UI
    updateScoreDisplay();
    highScoreEl.textContent = highScore;

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

/* ═══════════════════════════════════════════════════════════════
   FÍSICA DEL DRAGÓN
   ═══════════════════════════════════════════════════════════════ */

function updateDragon() {
    // Aplicar gravedad
    dragonVelocityY += GRAVITY;
    dragonY += dragonVelocityY;

    // Límites
    if (dragonY < 0) {
        dragonY = 0;
        triggerGameOver();
    }
    if (dragonY > BOARD_HEIGHT - DRAGON_HEIGHT) {
        dragonY = BOARD_HEIGHT - DRAGON_HEIGHT;
        triggerGameOver();
    }

    // Actualizar posición visual
    dragonElement.style.top = dragonY + 'px';
}

function jump() {
    if (state === 'playing') {
        dragonVelocityY = JUMP_FORCE;
    }
}

// Controles
document.addEventListener('click', (e) => {
    // Solo saltar si el click es dentro del área de juego
    if (state === 'playing' && e.target.closest('#playingScreenFlappy')) {
        jump();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && state === 'playing') {
        e.preventDefault();
        jump();
    }
});

/* ═══════════════════════════════════════════════════════════════
   SISTEMA DE TUBERÍAS
   ═══════════════════════════════════════════════════════════════ */

function spawnPipe() {
    // Altura aleatoria para la tubería superior (entre 50 y 300)
    const minHeight = 50;
    const maxHeight = BOARD_HEIGHT - PIPE_GAP - 50;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    // Crear elemento DOM
    const pipeElement = document.createElement('div');
    pipeElement.className = 'pipe-pair';
    pipeElement.style.left = BOARD_WIDTH + 'px';

    const topPipe = document.createElement('div');
    topPipe.className = 'pipe-top';
    topPipe.style.height = topHeight + 'px';

    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'pipe-bottom';
    bottomPipe.style.top = (topHeight + PIPE_GAP) + 'px';
    bottomPipe.style.height = (BOARD_HEIGHT - topHeight - PIPE_GAP) + 'px';

    pipeElement.appendChild(topPipe);
    pipeElement.appendChild(bottomPipe);
    pipesContainer.appendChild(pipeElement);

    // Crear objeto pipe
    const pipe = {
        x: BOARD_WIDTH,
        topHeight: topHeight,
        gap: PIPE_GAP,
        passed: false,
        element: pipeElement
    };

    pipes.push(pipe);

    // Spawn coleccionables en el gap
    spawnCollectibles(BOARD_WIDTH + PIPE_WIDTH, topHeight + PIPE_GAP / 2);
}

function updatePipes(deltaTime) {
    const currentSpeed = activePowerups.slow ? pipeSpeed * 0.5 : pipeSpeed;

    pipes.forEach((pipe, index) => {
        // Mover tubería
        pipe.x -= currentSpeed;
        pipe.element.style.left = pipe.x + 'px';

        // Verificar si pasó el dragón (para score)
        if (!pipe.passed && pipe.x + PIPE_WIDTH < DRAGON_X) {
            pipe.passed = true;
            const points = activePowerups.boost ? 2 : 1;
            score += points;
            updateScoreDisplay();
        }

        // Eliminar si salió de pantalla
        if (pipe.x < -PIPE_WIDTH) {
            pipe.element.remove();
            pipes.splice(index, 1);
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   SISTEMA DE COLECCIONABLES
   ═══════════════════════════════════════════════════════════════ */

function spawnCollectibles(x, centerY) {
    // Spawn coin
    if (Math.random() < COIN_SPAWN_CHANCE) {
        spawnCoin(x, centerY - COIN_SIZE / 2);
    }

    // Spawn powerup
    if (Math.random() < POWERUP_SPAWN_CHANCE) {
        const types = ['shield', 'slow', 'boost'];
        const type = types[Math.floor(Math.random() * types.length)];
        spawnPowerup(x + 30, centerY - POWERUP_SIZE / 2, type);
    }
}

function spawnCoin(x, y) {
    const coinElement = document.createElement('div');
    coinElement.className = 'coin';
    coinElement.style.left = x + 'px';
    coinElement.style.top = y + 'px';
    coinsContainer.appendChild(coinElement);

    coins.push({
        x: x,
        y: y,
        collected: false,
        element: coinElement
    });
}

function spawnPowerup(x, y, type) {
    const powerupElement = document.createElement('div');
    powerupElement.className = 'powerup ' + type;
    powerupElement.style.left = x + 'px';
    powerupElement.style.top = y + 'px';
    powerupsContainer.appendChild(powerupElement);

    powerups.push({
        x: x,
        y: y,
        type: type,
        collected: false,
        element: powerupElement
    });
}

function updateCollectibles() {
    const currentSpeed = activePowerups.slow ? pipeSpeed * 0.5 : pipeSpeed;

    // Actualizar coins
    coins.forEach((coin, index) => {
        coin.x -= currentSpeed;
        coin.element.style.left = coin.x + 'px';

        if (coin.x < -COIN_SIZE) {
            coin.element.remove();
            coins.splice(index, 1);
        }
    });

    // Actualizar powerups
    powerups.forEach((powerup, index) => {
        powerup.x -= currentSpeed;
        powerup.element.style.left = powerup.x + 'px';

        if (powerup.x < -POWERUP_SIZE) {
            powerup.element.remove();
            powerups.splice(index, 1);
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   DETECCIÓN DE COLISIONES
   ═══════════════════════════════════════════════════════════════ */

function checkCollisions() {
    const dragonBox = {
        x: DRAGON_X,
        y: dragonY,
        width: DRAGON_WIDTH,
        height: DRAGON_HEIGHT
    };

    // Colisión con tuberías
    pipes.forEach(pipe => {
        if (dragonBox.x + dragonBox.width > pipe.x &&
            dragonBox.x < pipe.x + PIPE_WIDTH) {

            // Verificar si está fuera del gap
            if (dragonBox.y < pipe.topHeight ||
                dragonBox.y + dragonBox.height > pipe.topHeight + pipe.gap) {

                // Si tiene escudo, consumirlo en lugar de perder
                if (activePowerups.shield) {
                    activePowerups.shield = false;
                    updatePowerupIndicators();
                } else {
                    triggerGameOver();
                }
            }
        }
    });

    // Colisión con coins
    coins.forEach((coin, index) => {
        if (!coin.collected && isColliding(dragonBox, {
            x: coin.x, y: coin.y, width: COIN_SIZE, height: COIN_SIZE
        })) {
            coin.collected = true;
            coin.element.remove();
            coins.splice(index, 1);

            const points = activePowerups.boost ? 20 : 10;
            score += points;
            updateScoreDisplay();
        }
    });

    // Colisión con powerups
    powerups.forEach((powerup, index) => {
        if (!powerup.collected && isColliding(dragonBox, {
            x: powerup.x, y: powerup.y, width: POWERUP_SIZE, height: POWERUP_SIZE
        })) {
            powerup.collected = true;
            powerup.element.remove();
            powerups.splice(index, 1);

            activatePowerup(powerup.type);
        }
    });
}

function isColliding(box1, box2) {
    return box1.x < box2.x + box2.width &&
           box1.x + box1.width > box2.x &&
           box1.y < box2.y + box2.height &&
           box1.y + box1.height > box2.y;
}

/* ═══════════════════════════════════════════════════════════════
   SISTEMA DE POWER-UPS
   ═══════════════════════════════════════════════════════════════ */

function activatePowerup(type) {
    activePowerups[type] = true;
    updatePowerupIndicators();

    // Desactivar después de 5 segundos
    setTimeout(() => {
        activePowerups[type] = false;
        updatePowerupIndicators();
    }, 5000);
}

function updatePowerupIndicators() {
    powerupIndicatorsEl.innerHTML = '';

    if (activePowerups.shield) {
        const indicator = document.createElement('div');
        indicator.className = 'powerup-indicator';
        indicator.textContent = '🛡️ Shield Active';
        powerupIndicatorsEl.appendChild(indicator);
    }

    if (activePowerups.slow) {
        const indicator = document.createElement('div');
        indicator.className = 'powerup-indicator';
        indicator.textContent = '⏱️ Slow Motion';
        powerupIndicatorsEl.appendChild(indicator);
    }

    if (activePowerups.boost) {
        const indicator = document.createElement('div');
        indicator.className = 'powerup-indicator';
        indicator.textContent = '⭐ Score Boost x2';
        powerupIndicatorsEl.appendChild(indicator);
    }
}

/* ═══════════════════════════════════════════════════════════════
   UI Y SCORE
   ═══════════════════════════════════════════════════════════════ */

function updateScoreDisplay() {
    currentScoreEl.textContent = score;
}

function triggerGameOver() {
    resetGame();
    changeState('gameOver');
}

/* ═══════════════════════════════════════════════════════════════
   GAME LOOP PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */

function gameLoop(currentTime) {
    if (state !== 'playing') return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Actualizar física
    updateDragon();

    // Spawn tuberías
    if (currentTime - lastPipeSpawn > PIPE_SPAWN_INTERVAL) {
        spawnPipe();
        lastPipeSpawn = currentTime;
    }

    // Actualizar elementos
    updatePipes(deltaTime);
    updateCollectibles();

    // Detectar colisiones
    checkCollisions();

    // Siguiente frame
    gameLoopId = requestAnimationFrame(gameLoop);
}

/* ═══════════════════════════════════════════════════════════════
   EVENTOS DE BOTONES ACTUALIZADOS
   ═══════════════════════════════════════════════════════════════ */
