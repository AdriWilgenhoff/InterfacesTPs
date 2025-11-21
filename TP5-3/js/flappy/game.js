
window.addEventListener('keydown', function (e) {
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault(); 
  }
});

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


// Elementos DOM
const dragonElement = document.querySelector('#dragonPlayer');
const pipesContainer = document.querySelector('#pipes-container');
const coinsContainer = document.querySelector('#coins-container');
const powerupsContainer = document.querySelector('#powerups-container');
const currentScoreEl = document.querySelector('#current-score');
const finalScoreEl = document.querySelector('#final-score span');
const powerupIndicatorsEl = document.querySelector('#powerup-indicators');

// Dimensiones del tablero
const BOARD_WIDTH = 900;
const BOARD_HEIGHT = 475;

// Física del dragón
let dragonY = BOARD_HEIGHT / 2;
let dragonVelocityY = 0;
const GRAVITY = 0.25;
const JUMP_FORCE = -7;
const DRAGON_WIDTH = 60;
const DRAGON_HEIGHT = 45;
const DRAGON_X = 100; // Posición horizontal fija

// Tuberías
let pipes = [];
const PIPE_WIDTH = 64;
let PIPE_GAP = 180;
let pipeSpeed = 4;
const PIPE_SPAWN_INTERVAL = 1500; // milisegundos
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
const VICTORY_SCORE = 250;  // Puntaje para ganar
let isVictory = false;      // Bandera: ¿ganó o murió?

