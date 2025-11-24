
window.addEventListener('keydown', function (e) {
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault(); 
  }
});

let state = 'start';

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

buttonStart.addEventListener('click', () => { 
    changeState('playing') 
    startGame();
    
}); 


buttonNext.addEventListener('click', () => { changeState('gameOver') }); 


buttonRestart.addEventListener('click', () => { changeState('start') });

changeState('start');

const dragonElement = document.querySelector('#dragonPlayer');
const pipesContainer = document.querySelector('#pipes-container');
const coinsContainer = document.querySelector('#coins-container');
const powerupsContainer = document.querySelector('#powerups-container');
const currentScoreEl = document.querySelector('#current-score');
const finalScoreEl = document.querySelector('#final-score span');
const powerupIndicatorsEl = document.querySelector('#powerup-indicators');

const BOARD_WIDTH = 900;
const BOARD_HEIGHT = 475;

let dragonY = BOARD_HEIGHT / 2;
let dragonVelocityY = 0;
const GRAVITY = 0.25;
const JUMP_FORCE = -7;
const DRAGON_WIDTH = 60;
const DRAGON_HEIGHT = 45;
const DRAGON_X = 100;

let pipes = [];
const PIPE_WIDTH = 64;
let PIPE_GAP = 180;
let pipeSpeed = 4;
const PIPE_SPAWN_INTERVAL = 1500;
let lastPipeSpawn = 0;

let coins = [];
let powerups = [];
const COIN_SIZE = 40;
const POWERUP_SIZE = 45;
const COIN_SPAWN_CHANCE = 0.6;
const POWERUP_SPAWN_CHANCE = 0.15;

let score = 0;
const VICTORY_SCORE = 250; 
let isVictory = false;

let activePowerups = {
    grow: false
};

let gameLoopId = null;
let lastTime = 0;

/* ═══════════════════════════════════════════════════════════════
   INICIALIZACIÓN DEL JUEGO
   ═══════════════════════════════════════════════════════════════ */

function startGame() {
    dragonY = BOARD_HEIGHT / 2;
    dragonVelocityY = 0;
    pipes = [];
    coins = [];
    powerups = [];
    score = 0;
    isVictory = false;
    lastPipeSpawn = 0;
    activePowerups = { grow: false };

    pipesContainer.innerHTML = '';
    coinsContainer.innerHTML = '';
    powerupsContainer.innerHTML = '';
    powerupIndicatorsEl.innerHTML = '';

    updateScoreDisplay();

    lastTime = performance.now();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function resetGame() {
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }

    dragonElement.classList.remove('grown');

    finalScoreEl.textContent = score;
}

/* ═══════════════════════════════════════════════════════════════
   FÍSICA DEL MURCIELAGO
   ═══════════════════════════════════════════════════════════════ */

function updateDragon() {
    dragonVelocityY += GRAVITY;
    dragonY += dragonVelocityY;

    if (dragonY < 0) {
        dragonY = 0;
        triggerGameOver();
    }
    if (dragonY > BOARD_HEIGHT - DRAGON_HEIGHT) {
        dragonY = BOARD_HEIGHT - DRAGON_HEIGHT;
        triggerGameOver();
    }

    dragonElement.style.top = dragonY + 'px';
}

function jump() {
    if (state === 'playing') {
        if (activePowerups.grow) {
            const randomJump = -4 - Math.random() * 6;
            dragonVelocityY = randomJump;
        } else {
            dragonVelocityY = JUMP_FORCE;
        }
    }
}

