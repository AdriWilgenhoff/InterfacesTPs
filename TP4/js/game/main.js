// main.js - Archivo principal del juego Blocka
// Maneja la lógica principal, flujo del juego y coordinación entre módulos

import { IMAGES, SOUNDS } from './constans.js';
import { GestorRotacion } from './rotacion.js';
import { aplicarFiltroPorNombre } from './filtros.js';
import { cargarNivel, getTotalNiveles } from './levels.js';
import { obtenerImagenAleatoria, cargarImagen } from './utils.js';
import { GestorAudio } from './audio.js';
import { HUD } from './hud.js';
import { Modal } from './modal.js';
import { PantallaInicial } from './pantallaInicial.js';
import { SeleccionadorImagen } from './seleccionadorImagen.js';
import { Background } from './background.js'

async function inicializarJuego() {

    const canvas = document.getElementById('gameBlocka');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const backgroundGame = document.querySelector('#backgroundGame');

    const bg = new Background(backgroundGame);

    bg.start(60);

    const estado = {
        actual: 'inicio',
        nivelActual: 1,
        tiempoActual: 0,
        tiempoTotalJuego: 0,
        tieneTimerLimite: false,
        tiempoLimiteNivel: null,
        dificultadActual: '',
        contadorMovimientos: 0,
        movimientosTotales: 0,
        contadorAyudas: 0,
        ayuditaHabilitada: false
    };

    const PENALIZACION_AYUDITA = 30;
    let timerInterval = null;
    let gestorRotacion = null;
    let imagenActual = null;
    let rutaImagenActual = null;

    // === Inicialización de Módulos ===
    const audio = new GestorAudio(SOUNDS);
    const hud = new HUD(canvas, ctx, audio);
    const modal = new Modal(canvas, ctx);
    const pantallaInicial = new PantallaInicial(canvas, ctx);
    const seleccionador = new SeleccionadorImagen(canvas, ctx);

    await seleccionador.cargarImagenes(IMAGES);

    canvas.addEventListener('click', (e) => {
        if (estado.actual === 'jugando' && gestorRotacion) {
            gestorRotacion.rotarCuadrado(e, -90);
            e.stopPropagation();
        }
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (estado.actual === 'jugando' && gestorRotacion) {
            gestorRotacion.rotarCuadrado(e, 90);
            e.stopPropagation();
        }
    });

    // Loop de dibujo inicial para la pantalla de inicio
    const dibujarPantallaInicial = () => {
        if (estado.actual === 'inicio') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pantallaInicial.dibujar();
            requestAnimationFrame(dibujarPantallaInicial);
        }
    };
    dibujarPantallaInicial();

    // Resetea estado y vuelve al inicio
    function volverAlInicio() {
        detenerTimer();

        // Resetear estado
        estado.actual = 'inicio';
        estado.nivelActual = 1;
        estado.tiempoActual = 0;
        estado.tiempoTotalJuego = 0;
        estado.contadorAyudas = 0;
        estado.movimientosTotales = 0;
        gestorRotacion = null;

        // Mostrar pantalla inicial
        modal.ocultar();
        pantallaInicial.mostrar();

        // Loop de dibujo
        const dibujarInicio = () => {
            if (estado.actual === 'inicio') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                pantallaInicial.dibujar();
                requestAnimationFrame(dibujarInicio);
            }
        };
        dibujarInicio();
    }

    // Maneja clicks en botones del HUD
    function manejarClickHUD(botonId) {
        switch (botonId) {
            case 'reiniciar':
                reiniciarNivel();
                break;
            case 'home':
                volverAlInicio();
                break;
            case 'mute':
                audio.toggleMute();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                gestorRotacion.redibujarImagen();
                break;
            case 'ayuda':
                usarAyudita();
                break;
        }
    }

    // Maneja clicks en botones del modal
    function manejarClickModal(botonId) {
        switch (botonId) {
            case 'siguiente':
                estado.nivelActual++;

                if (estado.nivelActual > getTotalNiveles()) {
                    modal.ocultar();
                    audio.reproducir('juegoCompletado');
                    modal.mostrarJuegoCompletado(
                        estado.tiempoTotalJuego,
                        estado.movimientosTotales,
                        estado.contadorAyudas
                    );
                    if (gestorRotacion) {
                        gestorRotacion.redibujarImagen();
                    }
                } else {
                    modal.ocultar();
                    estado.actual = 'seleccionando';
                    iniciarSeleccionYNivel(estado.nivelActual);
                }
                break;

            case 'reintentar':
                modal.ocultar();
                estado.actual = 'seleccionando';
                iniciarSeleccionYNivel(estado.nivelActual);
                break;

            case 'home':
                volverAlInicio();
                break;
        }
    }

    // === Event Listener para Clicks ===
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Clicks en HUD durante el juego
        if (estado.actual === 'jugando') {
            const botonHUD = hud.clickEnBoton(x, y);
            if (botonHUD) {
                manejarClickHUD(botonHUD);
                return;
            }
        }

        // Click en botón de inicio
        if (estado.actual === 'inicio' && pantallaInicial.clickEnBoton(x, y)) {
            estado.actual = 'seleccionando';
            pantallaInicial.ocultar();
            estado.nivelActual = 1;
            estado.tiempoTotalJuego = 0;
            estado.contadorAyudas = 0;
            estado.movimientosTotales = 0;
            iniciarSeleccionYNivel(1);
        }

        // Clicks en modal
        if (estado.actual === 'modal' && modal.visible) {
            const botonClickeado = modal.clickEnBoton(x, y);
            if (botonClickeado) {
                manejarClickModal(botonClickeado);
            }
        }
    });

    function iniciarSeleccionYNivel(numeroNivel) {
        rutaImagenActual = obtenerImagenAleatoria(IMAGES);

        seleccionador.iniciarSeleccion(rutaImagenActual, () => {
            estado.actual = 'jugando';
            iniciarNivel(numeroNivel, rutaImagenActual);
        });

        const animLoop = setInterval(() => {
            if (!seleccionador.visible) {
                clearInterval(animLoop);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                seleccionador.dibujar();
            }
        }, 50);
    }

    async function iniciarNivel(numeroNivel, rutaImagen) {
        estado.actual = 'jugando';
        estado.contadorMovimientos = 0;

        const nivel = cargarNivel(numeroNivel);
        if (!nivel) {
            console.error('No se pudo cargar el nivel');
            return;
        }

        estado.ayuditaHabilitada = nivel.ayudita;
        estado.dificultadActual = nivel.dificultad;

        detenerTimer();
        estado.tiempoActual = 0;
        hud.actualizarTiempo(0, false, null);

        try {
            imagenActual = await cargarImagen(rutaImagen);
            hud.actualizarNivel(nivel.nivel, nivel.dificultad);

            gestorRotacion = new GestorRotacion(canvas, ctx, imagenActual, hud);
            gestorRotacion.establecerModal(modal);

            gestorRotacion.establecerCallbackMovimiento(() => {
                if (estado.actual === 'jugando') {
                    estado.contadorMovimientos++;
                    audio.reproducir('movimiento');
                }
            });

            gestorRotacion.establecerCallbackCompletado(() => {
                // Verificar si se pasó del tiempo límite
                if (estado.tieneTimerLimite && estado.tiempoActual >= estado.tiempoLimiteNivel) {
                    nivelFallido();
                    return;
                }
                nivelCompletado();
            });

            gestorRotacion.dibujarImagenDividida(nivel.divisiones, 400);
            hud.establecerAyudaHabilitada(nivel.ayudita);

            if (nivel.filtro !== 'ninguno') {
                gestorRotacion.establecerFiltro((ctxTemp, canvasTemp) => {
                    aplicarFiltroPorNombre(nivel.filtro, ctxTemp, canvasTemp);
                });
                gestorRotacion.redibujarImagen();
            }

            if (nivel.tieneTimer) {
                estado.tiempoActual = 0;
                estado.tieneTimerLimite = true;
                estado.tiempoLimiteNivel = nivel.tiempoLimite;
                hud.actualizarTiempo(estado.tiempoActual, true, estado.tiempoLimiteNivel);
                iniciarTimer(estado.tiempoLimiteNivel);
            } else {
                estado.tiempoActual = 0;
                estado.tieneTimerLimite = false;
                estado.tiempoLimiteNivel = null;
                hud.actualizarTiempo(estado.tiempoActual, false);
                iniciarTimer();
            }

        } catch (error) {
            console.error('Error al cargar la imagen:', error);
        }
    }




    function iniciarTimer(tiempoLimite = null) {
        detenerTimer();
        timerInterval = setInterval(() => {
            if (estado.actual !== 'jugando') return;

            estado.tiempoActual++;

            if (tiempoLimite !== null && estado.tiempoActual >= tiempoLimite) {
                detenerTimer();
                nivelFallido();
                return;
            }

            hud.actualizarTiempo(estado.tiempoActual, estado.tieneTimerLimite, tiempoLimite);
            if (gestorRotacion) {
                gestorRotacion.redibujarImagen();
            }
        }, 1000);
    }

    function detenerTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function nivelCompletado() {
        const tiempoFinal = estado.tiempoActual;

        estado.tiempoTotalJuego += tiempoFinal;
        estado.movimientosTotales += estado.contadorMovimientos;
        estado.actual = 'completado';

        detenerTimer();

        if (gestorRotacion) {
            gestorRotacion.juegoActivo = false;
        }

        gestorRotacion.removerFiltro();
        audio.reproducir('nivelCompletado');

        setTimeout(() => {
            estado.actual = 'modal';
            modal.mostrarCompletado(
                estado.nivelActual,
                tiempoFinal,
                estado.dificultadActual,
                estado.contadorMovimientos
            );
            gestorRotacion.redibujarImagen();
        }, 2000);
    }

    function nivelFallido() {
        estado.actual = 'modal';
        audio.reproducir('nivelFallido');

        modal.mostrarFallido(estado.nivelActual);
        if (gestorRotacion) {
            gestorRotacion.redibujarImagen();
        }
    }

    function reiniciarNivel() {
        if (estado.actual !== 'jugando') return;
        estado.actual = 'seleccionando';

        iniciarSeleccionYNivel(estado.nivelActual);
    }

    function usarAyudita() {
        if (!gestorRotacion || estado.actual !== 'jugando') return;

        if (!estado.ayuditaHabilitada) {
            audio.reproducir('nivelFallido');
            return;
        }

        const malPosicionados = gestorRotacion.obtenerCantidadMalPosicionados();
        if (malPosicionados === 0) {
            return;
        }

        estado.tiempoActual += PENALIZACION_AYUDITA;
        estado.contadorAyudas++;

        hud.actualizarTiempo(estado.tiempoActual, estado.tieneTimerLimite, estado.tiempoLimiteNivel);
        audio.reproducir('ayudita');
        gestorRotacion.ayudita();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const gameLauncher = document.querySelector('.gameLauncher'); // ✅ Cambio aquí
    let juegoInicializado = false;

    if (!gameLauncher) { // ✅ Validación
        console.error('No se encontró el elemento .gameLauncher');
        return;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (gameLauncher.classList.contains('active') && !juegoInicializado) { // ✅ Cambio aquí
                    juegoInicializado = true;
                    inicializarJuego();
                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(gameLauncher, { attributes: true }); // ✅ Cambio aquí
});