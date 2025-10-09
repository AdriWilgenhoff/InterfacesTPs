// main.js - Archivo principal del juego Blocka
// Maneja la lógica principal, flujo del juego y coordinación entre módulos

import { IMAGES, SOUNDS } from './constans.js';
import { GestorRotacion } from './rotacion.js';
import { aplicarFiltroPorNombre } from './filtros.js';
import { cargarNivel, formatearTiempo, getTotalNiveles } from './levels.js';
import { obtenerImagenAleatoria, cargarImagen } from './utils.js';
import { GestorAudio } from './audio.js';
import { HUD } from './hud.js';
import { Modal } from './modal.js';
import { PantallaInicial } from './pantallaInicial.js';
import { SeleccionadorImagen } from './seleccionadorImagen.js';

/**
 * Función principal que inicializa todo el juego
 * Se ejecuta cuando el canvas se vuelve visible
 */
async function inicializarJuego() {
    // === Configuración del Canvas ===
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 475;

    // === Variables de Estado del Juego ===
    let nivelActual = 1;
    let timerInterval = null;
    let tiempoActual = 0;
    let tieneTimerLimite = false;           // true = countdown, false = countup
    let gestorRotacion = null;
    let imagenActual = null;
    let rutaImagenActual = null;
    const PENALIZACION_AYUDITA = 30;        // Segundos de penalización al usar ayudita
    let juegoEnPausa = false;
    let estadoJuego = 'inicio';             // Estados: 'inicio', 'seleccionando', 'jugando', 'modal'
    let tiempoTotalJuego = 0;               // Acumulador de tiempo de todos los niveles

    // === Inicialización de Módulos ===
    const audio = new GestorAudio(SOUNDS);
    window.audioGlobal = audio;             // Hacer audio accesible globalmente
    const hud = new HUD(canvas, ctx);
    const modal = new Modal(canvas, ctx);
    const pantallaInicial = new PantallaInicial(canvas, ctx);
    const seleccionador = new SeleccionadorImagen(canvas, ctx);

    // Cargar imágenes en el seleccionador
    await seleccionador.cargarImagenes(IMAGES);

    // Guardar referencias globales para acceso desde otros módulos
    window.modalGlobal = modal;
    window.seleccionadorGlobal = seleccionador;

    // Mostrar pantalla inicial
    pantallaInicial.dibujar();

    // === Event Listener para Clicks ===
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Detectar clicks en botones del HUD (solo durante el juego)
        if (estadoJuego === 'jugando') {
            const botonHUD = hud.clickEnBoton(x, y);

            if (botonHUD === 'reiniciar') {
                reiniciarNivel();
                return;
            } else if (botonHUD === 'home') {
                // Confirmar antes de salir (se pierde progreso)
                if (confirm('¿Volver al menú principal? Se perderá el progreso del nivel.')) {
                    detenerTimer();
                    estadoJuego = 'inicio';
                    nivelActual = 1;
                    tiempoTotalJuego = 0;
                    gestorRotacion = null;

                    // Loop para mantener la pantalla inicial visible
                    const dibujarInicio = () => {
                        if (estadoJuego === 'inicio') {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            pantallaInicial.dibujar();
                            requestAnimationFrame(dibujarInicio);
                        }
                    };

                    pantallaInicial.mostrar();
                    dibujarInicio();
                }
                return;
            } else if (botonHUD === 'mute') {
                audio.toggleMute();

                // Forzar redibujo para actualizar icono de mute
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                gestorRotacion.redibujarImagen();
                return;
            }
        }

        // Detectar click en botón de inicio
        if (estadoJuego === 'inicio' && pantallaInicial.clickEnBoton(x, y)) {
            estadoJuego = 'seleccionando';
            pantallaInicial.ocultar();
            nivelActual = 1;
            tiempoTotalJuego = 0;
            iniciarSeleccionYNivel(1);
        }

        // Detectar clicks en botones del modal
        if (estadoJuego === 'modal' && modal.visible) {
            const botonClickeado = modal.clickEnBoton(x, y);

            if (botonClickeado === 'siguiente') {
                // Avanzar al siguiente nivel
                nivelActual++;
                if (nivelActual <= getTotalNiveles()) {
                    modal.ocultar();
                    estadoJuego = 'seleccionando';
                    iniciarSeleccionYNivel(nivelActual);
                } else {
                    // Juego completado - mostrar modal final
                    modal.ocultar();
                    modal.mostrarJuegoCompletado(tiempoTotalJuego);
                    if (gestorRotacion) {
                        gestorRotacion.redibujarImagen();
                    }
                }
            } else if (botonClickeado === 'reintentar') {
                // Reintentar el nivel actual
                modal.ocultar();
                estadoJuego = 'seleccionando';
                iniciarSeleccionYNivel(nivelActual);
            } else if (botonClickeado === 'home') {
                // Volver al menú principal
                detenerTimer();
                modal.ocultar();
                estadoJuego = 'inicio';
                nivelActual = 1;
                tiempoTotalJuego = 0;
                tiempoActual = 0;
                gestorRotacion = null;

                // Mostrar pantalla inicial con loop de animación
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                pantallaInicial.mostrar();
                pantallaInicial.dibujar();

                requestAnimationFrame(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    pantallaInicial.dibujar();
                });
            }
        }
    });

    /**
     * Inicia la animación de selección de imagen y luego el nivel
     * @param {number} numeroNivel - Número del nivel a iniciar
     */
    function iniciarSeleccionYNivel(numeroNivel) {
        rutaImagenActual = obtenerImagenAleatoria(IMAGES);

        // Iniciar animación de selección
        seleccionador.iniciarSeleccion(rutaImagenActual, () => {
            estadoJuego = 'jugando';
            iniciarNivel(numeroNivel, rutaImagenActual);
        });

        // Loop de animación del seleccionador
        const animLoop = setInterval(() => {
            if (!seleccionador.visible) {
                clearInterval(animLoop);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                seleccionador.dibujar();
            }
        }, 50);
    }

    /**
     * Inicializa y configura un nivel del juego
     * @param {number} numeroNivel - Número del nivel
     * @param {string} rutaImagen - Ruta de la imagen a usar
     */
    async function iniciarNivel(numeroNivel, rutaImagen) {
        juegoEnPausa = false;
        estadoJuego = 'jugando';

        // Cargar configuración del nivel
        const nivel = cargarNivel(numeroNivel);
        if (!nivel) {
            console.error('No se pudo cargar el nivel');
            return;
        }

        // Guardar si el nivel permite usar ayudita
        window.ayuditaHabilitada = nivel.ayudita;

        detenerTimer();

        try {
            // Cargar la imagen
            imagenActual = await cargarImagen(rutaImagen);

            // Actualizar HUD con información del nivel
            hud.actualizarNivel(nivel.nivel, nivel.dificultad);

            // Crear gestor de rotación con la imagen
            gestorRotacion = new GestorRotacion(canvas, ctx, imagenActual, hud);

            // Configurar callback para reproducir sonido al rotar
            gestorRotacion.establecerCallbackMovimiento(() => {
                if (estadoJuego === 'jugando') {
                    audio.reproducir('movimiento');
                }
            });

            // Configurar callback para cuando se complete el nivel
            gestorRotacion.establecerCallbackCompletado(() => {
                nivelCompletado();
            });

            // Dibujar la imagen dividida y rotada aleatoriamente
            gestorRotacion.dibujarImagenDividida(nivel.divisiones, 400);

            // Aplicar filtro visual si corresponde
            if (nivel.filtro !== 'ninguno') {
                gestorRotacion.establecerFiltro(() => {
                    aplicarFiltroPorNombre(nivel.filtro, ctx, canvas);
                });
                aplicarFiltroPorNombre(nivel.filtro, ctx, canvas);
            }

            // Configurar timer según tipo de nivel
            if (nivel.tieneTimer) {
                // Timer con límite (cuenta regresiva)
                tiempoActual = nivel.tiempoLimite;
                tieneTimerLimite = true;
                hud.actualizarTiempo(tiempoActual, true);
                iniciarTimer();
            } else {
                // Timer sin límite (cuenta hacia arriba)
                tiempoActual = 0;
                tieneTimerLimite = false;
                hud.actualizarTiempo(tiempoActual, false);
                iniciarTimer();
            }

        } catch (error) {
            console.error('Error al cargar la imagen:', error);
        }
    }

    /**
     * Inicia el timer del nivel (countdown o countup según configuración)
     */
    function iniciarTimer() {
        detenerTimer();

        timerInterval = setInterval(() => {
            // Solo actualizar si está jugando
            if (estadoJuego !== 'jugando') return;

            if (tieneTimerLimite) {
                // Countdown: restar tiempo
                tiempoActual--;

                if (tiempoActual <= 0) {
                    detenerTimer();
                    nivelFallido();
                    return;
                }
            } else {
                // Countup: sumar tiempo
                tiempoActual++;
            }

            // Actualizar HUD y redibujar
            hud.actualizarTiempo(tiempoActual, tieneTimerLimite);
            if (gestorRotacion) {
                gestorRotacion.redibujarImagen();
            }

        }, 1000); // Actualizar cada segundo
    }

    /**
     * Detiene el timer del nivel
     */
    function detenerTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    /**
     * Maneja la lógica cuando se completa un nivel
     */
    function nivelCompletado() {
        const tiempoFinal = tiempoActual;

        // Acumular tiempo al total del juego
        tiempoTotalJuego += tiempoFinal;

        estadoJuego = 'completado';
        detenerTimer();
        gestorRotacion.removerFiltro(); // Mostrar imagen sin filtro

        audio.reproducir('nivelCompletado');

        // Esperar 2 segundos antes de mostrar el modal
        setTimeout(() => {
            estadoJuego = 'modal';
            modal.mostrarCompletado(nivelActual, tiempoFinal, tieneTimerLimite);
            gestorRotacion.redibujarImagen();
        }, 2000);
    }

    /**
     * Maneja la lógica cuando falla un nivel (se acaba el tiempo)
     */
    function nivelFallido() {
        estadoJuego = 'modal';
        audio.reproducir('nivelFallido');

        modal.mostrarFallido(nivelActual);
        if (gestorRotacion) {
            gestorRotacion.redibujarImagen();
        }
    }

    /**
     * Reinicia el nivel actual
     */
    function reiniciarNivel() {
        if (estadoJuego !== 'jugando') return;
        estadoJuego = 'seleccionando';
        iniciarSeleccionYNivel(nivelActual);
    }

    /**
     * Usa una ayudita (corrige automáticamente una pieza)
     * Aplica penalización de tiempo según el tipo de timer
     */
    function usarAyudita() {
        if (!gestorRotacion || estadoJuego !== 'jugando') return;

        // Verificar si la ayudita está habilitada para este nivel
        if (!window.ayuditaHabilitada) {
            audio.reproducir('nivelFallido');
            return;
        }

        // Verificar si quedan piezas por corregir
        const malPosicionados = gestorRotacion.obtenerCantidadMalPosicionados();
        if (malPosicionados === 0) {
            return;
        }

        // Aplicar penalización de tiempo
        if (tieneTimerLimite) {
            // Countdown: restar tiempo
            tiempoActual -= PENALIZACION_AYUDITA;
            if (tiempoActual < 0) tiempoActual = 0;
        } else {
            // Countup: sumar tiempo
            tiempoActual += PENALIZACION_AYUDITA;
        }

        hud.actualizarTiempo(tiempoActual, tieneTimerLimite);
        audio.reproducir('ayudita');
        gestorRotacion.ayudita();
    }

    // === Event Listener para Teclas ===
    window.addEventListener('keydown', (e) => {
        // Solo permitir acciones cuando está jugando
        if (estadoJuego !== 'jugando') return;

        if (e.key === 'r' || e.key === 'R') reiniciarNivel();
        if (e.key === 'a' || e.key === 'A') usarAyudita();
        if (e.key === 'm' || e.key === 'M') audio.toggleMute();
    });
}

// === Observar cuando el canvas se vuelva visible ===
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game');
    let juegoInicializado = false;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (canvas.classList.contains('active') && !juegoInicializado) {
                    juegoInicializado = true;
                    inicializarJuego();
                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(canvas, { attributes: true });
});