document.addEventListener('click', (e) => {
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
    const minHeight = 50;
    const maxHeight = BOARD_HEIGHT - PIPE_GAP - 50;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

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

    const pipe = {
        x: BOARD_WIDTH,
        topHeight: topHeight,
        gap: PIPE_GAP,
        passed: false,
        element: pipeElement
    };

    pipes.push(pipe);

    spawnCollectibles(BOARD_WIDTH + PIPE_WIDTH, topHeight + PIPE_GAP / 2);
}

function updatePipes(deltaTime) {
    const currentSpeed = pipeSpeed;

    pipes.forEach((pipe, index) => {
        pipe.x -= currentSpeed;
        pipe.element.style.left = pipe.x + 'px';

        if (!pipe.passed && pipe.x + PIPE_WIDTH < DRAGON_X) {
            pipe.passed = true;
            score += 1;
            updateScoreDisplay();
        }

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
    const random = Math.random();

    if (random < POWERUP_SPAWN_CHANCE) {
        spawnPowerup(x + 30, centerY - POWERUP_SIZE / 2, 'grow');
    } else if (random < POWERUP_SPAWN_CHANCE + COIN_SPAWN_CHANCE) {
        spawnCoin(x, centerY - COIN_SIZE / 2);
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
    const currentSpeed = pipeSpeed;

    coins.forEach((coin, index) => {
        coin.x -= currentSpeed;
        coin.element.style.left = coin.x + 'px';

        if (coin.x < -COIN_SIZE) {
            coin.element.remove();
            coins.splice(index, 1);
        }
    });

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

/**
 * Verifica colisión entre una elipse (dragón) y un rectángulo (tubería)
 */
function isEllipseCollidingRect(ellipseCenterX, ellipseCenterY, radiusX, radiusY, rect) {
    const closestX = Math.max(rect.x, Math.min(ellipseCenterX, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(ellipseCenterY, rect.y + rect.height));

    const dx = closestX - ellipseCenterX;
    const dy = closestY - ellipseCenterY;

    const normalizedDistance = (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY);

    return normalizedDistance <= 1;
}

/**
 * Verifica colisión rectangular básica (para coins y powerups)
 */
function isColliding(box1, box2) {
    return box1.x < box2.x + box2.width &&
           box1.x + box1.width > box2.x &&
           box1.y < box2.y + box2.height &&
           box1.y + box1.height > box2.y;
}

function checkCollisions() {
    const growMultiplier = activePowerups.grow ? 2 : 1;
    const currentWidth = DRAGON_WIDTH * growMultiplier;
    const currentHeight = DRAGON_HEIGHT * growMultiplier;

    const dragonCenterX = DRAGON_X + currentWidth / 2;
    const dragonCenterY = dragonY + currentHeight / 2;
    const dragonRadiusX = (currentWidth / 2) * 0.7;
    const dragonRadiusY = (currentHeight / 2) * 0.7;

    const dragonBox = {
        x: DRAGON_X,
        y: dragonY,
        width: DRAGON_WIDTH,
        height: DRAGON_HEIGHT
    };

    pipes.forEach(pipe => {
        if (dragonCenterX + dragonRadiusX > pipe.x &&
            dragonCenterX - dragonRadiusX < pipe.x + PIPE_WIDTH) {

            const pipeMargin = 6;
            const topPipeRect = {
                x: pipe.x + pipeMargin,
                y: 0,
                width: PIPE_WIDTH - (pipeMargin * 2),
                height: pipe.topHeight
            };

            const bottomPipeRect = {
                x: pipe.x + pipeMargin,
                y: pipe.topHeight + pipe.gap,
                width: PIPE_WIDTH - (pipeMargin * 2),
                height: BOARD_HEIGHT - (pipe.topHeight + pipe.gap)
            };

            const hitTopPipe = isEllipseCollidingRect(
                dragonCenterX, dragonCenterY,
                dragonRadiusX, dragonRadiusY,
                topPipeRect
            );

            const hitBottomPipe = isEllipseCollidingRect(
                dragonCenterX, dragonCenterY,
                dragonRadiusX, dragonRadiusY,
                bottomPipeRect
            );

            if (hitTopPipe || hitBottomPipe) {
                triggerGameOver();
            }
        }
    });

    coins.forEach((coin, index) => {
        if (!coin.collected && isColliding(dragonBox, {
            x: coin.x, y: coin.y, width: COIN_SIZE, height: COIN_SIZE
        })) {
            coin.collected = true;
            coin.element.remove();
            coins.splice(index, 1);

            score += 10;
            updateScoreDisplay();
        }
    });

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

/* ═══════════════════════════════════════════════════════════════
   SISTEMA DE POWER-UPS
   ═══════════════════════════════════════════════════════════════ */

function activatePowerup(type) {
    activePowerups[type] = true;
    updatePowerupIndicators();

    if (type === 'grow') {
        dragonElement.classList.add('grown');
    }

    setTimeout(() => {
        activePowerups[type] = false;
        updatePowerupIndicators();

        if (type === 'grow') {
            dragonElement.classList.remove('grown');
        }
    }, 5000);
}

function updatePowerupIndicators() {
    powerupIndicatorsEl.innerHTML = '';

    if (activePowerups.grow) {
        const indicator = document.createElement('div');
        indicator.className = 'powerup-indicator negative';
        indicator.textContent = '🩸 BORRACHO DE SANGRE ';
        powerupIndicatorsEl.appendChild(indicator);
    }
}

/* ═══════════════════════════════════════════════════════════════
   UI Y SCORE
   ═══════════════════════════════════════════════════════════════ */

function updateScoreDisplay() {
    currentScoreEl.textContent = score;

    if (score >= VICTORY_SCORE) {
        isVictory = true;
        triggerGameOver();
    }
}

function updateGameOverText() {
    const titleEl = document.querySelector('#gameOverFlappy h2');

    if (isVictory) {
        titleEl.textContent = ' ¡GANASTE! ';
        titleEl.style.color = 'gold';
    } else {
        titleEl.textContent = 'JUEGO TERMINADO';
        titleEl.style.color = '';
    }
}

function showExplosion(x, y) {
    const explosionElement = document.createElement('div');
    explosionElement.className = 'explosion';

    explosionElement.style.left = (x - 10) + 'px'; 
    explosionElement.style.top = (y - 20) + 'px';

    pantallaJuego.appendChild(explosionElement);

    setTimeout(() => {
        explosionElement.remove();
    }, 600);
}

function triggerGameOver() {
    const deathX = DRAGON_X;
    const deathY = dragonY;

    dragonVelocityY = 0;

    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }

    dragonElement.style.top = deathY + 'px';

    if (!isVictory) {
        dragonElement.style.opacity = '0';
        showExplosion(deathX, deathY);
    }

    updateGameOverText();

    const delay = isVictory ? 100 : 700;

    setTimeout(() => {
        if (!isVictory) {
            dragonElement.style.opacity = '1';
        }

        resetGame();
        changeState('gameOver');
    }, delay);
}

/* ═══════════════════════════════════════════════════════════════
   GAME LOOP PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */

function gameLoop(currentTime) {
    if (state !== 'playing') return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    updateDragon();

    if (currentTime - lastPipeSpawn > PIPE_SPAWN_INTERVAL) {
        spawnPipe();
        lastPipeSpawn = currentTime;
    }

    updatePipes(deltaTime);
    updateCollectibles();

    checkCollisions();

    gameLoopId = requestAnimationFrame(gameLoop);
}
