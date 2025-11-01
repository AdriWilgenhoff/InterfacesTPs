# Sistema de Carga de Imágenes con Flag Manual - TableroView.js

## ¿Cómo funciona?

### 1. **Inicialización (Constructor)**
```javascript
this.imagenesListas = false;  // Flag inicialmente en false
this.imgCeldaInactiva = null;
this.imgCeldaVacia = null;
this.imgCeldaConFicha = null;

this.precargarImagenes();  // Inicia carga asíncrona (NO se espera)
```

### 2. **Carga Asíncrona en Paralelo**
```javascript
async precargarImagenes() {
    const imagenes = await cargarImagenes([...]);
    this.imgCeldaInactiva = imagenes[0];
    this.imagenesListas = true;  // ✓ Flag activado cuando termina
}
```

### 3. **Renderizado con Polling Manual**
```javascript
renderizarTablero(modelo) {
    if (valor === -1) {
        if (this.imagenesListas && this.imgCeldaInactiva) {
            // ✓ Dibujar imagen
            this.ctx.drawImage(this.imgCeldaInactiva, x, y, w, h);
        } else {
            // ⏳ Mostrar fallback mientras carga
            this.ctx.fillStyle = '#121414ff';
            this.ctx.fillRect(x, y, w, h);
        }
    }
}
```

## Timeline de Ejecución

```
T=0ms    Constructor → precargarImagenes() inicia
         imagenesListas = false
         ↓
T=10ms   render() llamado → imagenesListas = false
         → Dibuja color fallback (#121414ff)
         ↓
T=100ms  precargarImagenes() termina
         imagenesListas = true ✓
         ↓
T=110ms  render() llamado nuevamente
         → imagenesListas = true ✓
         → Dibuja imagen correctamente
```

## Ventajas del Sistema

✅ **Sin callbacks**: No requiere `.then()` ni callbacks
✅ **Sin bloqueo**: La carga no detiene el programa
✅ **Graceful degradation**: Muestra fallback mientras carga
✅ **Auto-actualización**: El loop de render revisa constantemente el flag

## Métodos Públicos

```javascript
estanImagenesListas() → boolean
// Permite verificar externamente si las imágenes están listas
```

## Cómo Usar en Otros Componentes

Para usar este patrón en MenuView, ModalView, etc:

1. Agregar flag: `this.imagenesListas = false`
2. Cargar en constructor: `this.precargarImagenes()`
3. Activar flag al terminar: `this.imagenesListas = true`
4. Revisar en render: `if (this.imagenesListas && this.imagen)`
