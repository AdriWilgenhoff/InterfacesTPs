# 🎮 PEG SOLITAIRE - GUÍA DE IMPLEMENTACIÓN COMPLETA (Una Iteración)

## 📋 ÍNDICE
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Arquitectura con AppState](#arquitectura-con-appstate)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Orden de Implementación](#orden-de-implementación)
5. [Especificaciones Técnicas por Archivo](#especificaciones-técnicas-por-archivo)
6. [Reglas del Juego](#reglas-del-juego)
7. [Recursos y Assets](#recursos-y-assets)
8. [Checklist de Validación](#checklist-de-validación)

---

## 🎯 DESCRIPCIÓN DEL PROYECTO

### Objetivo
Desarrollar un juego de **Peg Solitaire** completo utilizando JavaScript y Canvas, con arquitectura **MVC + AppState** (sin callbacks entre controladores), código orientado a objetos comprensible para estudiantes.

### Características Principales
- ✅ Pantalla de inicio con selección de tablero (4 tipos) y fichas (4 estilos)
- ✅ Sistema de drag and drop fluido para mover fichas 
- ✅ Renderizado con imágenes reales (no colores planos)
- ✅ HUD con temporizador en tiempo real, contador de movimientos y fichas
- ✅ Botones funcionales (Home, Reiniciar)
- ✅ Modal de victoria/derrota con estadísticas finales
- ✅ Animaciones suaves de movimiento y retorno
- ✅ multiples tipos de tablero(english, european, Square49,Diamon25);
- ✅ Estado centralizado (AppState) - **SIN CALLBACKS**
    

### Restricciones Técnicas Obligatorias
- ❌ NO usar programación funcional avanzada (map, filter, reduce)
- ❌ NO usar callbacks entre controladores
- ❌ NO usar arrow functions complejas o promesas anidadas
- ✅ Usar ciclos for tradicionales
- ✅ Código claro, comentado y didáctico
- ✅ Métodos pequeños con responsabilidad única
- ✅ Nombres de variables descriptivos en español

### Dimensiones del Canvas
```javascript
const DIMENSIONES = {
    canvasWidth: 900,
    canvasHeight: 475,
    tableroWidth: 600,
    tableroHeight: 600,
    tamanioCelda: 80,
    tamanioFicha: 70
};
```

---

## 🏗️ ARQUITECTURA CON APPSTATE

### **NUEVA ARQUITECTURA: Estado Centralizado**

**Problema resuelto:** Eliminamos callbacks entre `MenuController` ↔ `GameController`

**Solución:** Clase `AppState` como única fuente de verdad

```
┌─────────────────────────────────────────────────────┐
│                    main.js (MainApp)                │
│              Observa y coordina todo                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │    AppState     │ ◄── Estado centralizado
         │                 │     • estadoActual: 'menu' | 'jugando'
         │  - estado       │     • configuracionJuego: Object
         │  - config       │     • controladorActual: ref
         │  - controlador  │
         └────┬────────┬───┘
              │        │
      ┌───────┘        └────────┐
      ▼                         ▼
┌─────────────┐         ┌──────────────┐
│MenuController│        │GameController│
│             │         │              │
│ appState.   │         │ appState.    │
│ cambiarAJuego()       │ cambiarAMenu()│
└─────────────┘         └──────────────┘
```

### Flujo sin Callbacks

**Menu → Juego:**
```javascript
// 1. Usuario hace click en "Comenzar"
MenuController.comenzarJuego() {
    const config = this.menuView.obtenerConfiguracion();
    this.appState.cambiarAJuego(config); // ← Cambia estado
}

// 2. main.js detecta cambio
MainApp.verificarCambiosEstado() {
    if (appState.getEstadoActual() === 'jugando') {
        this.crearGameController(appState.getConfiguracion());
    }
}
```

**Juego → Menu:**
```javascript
// 1. Usuario hace click en Home o Modal
GameController.volverAlMenu() {
    this.appState.cambiarAMenu(); // ← Cambia estado
}

// 2. main.js detecta cambio
MainApp.verificarCambiosEstado() {
    if (appState.getEstadoActual() === 'menu') {
        this.crearMenuController();
    }
}
```

### Responsabilidades por Capa

**AppState** (Estado)- Mantiene el estado actual de la aplicación
- Guarda la configuración del juego
- Proporciona métodos para cambiar entre estados
- No contiene lógica de juego ni renderizado

**MainApp (main.js)** (Coordinador)
- Crea instancia única de AppState
- Observa cambios de estado en loop
- Crea/destruye controladores según el estado
- No maneja eventos directamente

**Modelo** (TableroModel)
- Lógica pura del juego
- Validación de movimientos
- Detección de victoria/derrota
- No conoce Canvas ni vistas

**Vistas** (MenuView, TableroView, FichaView, HudView, ModalView)
- Solo renderizado en Canvas
- Reciben datos como parámetros
- No contienen lógica de juego
- Retornan información de clicks/posiciones

**Controladores** (MenuController, GameController)
- Coordinan Modelo y Vistas
- Manejan eventos del usuario
- Modifican AppState para cambiar de pantalla
- Implementan método `destruir()` para limpieza

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
TP4/js/peg/
│
├── constants.js           # ✅ YA EXISTE - Definiciones de tableros e imágenes
├── utils.js               # 🔨 IMPLEMENTAR - Funciones auxiliares
├── AppState.js            # 🔨 IMPLEMENTAR - Estado centralizado (NUEVO)
├── main.js                # 🔨 IMPLEMENTAR - Coordinador principal
│
├── TableroModel.js        # 🔨 IMPLEMENTAR - Lógica del juego
│
├── MenuView.js            # 🔨 IMPLEMENTAR - Vista del menú
├── TableroView.js         # 🔨 IMPLEMENTAR - Vista del tablero
├── FichaView.js           # 🔨 IMPLEMENTAR - Vista de fichas
├── HudView.js             # 🔨 IMPLEMENTAR - Vista del HUD
├── ModalView.js           # 🔨 IMPLEMENTAR - Vista de modales
│
├── MenuController.js      # 🔨 IMPLEMENTAR - Controlador del menú
├── GameController.js      # 🔨 IMPLEMENTAR - Controlador del juego
│
└── readme2.md             # 📄 ESTE ARCHIVO

assets_peg/
├── bugs/
│   ├── ficha1.jpg
│   ├── ficha2.png
│   ├── ficha3.png
│   └── ficha4.png
├── board/
│   ├── celda.png
│   ├── fondo.png
│   └── celda_invalida.png
├── icons/
│   ├── home.png
│   ├── reiniciar.png
│   ├── victoria.png
│   └── derrota.png
└── menu/
    └── logo.png
```

---

## 🔢 ORDEN DE IMPLEMENTACIÓN

**Implementar en este orden exacto para evitar dependencias circulares:**

### 1️⃣ UTILIDADES (sin dependencias)
- `constants.js` - ✅ Ya existe
- `utils.js`

### 2️⃣ ESTADO (depende solo de utils)
- `AppState.js`

### 3️⃣ MODELO (depende de constants)
- `TableroModel.js`

### 4️⃣ VISTAS (dependen de constants y utils)
- `FichaView.js` (base, no depende de otras vistas)
- `TableroView.js` (usa FichaView)
- `MenuView.js`
- `HudView.js`
- `ModalView.js`

### 5️⃣ CONTROLADORES (dependen de todo lo anterior)
- `MenuController.js` (usa MenuView y AppState)
- `GameController.js` (usa todas las vistas, modelo y AppState)

### 6️⃣ COORDINADOR (usa AppState y controladores)
- `main.js`

---

## 📝 ESPECIFICACIONES TÉCNICAS 
classDiagram
    %% === ESTADO CENTRALIZADO (NUEVO) ===
    class AppState {
        -estadoActual: string
        -configuracionJuego: Object
        -canvas: HTMLCanvasElement
        -controladorActual: Object
        +constructor(canvas)
        +inicializar()
        +getEstadoActual() string
        +getConfiguracion() Object
        +cambiarAMenu()
        +cambiarAJuego(config)
        +limpiarControladorActual()
        +actualizarEstado()
    }

    %% === COORDINADOR PRINCIPAL ===
    class MainApp {
        <<module>>
        -appState: AppState
        -canvas: HTMLCanvasElement
        +inicializarAplicacion()
        +verificarCambiosEstado()
        +crearMenuController()
        +crearGameController(config)
        +iniciarLoopPrincipal()
    }

    %% === MODELO ===
    class TableroModel {
        -tablero: Array~Array~
        -tableroInicial: Array~Array~
        -tipoTablero: string
        -movimientosRealizados: number
        -fichasRestantes: number
        -juegoTerminado: boolean
        +constructor(tipoTablero)
        +inicializarTablero(tipoTablero)
        +contarFichas() number
        +esPosicionValida(fila, col) boolean
        +hayFicha(fila, col) boolean
        +estaVacio(fila, col) boolean
        +esMovimientoValido(f1, c1, f2, c2) boolean
        +realizarMovimiento(f1, c1, f2, c2)
        +verificarVictoria() boolean
        +verificarDerrota() boolean
        +obtenerMovimientosPosibles(fila, col) Array
        +existeMovimientoValido() boolean
        +reiniciar()
        +obtenerEstadisticas() Object
    }

    %% === VISTAS ===
    class MenuView {
        -canvas: HTMLCanvasElement
        -ctx: CanvasRenderingContext2D
        -opciones: Object
        -selectorTablero: Array
        -selectorFicha: Array
        -botonComenzar: Object
        +constructor(canvas)
        +inicializar()
        +renderizar()
        +detectarClickTablero(x, y) string
        +detectarClickFicha(x, y) number
        +detectarClickComenzar(x, y) boolean
        +obtenerConfiguracion() Object
    }

    class TableroView {
        -canvas: HTMLCanvasElement
        -ctx: CanvasRenderingContext2D
        -tamanioCelda: number
        -fichasView: Array~FichaView~
        +constructor(canvas, anchoTablero, altoTablero)
        +calcularDimensiones()
        +renderizarTablero(modelo)
        +renderizarFichas(modelo)
        +crearFichas(modelo, imagenFicha)
        +mostrarMovimientosPosibles(movimientos)
        +obtenerPosicionTablero(x, y) Object
        +obtenerCoordenadasPixeles(fila, col) Object
        +actualizar(modelo)
    }

    class FichaView {
        -imagen: Image
        -fila: number
        -col: number
        -x: number
        -y: number
        -arrastrando: boolean
        -seleccionada: boolean
        +constructor(fila, col, imagen, tamanio)
        +setPosicion(x, y)
        +iniciarArrastre(mouseX, mouseY)
        +actualizarArrastre(mouseX, mouseY)
        +finalizarArrastre()
        +retornarPosicionInicial()
        +moverAPosicion(x, y, fila, col)
        +contienePoint(x, y) boolean
        +dibujar(ctx)
    }

    class HudView {
        -canvas: HTMLCanvasElement
        -ctx: CanvasRenderingContext2D
        -tiempoInicio: number
        -movimientos: number
        -fichasRestantes: number
        -botonHome: Object
        -botonReiniciar: Object
        +constructor(canvas, iconos)
        +iniciarTemporizador()
        +detenerTemporizador()
        +actualizarMovimientos(cantidad)
        +actualizarFichasRestantes(cantidad)
        +renderizar()
        +detectarClickBoton(x, y) string
        +reiniciar()
    }

    class ModalView {
        -canvas: HTMLCanvasElement
        -visible: boolean
        -tipoModal: string
        -tiempo: number
        -movimientos: number
        -fichasRestantes: number
        +constructor(canvas, imagenes)
        +mostrarVictoria(tiempo, mov, fichas)
        +mostrarDerrota(tiempo, mov, fichas)
        +ocultar()
        +renderizar()
        +detectarClickBoton(x, y) string
    }

    %% === CONTROLADORES ===
    class MenuController {
        -canvas: HTMLCanvasElement
        -menuView: MenuView
        -appState: AppState
        -eventListeners: Array
        +constructor(canvas, appState)
        +inicializar()
        +configurarEventos()
        +manejarClick(event)
        +seleccionarTablero(tipo)
        +seleccionarFicha(indice)
        +comenzarJuego()
        +destruir()
    }

    class GameController {
        -canvas: HTMLCanvasElement
        -modelo: TableroModel
        -vistaTablero: TableroView
        -vistaHud: HudView
        -vistaModal: ModalView
        -appState: AppState
        -fichaArrastrada: FichaView
        -juegoActivo: boolean
        -eventListeners: Array
        +constructor(canvas, config, appState)
        +inicializar()
        +configurarEventos()
        +manejarMouseDown(event)
        +manejarMouseMove(event)
        +manejarMouseUp(event)
        +manejarClickHud(event)
        +volverAlMenu()
        +reiniciarPartida()
        +verificarEstadoJuego()
        +actualizar()
        +destruir()
    }

    %% === UTILIDADES ===
    class Utils {
        <<module>>
        +cargarImagen(src) Promise~Image~
        +cargarImagenes(array) Promise~Array~
        +puntoEnRectangulo(x, y, rect) boolean
        +dibujarTextoCentrado(ctx, texto, x, y)
    }

    class Constants {
        <<module>>
        +BOARDS: Object
        +BUG_IMAGES: Array~string~
    }

    %% === RELACIONES PRINCIPALES ===
    
    %% MainApp coordina todo
    MainApp --> AppState : crea y observa
    MainApp ..> MenuController : crea cuando estado='menu'
    MainApp ..> GameController : crea cuando estado='jugando'
    
    %% AppState es el centro de comunicación
    AppState --> MenuController : referencia actual
    AppState --> GameController : referencia actual
    
    %% Controladores reciben AppState
    MenuController --> AppState : modifica estado
    GameController --> AppState : modifica estado
    
    %% Controladores usan Vistas
    MenuController --> MenuView : usa
    GameController --> TableroView : usa
    GameController --> HudView : usa
    GameController --> ModalView : usa
    GameController --> TableroModel : usa
    
    %% Vistas leen del Modelo
    TableroView ..> TableroModel : lee estado
    HudView ..> TableroModel : lee estadísticas
    ModalView ..> TableroModel : lee resultados
    
    %% TableroView gestiona FichaView
    TableroView --> FichaView : crea y gestiona
    GameController --> FichaView : arrastra
    
    %% Uso de módulos
    TableroModel ..> Constants : usa BOARDS
    MenuView ..> Constants : usa BOARDS y BUG_IMAGES
    GameController ..> Utils : usa cargarImagenes
    MenuView ..> Utils : usa cargarImagenes
    TableroView ..> Utils : usa utilidades
    
    %% === NOTAS EXPLICATIVAS ===
    note for AppState "ESTADO CENTRALIZADO
    
• Única fuente de verdad
• Sin callbacks entre controladores
• Estado: 'menu' | 'jugando'
• Mantiene referencia al controlador activo"
    
    note for MainApp "COORDINADOR PRINCIPAL (main.js)
    
• Observa cambios en AppState
• Crea/destruye controladores según estado
• Loop principal de verificación
• Inicializa la aplicación"
    
    note for MenuController "CONTROLADOR DE MENÚ
    
• Recibe AppState en constructor
• Al comenzar: appState.cambiarAJuego(config)
• Limpia sus propios eventos con destruir()"
    
    note for GameController "CONTROLADOR DE JUEGO
    
• Recibe AppState en constructor
• Botón Home: appState.cambiarAMenu()
• Modal: appState.cambiarAMenu()
• Limpia eventos y timers con destruir()"

    %% === FLUJO DE NAVEGACIÓN ===
    note for AppState "FLUJO SIN CALLBACKS:

1. Usuario en menú selecciona config
2. MenuController → appState.cambiarAJuego(config)
3. MainApp detecta cambio de estado
4. MainApp → destruye MenuController
5. MainApp → crea GameController(config)

6. Usuario presiona Home en juego
7. GameController → appState.cambiarAMenu()
8. MainApp detecta cambio de estado
9. MainApp → destruye GameController
10. MainApp → crea MenuController"



## <� REGLAS DEL JUEGO

### Reglas B�sicas del Peg Solitaire
1. El tablero comienza lleno de fichas excepto una posici�n central vac�a
2. Un movimiento v�lido consiste en:
   - Seleccionar una ficha
   - Saltar sobre una ficha adyacente (horizontal o vertical, no diagonal)
   - Caer en un espacio vac�o exactamente despu�s de la ficha saltada
   - La ficha saltada se elimina del tablero

3. **Victoria:** Queda solo una ficha en el tablero (idealmente en el centro)
4. **Derrota:** Quedan fichas pero no hay movimientos posibles

### Ejemplo de Movimiento V�lido
```
Antes:              Despu�s:
  1                   0
  1        �          0
  0                   1
```
La ficha superior salta la intermedia y llega al espacio vac�o.

### Movimientos Inv�lidos
- L Saltar diagonalmente
- L Mover a un espacio ocupado
- L Saltar m�s de una ficha
- L Mover sin saltar ninguna ficha
- L Mover una ficha que no existe

---

## =� RECURSOS NECESARIOS

### Im�genes Obligatorias
**Fichas** (ya existen):
- `assets/bugs/ficha1.jpg`
- `assets/bugs/ficha2.png`
- `assets/bugs/ficha3.png`
- `assets/bugs/ficha4.png`

**Tablero** (crear):
- `assets/board/celda.png` - Textura de celda v�lida (circular u ovalada)
- `assets/board/fondo.png` - Fondo del tablero (madera, textura) - podria ser un canvas con background animado en el futuro. 
- `assets/board/celda_invalida.png` - (opcional) �reas no jugables

**Iconos** (crear):
- `assets/icons/home.png` - Icono de casa
- `assets/icons/reiniciar.png` - Icono de reiniciar (flechas circulares)
- `assets/icons/victoria.png` - Trofeo o estrella
- `assets/icons/derrota.png` - Cruz o cara triste

**Men�** (crear):
- `assets/menu/logo.png` - Logo del juego (opcional)

### Dimensiones Recomendadas
- Canvas: 900 x 475 (esta descripto en el archivo html game.html linea 362)
- Tablero: 600x600 p�xeles (centrado)
- Fichas: 70x70 p�xeles (redondas)
- Celdas: 80x80 p�xeles 
- Iconos: 32x32 p�xeles
- HUD: calcular en base al layout definido mas arriba. 

### Colores Recomendados
```javascript
const COLORES = {
    fondo: '#2C3E50', 
    tablero: '#34495E',
    celdaValida: '#ECF0F1',
    celdaResaltada: '#F39C12',
    texto: '#ECF0F1',
    botonPrimario: '#3498DB',
    botonHover: '#2980B9',
    overlay: 'rgba(0, 0, 0, 0.7)',
    exito: '#27AE60',
    error: '#E74C3C'
};
```

---

## >� TESTING Y VALIDACI�N

### Por Iteraci�n
Cada iteraci�n debe  ser comprendida antes de pasar a la siguiente, pero el programa se construye todo junto una vez entendida la consigna


## =� REFERENCIAS Y RECURSOS ADICIONALES

### Canvas API
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [MDN CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)

### Peg Solitaire
- [Wikipedia - Peg Solitaire](https://en.wikipedia.org/wiki/Peg_solitaire)
- Reglas y estrategias del juego

### JavaScript
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Classes en JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

### Patr�n MVC
- [MVC Pattern Explained](https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/)

---


## <� CONCLUSI�N

Este README proporciona una gu�a completa para desarrollar el juego **Peg Solitaire** por iteraciones incrementales. Siguiendo el orden propuesto, construir�s un proyecto profesional con arquitectura MVC, c�digo limpio y mantenible.

### Principios Clave
1. evitar uso de programacion funcional, callbacks o codigo avanzado, que el codigo sea comprensible yorientado a objetos para estudiantes
3. **C�digo claro** - Preferir legibilidad sobre brevedad
4. **Separaci�n de responsabilidades** - Modelo, Vista y Controlador bien diferenciados
