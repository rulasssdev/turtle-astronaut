# De aquí a Neptuno

Primero recibe un ramo de flores en pixel art. Luego una tortuga camina de la Tierra a Neptuno, un planeta por toque, y en cada parada deja una frase. Al llegar abre el caparazón: "Te quiero de aquí a Neptuno, a pasitos de tortuga.", y al final queda un último mensaje antes de volver al inicio.

Sitio estático (HTML, CSS y JavaScript sin frameworks ni dependencias), listo para GitHub Pages.

## Verlo en tu compu

Los módulos de JavaScript no cargan si abres `index.html` con doble clic, así que hay un servidor local incluido:

```bash
npm start
```

Abre http://localhost:5173. Necesitas Node 20 o más reciente; no hay nada que instalar.

## Qué editar

Todo el contenido está en `js/content/`, separado del código:

| Archivo | Qué cambia |
| --- | --- |
| `js/content/messages.js` | Títulos, botones, la frase final y la firma |
| `js/content/journey-stops.js` | Las paradas del viaje y la frase de cada planeta |
| `js/content/people.js` | Cómo se ven ustedes dos: peinado, sonrisa, accesorios y colores (pelo, piel, ojos, ropa) |

Si cambias `people.js`, regenera la imagen del preview de WhatsApp y el favicon para que coincidan:

```bash
npm run build:images
```

### Agregar cosas

- **Otro peinado, sonrisa o accesorio:** agrega una entrada en `HAIR_STYLES`, `MOUTH_STYLES` o `ACCESSORIES` de `js/sprites/character-layers.js` (filas de 16 caracteres, la leyenda está arriba del archivo) y usa su nombre en `people.js`.
- **Otra flor en el ramo:** agrega una entrada en `BLOOMS` de `js/sprites/bouquet-sprite.js` con su tipo (`gerbera`, `rose`, `lily`, `hydrangea`), posición, tamaño y colores.
- **Otra parada:** agrega un planeta en `PLANETS` (`js/sprites/planet-sprite.js`) y una entrada en `journey-stops.js`. La ruta, los botones y la barra de progreso se ajustan solos.

## Pruebas

```bash
npm test
```

Revisan que todos los sprites tengan el tamaño correcto, que cada parada tenga su planeta y que el viaje avance, termine y se reinicie bien.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `de-aqui-a-neptuno`). Puede ser público; GitHub Pages gratis requiere que lo sea.
2. En `index.html`, cambia `TU-USUARIO` y `TU-REPO` en la línea de `og:image` por tu usuario y el nombre del repo. Sin esto, WhatsApp no muestra la imagen del preview.
3. En esta carpeta:

   ```bash
   git init
   git add .
   git commit -m "De aquí a Neptuno"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```

4. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`, y **Save**.
5. En uno o dos minutos queda en `https://TU-USUARIO.github.io/TU-REPO/`.

WhatsApp guarda en caché los previews. Si mandaste el link antes de arreglar `og:image`, puede tardar en actualizarse.

## Estructura

```
index.html              estructura de las tres escenas
css/                    tokens (colores, tamaños), base, componentes y escenas
js/main.js              arranque y estado de error
js/app.js               cambia entre escenas y conecta el viaje con la interfaz
js/content/             textos, paradas y apariencia (lo que se edita)
js/journey/             estado del viaje, sin DOM (se prueba en Node)
js/pixel-art/           cuadrículas de pixeles y su dibujo en SVG
js/sprites/             personajes, tortuga, planetas y corazones
js/scenes/              intro, viaje y llegada
js/ui/                  utilidades de DOM, movimiento, estrellas y corazones
tools/                  servidor local y generador de imágenes PNG
tests/                  pruebas con node:test
```

## Efectos

- **Cielo:** estrellas que titilan, destellos en cruz y una estrella fugaz cada pocos segundos (`js/ui/starfield.js`).
- **Personajes y planetas:** los personajes rebotan un pixel como en un videojuego, y el planeta de cada parada levita (`css/components.css`).
- **Ruta:** los planetas van en arco alrededor del sol y la tortuga sigue la curva (`js/journey/route-geometry.js`).
- **Pantallas:** cada una entra por partes y sale antes de mostrar la siguiente (`js/ui/scene-transitions.js`).

Todos los sprites llevan un contorno oscuro y, los personajes y la tortuga, un segundo borde azul para que se distingan del fondo. Ese contorno se genera solo (`addOutline` en `js/pixel-art/sprite-grid.js`).

La página respeta la opción de "reducir movimiento" del sistema: se apagan todas las animaciones y la tortuga avanza sin caminar.
