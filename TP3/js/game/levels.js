export const LEVELS_CONFIG = {
  // Dificultad por divisiones
  divisiones: {
    facil: [4],
    medio: [9],
    dificil: [16],
    extremo: [25]
  },

  // Dificultad por filtros
  filtros: {
    facil: ['ninguno'],
    medio: ['escalaGrises', 'sepia'],
    dificil: ['brillo', 'pixelado'],
    extremo: ['negativo','pixelado']
  },

  // Configuración de timers (en segundos)
  timers: {
    sinTimer: null,
    relajado: 180,
    normal: 120,
    rapido: 90,
    extremo: 60 
  }
};

/* export const LEVELS = [
  { nivel: 1, dificultad: 'facil', division: 4, filtro: 'facil', timer: 'sinTimer', ayudita: true }, 
  { nivel: 2, dificultad: 'facil', division: 4, filtro: 'medio', timer: 'sinTimer', ayudita: true }, 
  { nivel: 3, dificultad: 'medio', division: 9, filtro: 'facil', timer: 'sinTimer', ayudita: true },
  { nivel: 4, dificultad: 'medio', division: 9, filtro: 'medio', timer: 'sinTimer', ayudita: true },
  { nivel: 5, dificultad: 'medio', division: 9, filtro: 'dificil', timer: 'sinTimer', ayudita: true },
  { nivel: 6, dificultad: 'dificil', division: 16, filtro: 'facil', timer: 'sinTimer', ayudita: true },
  { nivel: 7, dificultad: 'dificil', division: 16, filtro: 'medio', timer: 'sinTimer', ayudita: true },
  { nivel: 8, dificultad: 'dificil', division: 16, filtro: 'dificil', timer: 'sinTimer', ayudita: true },
  { nivel: 9, dificultad: 'extremo', division: 25, filtro: 'medio', timer: 'sinTimer', ayudita: true },
  { nivel: 10, dificultad: 'extremo', division: 25, filtro: 'extremo', timer: 'sinTimer', ayudita: true }
]; */

export const LEVELS = [
  { nivel: 1, dificultad: 'facil', division: 4, filtro: 'facil', timer: 'sinTimer', ayudita: false }, 
  { nivel: 2, dificultad: 'facil', division: 4, filtro: 'medio', timer: 'sinTimer', ayudita: true }
];

export function cargarNivel(numeroNivel) {
  const config = LEVELS[numeroNivel - 1];

  if (!config) {
    console.error('Nivel no existe');
    return null;
  }

  const division = config.division;
  const filtrosDisponibles = LEVELS_CONFIG.filtros[config.filtro];
  const filtroElegido = filtrosDisponibles[Math.floor(Math.random() * filtrosDisponibles.length)];
  const tiempoLimite = LEVELS_CONFIG.timers[config.timer];

  return {
    nivel: numeroNivel,
    divisiones: division,
    filtro: filtroElegido,
    dificultad: config.dificultad,
    tiempoLimite: tiempoLimite,
    tieneTimer: tiempoLimite !== null,
    ayudita: config.ayudita
  };
}

// Función auxiliar para formatear el tiempo restante
export function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos}:${segs.toString().padStart(2, '0')}`;
}

// Obtener el total de niveles disponibles
export function getTotalNiveles() {
  return LEVELS.length;
}