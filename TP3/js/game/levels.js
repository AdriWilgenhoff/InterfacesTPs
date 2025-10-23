export const LEVELS_CONFIG = {
  // Dificultad por divisiones, solo números cuadrados perfectos 
  divisiones: {
    facil: [4],
    medio: [9],
    dificil: [16],
    extremo: [25]
  },

  // Dificultad por filtros
  filtros: {
    facil: ['blur'],
    medio: ['escalaGrises', 'sepia'],
    dificil: ['brillo'],
    extremo: ['negativo', 'escalaAzul']
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
/* 
export const LEVELS = [
  { nivel: 1, dificultad: 'Fácil', division: 4, filtro: 'facil', timer: 'sinTimer', ayudita: false }, 
  { nivel: 2, dificultad: 'Fácil', division: 4, filtro: 'medio', timer: 'sinTimer', ayudita: false }, 
  { nivel: 3, dificultad: 'Medio', division: 9, filtro: 'medio', timer: 'sinTimer', ayudita: false },
  { nivel: 4, dificultad: 'Medio', division: 9, filtro: 'medio', timer: 'sinTimer', ayudita: false },
  { nivel: 5, dificultad: 'Medio', division: 9, filtro: 'dificil', timer: 'relajado', ayudita: false },
  { nivel: 6, dificultad: 'Difícil', division: 16, filtro: 'dificil', timer: 'normal', ayudita: true },
  { nivel: 7, dificultad: 'Difícil', division: 16, filtro: 'dificil', timer: 'normal', ayudita: true },
  { nivel: 8, dificultad: 'Difícil', division: 16, filtro: 'dificil', timer: 'rapido', ayudita: true },
  { nivel: 9, dificultad: 'Extremo', division: 25, filtro: 'dificil', timer: 'rapido', ayudita: true },
  { nivel: 10, dificultad: 'Extremo', division: 25, filtro: 'extremo', timer: 'extremo', ayudita: true }
]; */

export const LEVELS = [
  { nivel: 1, dificultad: 'Medio', division: 4, filtro: 'extremo', timer: 'extremo', ayudita:true }, 
  { nivel: 2, dificultad: 'Difícil', division: 4, filtro: 'extremo', timer: 'sinTimer', ayudita: true }
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

// Obtener el total de niveles disponibles
export function getTotalNiveles() {
  return LEVELS.length;
}