// Power-ups activos
let activePowerups = {
    grow: false
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
    isVictory = false;  // Resetear bandera de victoria
    lastPipeSpawn = 0;
    activePowerups = { grow: false };

    // Limpiar contenedores
    pipesContainer.innerHTML = '';
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

    // Limpiar efectos de powerups
    dragonElement.classList.remove('grown');

    // Actualizar stats de game over
    finalScoreEl.textContent = score;
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
        if (activePowerups.grow) {
            // Salto inconsistente cuando está "borracho de sangre"
            // Aleatoriamente entre -4 y -10 (normal es -7)
            const randomJump = -4 - Math.random() * 6;
            dragonVelocityY = randomJump;
        } else {
            dragonVelocityY = JUMP_FORCE;
        }
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
    const currentSpeed = pipeSpeed;

    pipes.forEach((pipe, index) => {
        // Mover tubería
        pipe.x -= currentSpeed;
        pipe.element.style.left = pipe.x + 'px';

        // Verificar si pasó el dragón (para score)
        if (!pipe.passed && pipe.x + PIPE_WIDTH < DRAGON_X) {
            pipe.passed = true;
            score += 1;
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
    // Generar un solo coleccionable (mutuamente excluyentes)
    const random = Math.random();

    if (random < POWERUP_SPAWN_CHANCE) {
        // Solo power-up (15% probabilidad)
        spawnPowerup(x + 30, centerY - POWERUP_SIZE / 2, 'grow');
    } else if (random < POWERUP_SPAWN_CHANCE + COIN_SPAWN_CHANCE) {
        // Solo coin (60% probabilidad)
        spawnCoin(x, centerY - COIN_SIZE / 2);
    }
    // 25% de probabilidad de no generar nada
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

/**
 * Verifica colisión entre una elipse (dragón) y un rectángulo (tubería)
 * @param {number} ellipseCenterX - Centro X de la elipse
 * @param {number} ellipseCenterY - Centro Y de la elipse
 * @param {number} radiusX - Radio horizontal de la elipse
 * @param {number} radiusY - Radio vertical de la elipse
 * @param {object} rect - Rectángulo {x, y, width, height}
 * @returns {boolean} - True si hay colisión
 */
function isEllipseCollidingRect(ellipseCenterX, ellipseCenterY, radiusX, radiusY, rect) {
    // Encontrar el punto más cercano del rectángulo al centro de la elipse
    const closestX = Math.max(rect.x, Math.min(ellipseCenterX, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(ellipseCenterY, rect.y + rect.height));

    // Calcular distancia normalizada a la elipse
    const dx = closestX - ellipseCenterX;
    const dy = closestY - ellipseCenterY;

    // Fórmula de la elipse: (x/a)² + (y/b)² <= 1
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
    // Configuración de la hitbox elíptica del dragón
    // Si grow está activo, el hitbox es 2x más grande
    const growMultiplier = activePowerups.grow ? 2 : 1;
    const currentWidth = DRAGON_WIDTH * growMultiplier;
    const currentHeight = DRAGON_HEIGHT * growMultiplier;

    const dragonCenterX = DRAGON_X + currentWidth / 2;
    const dragonCenterY = dragonY + currentHeight / 2;
    const dragonRadiusX = (currentWidth / 2) * 0.7;
    const dragonRadiusY = (currentHeight / 2) * 0.7;

    // Hitbox rectangular para coins/powerups (más permisiva)
    const dragonBox = {
        x: DRAGON_X,
        y: dragonY,
        width: DRAGON_WIDTH,
        height: DRAGON_HEIGHT
    };

    // Colisión con tuberías (usando hitbox elíptica)
    pipes.forEach(pipe => {
        // Verificar primero si está en rango horizontal (optimización)
        if (dragonCenterX + dragonRadiusX > pipe.x &&
            dragonCenterX - dragonRadiusX < pipe.x + PIPE_WIDTH) {

            // Crear rectángulos para tubería superior e inferior
            // Reducir hitbox 12px (6px de cada lado) para compensar bordes de piedras
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

            // Verificar colisión elíptica con ambas tuberías
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

    // Colisión con coins (rectangular, más permisiva)
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

    // Colisión con powerups (rectangular, más permisiva)
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

    // Aplicar efecto visual de grow
    if (type === 'grow') {
        dragonElement.classList.add('grown');
    }

    // Desactivar después de 5 segundos
    setTimeout(() => {
        activePowerups[type] = false;
        updatePowerupIndicators();

        // Quitar efecto visual
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

    // Verificar si alcanzó el puntaje para ganar
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
        titleEl.style.color = '';  // Color original
    }
}

function showExplosion(x, y) {
    // Crear elemento de explosión
    const explosionElement = document.createElement('div');
    explosionElement.className = 'explosion';

    // Centrar la explosión en la posición del dragón (80px es el tamaño de la explosión)
    explosionElement.style.left = (x - 10) + 'px';  // Centrar horizontalmente
    explosionElement.style.top = (y - 20) + 'px';   // Centrar verticalmente

    // Agregar al contenedor de juego
    pantallaJuego.appendChild(explosionElement);

    // Eliminar la explosión después de que termine la animación
    setTimeout(() => {
        explosionElement.remove();
    }, 600); // Duración de la animación
}

function triggerGameOver() {
    // Capturar posición exacta del dragón ANTES de cualquier cambio
    const deathX = DRAGON_X;
    const deathY = dragonY;

    // Detener INMEDIATAMENTE toda física
    dragonVelocityY = 0;

    // Detener el game loop
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }

    // Congelar el dragón en su posición actual
    dragonElement.style.top = deathY + 'px';

    // Solo mostrar explosión SI MURIÓ (no si ganó)
    if (!isVictory) {
        // Ocultar el dragón
        dragonElement.style.opacity = '0';
        // Mostrar explosión en la posición EXACTA donde murió
        showExplosion(deathX, deathY);
    }

    // Actualizar el texto de la pantalla según victoria o muerte
    updateGameOverText();

    // Delay diferente: corto si ganó, largo si murió (para la explosión)
    const delay = isVictory ? 100 : 700;

    // Esperar antes de mostrar la pantalla
    setTimeout(() => {
        // Restaurar visibilidad del dragón solo si murió
        if (!isVictory) {
            dragonElement.style.opacity = '1';
        }

        // Guardar stats y mostrar pantalla
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
