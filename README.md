# Proyecto de Juego de Memoria - Demon Slayer

Este proyecto es un juego de memoria interactivo basado en Demon Slayer, desarrollado utilizando tecnologías web como HTML, CSS y JavaScript. El juego tiene un temporizador, modales para indicar si el jugador ganó o perdió, y un video de fondo autoplay.

## Descripción

El juego de memoria consiste en un tablero con cartas que el jugador debe voltear para emparejar imágenes relacionadas con los personajes de Demon Slayer. Hay un temporizador de 60 segundos que limita el tiempo para completar el juego, y al final, se muestra un modal que indica si el jugador ha ganado o perdido.

### Características:
- Video de fondo autoplay (Demon Slayer).
- Juego con cartas que se voltean.
- Temporizador de 60 segundos.
- Modales para indicar el resultado (Ganador o Game Over).
- Funcionalidad responsive.
- Opción para reiniciar o cerrar el juego desde los modales.

---

## Archivos del Proyecto

### 1. `index.html`

El archivo principal que contiene la estructura del juego.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego de Memoria - Demon Slayer</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><text x='10' y='40' font-size='40'>🚗</text></svg>" type="image/svg+xml">
</head>
<body>
    <div id="game-container">
        <h1>Juego de Memoria - Demon Slayer</h1>
        <p id="timer">60</p>
        <div id="gameBoard"></div>
        <div id="modal" class="hidden">
            <p id="modal-text"></p>
            <button id="restart">Reiniciar</button>
            <button id="close">Cerrar</button>
        </div>
        <video id="background-video" autoplay muted loop>
            <source src="demonslayer.mp4" type="video/mp4">
        </video>
    </div>
    <script src="script.js"></script>
</body>
</html>
